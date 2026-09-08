[Back to Planning Sprint 2](./planning.md)

# Task A4: env -i Honest Boot — Constructor Self-Derives HOME from Nothing
[task:uuid:3e5d5ce5-dd63-4ee1-90dd-6102b416b374]

## Status
- [x] Planned
- [x] In Progress
- [x] QA Review
- [x] Done

## Traceability
- up: [Sprint 2 Planning](./planning.md)
- down:
  - [A4.3 Pre-existing single-word ./config relpath fail (separate)](./task-a4.3-single-word-dispatch-relpath.md)
  - [A4.1 Expert — self-derive HOME + self-relative source (DONE e3222de)](./task-a4.1-expert-env-i-boot.md)
  - [A4.2 Tester — env -i honest gate verify (DONE 8c90350)](./task-a4.2-tester-env-i-verify.md)

## Description
OOSH must boot from a **literally empty `env -i`** (Tron's no-state-interference / constructor principle). Was rc=127 / `CONFIG_PATH=/config`. Sibling of A3: both are `this.init` constructor self-heals — A3 heals OOSH_DIR, A4 self-derives HOME when unset (before CONFIG_PATH), via passwd tilde-expansion (macOS+Linux, no dscl/getent branch), plus `oo.start` sources sibling `this` by BASH_SOURCE path when PATH is empty.

## Context
Ref: memory `env_i_honest_boot` — never hand-feed `env -i`; OOSH must boot from empty. Realises the Self-Healing Objects principle (`docs/first-principles.md`).

---
*Sprint 2 @MacStudio · Epic A: OOSH_DIR Invariant + Constructor · Priority 1*
