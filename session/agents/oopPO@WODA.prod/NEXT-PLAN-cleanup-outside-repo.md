# Plan — all product work inside Web4MDA; test scratch only under `Web4MDA/latest/test/gen`

## Context
Tron, 2026-10-05: *"why are you all spamming my root folder … touching files OUTSIDE of the Web4MDA repository … NEVER work outside of the MDA folder … if you test generate create a test folder under Web4MDA/latest/test/gen"*.

Measured (read-only, oopPO):
- **7 agent dirs in `/root`** (~367 MB): `oopExpert-iso` 130M, `-iso3` 136M, `-scratch` 31M, `-s2` 21M (full clones), `-wt` 14M (a git WORKTREE of Web4MDA), `-patches` 35M (hundreds of run logs + Python **edit scripts** that changed code from outside the repo), `oopTester-handoff` 16K.
- **Unique work at risk:** exactly ONE commit not on GitHub — `12a1580` (I4b F2, under gate) in `/root/oopExpert-wt`. `oopExpert-scratch`'s 2 extra commits (`B`, `fix under test`) are gate seeds; `s2`'s only dirty entry is `node_modules`. Everything else is on GitHub.
- **Systemic cause in the product itself:** **37 test files** call `tmpdir()` (`mkdtempSync(\`${tmpdir()}/web4mda-…\`)`), so EVERY `npm test` writes to `/tmp`. Two helpers already exist: `latest/test/Scratch.ts` (copies `EAMD.ucp/Components` + `scripts` into a tmp dir) and `latest/test/gates/ScratchClone.ts`.
- **Me too — measured, not a footnote:** `/tmp/claude-0/-var-dev-Workspaces-AI-Claude/1bae1524…/scratchpad` holds ~40 entries of MINE: Python **edit scripts that changed specs** (`fix_gen.py`, `fix_paths.py`, `stale_paths.py`, `eamd6.py`, `i1m.py`, `th7.py`, `v4.py`, `v5.py`, `pkg.py`, `ins.py`), `spec*.log` run logs, `commitmsg*.txt`, 6 clone dirs (`specs`, `m1`, `orig`, `sweep2`, `v7a`, `ac`).
- **Product code parked in the agent workspace:** `AI/Claude/session/tasks/` holds **13 oopPO spec patches** (`oopPO-*.patch`, up to 182 KB) and **18 oopTester gate patches** (`oopTester-*.patch`) — ~950 KB of spec + test code applied by hand instead of committed in the repo. The briefs/ranking `.md` there are agent memory and stay.

Tron's decisions (this session): **`test/gen` is git-ignored** (scratch; keeps AC19c "testing never mutates the committed tree"); **agent memory stays** in `AI/Claude/session` (boot/context/learnings/verdicts), **all product work moves into Web4MDA**.

- **The test TOOLING writes outside too (found by Tron, 2026-10-05):** `/tmp/Z9wTG6nDtoNf0az5vOrFX/ssr/` = **vitest/Vite's SSR transform cache** — 303 files, each a compiled Web4MDA module (e.g. `0ab25b43…` = `M2AbstractRelationship.ts`, `__vite_ssr_exportName__…`), placed under `os.tmpdir()` in a random dir by every vitest run. **Fix by construction, not per call site:** the ONE `npm test` verb (bootstrap) AND `vitest.config.ts` (for direct runs) set `TMPDIR` to `…/Web4MDA/latest/test/gen/tmp` BEFORE anything starts, so Vite's cache AND all 37 `tmpdir()` calls resolve inside the repo — the system `/tmp` becomes unreachable for test runs. H4's no-escape gate watches `/tmp` for ANY new entry during a full run (tooling included); H5 deletes every random `/tmp/*/ssr` dir whose files reference `/EAMD.ucp/Components/…`. **MEASURED SCALE (Tron: "its hundrets of these paths"): 3,481 `/tmp/*/ssr` cache dirs, 10 GB; 3,286 reference Web4MDA (current EAMD layout or the older `src/MOF/` layout) → deleted; 0 reference RawBin; the remaining 195 reference neither → LISTED for Tron, never deleted blind.** Their parent random dirs (`/tmp/<random>/`) go with them when they hold nothing else.

## Hazards the fix must not create (measured)
1. **Self-copy recursion:** `Scratch` copies ALL of `EAMD.ucp/Components`; a scratch root at `…/Web4MDA/latest/test/gen/` is INSIDE that tree → the copy must skip `test/gen`.
2. **Walkers would find the copies:** `M1Catalog.load` walks folders for Definitions, vitest discovers `*.test.ts`, the doc/tree gates derive from disk. Copies under `test/gen` would be catalogued twice and tests would run recursively. → ONE named exclusion, honoured by every walker.

## Increments (each: build → failable gate → oopPO verifies inside the repo → push → Tron DONE)

