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

## T166-T172 Data Quality Learnings (2026-06-02/03)

### /api/trace overlay pattern (T163/T166)
scanRepo() builds the base graph from markdown. Scenario index supplements it.
T163: title overlay (model.name). T166: create Class+Method graph objects via
makeObject(). Always after scanRepo, never replace it.

### Forward-ref population is the KEY to reachability
The chain breaks at the FIRST missing forward hop. T172 showed: 55 Requirements
existed but only 2 Tasks were in their tasks[]. Fix: populate forward arrays at
EVERY hop (req.tasks, task.useCases, uc.classes, class.methods). Sprint→Requirement
ownerIor mapping + sprint-level task assignment covers the gap.

### Audit must walk from Requirement roots ONLY (strict)
Walking from Sprint roots inflates reachability (Sprint.tasks[] catches everything).
Strict = Requirement roots only. Sprints and TraceLinks = orphan-by-design.

### Synthetic requirements for pre-traceability sprints
Sprint 1 (pre-traceability era) has no requirements.md. Create a synthetic
Requirement unit to link its tasks into the chain. Same pattern for any sprint
lacking formal requirements.

### CI gates: npm run ci:gates
trace:audit:strict (orphans + back-refs + cardinality) && rule-pair:strict
(package.json + sw.js bump when user-facing files change). Both must pass.

### T167 mobile layout: .trace-page flex container
Desktop ≥1025px: flex split (tree left, drawer right 480px cap static).
Mobile ≤480px: single-column, drawer = fixed bottom overlay 60vh.
Drawer inside .trace-page (not body) for desktop split to work.

## T142-T156 Learnings (2026-06-01)

### DRY-RUN discipline for data migrations (T151 pattern)
Always dry-run first, report per-item counts, refine until 0 mismatches, THEN
apply. AC hard-FAIL gates (e.g. 815/815 exact) catch parser gaps before data loss.

### findTaskBySlug: prefix fallback for wrong slugs
requirements.md sometimes references wrong file slugs (task-127-ior-resolver vs
task-127-navigation). Fallback: match by task-number prefix (task-127-*).

### populateReqAltIds: R-number on line BEFORE uuid tag
requirements.md format: **R17.1: Title** on one line, [requirement:uuid:] on next.
Parser must look back 1-2 lines from the uuid tag, not forward from it.

### Multi-pass migration order matters
T153 altIds must be written to index BEFORE fixUcDataQuality can resolve R-refs.
In dry-run mode, both passes see stale data. Apply altIds first, then quality fix.

### Per-class symlink subdirs (T149)
sprints.json/<sprint>/<class-dir>/<slug>.json replaces flat layout. scenarioLink
helper must scan both flat (backward compat) and class subdirs.

### SlugResolver for template chain links (T143 AC2)
setActiveResolver() injects ScenarioIndex-backed resolver into templates module.
Without it, chain links render bare UUIDs → 404. Generator sets resolver before
rendering. Module-level state (not ideal but backward-compatible).

### Requirement data quality pipeline (T153→T154→T155)
T153: altId + UC class/req refs. T154: name/description/tasks from requirements.md.
T155: bidirectional closure (reverse-scan tasks + test coverage). Each builds on
the previous pass's data. Run in order.

## T166-T175 Learnings (2026-06-02/03)

### /scenario?ior= vs /trace: two distinct entry points
/trace: full requirement-rooted tree via setGraph(). /scenario?ior=<uuid>: single
instance as root via data-seed-ior + renderSeed(). Both reuse the same components
(rb-trace-tree, rb-detail-drawer, TraceRouter) but seed differently.

### scanRepo fallback for /api/trace/children
Scenario index forward arrays may be empty (strings not UUID[]). The children
endpoint must fall back to scanRepo graph when no UUID refs found. Bridge pattern
until migration forward-refs are complete.

### filepath = req.url.split('?')[0]
Server filepath MUST strip query params before route matching. Without this,
/trace?ior=X doesn't match '/trace' → falls through to static file → 404.

### .scenario.json click → /scenario?ior= (not /md/)
jsonHref() + /md/ 302 redirect both target /scenario?ior=<uuid>. realpathSync
resolves symlinks to extract UUID from the target .scenario.json filename.

### rAF-based timing for auto-navigate after tree render
Don't use setTimeout for graph-dependent navigation. Use requestAnimationFrame
loop waiting for the target element to exist in DOM. Graph type lookup via
graph.get(uuid).type is more reliable than API response data.

### Expand state per seed IOR (R-N2)
/scenario localStorage key = rawbin-scenario-expanded-<ior>. Separate from
/trace's rawbin-trace-expanded. buildSeedNode reads/writes on toggle-children.

### Tree base on TraceObject (T175)
parent/children/hasChildren/isRoot/isLeaf as getters using LOCKED chain
forward-only scan. parent() scans all objects of the above-type whose forward-ref
includes this.uuid. children() resolves forward refs to next chain hop type.
Added directly to TraceObject (not separate class hierarchy) — simpler.

### STATIC_SHELL must track ALL client bundle hashes
Every build that changes trace-page or scenario-view bundles produces new hashes.
STATIC_SHELL must be updated in the SAME commit. Check build-manifest.json after
every npm run build and update sw.js if hashes changed.

## T178-T191 Deep Chain + Narrowing Learnings (2026-06-04/05)

