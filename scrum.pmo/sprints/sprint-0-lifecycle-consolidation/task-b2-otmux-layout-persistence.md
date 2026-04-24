[Back to Planning Sprint 0](./planning.md)

# Task B2: otmux Layout Persistence
[task:uuid:de48100e-adb6-4f75-a3f0-82f823a657be]

## Naming Conventions
- Tasks: `task-<epic><number>-<short-description>.md`
- Subtasks: `task-<epic><number>.<subnumber>-<role>-<short-description>.md`
- Subtasks must always indicate the affected role in the filename.
- Subtasks must be ordered to avoid blocking dependencies.

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement
  - [x] creating test cases (8 assertions in shared findings for B2.3)
  - [x] implementing (5 methods: layout.save/restore/list/show/delete)
  - [x] testing (save/kill/restore round-trip + --force guard verified)
- [x] QA Review
- [ ] Done (pending B2.3 tester)

## Deliverable
**Implementation:** 145 lines added to `/Users/donges/oosh/otmux` (new LAYOUT PERSISTENCE section)
**Findings:** [task-b2-findings.md](./task-b2-findings.md) (combined B2.1 + B2.2)
**Methods shipped:**
- `otmux layout.save <session>` — serialize layout + titles + cwds
- `otmux layout.restore <session> <?--force>` — recreate from saved
- `otmux layout.list` — table of saved layouts
- `otmux layout.show <session>` — cat saved file
- `otmux layout.delete <session>` — remove saved file

**View-purity preserved:** zero claudeCode/hiveMind/HIVEMIND_* refs in new code.
**Unblocks C1:** hiveMind cold-start restore can compose `otmux layout.restore` + `hiveMind teams.restore`.

## Traceability
- Source: Sprint 0 - Lifecycle Consolidation, Epic B (View Layer)

  - up
    - [Sprint 0 Planning - Lifecycle Consolidation](./planning.md)

  - down
    - [Task B2.1: Expert - Layout Save/Restore Design](./task-b2.1-expert-layout-save-restore-design.md)
    - [Task B2.2: Expert - Pane Title/Layout Persistence](./task-b2.2-expert-pane-title-layout-persistence.md)
    - [Task B2.3: Tester - Server Restart Recovery Tests](./task-b2.3-tester-server-restart-recovery-tests.md)

## Task Description
Enable otmux to save and restore tmux layouts (pane splits, sizes, titles) so that after a tmux server death, hiveMind can recreate the exact pane arrangement. This is a View-layer capability: otmux saves/restores the visual structure, hiveMind decides what goes in each pane.

## Context
When tmux server dies, all pane layout information is lost. hiveMind needs to recreate the team layout (e.g., 4-pane teacher/expert/tester/scrummaster arrangement). otmux should provide generic layout save/restore methods that work with any layout, not just agent teams.

Key file: `/Users/donges/oosh/otmux`

## Intention

### Why This Task Exists:
1. **Cold Restart Visual Recovery:** Recreate pane layout after tmux death
2. **View-Layer Responsibility:** Layout is visual concern, belongs in otmux
3. **Generic Reusability:** Layout save/restore useful beyond agent teams

### Problems This Task Solves:
- **Layout loss on crash:** tmux server death destroys all pane arrangements
- **Manual recreation:** Currently must manually split panes after restart
- **Inconsistent layouts:** No guarantee restored layout matches original

### How This Task Solves These Problems:
- **Layout serialization:** Save pane dimensions, splits, titles to file
- **Layout restoration:** Recreate exact pane arrangement from saved state
- **Title preservation:** Restore pane titles for hiveMind agent identification

---

*Sprint 0 - Lifecycle Consolidation*
*Epic B: otmux View Layer*
*Priority: 2 (HIGH - Cold Restart)*
