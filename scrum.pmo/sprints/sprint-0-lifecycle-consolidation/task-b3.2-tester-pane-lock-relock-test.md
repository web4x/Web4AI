[Back to Task B3](./task-b3-otmux-pane-lock-idempotent.md)

# Task B3.2: Tester - pane.lock relock test
[task:uuid:5da8b432-bdad-4f8b-8fb1-bbe15355f18f]

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
  - [Task B3: otmux pane.lock idempotent relock](./task-b3-otmux-pane-lock-idempotent.md)

## Description
**Role: oosh-tester**

Test that `otmux pane.lock` idempotent relock works correctly:

1. **Lock initial:** `otmux pane.lock <target> "title-1"` -- verify title is "title-1"
2. **Relock different title:** `otmux pane.lock <target> "title-2"` -- verify title changed to "title-2" without manual unlock
3. **Relock original:** `otmux pane.lock <target> "title-1"` -- verify title reverted to "title-1"
4. **Verify lock persistence:** After relock, confirm the new title persists (is not overwritten by a stale hook)
5. **Edge case:** Lock an unlocked pane, then relock -- both should succeed

The test validates that commit 75ab018 correctly auto-unlocks before relocking.

Key file: `/Users/donges/oosh/otmux`

---

*Sprint 0 - Lifecycle Consolidation*
*Epic B: otmux View Layer*
