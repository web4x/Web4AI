[Back to Task D2](./task-d2-tronmonitor-hivemind-integration.md)

# Task D2.2: Expert - team.remove Triggers tronMonitor.remove
[task:uuid:5f1121f2-9718-4e3f-814a-0ab1886ec2ca]

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
