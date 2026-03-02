# Fix Task: Agent Identity Chain Alignment

**From**: oosh-tester (baseTeam:0.2)
**To**: oosh-expert (baseTeam:0.0) — principle review + claudeCode fixes
**Also to**: hiveMind-expert (hiveMindTeam:0.0) — hiveMind fixes (Bugs 3-6, 8-9)
**Date**: 2026-02-27
**Priority**: HIGH — this is the blocker for reliable agent identity

**Ownership split**: oosh-expert reviews architecture and owns `claudeCode` fixes (Bugs 1, 2, 7). hiveMind-expert owns `hiveMind` fixes (Bugs 3, 4, 5, 6, 8, 9). oosh-expert is the principle guard — reviews hiveMind-expert's changes for OOSH compliance.

---

## Problem Summary

The agent identity system has 4 layers that must stay aligned. Currently they drift apart after any agent restart, causing `session.id`, `tree.detailed`, and `hiveMind resolve` to return wrong data.

## The 4 Layers

```
Layer 1: Pane → Role       (~/config/hivemind.roles.env)
Layer 2: Role → UUID       (~/config/hivemind.sessions.env)
Layer 3: UUID → Name       (~/.claude/projects/*/sessions-index.json)
Layer 4: PID → UUID        (ps args: --resume <uuid>)
```

## Evidence from Live Audit (baseTeam:0.2 = my own pane)

```
Registry says:    oosh-tester
Sessions file:    oosh-tester|e93582de-...  (STALE — old session)
session.id:       e93582de-...              (WRONG — trusts stale sessions file)
ps shows:         claude --resume 6213b3dc-... (THIS is the real UUID)
```

**session.id returns the wrong UUID for my own pane.** Method 0 short-circuits with stale data before Method 1 (ps args) can find the truth.

## Root Causes (7 bugs)

### Bug 1: `session.id` Method 0 trusts stale files
**File**: `claudeCode` line 651-667
**Problem**: Method 0 (registry → sessions file → UUID) runs FIRST and returns stale UUIDs. It never checks if the UUID is still the one running in the pane.
**Fix**: Swap method priority. Try Method 1 (ps args) FIRST — it's ground truth when `--resume` was used. Fall back to Method 0 only when Method 1 has no result.

```
CURRENT ORDER:        CORRECT ORDER:
  Method 0 (registry)    Method 1 (ps --resume args)  ← ground truth
  Method 1 (ps args)     Method 0 (registry files)    ← fallback only
```

### Bug 2: `claudeCode.join` doesn't update sessions file
**File**: `claudeCode` line 170-179
**Problem**: When a session is resumed via `claudeCode join <uuid>`, the UUID is known but never written back to `hivemind.sessions.env`. So the sessions file keeps the OLD UUID.
**Fix**: After `claude --resume` is started, update the sessions file:
1. Detect the current pane's registry role
2. Write `role|uuid` to sessions file (replacing old entry)

```bash
claudeCode.join() {
  local session="$1"
  if [ -n "$session" ]; then
    shift
    # NEW: update sessions file with the UUID being resumed
    local pane_target
    pane_target=$(tmux display-message -p '#{session_name}:#{window_index}.#{pane_index}' 2>/dev/null)
    if [ -n "$pane_target" ]; then
      local reg="${HIVEMIND_REGISTRY:-${CONFIG_PATH:-$HOME/config}/hivemind.roles.env}"
      local ses="${HIVEMIND_SESSIONS:-${CONFIG_PATH:-$HOME/config}/hivemind.sessions.env}"
      local role
      role=$(grep "^${pane_target}|" "$reg" 2>/dev/null | cut -d'|' -f2)
      if [ -n "$role" ] && [ -n "$ses" ]; then
        grep -v "^${role}|" "$ses" > "${ses}.tmp" 2>/dev/null
        mv "${ses}.tmp" "$ses"
        echo "${role}|${session}" >> "$ses"
      fi
    fi
    "$CLAUDE_CMD" --resume "$session" "$@"
  else
    "$CLAUDE_CMD" --resume
  fi
}
```

