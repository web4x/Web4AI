# H5m — can V8 coverage prove a declared test subject EXECUTED? (measure, build nothing)

*oopExpert, 2026-10-06, Web4MDA `d9a2ca2c`, for oopPO's build-or-close ruling. Nothing committed to Web4MDA; all seeds physical in `MOF/M1/M1Layout/latest/test/`, removed after; tree porcelain 0; scratch flat (19 MB).*

## Answer
**Yes, it discriminates — but only with two conditions the naive form lacks.** The decisive metric: *subject functions that ran MORE often than in an empty-test run* ("beyond ambient"), measured with **one test file per vitest process**.

| test | subject | fns beyond ambient |
|---|---|---|
| SEED title-only (+ type import) | M1Layout | **0** |
| SEED readFileSync as text | M1Layout | **0** |
| SEED value import, never run | M1Layout | **0** |
| MirrorDisk | M1Catalog | 23 |
| OneStore | M1Catalog | 20 |
| M1GraphNoSourceRead (child scripts) | M1Graph | 18 |
| FolderNamespace | M1Layout | 34 |
| NamespacePlacement | M1Layout | 69 |
| OwnedModelPlacement | M1Layout | 28 |
| M2OoshGate | M2OoshClass | 19 |
| ThinglishTarget | M2ThingClass | 30 |
| M2OoshSha1 | NameUuid | 3 |

Threshold `> 0`: all 3 false-greens RED, all 9 real declarations GREEN — **with no text scanning at all** (titles, type imports, path strings and value-import-unused are all the same case: nothing extra executed).

## The two traps the naive form falls into (measured)
1. **Fork workers never flush `NODE_V8_COVERAGE`** — they are killed, not exited. Only the vitest main process (and child scripts) wrote coverage; the main process loads `vitest.config.ts` → `M1Catalog` → `M1Layout`, so a naive check showed config-time FALSE POSITIVES and missed real in-worker use (M2OoshGate/M2OoshSha1 read `loaded=0`). Fix: a 6-line setup file calling `v8.takeCoverage()` in `afterAll` (no dependency), and ignore the process that loads `vitest/dist/cli`.
2. **Ambient execution**: even an EMPTY test file runs 32 `M1Layout` and 14 `M1Catalog` functions in its worker (the config closure is evaluated there). Presence/"any method ran" therefore passed all three seeds. Only *counts beyond the empty-test baseline* separate them.
   And **one worker runs several test files**, so per-process coverage cannot be attributed to a file in a shared run — the combined 12-file run credited every seed with the real tests' execution. Per-file processes (or a before/after `takeCoverage` count diff inside the worker — NOT measured) are required.

## Cost (measured)
| what | number |
|---|---|
| per-file overhead of coverage (single file, plain vs cov) | +1.3 … +3.8 s (~+35 %) |
| gate as measured: 9 declared files + 1 ambient, each its own vitest process | Σ vitest Duration ≈ 69 s + 3.5 s ≈ **73 s** extra |
| coverage data | 1.8–15 MB per file (144 MB for all probes); scratch only, deleted after |
| analysis (parse + ambient diff) | < 1 s |
| code to build | setup file ~6 lines + merged config ~5 + runner/analyzer ~80 + gate test; one modelled-free mechanism (node:v8, no new dependency) |

## Does it run under `npm test`?
**Not measured end to end.** As measured it is a SEPARATE pass (a gate test that spawns one vitest per declared file — nested vitest, ~73 s, so a `vitest-solo` file and a TestBudget concern). Folding it into the normal suite needs the setup file in the repo config (env-guarded, inert without `NODE_V8_COVERAGE`) AND per-file attribution inside shared workers via a before/after `takeCoverage` diff — plausible, unmeasured.

## Residuals (either way)
- "Executed beyond ambient" proves the subject's code ran during the test — not that the test is ABOUT it: a test driving M1Catalog that internally runs M1Layout would also qualify for M1Layout.
- Scales with the number of DECLARED tests (9 today), not the suite.

## Options for the ruling
- **(B) BUILD** the per-file coverage gate (~73 s, solo) — kills the whole text-scan loophole class for declared subjects.
- **(C) CLOSE with residual**: keep the d9a2ca2c text check (3 loopholes closed, the readFileSync-as-text one open) + record this measurement as the known residual and the build path.
- **(B') BUILD lighter**: in-worker `takeCoverage` diff inside the normal suite — cheaper at runtime but unmeasured; would need its own measure first.
