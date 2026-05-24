# robbin-tester Context — 2026-05-24

## Identity
**robbin-tester** — testing authority for Web4RawBin. Pane robbinTeam:0.3.

## Team Layout (robbinTeam)
- 0.0 = robbin-po | 0.1 = robbin-architect | 0.2 = robbin-expert
- 0.3 = robbin-expert-shell | 0.4 = ME (robbin-tester) | 0.5 = robbin-tester-shell

## Base Paths
- Project root: `/Users/Shared/Workspaces/AI/Claude/workspaces/Web4RawBin/`
- Server source: `src/ts/server/server.ts`
- Room class: `src/ts/server/Room.ts`
- Client source: `src/public/ts/` (app.ts, RawBinClient.ts, RoomBrowser.ts, RoomView.ts)
- Components: `src/public/ts/components/` (rb-update-banner, rb-header, rb-overlay, rb-chat-sheet, rb-member-badge, rb-member-list, rb-qr-popup)
- Tests: `test/vitest/` (9 test files)
- E2E: `test/e2e/` (6 Playwright specs)
- Scrum: `scrum.pmo/sprints/`
- Server port: HTTPS 4444
- Current version: 0.2.12+

## Test Suite Status
- **379 unit tests** across 9 files, **379/379 PASS**
- Duration: 2.5s
- **Playwright E2E**: 3/6 PASS, 3/6 FAIL (stale selectors after web component refactor)

### Test Files
| File | Tests | Status |
|------|-------|--------|
| room.test.ts | 33 | 33/33 PASS |
| server.test.ts | 56 | 56/56 PASS |
| client.test.ts | 22 | 22/22 PASS |
| profile.test.ts | 22 | 22/22 PASS |
| userkeys.test.ts | 61 | 61/61 PASS |
| chat.test.ts | 18 | 18/18 PASS |
| pwa.test.ts | 40 | 40/40 PASS |
| offline.test.ts | 30 | 30/30 PASS |
| components.test.ts | 97 | 97/97 PASS (jsdom env) |

### Test Architecture
- ALL unit tests — no running server dependency
- Handler logic extracted from server.ts and tested with mock Maps + mock send functions
- Room class tested directly via import
- File system tests use temp dirs (os.tmpdir)
- `it.each` used for route and message type validation
- PWA tests check file existence and content
- Offline tests use in-memory mock OfflineStore
- Component tests use jsdom environment (`@vitest-environment jsdom`)
- Playwright for visual verification (375x812 viewport, screenshots)

## Completed Work

### Sprint 1 — RawBin Foundation
- T3.3: Wrote room.test.ts (33 tests) — Room class CRUD
- T3.4: Fixed 5 API mismatches (addChat, return false, persistDir string, mockWs readyState)
- T3.5: Fixed broadcast-with-exclude mock clear
- T4.6: Wrote server.test.ts — routes, WS handlers, data separation
- T5.7: Wrote client.test.ts — build, app loading, WS protocol, room flow

### Sprint 2 — Identity & SSH
- T7.7: Wrote profile.test.ts (22 tests) — UPDATE_PROFILE, GET_USER_INFO, profileCommitted, secretCode, backfill, backward compat
- T9.7: Wrote userkeys.test.ts (27 tests) — createUserHome, generateUserKeypair, permissions, idempotent
- T10.7: Extended userkeys.test.ts (+20 tests) — device keypair, sign/verify, enrollDevice, DEVICE_ENROLL handler
- T12.8: Extended userkeys.test.ts (+14 tests) + profile.test.ts (+3 tests) — challenge-response, backward compat

### Sprint 3 — E2E Hardening
- T14: Refactored server.test.ts + client.test.ts from integration to unit tests
- T16: Added 11 deployment tests — health endpoint, version, shell scripts
- T20: Wrote chat.test.ts (18 tests) — broadcast, history, limits, multi-user

### Sprint 4 — Traceability
- T23-T25: Audited 28 task files across Sprints 1-3 — report at sprint-4-traceability/audit-report.md

### Sprint 5 — PWA Offline (Tron approved)
- T31: Wrote pwa.test.ts (20 tests) — sw.js, manifest.json, icons, app.html PWA
- T32: Extended pwa.test.ts (+9 tests) — Cache-Control headers, source map blocking
- T33: Extended pwa.test.ts (+11 tests) — reconnect, messageQueue, FIFO replay
- T36: Wrote offline.test.ts (30 tests) — OfflineStore: messageQueue, roomState, profile, background sync
- T37: Verified private rooms, mobile viewport, version, update banner (Playwright)
- Found update banner bug: checkForUpdate silently swallowed version mismatch — expert fixed in v0.2.4
- Verified v0.2.4 → v0.2.5 → v0.2.6 → v0.2.7 (safe-area insets, CACHE_NAME, skipWaiting placement)

### Sprint 6 — Web Components
- T39-T41: Wrote components.test.ts (50 tests) — rb-overlay (backdrop, click-close, show/hide, scroll prevention, touch-dismiss), rb-update-banner (DOM, version mismatch), rb-header (attributes, buttons), existing dialog pattern audit
- T42-T43: Extended components.test.ts (+29 tests) — rb-chat-sheet (addMessage, WS dot, expand/collapse, peek, input limit), rb-member-badge (avatar, host star, self indicator, click event), rb-member-list (count, empty, mixed)
- T44-T45: Extended components.test.ts (+16 tests) — server pages rb-update-banner, shared CSS, rb-qr-popup (show/close/backdrop), lobby notch safe-area verification
- T46: Verified cleanup — no orphaned imports, all components used (rb-overlay unused externally), 379/379 vitest, 3/6 E2E fail (stale selectors)
- Found lobby notch bug: .lobby-header rb-header padding:0 killed safe-area — expert fixed in v0.2.12

## Known Issues
- Playwright E2E 3/6 FAIL: selectors stale after web component refactor (.chat-sheet → rb-chat-sheet, #room-title → rb-header, #member-list [data-member-id] → rb-member-list)
- rb-overlay exists but 0 external imports — ProfileEditor/ProfileSheet/DeviceEnrollDialog not yet refactored to use it

## Rules (Eternal)
- P15: NEVER filter output (no 2>/dev/null, | head, | tail, | grep)
- I do NOT implement features — I test, verify, find bugs, report
- Expert does not test — tester owns test execution
- Unit test handler logic directly — no server dependency for vitest
- ALWAYS visually verify with Playwright — code review alone is NOT verification
- Self-report to robbinTeam:0.0 when task complete
- TaskCreate before starting, TaskUpdate when done
- Commit agent files after every save
