# robbin-expert Context — Save Point 2026-06-01 (SM 575k)

**Role**: Web4RawBin Implementation Authority
**Status**: T140 shipped (v0.5.55). Standing by for next assignment.
**Machine**: Mac Studio · **Pane**: robbinTeam:0.2
**Repo**: /Users/Shared/Workspaces/2cuGitHub/Web4RawBin · **Live**: https://home.donges.it:4444
**Current version**: v0.5.55 (pushed). 834/834 tests pass.

## Latest commits this session
- 8fb354e v0.5.55 T140: trace-cli source validation + S17 re-migration
- 5be4185 v0.5.32 T132: blockquote leak fix + regenerate views
- Prior session shipped T142-T156 (v0.5.36-v0.5.54)

## Scenario module (src/ts/scenario/)
types · classes (9: Sprint/Task/Req/UC/Class/Method/Test/TraceLink/User) · index-store (5-level) · templates (9+TraceLink + renderStatusHtml + renderChainSection + SlugResolver) · generator · ior-resolver · task-fsm (7 states, 8 verbs) · trace-link (8 relations) · skills (captureQuote/proposeTask/walkChain/statusTransition) · source-location (git anchor + 3 extractors + validateAllSources) · trace-tree

## Migrated scenario data
S1+S17 migrated. ~200+ index units. Per-class symlink subdirs. 231+ views.
Source locations on all UCs (PUML line ranges + git commit SHA).

## Standing rules
- Planner stands up T-numbers first — never use PO harness numbers
- Version bump #66 on surface changes; STATIC_SHELL #67 on bundle hash
- implementing [x] before commit; report to robbinTeam:0.0
- Re-generate views after template changes
- DRY-RUN first for data migrations

## Deploy
otmux send iphone:0.1 C-c (x2) → git pull && npm run build && npm run dev → /api/health
