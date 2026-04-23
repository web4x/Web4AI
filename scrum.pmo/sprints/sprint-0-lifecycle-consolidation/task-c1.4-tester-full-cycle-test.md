[Back to Task C1](./task-c1-hivemind-cold-start-restore.md)

# Task C1.4: Tester - Full Cycle Test
[task:uuid:b56ac290-c297-41af-8cbd-9f8fd212b22b]

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
**Role: oosh-tester**

Write tests for the full save-restore lifecycle:

1. **Save completeness test** — after team.setup.full, verify all env files contain expected data
2. **Restore from config test** — delete tmux session, run team.restore, verify:
   - Correct number of panes created
   - Pane titles match saved roles
   - Team registry updated
3. **Idempotency test** — run team.restore twice, verify no duplicate panes or agents
4. **Partial failure test** — corrupt one env file, verify restore handles it gracefully
5. **Process discovery test** — verify restore finds running Claude processes (if any survive)

Use the test.suite framework. These tests will create/destroy test teams.

Key file: `/Users/donges/oosh/hiveMind`

---

*Sprint 0 - Lifecycle Consolidation*
*Epic C: hiveMind Controller Layer*
