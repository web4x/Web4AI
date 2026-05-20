[Back to Task SC-C](./task-sc-c-event-handlers.md)

# Task SC-C.1: Expert — handler for `agent.spawned`
[task:uuid:44d2acc9-e7dc-49c7-a4ff-3f88309fbfca]

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement
  - [x] creating test cases (handed off to SC-C.tests)
  - [x] implementing — commit `1ed429c` (bundled with SC-C.2)
  - [x] testing (live: spawn emit → both stores updated; events.history shows event)
- [x] QA Review
- [ ] Done (pending SC-C.tests integration coverage)

## Deliverable

**Commit:** `1ed429c` (bundled with SC-C.2 per PO "ship in batches")

**Handlers registered** (`private.hiveMind.events.register` at script-load):
- `private.hiveMind.handler.agent.spawned.registry` → `registry.set <pane> <role>`
- `private.hiveMind.handler.agent.spawned.sessions` → `session.store <pane> <uuid>` (no-op if uuid empty)

**Payload:** `<pane> <role> <?uuid>` (uuid optional for bash-only agents)

**Emission site:** `hiveMind.agent.bootstrap` step 8 (after Step 7 registry.refresh)

**Migration note:** existing direct `private.hiveMind.registry.set` + `session.store` calls in bootstrap **retained** during Sprint 1 transition (handlers replicate harmlessly, idempotent). Once SC-C.tests confirm coverage, future refactor removes direct calls.

**Live verification:**
```
$ hiveMind protected.events.emit agent.spawned "demoTeam:0.9" "demo-role" "fake-uuid-1234"
$ grep "demoTeam:0.9" ~/config/hivemind.{roles,sessions}.env
/Users/donges/config/hivemind.roles.env:demoTeam:0.9|demo-role|1778576363
/Users/donges/config/hivemind.sessions.env:demoTeam:0.9|fake-uuid-1234
$ hiveMind events.history 1
2026-05-12T08:59:23Z|agent.spawned|demoTeam:0.9 demo-role fake-uuid-1234
```

## Description
**Role: oosh-expert**

Register handler(s) for event `agent.spawned` per sprint-1-design.md §4 catalog.
Wire emission at every mutation point that should fire this event.

## Acceptance
- `hiveMind events.history` shows the event fired at the right mutations
- Target state stores show correct mutation in audit (read-only verify)
- No crash on handler failure (per U1)

*Sprint 1 · Epic SC-C*
