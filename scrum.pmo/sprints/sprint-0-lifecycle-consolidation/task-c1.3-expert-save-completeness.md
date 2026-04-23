[Back to Task C1](./task-c1-hivemind-cold-start-restore.md)

# Task C1.3: Expert - Save Completeness
[task:uuid:35416135-8160-4b35-9c81-8fd55002e449]

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

Ensure hiveMind saves all state needed for cold-restart restore:

1. **Audit team.save** (or equivalent) — verify it persists:
   - Team name and layout type
   - Agent-to-pane mappings
   - Session UUIDs for each agent
   - Agent PIDs
   - Bootstrap completion flags
   - Layout configuration (for otmux layout.save)
2. **Auto-save triggers** — ensure state is saved automatically on:
   - team.setup.full completion
   - agent.bootstrap completion
   - agent.spawn completion
   - agent.rename
   - Any operation that changes team state
3. **Save-on-shutdown** — if possible, hook tmux exit to trigger a final save

The principle: if the system saves correctly, restore (C1.2) just reads and rebuilds.

Key file: `/Users/donges/oosh/hiveMind`

---

*Sprint 0 - Lifecycle Consolidation*
*Epic C: hiveMind Controller Layer*
