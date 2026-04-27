[Back to Task D1](./task-d1-tronmonitor-lifecycle-review.md)

# Task D1.2: Expert - Auto-Sync with hiveMind Registry
[task:uuid:42215eb1-e5bf-495e-845d-0903a9b799dd]

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement
  - [x] creating test cases (handed off to D1 tester sub-task)
  - [x] implementing — commit e66036f
  - [x] testing (live verified — drift detected & cleaned)
- [x] QA Review
- [x] Done

## Deliverable

**Commit:** `e66036f` (pushed to test/macos.latest)

**Approach chosen:** Option C (read from `hivemind.teams.env` directly).
Simplest, file-based single source of truth. No coupling to hiveMind events.

**New method:** `tronMonitor.sync <?dryRun>`
- Adds: live registered teams not yet tracked
- Drops: tracked entries not in registry (drift cleanup)
- Calls `prune` for dead-session cleanup
- `dry` preview mode shows changes without applying

**Helpers added:**
- `private.tronMonitor.registry.teams [onlyLive]` — read canonical list
- `private.tronMonitor.tracked.teams` — read local state

**setup() integration:** now calls `sync()` at end, ensuring tronMonitor always
matches registry after setup.

**Live test:** detected and cleaned drift (`fallback-agents` was in tronMonitor.env
but not in hivemind.teams.env). Subsequent sync was no-op as expected.

## Traceability
- up
  - [Task D1: tronMonitor Lifecycle Review](./task-d1-tronmonitor-lifecycle-review.md)

## Description
**Role: oosh-expert**

Design and implement auto-sync between tronMonitor and hiveMind's team registry:

1. **Sync direction** — tronMonitor reads from hiveMind (single source of truth), never the reverse
2. **Sync trigger options:**
   - Option A: tronMonitor polls hiveMind team.list periodically
   - Option B: hiveMind pushes changes to tronMonitor on team.register/team.remove (see D2)
   - Option C: tronMonitor reads teams.env directly (simpler but couples to file format)
3. **Sync reconciliation** — handle:
   - Teams in hiveMind but not in tronMonitor (add them)
   - Teams in tronMonitor but not in hiveMind (remove them)
   - Team state changes (updated agent count, status)
4. **Implement chosen approach** with focus on reliability over complexity

Key file: `/Users/donges/oosh/tronMonitor`

---

*Sprint 0 - Lifecycle Consolidation*
*Epic D: tronMonitor Monitor Layer*
