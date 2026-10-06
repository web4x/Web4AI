# H5m-3 — A/C classification of the 46 tests still central in `Web4MDA/latest/test` (read-only, at Web4MDA `b76ad5d4`)

**Rule applied LITERALLY (oopPO H5m-3, Tron):** a test moves to the component whose `src` it IMPORTS AND USES MOST (the concern owner — catalog = M1Catalog, layout = M1Layout — never Web4MDA by default). STAY only: **A** = top src use is Web4MDA's own src; **test-support tests OF Scratch/TestFolder** (Tron provisional).

**Method (derived, a script — `classify.py`, kept in Web4MDA's gen):** for each `*.test.ts`, every relative `import { … }` resolved to its file; a target under `<Component>/latest/src/` counts for that component; USES = word-boundary occurrences of each imported local name in the file body (import lines excluded, type positions counted). Imports of test helpers (`latest/test/*`) are listed separately as support (Scratch, TestFolder). No move made.

## REVISION 2 — oopPO rulings on 820e2119 applied: SUBJECT = the component whose behaviour the ASSERTIONS check

**Method (derived — `asserts.py` in Web4MDA's gen):** every `expect(…)` argument is attributed to the components it reads: imported names map to their component; locals built from them (`const c = new M1Catalog()…`, `this.x = …`) inherit it (fixpoint). Pure TOOL helpers — Scratch (fixture paths), Child (process runner), Generated, Source (file readers) — are NOT a subject unless the test is named after them (a file read from a fixture path asserts the thing generated, not Scratch). Ties -> the MORE SPECIFIC component, never the root. No src component in any assertion -> test-support (the DERIVED F3 set). Verdict counts: {'MOVE': 17, 'STAY': 29}.

**F4 — measured, not as ruled:** by assertions TypedReferences is NOT tied: M1Catalog 16 vs Web4MDA 6 (OoshUnit 0 in assertions; the 11=11 tie was in MENTIONS). Verdict below follows the evidence (-> M1Catalog); oopPO to confirm or overrule.
**F1** BootstrapScratch: assertions Scratch 24 vs M1Catalog 6 -> STAY (Scratch support), as ruled. **F2** UcpComponentMove: Ior/RepositoryId 6 vs Web4MDA 5 -> RepositoryId, as ruled; M2OoshSha1 Web4MDA 5 -> STAY (A), as ruled.
**WEAK** rows (<=2 src assertions) are flagged: their subject is thin evidence (Pipeline: 1 PlantUmlServer assertion, the rest assert the run/tree via tools; SpecIteration: 3-way 1=1=1 tie).

| Test | expects | assertion attribution (src + named test-support) | verdict | vs 820e2119 |
|---|---|---|---|---|
| Boilerplate | 41 | DefaultFolder=11 Web4MDA=6 MOF/M1/M1Catalog=5 | MOVE -> DefaultFolder | **CHANGED** (was A) |
| BootstrapScratch | 53 | test-support:Scratch=24 MOF/M1/M1Catalog=6 | STAY (F1: Scratch — oopPO) | **CHANGED** (was MOVE -> Web4MDA/MOF/M1/M1Catalog) |
| Child | 8 | test-support:Child=4 | STAY (test-support, derived) | **CHANGED** (was MOVE -> Web4MDA/MOF/M1/M1Catalog) |
| ComponentModelInc1 | 42 | DefaultFile=5 DefaultFolder=2 | MOVE -> DefaultFile | **CHANGED** (was MOVE -> Web4MDA/DefaultFolder) |
| ComponentModelInc2 | 21 | MOF/M1/M1Catalog=5 Web4MDA=2 | MOVE -> MOF/M1/M1Catalog |  |
| FileUnitsMigration | 20 | MOF/M1/M1Catalog=12 | MOVE -> MOF/M1/M1Catalog |  |
| Folder | 68 | Web4MDA=21 MOF/M1/M1Catalog=21 | MOVE -> MOF/M1/M1Catalog (tie -> specific) | **CHANGED** (was A) |
| GarbageSweep | 20 | - | STAY (test-support, derived) |  |
| GenClaims | 27 | - | STAY (test-support, derived) | **CHANGED** (was MOVE -> Web4MDA/MOF/M1/M1Catalog) |
| GenReaders | 16 | Web4MDA=2 | STAY (A) | **CHANGED** (was MOVE -> Web4MDA/MOF/M1/M1Catalog) |
| M2OoshSha1 | 6 | Web4MDA=5 | STAY (A) |  |
| Model | 6 | Web4MDA=3 | STAY (A) |  |
| ModelJson | 39 | Web4MDA=21 MOF/M1/M1Catalog=11 MOF/M2/M2ThinglishTypescriptClass=3 | STAY (A) |  |
| ModelSource | 10 | Web4MDA=5 MOF/M1/M1Catalog=1 | STAY (A) |  |
| ModelStyle | 40 | Web4MDA=25 | STAY (A) |  |
| MofLayoutAC5 | 47 | MOF/M1/M1Catalog=13 | MOVE -> MOF/M1/M1Catalog |  |
| MofPlainNode | 11 | MOF/M1/M1Catalog=9 | MOVE -> MOF/M1/M1Catalog |  |
| NameUuid | 7 | Web4MDA=7 | STAY (A) |  |
| NoTempDirOutsideScratch | 1 | MOF/M1/M1Catalog=1 | MOVE -> MOF/M1/M1Catalog · **WEAK (<=2 src assertions)** |  |
| Node22 | 31 | other=10 | STAY (test-support, derived) |  |
| OoshExecute | 12 | - | STAY (test-support, derived) |  |
| Pipeline | 20 | PlantUmlServer=1 | MOVE -> PlantUmlServer · **WEAK (<=2 src assertions)** | **CHANGED** (was MOVE -> Web4MDA/MOF/M1/M1Catalog) |
| ReferencePolymorphism | 21 | MOF/M1/M1Catalog=11 Web4MDA=10 MOF/M2/M2TypescriptClass=3 | MOVE -> MOF/M1/M1Catalog | **CHANGED** (was A) |
| ScenarioLayoutSC1 | 6 | MOF/M1/M1Catalog=3 | MOVE -> MOF/M1/M1Catalog |  |
| ScratchExclusion | 7 | - | STAY (test-support, derived) |  |
| SlowReport | 5 | test-support:SlowReport=3 | STAY (test-support, derived) |  |
| SoloGroup | 10 | MOF/M1/M1Catalog=1 | MOVE -> MOF/M1/M1Catalog · **WEAK (<=2 src assertions)** |  |
| Spec | 62 | - | STAY (test-support, derived) | **CHANGED** (was MOVE -> Web4MDA/MOF/M1/M1Catalog) |
| SpecIteration | 10 | RadicalOopGate=1 Web4MDA=1 MOF/M1/M1Catalog=1 | MOVE -> RadicalOopGate (tie -> specific) | **CHANGED** (was A) |
| SrcTypecheck | 17 | - | STAY (test-support, derived) | **CHANGED** (was MOVE -> Web4MDA/MOF/M1/M1Catalog) |
| TestBudget | 9 | - | STAY (test-support, derived) |  |
| TestFolder | 13 | test-support:TestFolder=12 | STAY (test-support, derived) |  |
| TestPlacement | 19 | - | STAY (test-support, derived) |  |
| TestTypecheck | 3 | - | STAY (test-support, derived) |  |
| TrackedTree | 4 | test-support:TrackedTree=3 | STAY (test-support, derived) |  |
| Tree | 44 | Web4MDA=14 Package=7 DefaultFile=4 | STAY (A) |  |
| TreeFileUnitInc1 | 58 | Web4MDA=33 DefaultFile=19 MOF/M1/M1Catalog=4 | STAY (A) |  |
| TreeFileUnitRulings | 38 | Package=13 Web4MDA=9 NpmPackage=7 | MOVE -> Package |  |
| Type | 38 | Web4MDA=16 | STAY (A) |  |
| TypedReferences | 30 | MOF/M1/M1Catalog=16 Web4MDA=6 | MOVE -> MOF/M1/M1Catalog | **CHANGED** (was A) |
| UcpComponent | 42 | DefaultFolder=20 NpmPackage=6 MOF/M1/M1Catalog=4 | MOVE -> DefaultFolder | **CHANGED** (was A) |
| UcpComponentMove | 15 | Ior/RepositoryId=6 Web4MDA=5 MOF/M1/M1Catalog=4 | MOVE -> Ior/RepositoryId |  |
| Unit | 33 | Web4MDA=26 | STAY (A) |  |
| UnitReferencesInc2 | 67 | Web4MDA=55 MOF/M1/M1Catalog=3 | STAY (A) |  |
| Web4MDA | 25 | Web4MDA=24 | STAY (A) |  |
| WriteRecorder | 19 | - | STAY (test-support, derived) |  |

## REVISION 1 (820e2119, mentions-based — SUPERSEDED by Revision 2)
## Totals: A 18 · C 17 · no src import 11

## C — MOVE (literal rule), target = top src component
| Test | → target (uses) | 2nd (uses) | note |
|---|---|---|---|
| ComponentModelInc1 | DefaultFolder (12) | DefaultFile (4) | |
| ComponentModelInc2 | M1Catalog (4) | Web4MDA (2) | |
| FileUnitsMigration | M1Catalog (1) | — | catalog as loader only |
| GenClaims | M1Catalog (3) | — | |
| GenReaders | M1Catalog (2) | Web4MDA (1) | |
| MofLayoutAC5 | M1Catalog (29) | Web4MDA (19) | layout concern, but M1Layout is NOT its top import |
| MofPlainNode | M1Catalog (5) | — | |
| NoTempDirOutsideScratch | M1Catalog (2) | — | its SUBJECT is the scratch rule (H4b) — see flag F3 |
| Pipeline | M1Catalog (6) | PlantUmlServer (1) | Scratch(11) is TOOL use, not subject |
| ScenarioLayoutSC1 | M1Catalog (1) | — | |
| SoloGroup | M1Catalog (3) | — | subject = vitest.config's SoloTests — see F3 |
| Spec | M1Catalog (1) | — | |
| SrcTypecheck | M1Catalog (2) | — | Scratch(5) tool use |
| Child | M1Catalog (1) | — | subject = test helper Child — see F3 |
| TreeFileUnitRulings | Package (30) | Version (19) | |
| UcpComponentMove | Ior/RepositoryId (16) | M1Catalog (11) | title names UcpComponent.move — see F2 |
| BootstrapScratch | M1Catalog (8) | — | Scratch(7): its SUBJECT is Scratch → **STAY as Scratch test-support** (F1) |

## A — STAY (top src use = Web4MDA's own src)
Boilerplate, Folder, M2OoshSha1 (F2), Model, ModelJson, ModelSource, ModelStyle, NameUuid, ReferencePolymorphism, SpecIteration, Tree, TreeFileUnitInc1, Type, TypedReferences (**TIE** Web4MDA 11 = OoshUnit 11, F4), UcpComponent, Unit, UnitReferencesInc2, Web4MDA.

## No src import — the literal rule cannot place them (11)
| Test | imports | actual subject |
|---|---|---|
| TestFolder | TestFolder(13), Scratch(2) | TestFolder → **STAY** (Tron provisional) |
| TestPlacement | TestFolder(1) | TestFolder → **STAY** |
| ScratchExclusion | Scratch(2) | the scratch exclusion → **STAY** (Scratch support) |
| GarbageSweep | Scratch(1) | gates/GarbageSweep (H5b gate) |
| TrackedTree | Scratch(1) | TrackedTree (globalSetup guard) |
| WriteRecorder | Scratch(1) | gates write recorder (H4a) |
| TestBudget | Scratch(1) | vitest timeout budget |
| SlowReport | — | SlowReport (reporter) |
| TestTypecheck | — | tsconfig.test.json type-check |
| Node22 | Scratch(2) | scripts/node22.mjs launcher |
| OoshExecute | Scratch(2) | executes generated OOSH (no src import) |

## Flags for oopPO's ruling (no move until GO)
- **F1** BootstrapScratch: literal → M1Catalog (8 vs Scratch 7), but it tests Scratch → STAY as test-support (your exception). Confirm.
- **F2** name vs evidence: UcpComponentMove → Ior/RepositoryId (16) although titled UcpComponent.move; M2OoshSha1 → A (Web4MDA) although named for M2OoshClass. Literal rule says as shown.
- **F3** test-infrastructure subjects (Child, SoloGroup, NoTempDirOutsideScratch; and the 8 non-STAY no-src tests): their subject is Web4MDA's own TEST machinery or scripts, not a src class. The literal rule moves the first three to M1Catalog on 1–3 loader uses and cannot place the other 8. Options: (a) STAY as Web4MDA test-support (extends your exception from Scratch/TestFolder to all Web4MDA test machinery), (b) move per literal rule, unplaceable ones stay. Recommend (a).
- **F4** TypedReferences: a TIE (Web4MDA 11 = OoshUnit 11) — needs a tie rule (recommend: stays, A wins ties = no move on equal evidence).
- Uses = textual occurrences of the imported local names; a loader-only import (`new M1Catalog().init()`) counts 1–2. Low-count C rows (≤3) are plumbing by evidence, flagged by the count itself.

## Full machine table
| Test | Class | Top src component (uses) | 2nd (uses) | #src comps | test-support imported |
|---|---|---|---|---|---|
| Boilerplate.test.ts | A | Web4MDA (44) | Web4MDA/DefaultFolder (20) | 7 | Scratch(1) |
| BootstrapScratch.test.ts | C | Web4MDA/MOF/M1/M1Catalog (8) | - (0) | 1 | Scratch(7) |
| Child.test.ts | C | Web4MDA/MOF/M1/M1Catalog (1) | - (0) | 1 | Scratch(1) |
| ComponentModelInc1.test.ts | C | Web4MDA/DefaultFolder (12) | Web4MDA/DefaultFile (4) | 3 | Scratch(3) |
| ComponentModelInc2.test.ts | C | Web4MDA/MOF/M1/M1Catalog (4) | Web4MDA (2) | 2 |  |
| FileUnitsMigration.test.ts | C | Web4MDA/MOF/M1/M1Catalog (1) | - (0) | 1 |  |
| Folder.test.ts | A | Web4MDA (119) | Web4MDA/DefaultFile (45) | 15 | Scratch(1) |
| GarbageSweep.test.ts | S? | - (0) | - (0) | 0 | Scratch(1) |
| GenClaims.test.ts | C | Web4MDA/MOF/M1/M1Catalog (3) | - (0) | 1 | Scratch(1) |
| GenReaders.test.ts | C | Web4MDA/MOF/M1/M1Catalog (2) | Web4MDA (1) | 2 | Scratch(2) |
| M2OoshSha1.test.ts | A | Web4MDA (5) | - (0) | 1 |  |
| Model.test.ts | A | Web4MDA (18) | - (0) | 1 |  |
| ModelJson.test.ts | A | Web4MDA (43) | Web4MDA/MOF/M1/M1Catalog (3) | 3 | Scratch(1) |
| ModelSource.test.ts | A | Web4MDA (8) | Web4MDA/MOF/M1/M1Catalog (4) | 3 |  |
| ModelStyle.test.ts | A | Web4MDA (44) | Web4MDA/MOF/M1/M1Catalog (12) | 3 |  |
| MofLayoutAC5.test.ts | C | Web4MDA/MOF/M1/M1Catalog (29) | Web4MDA (19) | 3 | Scratch(4) |
| MofPlainNode.test.ts | C | Web4MDA/MOF/M1/M1Catalog (5) | - (0) | 1 | Scratch(2) |
| NameUuid.test.ts | A | Web4MDA (6) | - (0) | 1 |  |
| NoTempDirOutsideScratch.test.ts | C | Web4MDA/MOF/M1/M1Catalog (2) | - (0) | 1 |  |
| Node22.test.ts | S? | - (0) | - (0) | 0 | Scratch(2) |
| OoshExecute.test.ts | S? | - (0) | - (0) | 0 | Scratch(2) |
| Pipeline.test.ts | C | Web4MDA/MOF/M1/M1Catalog (6) | Web4MDA/PlantUmlServer (1) | 2 | Scratch(11) |
| ReferencePolymorphism.test.ts | A | Web4MDA (8) | Web4MDA/MOF/M1/M1Catalog (5) | 4 |  |
| ScenarioLayoutSC1.test.ts | C | Web4MDA/MOF/M1/M1Catalog (1) | - (0) | 1 |  |
| ScratchExclusion.test.ts | S? | - (0) | - (0) | 0 | Scratch(2) |
| SlowReport.test.ts | ? | - (0) | - (0) | 0 |  |
| SoloGroup.test.ts | C | Web4MDA/MOF/M1/M1Catalog (3) | - (0) | 1 | Scratch(1) |
| Spec.test.ts | C | Web4MDA/MOF/M1/M1Catalog (1) | - (0) | 1 |  |
| SpecIteration.test.ts | A | Web4MDA (8) | Web4MDA/MOF/M1/M1Catalog (2) | 4 |  |
| SrcTypecheck.test.ts | C | Web4MDA/MOF/M1/M1Catalog (2) | - (0) | 1 | Scratch(5) |
| TestBudget.test.ts | S? | - (0) | - (0) | 0 | Scratch(1) |
| TestFolder.test.ts | S? | - (0) | - (0) | 0 | Scratch(2), TestFolder(13) |
| TestPlacement.test.ts | S? | - (0) | - (0) | 0 | TestFolder(1) |
| TestTypecheck.test.ts | ? | - (0) | - (0) | 0 |  |
| TrackedTree.test.ts | S? | - (0) | - (0) | 0 | Scratch(1) |
| Tree.test.ts | A | Web4MDA (70) | Web4MDA/DefaultFile (20) | 5 |  |
| TreeFileUnitInc1.test.ts | A | Web4MDA (102) | Web4MDA/DefaultFile (55) | 5 | Scratch(1) |
| TreeFileUnitRulings.test.ts | C | Web4MDA/Package (30) | Web4MDA/Version (19) | 7 | Scratch(2) |
| Type.test.ts | A | Web4MDA (81) | Web4MDA/MOF/M1/M1Catalog (11) | 2 | Scratch(3) |
| TypedReferences.test.ts | A | Web4MDA (11) | Web4MDA/OoshUnit (11) | 3 |  |
| UcpComponent.test.ts | A | Web4MDA (32) | Web4MDA/NpmPackage (14) | 8 | Scratch(1) |
| UcpComponentMove.test.ts | C | Web4MDA/Ior/RepositoryId (16) | Web4MDA/MOF/M1/M1Catalog (11) | 4 | Scratch(1) |
| Unit.test.ts | A | Web4MDA (44) | Web4MDA/MOF/M1/M1Catalog (6) | 2 |  |
| UnitReferencesInc2.test.ts | A | Web4MDA (74) | Web4MDA/MOF/M1/M1Catalog (6) | 3 | Scratch(1) |
| Web4MDA.test.ts | A | Web4MDA (27) | - (0) | 1 |  |
| WriteRecorder.test.ts | S? | - (0) | - (0) | 0 | Scratch(1) |
