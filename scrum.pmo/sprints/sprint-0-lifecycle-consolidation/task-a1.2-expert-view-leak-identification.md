[Back to Task A1](./task-a1-claudecode-mvc-boundary-audit.md)

# Task A1.2: Expert - View Leak Identification
[task:uuid:c7e7a6ff-11d1-4ac4-b4c2-c17bf9ddf401]

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement (inherits A1.1 audit classification)
  - [x] creating test cases (handoff to A1.3 — 6 zero-grep/zero-tmux assertions defined in findings)
  - [x] implementing (refactor plan complete — no code changes yet; plan only)
  - [ ] testing (A1.3 tester pass required after fixes land)
- [x] QA Review (findings ready — 13 leaks documented with per-leak target layer + pure Model API replacement)
- [ ] Done

## Deliverable
- Refactor plan: [task-a1.2-findings.md](./task-a1.2-findings.md)
- 13 View leaks enumerated with: current behavior, target layer, clean Model interface
- Proposed Model API (40 methods, down from 68) with new pure parsers:
  - `session.probe.fromCapture <text>`
  - `context.read.fromCapture <text>`
  - `model.parse.statusBar <text>`
  - `process.find.byTty <tty>`, `process.running.byPid <pid>`
  - `session.current.byTty <tty>`, `session.state.byUuid <uuid>`
  - `context.read.byUuid <uuid>`, `context.velocity.byUuid <uuid>`
- 6 test-handoff criteria for A1.3 tester (zero-grep assertions + TMUX= fixture tests)
- Migration safety: backward-compat shims documented for transition period

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
