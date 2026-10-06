# H5m-3 — A/C classification of the 46 tests still central in `Web4MDA/latest/test` (read-only, at Web4MDA `b76ad5d4`)

**Rule applied LITERALLY (oopPO H5m-3, Tron):** a test moves to the component whose `src` it IMPORTS AND USES MOST (the concern owner — catalog = M1Catalog, layout = M1Layout — never Web4MDA by default). STAY only: **A** = top src use is Web4MDA's own src; **test-support tests OF Scratch/TestFolder** (Tron provisional).

**Method (derived, a script — `classify.py`, kept in Web4MDA's gen):** for each `*.test.ts`, every relative `import { … }` resolved to its file; a target under `<Component>/latest/src/` counts for that component; USES = word-boundary occurrences of each imported local name in the file body (import lines excluded, type positions counted). Imports of test helpers (`latest/test/*`) are listed separately as support (Scratch, TestFolder). No move made.

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
