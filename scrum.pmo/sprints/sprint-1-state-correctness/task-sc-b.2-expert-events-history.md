[Back to Task SC-B](./task-sc-b-event-dispatch-infrastructure.md)

# Task SC-B.2: Expert — events.history + log rotation
[task:uuid:81333d9c-059b-4ed8-9f46-d2512ab20523]

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

Expose log inspection via `hiveMind events.history <?lines:50>` and
`hiveMind events.list` (registered handlers).

## Requirements
- `events.history` tails the log file (`~/config/hivemind.events.log`)
- `events.list` prints registered events + handler counts
- Log rotation at 1MB (rename to `.1`, drop `.2`)

*Sprint 1 · Epic SC-B*
