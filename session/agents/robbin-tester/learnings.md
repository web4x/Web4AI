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

## reuseExistingServer:true LEAKS to prod (T100 AC4, learned the hard way 2026-05-26)
- Playwright `reuseExistingServer:true` reuses ANY server responding on the url — including a live prod-DATA_DIR server that (re)starts mid-run. webServer.env DATA_DIR is then IGNORED (only applies to a server PLaywright launches itself).
- Symptom: I ran the isolated suite (DATA_DIR=tmp), but the live server got restarted on 4444 during the run → Playwright reused it → 24 test rooms LEAKED to prod, tmp dir stayed EMPTY.
- FIX: for isolated runs set `reuseExistingServer:false` (gated on E2E_ISOLATED=1) so Playwright MUST own its server with DATA_DIR=tmp. AND the live server must stay DOWN for the whole run (no mid-run restart on the same port).
- Verify isolation BOTH ways: prod count byte-unchanged AND tmp dir actually populated. If tmp is empty after a "isolated" run, isolation did NOT engage — do not report pass.
- Deleting shared prod data to clean a leak is NOT tester authority — auto-classifier blocks it; expert owns the purge + backups. Report the leak, request re-purge.

## E2E disk verification pattern
- Verify server-side state on disk after Playwright actions: data/users/<token>/rooms/<uuid>/
- Read localStorage token via page.evaluate(() => localStorage.getItem('rawbin-player-id'))
- Commit test files only — NOT test-results/ (Playwright artifacts) or data/*.json (test pollution)

## Sprint progress (as of 2026-05-26)
- ~16 vitest files; Playwright E2E grew 21 → ~39 (added editor-back 4, lobby-card-badges 1, multi-room-lobby 4, contacts-ui 6, update-banner 3)
- Sprints 1-13 verified. v0.4.6 → v0.5.4 this session. Jobs T78/T80/T81/T82/T83/T84/T91/T92/T93/T94 all green.

## Environment: ONE checkout via symlink (CRITICAL)
- `/Users/Shared/Workspaces/AI/Claude/workspaces/Web4RawBin` is a SYMLINK → `/Users/Shared/Workspaces/2cuGitHub/Web4RawBin` (same inode). Not two checkouts. Playwright error paths / running server show the 2cuGitHub path — that's the same files.
- Running server is `tsx watch src/ts/server/server.ts` from 2cuGitHub. `reuseExistingServer:true` → Playwright reuses it.
- **tsx watch reloads on imported .ts changes, NOT package.json.** A version-only bump didn't reach /api/health until restart → stale version string. T94 fixed this with per-request `getVersion()` (reads package.json each request). Client bundles always current (built per-request). So for SERVER-side fixes, verify the running process has the code (or that a deploy restart happened — /api/health version is the tell); CLIENT bundle fixes are always live.

## Testing server-side fixes against REAL modules (T91/T92 pattern)
- DATA_DIR in UserKeys/UserCrypto is HARDCODED (`path.join(__dirname,'../../../data')`, __dirname via import.meta.url) — NOT env-overridable. Under vitest it resolves to the real `data/`.
- So: import the REAL UserKeys+UserCrypto, use a SYNTHETIC token (`T92TEST-<rand>`) under real data/, clean up in afterEach (`fs.rmSync(getUserHomeDir(token),{recursive,force})`). This exercises real RSA-2048 + AES-256-GCM, real key gen/regeneration, not a re-implementation.
- Replicate the exact handler body (e.g. server.ts POST /api/avatar:328-341) as a helper to test the self-heal sequence (createUserHome→generateUserKeypair→try encrypt/catch regenerateUserKeypair+retry). Assert byte-exact roundtrip (decryptFile(token,'avatar').data == uploaded) = the serve path's core (AC6).
- Avoid re-implementing logic in tests (the old avatar.test.ts copied functions — weaker). Import the shipped code.
- Auth gate `tokenToClient.has(playerToken)` needs a LIVE WS connection → can't curl POST /api/avatar without one. Unit-import path sidesteps this; note the HTTP wire as the one untested layer + recommend 1 live check.

## Live-server E2E on a SHARED server
- The deployed server has 100s of rooms (181→195 this session). Don't assert total counts.
- AC "count == disk" → verify as a SUBSET invariant: every on-disk room for the owner ∈ the lobby's `.room-card[data-room-id]`. Robust regardless of other users' rooms.
- Specs that create rooms pollute the shared server (same as room-identity specs); delete-tests clean their own; leftover empty rooms are dormant/harmless.

## vCard blob capture + WS frame counting
- Capture a download blob: hook `URL.createObjectURL` in page.evaluate before clicking; `if (obj instanceof Blob && obj.type==='text/vcard') obj.text().then(t=>window.__vcard=t)`. Wait after click (downloadVCard awaits an avatar fetch before createObjectURL).
- Count a specific WS message (no-stacking AC): `page.on('websocket', ws=>ws.on('framesent', f=>{ if (f.payload.includes('GET_USER_INFO')) count++ }))`. Reset counter right before the decisive tap; assert ==1 after re-rendering twice.

## Shadow-DOM component assertions
- rb-update-banner / rb-avatar overlay live in shadow DOM. Query via page.evaluate + `el.shadowRoot.getElementById(...)` for robustness (Playwright CSS also pierces, but evaluate is unambiguous).
- rb-member-badge + ProfileSheet are LIGHT DOM (innerHTML) → normal locators + `:has-text()` work.

## addInitScript clobbers localStorage on reload (T94 gotcha)
- `page.addInitScript(()=>localStorage.setItem(...))` re-runs on EVERY navigation — including a reload triggered by the code under test — overwriting what the handler wrote. For "click → reload → assert localStorage" tests, seed manually (goto, evaluate setItem, reload) instead of addInitScript.

## Superseded ACs across tasks
- When a later task INVERTS an earlier AC (T83 inverted T81 TS3: self-tap → ProfileEditor became → read-only .user-sheet), REPLACE the old assertion, don't keep it (it fails by design). Verify against the CURRENT behavior; mark the old AC `[~] SUPERSEDED by [Tnn]` in the task file.

## JSDoc inside Playwright E2E files (T118 CRITICAL)
- Playwright's Babel parser treats `*/` inside JSDoc as comment termination even when it's part of a glob path (e.g. `data/users/*/profile.json`). Also treats `/.*/` as a regex literal start.
- **FIX**: use single-line `//` comments in E2E helper files, NEVER multi-line JSDoc with glob paths or regex examples.
- This blocked ALL 40 E2E specs until fixed (commit 62b3e1a).

