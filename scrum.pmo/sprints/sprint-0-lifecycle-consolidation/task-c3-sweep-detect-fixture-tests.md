[Back to Planning Sprint 0](./planning.md)

# Task C3: sweep.detect Fixture Tests
[task:uuid:a91db34f-f844-4065-a1db-ea7291b5af49]

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
    - [Task C3.1: Expert - Remaining False Positive Audit](./task-c3.1-expert-remaining-false-positive-audit.md)
    - [Task C3.2: Expert - 18-State Test Fixtures](./task-c3.2-expert-18-state-test-fixtures.md)
    - [Task C3.3: Tester - Fixture-Based Detection Tests](./task-c3.3-tester-fixture-based-detection-tests.md)

## Task Description
Build fixture-based tests for hiveMind's sweep.detect method covering all 18 agent states. sweep.detect determines agent status (active, idle, stuck, dead, etc.) from pane output patterns. Previous false-positive fixes (eca047a, b3a63ae) addressed specific cases; this task creates comprehensive fixture coverage.

## Context
sweep.detect analyzes pane capture output to classify agent state. It has had recurring false-positive issues where normal output patterns were misclassified. Fixtures provide reproducible test inputs for each state, ensuring detection accuracy without requiring live agents.

The 18 states represent combinations of: active/idle/stuck/dead x various output patterns (permission prompt, error, working, waiting, etc.).

Key file: `/Users/donges/oosh/hiveMind`

## Intention

### Why This Task Exists:
1. **Monitoring Reliability:** sweep.detect must accurately classify agent states
2. **Regression Prevention:** Fixture tests prevent false-positive regressions
3. **Complete Coverage:** All 18 states need explicit test cases

### Problems This Task Solves:
- **False positives:** Normal output misclassified as stuck/dead
- **Untestable detection:** Currently requires live agents to test
- **Partial coverage:** Only fixed states have been tested, not all 18

### How This Task Solves These Problems:
- **Fixture capture:** Real pane output samples for each state
- **Deterministic testing:** Same input always produces same classification
- **Full coverage:** Every state has at least one fixture

---

*Sprint 0 - Lifecycle Consolidation*
*Epic C: hiveMind Controller Layer*
*Priority: 2 (HIGH - Monitoring Reliability)*
