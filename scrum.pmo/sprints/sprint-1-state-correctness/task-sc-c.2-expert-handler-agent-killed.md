[Back to Task SC-C](./task-sc-c-event-handlers.md)

# Task SC-C.2: Expert — handler for `agent.killed`
[task:uuid:2edf4a09-126f-45f4-98cb-d5acfaec9a58]

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement
  - [x] creating test cases (handed off to SC-C.tests)
  - [x] implementing — commit `1ed429c` (bundled with SC-C.1)
  - [x] testing (live: kill emit → both stores cleaned; events.history shows event)
- [x] QA Review
- [ ] Done (pending SC-C.tests integration coverage)

## Deliverable

**Commit:** `1ed429c`

**Handlers registered:**
- `private.hiveMind.handler.agent.killed.registry` → grep -v pane from `$HIVEMIND_REGISTRY`
- `private.hiveMind.handler.agent.killed.sessions` → grep -v pane from `$HIVEMIND_SESSIONS`
- `private.hiveMind.handler.agent.killed.queue` → `rm <queue-file>` (soft-fail if queue helpers absent)

**Payload:** `<pane>` (handlers locate per-store entries by pane)

**Emission site:** `hiveMind.registry.remove` (after the direct file-mutation succeeds). When team.remove and a future explicit `agent.kill` method are wired in SC-C.9 and follow-ups, they'll also emit.

**Live verification:**
```
$ hiveMind protected.events.emit agent.killed "demoTeam:0.9"
$ grep "demoTeam:0.9" ~/config/hivemind.{roles,sessions}.env
(no output — both cleaned ✓)
$ hiveMind events.history 1
2026-05-12T08:59:23Z|agent.killed|demoTeam:0.9
```

The 3rd handler (queue) is soft-fail when `private.hiveMind.agent.queue.path` isn't yet sourced — keeps the handler chain robust for early-load timing.

## Description
**Role: oosh-expert**

Register handler(s) for event `agent.killed` per sprint-1-design.md §4 catalog.
Wire emission at every mutation point that should fire this event.

## Acceptance
- `hiveMind events.history` shows the event fired at the right mutations
- Target state stores show correct mutation in audit (read-only verify)
- No crash on handler failure (per U1)

*Sprint 1 · Epic SC-C*
