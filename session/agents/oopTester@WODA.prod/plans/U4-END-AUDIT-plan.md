# U4 — END audit plan (oopTester, drafted 2026-10-14, 0 runs) — NOT YET GO

**Source:** Web4MDA `spec/plans/2026-10-13-ucpcomponent-puml.md`, U4 row, read at origin/main `b65b75769`. **GO:** oopPO, after oopExpert's `classes()` margin fix lands. **Subject:** the END sha = origin/main at GO (verified on origin, never a local ref), NOT `b65b75769`.

## 0. Preconditions (before any arm)
- END sha fetched + verified on origin; `classes()` fix present in it (named commit).
- ONE real cold clone at END: fresh `git clone` (no node_modules symlink), `npm ci`, customer default PATH = `/opt/node22/bin` first, `env -u CLAUDECODE -u TMPDIR` — name the env in the verdict.
- Fixed scratch under `…/latest/test/gen/oopTester-u4/` (SCRATCH-LOCATION LAW, no mktemp). Seeds only in scratch clones, never the live tree.
- Runs on the box are SM-held: ask the SM for the run window; quiet-wait (load) before every timed arm; record loadavg with every timing.

## A. Whole suite, cold
- CHECKED / SKIPPED / TOTAL (counts, never "passed"); exit code recorded separately (a global setup/teardown verdict never reaches the counts).
- **Exactly ONE named skip** = the Web4MDA package diagram SVG (HTTP 414, U3 ruling d). A second skip / second 414 → RED by name. 0 skips → CONFOUND (server down?) → probe server, report.
- `git status --porcelain` = 0 after the suite; a 2nd `npm run generate` = 0 diff.

## B. Every gate of U1 / U1-S3 / U2 / U3 — each seeded RED by its NAMED guard, then GREEN
- **U1:** rendered sources byte-identical in ALL languages; dropped dependency → its import disappears → RED by class; one-sided edge → bijection RED; no authored `imports:` in Definitions **nor** placed by `M1Catalog` (scan over BOTH sources, derived — confirm the scan list is not hand-written).
- **U1-S3:** 0 dangling IORs incl. owner IOR arrays (derived scan of the store); store type count 6 with the removed type NAMED; each rewritten import-unit test cites the ruling and keeps its intent.
- **U2:** 3 headers in order on every class + interface box; every member in exactly its section; seed getter-in-Methods → RED by member name; interface box carries attributes.
- **U3:** one `.component.puml` per `isComponent` (derived, never a hand list); ABOVE / LEFT / RIGHT / BELOW each vs an INDEPENDENT oracle (not the producer's lift); seed grandchild in BELOW → RED; seed plain class on a side → RED by name.

## C. Named checks + watch items
1. **Memo staleness (`Defaults.displayNameOf`, S1):** seed = change a model's displayName after a first read → next read must reflect it, else RED by class name. Also probe the memo KEY (identity vs value): two models with the same key, and a re-created catalog — no cross-talk.
2. **AC6 budget (`M1Layout` 'AC6 is failable', 10 s):** time it alone ×3 and under the full suite ×3 at END vs base `b65b75769`; report the WEAKEST number + loadavg. Judge, never raise the budget. Slow only under load, fast alone = contention → report as CONFOUND, not a defect.
3. **Test-subject-by-filename:** audit the test-placement gate's subject inference (U3a `ComponentFolder.test` was pulled to root). Seeds: file named for class A testing class B; a name matching no class; a name matching two components. Any seed placed wrong without RED = FINDING.
4. **SuiteTreeTouchProbe (my gate, no arm ever):** one seeded arm per RED channel, each in a scratch clone: (i) a test that rewrites a tracked file CONTENT-IDENTICALLY → `touched` RED while `git status` stays clean (proves why inode+mtime); (ii) a failing test → `failed` RED; (iii) a globalSetup throw → `exit` RED with counts green. Plus its maxBuffer change (74f904e27: "carries the identical one-option change", no test): a tracked list > 1 MiB → the probe still reads it.
5. **maxBuffer (74f904e27):** (i) its IorAcceptance + Pipeline changes are self-declared "NOT yet run" → prove in the cold suite (A). (ii) DERIVED scan: every child-process call in src + test whose output scales with the whole tree carries a ceiling-free buffer — the commit's caller list is hand-made; a missed caller = FINDING. (iii) **Inconsistency to rule:** GenClaims stays at 64 MiB "untouched", while the same commit says "64 MiB would only move it" — not RED today (headroom), flagged for oopPO.

## D. Flag (not a gate)
- origin/main `b65b75769` subject begins **"WIP U3b H3"** — a WIP-labelled commit on main is a claim to check: is U3b complete at END? Report; oopPO rules.

## Output
`verdicts/END-AUDIT-U4-<END sha>.md`: CHECKED / SKIPPED / TOTAL per block, every seed RED-by-name or FINDING, each check at its weakest literal; commit + push; sha to oopPO; idle.
