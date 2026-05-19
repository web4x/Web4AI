[Back to Planning Sprint 0](./planning.md)

# Task D2: tronMonitor-hiveMind Integration
[task:uuid:105319a4-1669-468d-b9e2-6c91007c17a3]

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
- Source: Sprint 0 - Lifecycle Consolidation, Epic D (Monitor Layer)

  - up
    - [Sprint 0 Planning - Lifecycle Consolidation](./planning.md)

  - down
    - [Task D2.1: Expert - team.register Triggers tronMonitor.add](./task-d2.1-expert-register-triggers-add.md)
    - [Task D2.2: Expert - team.remove Triggers tronMonitor.remove](./task-d2.2-expert-remove-triggers-remove.md)
    - [Task D2.3: Tester - Integration Tests](./task-d2.3-tester-integration-tests.md)

## Task Description
Wire hiveMind team lifecycle events to tronMonitor: when a team is registered in hiveMind, tronMonitor automatically adds a monitoring window; when a team is removed, tronMonitor removes it. This is the event-driven integration between Controller and Monitor.

## Context
Currently tronMonitor may need manual add/remove calls. With this integration, hiveMind's team.register and team.remove automatically trigger tronMonitor updates, keeping the monitoring view in sync without manual intervention.

Key files: `/Users/donges/oosh/hiveMind`, `/Users/donges/oosh/tronMonitor`

## Intention

### Why This Task Exists:
1. **Automatic Sync:** No manual tronMonitor management needed
2. **Event-Driven Architecture:** Controller pushes state changes to Monitor
3. **Cold Restart Support:** After restore, tronMonitor auto-adds restored teams

### Problems This Task Solves:
- **Manual sync burden:** Must manually add/remove teams in tronMonitor
- **State drift:** tronMonitor can get out of sync with hiveMind
- **Restore gap:** After cold restart, tronMonitor does not know about restored teams

### How This Task Solves These Problems:
- **Hook pattern:** hiveMind calls tronMonitor.add/remove at lifecycle boundaries
- **Idempotent hooks:** Safe to call even if tronMonitor already has/lacks the team
- **Restore integration:** team.restore triggers tronMonitor.add for each restored team

---

*Sprint 0 - Lifecycle Consolidation*
*Epic D: tronMonitor Monitor Layer*
*Priority: 3 (NORMAL - Event Wiring)*
