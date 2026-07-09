[Back to Planning Sprint 2](./planning.md)

# Task A1: oo.mode() must set OOSH_DIR=$HOME/oosh (not resolved path)
[task:uuid:8713f8f2-239b-43cb-ac18-28f632691ee9]

## Status
- [ ] Planned
- [ ] In Progress
- [ ] QA Review
- [ ] Done

## Traceability
- up: [Sprint 2 Planning](./planning.md)
- down:
  - [A1.1 Architect — OOSH_LINK invariant design](./task-a1.1-architect-invariant-design.md)
  - [A1.2 Expert — oo:309 fix](./task-a1.2-expert-oo-mode-fix.md)
  - [A1.3 Tester — cross-platform verify](./task-a1.3-tester-oo-mode-verify.md)

## Description
`oo.mode()` line 309 exports `OOSH_DIR="$target_dir"` (resolved worktree path). After any `config save`, this cements the resolved path — a mode switch permanently drifts OOSH_DIR. Fix: always set `OOSH_DIR="$HOME/oosh"` (the stable symlink).

---
*Sprint 2 @MacStudio · Epic A: OOSH_DIR Invariant · Priority 0*
