[Back to Task E1](./task-e1-end-to-end-lifecycle-test.md)

# Task E1.3: Tester - tronMonitor Shows Restored Team
[task:uuid:040e5334-b065-451c-be65-86c9bdb4bac7]

## Status
- [ ] Planned
- [ ] In Progress
  - [ ] refinement
  - [ ] creating test cases
  - [ ] implementing
  - [ ] testing
- [ ] QA Review
- [ ] Done

## Traceability
- up
  - [Task E1: End-to-End Lifecycle Test](./task-e1-end-to-end-lifecycle-test.md)

## Description
**Role: oosh-tester**

Write tests verifying tronMonitor correctly reflects the restored team:

1. **Auto-add after restore test** — after hiveMind team.restore, verify tronMonitor has the restored team in its window list
2. **Correct team data test** — verify tronMonitor shows correct team name, agent count, and status
3. **Team switching test** — verify Tron can switch to the restored team's view via tronMonitor
4. **Multiple restore test** — restore two teams, verify tronMonitor shows both
5. **tronMonitor setup after restore test** — if tronMonitor was not running during restore, verify it picks up restored teams when started

These tests validate the Monitor layer's integration with the Controller's restore lifecycle.

Key files: `/Users/donges/oosh/tronMonitor`, `/Users/donges/oosh/hiveMind`

---

*Sprint 0 - Lifecycle Consolidation*
*Epic E: Integration*
