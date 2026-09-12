[Back to task-a4-env-i-honest-boot](./task-a4-env-i-honest-boot.md)

# A4.3 — test.this single-word dispatch uses hardcoded `./config` (cwd-relative)

## Status
- [x] Planned
- [ ] In Progress
- [ ] QA Review
- [ ] Done

## Traceability
- up: [task-a4-env-i-honest-boot](./task-a4-env-i-honest-boot.md)
- found-by: [task-a4.2-tester-env-i-verify](./task-a4.2-tester-env-i-verify.md) (tester, 2026-09-08)

## Description
**PRE-EXISTING — predates e3222de; NOT part of A4 env-i work.** Surfaced by the
tester while gating A4.2.

`test/test.this` "BUG: single-word dispatch (config list vs config.list)" (Test 6)
invokes `./config` — a **cwd-relative** path. When `test.suite` runs from a cwd ≠
`$OOSH_DIR`, `./config` does not resolve → **rc=127**, so the suite fails 8/9.

### Measured (oosh-tester, MacStudio, HEAD 8c90350)
- `cd $OOSH_DIR && test.suite run this 1` → **9/9 (later 11/11) PASS** (masks it).
- `cd <neutral> && test.suite run this 1` → **Test 6 FAIL rc=127**, 8/9.
- T-ENV-I (Test 8/9/10/11) pass in BOTH cwds → this is orthogonal to A4.

## Fix direction (expert)
Dispatch/test should reference the script by an OOSH-resolved path
(`$OOSH_DIR/config` or on-PATH `config`), never `./config`. OOSH is on PATH —
`./` prefix is a first-principles violation (see CLAUDE.md "no `./` prefix").

## Acceptance
- [ ] `test.suite run this 1` = all-green from ANY cwd (not only `$OOSH_DIR`).
- [ ] No hardcoded `./config` (or other `./<script>`) in the single-word dispatch path.
- [ ] Tester re-verifies from a neutral cwd on BOTH platforms.

---
*Sprint 2 @MacStudio*
