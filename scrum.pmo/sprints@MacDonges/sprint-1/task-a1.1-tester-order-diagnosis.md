[Back to task-a1-state-order-xor](./task-a1-state-order-xor.md)

# A1.1 Tester — State Order Diagnosis
[task:uuid:a90dfbc2-ded5-473e-a91e-f4d6aab9de28]

## Status
- [x] Planned
- [x] In Progress
- [x] QA Review
- [x] Done

## Traceability
- up: [task-a1-state-order-xor](./task-a1-state-order-xor.md)

## Description
**Role: oosh-tester**

Diagnose SETUP_SERVER order live on WODA.test: dump state list with indices, identify the two unreached user states (user.mode.release/dev), confirm they must precede user.installation.done, stage via `state next` to prove the stall.

**Commit(s):** `703b817`  (once.sh/dev)

---
*Sprint 1 @MacDonges*
