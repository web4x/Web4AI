# P6 END AUDIT — VERDICT on Web4MDA main `1488dbdf7` (oopTester, 2026-10-13)

**Sha (ONE, named):** origin main `1488dbdf7` = oopBashExpert's P2 fix (M1Layout.ts:87 root DERIVED) ← `869861fee` (my P2-ROOT′ + P2-LIT′ gate file, landed as-is) ← `fca4273c4` (chain CPU fix) ← `343f8e0ea` (E-arm) ← `aff76b394` (best-of-3 instrument) ← `360a7a984` (P5). Tree `8f324cf21`.
**Scope:** `session/tasks/oopPO-P6-scope.md` @0d94598b — every gate of plan 2026-10-11 rows P2–P5 + plan 2026-10-10 S5, whole suite COLD; LITPKG′ ruled OUT. Work plan `plans/END-AUDIT-gate-list.md` (blocks A–F). Evidence: `held/p6-fca4273c4/` (findings.md, final.sh, g.sh, p6.sh) + run logs in `Web4MDA/…/latest/test/gen/oopTester-p6/out/final.out`.

## Instrument
- Isolated REAL clones: `git clone --no-hardlinks` + `checkout --detach 1488dbdf7`, REAL `npm ci` (38 pkgs, real dir, never a symlink). Never the shared tree.
- Env: `env -u CLAUDECODE -u TMPDIR PATH=/opt/node22/bin:$PATH` — the bare login PATH gives `/usr/bin/node` v16.11.0, which cannot run the repo (Node 22); same convention as every earlier harness.
- One launch at a time; a QUIET box (0 node vitest) was waited for and logged before EVERY arm: all `quietWait=0s nodeVitest=0`.
- Seeds prove they applied ("seeded N file(s)") and are judged by WHICH test fails (named guard), never red-vs-green. Anchors re-derived BY CONTENT at the sha (R1STALE, DERIV, DRIFT moved; P2LITSEED, DOMAIN, FSCALLERNJ, XPKG′ new).

## A. Whole suite — **GREEN**
| Arm | CHECKED | SKIPPED | TOTAL | Result |
|---|---|---|---|---|
| A1 clone c3 | 916 tests / 114 files | 2 | 916 | rc 0 · 914 passed · 0 failed · 0 timeouts · porcelain 0 |
| A1 clone c4 | 916 / 114 | 2 | 916 | identical · porcelain 0 |
| A2 2nd generate (`npm start`) | both clones | — | — | rc 0, **0 changed files** in both |
| BASE (seed instrument, c2) | 916 | 2 | 916 | rc 0 · 914 · 0 failed |
- The 2 skips DERIVED: the only two unconditional `it.skip` (`TreeFileUnitInc1.test.ts:159`, `:185`); total = 2 ⇒ no conditional skip fired (PlantUML server, /root/oosh, /proc, old-node gates all ran).
- A3 GarbageSweep (`GarbageSweep.test.ts`) and A4 CHAIN SPEED (`Pipeline.test.ts`, budget 20 UNCHANGED) — inside both green suites.

## B. S1–S4 (S5) — GREEN by in-suite carriers
S1–S4 carriers found by label (`M1Catalog`, `ScenarioLayoutSC1`, `M3Class`, `ScenarioUnit`, `UnitReferencesInc2`) all green in A1 with their in-test failable arms. S4 hazards additionally seeded externally (DRIFT, R1STALE, DUPFOLDER, DERIV — block E). **Not externally seeded this run: S1/S2/S3** (their in-test seeds are the proof; weakest literal stated).

## C + E. S4b / round-2 seeds — every KEEP/RE-EXPRESS seed RED by its named guard
| Seed | Named guard that went RED | |
|---|---|---|
| N1REVERT | F1 MECHANISM — fresh store yields ONLY RELATIVE type/ links (1/66) | ✓ |
| FSCALLERNJ (aliased `readFileSync`) | node:fs-importer scan "imported ONLY by NodeJSFile and NodeJSFolder" (1/8) | ✓ |
| FSLINK / FSLINKPLAIN | link-API scan (1/21 each) | ✓ |
| R7BODY | link-API scan exact allowance (1/21) | ✓ |
| DYNALIAS (whole) | node:fs-importer ×2 + pipeline reproduce (3/916) | ✓ |
| FSLINKALL / FSCALLER2ALL (whole) | importer scans ×2, mof-self AC4 static builtin import, link-API scan (+ reproduce) | ✓ |
| DUPSRC | named refusal at load: `two model sources define 'ScenarioIndex'` | ✓ |
| ROGUE / ROGUEALL | F2 round 2, BY NAME: `…/ScenarioIndex/latest/model/Rogue` | ✓ |
| DUPFOLDER | BOTH WAYS names `MOF/Web4MDA/latest`; package folder 2≠1 | ✓ |
| R1STALE | S4 (b) STALE link not repaired by the one re-store (1/82) | ✓ |
| DERIV | R3 seed, CHECKED/SKIPPED anchor, F2 arm, Package folder (4/15) | ✓ |
| DRIFT (whole) | S4 (b) `dangling` / `misnamed` / `ghosts()` by path; move round-trip | ✓ |
| RATIOPUT3 ×5 | RED by name every run: 2nd store idempotence + F1 link count (11493 ≠ 3831) | ✓ |
| RATIOFIX ×5 (clean) | 0 false-RED, 66/66 each | ✓ |
- **F4 ratio (REPORTED metric, ruled):** clean 8.573 / 8.094 / 10.598 / 9.868 / 8.347 (max **10.598**); PUT3 20.353 / 15.941 / 16.265 / 20.440 / 20.687 (min **15.941**) — bands do NOT overlap at this sha. **Residual named as accepted risk (ruling F4):** a non-N1 slowdown below wall headroom is not RED-gated.

