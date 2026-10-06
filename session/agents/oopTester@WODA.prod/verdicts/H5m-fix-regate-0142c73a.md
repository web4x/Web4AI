# H5m-fix RE-GATE (W4) — Web4MDA main 0142c73a — oopTester@WODA.prod, 2026-10-06

Fix range: `d9a2ca2c..d97c26fc` = `e30a712a` (H5m C-plus: a path is a reach only as the argument of a real LOAD) + `d97c26fc` (M2OoshGate CONFIG_PATH through Scratch). Since then only `3d9f472e` (my W2, GarbageSweep) and `0142c73a` (W3, plan only). Arm text = plan row **H5m-fix** (spec/plans/2026-10-06-cleanup-outside-repo.md @ 0142c73a).
Tree during the gate: main 0142c73a = origin; the ONLY dirty file = Tron's VS Code reformat ` M latest/src/ts/EAM/layer2/Web4MDA.ts` (never staged/reverted/committed). All seeds = PHYSICAL files in the shared tree, removed after; porcelain besides Web4MDA.ts = 0 after every arm.

## Verdict: all 4 arms GREEN and failable on the real disk. 1 false-green EDGE inside the named residual (oopPO's call). Suite RED 5 = all Tron's edit.

| arm | what | measured | verdict |
|---|---|---|---|
| (a) declared subject = imported AND used; a string counts only if it LOADS the src | 7 physical seeds in MOF/M1/M1Layout/latest/test | RED: title-only, type-only, **readFileSync path-string (my re-gate-2 false-green — now caught)**, name-in-code, loaded-but-unused. GREEN: load + `new M1Layout()`. **GREEN = FALSE-GREEN: Lookalike** | GREEN (fix works) + 1 edge |
| (b) duplicate class name RED | physical `NpmDependency.ts` (untested class) copied into M1Graph src | `+ "NpmDependency: …/MOF/M1/M1Graph, …/NpmDependency"` | GREEN |
| (c) 13 untested = RATCHET | baseline 13; physical new component W4Seeded; physical NpmDependency test | grow 14 → RED `+ "W4Seeded"`; close 12 → RED `- "NpmDependency"`; only gate (c) fails | GREEN |
| (d) residual named + M2OoshGate CONFIG_PATH through Scratch, removed | run alone; physical regression seed; full suite | 13/13 pass, **0 skipped** (OOSH_DIR=/root/oosh — not hollow); seed = drop the `finally` rmSync → RED 1/13; real `/tmp/tmp.*` 1→1 alone AND 1→1 across the full suite (the 1 = pre-existing, no colour env); residual header present, its report pointer TRUE (oopExpert reports/H5m-coverage-measure-d9a2ca2c.md, 4257 B, 2a07ac22) | GREEN |

Nothing weakened: `e30a712a` removed only the old `modulePath` rule (ANY path string naming the class = reach — the false-green's cause) and added `load()` (path must be the argument of `import(` / `require(`) = stricter. No `expect` removed by either commit. No test lost: TestPlacement it 5→5 (1 retitled, same test), expect 16→19; M2OoshGate it 12→13 (+CONFIG_PATH test), expect 25→28.

## FALSE-GREEN EDGE (for oopPO — inside the named RESIDUAL, not fixed by me)
`W4SeedLookalike.test.ts`: `// test-subject: M1Layout` + `await import('…/M1Layout/latest/src/ts/EAM/layer2/M1Layout.ts')` (a real load, result discarded) + `const M1Layout = 'not the class'` → GREEN. "Use" is matched by NAME (`\bM1Layout\b`), so any same-named identifier satisfies it — the class is loaded but never used. This is exactly the shape of the gate's OWN GREEN twin (`readNamed` carries `const M1Layout = 'not the class';`) — still a valid minimal-diff proof of the LOAD rule, but its GREEN rests on a lookalike. Covered by the header's "text analysis can always be fooled one step further"; the build path is the V8-coverage report already named there.

## Observations (no action taken)
- Gate (a) asserts `misplaced` BEFORE `duplicates`: a duplicate of a TESTED class (seeded M1Layout into M1Graph) is reported as MISPLACED, never as duplicate — still RED (no false-green), wrong label. Arm (b) had to use an untested class to reach the duplicate check.
- The gate's own failability seeds are VIRTUAL (`.seed(path, text)` into a map); every arm above was re-proven with PHYSICAL files through the real disk discovery.

## Full suite (once, on 0142c73a + Tron's edit, TMPDIR=<repo>/.tmp)
716 = 709 passed / 5 failed / 2 skipped, exit 1. All 5 RED name Web4MDA = Tron's reformat, ATTRIBUTED, not fixed: Pipeline ROOT GATE, M1Catalog TS==src, ModelStyle AC5–AC7, M2TypescriptClass renders==disk, M3Class spec 12 AC5. W2's AC2b "suite REWROTE package.json" did NOT reproduce (mtime unchanged, content == HEAD) → intermittent, still unexplained.
