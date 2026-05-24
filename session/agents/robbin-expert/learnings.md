# robbin-expert Learnings — 2026-05-22/23/24

## Architecture Decisions

### Room.ts API: RoomMember objects, not separate args
Room constructor and addMember take RoomMember objects. Tests written against this API.
Constructor auto-adds creator to members Map — does NOT call addMember. This means
no ROOM_JOINED is sent from the constructor. Server must send ROOM_JOINED explicitly
after roomManager.createRoom().

### Dual auth: token + device keys
IDENTIFY sets authMethod='token'. DEVICE_AUTH with signed challenge sets authMethod='device-key'.
Both coexist — no breaking change. Challenge is single-use (consumed after verify).

### Profile gate blocks room entry
Server guards: CREATE_ROOM and JOIN_ROOM reject with 'Profile required' if !profileCommitted.
Client flow: connect → IDENTIFY → PROFILE → if !committed → gate → UPDATE_PROFILE → committed.

### Separate data stores
profiles.json: identity + bugs only. devices.json: device records with ownerToken FK.
PROFILE response only includes requesting user's own devices.

### Avatar pipeline: encrypted storage + token-based URL
POST /api/avatar → encryptFile → profile.avatar = /api/avatar/<token>. GET decrypts and serves.
rb-avatar component MUST use getAvatarUrl() which falls back to /api/avatar/<token> from token
attribute when src is not yet set. Never use base64/localStorage for avatar display.

## Bugs Found & Fixed

### BUG: Room constructor doesn't send ROOM_JOINED (T17 root cause)
Room constructor adds creator via `this.members.set()` bypassing `addMember()`.
No ROOM_JOINED message sent. Server CREATE_ROOM handler now explicitly sends:
`room.sendTo(clientId, { type: MSG.ROOM_JOINED, room: room.info(), members: [...] })`

### BUG: Silent exception swallowing
`try { handleMessage(...) } catch {}` silently drops all WS handler errors.
Fixed to: `catch (e) { addLog('WS handler error: ' + e?.message) }`

### BUG: E2E gate→enrollment→room flow
Page reloads between gate and room created new WS connections with new clientIds.
Token→client mapping became stale. Fix: single-session flow — read secretCode from
gate's #pe-code input, use it for enrollment dialog, no page.goto between steps.

### BUG: cleanupStale(0) — age > 0 fails for just-created rooms
`now - room.createdAt > maxAgeMs` with maxAgeMs=0 returns false (0 > 0 is false).
Fixed to `>=`.

### BUG: roomKey reference after Room.ts rewrite
Room.ts dropped roomKey as public property. JOIN_ROOM handler still referenced it.
Fixed: simplified to `if (room.isPrivate)` check without key comparison.

### BUG: Avatar lobby semicircle (v0.3.15)
Root cause: `.circle` was `display:flex` which combined with parent flex container
could collapse or misalign the avatar. Also `transform:scale()` on crop pushed image
outside `overflow:hidden`. Fix:
- Changed `.circle` to `display:block; position:relative`
- Added `display:block` to `.circle img`
- Added `flex-shrink:0` to `:host` to prevent flex container squishing
- Removed `transform:scale` from crop — only `object-position` now

### BUG: Avatar overlay showing initial letter instead of photo (v0.3.15)
Root cause: race condition — `openOverlay()` read `getSrc()` which returns the `src`
attribute value. When the lobby renders before the profile arrives, src="" and was never
updated before the user clicked. Fix: `getAvatarUrl()` falls back to `/api/avatar/<token>`
when src is empty but token attribute is set. Used in both render() and openOverlay().

### BUG: Avatar upload stack overflow (v0.3.13)
`btoa(String.fromCharCode(...new Uint8Array(buf)))` crashes >10KB due to max call stack.
Fixed: loop-based binary string construction.

### BUG: iOS Safari label+file input (v0.3.13)
`<label>` wrapping `<input type=file>` doesn't trigger on iOS Safari in dynamic DOM.
Fixed: separate `<button>` with programmatic `fileInput.click()`.

### BUG: SW cache name static (v0.3.12)
CACHE_NAME was 'rawbin-v1' — never changed, old CSS cached forever.
Fixed: auto-stamped from package.json by build.mjs.

## Testing Patterns

### Playwright E2E: single-session flow is critical
Never use page.goto() between gate/enrollment/room creation. Each navigation creates
a new WS connection with new clientId. The profileCommitted guard works per-token
(survives navigations via localStorage) but enrollment dialog state doesn't.

### Playwright E2E: read secretCode from gate form
The profile gate form pre-fills #pe-code with the server-generated secret code.
The E2E helper reads this before clicking Save, then uses it in enrollment dialog.

### Playwright: sequential workers for stateful server
Set workers:1 in playwright.config.ts. Parallel tests create multiple users that
interfere with server state (stale rooms from other tests appear in room list).

### Playwright: use .first() for room card selectors
Multiple rooms accumulate across test runs. `.btn-join.first()` may join wrong room.
Use `.room-card` with `hasText` filter + `.first()`.

### Mock WS: readyState must be 1
Room.ts broadcast checks `ws.readyState === 1` (not WebSocket.OPEN constant).
Test mocks must set `readyState: 1` explicitly.

## OOSH Patterns

### Sprint CLI script structure
- `sprint.start()` sources `this`, calls `this.start "$@"` for method dispatch
- Methods: `sprint.methodName()` with OOSH comment format `# <args> # description`
- Use `console.log`, `warn.log`, `error.log` for output
- Return via `RESULT` variable
- `grep -c` with `| tail -1` to avoid multi-line output breaking integer comparison

### Sprint tool: dual-format status detection
Must handle both `**Status:** DONE` (flat) and `- [x] Done` (checklist) formats.
The `private.sprint.get.status()` helper tries flat grep first, falls back to checklist.

## Process Learnings

### Self-report format
PO expects: task number, subtask summary, line counts, test results. Always include
clean tsc, build size, and test pass counts. Report to robbinTeam:0.0 via otmux send.

### Compile check before reporting
Always run `npx tsc --noEmit --strict --skipLibCheck` on server files and `npm run build`
for client before reporting. Stale type errors from other files can sneak in.

### Server must be restarted for changes
tsx watch auto-restarts on file changes, but verify with curl to /api/health or /api/config.
Playwright uses `reuseExistingServer: true` — connects to whatever is running on port 4444.

### Deploy flow
bump version in package.json → npm run build → git commit → git push → restart iphone:0.1
via otmux send. Verify server started with otmux pane.capture iphone:0.1.
