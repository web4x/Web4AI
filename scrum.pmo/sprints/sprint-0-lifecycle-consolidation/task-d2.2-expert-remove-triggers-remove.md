[Back to Task D2](./task-d2-tronmonitor-hivemind-integration.md)

# Task D2.2: Expert - team.remove Triggers tronMonitor.remove
[task:uuid:5f1121f2-9718-4e3f-814a-0ab1886ec2ca]

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement
  - [x] creating test cases
  - [x] implementing (commit 597f93e)
  - [x] testing (live: remove scratch_d2_team → window 21 cleaned from tronMonitor.env)
- [x] QA Review
- [x] Done

## Deliverable
Commit `597f93e`: hiveMind.team.remove now fires `tronMonitor remove $session` BEFORE
removing from the registry (ordering matters — tronMonitor.remove needs findWindow to
resolve, which means the team must still be in registry at that moment). Soft-fail.

Verified round-trip: register → tronMonitor env gets entry; remove → entry cleaned.

## Traceability
- up
  - [Task D2: tronMonitor-hiveMind Integration](./task-d2-tronmonitor-hivemind-integration.md)

## Description
**Role: oosh-expert**

Add a tronMonitor.remove call to hiveMind's team removal lifecycle:

1. **Identify hook point** — find where hiveMind finalizes team removal (team.remove, team.destroy, or equivalent)
2. **Add tronMonitor.remove call** — after successful team removal, call `tronMonitor remove <teamName>`
3. **Guard conditions:**
   - Only call if tronMonitor is available (GNU screen running)
   - Handle tronMonitor.remove failure gracefully (log warning, do not fail team removal)
   - Idempotent: safe if tronMonitor does not have the team
4. **Prune integration** — ensure hiveMind prune operations also trigger tronMonitor cleanup

Key file: `/Users/donges/oosh/hiveMind`

---

*Sprint 0 - Lifecycle Consolidation*
*Epic D: tronMonitor Monitor Layer*
