# robbin-expert Context — Save Point 2026-06-03 (SM save #2)

**Role**: Web4RawBin Implementation Authority
**Status**: T175 shipped (v0.5.75). T174 closed. Standing by.
**Machine**: Mac Studio · **Pane**: robbinTeam:0.2
**Repo**: /Users/Shared/Workspaces/2cuGitHub/Web4RawBin · **Live**: https://home.donges.it:4444
**Current version**: v0.5.75. 834/834 tests pass.

## Latest commits this session
- 5d42f1a8 v0.5.75 T175: Tree nav on TraceObject + R-N1 ellipsis + R-N2 localStorage
- 9ae98740 v0.5.74 T174: auto-open timing fix + collapsed-start children
- 6ee2278f v0.5.73 T174: drawer-nav scrollIntoView + full /trace interactions
- d0796bf4 v0.5.72 T174 fix: single-IOR seed + Task children + scanRepo fallback
- 2eb4dab1 v0.5.71 T174: drawer UX + /scenario route (R-M1..R-M4)
- b550c28c v0.5.70 T173: /md/ .scenario.json redirect → /scenario?ior=
- d7de86b8 v0.5.69 T173: strip query string from filepath
- c97571d v0.5.68 T173: .scenario.json click → /scenario?ior= + lazy-load
- 3336f38 v0.5.67 T167: /trace mobile-first layout + 480px width-cap
- afe969e T170: CI gates (trace:audit:strict + rule-pair:strict)
- 7c84fe0 T171: strip 109 empty requirements[] + TraceLinks orphan-by-design
- 7ddf64f v0.5.66 T169 KEYSTONE: audit PASSED
- 3fefc68 T172: 5-step forward-ref + 238/238 chain reachability
- 2a61aa2 v0.5.65 T166: /api/trace Class+Method from scenario index

## Key architecture
- LOCKED 7-step chain: Requirement → Task → UseCase(s) → Class → Method → Implementation → Test(s)
- Forward-only (T159): no back-refs
- Tree navigation: TraceObject.parent/children/hasChildren/isRoot/isLeaf (T175)
- /scenario?ior=<uuid>: single-instance focused tree via data-seed-ior + renderSeed()
- /trace: full requirement-rooted tree via setGraph()
- /api/trace/children/<uuid>: one-hop forward children + scanRepo fallback when scenario arrays empty
- /api/trace/roots: Requirement roots for lazy tree
- Scenario index: 5-level deep, 297 units, 238/238 chain reachability from Req roots
- CI gates: npm run ci:gates = trace:audit:strict && rule-pair:strict
- STATIC_SHELL: /trace + trace-page-SLWNKYD6 + /scenario + scenario-view-QZVMT6EE

## Standing rules
- Forward-only chain (T159)
- Version bump #66; STATIC_SHELL #67 on bundle hash change
- Planner T-numbers first (rule #18)
- implementing [x] before commit
- In-flight findings → task file (not just context.md) during saves (SM directive)
- Report each commit to robbinTeam:0.0

## Deploy ritual
Stop (C-c twice), then: git pull && npm run build && npm run dev on iphone:0.1

## Build/test
npm run build · npm test · npm run ci:gates · npm run trace:audit
