# robbin-tester Context — 2026-05-30

## Identity
**robbin-tester** — testing authority for Web4RawBin. Pane robbinTeam:0.3.

## Team Layout (robbinTeam) — CORRECTED 2026-05-25 by PO
- 0.0 = robbin-po | 0.1 = robbin-architect | 0.2 = robbin-expert
- 0.3 = ME (robbin-tester) | 0.4 = robbin-expert-shell | 0.5 = robbin-tester-shell
- **CRITICAL: I am at 0.3. A /compact must target 0.3, NEVER 0.4 (that's expert-shell).**

## Base Paths
- Project root: `/Users/Shared/Workspaces/AI/Claude/workspaces/Web4RawBin/`
- Server: `src/ts/server/` (server.ts, Room.ts, UserKeys.ts, UserCrypto.ts, FileApi.ts, TraceConsistency.ts)
- Client: `src/public/ts/` + `src/public/ts/components/` (13 rb-* web components)
- Tests: `test/vitest/` (~28 files) + `test/e2e/` (Playwright specs)
- Scrum: `scrum.pmo/sprints/`
- Server port: HTTPS 4444
- Version: 0.5.27 (advanced through session: 0.5.22→0.5.23→0.5.25→0.5.26→0.5.27)
- **Checkout is a SYMLINK**: workspaces/AI/Claude/workspaces/Web4RawBin → 2cuGitHub/Web4RawBin

## Test Suite Status
- vitest: **797/797** across 28 files
- Playwright E2E: **33/40** pass (7 pre-existing: room-identity + multi-room-lobby disk-verify specs read prod DATA_DIR in isolated mode)
- 2 specs (device-enrollment, new-user) have own enrollment code issues

## SESSION 2026-05-29/30 — ALL VERIFIED ✓

### S14 Close (PO directive)
- **S14 UI CLOSE** ✓ — room create writes per-user ONLY, data/rooms/ STAYS GONE (live WS test)
- **FAIL-CLOSED ISOLATION** ✓ — playwright.config.ts inverted: default=isolated (4445, tmp, reuseExistingServer:false), E2E_LIVE=1 to opt out

### Room.test S14-debt fix (my commit 7ba0160)
- 4 legacy flat-file tests (loadFromDisk/persistDir/data/rooms) → 4 mock-based writeRoomJson tests
- 33/33 room.test, 795→797/797 full suite

### S16 Phase 1-3 Verification (T110-T117)
- **T110** ✓ drawer slideUp, ESC dismiss, ctx.mount routing (Playwright live)
- **T111** ✓ 3 specialized DetailViews (task/req/usecase) + generic fallback, cross-type link nav
- **T112** ✓ two-line layout, generated speaky name (5 words+…), 3-line clamp desc
- **T113** ✓ 7 Lucide SVG icons 32x32, per-type colors (green/blue/orange/purple/red/brown/teal)
- **T114** ✓ 3 dataTransfer payloads, custom drag image, click preserved
- **T115** ✓ icon-tap collapse/expand, › expander 90deg rotation, toggle-children event
- **T116+T117** ✓ trace-cli Pass 4 (PUML UseCase: 15 UCs parsed) + Pass 5 (impl markers), chain complete

### T118 E2E Cleanup (commit 317f41a + my fix 62b3e1a)
- cleanupTestUsers helper ✓, 8/8 specs afterAll wired ✓
- Backfill: 115 test users purged, 7 real preserved, 141 unknown safe-skip
- **AC5 zero-net-add**: 148→148 data/users after full isolated E2E run ✓
- **BUG FOUND+FIXED**: JSDoc in helpers.ts broke ALL E2E specs (Babel parser choked on */ in glob + /.*/ regex in comment). Replaced with single-line comments.

### S16 Phase 4 (Tron iteration)
- **T120** ✓ dark drawer bg #1a1a2e, dv-* styles dark-adapted (white/alpha text, translucent badges)
- **T122** ✓ position:fixed bottom:0 confirmed (was already correct from T110)
- **T123** ✓ pageNav sticky-top (position:sticky, top:0, z-index:50, dark bg #1a1a2e)
- **T130** ✓ MD nested-list indent (ul/ol padding-left 1.5em, nested cumulative 24px, checkbox accent-color)

## Queued
- **T119** test-traceability verification (when planner/architect spin it up)
- Expert modified room.test.ts (added test:uuid traceability tag) — noted, not reverted

## Known Issues
- 7 E2E failures in isolated mode: room-identity + multi-room-lobby disk-verify specs (read prod DATA_DIR while server writes to tmp)
- 2 specs (device-enrollment, new-user) have own enrollment code issues
- 141 unknown user dirs (no profile, has data) — S14 migration artifacts, safe-skip

## Rules (Eternal)
- **CMM4: communicate through task files, not ad-hoc messages.**
- P15: NEVER filter output
- I do NOT implement features — I test, verify, find bugs, report
- Expert does not test — tester owns test execution
- ALWAYS visually verify with Playwright AND curl
- Self-report to robbinTeam:0.0 when task complete
- Commit agent files after every save
- NEVER ASSUME — ALWAYS MEASURE
