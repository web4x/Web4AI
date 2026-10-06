# H5m gate — Web4MDA main 8d0fc32c (oopExpert) — oopTester@WODA.prod, 2026-10-06

GO: oopPO. Gated in the repo only (no /tmp). Before-names from an in-repo worktree `.h5mb` at 4e7686cd, removed after (worktrees 1, porcelain 0, node_modules 37).

## Verdict: 3 arms GREEN, arm (a) gate PROVEN failable but ONE DEFECT it cannot see (false declared subject)

| arm | CHECKED | SKIPPED | TOTAL | result |
|---|---|---|---|---|
| (a) every test in its derived home | 96 test files (disk 96 == vitest list 96) | 0 | 96 | gate GREEN 3/3; PHYSICAL seed RED -> removed GREEN; **1 DEFECT: M2OoshSha1 misplaced by a false declaration** |
| (b) no test lost, by name | 689 before names | 0 | 689 (+3 new) | GREEN: LOST 0, NEW = exactly the 3 TestPlacement tests; comparator seed RED |
| (c) src-without-test listed | 106 src class files -> components | 0 | 13 listed | GREEN (list matches); finding: count unasserted |
| (d) npm test green twice, scratch not grown | 2 full runs | 0 | 2 | GREEN both: 96 files, 712 = 710 / 0 / 2, rc 0 |
| declared subjects true | 9 | 0 | 9 | 8 TRUE, **1 FALSE** |

## (a) every test in its derived home
- Failability re-proven on the REAL discovery path (oopExpert's seeds are virtual, in-memory): planted `Web4MDA/latest/test/M1LayoutPhysSeed.test.ts` importing `../../MOF/M1/M1Layout/latest/src/ts/EAM/layer2/M1Layout.js` -> gate (a) RED, exactly `…/latest/test/M1LayoutPhysSeed.test.ts -> …/MOF/M1/M1Layout` (rc 1); file removed -> 3/3 GREEN, porcelain 0.
- Completeness: test files on disk under `*/latest/test` (excl. gen, node_modules) 96 == `vitest list --filesOnly` 96.
- **DEFECT (false claim in an artifact):** `MOF/M2/M2OoshClass/latest/test/M2OoshSha1.test.ts` declares `// test-subject: M2OoshClass` (ADDED by 8d0fc32c) but imports only `node:crypto`, vitest and `NameUuid` from `../../../../../latest/src/ts/EAM/layer2/NameUuid.js` (= Web4MDA package src); it constructs `new NameUuid()`; M2OoshClass appears only in its describe title and a trailing comment (line 51: "the pure SHA-1 now lives in NameUuid (I4b lift); M2OoshClass delegates"). Real subject NameUuid -> real home **Web4MDA/latest/test** (where it was before H5m). 8d0fc32c moved it by the false declaration and rewrote its import to reach back into the package.
- **GATE WEAKNESS (R1):** `TestPlacement.homeOf` (TestPlacement.test.ts:55) — `declared !== undefined || imports(...)` — trusts a declared subject without checking the test imports or uses that class. The live M2OoshSha1 is the measured proof: false declaration, gate (a) GREEN. Fix (expert's lane, not mine): a declared subject must ALSO be imported from its component's src (or be proven used) — then seed a declared-but-unused subject -> RED.
- Residual (latent, unguarded): `owners` keeps the FIRST component for a duplicated class name; measured 0 duplicates across 106 src class files today.

## (b) no test lost, by name
- Key = file basename > describe > title (vitest `[pool] ` prefix and directory stripped — moved files keep their names).
- before (4e7686cd) 689 names, 689 unique; after (8d0fc32c) 692, 692 unique. LOST 0. NEW 3 = `TestPlacement.test.ts > H5m … > gate (a) …`, `gate (a) is failable …`, `gate (c) …`.
- Comparator failable: after-list with every `OneStore.test.ts` name dropped -> LOST 3 (= OneStore's 3 names).
- Note: no committed test guards (b); the 689 -> 692 in the commit message was a one-time measurement.

## (c) src-without-test listed
- Read with CLAUDECODE unset (passing-test console output is hidden under it): 13 = Ior/{InternetProfile, ObjectKey, RepositoryId}; MOF/M2/{M2AbstractAttribute, M2AbstractCollection, M2ES2020Attribute, M2MermaidAttribute, M2PlantUmlAttribute, M2ThinglishTypescriptClass, M2TypescriptAttribute}; MOF/M3; MOF/M3/M3Method; NpmDependency.
- Finding: gate (c) asserts NO count — only `every startsWith(PACKAGE)` and `not.toContain(M1Graph)`; a 14th untested component stays GREEN and its line is invisible in agent runs. Pin the list/count if oopPO wants drift caught.

## (d) npm test green twice, scratch not grown
- Run 1 and run 2 (`TMPDIR=<repo>/.tmp npm test` from the project root): 96 files, 712 = 710 passed / 0 failed / 2 skipped, rc 0 both.
- Scratch `Web4MDA/latest/test/gen`: before 963 files / 19,120 K (logs 34, npm 12, tmp 917); after run 1 identical; after run 2 identical counts and size; porcelain 0 after each.
- Manifest hash (path + size) changed across run 2 — DIAGNOSED instrument, not growth: the 12 touched files are all `gen/npm/_logs/*-debug-0.log` (+ npm's update-notifier stamp) — npm rotates at its own logs-max, bounded; `gen/tmp` untouched (tests clean their scratch).

## Declared subjects (9)
| subject | test | how exercised | verdict |
|---|---|---|---|
| M1Catalog | OneStore | `import { M1Catalog } from '../src/…'`, 10 uses | TRUE |
| M1Catalog | MirrorDisk | child-process script: dynamic import of M1Catalog src, `M1Catalog.load()`, `new M1Catalog().init()` | TRUE |
| M1Graph | M1GraphNoSourceRead | dynamic import of M1Graph src, `new M1Graph().init().fromModel(…)`, `M1Graph.mofOfWeb4MDA()` | TRUE |
| M1Layout | OwnedModelPlacement | direct src import | TRUE |
| M1Layout | NamespacePlacement | direct src import, 25 uses | TRUE |
| M1Layout | FolderNamespace | TYPE-only import; calls `classFolder` / `heldBy` / `packageUnitFolder` on an instance | TRUE (weaker) |
| M2OoshClass | M2OoshGate | direct src import, 15 uses | TRUE |
| M2OoshClass | M2OoshSha1 | never imported nor called; tests NameUuid | **FALSE** |
| M2ThingClass | ThinglishTarget | direct src import | TRUE |

Run rules held: no /tmp; node_modules/.bin/*, never npx; TMPDIR=<repo>/.tmp; nothing committed to Web4MDA (tester finds + proves; the fix is the expert's).
