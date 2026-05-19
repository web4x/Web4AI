[Back to Task B2](./task-b2-otmux-layout-persistence.md)

# Task B2.3: Tester - Server Restart Recovery Tests
[task:uuid:a3977661-3501-4b04-8d9e-27bad0c105fa]

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
**Role: oosh-tester**

Write tests verifying otmux layout save/restore works across tmux server restarts:

1. **Save/restore round-trip test** — create a layout, save it, kill the session, restore it, verify pane count and arrangement match
2. **Title persistence test** — verify pane titles survive save/restore cycle
3. **Dimension preservation test** — verify pane sizes are approximately correct after restore
4. **Multi-layout test** — save multiple session layouts, restore each independently
5. **Missing layout file test** — verify graceful error when layout file does not exist

Use the test.suite framework. Note: these tests require tmux and will create/destroy test sessions.

Key file: `/Users/donges/oosh/otmux`

---

*Sprint 0 - Lifecycle Consolidation*
*Epic B: otmux View Layer*
