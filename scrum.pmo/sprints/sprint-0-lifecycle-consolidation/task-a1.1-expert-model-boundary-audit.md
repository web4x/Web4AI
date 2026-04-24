[Back to Task A1](./task-a1-claudecode-mvc-boundary-audit.md)

# Task A1.1: Expert - Model Boundary Audit
[task:uuid:16d0acad-989a-4d45-ba3a-0b27fd61e5cd]

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement
  - [x] creating test cases (handed off to A1.3 — zero-grep assertions defined in findings)
  - [x] implementing (audit complete — 2026-04-24)
  - [ ] testing (A1.3 tester pass required after A1.2 cleanup lands)
- [x] QA Review (findings ready for PO review)
- [ ] Done

## Deliverable
- Audit report: [task-a1.1-findings.md](./task-a1.1-findings.md)
- Total: 68 public methods classified
  - 47 Pure Model
  - 14 View leaks (otmux calls)
  - 4 Controller leaks (hiveMind + env writes)
  - 1 raw tmux (private.claudeCode.complete.panes)
  - 3 tmux assumptions (`$TMUX` / `TMUX_PANE`)
- Proposed Model surface: ~44 methods (reduction from 68)
- Fix priority list + test handoff criteria included

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
