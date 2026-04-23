[Back to Task A1](./task-a1-claudecode-mvc-boundary-audit.md)

# Task A1.1: Expert - Model Boundary Audit
[task:uuid:16d0acad-989a-4d45-ba3a-0b27fd61e5cd]

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
**Role: oosh-expert**

Grep the claudeCode script for all method calls, variable references, and source statements that cross MVC boundaries. Produce a categorized list of:

1. **Direct otmux calls** — any `otmux send`, `otmux pane.capture`, or `otmux` invocations
2. **Direct tmux calls** — any raw `tmux send-keys`, `tmux capture-pane`, or other tmux CLI usage
3. **hiveMind references** — any direct calls to hiveMind methods from within claudeCode
4. **Pane/window assumptions** — any code that assumes it is running inside a tmux pane

For each violation found, document: method name, line number, what it does, and where it should move (Controller or deleted).

Key file: `/Users/donges/oosh/claudeCode`

---

*Sprint 0 - Lifecycle Consolidation*
*Epic A: claudeCode Model Layer*