### Query params stripped from filepath at line 327
server.ts: `let filepath = (req.url || '/').split('?')[0]` at the TOP of handleRequest.
Any handler that reads query params MUST use `req.url`, NOT `filepath`. The mode=trace
bug was caused by reading `filepath.includes('?')` which is always false.

### ScenarioIndex legacy path fallback
12 scenario units created before the 5-level layout change sit at
`scenario/index/<5char>/<uuid>.scenario.json` (flat). The current `prefixPath()` builds
`<c1>/<c2>/<c3>/<c4>/<c5>`. `filePath()` must check new-format first, fall back to
legacy 5-char flat. Without this fallback, `get()` returns null for old units.

### clients.claim() breaks SW activation
v0.5.78 added `self.clients.claim()` in SW activate handler. Combined with old-cache
deletion, creates a race: new SW claims tabs BEFORE cache populated → fetch fails →
offline page. v0.5.79 removed it. SW now activates passively (takes over on next
navigation). The winning pattern: skipWaiting on message + passive activate (no claim).

### build.mjs auto-injects STATIC_SHELL
build.mjs now writes hashed bundle names (app + trace-page + scenario-view) directly
into sw.js STATIC_SHELL at build time. Can never go stale. Removed the fragile
manifest-fetch + /dist/app.js fallback from SW install handler.

### CDP Security.setIgnoreCertificateErrors for SW E2E
Playwright's `ignoreHTTPSErrors: true` handles page navigation but NOT SW registration
(secure context requirement). CDP `Security.setIgnoreCertificateErrors` via
`page.context().newCDPSession(page)` enables SW.register() over self-signed HTTPS.
Combined with `--ignore-certificate-errors` launch arg.

### Forward-only at TWO layers (defense-in-depth)
1. Server (T184): `/api/trace` strips backward keys using FORWARD_KEYS map
2. Client (T181): forward-only.ts `forwardOnly(obj)` filter on all 8 DetailViews
Both layers use the same FORWARD_KEYS constant from TraceModel.ts.

### Chain narrowing: two modes, same chain
SCENARIO_FORWARD: UC→classes[]→Class.methods[] (fan-out all methods)
TRACE_FORWARD: UC→method (singular), Method→implementation (singular)
Divergence ONLY at UC→Method hop. Navigation layer (Sprint→Task→UC) identical both.
Tree component passes `data-mode` attribute → `modeParam` on fetch calls.

### Let's Encrypt cert auto-detect
server.ts checks /etc/letsencrypt/live/<domain>/fullchain.pem at startup.
If present → LE cert. If absent → self-signed fallback. LE_DOMAIN env var overrides.
Startup log shows which cert source is active.

### Task→UC fill from PUML
PUML <<UseCase>> blocks have `task: Tnnn` — parse with regex, match T-number to task
slugs in scenario index. S16 PUML yielded 15 links. S17 UCs owned by Sprint (not Task)
need explicit Task→UC mapping.

### Bridge Implementation pattern
When [impl:uuid:] shares UUID with a Task (S14/S15 convention), create a DEDICATED
Implementation unit with a fresh UUID. Link it to a reachable Method. Otherwise the
Test→Impl→Method chain breaks because the "impl" is actually a Task.

### Skill manifest foundation
4 skills exist in src/ts/scenario/skills.ts (T138): captureQuote, proposeTask,
walkChain, statusTransition. All tested. Not yet exposed via API or .skill manifests.
Next: ior:class:Skill scenario units with parameter schemas + impl IOR tracing.

## Session 3 Learnings (2026-06-07/08)

### Source link filter: suppress .scenario.json sourceFiles
Many conceptual units (bridge impls, abstract classes, TraceLinks) have
sourceFile pointing to their own .scenario.json — not a real .ts source.
Server must filter: if sourceFile contains `.scenario.json`, suppress it.
Only real .ts/.puml files should generate Browse/Monaco links.

### Sprint objects not in TraceModel graph
Sprint units exist in scenario index but NOT in the /api/trace graph
(scanRepo only produces Requirement/Task/UC/Class/Method/Impl/Test).
rb-detail-view must fall back to fetchDetailData() when graph.get()
returns null — otherwise Sprint detail shows "object not found" and
never renders children.

### IOR normalization: 3 forms everywhere
Every IOR entry point (client ?ior= param, renderSeed attribute,
/api/trace/children endpoint, IORResolver) must handle all 3 forms:
bare UUID, ior:instance:UUID, UUID.scenario.json. Strip prefix/suffix
before use. The normalize() helper in ior-resolver.ts is the canonical
implementation; client-side uses inline .replace() chains.

### T176: ignoreHTTPSErrors handles ES modules
Playwright's ignoreHTTPSErrors:true (already in config) successfully
handles type=module script loading over self-signed HTTPS. No cert
workaround (HTTP fallback, mkcert) needed. R-O was not a systemic issue.

### R18.29-31: unitLinks[] atomic symlink lifecycle
model.unitLinks[] declares symlink paths relative to scenario/ root.
put() auto-syncs: if unitLinks[] present, calls syncLinks() which
creates/updates all declared symlinks. addLink/removeLink mutate both
the JSON and the on-disk symlink atomically. scenarioRoot = path.dirname(basePath).
Backfill: read existing symlinks → readlinkSync → extract UUID → populate unitLinks[].
267/282 symlinks backfilled (15 orphans skipped).
