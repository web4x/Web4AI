[Back to Task D1](./task-d1-tronmonitor-lifecycle-review.md)

# Task D1.3: Expert - Idempotent Setup
[task:uuid:46ea7f7d-6aed-4d90-9df4-b621b4a596d4]

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement
  - [x] creating test cases (live multi-call test sequence)
  - [x] implementing — commit e66036f (bundled with D1.2)
  - [x] testing (verified: setup×2, sync×2, remove non-tracked all idempotent)
- [x] QA Review
- [x] Done

## Deliverable

**Commit:** `e66036f` (pushed)

**Idempotency changes:**

| Method | Before | After |
|--------|--------|-------|
| `setup` | Destructive — kill screen + clear env + restart | No-op if screen alive on right pane; runs `sync` instead |
| `add` | Already idempotent (checks `findWindow` first) | Unchanged |
| `remove` | Errored with rc=1 if team not tracked | Silent `info.log` + rc=0 |
| `prune` | Already idempotent | Unchanged |

**Destructive reset still available** via existing `tronMonitor.reset` method.

**Live test sequence (all passed):**
```
tronMonitor sync           # cleaned drift (fallback-agents removed)
tronMonitor sync           # no-op — already in sync
tronMonitor setup          # no-op — "already set up"
tronMonitor remove ghost   # no-op — silent
```

## Traceability
- up
  - [Task D1: tronMonitor Lifecycle Review](./task-d1-tronmonitor-lifecycle-review.md)

## Description
**Role: oosh-expert**

Ensure tronMonitor setup and add operations are idempotent:

1. **setup()** — calling setup when already set up should be a no-op:
   - Check if GNU screen session already exists
   - If exists, reuse it; if not, create it
   - Never create duplicate screen sessions
2. **add()** — calling add for an already-added team should be a no-op:
   - Check if team already has a screen window
   - If exists, skip; if not, create window
   - Never create duplicate team windows
3. **remove()** — calling remove for an already-removed team should be a no-op:
   - Check if team window exists
   - If not, skip silently; if exists, remove it
4. **Test each method** is safe to call multiple times in sequence

Key file: `/Users/donges/oosh/tronMonitor`

---

*Sprint 0 - Lifecycle Consolidation*
*Epic D: tronMonitor Monitor Layer*
