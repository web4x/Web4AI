[Back to Planning Sprint 1](./planning.md)

# Task D1: Self-Heal Reconcile of Existing Installs
[task:uuid:efe7c78d-bbe3-4f0d-9425-814574aea1df]

## Status
- [x] Planned
- [x] In Progress
- [x] QA Review
- [ ] Done   <!-- persistence verify (D1.3) pending isolated box -->

## Traceability
- up: [Sprint 1 Planning](./planning.md)
- down:
  - [D1.1 Architect — reconcile design](./task-d1.1-architect-reconcile-design.md)
  - [D1.2 Expert — declare + reconcile impl](./task-d1.2-expert-reconcile-impl.md)
  - [D1.3 Tester — reconcile persistence](./task-d1.3-tester-reconcile-persistence.md)

## Task Description
The D1 reorder (Epic A) only helps NAKED rebuilds; an already-installed box keeps its old-order state file (WODA.test itself included). Per the self-heal principle, re-running the constructor must RECONCILE an existing box's SETUP_SERVER state to the new order — in `oo` only, zero `state`-engine edit.

## Context
`oo.state` on `machine.exists` only reads state, never re-adds; the ordered `state.add` runs only in `private.init.state.machine` gated by `!machine.exists`. So existing boxes freeze at their original order.

## Intention
- **Why:** the object heals to a correct state on re-run; WODA.test self-corrects.
- **How:** two-tier detect (schema stamp + order-invariant-by-name) → reconcile BY NAME (capture→delete-data-file→`declare`→`state.set name`/marker-fallback→stamp). No drive (F2-safe). DRY: one `private.setup.server.declare` shared by fresh-init + reconcile.

---
*Sprint 1 @MacStudio · Epic D: Self-Heal Existing Installs · Priority 1*
