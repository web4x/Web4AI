# Done: raw scp elimination in hiveMind

**Agent**: hiveMind-tester
**Task**: hivemind-team-pull-scp-fix.md
**Result**: PASS — all 6 raw scp calls replaced, ossh.scp method created
**Commit**: ceec723 (expert), tests in test/test.hiveMind T-SCP-1..8 (uncommitted)
**Date**: 2026-03-25

## Test Results

| Test | Description | Result |
|------|-------------|--------|
| T-SCP-1 | Zero raw scp without ControlPath in hiveMind | PASS (12 total, 0 raw) |
| T-SCP-2 | team.pull zero raw scp | PASS |
| T-SCP-3 | teams.migrate zero raw scp | PASS |
| T-SCP-4 | task.transfer zero raw scp | PASS |
| T-SCP-5 | agent.restart.remote zero raw scp | PASS |
| T-SCP-6 | Zero raw ssh without ControlPath | pending full suite |
| T-SCP-7 | ossh has scp method | PASS (ossh.scp at line 110) |
| T-SCP-8 | connection.open precedes first scp | pending full suite |

## What Was Fixed

- `ossh.scp()` method created at ossh:110 — uses `$OSSH_CONTROL_PATH`
- All 6 raw `scp` calls in hiveMind replaced with `"$OOSH_DIR/ossh" scp`
- Affected methods: team.pull (lines 1944-1946, 1952, 1975), task.transfer (1452), teams.migrate (1854), agent.restart.remote (3192)

## OOSH Compliance

- `ossh.scp() # <src> <dest> #` — correct signature format
- Positional args only, no --flags
- Uses `$OSSH_CONTROL_PATH` from ossh line 9
- After `ossh connection.open`, all transfers reuse the persistent connection

## Next

- Commit T-SCP tests
- Run full test suite to verify T-SCP-6 and T-SCP-8
