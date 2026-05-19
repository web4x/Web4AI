[Back to Planning Sprint 0](./planning.md)

# Task B1: otmux MVC Boundary Audit
[task:uuid:5de71970-a593-43b5-9e38-07677c16036b]

## Naming Conventions
- Tasks: `task-<epic><number>-<short-description>.md`
- Subtasks: `task-<epic><number>.<subnumber>-<role>-<short-description>.md`
- Subtasks must always indicate the affected role in the filename.
- Subtasks must be ordered to avoid blocking dependencies.

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement
  - [x] creating test cases (test-handoff criteria defined for B1.3)
  - [x] implementing (audit + decision only; code fixes deferred to implementation tasks)
  - [x] testing (grep audit, layer analysis)
- [x] QA Review
- [ ] Done (pending B1.3 tester)

## Deliverable
**Findings:** [task-b1-findings.md](./task-b1-findings.md) — combined B1.1 + B1.2

**Summary:**
- 5 leaks catalogued, fix priorities assigned
- B1.2 decision: Option B (Controller wraps View — hiveMind.send.message builds prefix)
- Target view surface confirmed: ~95% of 2306 lines are already pure tmux wrappers
- Metrics table before/after for tester to validate

**Related tasks:** B1.3 (tester coverage), future implementation tasks to execute the 5 fix priorities.

## Traceability
- Source: Sprint 0 - Lifecycle Consolidation, Epic B (View Layer)

  - up
    - [Sprint 0 Planning - Lifecycle Consolidation](./planning.md)

  - down
    - [Task B1.1: Expert - Controller/Model Leak Identification](./task-b1.1-expert-controller-model-leak-identification.md)
    - [Task B1.2: Expert - Sender Prefix Layer Decision](./task-b1.2-expert-sender-prefix-layer-decision.md)
    - [Task B1.3: Tester - Boundary Violation Tests](./task-b1.3-tester-boundary-violation-tests.md)

## Task Description
Audit the otmux script to verify it functions as a pure View layer. otmux should be a tmux wrapper providing pane management (split, capture, send, lock, tree) with zero knowledge of agents, sessions, or controller logic. Any references to claudeCode, hiveMind, or agent-specific logic represent boundary violations.

## Context
otmux is the View in the MVC architecture. It wraps tmux operations: creating panes, capturing output, sending keystrokes, managing layouts. It must not know about agent roles, session UUIDs, or orchestration state. The `otmux send` method sends keystrokes to a pane by address -- it should not know or care what is running in that pane.

Key file: `/Users/donges/oosh/otmux`

## Intention

### Why This Task Exists:
1. **View Purity:** otmux must be a clean tmux wrapper with no Model/Controller coupling
2. **Reusability:** A pure View can be used for any tmux workflow, not just agent teams
3. **Layer Separation:** Clear boundary prevents otmux from accumulating agent-specific logic

### Problems This Task Solves:
- **Agent knowledge leaks:** otmux may contain references to claudeCode or hiveMind
- **Session coupling:** View methods may depend on agent session state
- **Controller logic in View:** Orchestration decisions embedded in pane management

### How This Task Solves These Problems:
- **Systematic grep audit:** Find all cross-layer references
- **Leak categorization:** Determine what belongs in Controller vs View
- **Clean interface definition:** Document what otmux should and should not do

---

*Sprint 0 - Lifecycle Consolidation*
*Epic B: otmux View Layer*
*Priority: 2 (HIGH - Layer Purity)*
