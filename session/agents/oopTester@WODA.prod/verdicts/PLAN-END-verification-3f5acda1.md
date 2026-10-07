# Cleanup plan — PLAN-END VERIFICATION on Web4MDA 3f5acda1

oopTester@WODA.prod (914c8cad), 2026-10-07. Order: oopPO GO — run the plan-mode file's Verification section (/root/.claude/plans/toasty-knitting-token.md, "Verification (plan end)"), gated against its LITERAL text.

**CHECKED 8 / SKIPPED 1 / TOTAL 9 — 6 GREEN, 2 RED (one defect: 8 orphaned scratch dirs left by the H5m-3 moves in Web4MDA/latest/test/gen).**

Pre-conditions measured (oopPO's word verified): HEAD = origin/main = 3f5acda1; porcelain 0; repo-root `.tmp` ABSENT; 0 Web4MDA processes. Runs via `npm test` (= product entry), FOREGROUND, TMPDIR unset. Evidence (on disk; *.log gitignored): h5m3/planend-run1-3f5acda1.log, planend-run2-3f5acda1.log, planend-sweep.log, planend-gen-before/after.txt, h5m2-titles-before/after.txt.

| # | plan item (literal) | result |
|---|---|---|
| V1a | `npm test` twice green | **GREEN** — run 1: 96/96 files, 726 = 724 passed / 0 failed / 2 skipped, 214 s, exit 0; run 2: identical, 216 s, exit 0. The 2 BootstrapScratch reds (:53/:65) are GONE with the confound removed |
| V1b | porcelain identical | **GREEN** — 0 before, 0 after each run; no `.tmp` created |
| V1c | GarbageSweep 0 on every pattern (incl. `tmp.*`), /tmp/claude-0 SKIPPED-with-reason | **RED** — `GarbageSweep: RED \| patterns=12 found=8`. 11 patterns FOUND 0 (/tmp web4mda-*, w4mda-*, oe-*, oosh-g1-*, oosh-regen-*, oosh-truth-*, oopTester-*, */ssr-with-repo-ref, **tmp.\* = CHECKED 2433 SKIPPED 1 TOTAL 2434 FOUND 0**; /root oopExpert-*, oopTester-* 0); /tmp/claude-0 SKIPPED with reason in every /tmp pattern ✓. Pattern 12 "every <Component>/latest/test/gen beyond its live entries (14 gens)": CHECKED 59 / FOUND 8 — see Defect |
| V2a | no `run-<pid>` or random-named scratch anywhere | **GREEN** — whole scratch tree (121 dirs) + /tmp: 0 `run-<pid>`, 0 `tmp.*`; 7 heuristic hits read = fixed descriptive names (M2ThinglishClass.test, web4mda-no-escape-log, w4mda-tsc-mirror + its path). **NAMED SKIP (oopPO Q1 ruling, H5n prep)**: Vite SSR cache `Web4MDA/latest/test/gen/tmp/<21-char id>/ssr` — tool-internal, inside the ONE fixed tool tmp, wiped per run (measured: jm61vkeQ… replaced by NClwSxgtt… between runs, count 121 = 121) |
| V2b | every component's scratch under its OWN latest/test/gen with fixed names | **RED** — same 8 orphans (fixed names, wrong home) |
| V3a | Web4MDA/latest/test holds only group A + B | **GREEN** — TestPlacement's H5m-3 arm ("a test stays in Web4MDA/latest/test ONLY as A or derived test-support") green in both runs |
| V3b | TestPlacement gate GREEN | **GREEN** — both runs |
| V3c | 0 tests lost across H5m-2 | **GREEN** — H5m-2 = W5b series 4914e292..9d66f354 (MofLayout, ComponentModelInc3, BootstrapSeed); global test-title set 4914e292^ = 837, 9d66f354 = 837, lost 0; instrument bite: one title dropped → lost 1 |
| V4 | spec plan file updated with every amendment; Tron rules DONE | **SKIPPED** — not in the GO; plan completeness is oopPO's, DONE is Tron's |

## Defect (V1c + V2b, one cause)
`Web4MDA/latest/test/gen/` holds scratch dirs of the 8 tests H5m-3 MOVED OUT of central: Boilerplate.test, ComponentModelInc1.test, Folder.test, MofLayoutAC5.test (1 file), MofPlainNode.test, TreeFileUnitRulings.test, UcpComponent.test, UcpComponentMove.test (7 empty). Newest mtimes 2026-10-06 21:14–22:01 = before my runs (2026-10-07 ~14:00) → NOT created by this verification (instrument ruled out); orphans of the moves (each moved test now writes under its new component's gen). Remedy = delete the 8 dirs (oopExpert/oopPO's call; I did not touch them), then re-sweep.
