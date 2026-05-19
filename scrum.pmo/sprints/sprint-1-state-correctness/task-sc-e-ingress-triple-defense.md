[Back to Sprint 1 Design](./sprint-1-design.md)

# Task SC-E: Ingress triple-defense audit + apply
[task:uuid:1992936c-8631-4ab3-b6c9-91425387d695]

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
  - [SC-E.1 expert — audit ingress points](./task-sc-e.1-expert-ingress-audit.md)
  - [SC-E.2 expert — apply triple defense to gaps](./task-sc-e.2-expert-apply-defense.md)
  - [SC-E.3 tester — 3-vector reject per ingress](./task-sc-e.3-tester-3-vector-reject.md)

## Description
Every method accepting a caller-supplied identifier (pane, role, session, UUID)
must apply Pattern P3 triple defense:
(a) regex format validation
(b) delimiter-rejection (`|`, newline, whitespace)
(c) ground-truth existence check (tmux/screen/Claude)

Today only `team.register` has all three (ebc8b5e). This epic spreads it.

*Sprint 1 · Epic SC-E* (parallel with SC-A/B/C/D)
