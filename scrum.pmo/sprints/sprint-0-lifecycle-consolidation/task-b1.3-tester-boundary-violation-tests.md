[Back to Task B1](./task-b1-otmux-mvc-boundary-audit.md)

# Task B1.3: Tester - Boundary Violation Tests
[task:uuid:b183eb55-4555-4175-927d-b0813b5501ad]

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
  - [Task B1: otmux MVC Boundary Audit](./task-b1-otmux-mvc-boundary-audit.md)

## Description
**Role: oosh-tester**

Write tests verifying otmux has no boundary violations:

1. **Static analysis tests** — grep otmux source for zero occurrences of `claudeCode`, `hiveMind`, `session`, `agent`, `role`, `bootstrap` (as method calls or source targets)
2. **Interface purity tests** — verify otmux methods accept generic tmux addresses (session:window.pane), not agent-specific identifiers
3. **No-source tests** — verify otmux does not source any Model or Controller env files

Use the test.suite framework.

Key file: `/Users/donges/oosh/otmux`

---

*Sprint 0 - Lifecycle Consolidation*
*Epic B: otmux View Layer*
