[Back to Task SC-B](./task-sc-b-event-dispatch-infrastructure.md)

# Task SC-B.1: Expert — events.register/emit primitives
[task:uuid:88700d50-535b-4060-a776-b78cb6d77a34]

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

Implement the function-table dispatch primitives in hiveMind:
- `private.hiveMind.events.register <eventName> <handlerFunction>` — idempotent
- `private.hiveMind.events.emit <eventName> <arg1> <arg2> ...` — fan-out

## Requirements
- Backing store: associative array `HIVEMIND_EVENT_HANDLERS` keyed by event name,
  value is space-separated handler list (idempotent insert)
- Emit calls each handler in registration order
- Wrap each handler call: rc captured, failure logged via `error.log`,
  loop continues (U1 lock)
- Emit timestamp + event + args to `~/config/hivemind.events.log` (one line per emit)

## Key file
`/Users/donges/oosh/hiveMind`

*Sprint 1 · Epic SC-B*
