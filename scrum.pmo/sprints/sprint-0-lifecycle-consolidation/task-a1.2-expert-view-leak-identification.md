[Back to Task A1](./task-a1-claudecode-mvc-boundary-audit.md)

# Task A1.2: Expert - View Leak Identification
[task:uuid:c7e7a6ff-11d1-4ac4-b4c2-c17bf9ddf401]

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

From the boundary audit results (A1.1), identify specifically the View-layer leaks in claudeCode: methods or code paths where claudeCode directly interacts with display/pane concerns rather than just exposing data.

For each identified leak:
1. Document the current behavior (what the code does today)
2. Propose where the logic should live (hiveMind Controller or otmux View)
3. Define the clean Model interface that should replace it (e.g., a data method that returns values without sending them anywhere)

The goal is a refactoring plan that makes claudeCode a pure data provider with zero otmux.send calls.

Key file: `/Users/donges/oosh/claudeCode`

---

*Sprint 0 - Lifecycle Consolidation*
*Epic A: claudeCode Model Layer*
