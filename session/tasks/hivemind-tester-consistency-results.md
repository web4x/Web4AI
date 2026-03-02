# Test Results: hiveMind Identity Consistency Tests (Run 2)

**Tester**: hiveMind-tester
**Date**: 2026-03-02
**Commits tested**: `5a6c03c` (expert registry fix) + `704dd6e` (T-CONSIST-8)
**Test file**: `test/test.hiveMind` (8 T-CONSIST tests)

## Summary

87 test cases, 89 assertions: **76 PASS, 13 FAIL**

Improvement from Run 1: 58/89 → 76/89 (+18 more passing)

## Consistency Test Results

| Test | Description | Result | Detail |
|------|-------------|--------|--------|
| T-CONSIST-1 | team.context.status shows ALL panes | **PASS** | 4/4 panes on baseTeam |
| T-CONSIST-2 | No raw tmux in team.context.status | **FAIL (3)** | 3 raw tmux calls remain — Bug 8 not fully fixed |
| T-CONSIST-3 | Registry role names valid | **7/21 FAIL** | 5 garbage (boot prompt), 2 orphans. Down from 24/24 FAIL |
| T-CONSIST-4 | Registry panes exist in tmux | **PASS** | 21/21 panes exist |
| T-CONSIST-5 | Pane titles match registry | **1/1 FAIL** | baseTeam:0.1 title drift |
| T-CONSIST-6 | team.status agrees with team.context.status | **PASS** | Both show 4 agents |
| T-CONSIST-7 | registry.set validates role names | **PASS** | Rejects garbage, accepts valid |
| T-CONSIST-8 | session.id vs tree.detailed UUID | **8/8 PASS** | All UUIDs match. BUG-10 not manifesting |

## T-CONSIST-8 Detail (BUG-10 — stale session IDs)

| Pane | session.id | tree.detailed | Match |
|------|-----------|---------------|-------|
| hiveMindTeam:0.0 | 75ce660f... | 75ce660f | PASS |
| hiveMindTeam:0.1 | 004e5ea9... | 004e5ea9 | PASS |
| odockerTeam:0.1 | a2c6b6c4... | a2c6b6c4 | PASS |
| osshTeam:0.3 | a2c6b6c4... | a2c6b6c4 | PASS |
| projectTeam:0.5 | 0f0755a8... | 0f0755a8 | PASS |
| projectTeam:1.2 | 5fff44f4... | 5fff44f4 | PASS |
| projectTeam:1.3 | 5fff44f4... | 5fff44f4 | PASS |
| projectTeam:1.4 | 5fff44f4... | 5fff44f4 | PASS |

**Bug 6 confirmed**: projectTeam:1.2, 1.3, 1.4 all share UUID `5fff44f4` — three panes with same session.

## Remaining Failures (13)

- 2 pre-existing: cursorOrchestrator completion, .cursor/skills symlink path
- 5 garbage registry entries (projectTeam:0.3, 0.4, 1.0, 1.1 + odockerTeam:0.0)
- 2 orphan roles (cursor-agent, orchestrator — no agent directories)
- 3 raw tmux calls in team.context.status (Bug 8 partial)
- 1 pane title drift (baseTeam:0.1)

## Progress vs Run 1

| Metric | Run 1 | Run 2 | Change |
|--------|-------|-------|--------|
| Total tests | 87 | 87 | — |
| PASS | 58 | 76 | +18 |
| FAIL | 31 | 13 | -18 |
| T-CONSIST-3 invalid | 24/24 | 7/21 | Fixed 17 |
| T-CONSIST-8 | N/A | 8/8 PASS | New |
