# robbin-expert Context — Save Point 2026-05-31 (SM context warning)

**Role**: Web4RawBin Implementation Authority
**Status**: T128.2+T128.4+T141 shipped. Server restored v0.5.34. Standing by for T142.
**Machine**: Mac Studio · **Pane**: robbinTeam:0.2
**Repo**: /Users/Shared/Workspaces/2cuGitHub/Web4RawBin · **Live**: https://home.donges.it:4444
**Current version**: v0.5.34 (live, pushed). 834/834 tests pass.

## Latest commits (most recent)
- 57a1288 fix: rb-overlay.ts bare impl marker
- 2e5e9dc T128.4: impl:uuid markers on all 61 source files
- cc7af47 T128.2: batch migrate S2-S9 (75 tasks)
- eb29238 v0.5.34 T141: chain-link icons all 7 templates
- 3fb1fce v0.5.33 T140: source-location IOR
- 5be4185 v0.5.32 T132: blockquote fix
- 368f1d0 T138: 4 scenario skills
- 4b3dafb T136: migration extension Req+UC
- e062849 T133: Task FSM
- 4a362d0 T132: renderStatusHtml
- f173cad T134: TraceLink

## Scenario module (src/ts/scenario/)
types, classes (8 loaders), index-store (5-level), templates (8 + renderStatusHtml + renderChainSection), generator, ior-resolver, task-fsm, trace-link, skills, source-location

## Migrated scenario data
S1-S9 + S17 = 150 index units, 116 symlinks, 312 views. 10 sprints in overview.

## Standing rules
- Planner stands up T-numbers first
- Version bump #66 on surface changes; STATIC_SHELL #67 on bundle hash change
- impl:uuid markers: ALWAYS inside /** */ or use // single-line (NEVER bare * outside JSDoc)
- implementing [x] before commit; report to robbinTeam:0.0
- Re-generate views after template changes
- Task files = single source of truth (CMM4)

## Deploy
otmux send iphone:0.1 C-c (x2) → git pull && npm run build && npm run dev → /api/health
