[Back to Planning Sprint 0](./planning.md)

# Task A1: claudeCode MVC Boundary Audit
[task:uuid:d54f0992-0423-4b28-8a58-3e8305963636]

## Naming Conventions
- Tasks: `task-<epic><number>-<short-description>.md`
- Subtasks: `task-<epic><number>.<subnumber>-<role>-<short-description>.md` (e.g., `task-a1.1-expert-model-boundary-audit.md`)
- Subtasks must always indicate the affected role in the filename.
- Subtasks must be ordered to avoid blocking dependencies. If a blocking dependency is unavoidable, the Scrum Master is responsible for removing the impediment by reordering or splitting tasks.

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
- Source: Sprint 0 - Lifecycle Consolidation, Epic A (Model Layer)

  - up
    - [Sprint 0 Planning - Lifecycle Consolidation](./planning.md)

  - down
    - [Task A1.1: Expert - Model Boundary Audit](./task-a1.1-expert-model-boundary-audit.md)
    - [Task A1.2: Expert - View Leak Identification](./task-a1.2-expert-view-leak-identification.md)
    - [Task A1.3: Tester - Boundary Violation Tests](./task-a1.3-tester-boundary-violation-tests.md)

## Task Description
Audit the claudeCode script to verify it functions as a pure Model layer. Identify any direct calls to otmux (View) or hiveMind (Controller) that violate MVC boundaries. The Model must expose agent data (session UUID via session.current, context %, PID, JSONL) without knowledge of how or where it is displayed.

## Context
claudeCode is the Model in the MVC architecture. It should provide agent data operations (session UUID, context %, PID, JSONL) without any dependency on tmux panes or controller logic. Any `otmux.send`, `otmux.capture`, or direct tmux calls within claudeCode represent boundary violations that must be identified and refactored.

Key file: `/Users/donges/oosh/claudeCode`

## Intention

### Why This Task Exists:
1. **MVC Purity:** claudeCode must be a clean Model layer with no View or Controller coupling
2. **Portability Foundation:** A pure Model can operate without tmux (required for cold restart)
3. **Testability:** Model methods should be testable without tmux infrastructure

### Problems This Task Solves:
- **Cross-layer coupling:** claudeCode may contain direct otmux or tmux calls
- **Untestable methods:** Methods that require tmux cannot be unit-tested in isolation
- **Cold restart blocking:** View dependencies prevent Model from operating during restore

### How This Task Solves These Problems:
- **Boundary audit:** Systematic grep for all cross-layer calls
- **Leak identification:** Categorize each violation by type and severity
- **Refactoring plan:** Document what needs to move to hiveMind (Controller)

---

*Sprint 0 - Lifecycle Consolidation*
*Epic A: claudeCode Model Layer*
*Priority: 1 (CRITICAL - Foundation)*
