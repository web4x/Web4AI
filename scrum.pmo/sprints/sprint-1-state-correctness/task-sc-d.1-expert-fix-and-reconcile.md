[Back to Task SC-D](./task-sc-d-reconcile-cycle.md)

# Task SC-D.1: Expert — consistency.fix + consistency.reconcile
[task:uuid:8798a104-3da7-4da0-86f8-3c7819a86736]

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
**Role: oosh-expert**

Implement two public methods on top of SC-A diff:
- `hiveMind consistency.fix` — apply diff after y/N prompt (interactive)
- `hiveMind consistency.reconcile <?--apply>` — apply silently when `--apply`,
  dry-run otherwise (default per U3)

Both share SC-A.1 primitive. Difference is just human prompting vs flag-gated.

*Sprint 1 · Epic SC-D*
