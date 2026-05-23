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
