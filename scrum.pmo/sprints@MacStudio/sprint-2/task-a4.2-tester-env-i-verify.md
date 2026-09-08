[Back to task-a4-env-i-honest-boot](./task-a4-env-i-honest-boot.md)

# A4.2 Tester — env -i Honest Gate Independent Verify
[task:uuid:6ed917c6-f86e-4af3-b1de-fb5eaeea15e7]

## Status
- [x] Planned
- [x] In Progress
- [x] QA Review
- [x] Done

## Report-back — oosh-tester (2026-09-08) — GREEN on BOTH platforms
**Gate commit (my OWN, independent):** `8c90350` on `test/mcdonges.latest` — `test.this` T-ENV-I-3/4 (additive over expert's T-ENV-I-1/2: independent entry point `config list` + explicit NEGATIVE regression guard on the exact bug). Fix under gate: expert `e3222de`.

| Check | MacStudio (HOME=/Users/donges) | WODA.prod (HOME=/root) |
|---|---|---|
| `test.suite run this 1` | **11/11 PASS** | **11/11 PASS** |
| T-ENV-I-1 `oo mode.list` env -i rc=0 | ✓ | ✓ |
| T-ENV-I-2 self-derive (no /config) | ✓ CONFIG_PATH=/Users/donges/config | ✓ CONFIG_PATH=/root/config |
| T-ENV-I-3 `config list` env -i rc=0 (mine) | ✓ | ✓ |
| T-ENV-I-4 no-/config-degrade guard (mine) | ✓ | ✓ |
| #2 honest manual (feed NOTHING) rc | 0 | 0 |
| #2 in-process derivation | HOME=/Users/donges, OOSH_DIR=…/oosh, CONFIG_PATH=…/config | HOME=/root, OOSH_DIR=/root/oosh, CONFIG_PATH=/root/config |
| #3 regression `oo mode.list` / `config list` | rc=0 / rc=0 | rc=0 / rc=0 |

Honest per env-i rule: `env -i` fed NOTHING (real binary path only locates the executable — never hand-fed HOME/PATH). Cross-platform derivation is correct per-host (/Users/donges vs /root), no `/config` degrade anywhere. **VERDICT: e3222de env -i honest boot ACCEPTED, GREEN both platforms.**
WODA.prod run via `ooshTeam:0.5 → ssh WODA.prod` (the previous `remoteShells:0.1` pane was removed by the team restore; routed around).

### Pre-existing FAIL (NOT e3222de — own task)
Confirmed the expert-flagged `test.this` "single-word dispatch" (Test 6) → **rc=127 only when test.suite cwd ≠ OOSH_DIR** (hardcoded `./config`). Independent of T-ENV-I (Test 8/9/10/11 pass regardless of cwd). Predates e3222de. Filed as its own small task: [task-a4.3-single-word-dispatch-relpath](./task-a4.3-single-word-dispatch-relpath.md).

## Traceability
- up: [task-a4-env-i-honest-boot](./task-a4-env-i-honest-boot.md)

## Description
**Role: oosh-tester** — independent gate for expert e3222de (NOT expert self-test).
1. `test.suite run this 1` → T-ENV-I-1 + T-ENV-I-2 GREEN.
2. Honest manual (feed NOTHING): `env -i /bin/bash -c '"$HOME/oosh/oo" mode.list'` → rc=0, in-process `CONFIG_PATH=<realhome>/config` (NOT /config), `OOSH_DIR=<realhome>/oosh`.
3. Regression: normal boot (`config list`, `oo mode.list`) still rc=0.
Commit your test as the gate. Report GREEN/RED + hash. Run on BOTH platforms (remoteShells:0.1).

**Pre-existing FAIL flagged by expert (NOT e3222de):** test.this "single-word dispatch" uses `./config` (hardcoded relative) → rc=127 when test.suite cwd ≠ OOSH_DIR. Predates e3222de → own small task, do not attribute to A4.

---
*Sprint 2 @MacStudio*
