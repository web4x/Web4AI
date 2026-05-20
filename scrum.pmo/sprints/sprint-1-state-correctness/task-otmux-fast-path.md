[Back to Sprint Planning](./planning.md)

# Task: otmux Fast Path Architecture

## Problem
`otmux` (no args) takes **46.8 seconds**. This is the default command — every time a user types `otmux` to see session state, they wait 47 seconds.

## Root Cause: Per-Pane Claude Process Detection

`otmux` → `otmux.status()` → `otmux.tree()` → for EVERY pane where `pane_current_command` is `bash` or `zsh`:

```bash
# Line 2254: subprocess 1
claudeCode process.running "$pane_target"   # ~400ms (sources oosh bootstrap)

# Line 2256: subprocess 2
claudeCode version "$pane_target"           # ~400ms (sources oosh bootstrap)
```

**Cost:** 2 subprocess calls × ~60 panes = ~120 invocations × 0.4s = **48 seconds**

Each `claudeCode` call:
1. Sources `this` (OOSH kernel bootstrap) — ~100ms
2. Resolves method dispatch — ~50ms
3. Finds tmux pane PID via `tmux list-panes` + `pgrep` — ~100ms
4. For `version`: reads process args or captures pane output — ~150ms

`tree.detailed` is even worse — adds `hiveMind protected.agents.discover` per session AND `find ~/.claude/projects -name "${sid}.jsonl"` per Claude pane.

## Analysis: What Info Is Actually Needed

### Default view (`otmux` no args) — user wants:
1. Session names
2. Which sessions are attached
3. Pane count per session
4. Pane titles (already set by hiveMind)

**None of this requires Claude process detection.** tmux already has all of it via `list-sessions` and `list-panes`. Zero subprocess calls needed.

### Tree view (`otmux tree`) — user wants above plus:
5. Per-pane: address, title, current command
6. Whether Claude is running (bash vs [2.1.143])

**The Claude version detection is the ONLY expensive part.** And pane titles already show the agent role name — set by hiveMind during bootstrap. The `[2.1.143]` version is nice-to-have, not essential.

### Detailed view (`otmux tree.detailed`) — user wants above plus:
7. Session UUID per Claude pane
8. Model (opus/sonnet/haiku)
9. hiveMind discover data

**This IS expensive and should remain so.** It's the "give me everything" command.

## Proposed Architecture: 3-Tier Speed

### Tier 1: `otmux` (no args) — FAST (<0.5s)
**Show sessions + pane counts only. Zero subprocess calls.**

```bash
otmux.status() {
  tmux list-sessions -F "#{session_name}|#{session_attached}|#{session_windows}" | 
  while read ...; format session list
}
```

Pure tmux queries. Target: <0.5s.

### Tier 2: `otmux tree <?session>` — MEDIUM (<2s)
**Show full tree with pane titles + current command. No Claude detection.**

```bash
otmux.tree() {
  # Session + pane listing (same as current BUT skip lines 2252-2259)
  # Show pane_current_command as-is: "bash", "zsh", "claude" (NOT version)
  # Pane titles already show role names from hiveMind
}
```

Pure tmux queries. The `pane_current_command` field already shows `claude` for running Claude instances (when tmux can see the process name). No need to call `claudeCode process.running`. Target: <2s.

### Tier 3: `otmux tree.detailed <?session>` — SLOW (current behavior)
**Full Claude detection + session UUIDs + model info. Expensive by design.**

Keep current implementation. User explicitly opts into the wait.

## Key Insight: Pane Title IS the Cache

hiveMind already sets pane titles during agent bootstrap:
```bash
tmux select-pane -t "$pane" -T "$role_name"
```

So `pane_title` = role name (e.g., "oosh-expert", "web4-tester"). This is **already the MVC state** — the Controller (hiveMind) wrote it to the View (otmux pane title). Reading it back is free (`list-panes -F #{pane_title}`).

The Claude version detection in `otmux.tree` is **redundant with the pane title**. If the title says "oosh-expert", we already know Claude is running. The exact version `[2.1.143]` adds no actionable information.

## Status Indicator Alternative

Instead of detecting Claude version per-pane (expensive), use tmux's built-in `pane_current_command`:

| pane_current_command | Meaning | Display |
|---------------------|---------|---------|
| `bash` or `zsh` | Shell only, no Claude | `[bash]` or `[zsh]` |
| `claude` | Claude running | `[claude]` |
| `node` | Node.js (possibly Claude) | `[node]` |
| `screen` | Screen (tronMonitor) | `[screen]` |

tmux already tracks this. Zero subprocess cost.

## Implementation Plan

### Step 1: New `otmux.status()` — fast session list
Replace current `otmux.status()` (which calls `otmux.tree`) with a minimal session listing. ~20 lines.

