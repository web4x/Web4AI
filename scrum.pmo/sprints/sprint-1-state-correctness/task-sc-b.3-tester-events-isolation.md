[Back to Task SC-B](./task-sc-b-event-dispatch-infrastructure.md)

# Task SC-B.3: Tester — isolation + idempotency
[task:uuid:849f951c-a974-417f-a198-44afca1882da]

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
**Role: oosh-tester**

Test the dispatch primitives:
1. Registering same handler twice = one entry (idempotent)
2. Failing handler doesn't abort siblings (log+continue per U1)
3. Emit with no handlers = silent no-op, no error
4. Log rotation triggers at 1MB
5. Event names with invalid characters rejected

## Key file
`/Users/donges/oosh/test/test.events` (new)

*Sprint 1 · Epic SC-B*
