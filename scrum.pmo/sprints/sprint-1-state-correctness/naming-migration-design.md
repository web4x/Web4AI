# Naming Migration Design: role@hostname as Default Convention

**Author:** oosh-architect @ ooshTeam:0.1
**Date:** 2026-05-22
**Status:** DESIGN — awaiting PO + expert review

## Current State (inconsistent)

Three identity surfaces, each with different naming:

| Surface | Current Format | Example | Set By |
|---------|---------------|---------|--------|
| **Registry** (roles.env col 2) | bare role | `oosh-expert` | `registry.set` |
| **Pane title** (tmux) | role@host OR bare | `oosh-architect@MacStudio` or `oosh-po` | `pane.title` / `pane.lock` |
| **Claude customTitle** (/rename) | role@host OR role@model | `oosh-architect@MacStudio` or `oosh-expert@opus` | `/rename` via fork.to / bootstrap |

**Who sets what today:**

| Tool | Registry | Pane Title | Claude /rename |
|------|----------|------------|----------------|
| `fork.to` (line 2792,2797) | `role` (bare) | `role` (bare) | `/rename $role` (bare) |
| `agent.bootstrap` (line 5342) | `role` (bare) | `role` (bare) | `/rename ${role}@opus` (model suffix!) |
| `agent.rename` (line 4016,4020) | `newName` (bare) | `newName` (bare) | `/rename ${newName}` (bare) |
| `teams.restore` (line 3100-3102) | from snapshot | from snapshot title | not sent (relies on fork resuming old name) |
| User manually | — | — | `/rename role@MacStudio` (convention) |
| Tron `/remote-control` | — | — | triggers hook that may append @host? |

## Design Decisions

### D1: Canonical name format = `role@hostname`

```
oosh-expert@MacStudio
ud-po@McDonges  
web4-architect@MacStudio
scrum-master@UpDown.ai
```

- `role` = the agent's function (oosh-expert, ud-po, web4-tester)
- `hostname` = the machine where the Claude process runs (`hostname -s`)
- Separator = `@` (universally understood as identity@location)

### D2: Registry stores BARE role (unchanged)

