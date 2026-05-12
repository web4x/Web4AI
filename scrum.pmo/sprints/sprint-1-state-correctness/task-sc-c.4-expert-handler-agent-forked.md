[Back to Task SC-C](./task-sc-c-event-handlers.md)

# Task SC-C.4: Expert — handler for `agent.forked`
[task:uuid:e6832325-3025-4a30-a9ab-29913f877413]

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

Register handler(s) for event `agent.forked` per sprint-1-design.md §4 catalog.
Wire emission at every mutation point that should fire this event.

## Acceptance
- `hiveMind events.history` shows the event fired at the right mutations
- Target state stores show correct mutation in audit (read-only verify)
- No crash on handler failure (per U1)

*Sprint 1 · Epic SC-C*
