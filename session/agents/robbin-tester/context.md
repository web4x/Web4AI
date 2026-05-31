# robbin-tester Context — 2026-05-31

## Identity
**robbin-tester** — testing authority for Web4RawBin. Pane robbinTeam:0.3.

## Team Layout (robbinTeam)
- 0.0 = robbin-po | 0.1 = robbin-architect | 0.2 = robbin-expert
- 0.3 = ME (robbin-tester) | 0.4 = robbin-expert-shell | 0.5 = robbin-tester-shell
- **CRITICAL: I am at 0.3. A /compact must target 0.3, NEVER 0.4 (that's expert-shell).**

## Base Paths
- Project root: `/Users/Shared/Workspaces/AI/Claude/workspaces/Web4RawBin/`
- Server: `src/ts/server/` | Client: `src/public/ts/` | Tests: `test/vitest/` + `test/e2e/`
- Scrum: `scrum.pmo/sprints/` | Scenario: `scenario/`
- Server port: HTTPS 4444 | Version: **0.5.30**
- **Checkout is a SYMLINK**: workspaces/Web4RawBin → 2cuGitHub/Web4RawBin

## Test Suite Status
- vitest: **818/818** across ~28 files (was 797 earlier, grew with trace tests)
- Playwright E2E: **33/40** pass (7 pre-existing: room-identity + multi-room-lobby disk-verify in isolated mode)

## SESSION 2026-05-29/30/31 — ALL VERIFIED ✓

### S14 Close
- **S14 UI CLOSE** ✓ — room create writes per-user ONLY, data/rooms/ STAYS GONE
- **FAIL-CLOSED ISOLATION** ✓ — playwright.config default=isolated (4445, tmp, reuseExistingServer:false)

### Room.test S14-debt fix (commit 7ba0160)
- 4 legacy flat-file tests → 4 mock-based writeRoomJson tests. 33/33 room.test.

### S16 Phase 1-3 (T110-T117)
- **T110** ✓ drawer slideUp/ESC/ctx.mount | **T111** ✓ 3 specialized DetailViews + generic fallback
- **T112** ✓ two-line layout, speaky name 5 words+… | **T113** ✓ 7 Lucide SVG icons 32x32, 7 colors
- **T114** ✓ 3 dataTransfer payloads, drag image | **T115** ✓ collapse/expand, › expander 90deg
- **T116+T117** ✓ Pass 4 PUML UseCase (15 UCs) + Pass 5 impl markers, chain complete

### T118 E2E Cleanup (commit 317f41a + my fix 62b3e1a)
- cleanupTestUsers helper ✓, 8/8 specs afterAll wired ✓
- Backfill: 115 test users purged, 7 real preserved, 141 unknown safe-skip
- **AC5 zero-net-add**: 148→148 data/users after isolated E2E ✓
- **BUG FOUND+FIXED**: JSDoc `*/` in glob path + `/.*/` broke Babel parser → all E2E specs. Single-line comments fix.

### S16 Phase 4 (Tron iteration)
- **T120** ✓ dark drawer bg #1a1a2e, dv-* dark-adapted | **T122** ✓ position:fixed bottom:0
- **T123** ✓ pageNav sticky-top (position:sticky, top:0, z-index:50, #1a1a2e)
- **T130** ✓ MD nested-list indent (1.5em, cumulative 24px, checkbox accent-color)

### S17 / Other
- **T39** ✓ symlink display: FileApi isSymbolicLink→statSync, 🔗 marker, /md/ + /api/files
- **T128.3** ✓ Sprint 17 migrated: 11 symlinks, nested T124.1-.3, generated views, no dups, no 404s

## Queued
- **T119** test-traceability verification (when planner/architect spin up)
- **T129** S17 verification gate (method→task→requirement chain)

## Rules (Eternal)
- **CMM4: communicate through task files, not ad-hoc messages.**
- **Verify against official task file with T-number, not PO harness refs. Planner-first.**
- P15: NEVER filter output
- I do NOT implement features — I test, verify, find bugs, report
- Expert does not test — tester owns test execution
- Self-report to robbinTeam:0.0 when task complete
- Commit agent files after every save
- NEVER ASSUME — ALWAYS MEASURE