### Bug 3: `agent.bootstrap` and `team.setup.full` don't register UUID
**File**: `hiveMind` lines 1498-1558, 1900-1985
**Problem**: These methods call `pane.identify` (writes registry role) then start `claude` (creates a NEW UUID). But nobody captures the new UUID and writes it to the sessions file. There's no feedback loop from claude startup back to the identity system.
**Fix**: After starting claude and waiting for init (the sleep 8), probe the session UUID and write it:

```bash
# After sleep 8 (claude initialized):
local new_sid
new_sid=$(claudeCode session.probe "$target_pane" 2>/dev/null)
if [ -n "$new_sid" ]; then
  local ses="${HIVEMIND_SESSIONS:-${CONFIG_PATH:-$HOME/config}/hivemind.sessions.env}"
  grep -v "^${role}|" "$ses" > "${ses}.tmp" 2>/dev/null
  mv "${ses}.tmp" "$ses"
  echo "${role}|${new_sid}" >> "$ses"
fi
```

### Bug 4: Registry contains boot prompt text as role names
**File**: `hiveMind` registry
**Problem**: Some registry entries have full boot prompt sentences as role names:
```
projectTeam:0.3|You are oosh-expert on projectTeam:0.1.
hiveMindTeam:0.0|Read .claude/agents/hiveMind-expert/SKIL
```
This happens when `pane.identify` receives the wrong argument, or when the pre-compact hook's fallback detection writes a pane title that IS the boot prompt.
**Fix**: Add validation to `registry.set`:
```bash
# In private.hiveMind.registry.set():
# Reject role names > 30 chars or containing spaces
if [ "${#role}" -gt 30 ] || echo "$role" | grep -q ' '; then
  warn.log "registry.set: rejecting invalid role name '$role' — too long or contains spaces"
  return 1
fi
```

### Bug 5: Stale registry entries for dead panes
**Problem**: When a tmux session is killed, its registry entries persist forever. `projectTeam:0.3`, `hiveMindTeam:0.0`, etc. still have entries even if those panes no longer exist.
**Fix**: Add cleanup to `registry.refresh` — before writing new entries, prune entries for panes that don't exist in tmux:
```bash
# At the start of registry.refresh():
# Prune entries for non-existent panes
if [ -f "$reg" ]; then
  local clean=""
  while IFS='|' read -r pt rl; do
    if tmux display-message -t "$pt" -p "#{pane_id}" >/dev/null 2>&1; then
      clean="${clean}${pt}|${rl}\n"
    fi
  done < "$reg"
  printf '%b' "$clean" > "$reg"
fi
```

### Bug 6: Multiple panes share same role→UUID mapping
**Problem**: `developer|5fff44f4` and `task-agent|5fff44f4` point to the same UUID. Panes 1.2, 1.3, and 1.4 all resolve to the same session. This is either a real duplicate session (two TUIs on one conversation = data corruption risk) or stale mappings.
**Fix**: `registry.refresh` should detect and flag when multiple panes resolve to the same UUID.

### Bug 7: `tree.detailed` depends on broken `session.id`
**File**: `otmux` line 1338
**Problem**: `tree.detailed` calls `session.id` which returns stale UUIDs (Bug 1). So the tree shows wrong UUIDs.
**Fix**: This is automatically fixed when Bug 1 is fixed (method priority swap).

## Fix Priority Order

1. **Bug 1** (session.id method swap) — highest impact, fixes tree.detailed too
2. **Bug 2** (claudeCode.join writes UUID) — prevents staleness for resumed sessions
3. **Bug 4** (registry.set validation) — prevents garbage entries
4. **Bug 5** (registry cleanup) — removes dead entries
5. **Bug 3** (bootstrap UUID capture) — prevents staleness for new sessions
6. **Bug 6** (duplicate detection) — safety warning
7. **Bug 7** (auto-fixed by Bug 1)

## Test Verification

