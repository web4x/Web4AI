# robbin-expert Context — Save Point 2026-06-08 (session 3)

**Role**: Web4RawBin Implementation Authority
**Status**: R18.29-31 shipped (unitLinks[] lifecycle + 267-unit backfill). v0.5.106 deployed. Standing by.
**Machine**: Mac Studio · **Pane**: robbinTeam:0.2
**Repo**: /Users/Shared/Workspaces/2cuGitHub/Web4RawBin · **Live**: https://home.donges.it:4444
**Current version**: v0.5.106. 879/879 tests pass.

## Latest commits this session
- 2435d64e R18.29-31: unitLinks[] lifecycle + 267-unit backfill — atomic symlinks
- 08ae00f8 v0.5.106: source link .scenario.json filter + Sprint detail fallback
- 45a733d2 T176: ES module exec proof — self-signed SSL works with ignoreHTTPSErrors
- e83c8c05 v0.5.76 T177: IOR resolver normalization — bare UUID + ior:instance: + .scenario.json

## What shipped this session
- **v0.5.106**: (1) Source links filter .scenario.json — only real .ts/.puml generate Browse/Monaco. (2) Sprint detail fallback — rb-detail-view fetches children via API when graph.get() returns null (Sprint not in TraceModel). Sprint 18 shows 11 task children.
- **T176**: ES module exec proof — confirmed ignoreHTTPSErrors:true handles type=module over self-signed HTTPS. R-O closed as not-a-bug.
- **T177 v0.5.76**: IOR resolver normalization at ALL entry points — bare UUID, ior:instance:UUID, UUID.scenario.json all resolve. Client + server + rb-trace-tree renderSeed all strip prefixes.
- **R18.29-31**: model.unitLinks[] lifecycle on ScenarioIndex — addLink/removeLink/syncLinks + put() auto-syncs on every write. 267 units backfilled from 282 existing symlinks. Symlink gap structurally impossible.

## Key architecture
- LOCKED 7-step chain: Req → Task → UC → Class → Method → Impl → Test
- Two tree modes: ?mode=trace (narrowed) vs ?mode=scenario (fan-out)
- chainMethod hint: server returns UC.method alongside Class child in trace mode
- Sprint→Task nav roots via /api/trace/sprints
- Cycle guard: per-branch ancestors Set; one-layer lazy-load
- Forward-only at server (/api/trace) + client (forwardOnly())
- STATIC_SHELL auto-injected by build.mjs
- unitLinks[] on scenario units — put() auto-syncs symlinks atomically (R18.29-31)
- IOR normalization: bare UUID / ior:instance: / .scenario.json all resolve (T177)
- Source link filter: .scenario.json sourceFiles suppressed — only real .ts/.puml shown
- Sprint detail fallback: rb-detail-view fetches from API when not in TraceModel graph

## Standing rules
- Version bump #66; STATIC_SHELL #67 (auto); implementing [x]; report to 0.0
- No clients.claim in SW; parser: one + line = one method
- No silent idle — report completion + flag blocks immediately
- impl:uuid markers: NEVER bare * outside JSDoc (esbuild crash) — use // for scripts

## Scripts
- scripts/fill-source-locations.ts — fills sourceFile+sourceLine on ALL gap types
- scripts/generate-sprint-md.ts — generates planning.md + task .md from scenario units
- scripts/populate-forward-refs.ts — fills forward arrays (Task→UC, Method→Impl, Impl→Test)
- scripts/regenerate-views.ts — generates scenario/sprints.md/ views
- scripts/backfill-unit-links.ts — one-shot: populates unitLinks[] from existing symlinks

## Pending / blocked
- T178 Task→UC fill: 8/191 tasks have useCases (S16 only). Blocked on architect mapping.
- T183 7-hop gate: depends on T178 fill.
- UC source: 79/85 — skill-expert owns remaining 6 UC→.puml fill.
- 21 unreachable tests — architect cataloguing gap for strict-champagne fix.
- Tester verifying R18.29-31 symlink consistency.

## Deploy ritual
Stop (C-c twice), then: git pull && npm run build && npm run dev on iphone:0.1

## Build/test
npm run build · npm test · npm run ci:gates · npm run trace:audit
