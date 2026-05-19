[Back to Planning Sprint 0](./planning.md)

# Task C2: hiveMind DRY Remaining Audit
[task:uuid:d0c8896c-2a58-450d-b6c9-b80d17e2d1d5]

## Naming Conventions
- Tasks: `task-<epic><number>-<short-description>.md`
- Subtasks: `task-<epic><number>.<subnumber>-<role>-<short-description>.md`
- Subtasks must always indicate the affected role in the filename.
- Subtasks must be ordered to avoid blocking dependencies.

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
- Source: Sprint 0 - Lifecycle Consolidation, Epic C (Controller Layer)

  - up
    - [Sprint 0 Planning - Lifecycle Consolidation](./planning.md)

  - down
    - [Task C2.1: Expert - Inline UUID Discovery Grep](./task-c2.1-expert-inline-uuid-discovery-grep.md)
    - [Task C2.2: Expert - Raw tmux Call Grep](./task-c2.2-expert-raw-tmux-call-grep.md)
    - [Task C2.3: Tester - DRY Pattern Tests](./task-c2.3-tester-dry-pattern-tests.md)

## Task Description
Complete the DRY consolidation started in 02b4070. Audit hiveMind for remaining inline UUID discovery (should use session.current) and raw tmux calls (should use otmux). Every UUID lookup must go through claudeCode; every tmux operation must go through otmux.

## Context
The UUID DRY refactor (02b4070) centralized UUID resolution via session.current, but there may be remaining inline patterns. Similarly, hiveMind should delegate all tmux operations to otmux (View layer) rather than calling tmux directly.

Key file: `/Users/donges/oosh/hiveMind`

## Intention

### Why This Task Exists:
1. **DRY Completion:** Finish the consolidation started in 02b4070
2. **MVC Enforcement:** Controller must go through View for tmux, through Model for data
3. **Maintainability:** Single source of truth for UUID resolution and tmux operations

### Problems This Task Solves:
- **Scattered UUID resolution:** Inline UUID discovery duplicates session.current logic
- **Raw tmux calls:** Direct tmux commands bypass otmux's error handling and abstractions
- **Regression risk:** Without tests, DRY violations can silently return

### How This Task Solves These Problems:
- **Comprehensive grep:** Find all remaining inline patterns
- **Systematic replacement:** Replace each with proper layer call
- **Pattern tests:** Prevent regression with grep-based tests

---

*Sprint 0 - Lifecycle Consolidation*
*Epic C: hiveMind Controller Layer*
*Priority: 2 (HIGH - Code Quality)*
