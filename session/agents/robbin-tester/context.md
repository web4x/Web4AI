# robbin-tester Context — 2026-05-25

## Identity
**robbin-tester** — testing authority for Web4RawBin. Pane robbinTeam:0.3.

## Team Layout (robbinTeam)
- 0.0 = robbin-po | 0.1 = robbin-architect | 0.2 = robbin-expert
- 0.3 = robbin-expert-shell | 0.4 = ME (robbin-tester) | 0.5 = robbin-tester-shell

## Base Paths
- Project root: `/Users/Shared/Workspaces/AI/Claude/workspaces/Web4RawBin/`
- Server: `src/ts/server/` (server.ts, Room.ts, UserKeys.ts, UserCrypto.ts, FileApi.ts)
- Client: `src/public/ts/` + `src/public/ts/components/` (13 rb-* web components)
- Tests: `test/vitest/` (14 files) + `test/e2e/` (Playwright specs)
- Scrum: `scrum.pmo/sprints/`
- Server port: HTTPS 4444
- Version: 0.4.6

## Test Suite Status
- **701 vitest unit tests** across 14 files (1 pre-existing cleanupStale flaky)
- **Playwright E2E**: 19/21 PASS
- Duration: vitest ~7s

### Vitest Files
room.test.ts(33), server.test.ts(56), client.test.ts(22), profile.test.ts(22),
userkeys.test.ts(61), chat.test.ts(18), pwa.test.ts(40), offline.test.ts(30),
components.test.ts(144, jsdom), crypto.test.ts(25), avatar.test.ts(33),
fileapi.test.ts(79), editor.test.ts(?), room-identity.test.ts(70)

### E2E Specs (test/e2e/)
device-enrollment, editor(9/9), mobile-viewport, negative-cases, new-user,
profile-editor, room-identity(6/6), room-lifecycle
- 2 FAIL: device-enrollment + new-user (own enrollment code, #de-submit disabled — not using fixed ensureLobby)

## Sprints Complete (1-9)
- S1 Foundation: room/server/client tests
- S2 Identity/SSH: profile, userkeys (SSH+device+challenge)
- S3 E2E Hardening: refactor to unit, deployment, chat
- S4 Traceability: audited 28 task files
- S5 PWA Offline: pwa, offline tests; found update banner bug
- S6 Web Components: components.test.ts; found lobby notch bug
- S7 Encrypted Storage+Avatars: crypto, avatar tests; found avatar upload persistence bug (fixed v0.3.19)
- S8 Monaco Editor: fileapi, editor tests (security + authorization)
- S9 Room Identity: room-identity.test.ts (70) + room-identity.spec.ts (6/6) — committed c43cbc8

## Test Architecture
- ALL vitest = unit tests, no server dependency
- Handler logic extracted, tested with mock Maps + mock send
- Room class tested via direct import
- File system tests use temp dirs (os.tmpdir)
- Crypto: real RSA-2048 + AES-256-GCM
- Components: jsdom environment
- Playwright: visual verification 375x812 + disk verification

## Known Issues
- 2 E2E specs (device-enrollment, new-user) have own enrollment code, #de-submit disabled
- Playwright shadow DOM <img> screenshots unreliable — verify with curl
- avatarCache may still be in server.ts

## Rules (Eternal)
- P15: NEVER filter output (no 2>/dev/null, | head, | tail, | grep)
- I do NOT implement features — I test, verify, find bugs, report. Implementation = expert.
- Expert does not test — tester owns test execution
- Unit test handler logic directly — no server dependency for vitest
- ALWAYS visually verify with Playwright AND curl — code review/DOM alone is NOT verification
- NEVER verify avatar with stub image — use real 200x200+ photo
- Self-report to robbinTeam:0.0 when task complete
- TaskCreate before starting, TaskUpdate when done
- Commit agent files after every save; commit test files NOT test-results/ or data/*.json
- NEVER ASSUME — ALWAYS MEASURE (run claudeCode context.read before panicking)
