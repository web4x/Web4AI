[Back to Task SC-A](./task-sc-a-consistency-audit-foundation.md)

# Task SC-A.3: Tester — 6 invariant detection fixtures
[task:uuid:58bdc112-adc3-4f01-b0d7-9f1f1d5a61a8]

## Status
- [ ] Planned
- [ ] In Progress
  - [ ] refinement
  - [ ] creating test cases
  - [ ] implementing
  - [ ] testing
- [ ] QA Review
- [ ] Done

## Description
**Role: oosh-tester**

Write fixture-based test cases for invariants I1-I7 (sprint-1-design.md §3).
Each fixture sets up a deliberately violating state, runs `consistency.audit`,
asserts the violation is detected at the expected severity.

## Test matrix
| Invariant | Severity | Fixture |
|-----------|----------|---------|
| I1 | HIGH | roles.env entry for dead pane |
| I2 | HIGH | sessions.env UUID doesn't match live ps |
| I3 | CRITICAL | teams.env entry for non-existent session (the Did/you/mean class) |
| I4 | MEDIUM | tronMonitor.env entry not in teams.env |
| I5 | MEDIUM | snapshot UUID with no JSONL on disk |
| I6 | LOW | queue file for dead pane |
| I7 | CRITICAL | tronMonitor pane title doesn't match displayed team |

## Key file
`/Users/donges/oosh/test/test.state.correctness` (new)

*Sprint 1 · Epic SC-A*
