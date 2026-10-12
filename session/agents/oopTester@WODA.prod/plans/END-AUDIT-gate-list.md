# END AUDIT gate list — S5 + P6 + round-2 re-gate (oopTester, PREPARED 2026-10-12, no CPU)
Order ruled by TRON 2026-10-12 (drive 2701d4b5, Phase 2 #7): NO gate runs until all Phase-1 building is pushed. Sources: plans `2026-10-10-subscenarios-by-ior.md` (S1–S4, S5 row 43), `2026-10-11-namespace-root-and-component-typed-iors.md` (P2–P5, P6 row 80), drive A3b F2/F4.

## Instrument (laws, each paid for)
- ONE sha = the final Phase-1 head on origin/main, named in the verdict. Isolated `git clone --no-hardlinks` of that sha (or seediso after `git fetch origin +refs/remotes/origin/main:refs/remotes/upstream/main` — its origin is the LOCAL repo). Never the shared live tree.
- Default PATH cold `npm test` rc=0 with count > 0. One harness launch at a time; runner DETACHED (`setsid nohup`), kill only by exact PID. Scratch only in the component's `latest/test/gen` (hook).
- Every seed: proves it APPLIED (md5/"seeded N file(s)") → RED **by its named guard** (compare WHICH tests fail, never red-vs-green) → revert → GREEN. A seed that stays GREEN = fail-open = RED finding.
- Every gate reported CHECKED / SKIPPED / TOTAL (R3 anchors line + vitest counts). A RED is instrument-or-defect: diagnose (timeout vs assertion) before reporting.

## A. Whole suite (S5 + P6)
- A1 BASE cold whole suite **twice** in two real clones: both 0 failed, counts equal, `git status --porcelain` identical (and empty) after each. A2 `npm start` / 2nd generate: 0 changed bytes. A3 GarbageSweep 0.
- A4 F5 chain-speed: reported SEPARATELY by name (not a suite RED). Budget never raised.

## B. S1–S4 seeds (S5: every seed RED by name then GREEN) — re-validated on the P2–P5 base
- S1 duplicate unit uuid → RED naming BOTH owners.
- S2 new `*Model[]` attribute → appears in partEnds; `UcpUnit`-typed attribute → does NOT.
- S3 part embedded by value → RED (embedded-unit scan) · one part put dropped → RED by `Owner.member` · wrong `ownerIor` → RED. Plus: resolved == catalog JSON for all classes; Index count == classes + distinct parts (derived).
- S4 two same-class same-type names differing only in case → RED by both names; same name under two classes → GREEN. Named checks (misnamed, multiLinked, ghosts, dangling) before counts; `type/` ↔ Index bijection both ways.

## C. Round-2 re-gate (S4b fixes F1/F2/F4 + carried S4b seeds)
- F1 FSLINK (aliased `symlinkSync`) → RED by the link-API scan; FSLINKPLAIN → RED; DYNALIAS (dynamic aliased import in M1Catalog.ts code) → RED; FSCALLER2 → RED.
- F2 ROGUE (`<Version>/<model>/Rogue/` unowned folder) → RED **by name** (oopPO ruling 10-12); SKIPPED stays 48 unless P5 changes the set (then the new number, derived).
- F4 whole-suite clean ×5: ratio arm 0 false-RED (median-of-k reference); RATIOPUT3 ×5 RED by name; report clean max + seed min (last: 12.136 / 13.403). If demoted to a reported metric: N1REVERT → RED by the N1 mechanism gate instead.
- Carried: N1REVERT (drop held root) → RED; R1STALE (stale link after a move) → RED; DUPSRC (duplicate source) → RED; R4 no `X/` placeholder → RED.

## D. P2–P5 gates (P6)
- P2 namespace `Web4MDA.MOF.M3` (no Components root) → RED by class name; `com.ceruleanCircle` literal in src → RED by file; folder == layout(namespace) over all classes; `move()` diff = one value; chained moves + ONE generate == pairs; 2nd generate 0 changed.
- P3 second binder for a model → RED by model name; model with no binder → RED by model name; map built as a string from the model name → RED.
- P4 model-typed IOR → RED by uuid; resolve returns exactly the named component, `.model` JSON-equals catalog; legacy `Web4MDA.ClassModel.latest` IOR → named refusal; old `type/Web4MDA/` gone (stale link left → RED); 2nd store 0 changed bytes.
- P5 (**RULED by oopPO 2026-10-12**): S4b P1 special case reintroduced → RED by name · `<PartType>` folder ≠ its incorporating component's name → RED · interim root find reintroduced → RED · a package `domain` attribute or a `com.ceruleanCircle` literal reintroduced → RED.

## E. S4b seeds under the new rule (oopPO ruling 2026-10-12: KEEP / RE-EXPRESS / RETIRE; never deleted silently; oopPO rules any RETIRE)
Inventory = every mode of `held/s4b-f707537f/g.sh`. **All anchors (paths, code strings) are re-derived BY CONTENT at the audit sha**; an anchor that no longer exists prints `SEED DID NOT APPLY` → STOP and reclassify with oopPO, never skipped.

| Seed | Hazard | Class | Expectation at the audit sha |
|---|---|---|---|
| N1REVERT | one fresh root per link (held root dropped) | KEEP | N1 mechanism gate RED (HeldRoots); if P5's interim-root removal deletes the roots cache → reclassify, oopPO rules |
| FSCALLER / FSCALLER2 / FSCALLER2ALL | a src file calls `node:fs` directly (named import) | KEEP | R7b fs-caller scan RED by file (single test / Pipeline / whole suite) |
| FSLINK / FSLINKPLAIN / FSLINKALL | `symlinkSync` aliased / plain / whole suite | KEEP | link-API scan RED by file (F1 closed alias evasion) |
| DYNALIAS | dynamic aliased `node:fs` import in M1Catalog code | KEEP | link-API scan RED (nearest member of the R2 body-strings allowance) |
| R7BODY | extra statement after the ScenarioIndex type link | KEEP | R7 body check RED |
| R1STALE | stale link left after a move | KEEP | RED by the stale-link check (P2 `move()` + chained moves make it more central) |
| DUPSRC | a second held source of one Definition (R3) | KEEP | TreeFileUnitRulings RED by the duplicate |
| XPKG (= R4) | an `X/` placeholder package folder | KEEP | RED (no placeholder folder) |
| DUPFOLDER | a second held package folder | KEEP | RED; also P2's folder == layout(namespace) |
| LITPKG | the test hard-codes the package path instead of deriving it | RE-EXPRESS | the literal becomes the Components-rooted path P2 derives; any literal package path in the test → RED (pairs with P2's literal-in-src seed) |
| DERIV | the rulings test's own model-folder derivation is wrong | RE-EXPRESS | P5: `<PartType>` folders = component name → seed corrupts the component-name derivation → RED |
| ROGUE / ROGUEALL | an unowned folder under `<Version>/<model>` | RE-EXPRESS | RED **by name** (was counted CHECKED; F2 ruling) |
| DRIFT | a part link retargeted to another component's unit | RE-EXPRESS | same hazard; paths re-derived under P5's component-named `<PartType>` folders; RED by the dangling/misnamed checks |
| RATIOPUT3 | gross store slowdown (put ×3) | RE-EXPRESS | F4 round 2: RED by the median-of-k ratio; if F4 is demoted to a reported metric → reported, and N1REVERT carries the regression (oopPO rules) |
| RATIOFIX | (clean arm, not a seed) | KEEP | whole-suite ×5, 0 false-RED |

**RETIRE: none proposed.** No S4b hazard became unrepresentable under P2–P5 by construction; two are conditional (N1REVERT, RATIOPUT3) and come back to oopPO before any change.

## F. Doc gates (oopPO 2026-10-12, gap MEASURED by seed: Spec.test reads no `spec/plans/*.md` → a bad plan citation stays GREEN 23/23)
- F1 **plan-citation ARM** (to be built in Phase 1; the audit proves it): the Spec doc gate's file list over `spec/plans/` is DERIVED from disk (readdirSync, never a hand list); every backticked repo citation in a plan resolves. Seed: one missing backticked citation in one plan file → RED **by file:line**; revert GREEN. Report CHECKED / SKIPPED / TOTAL citations and files. A plan file the arm does not list = RED (derived-vs-disk check).
- F2 existing Spec doc gate over `spec/*.md`: same seed one level up → RED by file:line (regression of the extension).
- **Naming law:** every gate in this list is named by its AC LABEL (IOR1–IOR7, S1–S4, P2–P5, R1–R7, N1, F1–F5), and the test file that carries it is FOUND at the audit sha by `git grep` of the label — never assumed from a file name (IOR2 lives in `IorAcceptance.test.ts`, not `Ior.test.ts`; `Ior.test.ts` does not read the `ior.md` examples). A label found in no test = RED (an AC without a gate).

## Verdict
`verdicts/END-AUDIT-<sha>.md`: per block CHECKED/SKIPPED/TOTAL, every seed RED-name + GREEN, A1 porcelain proof, F5 separate. → oopPO; TRON rules DONE.

## G. Rulings + measured inputs after the 10-12 rewind (no CPU)
- **BASE (oopPO ruling 10-12, confirming TRON drive 2701d4b5 Phase 2 #7):** the audit sha = the final Phase-1 head on origin main AFTER **P2 (a+b), P3, P4, P5** are all pushed. Not 61bb016b4, not "after P2a". Until then: run nothing, prepare only.
- **TIMING HYGIENE (oopPO, accepted):** every timing-budget arm (OneStore 20000, F1 arm 44000, any ms budget) is sampled ONLY on a quiet box: `pgrep vitest` (any other whole suite) checked BEFORE and AFTER each sample; an overlapping sample is DISCARDED, never reported.
- **Round-2 baseline (measured, read from oopBashExpert's `f4r2-proof-summary.txt`, sha 1195d5ea, ancestor of origin main):** 2 fresh-clone runs = passed 827 / skipped 2 / failed 0, rc=0, chainRed 0, OTHER none. F1 wall 14177 / 12984 ms (budget 44000); OneStore wall 7193 / 7069 ms (budget 20000); first-store ratio 7.80 / 8.75 (now a REPORTED metric). The "2" are SKIPS, not failures (my earlier bank misread them; struck in context).
- **F4 DEMOTED at 1195d5ea** → the conditional in C/E applies: RATIOPUT3 = reported (not a RED seed) and N1REVERT carries the regression **— PENDING oopPO's explicit ruling** (the table says "oopPO rules"); not reclassified by me.
