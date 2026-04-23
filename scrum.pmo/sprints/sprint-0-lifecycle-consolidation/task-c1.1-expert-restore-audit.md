[Back to Task C1](./task-c1-hivemind-cold-start-restore.md)

# Task C1.1: Expert - Restore Audit
[task:uuid:9c20f03d-6a2d-4e7a-b1a5-b1f26148c216]

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

Audit the current hiveMind restore capabilities and document gaps:

1. **Existing restore methods** — identify what team.restore, team.setup, or similar methods exist today
2. **State file inventory** — document what is saved in roles.env, sessions.env, teams.env, forks.env
3. **Gap analysis** — compare what is saved vs what is needed for full restore:
   - Team name and member list
   - Agent roles and pane assignments
   - Session UUIDs and PIDs
   - Layout configuration (pane arrangement)
   - Bootstrap state (was agent bootstrapped?)
4. **Dependency map** — document what restore needs from claudeCode (Model) and otmux (View)

Key file: `/Users/donges/oosh/hiveMind`

---

*Sprint 0 - Lifecycle Consolidation*
*Epic C: hiveMind Controller Layer*
