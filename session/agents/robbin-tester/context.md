# robbin-tester Context — 2026-05-24

## Identity
**robbin-tester** — testing authority for Web4RawBin. Pane robbinTeam:0.3.

## Team Layout (robbinTeam)
- 0.0 = robbin-po | 0.1 = robbin-architect | 0.2 = robbin-expert
- 0.3 = robbin-expert-shell | 0.4 = ME (robbin-tester) | 0.5 = robbin-tester-shell

## Base Paths
- Project root: `/Users/Shared/Workspaces/AI/Claude/workspaces/Web4RawBin/`
- Server: `src/ts/server/server.ts`, Room.ts, UserKeys.ts, UserCrypto.ts, FileApi.ts
- Client: `src/public/ts/` (app.ts, edit.ts, RawBinClient.ts, RoomBrowser.ts, RoomView.ts)
- Components: `src/public/ts/components/` (rb-update-banner, rb-header, rb-overlay, rb-chat-sheet, rb-member-badge, rb-member-list, rb-qr-popup, rb-avatar, rb-editor-layout, rb-file-tree, rb-code-editor, rb-preview, rb-editor-toolbar)
- Tests: `test/vitest/` (13 test files)
- E2E: `test/e2e/` (Playwright specs)
- Scrum: `scrum.pmo/sprints/`
- Server port: HTTPS 4444

## Test Suite Status
- **631 unit tests** across 13 files, **629/631 PASS**
- 2 expected FAIL: /md/↔/edit/ cross-links not added yet
- Duration: ~6s

### Test Files
| File | Tests |
|------|-------|
| room.test.ts | 33 |
| server.test.ts | 56 |
| client.test.ts | 22 |
| profile.test.ts | 22 |
| userkeys.test.ts | 61 |
| chat.test.ts | 18 |
| pwa.test.ts | 40 |
| offline.test.ts | 30 |
| components.test.ts | 144 (jsdom) |
| crypto.test.ts | 25 |
| avatar.test.ts | 33 |
| fileapi.test.ts | 79 |
| editor.test.ts | 67 |

## Completed Sprints

### Sprint 1 — RawBin Foundation
- T3-T5: room.test.ts, server.test.ts, client.test.ts

### Sprint 2 — Identity & SSH
- T7-T12: profile.test.ts, userkeys.test.ts (SSH+device+challenge)

### Sprint 3 — E2E Hardening
- T14: Refactored to unit tests. T16: deployment. T20: chat.test.ts

### Sprint 4 — Traceability
- T23-T25: Audited 28 task files — audit-report.md

### Sprint 5 — PWA Offline
- T31-T36: pwa.test.ts, offline.test.ts
- Found update banner bug (silent version swallow) — fixed v0.2.4
- Found lobby notch bug (padding:0 killed safe-area) — fixed v0.2.12

### Sprint 6 — Web Components
- T39-T46: components.test.ts (rb-overlay, banner, header, chat, members, qr, server pages)

### Sprint 7 — Encrypted Storage + Avatars
- T47: crypto.test.ts — AES-256-GCM + RSA hybrid encryption
- T48-T53: avatar.test.ts — upload, serve, ETag, profile URL, room avatars
- T54-T57: Avatar fixes — PDCA percentage crop, reactivity, propagation

### Sprint 8 — Monaco Editor
- T60-T61: fileapi.test.ts — readDir, readFile, writeFile, conflict detection
- T62: Security tests — path sanitization (node_modules, .git, data/users), authorization
- T63-T70: editor.test.ts — edit.html, edit.ts, rb-editor-layout, rb-file-tree, rb-code-editor, rb-preview, save handler, rb-editor-toolbar
- T71-T72: Mobile responsive layout, /md/↔/edit/ cross-links
- T73: Standing by for expert E2E results

## Known Issues
- 2 vitest FAIL: /md/ pages don't have /edit/ cross-links yet
- Playwright E2E: stale selectors from Sprint 6 component refactor + server dependency
- avatarCache still in server.ts (expert must remove)

## Rules (Eternal)
- P15: NEVER filter output
- I do NOT implement features — I test, verify, find bugs, report
- Expert does not test — tester owns test execution
- Unit test handler logic directly — no server dependency for vitest
- ALWAYS visually verify with Playwright — code review alone is NOT verification
- Self-report to robbinTeam:0.0 when task complete
- TaskCreate before starting, TaskUpdate when done
- Commit agent files after every save
