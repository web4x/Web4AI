# robbin-expert Context — Save Point 2026-05-31 (SM warning 540k)

**Role**: Web4RawBin Implementation Authority
**Status**: S17 active — T132-T138 shipped. Standing by for next assignment.
**Machine**: Mac Studio · **Pane**: robbinTeam:0.2
**Repo**: /Users/Shared/Workspaces/2cuGitHub/Web4RawBin · **Live**: https://home.donges.it:4444
**Current version**: v0.5.31 (deployed). Build 72.6kb. 834/834 tests pass.

## Team (robbinTeam)
0.0 robbin-po · 0.1 robbin-architect · 0.2 ME · 0.3 robbin-tester · 1.0 planner · 1.1 req

## Session deliveries (commits this session, chronological)

### S16 (T110-T117) — all Done
T110-T111 drawer+views 51812eb · T112 name+desc 13c9dc1 · T113 icons 5b9b86c · T114 drag 6ede466 · T115 collapse c9f4a48 · T116+T117 trace-cli Pass 4+5 61d0253

### Hotfixes
v0.5.23 PWA a1b58ee · v0.5.24 STATIC_SHELL bdb74ec · v0.5.25 T120+T122 dark drawer 50d20be · v0.5.26 sticky nav 2a28dd3 · v0.5.27 T130 nested lists 8539d57 · v0.5.28 T127 cross-nav b30b3de · v0.5.29 subtask indent+symlinks 60d6e36 · v0.5.30 T39 FileApi symlinks aad0816 · v0.5.31 T132 regenerate+indent fix 2f6dde2

### T118 E2E cleanup
cleanupTestUsers+8 specs 317f41a · Backfill 115 purged live

### T119 test traceability
Pass 6 parser ac4a6d2 · 42 test files marked a242530

### T121 UUID remediation
22 task UUIDs 9eb9d6a · 8 req UUIDs 2496aeb

### S17 Scenario Units
T125 foundation 9b79be3 · T125.3 5-level index 0fc5b90 · T126 views+generator 5a7e162 · T127 IOR resolver b30b3de · T128.1 exemplar (multiple: efc6d17→e1fabbf→17dcd01→60d6e36→d5b4770) · T128.3 Sprint 17 e8de4c6 · T132 renderStatusHtml 4a362d0 · T133 Task FSM e062849 · T134 TraceLink f173cad · T138 skills 368f1d0 · T136 migration req+UC 4b3dafb

### Spot-check fix (uncommitted)
renderStatusHtml: blockquote filter + non-checkbox line skip — include in next bump

## Scenario module (src/ts/scenario/)
types.ts · classes.ts (8 loaders incl TraceLink) · index-store.ts (5-level) · templates.ts (8 templates + renderStatusHtml) · generator.ts (ViewGenerator) · ior-resolver.ts · task-fsm.ts (7 states, 8 verbs) · trace-link.ts (8 relations) · skills.ts (captureQuote/proposeTask/walkChain/statusTransition)

## Migrated scenario data
S1: 12 units (1 sprint + 11 tasks) · S17: ~40 units (tasks + 15 UCs from PUML)
Index: scenario/index/<c1>/<c2>/<c3>/<c4>/<c5>/<uuid>.scenario.json
Symlinks: scenario/sprints.json/<sprint>/<speaking-name>.json
Views: scenario/sprints.md/<class>/<speaking-name>.md + .html

## Standing rules
- Planner stands up T-numbers first — never use PO harness numbers
- Version bump per #66 on surface changes (package.json + sw.js)
- STATIC_SHELL per #67 — update trace-page hash when bundle changes
- implementing [x] checkbox before committing
- Report each commit to robbinTeam:0.0
- T132 spot-check fix (blockquote filter) ready to include in next bump

## Deploy ritual
Stop iphone:0.1 C-c (×2) → git pull && npm run build && npm run dev → wait 16s → /api/health

## Key commands
npm run build · npm test · npm run trace:check · npx tsx scripts/migrate-to-scenario.ts --sprint <slug> --apply