The registry (`roles.env`) continues to store bare role names. Reason: the registry maps **pane → role**. The pane is already host-local (it's in a tmux session on this machine). Adding hostname to registry is redundant and would break all existing `resolve` lookups.

```
# roles.env — NO CHANGE
ooshTeam:0.1|oosh-architect|1777544751
```

### D3: Pane title = `role@hostname` (display concern)

The pane title is what humans see in `otmux tree`. Adding `@hostname` tells you WHERE the agent is running — critical when viewing remote sessions or cross-host teams.

```
# tmux pane title
oosh-architect@MacStudio
```

### D4: Claude /rename = `role@hostname` (identity concern)

The Claude `customTitle` is what shows in `claudeCode list`, `claudeCode session.name`, and agent self-identification. `role@hostname` makes session files self-identifying across hosts.

```
# Claude session customTitle
oosh-architect@MacStudio
```

### D5: `role.fromTitle()` already handles this

Line 120 of hiveMind: `r="${r%%@*}"` — strips everything after `@`. So all existing code that extracts the bare role from a title already works with `role@hostname`. **No parsing changes needed.**

### D6: hostname source = `hostname -s`

Use short hostname (no domain), cached once per hiveMind invocation:

```bash
# At top of hiveMind, alongside existing env setup
HIVEMIND_HOST="${HIVEMIND_HOST:-$(hostname -s)}"
```

No config file needed. `hostname -s` returns `MacStudio`, `McDonges`, etc. Cacheable as env var for the session.

### D7: Resolving the @model vs @hostname conflict

**PO raised:** Pane titles use `@hostname` but Claude `/rename` currently uses `@model` (e.g., `oosh-expert@opus`). What does `@` mean?

**Options evaluated:**
- (A) Two systems coexist: pane=`@hostname`, Claude=`@model` — **REJECTED by TRON**
- (B) Unify: `role@model@hostname` everywhere — rejected (ugly, double @)
- (C) Unify: `role@hostname` everywhere, drop @model — **APPROVED by TRON**

**Decision: Option C — single convention, `role@hostname` on ALL surfaces.**

TRON directive (via SM on robbinTeam): BOTH pane title AND Claude `/rename` use `role@hostname`. Applied to robbinTeam as precedent. Option A was architect's initial recommendation but TRON wants one convention, not two.

| Surface | Format | Example |
|---------|--------|---------|
| **Pane title** (tmux) | `role@hostname` | `robbin-expert@MacStudio` |
| **Claude /rename** | `role@hostname` | `robbin-expert@MacStudio` |
| **Registry** (roles.env) | `role` (bare) | `robbin-expert` |

**Model info:** Visible in `claudeCode list` (shows model from JSONL), `tree.detailed` (reads process args). Not needed in the session name. If needed for fork selection, `claudeCode list --json` already exposes model per session.

### D8: Remote control — orthogonal

`/remote-control` is a Claude Code feature, not a naming feature. Whether an agent has `@MacStudio` in its name has no bearing on whether remote control is enabled. Don't conflate identity with capability. Remote control should be enabled based on Tron's choice, not automated by bootstrap.

## Tools That SET the Name — 9 Write Paths (expert review: 4 additional found)

> Expert identified 4 missed sites: handler.agent.renamed.title (481), team.setup (4894), agent.respawn (6209), consistency.fix.table (4738). Total: 9 write paths, not 5.

### 1. `fork.to` (line 2792, 2797)

**Current:**
```bash
"$OOSH_DIR/otmux" send.raw "$targetPane" "/rename $role" Enter
"$OOSH_DIR/otmux" pane.title "$targetPane" "$role"
```

**Proposed (Option C — unified @hostname):**
```bash
local display="${role}@${HIVEMIND_HOST}"
"$OOSH_DIR/otmux" send.raw "$targetPane" "/rename ${display}" Enter
"$OOSH_DIR/otmux" pane.title "$targetPane" "${display}"
```

Registry call (line ~2810 `registry.set`) stays bare `$role` — unchanged.

### 2. `agent.bootstrap` (line 5342)

**Current:**
```bash
otmux send.enter "$target_pane" "/rename ${role}@opus"
```

**Proposed (Option C):**
```bash
local display="${role}@${HIVEMIND_HOST}"
otmux send.enter "$target_pane" "/rename ${display}"
otmux pane.title "$target_pane" "${display}"
```

Replaces `@opus` with `@hostname`. Pane title added (was missing — expert finding #3).

### 3. `agent.rename` (line 4016, 4020)

**Current:**
```bash
otmux send.raw "$target" "/rename ${newName}" Enter
otmux pane.lock "$target" "$newName"
```

**Proposed (Option C):**
```bash
local display="${newName}@${HIVEMIND_HOST}"
otmux send.raw "$target" "/rename ${display}" Enter
otmux pane.lock "$target" "${display}"
```

Registry update (line ~4022) stays bare `$newName`.

### 4. `teams.restore` (line 3100-3102)

**Current:** Sets pane title from snapshot's title column (which may or may not have `@host`).

**Proposed:** After restoring title from snapshot, if title lacks `@`, append `@${HIVEMIND_HOST}`:

```bash
local restored_title="$title"
[[ "$restored_title" != *"@"* ]] && restored_title="${restored_title}@${HIVEMIND_HOST}"
otmux pane.title "$pane_target" "$restored_title"
```

### 5. `registry.set` (line 286-291)

**Current:**
```bash
otmux pane.title "$target" "$role"
```

**Proposed:**
```bash
local display_name="${role}@${HIVEMIND_HOST}"
otmux pane.title "$target" "${display_name}"
```

Registry write stays bare role.

### 6. `handler.agent.renamed.title` (line 481)

**Current:** `pane.lock` with bare name from observer event.

**Proposed:** Append `@${HIVEMIND_HOST}` to the title in the handler.

### 7. `team.setup` (line 4894)

**Current:** `/rename ${role}` bare.

**Proposed:**
```bash
local model="${HIVEMIND_DEFAULT_MODEL:-opus}"
otmux send.raw "$pane" "/rename ${role}@${model}" Enter
otmux pane.title "$pane" "${role}@${HIVEMIND_HOST}"
```

### 8. `agent.respawn` (line 6209)

**Current:** `/rename $role` bare.

**Proposed:**
```bash
local model="${HIVEMIND_DEFAULT_MODEL:-opus}"
otmux send.raw "$pane" "/rename ${role}@${model}" Enter
otmux pane.title "$pane" "${role}@${HIVEMIND_HOST}"
```

### 9. `consistency.fix.table` (line 4738)

**Current:** `pane.lock` with bare role (legacy reconciliation path).

**Proposed:** Append `@${HIVEMIND_HOST}` to the title in the fix.

## Tools That READ the Name — No Changes Needed

| Tool | Why no change |
|------|---------------|
| `resolve` | Searches registry by bare role (col 2). `role.fromTitle` strips `@*`. Works. |
| `registry.get` | Returns bare role from registry. Unchanged. |
| `sender prefix` | Uses `role.fromTitle()` which strips `@*`. Works. |
| `sweep.detect` | Reads pane titles, extracts role via `role.fromTitle`. Works. |
| `tree` | Displays pane title as-is. `@MacStudio` now shows naturally. Works. |
| `tree.detailed` | Same. Works. |
| `team.status` | Reads discover data → role from title → `role.fromTitle` strips `@*`. Works. |
| `protected.agents.discover` | Uses `role.fromTitle`. Works. |

**The `role.fromTitle` function (line 116-124) is the single parsing point.** It already strips `@*`. Every reader goes through it. Zero read-path changes.

## Migration Plan

### Phase 1: Add `HIVEMIND_HOST` (non-breaking)

Add to hiveMind init section:
```bash
HIVEMIND_HOST="${HIVEMIND_HOST:-$(hostname -s)}"
```

Zero impact — variable exists but nothing uses it yet.

### Phase 2: Update 5 write paths (single commit)

Modify `fork.to`, `agent.bootstrap`, `agent.rename`, `teams.restore`, `registry.set` to append `@${HIVEMIND_HOST}` to pane titles and `/rename` calls. Registry stays bare.

**All 5 changes are in hiveMind only.** No changes to otmux, claudeCode, or other scripts.

### Phase 3: Rename existing agents (live, non-disruptive)

For each running agent without `@hostname` in pane title:
```bash
# One-liner per agent:
hiveMind agent.rename oosh-po oosh-po   # re-triggers rename with new @host suffix
```

Or bulk via registry:
```bash
grep "^ooshTeam:" "$HOME/config/hivemind.roles.env" | cut -d'|' -f2 | while read role; do
  hiveMind agent.rename "$role" "$role"
done
```

This is idempotent — renaming to the same role just re-applies the title with the new `@host` suffix.

### Phase 4: Verify

```bash
otmux tree ooshTeam
# Every pane title should show role@MacStudio
```

## What NOT to Change

- **Registry format** — stays `pane|role|timestamp`. Bare role. No `@host`.
- **Snapshot format** — stays as-is. Title column in snapshot captures whatever the pane title was at save time (now includes `@host`).
- **Boot files** — `session/agents/{role}/boot.md` uses bare role in path. No change.
- **SKILL.md** — uses bare role. No change.
- **otmux** — zero changes. It displays and sets titles; hiveMind controls what goes in them.
- **claudeCode** — zero changes. It stores `customTitle` from `/rename`; hiveMind controls what's sent.

## Summary

| What | Before | After |
|------|--------|-------|
| Pane title | `oosh-expert` or `oosh-expert@MacStudio` (inconsistent) | `oosh-expert@MacStudio` (always @hostname) |
| Claude /rename | `oosh-expert` or `oosh-expert@opus` (inconsistent) | `oosh-expert@opus` (always @model) |
| Registry | `oosh-expert` | `oosh-expert` (unchanged, always bare) |
| `role.fromTitle()` output | `oosh-expert` | `oosh-expert` (unchanged — strips @*) |
| `resolve` behavior | works | works (unchanged) |
| Code changes | — | 9 write paths in hiveMind + 1 env var HIVEMIND_HOST (single commit) |
| Other scripts | — | ZERO changes |

**Single `@` semantic everywhere:**
- `@` = WHERE (hostname) — consistent across pane title AND Claude session name
- Model info available via `claudeCode list` / `tree.detailed` — not in the name

---

**Expert questions:**
1. Does `hostname -s` return the right thing on all our hosts? (MacStudio, McDonges, UpDown.ai)
2. Is there a performance concern with adding `$(hostname -s)` to hiveMind init? (Should be ~1ms, cached in var)
3. Any edge case where `role.fromTitle` stripping `@*` would lose needed info? (I don't see one — the hostname is display-only, never used for routing)
