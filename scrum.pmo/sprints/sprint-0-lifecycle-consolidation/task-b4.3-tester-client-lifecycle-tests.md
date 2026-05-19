[Back to Task B4](./task-b4-otmux-client-lifecycle.md)

# Task B4.3: Tester - client lifecycle tests
[task:uuid:99f94ad7-4f7b-4f62-8025-6c8e81d48b47]

## Status
- [x] Planned
- [ ] In Progress
  - [ ] refinement
  - [ ] creating test cases
  - [ ] implementing
  - [ ] testing
- [ ] QA Review
- [ ] Done

## Traceability
- up
  - [Task B4: otmux client lifecycle](./task-b4-otmux-client-lifecycle.md)

## Description
**Role: oosh-tester**

Test that otmux client lifecycle methods work correctly:

1. **Attach -r read-only:**
   - Attach to a session with readonly mode
   - Verify the client cannot send keystrokes to panes
   - Verify pane content is still visible (read works)

2. **Window-size largest:**
   - Create a session with window-size largest set
   - Attach a second client with a smaller terminal size
   - Verify panes are NOT resized to the smaller client
   - Verify the larger client retains full pane dimensions

3. **Combined:**
   - Attach readonly from a smaller terminal
   - Verify both: no input accepted AND no resize

4. **Persistence:**
   - Set window-size largest, detach all clients, reattach
   - Verify the setting persists across attach/detach cycles

Key file: `/Users/donges/oosh/otmux`

---

*Sprint 0 - Lifecycle Consolidation*
*Epic B: otmux View Layer*
