# robbin-expert Context — Save Point 2026-05-31

**Role**: Web4RawBin Implementation Authority
**Status**: S17 migration active; S16 shipped; T118-T131 delivered. Standing by.
**Machine**: Mac Studio · **Pane**: robbinTeam:0.2
**Repo**: /Users/Shared/Workspaces/2cuGitHub/Web4RawBin · **Live**: https://home.donges.it:4444
**Current version**: v0.5.30 (deployed). Build 72.6kb. 818/818 tests pass.

## Team (robbinTeam)
0.0 robbin-po · 0.1 robbin-architect · 0.2 ME · 0.3 robbin-tester · 1.0 planner · 1.1 req

## What shipped this session

### S16 Traceability UX (T110-T117, all Done)
- T110: rb-detail-drawer (Google-Maps bottom drawer) — 51812eb
- T111: 3 specialized DetailViews (task/req/usecase) — 51812eb
- T112: tree-item name+desc two-line layout — 13c9dc1
- T113: Lucide SVG type icons (vendored ISC) — 5b9b86c
- T114: OS drag verified + custom drag image — 6ede466
- T115: icon collapse/expand + children expander — c9f4a48
- T116+T117: trace-cli Pass 4+5 (PUML UC + impl markers) — 61d0253

### Hotfixes & infrastructure
- v0.5.23: version bump for S16 PWA delivery — a1b58ee
- v0.5.24: trace-page in sw.js STATIC_SHELL — bdb74ec
- v0.5.25 T120+T122: dark drawer bg + viewport-fixed — 50d20be
- v0.5.26: sticky pageNav — 2a28dd3
- v0.5.27 T130: fix flat nested lists in /md/ preview — 8539d57
- v0.5.28 T127: cross-nav /md/↔/trace + IOR resolver — b30b3de
- v0.5.29 T128.1: all subtasks indented + symlink visibility — 60d6e36
- v0.5.30 T39: file-browser symlink support (FileApi + rb-file-tree) — aad0816

### T118 E2E cleanup (B2)
- cleanupTestUsers helper + 8-spec afterAll — 317f41a
- Backfill purge: 115 test users removed, 7 preserved — applied live

### T119 test traceability
- Pass 6 [test:uuid:] parser — ac4a6d2
- All 42 test files (28 vitest + 14 E2E) have markers — a242530

### T121 UUID remediation
- 22 task UUIDs regenerated to valid v4 — 9eb9d6a
- 5 invented req:uuids + 3 S13 req:uuids fixed — 2496aeb

### S17 Scenario Units (T125-T128)
- T125: scenario module (types + 7 classes + index-store + templates) — 9b79be3
- T125.3 re-do: 5-level deep index — 0fc5b90
- T126: ViewGenerator + all 7 templates + regenerate script — 5a7e162
- T127: IOR resolver + /api/ior endpoint + cross-nav — b30b3de
- T128.1: Sprint 1 exemplar (full content fidelity, speaking names, nested subtasks, dup fix) — d5b4770, 17dcd01, 60d6e36, d5b4770
- T128.3: Sprint 17 migrated — e8de4c6

## Current data state
- Graph: 217+ objects (tasks + requirements + UCs + impls + tests)
- Scenario index: Sprint 1 (12 units) + Sprint 17 (11 units) migrated
- 5-level deep: scenario/index/<c1>/<c2>/<c3>/<c4>/<c5>/<uuid>.scenario.json
- data/users: 148 dirs (115 test users purged, 7 preserved real owners)

## Standing rules
- Every new task stood up by PLANNER first with official T-number — do NOT use PO harness numbers
- Version bump per #66 (package.json + sw.js CACHE_NAME) on every surface change
- STATIC_SHELL per #67 — update trace-page hash when bundle changes; no new route = exempt
- implementing [x] checkbox in task file before committing
- Report each commit to robbinTeam:0.0

## Deploy ritual
Stop server (otmux send iphone:0.1 C-c — often needs TWICE),
then: `otmux send iphone:0.1 "cd <repo> && git pull && npm run build && npm run dev" Enter`,
wait ~14s, verify /api/health version.

## Build/test commands
npm run build · npm run dev (tsx watch) · npm test (vitest) · npm run test:e2e (playwright)
npm run trace:check · npm run trace:fix · npx tsx scripts/migrate-to-scenario.ts --sprint <slug> --apply

## Key file locations
- scenario module: src/ts/scenario/ (types, classes, index-store, templates, generator, ior-resolver)
- trace client: src/public/ts/trace/ (rb-detail-drawer, rb-task-detail, rb-requirement-detail, rb-usecase-detail, icons, rb-object-item, rb-trace-tree)
- server: src/ts/server/server.ts, TraceConsistency.ts, FileApi.ts, trace-cli.ts
- migration: scripts/migrate-to-scenario.ts, scripts/test-data-purge.ts, scripts/regenerate-views.ts
- scenario data: scenario/index/ (5-level), scenario/sprints.json/ (symlinks), scenario/sprints.md/ (generated views)
