# Task: Verify session.id and tree.detailed Bug Fixes

**Assigned to**: oosh-tester
**Filed by**: oosh-expert
**Date**: 2026-02-26
**Priority**: HIGH — verification of identity bug fixes

---

## What was fixed

Three bugs in agent identity resolution (filed in `expert-fix-session-id-bugs.task.md`):

1. **Bug 1** (`claudeCode session.id`): Changed Method 2 lsof from `head -1` to `tail -1` — picks newest FD (highest number = most recent session after compact)
2. **Bug 2** (`otmux tree.detailed`): Now uses `claudeCode session.name` as primary name source instead of stale hiveMind registry. Registry is fallback.
3. **Bug 3** (`hiveMind registry.refresh`): New method that walks live panes, gets actual session names from `/rename`, updates `hivemind.roles.env`. Only updates entries for sessions with `role@model` naming (from `/rename`).

## Files changed

1. `/Users/donges/oosh/claudeCode` — line ~643: `head -1` → `tail -1`
2. `/Users/donges/oosh/otmux` — lines ~1338-1347: session.name priority, registry fallback
3. `/Users/donges/oosh/hiveMind` — lines ~1435-1470: new `registry.refresh()` method

---

## Test Plan

### Test 1: session.id accuracy (Bug 1)

For each active Claude pane, verify `claudeCode session.id` matches actual session:

```bash
# Pick 3+ panes that have active Claude sessions
# For each pane, capture /status output to get the real Session ID:
otmux pane.capture projectTeam:0.3 30
# Look for "Session ID:" line — that's ground truth

# Then compare:
claudeCode session.id projectTeam:0.3
# Must match the Session ID from /status

# Repeat for at least 3 different panes
```

**Pass criteria**: session.id output matches /status Session ID for all tested panes.

**Edge cases**:
- Pane with idle zsh (no Claude): `claudeCode session.id <idle-pane>` must return empty + exit code 1
- Pane after compact: session.id must return the NEW session, not the pre-compact one

### Test 2: tree.detailed names (Bug 2)

```bash
otmux tree.detailed
```

**Pass criteria**:
- Sub-line agent names must show actual session names (e.g. "oosh-expert@opus") for renamed sessions
- Falls back to registry name for sessions without /rename
- Shows "(unnamed)" for panes where neither source has data
- Session ID snippets (8-char hex) must be correct (cross-check with session.id)

### Test 3: registry.refresh (Bug 3)

```bash
# Before: show stale registry
cat ~/config/hivemind.roles.env

# Run refresh
hiveMind registry.refresh projectTeam

# After: show updated registry
cat ~/config/hivemind.roles.env
```

**Pass criteria**:
- Only entries for panes with `/rename`d sessions (role@model format) get updated
- Un-renamed sessions are NOT written (no truncated firstPrompt garbage)
- Panes without Claude sessions don't appear
- Existing entries for other sessions (hiveMindTeam, odockerTeam etc.) are preserved

### Test 4: Duplicate session UUID (Bug 3 investigation)

```bash
# Check if panes 1.2 and 1.3 still show same UUID
claudeCode session.id projectTeam:1.2
claudeCode session.id projectTeam:1.3
# If same UUID: investigate whether both panes actually --resume the same session
# Check: ps -p $(claudeCode process.find projectTeam:1.2) -o args=
# Check: ps -p $(claudeCode process.find projectTeam:1.3) -o args=
```

**Report**: Whether this was a session.id detection bug (now fixed) or actual session sharing.

### Test 5: Syntax + no regressions

```bash
bash -n /Users/donges/oosh/claudeCode
bash -n /Users/donges/oosh/otmux
bash -n /Users/donges/oosh/hiveMind
```

## Report format

Write results to `session/tasks/tester-session-id-results.md` with PASS/FAIL per test.
