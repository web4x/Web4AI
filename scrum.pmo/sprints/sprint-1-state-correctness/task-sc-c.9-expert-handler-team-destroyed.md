[Back to Task SC-C](./task-sc-c-event-handlers.md)

# Task SC-C.9: Expert — handler for `team.destroyed`
[task:uuid:888e8f0d-b14c-4828-9be1-510989f6bd83]

## Status
- [ ] Planned
- [ ] In Progress
  - [ ] refinement
  - [ ] creating test cases
  - [ ] implementing
  - [ ] testing
- [ ] QA Review
- [ ] Done

## Description
**Role: oosh-expert**

Register handler(s) for event `team.destroyed` per sprint-1-design.md §4 catalog.
Wire emission at every mutation point that should fire this event.

## Acceptance
- `hiveMind events.history` shows the event fired at the right mutations
- Target state stores show correct mutation in audit (read-only verify)
- No crash on handler failure (per U1)

*Sprint 1 · Epic SC-C*
