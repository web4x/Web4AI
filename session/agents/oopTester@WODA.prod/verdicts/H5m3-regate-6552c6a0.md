# H5m-3 + b2 re-gate — VERDICT on Web4MDA 6552c6a0

oopTester@WODA.prod (914c8cad), 2026-10-06. Order: oopPO STEP 1 GO on 6552c6a0 (arms A-F of PREP 3355f6bb + 3 new claims + ARM6 bite seed). STEP 0 (Spec only on 4b031ea1 + oopPO's specs) = GREEN 23/23, ARM6 0 live / 95 marked / 95 — log h5m3/step0-spec-4b031ea1.log.

**CHECKED 9 / SKIPPED 0 / TOTAL 9 — every seed RED except one false-green edge (F2, latent, R1).**

## Run conditions (measured)
- HEAD = origin/main = 6552c6a0; porcelain before/after every run and seed = `?? .tmp/` only (Tron's); `.tmp` mtime 2026-10-06 19:39:33 unchanged throughout = Tron's process did not act during my window. 5501c997 and 59310a28 are ancestors of the gated sha.
- Every run through the product entry `node scripts/bootstrap.mjs test [files] [-t x]`, FOREGROUND, TMPDIR unset. Seeds physical in the shared tree, each restored (`git restore` / rm of my own file) and porcelain re-checked.

## Baseline — full suite once on 6552c6a0 (h5m3/step1-full-6552c6a0.log)
723 tests = 719 passed / 2 failed / 2 skipped; 96 files = 95 / 1 failed; 213 s; exit 1. Both reds = BootstrapScratch "scratch root is DERIVED…" and "TMPDIR BY CONSTRUCTION…" = the known Tron `.tmp` confound (pid 1868291) → **CONFOUNDED, not defects.**

## Arms (clean → seeded → restored)
| # | claim | seed | result |
|---|---|---|---|
| F1 | b2: every `Scratch.at` passes import.meta.url | NpmPackage.test.ts + `new Scratch().at(<M1Layout NamespacePlacement URL>)` | 2/2 → **RED** (repo scan) → 2/2 |
| F2 | same claim, nearest dangerous member | `const s = new Scratch(); s.at(<foreign URL>)` | **stays GREEN 2/2 = FALSE-GREEN edge.** The scan regex matches only `new X().at(`. LATENT: 0 live `scratch.at(` calls today, but 3 stored Scratch instances exist (UcpComponentMove:71, MirrorDisk:94, Scratch.ts:136). R1 — flag, never weaken; fix is oopExpert's (scan any `.at(` on a Scratch binding, or make at() derive its caller = unrepresentable) |
| A1 | placement gate (a) | MofLayoutAC5.test.ts copied back to central latest/test | 8/8 → **RED** gate (a) → 8/8 |
| A2 | declared subject imported AND used (`uses()` tokenizing, new claim) | ComponentModelInc1: the ONE code use `new DefaultFile()` → `new Ctor()`; name left only in regex literal, string array, comment, import | **RED** gate (a) → 8/8. Claim holds. (First A2 attempt quoted the name INSIDE existing strings, which broke them and created bare code tokens = legitimate GREEN; my instrument error, discarded.) |
| E1 | MofLayoutAC5 changed oracle (5501c997, new claim) | gen-root strip disabled (`startsWith(genRoot)` → `false`) = old oracle at the new location | 12/12 → **RED** G2a (relocation invariance) → 12/12. WEAKEST LITERAL: only 1 of 12 tests bites |
| D | GenClaims path-keyed allowance | ComponentModelInc2 key → its pre-move path | 5/5 → **RED** "found set EQUALS the exact allowance" → 5/5 |
| ARM6 | Spec ARM6 bites on a live path | spec/eamd-ucp.md + one unmarked top-level `test/…` sentence | **RED**: CHECKED 1 live / SKIPPED 95 marked / TOTAL 96 → 23/23 |
| R | realise honours declared subject (59310a28, new claim) | M1Catalog.ts: `owned(declared !== '' ? declared : base…)` → `owned(base…)` | 15/15 → **RED** UcpComponentMove (expected 7 to be 9) → 15/15. WEAKEST LITERAL: 1 of the 2 covering tests bites; NamespacePlacement stays green with the fix reverted |
| B | no test lost by name (13 moves) | my comparison, base d0e837d4^ vs HEAD | 13 files, 129 titles before = 129 after, **0 lost**; instrument bite: one title dropped → lost=1 |
| C | nothing weakened | `expect(` delta per move | 12 of 13 moves 0/0; 22b544cc 1/1 = GenClaims path key (arm D); the only oracle change = MofLayoutAC5 via non-expect code (arm E) |

## Observations (not defects)
- A real-tree seed also turns TestPlacement's own in-process "gate (a) is failable" test RED (it shares the real tree as its baseline).
- Instrument errors of mine, caught before reporting: STEP 0 log folder missing (test never ran), B "before=0" lookup, A2 quote-breaking, R unbalanced paren. None entered a verdict.
