# robbin-tester Context — 2026-06-11

## Identity
**robbin-tester** at robbinTeam2:0.6.

## Project
- Path: `/Users/Shared/Workspaces/AI/Claude/workspaces/Web4RawBin/`
- Server: HTTPS 4444 | Version: **0.5.204**
- Chain: **174/174 sealed** (SM health hold at 173/173 checkpoint + R19.82/83 in-flight)

## Session 2026-06-11 — chain climb 8→174

### Chain work
- Started at 8/159 honest (skill-expert caught 17 fabricated false-completes)
- Created ~200 dedicated Test units with real uuidgen uuids
- Wired Impl.tests[] for every chain
- Split 19 shared tests into per-req dedicated tests
- Fixed 5 shared-test over-credits, 3 cross-class borrows
- Cleaned collision: 11 orphans + 69 dup Tests removed
- Fixed 27 empty-sourceFile Tests, reconciled marker↔sourceFile mismatches
- Final: 174/174 ALL CHAINS CLOSED (scoreboard at commit ae248d0f2)

### Verified features (v0.5.192-204)
- Room 440ccc82 file preview: 3 files with mimeType, /api/trace/children shows File children
- R19.75 preview-auth: member token → 200, no token → 403, wrong token → 403
- R19.77 URL file: two buttons (Open in preview/new tab), wireUrlActions
- R19.78-81: buttons above filename, grab-handle+close X, 95vh, pinch-zoom
- R19.82: addMember takeover fix verified (WS test: takeover PASS, different user PASS)
- R19.83: file items survive re-render (this.files persists, renderRoomTreeFiles rebuilds)

### Hard rules learned
- NEVER invent uuid suffix — uuidgen fresh OR copy FULL 36-char verbatim
- One marker = one unit = one method, no sharing
- shared-test marker is NEVER a flip — split first
- Unit with live marker is never garbage (skill-expert lesson)
- Canonical measure = po-chain-follow-up ONLY

## Status: SM HEALTH HOLD — STANDBY IDLE at sealed checkpoint
