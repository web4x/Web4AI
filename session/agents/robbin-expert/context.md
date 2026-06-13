# robbin-expert Context — Save Point 2026-06-13 (v0.6.0 milestone)

**Role**: Web4RawBin Implementation Authority
**Status**: v0.6.0 milestone deployed. Tron: best version ever.
**Pane**: robbinTeam2:0.2
**Repo**: /Users/Shared/Workspaces/2cuGitHub/Web4RawBin
**Live**: https://home.donges.it:4444 v0.6.0 (tagged 6f5595cb9)

## v0.6.0 marathon delivery summary
- Room tree: seed-ior reuse (/trace path), DocumentFragment atomic attach, sync render
- chat-sheet :host pointer-events:none (THE iPhone bug — invisible hit-test intercepted touches)
- iOS touchend handler (e.target, _touchHandled, passive)
- shouldStartOpen data-driven auto-expand (children-open IN .data, single source of truth)
- Collection folders (Members+Files) with typed items from /api/trace/children
- Build-time version badge (__BUILD_VERSION__ via esbuild define)
- Reset PWA Cache button, Profile UUID, System test room
- .room-view overflow-y:auto (safe-area clip fix)
- renderSeed debounce (rAF + AbortController)
- Test-auth harness (ensureSystemSession + uploadTestFile)

## Standing rules
- GATE BEFORE DEPLOY — tester gates isolated port FIRST, deploy ONLY on GREEN
- Version bump #66; STATIC_SHELL #67
- Forward-only chain; REAL UNITS ONLY
- Report each commit to robbinTeam2:0.0

## Deploy ritual
1. otmux send iphone:0.1 C-c (twice)
2. otmux send iphone:0.1 'cd /Users/Shared/Workspaces/2cuGitHub/Web4RawBin && git pull && npm run build && npm run dev' Enter
3. curl -sk https://home.donges.it:4444/api/health
