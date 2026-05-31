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

### BUG: Avatar stacking — img + initial both rendered (v0.3.17)
img and initial span both existed at 100% in position:relative container — initial
rendered on top of/behind broken img. Fix: initial-first approach. img starts
display:none, gets `.loaded` class on img.onload event. CSS: `.circle img.loaded
{ display:block }` + `.circle img.loaded + .initial { display:none }` (adjacent
sibling). img.onerror removes img entirely. Race handled: if img.complete &&
naturalWidth>0 before listener attaches, add .loaded immediately.

### BUG: Avatar SVG fallback stuck forever (v0.3.18)
ensureAvatar returned early if profile.avatar started with /api/avatar/ — so once
the initials-SVG fallback was stored (when thispersondoesnotexist fetch failed),
it never retried the photo. Fix: decrypt existing avatar, check mimeType; if
image/svg+xml, retry photo fetch. node-fetch v3 is ESM-only — works in server
(import) but CJS require() fails. The fetch itself works fine, failures are network.

### BUG: Avatar GET cached stale (v0.3.18)
GET /api/avatar served Cache-Control: max-age=3600 — browser cached old avatar
after upload. Fix: no-cache, must-revalidate + ETag (MD5 of .enc) → 304 when same.

## Avatar Pipeline (Tron directive) — full
- POST /api/avatar { playerToken, data(base64), mimeType } → requires tokenToClient.has(token)
  (active WS session) → encryptFile(token, buf, mimeType, `avatar.<ext>`, 'avatar')
  → profile.avatar = /api/avatar/<token>
- GET /api/avatar/<token> → decryptFile(token, 'avatar') → serves with mimeType, no-cache, ETag
- encryptFile writes data/users/<token>/files/avatar.enc + avatar.meta.json (AES-256-GCM,
  AES key RSA-encrypted with user pubkey). writeFileSync DOES overwrite.
- rb-avatar getAvatarUrl() falls back to /api/avatar/<token> from token attr when src empty
- Cache-bust client URL with ?t=Date.now() after upload
- Global refresh: window 'rb-avatar-updated' {token, url, crop} event

## Room Identity (Sprint 9, T74)
- Rooms are per-user persistent SSH identities, NOT ephemeral global rooms
- RoomKeys.ts mirrors UserKeys.ts pattern but scoped to data/users/<token>/rooms/<uuid>/
- Room.id is FULL crypto.randomUUID() (not .slice(0,8))
- Room.creatorToken = persistent user token (NOT clientId which is ephemeral)
- CREATE_ROOM: createRoomHome → generateRoomKeypair → writeRoomJson, default name profile.name+"'s Room"
- Startup: scanAllRooms() walks data/users/*/rooms/*/room.json, registers each
- Requires sshKeysGenerated on owner profile before room creation
- room.json: {id, name, ownerToken, maxMembers, isPrivate, roomKey, state, createdAt, sshKeysGenerated, sshPublicKey, chatHistory}

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

### otmux send: NO backticks in the message text (shell command substitution)
`otmux send <pane> "...message..."` runs through Bash. Backticks in the double-quoted
message (e.g. a code-ish `npm run migrate` or `data/x.json`) trigger command substitution
in MY shell — the backtick span executes as a command (harmless ENOENT in the wrong cwd here,
but it COULD run something) and the delivered text is mangled. Rule: write otmux messages
WITHOUT backticks (use plain words or single quotes), and verify with pane.capture after.

