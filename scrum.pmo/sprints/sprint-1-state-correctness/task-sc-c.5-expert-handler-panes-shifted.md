[Back to Task SC-C](./task-sc-c-event-handlers.md)

# Task SC-C.5: Expert — handler for `panes.shifted`
[task:uuid:7da6ec8b-cb1b-4f64-9fa9-2aa088d5d96e]

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

Register handler(s) for event `panes.shifted` per sprint-1-design.md §4 catalog.
Wire emission at every mutation point that should fire this event.

## Acceptance
- `hiveMind events.history` shows the event fired at the right mutations
- Target state stores show correct mutation in audit (read-only verify)
- No crash on handler failure (per U1)

*Sprint 1 · Epic SC-C*
