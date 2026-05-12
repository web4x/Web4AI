[Back to Sprint 1 Design](./sprint-1-design.md)

# Task SC-D: Reconcile cycle (safety net)
[task:uuid:80d9e37b-3ec6-4a3b-a939-51729504f864]

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
- up: [Sprint 1 Design](./sprint-1-design.md)
- down:
  - [SC-D.1 expert — consistency.fix + consistency.reconcile](./task-sc-d.1-expert-fix-and-reconcile.md)
  - [SC-D.2 expert — scrumMaster.cycle wiring](./task-sc-d.2-expert-sm-cycle-wiring.md)
  - [SC-D.3 tester — degrade→reconcile→audit-clean roundtrip](./task-sc-d.3-tester-reconcile-roundtrip.md)

## Description
Layer `consistency.fix` and `consistency.reconcile` on top of SC-A diff
primitive. Wire `scrumMaster cycle` to call reconcile periodically.

## Depends on
SC-A (diff primitive).

## Constraints (locked)
- Dry-run default (per U3); `--apply` required to mutate
- Log+continue on handler failure (per U1) — reconcile catches missed events

*Sprint 1 · Epic SC-D*
