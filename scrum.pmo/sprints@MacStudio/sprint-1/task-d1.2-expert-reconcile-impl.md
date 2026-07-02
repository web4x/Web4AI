[Back to task-d1-reconcile-selfheal](./task-d1-reconcile-selfheal.md)

# D1.2 Expert — Declare + Reconcile Impl
[task:uuid:22d105ae-d88b-4c94-9251-eb34812f63b5]

## Status
- [x] Planned
- [x] In Progress
- [x] QA Review
- [x] Done

## Traceability
- up: [task-d1-reconcile-selfheal](./task-d1-reconcile-selfheal.md)

## Description
**Role: oosh-expert**

Implement shared `private.setup.server.declare` + `private.reconcile.check` + `private.reconcile.state.machine` (capture-by-name→rm→declare→state.set name/marker fallback→stamp). Caught+fixed `state machine.delete` running `oo cmd vim` (naked-box hang) via direct data-file rm. Cleanup stops swallowing stderr on stamp save.

**Commit(s):** `09d33c9 + 691a269`  (once.sh/dev)

---
*Sprint 1 @MacDonges*
