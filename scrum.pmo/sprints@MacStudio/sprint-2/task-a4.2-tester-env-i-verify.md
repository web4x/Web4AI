[Back to task-a4-env-i-honest-boot](./task-a4-env-i-honest-boot.md)

# A4.2 Tester — env -i Honest Gate Independent Verify
[task:uuid:6ed917c6-f86e-4af3-b1de-fb5eaeea15e7]

## Status
- [ ] Planned
- [ ] In Progress
- [ ] QA Review
- [ ] Done

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
