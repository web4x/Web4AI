[Back to Task C1](./task-c1-hivemind-cold-start-restore.md)

# Task C1.2: Expert - Config-Only Restore
[task:uuid:45074dfb-f21d-4a17-bb39-e2fff3d0fb28]

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
  - [Task C1: hiveMind Cold-Start Restore](./task-c1-hivemind-cold-start-restore.md)

## Description
**Role: oosh-expert**

Implement hiveMind team.restore that rebuilds a team purely from config files:

1. **Read team state** from teams.env (team name, member list, layout type)
2. **Recreate layout** via otmux layout.restore (pane arrangement)
3. **Discover processes** via claudeCode for each saved session UUID:
   - If Claude process still running: re-attach to new pane
   - If Claude process dead: spawn new Claude in pane, resume session if possible
4. **Restore roles** — set pane titles, update roles.env mappings
5. **Restore monitoring** — re-enable sweep.detect for restored team
6. **Update registry** — ensure teams.env reflects the restored state

The restore must be idempotent: running it twice should not create duplicate panes or agents.

Key file: `/Users/donges/oosh/hiveMind`

---

*Sprint 0 - Lifecycle Consolidation*
*Epic C: hiveMind Controller Layer*
