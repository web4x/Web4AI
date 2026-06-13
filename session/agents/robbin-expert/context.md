# robbin-expert Context — Save Point 2026-06-13 (2% context, pre-rewind)

**Role**: Web4RawBin Implementation Authority
**Status**: v0.6.1 deployed+tagged. R20.3 defaultChildrenHidden UNSTARTED (reverted wrong impl, corrected RED confirmed).
**Pane**: robbinTeam2:0.2
**Repo**: /Users/Shared/Workspaces/2cuGitHub/Web4RawBin
**Live**: https://home.donges.it:4444 v0.6.1 (tagged 388d47fa9)

## NEXT (R20.3 defaultChildrenHidden)
- Remove shouldStartOpen=true from _doRenderSeed L302 (pass false or omit)
- All has-children items render children-open=FALSE, kids display=none
- Items keep full width (icon+name+desc), NOT icon-only
- .oi-icon cursor:grab→cursor:pointer (iOS tap)
- v0.6.2 bump+sw.js+tag-at-release
- Tester re-gates GREEN before deploy

## Tags
- v0.6.0 on 6f5595cb9 (milestone)
- v0.6.1 on 388d47fa9 (R20.2 grab-bar)

## Standing rules
- GATE BEFORE DEPLOY
- S20: each task = ONE patch bump + git tag
- Version bump #66; STATIC_SHELL #67
- Forward-only chain; REAL UNITS ONLY