## pageNav is a div, not a nav element
- server.ts `pageNav()` renders a `<div>` with inline styles, not a `<nav>`. Query by `position:sticky` computed style, not by tag name.

## S16 trace browser verification pattern
- /api/trace returns all objects; /trace renders them. Tree currently shows requirements at root, tasks as children (via `›` expander).
- Click tree item → drawer opens (rb-detail-drawer), hosts typed DetailView (rb-task-detail, rb-requirement-detail, rb-usecase-detail, or generic rb-detail-view).
- Cross-type navigation: click a dv-link → drawer updates to target type's view.
- Icon colors via CSS vars `--type-bg` / `--type-color` on `rb-object-item[type="..."]`.

## Isolated E2E proves zero-net-add
- Default Playwright run = isolated (port 4445, DATA_DIR=tmp, reuseExistingServer:false). Count data/users/ before and after to prove zero net add.
- 7 specs fail in isolated mode because they verify disk state at prod DATA_DIR while isolated server writes to tmp. Known limitation, not a regression.

## S17 scenario verification pattern
- Scenario units live in `scenario/index/<5char>/<uuid>.scenario.json` (5-level UUID prefix).
- `scenario/sprints.json/<sprint>/` has speaking-name symlinks → index entries. Verify with `file` or `ls -la`.
- `scenario/sprints.md/` has generated views: `sprint/`, `task/`, `usecase/` subdirs with .md + .html per unit.
- Planning.md nesting: parent tasks at top-level `- [ ]`, subtasks indented `  - [ ]`. marked.js renders as nested `<ul>`.
- Verify chain: ownerIor on task units → sprint UUID. Check with `node -e` JSON parse.
- Generated views served via /md/ route (marked.js); .html files are NOT served by /md/ (404) — check on disk only.
- UseCase views minimal (name + source location); chain section empty if no IOR array fields populated.

## Source location on UseCase units (T140)
- model.source = {file, lines:[start,end], commit, repo, ior}
- Rendered in MD as `**Source:** \`file\` lines N-M @<sha>`, in HTML as `/edit/<file>#L<line>` link + `@<sha>` badge.
- validateSource checks: file-not-found, lines-out-of-range, commit-not-resolved (git cat-file).

## Chain-link rendering (T141)
- renderChainSection() walks IOR array fields (children, tasks, requirements, etc.) and renders `🔗 <uuid-prefix>` items.
- HTML: `<a class="chain-link">🔗 e83d47a1</a>` — no href at generation time (IOR resolution is runtime).
- CSS: `.chain-link` = blue, `.chain-link-broken` = grey italic.
- Applied to all 7 class templates. Empty if no IOR arrays populated on the unit.

## Cross-OS VCF drag-drop (research)
- Desktop: native HTML5 drag-drop works. Match .vcf by EXTENSION not MIME (empty on Windows Chrome/Firefox, `text/vcard` on macOS, `text/x-vcard` on some Android).
- Mobile (iPhone/Android): NO native file drag-to-browser. MUST have `<input type="file" accept=".vcf">` fallback.
- Playwright: `setInputFiles()` for `<input>`, synthetic `dispatchEvent` for drop handler. Real OS drag = manual QA only.
- VCF multi-contact: a single .vcf can have multiple BEGIN:VCARD blocks.

## Task file = single source of truth (CMM4 reinforced)
- Write findings/status/handoffs INTO the task file's QA section. Read task files before asking questions.
- Verify against official task file with T-number, not PO harness refs. Planner-first.
