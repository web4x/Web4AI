# robbin-tester Learnings — 2026-05-23

## Test Architecture Patterns

### Unit test handler logic, not integration
- Extract switch/case handler logic as standalone functions
- Pass mock Map<string, Profile>, mock send function, mock tokenToClient
- Tests run in <5s, no server dependency, reliable CI
- Integration tests (WS to running server) belong in Playwright E2E, not vitest

### Room.ts testing pattern
- Import Room and RoomManager directly
- mockWs(open=true) returns { send: vi.fn(), readyState: 1|3, ... }
- makeMember(name) creates RoomMember with mock ws
- getSentMessages(ws) parses all ws.send mock calls
- clearMock(ws) before assertions to avoid MEMBER_JOINED noise from addMember

### File system testing
- Use os.tmpdir() + fs.mkdtempSync for temp dirs
- Clean up in afterEach with fs.rmSync(recursive, force)
- Check permissions with (stat.mode & 0o777)
- PEM keys are multi-line — don't split authorized_keys by \n and count lines; use .includes() on full content

### Key API Mismatches Discovered
- addChatMessage → addChat (3 args: senderId, senderName, text)
- Room constructor doesn't send ROOM_JOINED — addMember does
- addMember returns false on rejection (not throw)
- RoomManager(persistDir) takes string, not { dataDir } object
- broadcast checks ws.readyState === 1, not member.disconnected flag
- Server port changed from 3443 → 4444

## Test Coverage Strategy

### What to test per task
1. Happy path — expected behavior works
2. Error path — invalid input rejected correctly
3. Edge cases — empty strings, missing fields, boundary values
4. Privacy — other users can't see private data (secretCode, devices, bugReports)
5. Persistence — data survives across reconnects/operations
6. Idempotency — calling twice doesn't break things

### it.each for route/message type validation
- Compact way to test many similar cases
- `it.each(REMOVED_WS_TYPES)('%s is removed', (type) => ...)`
- Generates one test per item in array

## Sprint Audit Process (T23-T25)

### What to check per task file
1. Status field matches actual (PLANNED → DONE)
2. Acceptance criteria checkboxes: `- [ ]` should be `- [x]` for DONE tasks
3. Completed date field present
4. Cross-references (./planning.md, ./task-N.md) resolve to existing files
5. No missing sections (every DONE task needs AC)

### Common findings
- Status gets updated to DONE but AC boxes left unchecked (23/28 files)
- Completed date universally missing — needs template enforcement
- Subtask filenames get renamed but parent links not updated

## Communication Pattern
- Self-report format: `[@robbin-tester → robbin-po] Task XX DONE — [count] tests, [describe blocks], [pass/fail]. [key coverage areas]. Standing by.`
- Always include test count, pass/fail ratio, duration
- List expert-side failures separately from tester-side

## jsdom for Web Component tests
- components.test.ts uses `@vitest-environment jsdom` (file-level docblock)
- Required for document.createElement, shadow DOM, CustomEvent
- Install: npm install -D jsdom

## Playwright shadow DOM limitation (CRITICAL)
- Playwright headless Chromium does NOT reliably paint <img> inside shadow DOM in screenshots
- The img element loads correctly (DOM reports loaded class, display:block, opacity:1) but screenshot shows fallback
- VERIFY actual image bytes with curl, not just screenshots: `curl -sk /api/avatar/<token> -o /tmp/x.png && file /tmp/x.png`
- Cross-check DOM state (img.naturalWidth, classList) against visual — they can disagree
- When visual fails but DOM+curl pass: it's a Playwright rendering bug, recommend real-device verification

## Avatar verification lesson (Tron correction)
- NEVER verify with a 10x10 stub image — use real 200x200+ photo
- Generate valid PNG programmatically with zlib.deflateSync + CRC32 chunks if canvas module unavailable
- The default avatar (initials PNG) is 817 bytes — a real uploaded photo is larger; size is a quick discriminator
- Upload persistence: POST /api/avatar returns 200 but verify GET serves the NEW bytes, not the old default

## Playwright E2E gotchas
- ES module spec: no __dirname — use `path.dirname(fileURLToPath(import.meta.url))`
- ensureLobby helper captures #pe-code BEFORE save, but server assigns NEW secretCode on IDENTIFY → enrollment #de-submit stays disabled
- Specs with their OWN enrollment code (device-enrollment, new-user) break independently of the shared helper
- Create-room form: don't blind-fill #room-name='' — check if create form visible first, default name auto-fills

## E2E disk verification pattern
- Verify server-side state on disk after Playwright actions: data/users/<token>/rooms/<uuid>/
- Read localStorage token via page.evaluate(() => localStorage.getItem('rawbin-player-id'))
- Commit test files only — NOT test-results/ (Playwright artifacts) or data/*.json (test pollution)

## Sprint progress (as of 2026-05-25)
- 14 vitest files, 701 unit tests; ~21 Playwright E2E (19 pass)
- Sprints 1-9 complete. Latest: T79 room identity (committed c43cbc8)
- Version 0.4.6
