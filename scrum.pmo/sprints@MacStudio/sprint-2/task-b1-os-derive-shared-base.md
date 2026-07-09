[Back to Planning Sprint 2](./planning.md)

# Task B1: OS-Derive OOSH_SHARED_BASE
[task:uuid:83d5755e-5c3f-4e4f-a8a5-9913d88432f2]

## Status
- [ ] Planned
- [ ] In Progress
- [ ] QA Review
- [ ] Done

## Traceability
- up: [Sprint 2 Planning](./planning.md)
- down:
  - [B1.1 Architect — derivation design](./task-b1.1-architect-shared-base-design.md)
  - [B1.2 Expert — impl in config.init/this.init](./task-b1.2-expert-shared-base-impl.md)
  - [B1.3 Tester — both platforms verify](./task-b1.3-tester-shared-base-verify.md)

## Description
`OOSH_SHARED_BASE` must be auto-derived from `OOSH_OS`: darwin→`/Users/Shared`, linux-gnu→`/home/shared`. Single source in `config.init` or `this.init`. Currently unset on MacStudio, manually set on WODA.prod.

---
*Sprint 2 @MacStudio · Epic B: OS-Independence · Priority 0*
