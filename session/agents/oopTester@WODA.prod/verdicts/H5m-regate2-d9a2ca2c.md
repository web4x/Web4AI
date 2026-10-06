# H5m RE-GATE 2 — Web4MDA main d9a2ca2c (oopExpert fix2 of verdict H5m-regate-7e521d5d) — oopTester@WODA.prod, 2026-10-06

GO: oopPO. Repo only (no /tmp). Seeds PHYSICAL on the real discovery path, each removed (porcelain 0 after every step). Worktrees `.h5mb` (4e7686cd) + `.h5mc` (7e521d5d) in-repo, removed (worktrees 1, node_modules 37). fix2 touched 2 TEST files only (TestPlacement.test.ts, FolderNamespace.test.ts); product src unchanged.

## Verdict: all ordered arms GREEN; ONE remaining false-green edge in the child-script exception (path string = reach + use)

| arm | CHECKED | SKIPPED | TOTAL | result |
|---|---|---|---|---|
| (1) S2 / type-only RED, child-script GREEN | 4 physical seeds | 0 | 4 | GREEN for the 3 ordered shapes; **probe PathString NOT caught** |
| (2) FolderNamespace edit real + nothing weakened | 1 test file | 0 | 1 | GREEN — new assertion real (lookalike seed RED), expect 12 -> 13, it 6 -> 6 |
| (3) names | 694 | 0 | 694 | GREEN — originals 689 lost 0; 1 out / 1 in = one TestPlacement retitle |
| (4) green twice, scratch flat | 2 runs | 0 | 2 | GREEN — 96 files, 714 = 712 / 0 / 2, rc 0 twice |

## (1) declared-subject check (physical seeds in MOF/M1/M1Layout/latest/test, all `// test-subject: M1Layout`)
- SeedTitleOnly (my S2): `import type` + name only in a describe title -> RED `-> <declared subject 'M1Layout' is not imported AND used>`.
- SeedTypeOnly: `import type` + `const layout: M1Layout | undefined` -> RED, same message.
- SeedChildScript: no import; template literal `const { M1Layout } = await import('/r/…/M1Layout/latest/src/ts/EAM/layer2/M1Layout.js'); new M1Layout();` -> GREEN (stays in its folder).
- **PROBE SeedPathString — FALSE-GREEN:** no import; only `readFileSync('…/MOF/M1/M1Layout/latest/src/ts/EAM/layer2/M1Layout.ts', 'utf8')` — the class never runs. Not in the misplaced list = accepted as a true declaration. Cause: `modulePath()` matches `.js` OR `.ts`, `reaches()` accepts a module path in any non-import text, and `uses()` keeps a literal that contains the module path as code — the path itself contains the class name, so ONE path string supplies both reach and use. Fix (expert's lane): the child-script exception should require a LOAD of the path (`import(` / `await import(` in the literal, `.js`) and a use of the name OUTSIDE the path itself; then seed the path-string shape -> RED. Impact today: none measured (every real declared test also has a value import or a real `new X` / `X.` use); it is an open channel, same class as S2.

## (2) FolderNamespace (MOF/M1/M1Layout/latest/test/FolderNamespace.test.ts)
- The new line (92) sits in "M3Element KEEPS Web4MDA.MOF.M3 …": `const layout = catalog.homeLayout('')` (91), `expect(layout).toBeInstanceOf(M1Layout)` (92), then `layout.classFolder('M3Element', 'ts')` (95) and `layout.classFolder('NameUuid', 'ts')` (96) — the SAME object the test drives. `FolderLaw` gets its layout from the same factory (`this.catalog.homeLayout('')`, lines 53/68).
- REAL, failable: seeded `expect({ ...layout }).toBeInstanceOf(M1Layout)` (a lookalike with the same fields, no prototype) -> that test RED at :92 (1 failed / 5 passed); restored exactly (diff 0) -> 6/6. Passing also proves class identity: the M1Layout the test imports IS the class the catalog instantiates (no second module copy).
- Nothing weakened: `expect(` 12 -> 13, `it(` 6 -> 6; the ONLY removed line is `import type { M1Layout } …` (replaced by the value import).
- **My round-1 verdict ("TRUE (weaker): type-only import; calls classFolder / heldBy / packageUnitFolder on an instance") — conclusion RIGHT, proof UNDER-MEASURED.** Right: fix2 changed no product code and the instanceof now passes on the unchanged factory, so the object was an M1Layout all along — the test always exercised M1Layout. Under-measured: I inferred the runtime class from method names called on a parameter TYPED M1Layout (compile-time only) and never measured the instance; and I did not flag that the gate's only evidence for it was a type import, which is erased at runtime. Lesson: a type annotation is not evidence of the runtime class — assert it (`instanceof`).

## (3) names (key: file basename > describe > title)
- 4e7686cd 689 (689 unique) · 7e521d5d 694 (694) · d9a2ca2c 694 (694). Originals lost 0.
- 7e521d5d -> d9a2ca2c: out 1 / in 1, both in TestPlacement.test.ts, the same test retitled: "a DECLARED subject is verified, never trusted: it must be imported AND used in code — a false declaration is RED …" -> "a DECLARED subject is verified, never trusted: a VALUE import (or a child-script module load) …". Nothing else renamed.
- Comparator failable in this run: renaming one OneStore title -> lost 1, new 1.

## (4) green twice, scratch flat
- `TMPDIR=<repo>/.tmp npm test` x2: 96 files, 714 = 712 / 0 / 2, rc 0 both; porcelain 0 after each.
- Scratch `latest/test/gen`: 963 files / 19,120 K, `gen/tmp` manifest `8576c44e75fc` before = after run 1 = after run 2 = after all seeds and worktrees.

Nothing committed to Web4MDA; the fix is the expert's.
