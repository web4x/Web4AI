[Back to Task D2](./task-d2-tronmonitor-hivemind-integration.md)

# Task D2.1: Expert - team.register Triggers tronMonitor.add
[task:uuid:6da05389-e22a-4927-8287-f4c3f5ffc9d2]

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement
  - [x] creating test cases
  - [x] implementing (commit 597f93e)
  - [x] testing (live: register scratch_d2_team → added as window 21)
- [x] QA Review
- [x] Done

## Deliverable
Commit `597f93e`: hiveMind.team.register now fires `tronMonitor add $session` after
registration succeeds. Soft-fail — `command -v tronMonitor >/dev/null && ... || info.log`
— monitoring is enhancement, not prerequisite.

Observer pattern, same shape as otmux.session.rename → hiveMind.protected.session.renamed.

## Traceability
- up
  - [Task D2: tronMonitor-hiveMind Integration](./task-d2-tronmonitor-hivemind-integration.md)

## Description
**Role: oosh-expert**

Add a tronMonitor.add call to hiveMind's team registration lifecycle:

1. **Identify hook point** — find where hiveMind finalizes team registration (team.register, team.setup.full completion, or equivalent)
2. **Add tronMonitor.add call** — after successful team registration, call `tronMonitor add <teamName>`
3. **Guard conditions:**
   - Only call if tronMonitor is available (GNU screen running)
   - Handle tronMonitor.add failure gracefully (log warning, do not fail team registration)
   - Idempotent: safe if tronMonitor already has the team
4. **Restore integration** — ensure team.restore also triggers tronMonitor.add for each restored team

Key file: `/Users/donges/oosh/hiveMind`

---

*Sprint 0 - Lifecycle Consolidation*
*Epic D: tronMonitor Monitor Layer*
