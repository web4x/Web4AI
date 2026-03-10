# OOSH Tester Agent — Session Context

**Updated**: 2026-02-26 ~19:30
**Role**: oosh-tester (baseTeam:0.2)
**Pane**: baseTeam:0.2

## Recovery Steps
1. Read this file
2. Read `.claude/agents/oosh-tester/SKILL.md`
3. Check `session/tasks/` for pending work
4. Check with PO/expert for current priorities

## Current Task: Verify session.id Bug Fixes

### What happened
Filed `session/tasks/expert-fix-session-id-bugs.task.md` — 3 bugs in agent identity:
1. `claudeCode session.id` returns wrong UUID after agent restart
2. `otmux tree.detailed` shows wrong names from stale hiveMind registry
3. Duplicate session UUIDs across panes

Expert (baseTeam:0.1) made fixes:
- `claudeCode` line 643: `head -1` → `tail -1` in lsof method
- `otmux` tree.detailed: uses `session.name` before registry fallback
- `hiveMind`: added `registry.refresh()` method

### Test Results: 33 tests, 22 PASS, 11 FAIL

**Bug 1 NOT FIXED** — `tail -1` still returns wrong UUID. Root cause: when agents are **restarted** (NOT compacted — compact keeps UUID), the new claude process opens task dirs from ALL previous sessions (for history/resume). Current session UUID is NOT in lsof at all. 10 out of 15 live agents FAIL.

**Bug 2 PARTIAL** — tree.detailed now uses session.name but shows ugly truncated boot prompts for un-renamed sessions.

**Bug 3 PARTIAL** — registry.refresh works for /rename'd sessions. Stale entries remain.

### Key Files
- `test/test.claudeCode` — **I WROTE LIVE BEHAVIORAL TESTS** (T11-T33)
  - Parses `otmux` (no params) to find ALL Claude panes
  - Sends `/status` to each, parses Session ID, compares with `session.id`
  - Tests idle pane (exit 1), registry consistency
  - Run: `cd /Users/donges/oosh && bash test/test.claudeCode`
- `session/tasks/expert-fix-session-id-bugs.task.md` — original bug report
- `session/tasks/tester-verify-session-id-fixes.task.md` — expert's test plan
- `session/tasks/tester-session-id-results.md` — detailed results

### Correction on Root Cause
NOT caused by /compact. Caused by **restarting agents** (kill + new claude session in same pane). The new process opens lsof handles to old task dirs from previous incarnations. PID 65442 has 89 handles to old UUID, 0 to current.

## Pending
- Expert needs to find a new detection method (lsof is fundamentally broken)
- Re-run `bash test/test.claudeCode` after expert's next fix — must get 0 FAIL
