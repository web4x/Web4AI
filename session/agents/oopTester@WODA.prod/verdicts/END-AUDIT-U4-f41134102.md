# U4 END AUDIT — VERDICT on Web4MDA main `f41134102` (oopTester, 2026-10-14)

Detail, raw outputs and every prediction: `held/u4-f41134102/findings.md` (banked `eecf38f5`). Each arm is reported at its **weakest literal** assertion.

## Instrument
Cold GitHub clone c1 (head `f41134102`, tree `c37bfd9e5`, npm ci rc0 38 pkgs); seed clone c2 reset to `f41134102`, porcelain 0 after every run (seeds never committed/pushed). Long arms launched DETACHED (setsid nohup + completion marker), quiet-checked (0 vitest) at each launch. vitest JSON drops the Expected/Received diff → names checked in the default-reporter log.

## Arms — all COMPLETE, nothing left
| Arm | Result (weakest literal) |
|---|---|
| A whole suite, cold | Test Files 117/117 · Tests 945 passed, 2 skipped (947) · 0 FAIL · 2nd generate rc0 porcelain 0 |
| C.1 memo staleness | GREEN 4/4; poison seed → 2 RED `expected 'POISON' to be 'Google Map Model'` |
| C.2 AC6 budget | GREEN, no finding |
| C.3 test-subject-by-filename | DONE — **1 finding** (below) |
| C.4 SuiteTreeTouchProbe | i ACCEPTED (touch, isolated single cause) · ii GREEN · iii-ISOLATED ACCEPTED (detached re-run: failed=0 TOUCHED=0 EXIT=1, probe RED, teardown throw named) |
| C.5 maxBuffer | DONE; GenClaims 64 MiB ceiling FIXED at `f41134102` |
| C.6 TOOLS allow-list | S-a RED by name; S-b load-bearing — **findings** (below) |
| B U3 / U2 | every seed RED by its named guard, base GREEN |
| B U1 | base 13/13 + 11/11 GREEN; u1a dep 2 RED by fixture only, Pipeline RED naming `UcpUnit …uses_Init` + `UcpUnit.class.ts`; u1b RED naming `UcpUnitDefinition.ts`; u1c RED naming `'Ghost'` |
| B U1-S3 | base 9/9 + 66/66 GREEN; s3a RED `Array(7)` vs `Array(6)` diff `+ "ImportModel"`; s3b RED `unlinked: ["UcpUnit"]` + Index `e994e082`, before any count |

**0 false-greens on any catch path. 0 R1 defects open in scope.**

## In-scope finding — FIXED
- C.6 (iv) JSDoc omitted `TrackedTree` (introduced by `e1047668e`) → fixed in `aaf805a1d`, verified **comment-only** by oopPO; lands with the R0–R2 stack.

## Ranked backlog (oopPO, 10-14) — none blocks DONE
1. **C.3 assertions never checked by subject:** `M1Layout/…/M1LayoutDisguise.test.ts` named for M1Layout, all 4 `expect`s on M1Catalog → placed wrong, gate (a) NO RED.
2. **C.6 r1/r2 re-export laundering:** the same M1Catalog asserts via `import { M1Catalog } from './SeedLeak.js'` keep the gate GREEN on disk; and TOOLS is not derivable by structure (counterexample Source vs TestFolder). Pre-existing.
3. **U2 interface attributes — synthetic-only coverage:** u2c (interface attrs) is guarded by a synthetic probe only, not by a real-artifact seed.
4. **Stale skip labels:** TreeFileUnitInc1.test.ts L185 (T8 "NOT BUILT") and L159 (T5.2–T5.5 "HELD") are stale-false/partly stale, COVERED → become pointers, no GAP; never un-skip.
5. **F1** a dropped REAL dependency is caught only by Pipeline byte-reproduce (names the file) — COVERED; owner-guard locality only → backlog with TestPlacement integrity.
6. **F2** MofIncorporating `:60` is SUBSUMED by `:59` (exact set of 6 excludes ImportModel) → redundant, not a hole → drop at the owner's next touch.

## VERDICT
**U4 END AUDIT on `f41134102`: GREEN / ACCEPT-READY.** All arms complete and measured; the one in-scope finding is fixed (comment-only); everything else is ranked backlog that does not block DONE. DONE is Tron's word.
