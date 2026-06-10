# robbin-expert Context — Save Point 2026-06-10 (session 4 — near-limit)

**Role**: Web4RawBin Implementation Authority
**Status**: v0.5.125 deployed — R18.34.B real fix Tron-verified. Mid-cleanup of debug instrumentation (v0.5.126 close-out).
**Machine**: Mac Studio · **Pane**: robbinTeam:0.2
**Repo**: /Users/Shared/Workspaces/2cuGitHub/Web4RawBin · **Live**: https://home.donges.it:4444
**Current version**: v0.5.125. 879/879 tests pass.

## IN-FLIGHT WORK (RESUME POINT)
**Task**: Strip SVGDBG debug instrumentation for v0.5.126 close-out.
**Progress**:
- ✅ Removed `/api/svg-log` POST endpoint (server.ts ~842-848)
- ❌ TODO: Strip `slog()` helper definition in SvgViewer JS (search `const slog=`)
- ❌ TODO: Strip all `slog(...)` calls — in touchstart, touchmove-pinch, touchend, touchcancel handlers AND inside apply()
- ❌ TODO: Strip `slog('dbltap-reset')` inside tap detector
- ❌ TODO: KEEP the proper tap detector (tapStart + slop + duration check)
- ❌ TODO: Bump package.json to 0.5.126, build, commit, deploy, report

**Command to deploy after edits**: `git pull && npm run build && npm run dev` on iphone:0.1
**Then**: report (a) v0.5.126 (b) rawbin-v0.5.126 (c) STATIC_SHELL exempt to robbinTeam:0.0

## Latest commits (session 4)
- 809cb92a v0.5.125 R18.34.B real fix: proper tap detector distinguishes pinch-release
- ba30b4d1 v0.5.124 R18.34 device instrumentation: SVGDBG server-log relay
- 6771a91d v0.5.123 T188: --check mode + determinism + ci:gates wire
- 522c919e v0.5.122 R18.8 missed location: /api/trace SCENARIO_FORWARD requirement→useCases
- 8e9e6a06 v0.5.121 R18.34.B: pinch-commit fix — apply() on touchend + rAF after pinch
- acacd044 v0.5.120 R18.34 D4 belt-and-braces: persist view + orientationchange + visualViewport
- 5513c08f v0.5.118 R18.34 D4 fix: preserve zoom on iOS URL-bar resize
- 2e71a312 v0.5.117 R18.34 D3+D4: inline SVG — crisp scale + no iPhone snap-back
- f1f7bd51 v0.5.116 R18.34: SVG viewer cross-browser pinch/pan in iframe

## R18.34.B saga (final root cause)
SVGDBG capture (47 entries) PROVED the bug: 2-finger pinch fires TWO touchends within ms (one per finger lift), each with `changedTouches.length===1` → broken dbltap detector → `reset()` → scale snaps to 0.187 contain-fit. **Fix in v0.5.125**: replace dbltap detector with proper tap-detector — tapStart only set on single-finger touchstart, CLEARED on any multi-finger touchstart, requires <10px slop + <250ms duration + full lift. Pinch can never qualify. Tron device-verified.

## What shipped this session
- **R18.34 SVG viewer** (v0.5.114-v0.5.125): /svg-viewer endpoint with explicit gesture handling. Inline `<svg>` (not `<img>`). matrix() transform. Outer viewport locked. Preserve-zoom on resize. sessionStorage persist. Proper tap detector (final D4 fix).
- **Chain correction T201** (v0.5.108-v0.5.109): 6-step Req→UC→Class→Method→Impl→Test. 5 layers shipped.
- **T199 integrity backfill** (763 units): ownerIor + model.parent + unitLinks[].
- **T200 detail→tree sync**: revealNode + ancestor walk + waitForNode + reverse-lookup parent fallback.
- **T177 IOR normalization**: bare UUID + ior:instance: + .scenario.json.
- **T188 generate-sprint-md**: --check mode + determinism + ci:gates wire.
- **R18.8 missed location**: server.ts:464 SCENARIO_FORWARD requirement→useCases (v0.5.122).

## Key architecture
- **6-STEP CHAIN (LOCKED)**: Req → UC → Class → Method → Impl → Test
- **Navigation (separate)**: Sprint → Task → coveredRequirements
- 8 FORWARD_KEYS locations updated for chain correction:
  TraceModel FORWARD_KEYS + children/parent (ABOVE+BELOW), forward-only.ts,
  server.ts SCENARIO_FWD + TRACE_FWD + SCENARIO_FORWARD (line 464) + EXPECTED_CHILD_TYPE + /api/trace/roots,
  trace-audit CANONICAL_FORWARD.
- Two tree modes: ?mode=trace (narrowed) vs ?mode=scenario (fan-out)
- /svg-viewer: explicit gesture handler with proper tap detector
- /md/*.svg outer page viewport: maximum-scale=1,user-scalable=no
- revealNode(uuid) in rb-trace-tree: walks model.parent, waitForNode rAF-poll, highlights
- /api/trace/children reverse-lookup fallback when ownerIor empty
- unitLinks[] on scenario units — put() auto-syncs symlinks atomically

## Standing rules
- Version bump #66; STATIC_SHELL #67 (auto); implementing [x]; report to 0.0
- CMM4: full report in task file; otmux = one-line pointer (SM directive)
- Architect-confirmed root cause BEFORE fix
- Instrument with logs when 2+ hypothesis attempts fail
- impl:uuid markers: NEVER bare * outside JSDoc — use // for scripts

## Pending / blocked
- v0.5.126 close-out: strip SVGDBG instrumentation (see IN-FLIGHT above)
- 7 Implementation orphans (genuine — no Method parent in chain)
- 47 Requirements with no useCases (covering Tasks have no UCs)
- 23 Tasks with no coveredRequirements (S01-S09 historical)

## Deploy ritual
Stop (C-c twice), then: git pull && npm run build && npm run dev on iphone:0.1

## Build/test
npm run build · npm test · npm run ci:gates · npm run check:sprint-md · npm run trace:audit
