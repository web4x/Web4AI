# Task: Fix claudeCode session.id and otmux tree.detailed Identity Bugs

**Assigned to**: oosh-expert (baseTeam:0.1)
**Filed by**: oosh-tester (baseTeam:0.2)
**Date**: 2026-02-26
**Priority**: HIGH — these bugs make all monitoring, context-checking, and agent identification unreliable

---

## Summary

`claudeCode session.id` returns **wrong UUIDs** for most agents. `otmux tree.detailed` displays **wrong agent names**. Root cause: stale data from lsof file handles and hiveMind registry.

## Bug 1: `claudeCode session.id` returns wrong/stale UUID

**File**: `/Users/donges/oosh/claudeCode` lines 628-690

**Problem**: Method 2 (lsof on `~/.claude/tasks/`) returns a stale task-dir UUID from a **previous session** (pre-compact). After `/compact`, Claude Code gets a new session ID but the process retains open file descriptors to the OLD task directory. The `head -1` on lsof picks the first (oldest/most-common) UUID, which is the stale one.

**Evidence** (projectTeam:0.3, PID 65442):
- `/status` shows actual Session ID: `a2c6b6c4-0eb0-4392-86e5-45ea0e20fe04`
- `claudeCode session.id` returns: `2120c2ee-885d-46d3-af69-58f7af19ffef` (stale)
- lsof shows 80+ handles to `2120c2ee-...` (old) and 40+ to `2c2f6e67-...` (also old)
- The actual current session `a2c6b6c4-...` is **not present in lsof at all**

Same pattern for 0.4 (returns `e93582de` but actual is `6213b3dc`) and 0.5 (returns `0f0755a8` but actual is `e7606830`; lsof returns NOTHING for this PID).

**Fix approach**: lsof Method 2 is unreliable after compacts. Options:
1. **Prefer the NEWEST (highest FD number) task UUID** instead of `head -1` — the most recently opened FD is more likely to be the current session
2. **Add a new method** that reads the JSONL files and finds the one with the most recent `lastApiActivity` timestamp matching this process
3. **Use `ps -o args=` more aggressively** — check if `--session-id` flag is used (not just `--resume`)
4. **Parse the TUI status bar** as a higher-priority method — send `/status`, capture, parse "Session ID:" line (most reliable but slow/invasive)
5. **Count unique UUIDs in lsof** and pick the one with the MOST RECENT file descriptors (highest FD numbers), not just `head -1`

Recommended: Option 5 (pick UUID with highest max FD number) as a fast, non-invasive fix. Consider adding a `--verify` flag that cross-checks against JSONL data.

## Bug 2: `otmux tree.detailed` shows wrong agent name from stale hiveMind registry

**File**: `/Users/donges/oosh/otmux` lines 1340-1343

**Problem**: The sub-line agent name comes from `hivemind.roles.env` which maps pane addresses to roles. This registry is **never updated** when agents compact, restart, or get reassigned to different panes.

**Evidence** (current `~/config/hivemind.roles.env`):
```
projectTeam:0.3|scrum-master    ← WRONG, actual: oosh-expert
projectTeam:0.5|agent-trainer   ← WRONG, actual: unnamed fresh session
projectTeam:0.1|oosh-expert     ← WRONG, pane is idle zsh shell
```

**Fix approach**: Two complementary fixes needed:
1. **tree.detailed**: Instead of (or in addition to) reading the registry, get the session name from the JSONL `custom-title` field or from `claudeCode session.name`. The session name (e.g., "oosh-expert@sonnet") is the ground truth of who the agent IS.
2. **hiveMind registry**: Add a `hiveMind registry.refresh` method that walks all active Claude panes, reads their actual session name, and updates the registry. Could be called by SM during sweeps.

## Bug 3: Duplicate session UUID across panes 1.2 and 1.3

**Evidence**:
- projectTeam:1.2 (task-agent) Session ID: `5fff44f4-0a0e-4626-a2c6-1b9cf7a05ef8`
- projectTeam:1.3 (developer) Session ID: `5fff44f4-0a0e-4626-a2c6-1b9cf7a05ef8` — SAME
- Both panes `/status` show "task-agent@sonnet" and same UUID

This is either: (a) a `--resume` to the same session from two panes (dangerous — shared state), or (b) `session.id` matching the same JSONL for both because Bug 1's stale lsof. Needs investigation — if (a), one pane should get a new session.

## Files to modify

1. `/Users/donges/oosh/claudeCode` — `session.id()` method (lines 628-690)
2. `/Users/donges/oosh/otmux` — `tree.detailed()` name resolution (lines 1340-1343)
3. `/Users/donges/oosh/hiveMind` — add `registry.refresh()` method (new)

## Test plan (tester will verify)

1. After fix: `claudeCode session.id projectTeam:0.3` must match `/status` Session ID in that pane
2. Same for 0.4, 0.5, 1.0-1.5
3. `otmux tree.detailed` sub-line names must match actual session names
4. `hiveMind registry.refresh` must update stale entries
5. Edge case: pane with no Claude session (idle zsh) must return empty/error, not a stale UUID
