[Back to task-a4-env-i-honest-boot](./task-a4-env-i-honest-boot.md)

# A4.1 Expert — Self-Derive HOME + Self-Relative source this
[task:uuid:fd7e7dbd-8f70-43d6-88b8-438aafd9b8a7]

## Status
- [x] Planned
- [x] In Progress
- [x] QA Review
- [x] Done

## Traceability
- up: [task-a4-env-i-honest-boot](./task-a4-env-i-honest-boot.md)

## Description
**Role: oosh-expert**
`this` self-derives HOME via passwd tilde-expansion when unset (before CONFIG_PATH); `oo.start` sources sibling `this` by `BASH_SOURCE` path with PATH fallback; T-ENV-I honest gate in `test.this` (feeds NOTHING, asserts rc=0 + HOME/OOSH_DIR/CONFIG_PATH self-derive). `oo mode.list`/`config list` now rc=0 from empty `env -i` (was rc=127).

**Commit(s):** `e3222de` (once.sh/test/mcdonges.latest, pushed) · agent-files `c7864a6d` (Web4AI)
**Scope:** `oo` +5/-1, `this` +14, `test/test.this` +36 (T-ENV-I-1/-2)

**Note (self-tested for lack of a tester — now superseded):** expert self-verified; full team now available → tester independent gate = A4.2.

---
*Sprint 2 @MacStudio*
