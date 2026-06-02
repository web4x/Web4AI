# robbin-expert Context — Save Point 2026-06-02 (SM warning)

**Role**: Web4RawBin Implementation Authority
**Status**: T158+T160+T161 shipped (v0.5.60). T162 superseded by T163. Pre-loading T163.
**Machine**: Mac Studio · **Pane**: robbinTeam:0.2
**Repo**: /Users/Shared/Workspaces/2cuGitHub/Web4RawBin · **Live**: https://home.donges.it:4444
**Current version**: v0.5.60 (pushed). 834/834 tests pass.

## Latest commits this session
- edc477c v0.5.60 T160 AC3: task.useCases[] from PUML T-number refs (24 refs, 5 tasks)
- a41d16a v0.5.59 T158: 4 typed DetailViews (Class/Method/Test/Implementation) + STATIC_SHELL
- 5b354fd v0.5.58 T160: requirement.tasks[] forward repop (23 refs)
- 737c841 v0.5.57 T161: requirement name fix — speaky names not quotes
- 58b17e3 v0.5.56 T159: forward-only chain strip back-refs + validator

## Next: T163 (api/trace title source switch)
T162 SUPERSEDED by T163. T163 = switch /api/trace from scanRepo firstLine() to scenario index model.name. Awaiting architect design in task-163-api-trace-title-source-switch.md.

## Scenario module (src/ts/scenario/)
types · classes (9 loaders) · index-store (5-level) · templates (9+TraceLink+renderStatusHtml+renderChainSection+SlugResolver) · generator · ior-resolver · task-fsm · trace-link · skills · source-location · trace-tree

## Standing rules
- Planner stands up T-numbers first
- Version bump #66 on surface changes; STATIC_SHELL #67 on bundle hash change
- implementing [x] before commit; report to robbinTeam:0.0
- Re-generate views after template changes
- Forward-only chain (T159) — no back-refs

## Deploy
otmux send iphone:0.1 C-c (x2) → git pull && npm run build && npm run dev → /api/health
