[Back to Task E1](./task-e1-end-to-end-lifecycle-test.md)

# Task E1.2: Tester - Post-Restore Verification
[task:uuid:12ccc20c-6336-40b5-9a48-1642c795fbab]

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
  - [Task E1: End-to-End Lifecycle Test](./task-e1-end-to-end-lifecycle-test.md)

## Description
**Role: oosh-tester**

Write post-restore verification tests that confirm the restored team is fully functional:

1. **Model verification** — claudeCode can resolve session UUIDs for restored agents
2. **View verification** — otmux pane.capture works on restored panes, content is accessible
3. **Controller verification** — hiveMind team.status shows correct state for restored team
4. **Send/receive test** — otmux send to a restored pane delivers keystrokes correctly
5. **sweep.detect test** — sweep.detect correctly classifies restored agent states
6. **Multi-team verification** — if multiple teams existed, all are restored independently

These tests run immediately after E1.1's restore step to verify the restored team is not just structurally correct but operationally functional.

Key files: `/Users/donges/oosh/claudeCode`, `/Users/donges/oosh/otmux`, `/Users/donges/oosh/hiveMind`

---

*Sprint 0 - Lifecycle Consolidation*
*Epic E: Integration*
