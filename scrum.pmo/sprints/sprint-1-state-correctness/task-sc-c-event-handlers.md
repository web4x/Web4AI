[Back to Sprint 1 Design](./sprint-1-design.md)

# Task SC-C: Event handler implementation
[task:uuid:0daca527-9744-4fb2-9132-0ba60ae66d11]

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
- down: 10 handler implementations, one per event in §4 catalog
  - [SC-C.1 agent.spawned](./task-sc-c.1-expert-handler-agent-spawned.md)
  - [SC-C.2 agent.killed](./task-sc-c.2-expert-handler-agent-killed.md)
  - [SC-C.3 agent.renamed](./task-sc-c.3-expert-handler-agent-renamed.md)
  - [SC-C.4 agent.forked](./task-sc-c.4-expert-handler-agent-forked.md)
  - [SC-C.5 panes.shifted](./task-sc-c.5-expert-handler-panes-shifted.md)
  - [SC-C.6 panes.swapped](./task-sc-c.6-expert-handler-panes-swapped.md)
  - [SC-C.7 pane.moved](./task-sc-c.7-expert-handler-pane-moved.md)
  - [SC-C.8 team.created](./task-sc-c.8-expert-handler-team-created.md)
  - [SC-C.9 team.destroyed](./task-sc-c.9-expert-handler-team-destroyed.md)
  - [SC-C.10 team.restored](./task-sc-c.10-expert-handler-team-restored.md)
  - [SC-C.tests Tester — handler integration tests](./task-sc-c.tests-tester-handler-integration.md)

## Description
Wire every mutation to emit its event(s) and register handlers per §4 catalog.
Each event has 1+ handlers updating its target state stores.

## Depends on
SC-B (dispatch primitives must exist).

*Sprint 1 · Epic SC-C*
