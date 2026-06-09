# robbin-expert Context — Save Point 2026-06-09 (session 4 — pre-rewind)

**Role**: Web4RawBin Implementation Authority
**Status**: v0.5.120 deployed. R18.34 SVG viewer + chain correction L3-L5 + T199/T200 backfills shipped. Standing by for Tron iPhone rotation re-verify.
**Machine**: Mac Studio · **Pane**: robbinTeam:0.2
**Repo**: /Users/Shared/Workspaces/2cuGitHub/Web4RawBin · **Live**: https://home.donges.it:4444
**Current version**: v0.5.120. 879/879 tests pass.

## Latest commits (session 4)
- acacd044 v0.5.120 R18.34 D4 belt-and-braces: persist view + orientationchange + visualViewport
- df4d1831 v0.5.119: cache-bust bump
- 5513c08f v0.5.118 R18.34 D4 fix: preserve zoom on iOS URL-bar resize
- 2e71a312 v0.5.117 R18.34 D3+D4: inline SVG — crisp scale + no iPhone snap-back
- f1f7bd51 v0.5.116 R18.34: SVG viewer cross-browser pinch/pan in iframe
- 87dfee3b v0.5.114: SVG viewer — aspect-ratio + iframe isolation
- acacd044 LAYER 5 + 6-step chain Req→UC→Class→Method→Impl→Test live (v0.5.109)
- f3171e57 LAYER 4: Req.useCases[] populated 77/124
- 81856abd LAYER 3 chain correction code: 8 FORWARD_KEYS locations
- 23907dd4 T199 task traceability backfill: coveredRequirements + useCases + unitLinks cleanup
- d383970f T199/R18.32 ownerIor + model.parent + unitLinks[] integrity backfill (763 units)
- 9db921ff v0.5.110: detail→tree sync (revealNode + ancestor expand + highlight)
- db1e07fd v0.5.113: T200 root cause — server reverse-lookup parent fallback

## What shipped this session
- **R18.34 SVG viewer** (v0.5.114-v0.5.120): /svg-viewer endpoint with explicit gesture handling. iframe isolation insufficient — iOS Safari + Chrome/Mac + Chrome/iPhone all leak pinch to outer page. Full hand-rolled handler: touch pinch+pan, wheel+ctrlKey trackpad pinch, plain wheel pan, mouse drag, dbltap reset. matrix() transform on inline <svg> (not <img> — crisper + no iPhone snap-back). Outer page viewport locked maximum-scale=1,user-scalable=no.
- **D4 evolution**: 117 (inline svg) → 118 (preserve-zoom resize handler) → 120 (sessionStorage persist + orientationchange + visualViewport belt-and-braces).
- **Chain correction T201** (v0.5.108-v0.5.109): 6-step Req→UC→Class→Method→Impl→Test. 5 layers shipped: L1 standard, L2 audit, L3 code (8 FORWARD_KEYS locations), L4 data (77/124 Req.useCases), L5 views. Task is navigation (Sprint→Task→coveredReq), not chain.
- **T199 integrity backfill** (763 units): ownerIor reverse-lookup (Task→Sprint, Req→Task[coveredReqs], UC→Task, Class→UC, Method→Class, Impl→Method, Test→Impl) + model.parent mirror (Sprint excluded) + unitLinks[] field on ALL units + populate from forward refs.
- **T199 task traceability** (87 tasks coveredReqs + 2 useCases + 542 unitLinks cleanup).
- **T200 detail→tree sync** (v0.5.110-v0.5.113): rb-trace-tree revealNode(uuid) walks model.parent path, async expands ancestors with waitForNode (rAF poll for DOM appearance, 5s timeout), highlights target. pendingReveal for hashchange-before-render race. SERVER fix: /api/trace/children reverse-scans when ownerIor empty (architect-confirmed root cause).
- **R18.13 source fill gap**: 57 units sourceFile via name-match to .ts (Method 70/99, UC 44/85, Impl 112/149, Class 34/56).
- **R18.32**: AppClient ownerIor fixed via Method chain; 19 Sprints model.parent field DELETED (absent per Tron).

## Key architecture
- **6-STEP CHAIN (LOCKED)**: Req → UC → Class → Method → Impl → Test
- **Navigation (separate)**: Sprint → Task → coveredRequirements
- Task is NAVIGATION, NOT chain. Task.useCases is separate from chain.
- Two tree modes: ?mode=trace (narrowed) vs ?mode=scenario (fan-out)
- chainMethod hint: server returns UC.method alongside Class child in trace mode
- Sprint→Task nav roots via /api/trace/sprints
- Cycle guard: per-branch ancestors Set; one-layer lazy-load
- Forward-only at server (/api/trace) + client (forwardOnly())
- STATIC_SHELL auto-injected by build.mjs
- unitLinks[] on scenario units — put() auto-syncs symlinks atomically (R18.29-31)
- IOR normalization: bare UUID / ior:instance: / .scenario.json all resolve (T177)
- Source link filter: .scenario.json sourceFiles suppressed — only real .ts/.puml shown
- model.parent on all non-Sprint units mirrors ownerIor (Tron rule)
- /api/trace/children reverse-lookup fallback when ownerIor empty (T200)
- /svg-viewer: explicit gesture handler, inline <svg>, sessionStorage persist, visualViewport+orientationchange listeners (R18.34)
- /md/*.svg outer page viewport: maximum-scale=1,user-scalable=no (R18.34)
- revealNode(uuid) in rb-trace-tree: walks model.parent, expands with waitForNode rAF-poll, highlights (T200)

## Standing rules
- Version bump #66; STATIC_SHELL #67 (auto); implementing [x]; report to 0.0
- No clients.claim in SW; parser: one + line = one method
- No silent idle — report completion + flag blocks immediately
- impl:uuid markers: NEVER bare * outside JSDoc (esbuild crash) — use // for scripts
- CMM4: full report in task file; otmux = one-line pointer (SM directive)
- Architect-confirmed root cause BEFORE fix (don't hypothesis-cycle)
- Instrument with console breadcrumbs when 2+ hypothesis attempts fail

## Scripts (this session)
- scripts/backfill-unit-links.ts — populate unitLinks[] from existing symlinks
- scripts/backfill-owner-and-links.ts — 2-pass ownerIor + model.parent + unitLinks[] integrity
- scripts/backfill-task-traceability.ts — 3-pass coveredRequirements + useCases + unitLinks cleanup
- scripts/backfill-req-usecases.ts — Layer 4: Req.useCases[] from Task.coveredRequirements derivation
- scripts/fill-source-from-impl-markers.ts — scan src/ for [impl:uuid:] → set sourceFile
- scripts/fill-source-by-name.ts — match Class/Method/UC by name to .ts declarations

## Pending / blocked
- R18.34 D4: Tron re-verifies after iPhone rotation (v0.5.120 deployed with belt-and-braces fixes)
- 7 Implementation orphans (genuine — no Method parent in chain, cannot derive)
- 47 Requirements with no useCases (covering Tasks have no UCs)
- 23 Tasks with no coveredRequirements (no Req points to them — S01-S09 historical)
- 21 unreachable tests catalog (architect tracking)

## Deploy ritual
Stop (C-c twice), then: git pull && npm run build && npm run dev on iphone:0.1

## Build/test
npm run build · npm test · npm run ci:gates · npm run trace:audit