### CMM4: task file is the single source of truth (SM directive 2026-05-26)
Write findings, status, and handoffs INTO the task file (scrum.pmo/sprints/.../task-NN.md
Implementation + Status sections), not ad-hoc otmux chat. Read the task file before
asking questions. otmux send is for routing/notification only (\"T84 done, see file\") —
the substance (what changed, AC results, audit, version) lives in the file so it survives
compact and any agent can pick it up. I already add Implementation sections per task; keep
doing that, and keep otmux reports thin pointers to the file.

### Self-report format
PO expects: task number, subtask summary, line counts, test results. Always include
clean tsc, build size, and test pass counts. Report to robbinTeam:0.0 via otmux send
(thin pointer — full detail in the task file per CMM4 directive above).

### Compile check before reporting
Always run `npx tsc --noEmit --strict --skipLibCheck` on server files and `npm run build`
for client before reporting. Stale type errors from other files can sneak in.

### Server must be restarted for changes
tsx watch auto-restarts on file changes, but verify with curl to /api/health or /api/config.
Playwright uses `reuseExistingServer: true` — connects to whatever is running on port 4444.

### Deploy flow
bump version in package.json → npm run build → git commit → git push → restart iphone:0.1
via otmux send. Verify server started with otmux pane.capture iphone:0.1.

## S17 Scenario Unit Learnings (2026-05-30/31)

### IOR = Class Loader, NOT Instance ID
The outer `ior` field in a scenario unit is `ior:class:Task` (class loader reference).
Instance identity is `model.uuid`. Owner is `ownerIor: ior:instance:<parent-uuid>`.
Never conflate ior with uuid.

### 5-level deep index (Tron directive)
scenario/index/<c1>/<c2>/<c3>/<c4>/<c5>/<uuid>.scenario.json — each of first 5
UUID hex chars (hyphens stripped) is its own directory level. prefixPath() returns
e.g. 'a/7/f/3/c'. list() must walk recursively.

### Speaking-name filenames for generated views
Generated .md/.html use slug from model.slug (task-1-team-bootstrap.md), NOT uuid.md.
Symlinks in sprints.json/ already use speaking names. Links in planning.md use
speaking-name paths (../task/task-1-team-bootstrap.md).

### Children IOR inferred from slug pattern
Migration script infers parent-child from task numbering: task-3 → task-3.4,
task-1 → task-1.1/1.2/1.3, task-124 → task-124.1/.2/.3. The regex matches
`taskNum + '.' + single-level-suffix`.

### Planning.md dedup: children only nested, never flat
If a task is referenced as a child of another task, skip it from the flat top-level
list — emit it ONLY nested under its parent. Prevents double-listing.

### Symlink visibility in file browser
Node's readdirSync({ withFileTypes: true }) returns isFile()=false, isDirectory()=false
for symlinks. Must check isSymbolicLink() separately, then statSync the target to
determine type. Both FileApi.ts (readDir) and server.ts (/md/ handler) need this.

### Version bump rule-pair #15/#16
Every surface change bumps package.json + sw.js CACHE_NAME (#15). STATIC_SHELL (#16)
updated only when trace-page bundle hash changes or new SPA route added.
No new route = STATIC_SHELL exempt. Server-side-only/tooling changes = no bump.

### Standing rule: planner stands up T-numbers first
Do NOT use PO harness numbers (#nn) as T-numbers. Wait for planner's task file
with official T-number before building. Ask for T-number if routed without one.

## T140-T141 Source + Chain Learnings (2026-05-31)

### Source location: git anchor at migration time
`getFileCommit(file, cwd)` via `git log --format=%h -1 -- <file>`. Pin content to
exact SHA so line ranges stay valid even after refactoring. IOR format:
`ior:file:<path>?commit=<sha>&lines=<start>-<end>`.

### extractPumlUseCaseRanges: brace-depth tracking
Can't just find the next `}` — need to track depth for nested braces inside
UseCase bodies. Same pattern for extractTsClassRanges and extractTsMethodRanges.

### renderChainSection: IOR field convention
All 7 class models use the same field names for IOR arrays: requirements, tasks,
useCases, classes, methods, implementations, tests, children. The shared helper
walks all 8 fields uniformly — no per-class special casing.

### renderStatusHtml: 2-space indent + filter non-checkbox lines
Web4Articles uses 2-space indent for nested sub-steps (not 4). Must skip lines
starting with `>` (blockquotes) and lines without `[x]`/`[ ]` (not checklist items).

### T132-T141 velocity pattern
Small focused tasks (T132 ~25 lines, T133 ~60, T134 ~80, T138 ~160, T140 ~90,
T141 ~40 template change) commit fast when architect design is precise. Key:
read the spec fully before coding, implement exactly per design, no scope creep.

### Re-generation after template changes
Every template change requires re-running `migrate-to-scenario.ts` on all
migrated sprints to update on-disk views. Stale views = Tron sees old rendering.
Always re-generate + commit the scenario/ dir after template modifications.

### impl:uuid markers: NEVER bare * outside JSDoc (esbuild crash)
`sed -i '' "2a\\ * [impl:uuid:...]"` inserts a bare ` * ` line. If the file
doesn't start with `/** */`, this lands INSIDE code and esbuild treats `[` as
a computed property → parse error → build crash → server down.
Rule: ALWAYS use `// [impl:uuid:...]` for files starting with code/imports.
Only use ` * [impl:uuid:]` inside an existing `/** */` JSDoc block.

### iphone:0.1 pane: narrow + scrollback obscures output
The iphone tmux pane is ~30 chars wide. Crash traces fill the entire visible
buffer. `otmux pane.capture` only returns the VISIBLE last N lines — if those
are all scrollback from an error, you can't see your command output even though
commands ARE executing. Fix: send `clear` or `C-l` THEN capture. Or use the
expert shell pane instead for server operations.

### Server restart after dirty working tree
`git pull` fails silently if working tree is dirty. Always `git checkout -- .`
or `git stash` BEFORE pull when restarting a crashed server. The crash state
often leaves uncommitted changes from the running tsx process.
