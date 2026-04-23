[Back to Task E1](./task-e1-end-to-end-lifecycle-test.md)

# Task E1.1: Tester - Setup-Save-Kill-Restore Cycle
[task:uuid:3851bb08-8fb4-44aa-95c4-ad73cc3cbf06]

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
  - [Task E1: End-to-End Lifecycle Test](./task-e1-end-to-end-lifecycle-test.md)

## Description
**Role: oosh-tester**

Write the core end-to-end lifecycle test:

1. **Setup** — use `hiveMind team.setup.full` to create a test team with 4 agents
2. **Verify setup** — confirm panes exist, agents are bootstrapped, roles assigned
3. **Save** — trigger state save (team.save or equivalent), verify env files written
4. **Kill** — destroy the tmux session (simulating server death): `tmux kill-session -t <testTeam>`
5. **Verify death** — confirm tmux session is gone, panes destroyed
6. **Restore** — run `hiveMind team.restore <testTeam>`
7. **Verify restore** — confirm:
   - tmux session recreated with correct pane layout
   - Pane titles match saved roles
   - Agent registry updated
   - Team appears in hiveMind team.list

Use a dedicated test team name to avoid interfering with real teams. Clean up after test.

Key files: `/Users/donges/oosh/hiveMind`, `/Users/donges/oosh/otmux`

---

*Sprint 0 - Lifecycle Consolidation*
*Epic E: Integration*
