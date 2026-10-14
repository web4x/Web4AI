# U4 END audit — Web4MDA main f41134102 — findings (working file, feeds verdicts/END-AUDIT-U4-f41134102.md)

All measured on cold GitHub clone c1 (head f41134102, tree c37bfd9e5). Read-only parts need no run.

## A. Whole suite, cold — DONE (out/A1-c1.summary)
- c1: npm ci rc0 (38 pkgs) · Test Files 117/117 · Tests 945 passed | 2 skipped (947) · 0 FAIL lines · 0 timeouts · porcelain 0 · 2nd generate (npm start) rc0 porcelain 0.
- Skips (SM/oopPO ruled 10-14: fine, not a finding): (a) the plan's ONE named skip = in-test count M1ComponentView `CHECKED 55 / SKIPPED 1 (Web4MDA: HTTP 414 server URL limit) / TOTAL 56` — present; (b) vitest's 2 = the only 2 static `.skip` sites, TreeFileUnitInc1.test.ts L159 `T5.2-T5.5 … HELD` and L185 `T8 … NOT BUILT`, both predating the plan, visibly tagged.

## C.6 `AssertionSubject.TOOLS` allow-list (TestPlacement.test.ts)
Re-read at END: TOOLS L297 = `['Scratch', 'Child', 'Generated', 'Source', 'TrackedTree']` (hand-written); `isTool` L332-335 = `TOOLS.includes(helper) && !this.name.includes(helper)`; JSDoc L290-295.

### (iv) Gate its own documentation — FINDING (still open at END)
JSDoc L293 names 4 tools: "Scratch (fixture paths), Child (process runner), Generated and Source (file readers)". TOOLS L297 holds 5. `TrackedTree` is missing from the doc. The doc and the code it documents disagree = a false claim in an artifact. Owner: TestPlacement gate author.

### (i) DERIVABLE? — FINDING: not derivable by any measured structural criterion
Derived population = every non-test `.ts` under `/latest/test/` (excl. test/gen) = 21 helpers (all in the root component): CatalogOracle, Child, GateMetrics, Generated, LayoutSetup, Loaded, PureLayout, Scratch, SlowReport, Source, StoreOutputRoots, TestFolder, TrackedTree, fixtures/budget/{Slow.fixture, vitest.budget.config}, gates/{GarbageSweep, GenAtomicityProbe, NoEscapeProbe, NpmTestPorcelainProbe, ScratchClone, SuiteTreeTouchProbe}.
- Criterion A "imports reach no component src/" (transitive) → {Child, GateMetrics, SlowReport, TrackedTree}. ≠ TOOLS: MISSING Scratch, Source, Generated (all import src: M1Catalog; Generated also ClassModel, M1Layout); EXTRA GateMetrics, SlowReport.
- Criterion B "no domain type in the public API" (regex proxy over signatures; domain types used only privately) → 18 of 21 (exposing: CatalogOracle→M1Catalog, Loaded→ClassModel+UcpComponent, StoreOutputRoots→M1Catalog). TOOLS ⊂ B, but B ADDS LayoutSetup, PureLayout, TestFolder, GateMetrics, SlowReport, gates/*, fixtures.
- TOOLS sits strictly between A and B. Counterexample pair, verified by hand: **Source** (TOOL) and **TestFolder** (not a tool) have the same profile: both import M1Catalog, use it only privately for `isScratch` (Source also `isGenerated`), and answer only paths/strings. Same structure, opposite membership. → membership is a judgement encoded in a hand list (semantic "plumbing vs gate" distinction, written nowhere). Per plan (i): FINDING "not derivable", counterexample named.

### (ii) Each member justified structurally
- Child: imports only node:child_process / node:stream (types). No domain class can flow through. ✓
- TrackedTree: imports only ./Child.js + node:fs. No src import → cannot return a domain object. Its L297 comment ("the reads it took over were Child's, a tool") is consistent. ✓
- Scratch: imports M1Catalog; used for `scratchFolder` / scratch dirs, private. Public API: paths. Domain consulted, not exposed.
- Source: imports M1Catalog; private `generator` (isGenerated) + `isScratch` in walks. Public API: file lists. Domain consulted, not exposed.
- Generated: imports ClassModel, M1Catalog, M1Layout; private `home: M1Layout`, private `tree` getter, `homeLayout(home)`. Public API: paths/text. Domain consulted, not exposed.
- HAZARD to measure in (iii): for the 3 domain-consulting tools, domain behaviour (M1Catalog.isGenerated / homeLayout / scratchFolder) SHAPES their answers, yet a test asserting only through them credits no domain subject.

### (iii) Seeds — PENDING (seed clone c2, SM window granted 10-14)
