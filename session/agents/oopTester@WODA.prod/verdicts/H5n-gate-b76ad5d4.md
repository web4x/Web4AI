# H5n GATE — Web4MDA main b76ad5d4 — oopTester@WODA.prod, 2026-10-06

Plan row H5n (spec/plans/2026-10-06-cleanup-outside-repo.md:43) + oopPO rulings Q1/Q2/(e) (prep `H5n-gate-PREP-b76ad5d4.md` @ a3dbaf80). oopPO GO: run now, DETECT Tron's `npm start` pid 1868291 (still alive throughout, its 3 bootstrap children 1868422/1868594/1868596 too) instead of waiting. Every run wrapped: `.tmp` mtime + porcelain WHOLE before; AC2b guard + porcelain + `.tmp` mtime after — no run showed his process rewriting anything (`.tmp` mtime 19:39:33 unchanged, porcelain identical).

## CHECKED 7 / UNMEASURED 1 / TOTAL 8 — every seed RED; 1 false-green edge; 2 REDs CONFOUNDED

| # | check | measured | seed -> RED | verdict |
|---|---|---|---|---|
| a | no random-named scratch anywhere | 0 true random names outside `Web4MDA/latest/test/gen/tmp`. My S1 mkdtemp-suffix clause hit 3 (`h2-socket`, `h5n-locker`, `w4mda-tsc-mirror`) — each a LITERAL `fixture('…')` name in source (BootstrapScratch:82/:187, SrcTypecheck:154) = instrument false positives. npm cache 0. **NAMED SKIP** `gen/tmp` (637 entries, tool-owned, Q1: fixed + wiped per run, bounded by d) | `tmp.Ab12Cd` in M1Layout gen + `tmp.Ef34Gh` next to `tmp/` in Web4MDA gen -> GarbageSweep FOUND both, my S1 2 | GREEN |
| b1 | every scratch path in its writing test's component — layout | GarbageSweep's new H5n pattern "every gen beyond its live entries" (12 gens) | NpmPackage test -> M1Layout gen, fabricated owner `GhostOwner.test` -> FOUND | GREEN |
| b2 | — same, writer identity | **FALSE-GREEN EDGE** (below) | NpmPackage test -> M1Layout gen with the REAL owner `M1Layout.test` -> NOT found | EDGE |
| b3 | 0 writes outside the repo (WriteRecorder, NoEscapeProbe --here) | **UNMEASURED** — under the recorder the full run exceeds the harness (600 s foreground limit; the harness moved it to the background and KILLED it at 30 min). Instrument limit, NOT a product verdict. It left a stale `Web4MDA gen/lock` (dead pid 2341321) that `Scratch.lock` took over by design on my next run (self-healing, observed). In-repo half covered: porcelain WHOLE identical around every run | — | CANNOT MEASURE YET |
| c | fixture level, standalone processes (Q2) | different components (NpmPackage, M1Layout): both got the fixture in 1 ms, 2 s holds OVERLAP; same component: 2nd asked during the 1st's hold, got it 18 ms AFTER the 1st ended (waited 1.7 s) | `lock()` no-op -> same-component 2nd got it in 1 ms, overlapping = collision | GREEN |
| d | green twice, scratch bounded | run 1 and run 2: 718 = 714 / 2 / 2, identical 2 RED (CONFOUNDED, below); outside gen/tmp 2793 = 2793 entries, identical names (npm logs rotate at a constant 11); gen/tmp wiped per run (694 -> 1 -> 637, bounded by one run; the variance is unexplained); porcelain WHOLE identical before/after both | `fixture()` wipe removed -> stale file survives a re-use (unseeded: wiped) | GREEN |
| e | 2 CONCURRENT runs serialize cleanly (Ruling A) | at RUN level with `npm test -- Folder.test.ts` x2: both 13/13, porcelain + `.tmp` unchanged, 2nd ended +2.17 s later than an unlocked run would (solo 5.38 s; its startup ran in parallel, its locked phase waited for the 1st) | `lock()` no-op -> the runs CORRUPT each other: Y's run-start wipe deleted X's live Vite SSR cache (X: ENOENT `gen/tmp/…/ssr/…`, "no tests"; Y: ENOTEMPTY) | GREEN (small-run scale) |
| x | planted `*.test.ts` in a NON-Web4MDA gen not collected | M1Layout gen: 0 of 96 collected | control: the same file outside gen -> collected (1) | GREEN |

Two FULL concurrent runs (e at full scale) do not fit one foreground command (serialized sum > 600 s) — measured at run level with the same mechanism (bootstrap -> Web4MDA lock -> tool-tmp wipe). If full scale is required, it needs a window without the 600 s limit (SM).

## b2 — FALSE-GREEN EDGE (cause + fix owner)
**Cause:** `Scratch.at(testUrl)` derives the component AND the owner folder from whatever URL the caller passes — it trusts the argument. A test in component A that passes a URL naming a real test of component B writes into B's gen under a legitimate owner; no layout check (GarbageSweep, inventory) can tell the writer apart. Measured: 84 `Scratch().at(` calls in the repo, 82 pass `import.meta.url`; the only 2 others are in `BootstrapScratch.test.ts` (:163 a cross-component probe, :173 a refusal check) — Scratch's own tests.
**Fix (owner: oopExpert):** make it unrepresentable — a static gate "every `Scratch().at(` argument is exactly `import.meta.url`", with a POSITIONAL exception for `BootstrapScratch.test.ts` (or `at()` derives the caller itself). Cost ~0: the product already complies.

## CONFOUNDED (not defects)
BootstrapScratch.test.ts :53 and :65 — `existsSync(<repo>/.tmp)` must be false (H5x "no repo-root alias") — RED in run 1 AND run 2 because Tron's still-running pre-H5x `npm start` (pid 1868291, TMPDIR=repo/.tmp) keeps `.tmp`. The gate is RIGHT (it catches the forbidden alias); clears when his process is restarted. Never touched.

## Reported, not fixed (H5n residue for oopExpert)
3 dead `mkdtempSync` imports, 0 calls each (1 mention = the import): `latest/test/Pipeline.test.ts:4`, `ScratchExclusion.test.ts:2`, `SrcTypecheck.test.ts:3`.

## Observations
- `latest/test/gen/h5m3/` (classify.py, asserts.py, table.md) was CREATED 21:09–21:11 INSIDE my gate window by another agent (H5m-2 classification shape) — not the suite. GarbageSweep's gen pattern FINDS it (baseline RED found=1). Not mine, not deleted.
- My own residue disclosed + removed: `latest/test/gen/w4/` (my W4 M2OoshGate backup, left by me at W4), removed before run 1.
- S3 pre-amended BEFORE results: Web4MDA gen also holds runner-owned fixed folders `npm/` (`.npmrc` cache + `_logs`) and `logs/`.
- Disclosed: the recorder run was moved to the background by the harness (not by me) and killed; 0 of my shells remain (the 3 live bootstrap processes are Tron's pid 1868291's children). All my seeds were physical, each removed and `Scratch.ts` restored == HEAD after every seed; porcelain = only `?? .tmp/` at the end.
