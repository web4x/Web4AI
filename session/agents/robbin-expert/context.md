# robbin-expert Context — Save Point 2026-05-31 (SM context warning)

**Role**: Web4RawBin Implementation Authority
**Status**: S17 T132-T141 shipped. Standing by for T142.
**Machine**: Mac Studio · **Pane**: robbinTeam:0.2
**Repo**: /Users/Shared/Workspaces/2cuGitHub/Web4RawBin · **Live**: https://home.donges.it:4444
**Current version**: v0.5.34 (pushed). Build 72.6kb. 834/834 tests pass.

## Team (robbinTeam)
0.0 robbin-po · 0.1 robbin-architect · 0.2 ME · 0.3 robbin-tester · 1.0 planner · 1.1 req

## Latest commits this session (most recent first)
- eb29238 v0.5.34 T141: chain-link icons all 7 templates
- 3fb1fce v0.5.33 T140: source-location IOR for UC units
- 5be4185 v0.5.32 T132: blockquote leak fix + regenerate
- 368f1d0 T138: 4 scenario skills (captureQuote/proposeTask/walkChain/statusTransition)
- 4b3dafb T136: migration extension Requirement+UseCase parsers
- e062849 T133: Task FSM 7 states 8 verbs
- 4a362d0 T132: renderStatusHtml checkbox+substep
- f173cad T134: TraceLink 8 relations
- Earlier: S16 T110-T117, T118-T131, T125-T128

## Scenario module (src/ts/scenario/)
types.ts · classes.ts (8 loaders) · index-store.ts (5-level) · templates.ts (8 templates + renderStatusHtml + renderChainSection) · generator.ts · ior-resolver.ts · task-fsm.ts · trace-link.ts · skills.ts · source-location.ts

## Migrated data
S1: 12 units (1 sprint + 11 tasks) · S17: 55 units (tasks + 15 UCs + 10 reqs + TraceLinks)
Total: 67 index units, 33 symlinks, 138 views (71 MD + 67 HTML)
Index: scenario/index/<c1>/<c2>/<c3>/<c4>/<c5>/<uuid>.scenario.json

## Standing rules
- Planner stands up T-numbers first
- Version bump per #66 on surface changes
- STATIC_SHELL per #67 — update hash when bundle changes
- implementing [x] checkbox before committing
- Report each commit to robbinTeam:0.0
- Re-generate views after every template change
- Task files = single source of truth (CMM4)

## Deploy ritual
Stop iphone:0.1 C-c (x2) → git pull && npm run build && npm run dev → wait 16s → /api/health
