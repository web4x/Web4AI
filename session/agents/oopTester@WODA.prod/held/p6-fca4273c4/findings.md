# P6 END AUDIT — findings on Web4MDA main fca4273c4 (oopTester, 2026-10-13)

Instrument: `held/p6-fca4273c4/p6.sh`. Clones c1, c2 = `git clone --no-hardlinks` + `checkout --detach fca4273c4`, tree b52e80f90, REAL `npm ci` (38 pkgs, real dir).
Env: `env -u CLAUDECODE -u TMPDIR PATH=/opt/node22/bin:$PATH` (bare login PATH = node v16.11.0, cannot run the repo). Box quiet (0 node vitest) before + after every run.

## A. Whole suite
- **A1 c1:** rc=0 · Test Files 113/113 · Tests 909 passed | 2 skipped (911) · 0 failed · 0 timeouts · porcelain 0 after suite.
- **A1 c2:** identical: rc=0 · 113/113 · 909 | 2 (911) · 0 failed · 0 timeouts · porcelain 0.
- porcelain files after suite: c1 == c2 (both empty). **A2** 2nd generate (`npm start`) rc=0, porcelain 0 in BOTH clones (identical, empty).
- **The 2 skips, DERIVED:** exactly two unconditional `it.skip` exist at the sha — `TreeFileUnitInc1.test.ts:159` (T5.2–T5.5) and `:185` (T8). Total skipped = 2 ⇒ ZERO conditional `ctx.skip` fired (PlantUML-server, /root/oosh, /proc, old-node, OOSH gates all RAN).
- NOTE: a first "skip lists identical" comparison was HOLLOW (default reporter prints no per-test lines; both lists empty) — discarded, replaced by the derivation above.
- **A1 VERDICT: GREEN** (CHECKED 911 / SKIPPED 2 / TOTAL 911 per clone, ×2 clones).
- A3 GarbageSweep / A4 F5 chain-speed: carried by named tests inside the green suite — to be cited by label (naming law) in block F/D pass.

## Instrument incidents (mine)
- First A1 launch rc=126: driver called `"$0"` without exec bit → nothing ran (c1 never created). Fixed to `bash "$0"`; rerun clean.
