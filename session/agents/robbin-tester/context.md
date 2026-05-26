# robbin-tester Context — 2026-05-25

## Identity
**robbin-tester** — testing authority for Web4RawBin. Pane robbinTeam:0.3.

## Team Layout (robbinTeam) — CORRECTED 2026-05-25 by PO
- 0.0 = robbin-po | 0.1 = robbin-architect | 0.2 = robbin-expert
- 0.3 = ME (robbin-tester) | 0.4 = robbin-expert-shell | 0.5 = robbin-tester-shell
- **CRITICAL: I am at 0.3. A /compact must target 0.3, NEVER 0.4 (that's expert-shell).**

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

## QUEUED POST-COMPACT JOB (PO assigned 2026-05-25)
1. **T80 verify (v0.4.7)** — independently re-run FULL Playwright suite: `npx playwright test --reporter=line`. Expert shipped one-shot onSave fix, self-reported 21/21. MY confirmation is the gate before Tron QA. Target: 21/21 (the 2 prior fails were device-enrollment + new-user own-enrollment-code).
2. **T78 verify (v0.4.8, commit f5d7df4 — READY)** — verify: (1) lobby room cards show full UUID + 💾 Persistent badge (.room-persist) + owner attribution ('you' / 'by <name>'); (2) full E2E stays 21/21 no regression. NEW .room-persist badge + .room-owner/.room-id CSS stubs. Note: /api/health says 0.4.7 until iphone:0.1 restart (PO-gated) but running server serves new bundle (build-manifest per-request).
3. **T81 verify (v0.4.9, commit f083a29 — READY)** — task file: `scrum.pmo/sprints/sprint-10-contacts-ui/task-81-member-click-vcard.md`. Run TS1-TS5 + full-suite regression:
   - TS1: tap member name/avatar/status → opens contact sheet
   - TS2: avatar tap does NOT open editor (readonly on member badges)
   - TS3: self-tap opens ProfileEditor
   - TS4: exactly 1 GET_USER_INFO per tap (listeners attach once, no stacking)
   - TS5: editable avatars (own profile editor) unaffected
   Impl: USER_INFO key fix msg.user, rb-avatar readonly on member badges, listeners-attach-once.
4. **T84 verify (v0.4.10, commit 24482f7 — READY)** — task file: `scrum.pmo/sprints/sprint-12-editor-fixes/task-84-editor-back-button.md`. Editor back button derives parent dir from this._path. Test page is /edit/<path>, change in EDITOR bundle (edit-SZJS7HJV.js):
   - TS1: deep file a/b/c.md → back goes /md/a/b/
   - TS2: root file README.md → back goes /md/ (guarded, no //)
   - TS3: label is '← Back'
   - TS4: 📂 still points to /md/
- Run from `/Users/Shared/Workspaces/AI/Claude/workspaces/Web4RawBin/`

## Known Issues
- 2 E2E specs (device-enrollment, new-user) have own enrollment code, #de-submit disabled
- Playwright shadow DOM <img> screenshots unreliable — verify with curl
- avatarCache may still be in server.ts

## Rules (Eternal)
- **CMM4 (SM directive 2026-05-26): communicate through task files, not ad-hoc messages.** Write findings/status/handoffs INTO the task file (e.g. task-NN's QA/results section). Read task files before asking questions. Task files = single source of truth. otmux pings are pointers, not the record.
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