Tests added to `test/test.claudeCode`:
- **T-ALIGN-1**: session.id matches --resume UUID from ps
- **T-ALIGN-2**: Registry role names are valid agent names (not boot prompt garbage)
- **T-ALIGN-3**: No duplicate role entries in sessions file
- **T-ALIGN-4**: Sessions file UUIDs exist in Claude sessions-index.json
- **T-ALIGN-5**: Registry pane targets still exist in tmux
- **T-ALIGN-6**: claudeCode.join writes UUID back to sessions file
- **T-ALIGN-7**: session.id Method 0 vs Method 1 consistency

Run: `cd /Users/donges/oosh && bash test/test.claudeCode`

**Current result**: Multiple FAILs expected. After fix: 0 FAIL.

## Files to Modify

| File | Lines | Change |
|------|-------|--------|
| `claudeCode` | 651-667 | Swap Method 0 and Method 1 priority |
| `claudeCode` | 170-179 | `join()` writes UUID to sessions file |
| `hiveMind` | 153-174 | `registry.set()` validates role name |
| `hiveMind` | 1435-1489 | `registry.refresh()` prunes dead panes |
| `hiveMind` | 1498-1558 | `agent.bootstrap()` captures UUID post-startup |
| `hiveMind` | 1900-1985 | `team.setup.full()` captures UUIDs post-startup |
| `hiveMind` | 1805-1960 | `team.context.status()` — two structural fixes (see Bugs 8-9) |

---

## Additional Bugs Found in `team.context.status`

### Bug 8: `team.context.status` uses raw tmux (6 violations)
**File**: `hiveMind` lines 1809, 1840, 1878-1882, 1888
**Problem**: Uses raw `tmux` calls instead of OOSH wrappers. Violates OOSH-only rule (INC-004).

| Line | Raw tmux | OOSH replacement |
|------|----------|------------------|
| 1809 | `tmux display-message -p "#{session_name}:..."` | `otmux pane.get` (already exists, returns self pane) |
| 1840 | `tmux capture-pane -t "$target" -p -S -20` | `otmux pane.capture "$target" 20` |
| 1878-1882 | `tmux send-keys` x3 (type + Enter + Enter) | `otmux send "$target" "/context" Enter Enter` |
| 1888 | `tmux capture-pane -t "$target" -p -S -` | `otmux pane.capture "$target" -S -` or use full scrollback capture wrapper |

### Bug 9: `team.context.status` only shows registered panes (invisible agents)
**File**: `hiveMind` line 1819
**Problem**: Iterates `$HIVEMIND_REGISTRY` — only shows panes with registry entries. Unregistered panes (new agents, crashed registry) are invisible. When you run `hiveMind team.context.status baseTeam`, pane 0.3 doesn't appear at all because it has no registry entry.

**Current** (line 1819): `while IFS='|' read -r target role; do` (reads registry)

**Fix**: Enumerate panes from tmux via `otmux pane.list <session>`, then look up role from registry as label:
```bash
# Replace registry iteration with actual pane enumeration:
while IFS= read -r pane_line; do
  target=$(echo "$pane_line" | awk '{print $1}')
  [ -z "$target" ] && continue
  # Look up role from registry (may be empty for unregistered panes)
  local role
  role=$(grep "^${target}|" "$HIVEMIND_REGISTRY" 2>/dev/null | cut -d'|' -f2)
  [ -z "$role" ] && role="(unregistered)"
  # ... rest of status logic
done < <(otmux pane.list "$session")
```

**Expected output after fix:**
```
Agent Context Status — baseTeam
──────────────────────────────────────────
AGENT                PANE     CTX%   TOKENS       STATUS
──────────────────────────────────────────
oosh-expert          0.0      64%    72k/200k     OK
oosh-expert          0.1      ??%    ??k/200k     OK
oosh-tester          0.2      48%    104k/200k    WARN
(unregistered)       0.3      —      —            NO-CLAUDE ← now visible!
──────────────────────────────────────────
```
