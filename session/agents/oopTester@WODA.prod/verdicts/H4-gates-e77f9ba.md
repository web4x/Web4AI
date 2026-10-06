# H4 verdict — oopTester, 2026-10-06 (plan spec/plans/2026-10-06-cleanup-outside-repo.md @ 1d5d396, row H4)

Gates: branch `oopTester-H4-gates` = **e77f9ba** (on e2318e9, on main 1d5d396), pushed to origin. `main` untouched, shared tree porcelain 0.
Product measured: main **1d5d396** (the sha oopPO verified). Instrument code: e77f9ba.

| arm | verdict on the product | failability (seed RED -> GREEN) | numbers |
|---|---|---|---|
| (a) no-escape, full `npm test` | **RED** | PROVEN: `--seed` (clone) — the fenced write through the OS temp dir is caught (`seed-caught=true`) | 497 node processes recorded, 32,179 writes inside, **74 distinct escapes, all /root/.npm, 0 in /tmp** (2 runs, same 74) |
| (b) no temp-dir call outside Scratch.ts | **RED** (1 hit) | PROVEN in-suite: 5 seeded forms found, exempt path exempt, prose not matched | 644 files scanned (638 main + 6 H4), exempt hit seen |
| (c) planted test + Definition under test/gen | **GREEN** | PROVEN in-suite: listed with no exclusion; found when planted in a walked folder | 3/3 (vitest list real/no-exclusion, fresh load() over a scratch copy) |
| (d) AC19c porcelain WHOLE around `npm test` | **GREEN** | PROVEN: `--seed` (clone) — bootstrap writes a stray file -> run exits 0 (in-run TrackedTree blind to that stage) yet outer gate RED (`?? h4d-stray.txt`) | before 0 / after 0 identical; suite 689 = 687 / 0 / 2 |

CHECKED / SKIPPED / TOTAL — (a) 74 escapes CHECKED, 0 SKIPPED by rule (allow-list only /dev/null,/dev/stdout,/dev/stderr,/dev/tty), blind spots below = unmeasured, not counted; (b) 644 / 0 / 644 files; (c) 4 / 0 / 4 checks (2 gate + 2 failability); (d) 1 run / 0 / 1 + 1 seeded run.

## (a) the escapes (product defect, owner = oopExpert per plan)
- `/root/.npm/_logs`: 72 (1 mkdir + 71 debug logs) — npm's debug log, written by EVERY npm/npx call (the outer `npm test`, bootstrap's `npx tsx`, the suite's own npm/npx children).
- `/root/.npm`: 1 mkdir; `/root/.npm/_cacache/tmp`: 1 mkdir — npm's package cache (the cold-install test's `npm install`).
- **74 is a LOWER BOUND**: the recorder REFUSES (H0), so a refused parent mkdir pre-empts every later write in it. Measured in the unrecorded (d) run: **+281 entries written into /root/.npm/_cacache** at 13:10.
- Fix candidate (oopExpert's call): npm's `logs-dir` AND `cache` inside the repo (e.g. under latest/test/gen, gitignored) + `update-notifier=false` — a project `.npmrc` for the OUTER `npm test`, AND the env (npm_config_cache / npm_config_logs_dir) set by bootstrap for every child, since scratch copies do not carry `.npmrc`. **Never `logs-max=0`: measured, it makes npm DELETE the existing logs.**
- Suite numbers under the recorder are perturbed (Node22.test RED "expected 9 to be 0" = npm warnings about its refused log writes; attributed by a 2nd method: Node22.test alone with recorder RED, without recorder + in-repo logs-dir 7/7 GREEN). The (a) verdict is the escape list, not the suite counts.
- Blind spots (disclosed, unmeasured): writes by non-node binaries (git, sh, esbuild); node children whose env drops NODE_OPTIONS; tsx's disk cache (Child sets TSX_DISABLE_CACHE=1).

## (b) the hit (needs oopPO's ruling — not self-exempted)
`EAMD.ucp/Components/com/ceruleanCircle/Web4MDA/latest/test/BootstrapScratch.test.ts:2` — `import { tmpdir as osTemp } from 'node:os'`, called at :52 :56 :57 to ASSERT where the OS temp dir points (the H2 construction proof + the 108-byte sun_path check). The plan's literal patterns miss it (aliased); the named-import form catches it. Options: a structural positional exemption ruled by oopPO, or route the call through a Scratch method. Pattern note: a first scan matched prose at vitest.config.ts:32 ("OS tmpdir (npm…"); the matcher now requires the zero-argument call `name()` — fixed before any verdict.

## Findings outside H4 (observations for oopPO)
1. **A full suite cannot run in a clone under latest/test/gen post-H2**: tsx's IPC socket `<clone>/.tmp/tsx-0/<pid>.pipe` exceeds the 108-byte sun_path; the truncated path collides -> EADDRINUSE flood (measured e2318e9 in a clone: 24 failed / 27 skipped, none H4). This makes `gates/SuiteTreeTouchProbe.ts` (AC2b) and any full-run-in-ScratchClone gate a confounded instrument. Hence (a)/(d) full runs use `--here`. Also: `npm test` breaks wherever the repo root path is long enough for that socket path to collide.
2. Garbage of mine inside the repo scratch (gitignored, kept per H0, for H5): latest/test/gen/{h4d-diag (corrected 2026-10-06: was mis-recorded as h4-diag, a path that never existed), h4-branch}, latest/test/gen/tmp/web4mda-h4-branch-suite-e2318e9 (+ .tmp/h4-*). And the pre-H2 recursive copy `latest/test/gen/web4mda-i3-rv9xaD` (10:53, self-nested > 100 levels).

## H0 self-disclosure (writes OUTSIDE the repo caused by my runs)
- npm debug logs in /root/.npm/_logs by my npm/npx calls before I redirected them (11 measured at 12:37–12:40); then my `npm_config_logs_max=0` setting made npm DELETE those 11 logs (12:41:37). Switched to an in-repo logs-dir; verified 0 new /root/.npm entries after.
- `/root/.npm/_update-notifier-last-checked` touched once (12:35).
- 281 entries written into /root/.npm/_cacache by the product suite during my (d) `--here` run (13:10) — the same writes every `npm test` makes (oopPO's verification runs too).
- My first two single-file vitest runs ran without TMPDIR set in my shell (possible early writes to the OS temp dir before vitest.config set TMPDIR; not measured).
- Denied, never executed: a mount-namespace capture; a smoke test aiming a write at /tmp.

> H5 (2026-10-06): copied here from Web4MDA `.tmp/` before the in-repo scratch was deleted. The `.tmp/h4*` log paths named above NO LONGER EXIST (deleted at H5); every number quoted here was read from them before deletion.
