[Back to Task C1](./task-c1-hivemind-cold-start-restore.md)

# Task C1.3: Expert - Save Completeness
[task:uuid:35416135-8160-4b35-9c81-8fd55002e449]

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement (gap analysis complete)
  - [x] creating test cases (save-completeness tests in C1.4 bundle)
  - [x] implementing (AUDIT ONLY — fixes deferred to implementation task)
  - [x] testing (compared current fields vs needed fields for cold-restart)
- [x] QA Review
- [ ] Done (pending implementation task)

## Deliverable
**Gap analysis:** [task-c1-findings.md](./task-c1-findings.md) — "C1.3 Save Completeness Gap Analysis"

**Missing data (7 gaps):**
1. Layout geometry (fix: integrate `otmux layout.save` from B2)
2. Per-pane working directory
3. Model flag (opus/opus[1m]/sonnet/haiku)
4. Team metadata (already in `hivemind.teams.env`, not in snapshot)
5. Bootstrap completion flag
6. Shell-pane classification (currently implicit via "dead" marker)
7. Window names (only session+address captured, not window name)

**Proposed extended snapshot schema** (backward-compatible):
```
session|address|role|uuid|title|cwd|model|bootstrapped|kind
```

**Proposed auto-save triggers:**
- `team.setup.full` completion
- `agent.bootstrap` completion
- `team.register` completion
- (Optional future) periodic + pre-exit hook

Sprint principle: "if save is correct, restore just reads and rebuilds."

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
