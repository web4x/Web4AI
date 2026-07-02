[Back to SC-H](./task-sc-h-mvc-state-consistency.md)

# SC-H.3: Tester — MVC Consistency Invariant Tests
[task:uuid:h1a2b3c4-e5f6-7890-cdef-mvc0test0001]

## Status
- [ ] Planned
- [ ] In Progress
- [ ] QA Review
- [ ] Done

## Traceability
- up: [SC-H: MVC State Consistency](./task-sc-h-mvc-state-consistency.md)
- blocked by: SC-H.1 (need audit to know what to test)

## Description

Write tests that verify the MVC invariant: after ANY lifecycle command, all 3 layers agree.

For each testable command:
1. Run the command in a test session
2. Check roles.env has the entry
3. Check sessions.env has the UUID (if Claude started)
4. Check teams.env has the team (if team-level command)
5. Check pane title matches role
6. Run consistency.audit — must return 0 mismatches

Also test the NEGATIVE: manually break one layer (delete a registry entry), run consistency.fix, verify it repairs.

Test cleanup: use `__test_` prefix sessions, trap EXIT for cleanup.
