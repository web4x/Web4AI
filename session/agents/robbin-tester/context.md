# robbin-tester Context — 2026-05-23

## Identity
**robbin-tester** — testing authority for Web4RawBin. Pane robbinTeam:0.3.

## Team Layout (robbinTeam)
- 0.0 = robbin-po | 0.1 = robbin-architect | 0.2 = robbin-expert
- 0.3 = robbin-expert-shell | 0.4 = ME (robbin-tester) | 0.5 = robbin-tester-shell

## Base Paths
- Project root: `/Users/Shared/Workspaces/AI/Claude/workspaces/Web4RawBin/`
- Server source: `src/ts/server/server.ts` (~900 lines)
- Room class: `src/ts/server/Room.ts` (~300 lines)
- Client source: `src/public/ts/` (app.ts, RawBinClient.ts, RoomBrowser.ts, RoomView.ts)
- Tests: `test/vitest/` (6 test files)
- Scrum: `scrum.pmo/sprints/`
- Server port: HTTPS 4444 (was 3443 in QnD)

## Test Suite Status
- **213 unit tests** across 6 files, **211 PASS / 2 expected FAIL** (shell scripts not yet created)
- Duration: 2.4s (well under 5s target)

### Test Files
| File | Tests | Status |
|------|-------|--------|
| room.test.ts | 33 | 33/33 PASS |
| server.test.ts | 57 | 55/57 PASS (2 FAIL: rawbin.sh + stop.sh don't exist yet) |
| client.test.ts | 22 | 22/22 PASS |
| profile.test.ts | 22 | 22/22 PASS |
| userkeys.test.ts | 61 | 61/61 PASS |
| chat.test.ts | 18 | 18/18 PASS |

### Test Architecture
- ALL unit tests — no running server dependency
- Handler logic extracted from server.ts and tested with mock Maps + mock send functions
- Room class tested directly via import
- File system tests use temp dirs (os.tmpdir)
- `it.each` used for route and message type validation

## Completed Work

### Sprint 1 — RawBin Foundation
- T3.3: Wrote room.test.ts (33 tests, 9 describe blocks) — Room class CRUD
- T3.4: Fixed 5 API mismatches (addChat, return false, persistDir string, mockWs readyState)
- T3.5: Fixed broadcast-with-exclude mock clear — 32/33 PASS
- T4.6: Wrote server.test.ts (33 tests) — routes, WS handlers, data separation
- T5.7: Wrote client.test.ts (23 tests) — build, app loading, WS protocol, room flow

### Sprint 2 — Identity & SSH
- T7.7: Wrote profile.test.ts (18→22 tests) — UPDATE_PROFILE, GET_USER_INFO, profileCommitted, secretCode, backfill
- T9.7: Wrote userkeys.test.ts (27 tests) — createUserHome, generateUserKeypair, permissions, idempotent
- T10.7: Extended userkeys.test.ts (+20 tests) — device keypair, sign/verify, enrollDevice, DEVICE_ENROLL handler
- T12.8: Extended userkeys.test.ts (+14 tests) + profile.test.ts (+3 tests) — challenge-response, backward compat

### Sprint 3 — E2E Hardening
- T14: Refactored server.test.ts + client.test.ts from integration to unit tests — 68/68 PASS
- T16: Added 11 deployment tests — health endpoint, version, shell scripts
- T20: Wrote chat.test.ts (18 tests) — broadcast, history, limits, multi-user

### Sprint 4 — Traceability
- T23-T25: Audited 28 task files across Sprints 1-3 — report at sprint-4-traceability/audit-report.md
- T17 SUPPORT: Standing by to run full suite after expert fixes

## Rules (Eternal)
- P15: NEVER filter output (no 2>/dev/null, | head, | tail, | grep)
- I do NOT implement features — I test, verify, find bugs, report
- Expert does not test — tester owns test execution
- Unit test handler logic directly — no server dependency for vitest
- Self-report to robbinTeam:0.0 when task complete
- TaskCreate before starting, TaskUpdate when done
- Commit agent files after every save
