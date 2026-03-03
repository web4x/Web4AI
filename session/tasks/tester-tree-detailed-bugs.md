# Test Results: otmux tree / tree.detailed + session.id consistency

**From**: hiveMind-tester (hiveMindTeam02_03_26:0.1)
**Date**: 2026-03-03

---

## Expert Fixes Verified (commits 047c53d, faaf2d1)

### BUG-C: hiveMind resolve ignores session parameter — FIXED by expert
- **Fix**: Changed `-a` (all sessions) to `-s` (session-scoped) in `private.hiveMind.live.discover.session` line 285
- **Commit**: `047c53d`
- **Verified**: `hiveMind resolve hiveMind-expert hiveMindTeam` → `hiveMindTeam:0.0` (correct session)

### BUG-B: tree.detailed missing sub-lines — FIXED by expert
- **Fix**: Added bash/zsh + `claudeCode process.find` detection to tree.detailed line 1346
- **Commit**: `faaf2d1`
- **Verified**: Sub-lines now show session names and truncated UUIDs

### BUG-A: tree shows [bash] instead of version — PARTIALLY FIXED by expert
- Expert fixed `otmux.tree()` but NOT `otmux.tree.detailed()`
- **Tester completed the fix**: applied same version detection to tree.detailed line 1339
- Also trimmed `(Claude Code)` suffix from version string for consistency: `[2.1.63]` not `[2.1.63 (Claude Code)]`
- **Verified**: Both `otmux tree` and `otmux tree.detailed` now show `[2.1.63]`

---

## New Test: T-ALIGN-8 — Duplicate UUID Detection

Added to `test/test.claudeCode`. Scans ALL panes across ALL sessions for shared session.id UUIDs.

### Results: 9 duplicates found across 3 categories

**Category 1 — Benign (same --resume UUID in old+new session):**
- hiveMindTeam:0.0 & hiveMindTeam02_03_26:0.0 share `75ce660f` (expert resumed)
- hiveMindTeam:0.1 & hiveMindTeam02_03_26:0.1 share `004e5ea9` (tester resumed)

**Category 2 — Bug 6 (stale mapping, 3 panes share task-agent UUID):**
- projectTeam:1.2, 1.3, 1.4 all return `5fff44f4` (task-agent@sonnet)

**Category 3 — Severe (1 UUID leaked to 5+ panes across 4 sessions):**
UUID `a2c6b6c4` (oosh-expert@opus.26.02.26) appears on:
- baseTeam:0.1, baseTeam:0.2
- odockerTeam:0.1
- osshTeam:0.3
- projectTeam:0.1, projectTeam:0.2

**Root cause**: `claudeCode session.id` falls back to registry/sessions-file lookup (Method 0) when a pane has no running Claude process. The stale sessions file maps multiple roles to the same UUID from a prior session.

---

## Summary

| Item | Status |
|------|--------|
| BUG-A: tree version detection | FIXED (tester completed partial fix) |
| BUG-B: tree.detailed sub-lines | FIXED (expert) |
| BUG-C: resolve session scoping | FIXED (expert) |
| T-ALIGN-8: duplicate UUID test | ADDED — reveals 9 duplicates |
| Bug 6: 3 panes share 5fff44f4 | CONFIRMED — needs session.id fix |
| UUID a2c6b6c4 leaked to 5 panes | NEW finding — same root cause |

## Commit: disable /status live test + enhance T-ALIGN-8

- Disabled /status live test: sends commands to active agent panes, disrupts running agents
- T-ALIGN-8 enhanced: shows tmux session start date per pane, severity (CONFLICT/STALE/GHOST), LIVE labels
- Helps distinguish same --resume UUID in old vs new session from genuinely stale mappings