### Step 2: Strip Claude detection from `otmux.tree()`
Remove lines 2252-2259 (the `claudeCode process.running` + `claudeCode version` block). Use `pane_current_command` as-is. Saves 120 subprocess calls.

### Step 3: Keep `otmux.tree.detailed()` unchanged
The slow path stays for users who need full MVC state.

### Step 4: Update `otmux.start()` default
```bash
otmux.start() {
  source this
  if [ -z "$1" ]; then
    otmux.status   # fast path — session list only
    return 0
  fi
  this.start "$@"
}
```

## Expected Performance

| Command | Current | Proposed | Speedup |
|---------|---------|----------|---------|
| `otmux` (no args) | 46.8s | <0.5s | **94x** |
| `otmux tree` | 46.8s | <2s | **23x** |
| `otmux tree <session>` | ~5s | <0.5s | **10x** |
| `otmux tree.detailed` | ~60s+ | ~60s (unchanged) | 1x |

## Expert Questions

1. Does `pane_current_command` reliably show `claude` for Claude Code instances, or does it show `bash` because Claude runs as a child process of bash? If the latter, we may need ONE bulk `pgrep` call instead of per-pane `claudeCode process.running`.

2. Is there a way to get Claude version from the tmux environment without spawning a subprocess? (e.g., `tmux show-environment -t $pane CLAUDE_VERSION` if the agent sets it)

3. Can hiveMind store the Claude version in the pane title? e.g., title = "oosh-expert@2.1.143" — set once at bootstrap, free to read.

---

## Expert Measurements (confirmed)

| Call | Cost | Count | Total |
|------|------|-------|-------|
| `claudeCode process.running <pane>` | 0.67s | 75 panes | ~50s |
| `claudeCode version <pane>` | 0.12s | ~10 Claude panes | ~1.2s |
| `hiveMind protected.agents.discover <session>` | 57.9s | per session | KILLER for tree.detailed |

Breakdown of `process.running` cost:
- `otmux pane.get <pane> tty` = ~200ms (full OOSH bootstrap subprocess)
- `ps -eo pid,tty,args | grep` = ~50ms (full process table scan)

## Architect Decision: A+B+C+D — All Four Fixes

All four are orthogonal, intra-call-only caching, and composable. Ship them all.

### Fix A: BATCH TTY MAP (saves ~15s)
At top of `tree()`, ONE tmux call builds pane→tty associative array:
```bash
declare -A TTY_MAP
while IFS='|' read -r pane tty; do
  TTY_MAP["$pane"]="$tty"
done < <(tmux list-panes -aF '#{session_name}:#{window_index}.#{pane_index}|#{pane_tty}')
```
Eliminates 75× `otmux pane.get` subprocess calls.

### Fix B: BATCH PS MAP (saves ~5s)
At top of `tree()`, ONE ps call builds tty→pid+version map:
```bash
declare -A CLAUDE_PID_MAP
while read pid tty args; do
  [[ "$args" == *claude* ]] && CLAUDE_PID_MAP["$tty"]="$pid"
done < <(ps -eo pid,tty,args)
```
Per-pane lookup becomes `${CLAUDE_PID_MAP[${TTY_MAP[$pane]}]}` — O(1).

### Fix C: VERSION CACHE (saves 0.12s × N)
```bash
CLAUDE_VERSION=$(claude --version 2>/dev/null | head -1)
CLAUDE_VERSION="${CLAUDE_VERSION%% (*}"
```
All Claude panes show same version. ONE call, cached.

### Fix D: DISCOVER CACHE for tree.detailed (saves minutes)
Move `hiveMind protected.agents.discover` OUTSIDE the session loop. Call ONCE with no session filter, build session→data map:
```bash
local all_discover
all_discover=$(hiveMind protected.agents.discover 2>/dev/null)
# Per-session: filter from all_discover instead of calling again
```
57s × N sessions → 57s total (or less if discover itself is batched internally).

### Invariant
All caches are **intra-call only** — declared at top of `tree()`/`tree.detailed()`, destroyed on return. No stale state across calls.

## Estimated Result

| Command | Before | After A+B+C+D | Speedup |
|---------|--------|---------------|---------|
| `otmux` (no args) | 46.8s | <0.5s (Tier 1: session list only) | **94×** |
| `otmux tree` | 40.7s | ~1.5s (A+B+C) | **27×** |
| `otmux tree <session>` | ~5s | ~0.3s | **17×** |
| `otmux tree.detailed` | >60s | ~3-5s (A+B+C+D) | **12-20×** |

## Shape Sign-Off

**Architect approves all four fixes.** Expert: implement A+B first (biggest wins), then C+D. Ship as single commit per fix or bundle — your call.

---

**Architect:** oosh-architect @ ooshTeam:0.1
**Expert:** oosh-expert @ ooshTeam:0.2
**Profiled:** otmux (no args) = 46.8s, root cause = 75× claudeCode subprocess calls per tree render
