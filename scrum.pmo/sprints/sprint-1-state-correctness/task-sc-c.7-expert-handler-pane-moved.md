[Back to Task SC-C](./task-sc-c-event-handlers.md)

# Task SC-C.7: Expert — handler for `pane.moved`
[task:uuid:38877b1d-3664-41df-b8f2-376b7a002c33]

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement
  - [x] creating test cases (SC-C.tests)
  - [x] implementing — commit `47d94b0` (bundled with SC-C.5+6)
  - [x] testing (live: emit pane.moved demoSwap:0.0 demoSwap:0.5 → registry key renamed)
- [x] QA Review
- [ ] Done (pending SC-C.tests)

## Deliverable

**Commit:** `47d94b0`

`hiveMind.protected.pane.moved` migrated to thin emitter. Mutation logic split into two handlers (order matters):

- `private.hiveMind.handler.pane.moved.registry` — rename registry key `from → to`, preserve role
- `private.hiveMind.handler.pane.moved.role_env` — push `HIVEMIND_ROLE` to destination shell (Bug #3 fix)

**Payload:** `<fromPane> <toPane>` (2 args, both full pane targets)

**Live verification:**
```
# before: demoSwap:0.0|roleB
# emit pane.moved demoSwap:0.0 demoSwap:0.5
# after:  demoSwap:0.5|roleB   ← key renamed, role preserved
```

B5.1 caller path preserved (`otmux.pane.move`/`pane.join` → subprocess to `hiveMind protected.pane.moved`).

## Description
**Role: oosh-expert**

Register handler(s) for event `pane.moved` per sprint-1-design.md §4 catalog.
Wire emission at every mutation point that should fire this event.

## Acceptance
- `hiveMind events.history` shows the event fired at the right mutations
- Target state stores show correct mutation in audit (read-only verify)
- No crash on handler failure (per U1)

*Sprint 1 · Epic SC-C*
