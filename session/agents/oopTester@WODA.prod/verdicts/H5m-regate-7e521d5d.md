# H5m RE-GATE — Web4MDA main 7e521d5d (oopExpert fix of verdict H5m-gate-8d0fc32c) — oopTester@WODA.prod, 2026-10-06

GO: oopPO. Repo only (no /tmp). All seeds PHYSICAL files on the real discovery path (oopExpert's arms are virtual), each removed after; porcelain 0 after every step; worktrees `.h5mb` (4e7686cd) + `.h5mc` (8d0fc32c) in-repo, removed (worktrees 1, node_modules 37).

## Verdict: (1)(3)(4)(5)(6) GREEN; (2) the new check is failable BUT has a FALSE-GREEN edge (string literal counts as "use")

| arm | CHECKED | SKIPPED | TOTAL | result |
|---|---|---|---|---|
| (1) M2OoshSha1 home + declaration | 1 | 0 | 1 | GREEN — `Web4MDA/latest/test/M2OoshSha1.test.ts`, declares NameUuid, imports `../src/ts/EAM/layer2/NameUuid.js`, `new NameUuid()` |
| (2) declared-subject verification failable | 2 physical seeds | 0 | 2 | S1 RED (proven); **S2 NOT caught = false-green** |
| (3) duplicate class name RED | 2 physical seeds | 0 | 2 | GREEN (both RED, `duplicates` assertion isolated) |
| (4) ratchet both ways | 2 physical seeds | 0 | 2 | GREEN (new gap RED, closed gap RED) |
| (5) names | 689 originals + 3 retitles + 2 new | 0 | 694 | GREEN — originals lost 0; all changed names inside TestPlacement.test.ts |
| (6) green twice, scratch flat | 2 runs | 0 | 2 | GREEN — 96 files, 714 = 712 / 0 / 2, rc 0 twice |

## (2) declared-subject verification
- S1 `MOF/M1/M1Layout/latest/test/SeedFalseDecl.test.ts`: `// test-subject: M1Layout`, imports only vitest -> RED, `-> <declared subject 'M1Layout' is not imported AND used>`. Removed -> 5/5 GREEN.
- **S2 `MOF/M1/M1Layout/latest/test/SeedTitleOnly.test.ts` — FALSE-GREEN:** `// test-subject: M1Layout`, `import type { M1Layout } from '../src/ts/EAM/layer2/M1Layout.js'`, and M1Layout named ONLY inside `describe('M1Layout is only named in this title', …)`. Absent from the misplaced list = accepted as a true declaration. Cause: `TestPlacement.uses()` (TestPlacement.test.ts:89-95) drops import/comment lines but counts the class name inside STRING LITERALS (a describe/it title, a string) as use; `reaches()` accepts a type-only import. A test that exercises nothing of its declared class passes. This is the M2OoshSha1 shape (class named in its describe title) plus a type import. Fix (expert's lane): strip string/template literals before the use check (or require a value use: `new X`, `X.`, `X(`), then seed the title-only shape -> RED. oopExpert's own `DeclaredByScript` arm uses `const use = 'M1Layout';` — a string — and a bare `M1Layout;` line; the string is exactly the false-green channel.

## (3) duplicate class name
- Physical `MOF/M1/M1Graph/latest/src/ts/EAM/layer2/M1Layout.ts` -> RED: every M1Layout test `-> <class 'M1Layout' is declared in 2 components — not unique>` (fires via `misplaced`, which runs first in the same test).
- ISOLATED the `duplicates` assertion: physical `MOF/M1/M1Graph/latest/src/ts/EAM/layer2/NpmDependency.ts` (a class with no tests, so misplaced stays empty) -> gate (a) RED with `NpmDependency: MOF/M1/M1Graph, NpmDependency`.

## (4) ratchet
- New gap: physical `SeedRatchetComp/latest/src/ts/EAM/layer2/SeedRatchetComp.ts` -> ratchet RED `+ "SeedRatchetComp"` (only that test failed).
- Closed gap: physical `NpmDependency/latest/test/NpmDependency.test.ts` importing + `new NpmDependency()` -> ratchet RED `- "NpmDependency"` until the baseline is lowered.
- Baseline now asserted by name (13 = the list in verdict H5m-gate-8d0fc32c): the 8d0fc32c finding "count unasserted" is CLOSED.

## (5) names (key: file basename > describe > title)
- 4e7686cd 689 (689 unique) · 8d0fc32c 692 (692) · 7e521d5d 694 (694).
- All 689 originals present in 7e521d5d: lost 0.
- 8d0fc32c -> 7e521d5d: out 3 / in 5, ALL in `TestPlacement.test.ts`: describe `gate a + c` -> `gates a + c`; `gate (a): … none misplaced` -> `gate (a): … no class name is held by two components`; `gate (a) is failable: a misplaced file …` -> `… a misplaced test …`; `gate (c): … is LISTED` -> `gate (c) RATCHET: …`; NEW `a DECLARED subject is verified, never trusted …`, NEW `a class name held by TWO components is RED …`. Nothing outside oopExpert's gate file renamed.
- Comparator failable in this run: renaming one OneStore title -> lost 1, new 1, flagged outside TestPlacement 1.

## (6) green twice, scratch flat
- `TMPDIR=<repo>/.tmp npm test` x2: 96 files, 714 = 712 / 0 / 2, rc 0 both; porcelain 0 after each.
- Scratch `latest/test/gen`: 963 files / 19,120 K, `gen/tmp` manifest `8576c44e75fc` before = after run 1 = after run 2 = after all seed runs.

Nothing committed to Web4MDA; the fix is the expert's.
