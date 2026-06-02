# robbin-expert Context — Save Point 2026-06-02 (SM 684k)

**Role**: Web4RawBin Implementation Authority
**Status**: T165+T164+T128.2 shipped (v0.5.64). Awaiting T166 architect design.
**Machine**: Mac Studio · **Pane**: robbinTeam:0.2
**Repo**: /Users/Shared/Workspaces/2cuGitHub/Web4RawBin · **Live**: https://home.donges.it:4444
**Current version**: v0.5.64 (committed). 834/834 tests pass.

## Latest commits this session
- f4d21b3 v0.5.64 T128.2: S10-S16 migrated (243 total units, 496 views)
- 7016003 v0.5.63 T164: firstLine()+cleanModelName() hardened, 0 dirty names
- ece09bc v0.5.62 T165: tree renders all 7 typed classes + orphan recovery
- f138aa0 v0.5.61 T163: /api/trace title source → scenario index model.name
- edc477c v0.5.60 T160 AC3: task.useCases[] from PUML T-number refs
- a41d16a v0.5.59 T158: 4 typed DetailViews (Class/Method/Test/Implementation)
- 5b354fd v0.5.58 T160: requirement.tasks[] forward repop
- 737c841 v0.5.57 T161: requirement name fix — speaky names not quotes
- 58b17e3 v0.5.56 T159: forward-only chain strip back-refs

## Next: T166 (populate Class+Method in /api/trace from scenario index)
Sister pattern to T163. scanRepo() doesn't produce Class/Method objects. Scenario index has them from T128.1. Overlay into graph after scanRepo. Awaiting architect design.

## Scenario data
243 units: 55 Reqs, 99 Tasks, 30 UCs, 50 TraceLinks, 9 Sprints. S1+S10-S17 migrated.

## Key rules
- Forward-only chain (T159) — no back-refs
- cleanModelName() strips ##, **, ---, date suffixes, bold
- /api/trace overlays scenario index model.name on graph (T163)
- Version bump #66; STATIC_SHELL #67 on bundle hash change
- Planner T-numbers first; implementing [x] before commit
