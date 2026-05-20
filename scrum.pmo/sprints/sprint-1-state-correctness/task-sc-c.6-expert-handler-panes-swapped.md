[Back to Task SC-C](./task-sc-c-event-handlers.md)

# Task SC-C.6: Expert — handler for `panes.swapped`
[task:uuid:9d92796b-ca6d-447f-bc09-e186d520d489]

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement
  - [x] creating test cases (SC-C.tests)
  - [x] implementing — commit `47d94b0` (bundled with SC-C.5+7)
  - [x] testing (live: emit panes.swapped demoSwap 0.0 0.1 → registry entries swapped roleA↔roleB)
- [x] QA Review
- [ ] Done (pending SC-C.tests)

## Deliverable

**Commit:** `47d94b0`

`hiveMind.protected.panes.swapped` migrated to thin emitter. Mutation logic split into two handlers (registration ORDER matters — registry runs first, role_env reads post-mutation state):

- `private.hiveMind.handler.panes.swapped.registry` — swap registry entries A↔B (with B5.2 SWAP-1 addr normalization: prepends `<session>:` when pane arg is addr-only `0.0` not full target `team:0.0`)
- `private.hiveMind.handler.panes.swapped.role_env` — push `HIVEMIND_ROLE` to each pane's shell (Bug #3 fix; reads post-swap registry to get the now-correct roles)

**Payload:** `<session> <paneA> <paneB>` (3 args)

**Live verification:**
```
# setup: 2 entries
demoSwap:0.0|roleA
demoSwap:0.1|roleB

# emit panes.swapped demoSwap 0.0 0.1
# after:
demoSwap:0.1|roleA   ← B got roleA's content
demoSwap:0.0|roleB   ← A got roleB's content
```

B5.1 caller path preserved (`otmux.pane.swap` → subprocess to `hiveMind protected.panes.swapped`).

## Description
**Role: oosh-expert**

Register handler(s) for event `panes.swapped` per sprint-1-design.md §4 catalog.
Wire emission at every mutation point that should fire this event.

## Acceptance
- `hiveMind events.history` shows the event fired at the right mutations
- Target state stores show correct mutation in audit (read-only verify)
- No crash on handler failure (per U1)

*Sprint 1 · Epic SC-C*
