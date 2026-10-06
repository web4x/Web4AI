# H5n gate — PREP (NOT RUN) — Web4MDA main b76ad5d4 — oopTester@WODA.prod, 2026-10-06

Order (oopPO): prep arms a–d from plan row H5n (spec/plans/2026-10-06-cleanup-outside-repo.md:43 @ b76ad5d4) + the `Scratch` header; RUN NOTHING until oopPO's GO — Tron's `npm start` pid 1868291 (17:22, pre-H5x bootstrap, TMPDIR=repo/.tmp) re-ran a generation chain and rewrote tracked files = any run now is CONFOUNDED. His process and `.tmp/` are never touched.

## Measured read-only at prep
- main b76ad5d4 = origin; porcelain = only `?? .tmp/` (Tron's live process; H5x removed the alias + its ignore line). Tron's Web4MDA.ts reformat no longer dirty.
- `Scratch` (165-line rewrite): `at(import.meta.url)` -> `<C>/latest/<scratchFolder>/` from the test's own path (outside `latest/test/` REFUSED); `fixture(name)` -> `<gen>/<TestFile>/<name>`, plain name only, WIPED + recreated each use; lock `<gen>/lock` owned by the RUN (`WEB4MDA_RUN` or pid), re-entrant, waits on a live owner, takes over a dead one; no mkdtemp import left.
- Coverage already present: `.gitignore:10 **/latest/test/gen/` (check-ignore true in M1Layout, NpmPackage, DefaultFolder); vitest's ONE exclusion `**/latest/${scratchFolder}/**` from `M1Catalog.scratchFolder`.

## PRE-RUN CONDITIONS (checked at GO, before any run)
1. pid 1868291 gone (`ps -p`). 2. porcelain recorded (incl. whether `.tmp/` still exists — if a NEW process recreates repo `.tmp` after Tron's restart, that is a finding: something still routes TMPDIR there). 3. main = origin. 4. Inventory of every `<C>/latest/test/gen/` (names, file count, KB) BEFORE run 1.

## SCOPE RULES — written BEFORE any result (scoping, not rationalising)
- S1 "random name" = a dir/file name matching `run-\d+`, `tmp\.[A-Za-z0-9]{6,}`, a mkdtemp suffix `-[A-Za-z0-9]{6}$`, `web4mda-*`, or containing a pid/epoch number (`\d{5,}`).
- S2 the tool tmp `Web4MDA/latest/test/gen/tmp/` (Ruling A: fixed, owned by the run, wiped at run start): names the TOOLS create INSIDE it (Vite SSR, tsx, node compile cache) — **NEEDS oopPO RULING (Q1)**. My proposal: exempt from arm (a) INSIDE gen/tmp only, held by arm (d) instead (wiped each run => bounded); zero random names everywhere else.
- S3 a fixture folder `<C>/latest/test/gen/<X>/` is legal iff X is `tmp` (Web4MDA only), `lock`, or the basename of a test file that exists in `<C>/latest/test/` (or a helper there).

## ARMS (each: unseeded measured + a PHYSICAL seed -> RED, seed removed after)
- **(a) no random-named scratch anywhere.** Measure: after run 1, every name under every `<C>/latest/test/gen/` + the repo root + `/tmp` + `/root` (delta vs pre-run inventory) against S1/S2 -> 0. Static: no `mkdtemp`/`mkdtempSync`/`mktemp`/pid-in-path in repo `.ts` outside a named exception. Seed: a planted test calling `mkdtempSync(<own gen>/x-)` -> RED; a planted `run-<pid>` folder -> RED.
- **(b) every scratch path under the WRITING test's own component.** Measure: every `<C>/latest/test/gen/<X>` obeys S3; H4 WriteRecorder over the full run: 0 writes outside a component gen (+ declared tool tmp). Seed: a test in component A calling `new Scratch().at(<file URL of component B test path>).fixture('f')` -> lands in B's gen under an owner that is not a B test -> RED; a test outside `latest/test/` -> `at()` refuses (assert the refusal names the path).
- **(c) different components do not collide, same component serializes — at FIXTURE level (Ruling A).** Two STANDALONE tsx processes (not vitest: every vitest run is a Web4MDA run and serializes on the tool tmp — **confirm = Q2**), each `fixture()` + hold ~2 s: different components -> overlapping holds (no wait); same component -> the second WAITS (start2 >= end1), and no fixture of one is wiped by the other. Seed: lock made a no-op (physical copy, restored) -> same-component overlap -> RED. Plus Ruling A at run level: two concurrent full runs serialize on the WEB4MDA lock (measure start/end).
- **(d) green twice, scratch bounded.** Two full `npm test` in a row (foreground, in the shared checkout, in the SM/oopPO window): both rc 0 (or identical known RED, attributed); per-component gen inventory after run 1 == after run 2 (names equal, file count/KB within the run's own wipe); porcelain WHOLE before == after each run. Seed: a fixture that appends instead of wipe -> growth between runs -> RED.
- **extra — exclusion + GarbageSweep.** A planted `*.test.ts` + `*Definition.ts` in a NON-Web4MDA component's gen is neither collected by `vitest list` nor catalogued (my H4 (c), carried to every component); GarbageSweep (57 lines changed) re-run read-only: the new layout reports 0, and a planted `run-<pid>` leftover is FOUND.

## QUESTIONS for oopPO (before GO)
- **Q1** (S2): are tool-created names inside `Web4MDA/latest/test/gen/tmp` exempt from arm (a) (bounded by arm d), or must they be fixed too?
- **Q2** (arm c): "fixture level" = standalone processes calling `Scratch.fixture` on two components, since any two vitest runs serialize on the tool tmp — confirm.