| # | What | Owner |
|---|---|---|
| **H0 — HALT (immediately on approval)** | Tron's order to all 4 agents: no new file/clone/worktree/patch/script/log outside Web4MDA; **nothing deleted yet**. oopExpert pauses F2. | oopPO |
| **H1 — preserve** | Push `12a1580` (F2, WIP) to GitHub as branch `oopExpert-I4b-F2-wip` (never main) so the only unique work is durable before any cleanup. Verify by `git ls-remote origin` (never via a clone of the local path). | oopExpert |
| **H2 — ONE scratch root in the product** | A catalogued test-support class (extend the existing `latest/test/Scratch.ts`; `ScratchClone.ts` delegates) owns the scratch root = `EAMD.ucp/Components/com/ceruleanCircle/Web4MDA/latest/test/gen/` (repo-relative, created on demand). All **37** `tmpdir()` call sites route through it; `tmpdir` disappears from the repo. The copy skips `test/gen` (hazard 1). | oopExpert |
| **H3 — ONE exclusion, everywhere** | `.gitignore` gains `**/latest/test/gen/`; the SAME path is excluded by every walker (vitest `include`/`exclude`, `M1Catalog.load`'s Definition walk, layout/tree/doc gates) through one named constant owned by the scratch class — never re-typed. | oopExpert |
| **H4 — gate it (failable)** | (a) **No-escape gate:** run the whole suite with a probe that records every path written (the existing `gates/SuiteTreeTouchProbe.ts` pattern) → every write is under the repo, none in `/tmp` or `/root`; seed a `tmpdir()` write → RED. (b) **Source gate:** no `tmpdir(`/`os.tmpdir` in any repo `.ts` outside the scratch class; seed one → RED. (c) **Walker gate:** a planted `*.test.ts` + `*Definition.ts` under `test/gen` is NOT run and NOT catalogued; remove the exclusion → RED. (d) **AC19c:** `git status --porcelain` WHOLE identical before/after `npm test`. | oopTester |
| **H5 — CLEAN UP ALL THE DATA GARBAGE (Tron, 2026-10-05: *"in the next plan you need to clean up all that data garbage"*)** | Scope = EVERY location in the inventory above, no exceptions except the ONE preserved unique work (H1). After H1 verified on GitHub and H4 green: delete the 7 `/root/oopExpert-*`/`oopTester-handoff` dirs (worktree via `git worktree remove`, then `git worktree prune`), all `/tmp/web4mda-*` dirs, my whole `/tmp/claude-0/…/scratchpad` (scripts, logs, clones), and the 31 `oopPO-*.patch`/`oopTester-*.patch` files in `AI/Claude/session/tasks/` — each patch first CHECKED as already applied on the branch/main (`git apply --check -R` on the branch tip) so no unapplied product change is lost; an unapplied one is listed for Tron, never silently dropped. List CHECKED/DELETED/TOTAL; nothing of Tron's in `/root` is touched (only the 7 named dirs). **H5b — prove it is clean (failable, rerunnable):** a sweep of `/root`, `/tmp`, `/var/tmp` and `AI/Claude/session/tasks` for every agent-garbage pattern (`oopExpert-*`, `oopTester-*`, `oopPO-*.patch`, `web4mda-*`, the scratchpad) reports **0 found**, printing CHECKED/FOUND/TOTAL; seed one dummy `web4mda-x` dir → it reports 1 → remove → 0. Re-run after the resumed move plan finishes: still 0. | oopExpert (its dirs), oopTester (its), oopPO (mine + the H5b sweep) |
| **H6 — working rule, durable** | New team rule in every oop agent's anchor + spec: product work happens only inside the repo; isolation = a worktree or clone **under `latest/test/gen/`** (git-ignored, excluded); edit scripts/logs/patches live there too; spec changes go on the branch directly, not as patches in AI/Claude. Spec: `spec/bootstrap.md` gains the rule (with Tron's verbatim) + the H4 gates as ACs; `spec/eamd-ucp.md` layout names `latest/test/gen/`. | oopPO (spec + anchors), agent-trainer (weave into SKILLs) |

**Resume after H6:** the move/IOR plan (`d729ecd`) continues where it stopped — F2 from the preserved branch, re-gated inside the repo.

## Critical files
- `EAMD.ucp/Components/com/ceruleanCircle/Web4MDA/latest/test/Scratch.ts`, `…/latest/test/gates/ScratchClone.ts`, `…/latest/test/gates/SuiteTreeTouchProbe.ts` (reuse)
- the 37 `tmpdir()` call sites (representative: `latest/test/M2OoshGate.test.ts` ×6, `latest/test/BootstrapSeed.test.ts` ×3, `MOF/M1/M1Catalog/latest/test/M1Catalog.test.ts` ×2)
- `.gitignore`, `vitest.config.ts`, `M1Catalog.load` (walker), `spec/bootstrap.md`, `spec/eamd-ucp.md`

## Verification
- `git ls-remote origin` shows `oopExpert-I4b-F2-wip` = `12a1580` before any delete.
- Whole suite green **inside the repo**; the no-escape probe reports 0 writes outside the repo; each H4 seed RED → revert GREEN.
- `ls /root` shows none of the 7 dirs; `/tmp` has no `web4mda-*`; Tron's own `/root` entries unchanged.
- `npm test` twice: porcelain identical; `test/gen` absent from `git status`.
- Tron rules DONE.
