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
- Tests: `test/vitest/` (11 test files)
- E2E: `test/e2e/` (6 Playwright specs)
- Scrum: `scrum.pmo/sprints/`
- Server port: HTTPS 4444

## Test Suite Status
- **437 unit tests** across 11 files, **437/437 PASS**
- Duration: ~5s
- **Playwright E2E**: 1/6 PASS (server down + stale selectors from Sprint 6 refactor)

### Test Files
| File | Tests | Status |
|------|-------|--------|
| room.test.ts | 33 | PASS |
| server.test.ts | 56 | PASS |
| client.test.ts | 22 | PASS |
| profile.test.ts | 22 | PASS |
| userkeys.test.ts | 61 | PASS |
| chat.test.ts | 18 | PASS |
| pwa.test.ts | 40 | PASS |
| offline.test.ts | 30 | PASS |
| components.test.ts | 97 | PASS (jsdom) |
| crypto.test.ts | 25 | PASS |
| avatar.test.ts | 33 | PASS |

### Test Architecture
- ALL unit tests — no running server dependency
- Handler logic extracted and tested with mocks
- Room class tested directly via import
- File system tests use temp dirs (os.tmpdir)
- Crypto tests use real RSA-2048 + AES-256-GCM
- Component tests use jsdom environment
- Playwright for visual verification (375x812 viewport, screenshots)

## Completed Work

### Sprint 1 — RawBin Foundation
- T3.3-T3.5: room.test.ts — Room class CRUD, API alignment fixes
- T4.6: server.test.ts — routes, WS handlers, data separation
- T5.7: client.test.ts — build, app loading, WS protocol, room flow

### Sprint 2 — Identity & SSH
- T7.7: profile.test.ts — UPDATE_PROFILE, GET_USER_INFO, secretCode, backfill
- T9.7+T10.7+T12.8: userkeys.test.ts — SSH keys, device keys, challenge-response

### Sprint 3 — E2E Hardening
- T14: Refactored server+client tests from integration to unit
- T16: Deployment tests — health endpoint, version, shell scripts
- T20: chat.test.ts — broadcast, history, limits, multi-user

### Sprint 4 — Traceability
- T23-T25: Audited 28 task files — report at sprint-4-traceability/audit-report.md

### Sprint 5 — PWA Offline
- T31-T33: pwa.test.ts — SW, manifest, caching, reconnect queue
- T36: offline.test.ts — IndexedDB OfflineStore
- T37: Verified private rooms, update banner (Playwright visual)
- Found update banner bug (silent version swallow) — expert fixed v0.2.4
- Verified v0.2.4 → v0.2.7 (safe-area insets, CACHE_NAME, skipWaiting)

### Sprint 6 — Web Components
- T39-T45: components.test.ts — rb-overlay, rb-update-banner, rb-header, rb-chat-sheet, rb-member-badge/list, rb-qr-popup, server page shell, lobby notch
- T46: Verified cleanup — no orphaned imports, rb-overlay unused externally
- Found lobby notch bug (padding:0 killed safe-area) — expert fixed v0.2.12

### Sprint 7 — Encrypted Storage + Avatars
- T47: crypto.test.ts (25 tests) — encryptFile, decryptFile, roundtrip, wrong-user rejection, tampered ciphertext, 1MB file, listUserFiles, deleteFile, fileExists
- T48+T49: avatar.test.ts (17 tests) — avatar endpoint 200/404, ETag, Content-Type, profile.avatar URL, avatar.enc storage
- T51-T53: Extended avatar.test.ts (+16 tests) — upload API (500KB limit, MIME validation), avatar visible everywhere, room join uses profile.avatar with /icon-192.png fallback
- T54: Verified cleanup — avatarCache still present (3 lines, expert must remove), fetchUniqueAvatar moved to profile creation only, no plaintext images

## Known Issues
- Playwright E2E 5/6 FAIL: 4 = server not running (ERR_CONNECTION_REFUSED), 1 = stale chat shadow DOM selector
- avatarCache Map still in server.ts (3 lines) — expert must remove
- rb-overlay exists but 0 external imports — dialogs not refactored to use it

## Rules (Eternal)
- P15: NEVER filter output (no 2>/dev/null, | head, | tail, | grep)
- I do NOT implement features — I test, verify, find bugs, report
- Expert does not test — tester owns test execution
- Unit test handler logic directly — no server dependency for vitest
- ALWAYS visually verify with Playwright — code review alone is NOT verification
- Self-report to robbinTeam:0.0 when task complete
- TaskCreate before starting, TaskUpdate when done
- Commit agent files after every save
