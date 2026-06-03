# robbin-expert Context — Save Point 2026-06-03 (SM 622k)

**Role**: Web4RawBin Implementation Authority
**Status**: T172 shipped. T167+T170+T171 shipped. Standing by.
**Machine**: Mac Studio · **Pane**: robbinTeam:0.2
**Repo**: /Users/Shared/Workspaces/2cuGitHub/Web4RawBin · **Live**: https://home.donges.it:4444
**Current version**: v0.5.67 (T167). 834/834 tests pass.

## Latest commits this session
- 3fefc68 T172: 5-step forward-ref population + strict audit — 238/238 chain reachability
- afe969e T170: CI gates (trace:audit:strict + rule-pair:strict + ci:gates)
- 3336f38 v0.5.67 T167: /trace mobile-first layout + 480px width-cap
- 7c84fe0 T171: strip 109 empty requirements[] + 50 TraceLink orphans-by-design
- 7ddf64f v0.5.66 T169 KEYSTONE: audit PASSED (0 orphans, 0 back-refs)
- 2a61aa2 v0.5.65 T166: /api/trace Class+Method from scenario index
- 85cf8e1 (amended) T167 STATIC_SHELL trace-page hash update

## Scenario data
297 units: 56 Reqs, 100 Tasks, 30 UCs, 50 TraceLinks, 12 Classes, 40 Methods, 9 Sprints.
Chain-node reachability: 238/238 (100%) from Requirement roots.
Sprints (9) + TraceLinks (50) = orphan-by-design.

## Key architecture
- 5-level deep index: scenario/index/<c1>/<c2>/<c3>/<c4>/<c5>/<uuid>.scenario.json
- LOCKED 7-step chain (T168): Requirement → Task → UseCase(s) → Class → Method → Implementation → Test(s)
- Forward-only (T159): no back-refs; T172 stripped 109 empty requirements[]
- Audit: scripts/trace-audit.ts (3 passes: reachability, back-refs, cardinality)
- CI gates: npm run ci:gates = trace:audit:strict && rule-pair:strict
- Mobile layout: .trace-page flex desktop ≥1025px split; ≤480px single-column overlay

## Key rules
- Forward-only chain (T159) — no back-refs
- cleanModelName() strips ##, **, ---, date suffixes, bold
- /api/trace overlays scenario index (T163 titles, T166 Class+Method)
- Version bump #66; STATIC_SHELL #67 on bundle hash change
- Planner T-numbers first; implementing [x] before commit
- Standing rule #18: planner stands up T-numbers; do NOT use PO harness numbers

## Deploy ritual
Stop server (otmux send iphone:0.1 C-c — often needs TWICE),
then: `otmux send iphone:0.1 "cd <repo> && git pull && npm run build && npm run dev" Enter`,
wait ~14s, verify /api/health version.

## Build/test commands
npm run build · npm run dev · npm test · npm run test:e2e
npm run trace:check · npm run trace:audit · npm run ci:gates
npx tsx scripts/migrate-to-scenario.ts --sprint <slug> --apply
npx tsx scripts/trace-remigrate.ts --apply
