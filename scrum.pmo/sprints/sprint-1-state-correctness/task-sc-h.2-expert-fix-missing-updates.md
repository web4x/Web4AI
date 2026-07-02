[Back to SC-H](./task-sc-h-mvc-state-consistency.md)

# SC-H.2: Expert — Fix Commands That Skip Layers
[task:uuid:h1a2b3c4-e5f6-7890-cdef-mvc0fix00001]

## Status
- [x] Planned
- [x] In Progress
- [ ] QA Review — 3 commits: f707fa9 (Gap C events), e843391 (Gap B orphan prune), 1b2d59b (Gap A defer-probe)
- [ ] Done

## Traceability
- up: [SC-H: MVC State Consistency](./task-sc-h-mvc-state-consistency.md)
- blocked by: SC-H.1 (need audit first)

## Description

For every ❌ or ⚠️ cell in the SC-H.1 audit matrix:
1. Add the missing update call
2. Ensure all 3 layers are updated atomically
3. If the SC-B events system is wired, fire appropriate events
4. Handle partial failure: if pane creation succeeds but registry write fails, clean up the pane

DRY: if multiple commands need the same "update all layers" logic, extract a shared private helper.

Commit each fix separately with the cell reference (e.g., "team.setup: add teams.env write").
