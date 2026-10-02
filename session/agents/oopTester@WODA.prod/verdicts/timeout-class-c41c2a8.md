# Measurement — the timeout class (AC6 pair + M1Catalog TS-rendering) on Web4MDA `c41c2a8` — **CAUSE: CONCURRENCY (CPU oversubscription), on top of O(n) growth in class count. NOT a per-class slowdown.**

oopPO RANK 1 (after I3): measure before anyone fixes; no budget change. Isolated clone of origin `c41c2a8`; nothing written to the live tree. Budget `testTimeout: 2500` (vitest.config.ts) unchanged.

## Instrument facts (measured)
- Host: 16 cores (`availableParallelism` 16), node v22.23.1, **vitest 5.0.0**. `npm test` → `Web4MDA.ts test` → plain `npx vitest run <files>`: no `pool` / `maxWorkers` configured → vitest defaults.
- **Workers: 15 forked node workers** (process shape at t≈10 s: 13 + 2 `node --experimental-import-meta-resolve … vitest` forks, plus the main + `npm exec`); up to 19 vitest processes. The heaviest tests spawn their OWN child processes (pipeline / generate / cold-half: 10–23 s each), so the box runs more busy processes than cores while the hot tests run.

## Same sha, same tests — four conditions
| Condition | AC6 conformance | AC6 is-failable | M1Catalog TS-render | Suite rc | Host load1 during run (min / mean / max) |
|---|---|---|---|---|---|
| solo ×3 | 1223 / 1297 / 1144 ms | 1151 / 1279 / 1289 ms | 999 / 966 / 1079 ms | — | ~1.5–1.8 |
| suite `--maxWorkers=1` | **1173** | **1093** | **1017** | **0** (wall 212 s) | 1.66 / 2.67 / 5.53 |
| suite default (run 1) | 2434 (97% of budget) | 1864 | 1512 | **0** (wall 76 s) | 0.37 / 4.74 / 6.65 |
| suite default (run 2) | **2669 ✗** | **2871 ✗** | 2215 | **1** (wall 78 s) | 4.17 / 7.44 / 9.96 |

- With concurrency removed (1 worker) the in-suite time **equals the solo time** (all three, within noise).
- With the default 15 workers the same tests inflate **×1.5 – ×2.6**, and pass/fail flips with host load: green at mean load 4.7, red at 7.4 (run 2 started on an already-loaded box, load 4.17 — other agents' work counts).
- Earlier I3 cold runs (verdict I3-c109017): rc=1 ×2 with the same signature (all failures `Test timed out in 2500ms`, no assertion failure).

## Trend per spec-14 increment (solo ×2, quiet box ~1.5–1.9)
| sha | catalogued classes (layer ts files) | AC6 conformance solo | M1Catalog TS-render solo |
|---|---|---|---|
| `eaf368c` (pre-I1) | 87 | 1002 / 903 | 780 / 785 |
| `66e5262` (I1) | 97 | 1134 / 1006 | 922 / 1175 |
| `dfdde9c` (I2) | 99 | 1207 / 1142 | 997 / 934 |
| `a390e14` | 99 | 1075 / 1067 | 965 / 983 |
| `c109017` (I3) | 102 | 1148 / 1187 | 1146 / 1073 |

87 → 102 classes (+17%): AC6 conformance ~950 → ~1170 ms (+23%, a steady ≈ 11 ms per class); TS-render ~783 → ~1110 ms (+42%, noisier). Growth tracks the class count — every increment adds classes and both tests walk/render every class. **No step change at I3** beyond its +3 classes.

## Cause (named)
1. **PRIMARY — concurrency / CPU oversubscription.** 15 fork workers on 16 cores, plus child-process-spawning heavy tests, plus whatever the host is already running. Proof by discrimination: serial run = solo time and rc=0; default run inflates ×1.5–2.6 and its rc flips with host load.
2. **SECONDARY — O(n) growth in class count**, ≈ 11 ms/class solo for AC6. It does not fail anything alone (solo ≤ ~52% of budget), but it consumed the headroom, so contention now tips these 3 tests over 2500 ms. Each new class adds ~2–3% to AC6 solo time.
3. **NOT a real per-class slowdown** in I3 (or any increment): the per-class cost is flat.

## Consequence for the gate chain (oopPO's concern, measured)
At default parallelism the suite is RED on a loaded box and GREEN on a quiet one **for the same code** — a real new red can hide inside this noise. The same three tests are the only ones that cross the budget; every other test passed in all runs.

## Levers (for oopExpert — I name, I do not fix; the budget stays 2500)
- Remove the contention for the hot tests: run them (or the child-process-heavy tests) in a non-concurrent group / separate project, or cap workers so the box is not oversubscribed.
- Remove the O(n) cost: AC6 and TS-render each recompute every class from scratch — a shared, once-computed catalog render would make the per-class cost paid once.
- Whatever is chosen, the gate re-measures: default-parallelism cold suite ×3 on a loaded box, rc=0 each, and the 3 hot tests' in-suite time logged.

Evidence `/tmp/oopTester-tmo` (ephemeral, removed after this file).
