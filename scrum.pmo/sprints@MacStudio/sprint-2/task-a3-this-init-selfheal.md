[Back to Planning Sprint 2](./planning.md)

# Task A3: this.init() Self-Heal Guard for OOSH_DIR
[task:uuid:e77916cc-dee8-4365-991d-f3a225b52a7c]

## Status
- [ ] Planned
- [ ] In Progress
- [ ] QA Review
- [ ] Done

## Traceability
- up: [Sprint 2 Planning](./planning.md)
- down:
  - [A3.1 Expert — this.init guard impl](./task-a3.1-expert-this-selfheal.md)
  - [A3.2 Tester — corrupt-then-heal verify](./task-a3.2-tester-this-selfheal-verify.md)

## Description
If `$HOME/oosh` is a symlink and `OOSH_DIR` differs (stale config, restart drift), `this.init()` must override to `$HOME/oosh`. Breaks the self-reinforcing cycle (architect Point 4).

---
*Sprint 2 @MacStudio · Epic A: OOSH_DIR Invariant · Priority 1*
