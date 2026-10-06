# F2 re-gate — Scratch.at() as a MECHANISM — VERDICT on Web4MDA f75ab3e0

oopTester@WODA.prod (914c8cad), 2026-10-06. Order: oopPO GO on f75ab3e0 (oopExpert; Scratch.ts, BootstrapScratch.test.ts, TestFolder.ts). Claim: `Scratch.at()` resolves its CALLER from the stack (first frame outside Scratch.ts) and throws unless the URL is the caller's own module — through ANY receiver; one exception = Scratch's own test BY FULL PATH. Follows verdict f3643a55 (F2 false-green of the static scan).

**CHECKED 5 / SKIPPED 0 / TOTAL 5 — every seed RED, restored GREEN; the 2 remaining reds proven Tron-confounded by CAUSE.**

Conditions: HEAD = origin/main = f75ab3e0; porcelain `?? .tmp/` only before/after every run and seed; `.tmp` mtime 19:39:33 unchanged. Runs via `node scripts/bootstrap.mjs test …`, FOREGROUND, TMPDIR unset. Log h5m3/f2-full-f75ab3e0.log (on disk, *.log gitignored).

| # | check | result |
|---|---|---|
| 1 | full suite once — the runtime check breaks no legitimate caller | 724 = 720 passed / 2 failed / 2 skipped (was 719/2/2 on 6552c6a0; +1 = the new test). Only reds: BootstrapScratch.test.ts:53:87 and :65:49 |
| 2 | stored receiver `const s = new Scratch(); s.at(<M1Layout NamespacePlacement URL>)` executed inside NpmPackage.test.ts | **RED** — throws `Scratch.at: <…/NpmPackage/latest/test/NpmPackage.test.ts> passed …` (the f3643a55 false-green is closed) |
| 3 | exception impostor: a file named BootstrapScratch.test.ts at NpmPackage/latest/test/ doing the same | **RED** — throws with caller = the impostor's path; the exception is by FULL path, not basename |
| 4 | check disabled (`if (caller !== path && caller !== this.ownTest)` → `if (false)`) | clean 3/3 → **RED** "failable: a FOREIGN URL is RED through EVERY receiver shape…" → restored 3/3. Weakest literal: 1 of the 3 b2 tests bites |
| 5 | the 2 remaining reds = Tron's `.tmp`, proven by CAUSE | see below — **CONFOUNDED, same :53/:65** |

## Cause of :53 / :65 (measured, not inferred)
- Both assertions: "Tron: NO repo-root alias / symlink: expected true to be false" (:53:87) and its sibling (:65:49) — they fail because `<repo>/.tmp` EXISTS.
- `.tmp` (node-compile-cache + tsx-0, mtime 19:39:33) is held open right now by **pid 2249715** (`tsx`, unix sockets inside .tmp, started 19:39:32, TMPDIR=<repo>/.tmp).
- Its parent chain: 2249340 `npm exec tsx …/M2OoshClass/…` (19:39:25) ← 2249017 `node22.mjs npx tsx …` (19:39:16) ← 1870083 / 1869542 / 1869021 `npm exec tsx …/Web4MDA.ts` (17:23, the running app) ← 1868596 `node scripts/bootstrap.mjs` ← 1868422 ← **1868291 `npm start` (Tron, 17:22:42)** ← 1812415 Tron's VS Code shell. Every process below bootstrap carries TMPDIR=<repo>/.tmp; the top three do not, because the pre-H5x bootstrap SETS TMPDIR for its children (so "pid 1868291 has no TMPDIR" does not clear it — the chain does convict it).
- Remedy is Tron's (restart / stop his `npm start`); never touched by me.
