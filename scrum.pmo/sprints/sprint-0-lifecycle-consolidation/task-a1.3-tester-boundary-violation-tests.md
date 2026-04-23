[Back to Task A1](./task-a1-claudecode-mvc-boundary-audit.md)

# Task A1.3: Tester - Boundary Violation Tests
[task:uuid:bb28efdb-e55a-43e1-9ab3-14c8d5dc2344]

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
  - [Task A1: claudeCode MVC Boundary Audit](./task-a1-claudecode-mvc-boundary-audit.md)

## Description
**Role: oosh-tester**

Write tests that verify claudeCode has no boundary violations after the Expert completes the audit and refactoring:

1. **Grep-based static tests** — verify zero occurrences of `otmux`, `tmux send-keys`, `tmux capture-pane`, `hiveMind` in claudeCode source
2. **Runtime isolation tests** — verify claudeCode Model methods (session.current, context.read, pid) work without tmux running
3. **Interface purity tests** — verify Model methods return data via RESULT/RETURN_VALUE, not via pane output

Use the test.suite framework: `source test.suite $*` with `test.case` and `expect` patterns.

Key file: `/Users/donges/oosh/claudeCode`

---

*Sprint 0 - Lifecycle Consolidation*
*Epic A: claudeCode Model Layer*
