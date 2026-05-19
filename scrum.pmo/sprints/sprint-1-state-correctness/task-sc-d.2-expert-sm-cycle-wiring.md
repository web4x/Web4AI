[Back to Task SC-D](./task-sc-d-reconcile-cycle.md)

# Task SC-D.2: Expert — scrumMaster.cycle wiring
[task:uuid:de26c87a-8ce0-4851-a9a6-56f404c5d6c6]

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

Wire `scrumMaster cycle` to call `hiveMind consistency.reconcile --apply`
when sweep is stable (no active mutations in flight).

## Stability gate
Skip reconcile if any of:
- Sweep just detected permission-prompt activity (mutation likely incoming)
- Any agent rc != 'idle' in the last cycle
- Active fork/restore in progress (detected via process args)

*Sprint 1 · Epic SC-D*
