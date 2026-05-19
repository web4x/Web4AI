[Back to Task C1](./task-c1-hivemind-cold-start-restore.md)

# Task C1.2: Expert - Config-Only Restore
[task:uuid:45074dfb-f21d-4a17-bb39-e2fff3d0fb28]

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement (design complete)
  - [x] creating test cases (8 assertions for C1.4 in shared findings)
  - [x] implementing (DESIGN ONLY — code changes deferred per sprint rule: document before implement)
  - [ ] testing (awaits implementation + tester C1.4)
- [x] QA Review (design + test criteria ready)
- [ ] Done (pending implementation task + C1.4 tester)

## Deliverable
**Design:** [task-c1-findings.md](./task-c1-findings.md) — "C1.2 Config-Only Restore Design" section

**Proposed cold-restart flow:**
1. Read snapshot → group by session
2. Per session: `otmux layout.restore <session>` (B2 — exact geometry)
3. Per agent: skip if shell-kind; else `claudeCode fork/join.byID <uuid>` with saved cwd + model flag
4. Poll `claudeCode process.running` instead of hardcoded `sleep 5`
5. Register team in `hivemind.teams.env`
6. Idempotency: if session exists with expected layout, skip layout restore, only re-apply titles + registry

**Split of responsibility** clearly documented — each MVC layer owns its scope, Controller composes.

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
