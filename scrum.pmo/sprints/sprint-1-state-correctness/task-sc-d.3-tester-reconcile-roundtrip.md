[Back to Task SC-D](./task-sc-d-reconcile-cycle.md)

# Task SC-D.3: Tester — degrade→reconcile→audit-clean roundtrip
[task:uuid:a7183551-110d-4e63-8ce2-55bba50aceb5]

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

For each invariant I1-I7: create violation → run `consistency.reconcile --apply` →
verify `consistency.audit` reports zero violations.

*Sprint 1 · Epic SC-D*
