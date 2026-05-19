[Back to Task C1](./task-c1-hivemind-cold-start-restore.md)

# Task C1.1: Expert - Restore Audit
[task:uuid:9c20f03d-6a2d-4e7a-b1a5-b1f26148c216]

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement
  - [x] creating test cases (8 assertions for C1.4)
  - [x] implementing (audit only — no code changes this task)
  - [x] testing (method inventory, state file survey, dependency map)
- [x] QA Review
- [ ] Done (pending C1.4 tester)

## Deliverable
**Findings:** [task-c1-findings.md](./task-c1-findings.md) (combined C1.1 + C1.2 + C1.3)
- 8 existing restore-related methods catalogued with cold-restart suitability
- 6 state files inventoried (roles/sessions/teams/forks/snapshot/NEW layouts from B2)
- Dependency map across claudeCode (Model) + otmux (View) + self (Controller)
- **Verdict:** all pieces exist; gap is composition — teams.save/restore doesn't use B2's new layout methods

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
