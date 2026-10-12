# S4b gate — Web4MDA f707537f (514e7215 + f707537f) — oopTester verdict

**Target:** Web4MDA `f707537f` = origin/main at verdict time (re-measured 10-12: 0 commits past it).
**Instrument:** isolated clone `latest/test/gen/seediso` (own .git), reset to f707537f per mode by `held/s4b-f707537f/g.sh`; never the live tree. Evidence: `held/s4b-f707537f/` (findings.md, run-*.out); logs in `latest/test/gen/oopTester-s4b/`.

## VERDICT: GREEN — every claimed S4b gate is PROVEN FAILABLE BY NAME; no seeded hazard escapes the whole suite. 4 FINDINGS (gate-quality defects, expert's lane), 0 R1 false-greens of the suite.

**Gate items: CHECKED 21 / SKIPPED 0 / TOTAL 21** (seeds + controls below). Suite baseline: **821 passed / 2 skipped / 0 failed (823)**, 98/98 files — the 2 skips BY NAME are the only unconditional `it.skip`s (TreeFileUnitInc1.test.ts:159 T5.2-T5.5 HELD, :185 T8 NOT BUILT), pre-existing, not S4b.

### RED BY NAME (failable — the gate works) — 13
| # | Seed | Result (literal) | Caught by |
|---|---|---|---|
| 1 | N1REVERT (drop `this.roots.set(name, created)`, 7 files) | 1 failed / 64 passed | F1 MECHANISM, both roots: 1897/1897 + 1791/1791 different objects |
| 2 | R7BODY (one extra line in storeModel R7b caller) | RED 1/20 | "ScenarioIndex.storeModel body is not the declared R7b link caller" |
| 3 | XPKG (R4: packageHome -> Components/X/latest) | RED 15/65 | named refusal "package 'Web4MDA' found 0 times ... must be unique" |
| 4 | DERIV ((c) derivation broken) | RED 3/14 | "the skip is exercised, never vacuous"; SKIPPED 48->0, CHECKED 1578->2097 |
| 5 | DUPFOLDER (second held package folder) | 2 failed / 12 passed (14) | "Package folder is found (exactly one)" + "BOTH WAYS" (2 vs 1; 49 vs 48 comps) |
| 6 | R1STALE | 1 failed / 79 passed (80) | S4(b) re-store repair arm: expected {..(2)} to equal {} |
| 7 | FSLINKPLAIN (un-aliased symlinkSync in M1Layout.ts) | 1 failed / 19 passed (20) | R7b "no src file ... reaches for a link API" |
| 8 | FSLINKALL (aliased, whole suite) | 8 failed / 813 passed / 2 skipped (823) | AC4 static builtin · R2 x2 derived scans · reproduce x4 (+1 confound, F4) |
| 9 | FSCALLER2ALL (aliased readFileSync, committed, whole suite) | 7 failed / 814 passed / 2 skipped (823) | AC4 · R2 x2 · reproduce x4 |
| 10 | DYNALIAS (real dynamic aliased node:fs call in reproduce-exempt M1Catalog.ts) | 3 failed / 818 passed / 2 skipped (823) | R2 x2 (call told apart from modelled body strings) · real-pipeline reproduce |
| 11 | DRIFT | 4 failed / 817 passed / 2 skipped (823) | pipeline reproduce · S4(b) named checks · RULED B · move round trip |
| 12 | RATIOPUT3 x5 (put loop tripled) | 3 failed / 62 passed (65) **5/5 runs** | ratio arm "FIRST store coarse LOAD ratio" RED 5/5 (idempotency RED = seed side effect) |
| 13 | ROGUEALL (held source under latest/model/Rogue/, whole suite) | 10 failed / 811 passed / 2 skipped (823) | AC1 coverage (independent find) · AC5/6/7 · tsc compiles every src on disk |

### GREEN AS EXPECTED (controls) — 8
BASE 821/2/0 · CONTROL real data (layout B collisions 0; old layout 100 keys / 276 links / 10 comps = oopExpert's claim reproduced) · RATIOFIX x5 65/65, ratio arm 0/5 RED · (c) runtime counts reproduced (Held 332/48/380; R3 anchors 1578/48/1626) · A3 20/20 budget arithmetic · LITPKG 65/65 (literal allowed today; P2 deletes) · S4(b) named checks present :1028/:1061/~:1108 · (b) cpSync verbatimSymlinks.

### FINDINGS (defects — not suite escapes)
- **F1 R7b link gate is ALIAS-EVADABLE.** `REACH = /\b(symlink|symlinkSync|link|...)\s*\(/` is a call-name denylist: FSLINK (`symlinkSync as seedsymlinkSync`) GREEN 20/20 vs FSLINKPLAIN RED 1/20, same file. Suite still catches it (R2/AC4/reproduce). Fix: detect by import binding, not call-name text.
- **F2 (c) skip rule FAIL-OPEN.** ROGUE: held source under `latest/model/Rogue/` silently SKIPPED (48->49) in TreeFileUnitRulings (GREEN 14/14). Suite catches it (ROGUEALL RED 10). Fix: match the derived store-output folder name (`scenarios`), not any dir in `<Version>/<model>`.
- **F3 False claim in an artifact:** M1Catalog.test.ts N1 class doc 686-687 says a ratio catches the held-root regression (contradicts its own 563-570 + the ruling) and cites "fixed ~1.16 vs unfixed ~1.34 in oopTester's measurement" — never my measurement. Stale comments: 571 (const 10.5 vs "9.06 rounded to 9"), 572 (0.1 vs "0.13 rounded down to 0.05").
- **F4 Coarse LOAD-ratio gate flakes under whole-suite load:** false-RED in 1 of 6 whole-suite runs at f707537f (FSLINKALL — seed is dead code), 0/5 single-file (RATIOFIX). Counted as CONFOUND, not as a catch.

### OBSERVATIONS
A3 provenance: budget maxes were measured on 9bfd7014/bd55c9a0/7cdf74bd, not f707537f; several of my runs exceed the reported max (+8..+22%) but all < 0.5x budget — the 2.5x factor absorbs it.

### Instrument errors of mine (redone, not counted)
DUPSRC -> DUPFOLDER (catalog refused at load before R3 ran) · FSCALLER vs UnitReferencesInc2 -> FSLINK · FSCALLER2 Pipeline-only (off-target) -> FSCALLER2ALL · my findings line "R2 has NO repo-wide scan" was FALSE, struck in place.
