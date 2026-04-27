[Back to Planning Sprint 0](./planning.md)

# Task D1: tronMonitor Lifecycle Review
[task:uuid:f7d6865f-4937-445b-b095-8883b3f5a6f1]

## Naming Conventions
- Tasks: `task-<epic><number>-<short-description>.md`
- Subtasks: `task-<epic><number>.<subnumber>-<role>-<short-description>.md`
- Subtasks must always indicate the affected role in the filename.
- Subtasks must be ordered to avoid blocking dependencies.

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement
  - [x] creating test cases (live test sequence)
  - [x] implementing — D1.2 + D1.3 done in commit e66036f
  - [x] testing (live verified — drift cleanup + idempotency)
- [x] QA Review
- [ ] Done (D1.1 DRY audit pending — note: most DRY violations addressed by D1.2 sync; explicit audit could land later)

## Traceability
- Source: Sprint 0 - Lifecycle Consolidation, Epic D (Monitor Layer)

  - up
    - [Sprint 0 Planning - Lifecycle Consolidation](./planning.md)

  - down
    - [Task D1.1: Expert - DRY and Validation Audit](./task-d1.1-expert-dry-validation-audit.md)
    - [Task D1.2: Expert - Auto-Sync with hiveMind Registry](./task-d1.2-expert-auto-sync-hivemind-registry.md)
    - [Task D1.3: Expert - Idempotent Setup](./task-d1.3-expert-idempotent-setup.md)

## Task Description
Review tronMonitor's lifecycle methods for DRY violations, validation gaps, and idempotency. tronMonitor is Tron's visual interface using GNU screen, providing a single pane to see and switch between all agent teams. It must auto-sync with hiveMind's team registry.

## Context
tronMonitor provides Tron's monitoring view via GNU screen. Recent work (0594575) added add() validation and prune(). This task reviews the full lifecycle: setup, add, remove, prune, and their interaction with hiveMind's team registry.

Key file: `/Users/donges/oosh/tronMonitor`

## Intention

### Why This Task Exists:
1. **Monitor Reliability:** tronMonitor must accurately reflect team state
2. **DRY Compliance:** No duplicated logic between tronMonitor and hiveMind
3. **Idempotency:** Setup and add operations must be safe to repeat

### Problems This Task Solves:
- **Registry drift:** tronMonitor list may diverge from hiveMind team registry
- **Duplicate entries:** Non-idempotent add() can create duplicate team entries
- **Validation gaps:** Invalid team names or missing teams may not be caught

### How This Task Solves These Problems:
- **DRY audit:** Ensure tronMonitor delegates to hiveMind for team data
- **Auto-sync design:** tronMonitor reads from hiveMind registry, not its own copy
- **Idempotent methods:** All operations safe to repeat without side effects

---

*Sprint 0 - Lifecycle Consolidation*
*Epic D: tronMonitor Monitor Layer*
*Priority: 3 (NORMAL - Tron UX)*