## D. P2–P5 (P6)
- **P2:** P2-ROOT′ GREEN (namespace == disk folder below the nearest EAMD.ucp/Components, every class + placed M1Catalog; NOT subsumed — 113/113 Definitions still AUTHOR namespace); in-file failable arm green. **P2-LIT′ CHECKED 114 files / SKIPPED 0 / TOTAL 114; literals 228 = 228 own declarations + 0 RED.** P2LITSEED (literal re-inserted at M1Layout.ts:87) → **RED by file:line `M1Layout.ts:87 'com.ceruleanCircle'`** (2/5). folder==layout RETIRED (ruled). `move()` / chained moves: `UcpComponentMove`, `ComponentModelInc1/3` green (live: DRIFT reds the move round-trip). 2nd generate 0 changed (A2).
- **P3:** `MofIncorporating.test.ts` 10/10 green — TOTAL+UNIQUE, CONSISTENT, AUTHORED ONCE + in-test seeds on the REAL Mof registry (second binder → named throw naming model + both components; no binder; disagreeing mark; string-built impostor never chosen).
- **P4:** `ComponentTypedIor.test.ts` green — component-typed put/get/resolve exact, legacy IOR refused by name (×3), REAL STORE every IOR names an existing component folder + seeded model-typed IOR RED by uuid (:194), type/ ↔ Index bijection + seeded missing link RED by uuid (:209).
- **P5:** `M1Catalog.test.ts:1132` (owner key DERIVED + rendered), `:1173` (ONE root, locate DELETED), `M2ES2020Class.test.ts:16` (component = MOF reflection) green. AC9 scan CHECKED 3491 / SKIPPED 2 (own declarations M1Catalog:48, :562) / TOTAL 3493.

## F. Doc gates — GREEN by carrier
ARM7 (`Spec.test.ts`): plan scope DERIVED (`readdirSync('spec/plans', recursive)` :752), every backticked citation resolves, failable arm RED by file:line (:768); ARM5/6 over `spec/*.md`. Green in both A1 suites. **No external seed this run** (weakest literal).

## FINDINGS (not passes — oopPO rules)
1. **P2-LIT′ found a REAL P2 defect at fca4273c4** — `M1Layout.ts:87 Namespace.declare('com.ceruleanCircle', …)`; **FIXED in 1488dbdf7** (root derived); the gate now guards it (P2LITSEED RED by file:line).
2. **XPKG′ (bare `EAMD.ucp/Components/X/latest` folder) stays GREEN** (15/15). Reading: under ONE ROOT the Components root may hold other domains, so a foreign folder is not this package's placement; the R4 hazard (a class of THIS package under a placeholder package) is caught by **P2-ROOT′** (namespace ≠ disk folder, RED by class) and a duplicated package folder by **DUPFOLDER**. **Recommend: SUBSUME** (old fixture-form XPKG went INERT when P5 deleted the interim root find).
3. **DOMAIN = CONFOUND, CANNOT MEASURE YET** — P5's "a package `domain` attribute reintroduced → RED": measured **0 tests** mention it. My seed (attribute added to `PackageModelDefinition` + `npm start`) left `src` un-rendered (`srcDomainLines=0`), so its 4 REDs are the reproduce gates catching model ≠ src, NOT a domain guard. Whether a CONSISTENTLY added `domain` attribute (model + rendered src) is caught is unmeasured → likely an AC without a dedicated gate; oopPO rules (build a guard, or SUBSUME into the reproduce gates).
4. Instrument incidents (mine, none in the verdict data): A1 driver exec-bit (rc=126, nothing ran); COMMIT `git add` on an ignored path (FSCALLER2 skipped once); FSCALLER/FSCALLER2 single-file GREENs were the WRONG carrier (importer scan lives in `NodeJSFile.test.ts`) — replaced by FSCALLERNJ + the whole-suite variants; P2-LIT′ oracle drift after P5 (116 false RED → own component re-derived from the disk folder chain); a batch on the old sha overlapped another suite (quiet=2) → discarded, every final arm quiet.

## VERDICT
**GREEN — 0 RED at `1488dbdf7`.** Whole suite cold ×2: 914 passed / 2 skipped / 0 failed, porcelain 0, 2nd generate 0. Every KEEP/RE-EXPRESS seed RED by its named guard, then the fresh state GREEN. No gate loosened. **Open for oopPO's ruling: finding 2 (XPKG′ → SUBSUME) and finding 3 (DOMAIN guard — cannot measure yet).** → oopPO verifies on its own clone; TRON rules DONE.
