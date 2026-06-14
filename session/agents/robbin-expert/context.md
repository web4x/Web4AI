# robbin-expert Context — Save Point 2026-06-14 (post-drawer-saga)

**Role**: Web4RawBin Implementation Authority
**Status**: v0.6.22 clean build deployed. Drawer saga DONE (Tron device-verified). Standing by.
**Pane**: robbinTeam2:0.2
**Repo**: /Users/Shared/Workspaces/2cuGitHub/Web4RawBin
**Live**: https://home.donges.it:4444 v0.6.22

## Session summary (v0.6.10 → v0.6.22)
- v0.6.10 drawer consolidation: ChatPanel (Light DOM), 3-panel drawer, rb-chat-sheet deleted
- v0.6.11 BUG-A/B/C: panel display:block, deselect→chat, renderDetailForRef
- v0.6.12 selectionModel.replaceWith (single dispatch)
- v0.6.13-v0.6.17 BUG5: 6 attempts → geometric root (drawer covers tree)
- v0.6.18 split-layout (position:static flex-column, zero overlap)
- v0.6.19 BUG6: child clicks via selectionModel (no VerbRegistry)
- v0.6.20 room-drawer aligned: lazy ChatPanel, guarded chat-default
- v0.6.21 room flex-constraint (height not min-height, drawer pins bottom)
- v0.6.22 clean build (all instrumentation removed, Tron device-verified)
- Test-user purge: 170 deleted, 61 remaining, profiles.json rebuilt
- Chain wiring: 76bbedda Impl for ClassRegistry.loader

## Key learnings (drawer saga)
- MEASURE before fixing: 6 BUG5 attempts failed because we guessed CSS instead of instrumenting
- BUILD-VERIFY (#95): grep the BUNDLE not the source — 5 fixes were in source but never built
- Geometric root > event-based: position:fixed overlay covering tree = no amount of pointer-events/touch fixes helps
- Flex-constraint = the answer: fixed-height container + flex:1 tree + flex-shrink:0 drawer = zero overlap by construction
- Lazy ChatPanel: create on first .chat access, not in render() — prevents /trace from getting chat UI
- selectionModel.replaceWith: single dispatch avoids intermediate empty-selection flash
- renderDetailForRef: drawer self-renders typed detail on ref change (attributeChangedCallback)

## Standing rules
- Version bump #66; STATIC_SHELL #67
- BUILD-VERIFY in dist before reporting fixed (#95)
- Forward-only chain; REAL UNITS ONLY
- Touch listeners on .drawer-handle ONLY (never whole drawer element)
- Report each commit to robbinTeam2:0.0

## Deploy ritual
1. otmux send iphone:0.1 C-c (twice)
2. otmux send iphone:0.1 'cd /Users/Shared/Workspaces/2cuGitHub/Web4RawBin && git pull && npm run build && npm run dev' Enter
3. curl -sk https://home.donges.it:4444/api/health

## Build/test
npm run build · npm test · 973/974 (1 pre-existing editOpen)

## Chain wiring status
- 5 methods have [impl:uuid] markers (renderSingularChain, renderAllChildren, renderSupersededLinks, chainExcludesSelf, removeDefaultHighlight)
- 8 methods MISSING markers (deferRenderToMicrotask, initCollapsed, selectedCSS, onEmptyShowChat, tapSwitchToggle, unifyChainLabel, createAndManage, useSystemIdentity)
- Architect batch-wiring the 5 with markers; 8 need markers added first
