[Back to Task B2](./task-b2-otmux-layout-persistence.md)

# Task B2.2: Expert - Pane Title/Layout Persistence
[task:uuid:10a9f8e3-fbe4-4c01-ba0a-bea413090742]

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement
  - [x] creating test cases
  - [x] implementing
  - [x] testing (round-trip verified: titles exactly preserved)
- [x] QA Review
- [ ] Done (pending B2.3 tester)

## Deliverable
Title save/restore integrated into B2.1's `layout.save` + `layout.restore` (same commit).
- Capture: `tmux display-message -p -t <pane> '#{pane_title}'`
- Restore: `tmux select-pane -t <pane> -T '<title>'`
- Stored as `OTMUX_WINDOW_<W>_PANE_<P>_TITLE` env var
- UTF-8 preserved (verified with live ooshTeam: ✳ product-owner, ✳ oosh-tester)

Full details in [task-b2-findings.md](./task-b2-findings.md).

## Traceability
- up
  - [Task B2: otmux Layout Persistence](./task-b2-otmux-layout-persistence.md)

## Description
**Role: oosh-expert**

Implement pane title persistence as part of the layout save/restore system:

1. **Title capture** — capture current pane titles using `tmux display-message -p -t <pane> '#{pane_title}'`
2. **Title restoration** — set pane titles after layout restore using `tmux select-pane -t <pane> -T '<title>'`
3. **Title-to-pane mapping** — ensure pane indices are consistent between save and restore so titles map to correct panes
4. **Integration with layout.save/restore** — titles are saved and restored as part of the layout file, not separately

Pane titles are critical for hiveMind: they contain agent role names used for agent-to-pane mapping during restore.

Key file: `/Users/donges/oosh/otmux`

---

*Sprint 0 - Lifecycle Consolidation*
*Epic B: otmux View Layer*
