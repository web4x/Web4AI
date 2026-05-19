[Back to Sprint 1 Design](./sprint-1-design.md)

# Task SC-B: Event dispatch infrastructure
[task:uuid:33c28433-7756-4241-b8f8-c61fff3fd3d6]

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
- up: [Sprint 1 Design](./sprint-1-design.md)
- down:
  - [Task SC-B.1: Expert — events.register/emit primitives](./task-sc-b.1-expert-events-primitives.md)
  - [Task SC-B.2: Expert — events.history + log rotation](./task-sc-b.2-expert-events-history.md)
  - [Task SC-B.3: Tester — isolation + idempotency](./task-sc-b.3-tester-events-isolation.md)

## Description
Implement `private.hiveMind.events.register` and `private.hiveMind.events.emit`
per consolidated design §4. In-process function-table dispatch (not subprocess
for hiveMind-internal events). Subprocess pattern via `hiveMind protected.<event>`
kept for cross-script observers (otmux/tronMonitor → hiveMind).

## Constraints (locked)
- Handler registration idempotent
- Handler errors isolated (failing handler logs, doesn't abort siblings)
- Event names versionable (`event.v2` for breaking changes)
- Per U1: log+continue on handler failure (don't roll back the mutation)

*Sprint 1 · Epic SC-B*
