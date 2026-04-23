[Back to Task B2](./task-b2-otmux-layout-persistence.md)

# Task B2.1: Expert - Layout Save/Restore Design
[task:uuid:b2198afb-ffa9-4875-a2f8-f01eb4f8efa8]

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
  - [Task B2: otmux Layout Persistence](./task-b2-otmux-layout-persistence.md)

## Description
**Role: oosh-expert**

Design and implement otmux methods for saving and restoring tmux layouts:

1. **layout.save <session>** — serialize current layout to file:
   - Pane count and split directions (horizontal/vertical)
   - Pane dimensions (percentages, not absolute pixels)
   - Pane titles
   - Window name
   - Save to `~/config/otmux/<session>.layout`
2. **layout.restore <session>** — recreate layout from saved file:
   - Create session/window if needed
   - Split panes in correct order and direction
   - Set dimensions to match saved percentages
   - Restore pane titles
3. **Format decision** — choose serialization format (env vars, JSON, or custom)

Keep it generic: save/restore any tmux layout, no agent-specific knowledge.

Key file: `/Users/donges/oosh/otmux`

---

*Sprint 0 - Lifecycle Consolidation*
*Epic B: otmux View Layer*
