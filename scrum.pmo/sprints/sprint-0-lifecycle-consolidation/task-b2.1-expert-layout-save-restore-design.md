[Back to Task B2](./task-b2-otmux-layout-persistence.md)

# Task B2.1: Expert - Layout Save/Restore Design
[task:uuid:b2198afb-ffa9-4875-a2f8-f01eb4f8efa8]

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement (6 design decisions documented in findings)
  - [x] creating test cases (8 assertions in shared findings for B2.3)
  - [x] implementing (methods written, format chosen, docs header added to code)
  - [x] testing (save/kill/restore round-trip verified, --force guard verified)
- [x] QA Review
- [ ] Done (pending B2.3 tester)

## Deliverable
**Findings:** [task-b2-findings.md](./task-b2-findings.md) — design + implementation combined
**Format:** env-file (OOSH convention) at `~/config/otmux/<session>.layout.env`
**Key design:** uses tmux native `#{window_layout}` string for geometry — no custom math

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
