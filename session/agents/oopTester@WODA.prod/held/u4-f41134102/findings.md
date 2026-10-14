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

### (iii) Seeds — DONE in seed clone c2 (head f41134102, tree c37bfd9e5, npm ci rc0 38 pkgs), SM window 10-14
Instrument: `u4.sh FILE c2 <label> …/latest/test/TestPlacement.test.ts` (TestPlacement alone; TestFolder pin gate deliberately NOT run, so a seed's RED comes from TestPlacement by name). Clean baseline C6-base: 1 file, 12/12, rc0. Verdicts recorded to out/C6-seeds.json + out/C6-seeds-r2.json (no console reliance). c2 reset to porcelain 0 after; 0 node vitest.
- **S-a, plan as written (helper that RE-EXPORTS a src class, added to TOOLS):** in-process verdict `test-support` (control via direct src import = `FOREIGN MOF/M1/M1Catalog`). On disk (r3: SeedViaLeak.test.ts + TOOLS += 'SeedLeak'): rc1, 1 failed | 15 passed, the H5m-3 test "…the derived test-support set EQUALS the header list" RED, diff names **SeedViaLeak**. → RED by test name ✓. BUT caught by the header-list ratchet only; the subject analysis itself loses the M1Catalog subject.
- **S-a1, nearest dangerous member WITHOUT TOOLS (beyond the plan's literal seed) — FINDING: re-export laundering, independent of TOOLS.** Same 3 M1Catalog asserts via `import { M1Catalog } from './SeedLeak.js'`: verdict **`A`**. On disk (r2: SeedViaLeak.test.ts in the root test folder, confirmed inside the H5m-3 scan): rc0, **16/16 passed — gate GREEN while a root test asserts a FOREIGN component 3×.** Cause: `AssertionSubject` credits the IMPORT OWNER (`test-support:<Helper>` for anything under /latest/test/) and never opens the helper, so a re-export launders the domain subject. Control: non-tool helper LayoutSetup also gives `A`. Compensating control (outside this gate): TestFolder pins every helper by SHA-256, so adding/changing a helper is a reviewable re-pin diff — not a RED once re-pinned. Owner: TestPlacement H5m-3 gate author; oopPO rules scope.
- **S-b, load-bearing:** in-process, removing TrackedTree changes exactly 1 of 37 root-test verdicts: `Spec: test-support -> A` (TrackedTree is imported by 7 root tests). On disk (C6-Sb: TOOLS without TrackedTree): rc1, 1 failed | 11 passed, header-equality RED, diff names exactly **Spec**. → member is load-bearing (for Spec only), not dead ✓.
- **S-c, name test is a SUBSTRING:** tool-only asserts → `test-support` whatever the name (SourceMap, ChildProcess, MyScratchpad, and control Unrelated all `test-support`) — the substring has no effect there. **S-c2 shield:** 3 M1Catalog + 4 Source asserts: named `SourceMap` → `test-support`; same text named `Unrelated` → `FOREIGN MOF/M1/M1Catalog`. The substring shields foreign assertions in the subject analysis. On disk (r3 SourceMap.test.ts): header-equality RED, diff names **SourceMap** → RED by name, so NOT a finding under the plan's rule. WEAK: the only catch is the header ratchet; adding the name to the header in the same diff passes a test asserting a foreign component. Recommendation: `this.name === helper` (equality) instead of `includes`.

### C.6 summary
FINDINGS: (iv) doc omits TrackedTree; (i) TOOLS not derivable by structure (counterexample Source vs TestFolder); (iii) S-a1 re-export laundering (gate GREEN on disk). PASS: S-a (as specified) RED by name; S-b load-bearing (Spec); S-c2 RED by name. Recommendation: substring → equality.
