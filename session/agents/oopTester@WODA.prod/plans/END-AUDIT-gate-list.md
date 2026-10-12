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
- P5 **NEEDS RULING (oopPO):** the plan names no seeds. Proposed: re-introduce the S4b P1 special case / an interim root find → RED by name; `<PartType>` folder ≠ component name → RED. Also rule which S4b seeds (R1/R3/R4/DUPSRC/ROGUE) keep their meaning under the new rule.

## Verdict
`verdicts/END-AUDIT-<sha>.md`: per block CHECKED/SKIPPED/TOTAL, every seed RED-name + GREEN, A1 porcelain proof, F5 separate. → oopPO; TRON rules DONE.
