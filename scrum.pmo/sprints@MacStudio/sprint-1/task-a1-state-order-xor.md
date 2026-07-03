[Back to Planning Sprint 1](./planning.md)

# Task A1: SETUP_SERVER State Order + XOR Redirect
[task:uuid:6e46a8c1-53b4-4673-b001-eac11ac0d8af]

## Status
- [x] Planned
- [x] In Progress
- [x] QA Review
- [x] Done

## Traceability
- up: [Sprint 1 Planning](./planning.md)
- down:
  - [A1.1 Tester — order diagnosis](./task-a1.1-tester-order-diagnosis.md)
  - [A1.2 Architect — order+XOR design](./task-a1.2-architect-order-xor-design.md)
  - [A1.3 Expert — reorder + redirect impl](./task-a1.3-expert-order-xor-impl.md)
  - [A1.4 Tester — XOR crossing verify](./task-a1.4-tester-xor-verify.md)

## Task Description
Correct the SETUP_SERVER state machine (in `oo` only, zero `state`-engine edit): (D1) the mode-selection band `user.mode.release`/`user.mode.dev` must precede `user.installation.done`; (D2) the release⊕dev XOR must be traversable by `state next` — the mode `private.check.*` redirect on active `OOSH_MODE` instead of dead-ending.

## Context
Tron observed a box at `user.installation.done` with two unreached user states past it. Root cause (A1.1): `done` mis-indexed before its mode prerequisites, and the XOR modeled as two sequential states whose wrong-mode check returns 1 (HOLD) → machine stalls, un-traversable linearly.

## Intention
- **Why:** a user install cannot be "done" before a mode is chosen; the constructor must advance deterministically for both modes.
- **How:** reorder the `state.add` sequence; make both mode checks `create.result 0` and steer via numeric RESULT resolved by `state.find` (the engine's existing redirect primitive).

---
*Sprint 1 @MacStudio · Epic A: State-Machine Correctness · Priority 0*
