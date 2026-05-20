[Back to Task SC-C](./task-sc-c-event-handlers.md)

# Task SC-C.5: Expert — handler for `panes.shifted`
[task:uuid:7da6ec8b-cb1b-4f64-9fa9-2aa088d5d96e]

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement
  - [x] creating test cases (SC-C.tests)
  - [x] implementing — commit `47d94b0` (bundled with SC-C.6+7)
  - [x] testing (live: events.list shows panes.shifted=1 handler; B5.1 caller path preserved)
- [x] QA Review
- [ ] Done (pending SC-C.tests)

## Deliverable

**Commit:** `47d94b0`

`hiveMind.protected.panes.shifted` migrated to thin emitter calling `private.hiveMind.events.emit "panes.shifted" <session>`. Mutation logic moved into:

- `private.hiveMind.handler.panes.shifted.registry` — calls existing `hiveMind.registry.refresh <session>` (live discovery re-maps role-bearing panes after split/insert)

**queue.rename handler deferred** — per design table, queue files named by pane addr should rename on shift. Current B5.1 caller doesn't carry pre/post-shift index map. Reconcile cycle catches stale queue files (S6 invariant). Will add when caller signature evolves.

B5.1 observer pattern unchanged from caller POV — `otmux` still invokes `hiveMind protected.panes.shifted <session>` via subprocess. The thin emitter dispatches in-process to handlers.

## Description
**Role: oosh-expert**

Register handler(s) for event `panes.shifted` per sprint-1-design.md §4 catalog.
Wire emission at every mutation point that should fire this event.

## Acceptance
- `hiveMind events.history` shows the event fired at the right mutations
- Target state stores show correct mutation in audit (read-only verify)
- No crash on handler failure (per U1)

*Sprint 1 · Epic SC-C*
