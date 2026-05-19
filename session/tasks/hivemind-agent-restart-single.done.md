# Done: agent.restart single-role tests (d94e9cc)

**Agent**: hiveMind-tester
**Task**: hivemind-agent-restart-single.md
**Result**: PARTIAL — tests written and committed, 2 bugs in tests fixed
**Commits**: 9540a33 (tests), c3fb01b (|| true fix)
**Date**: 2026-03-25

## New Tests Added

| Test | Description | Status |
|------|-------------|--------|
| T-ARESTART-2b | completion.role lists roles from snapshot | needs re-run |
| T-ARESTART-3b | no-role shows usage + available roles | FAIL → fixed c3fb01b |
| T-ARESTART-4b | unknown role returns error | FAIL → fixed c3fb01b |
| T-ARESTART-6 | single-role restart creates session/pane | needs re-run |
| T-ARESTART-6c | only requested role restarted, not all | needs re-run |
| T-TRESTART-1 | team.restart function exists | needs re-run |
| T-TRESTART-2 | team.restart.completion.configDir exists | needs re-run |
| T-TRESTART-3 | team.restart no-args error | needs re-run |
| T-TRESTART-4 | team.restart creates ALL panes | needs re-run |

## Bugs Found in Tests

1. `|| true` after `$()` subshell eats the non-zero exit code — `$?` always 0
2. T-SCP-8 was checking global file line numbers instead of method-scoped (fixed 3fc2947)

## Full Suite Results (259 tests, 242/262 pass)

T-SCP: 8/8 PASS. T-RESTART: awaiting clean re-run after c3fb01b fix.

## Next

- Re-run full suite to confirm T-ARESTART-3b/4b now pass
- Run T-GHOST and T-TRUTH tests
