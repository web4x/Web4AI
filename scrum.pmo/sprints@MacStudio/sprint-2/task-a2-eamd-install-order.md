[Back to Planning Sprint 2](./planning.md)

# Task A2: EAMD Install — Symlink First, Then OOSH_DIR=$HOME/oosh
[task:uuid:3dc1f08b-337e-4a4f-bb82-d1997184e485]

## Status
- [ ] Planned
- [ ] In Progress
- [ ] QA Review
- [ ] Done

## Traceability
- up: [Sprint 2 Planning](./planning.md)
- down:
  - [A2.1 Expert — reorder + kill 'dev' literal](./task-a2.1-expert-eamd-fix.md)
  - [A2.2 Tester — EAMD install verify](./task-a2.2-tester-eamd-verify.md)

## Description
`oo` lines 945/1001 hardcode `OOSH_DIR` to the resolved path AND literal `'dev'`, then `config save` before creating the `~/oosh` symlink. Fix: create symlink first → set `OOSH_DIR=$HOME/oosh` → then `config save`.

---
*Sprint 2 @MacStudio · Epic A: OOSH_DIR Invariant · Priority 0*
