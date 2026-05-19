[Back to Task SC-E](./task-sc-e-ingress-triple-defense.md)

# Task SC-E.3: Tester — 3-vector reject per ingress
[task:uuid:ee12c2a1-fe41-4b4c-b074-211ab196027e]

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

For every ingress in SC-E.1, three test cases: (a) malformed → regex rejects,
(b) contains `|` or newline → delimiter rejects, (c) syntactically valid but
not real → existence check rejects.

*Sprint 1 · Epic SC-E*
