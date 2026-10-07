# Cleanup plan — FINAL PLAN-END VERIFICATION on Web4MDA 14804fd8

oopTester@WODA.prod (914c8cad), 2026-10-07. Order: oopPO FINAL GO — re-run ALL plan-end items on 14804fd8 (code changed since 3f5acda1: Scratch.ts orphans/prune, BootstrapScratch.test.ts, TestFolder.ts pin, GarbageSweep.ts duplicate rule deleted) + prove the new `Scratch.lock()` prune FAILABLE. Gated against the plan file's literal Verification text. Previous verdict: PLAN-END-verification-3f5acda1.md @ f7f41149 (RED: 8 H5m-3 orphans).

**CHECKED 9 / SKIPPED 1 / TOTAL 9+1 — every checked item GREEN; the prune proven failable (RED when disabled).**

Pre-conditions measured: HEAD = origin/main = 14804fd8; porcelain 0; repo-root `.tmp` ABSENT; 0 of the 8 orphans present. `npm test` = product entry, FOREGROUND, TMPDIR unset. Evidence on disk (h5m3/, *.log gitignored): final-run1/run2-14804fd8.log, final-sweep.log, final-gen-before/after.txt.

| # | item | result |
|---|---|---|
| V1a | `npm test` twice green | **GREEN** — both runs 96/96 files, 728 = 726 passed / 0 failed / 2 skipped, exit 0 |
| V1b | porcelain identical | **GREEN** — 0 before, 0 after each run; no `.tmp` |
| V1c | GarbageSweep 0 on every pattern (incl. `tmp.*`), /tmp/claude-0 SKIPPED-with-reason | **GREEN** — `GarbageSweep: GREEN \| patterns=12 found=0`; tmp.* CHECKED 2433 SKIPPED 1 TOTAL 2434 FOUND 0; component-gen orphans (now `Scratch.orphans`) CHECKED 51 FOUND 0; /tmp/claude-0 SKIPPED with reason on all 9 /tmp patterns |
| V2a | no `run-<pid>` / random-named scratch | **GREEN** — 0 run-<pid>, 0 tmp.* (tree + /tmp). Long names outside the tool tmp: 11 = the 7 fixed names of 3f5acda1 + `BootstrapScratch.test/orphan-prune-off/…` (the new prune test's own FIXED fixture). **NAMED SKIP (Q1 ruling)**: Vite SSR `<id>/ssr` inside the one fixed `Web4MDA/latest/test/gen/tmp`, replaced per run (measured MwCNg… → oreUPz…) |
| V2b | every component's scratch under its OWN gen, fixed names | **GREEN** — the 8 orphans gone; the orphan rule finds 0 |
| V3a | Web4MDA/latest/test only group A + B | **GREEN** — TestPlacement H5m-3 arm green, both runs |
| V3b | TestPlacement GREEN | **GREEN** — both runs |
| V3c | 0 tests lost (across H5m-2; and since 3f5acda1) | **GREEN** — H5m-2 range 837 = 837 (f7f41149, history unchanged); 3f5acda1 849 → 14804fd8 852 titles, 0 lost |
| P | `Scratch.lock()` prune FAILABLE (oopPO add) | **GREEN + RED-proven** — physical seed test `PruneSeed.test.ts` via the product entry: P1 orphan planted BEFORE the run → gone after the first lock; P3a live fixture `TrackedTree.test` kept, inode+mtime identical; P3b dir planted MID-RUN + 2 re-entrant holds (`fixture`, `lock`) → kept. P2 prune DISABLED (`this.prune(home)` → no-op) → **RED** "P1 orphan gone: expected true to be false", orphan survives, and GarbageSweep sees it: **RED found=1** (`…/gen/PlantedOrphan.test`). Restored: Scratch.ts == HEAD, seed file + 3 planted dirs removed, porcelain 0, GarbageSweep GREEN 0 |
| V4 | plan file updated with every amendment; Tron rules DONE | **SKIPPED** — not in the GO; oopPO's / Tron's |
