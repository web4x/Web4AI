# robbin-tester Learnings — 2026-06-13

## Tier-3 recovery (2026-06-28, measured this cycle)
**At 100% context, a multi-step write→commit cannot complete.** Measured ground truth: the prior session's save edit was *approved* but the file on disk stayed unchanged and nothing was committed (trainer confirmed `context.md` byte-identical, anchor 148f449 was committed BY the trainer on the agent's behalf). Rewind didn't help: every checkpoint was minted AT 100%, so rewinding still landed in a full window. Path A (deep-rewind-to-oldest) is the F-T8 death trap — ~99% rewind leaves <33k and kills the agent.

**How to apply:**
- When you near 100%, you may already be past the point where you can save yourself. Save EARLY (boot rule #13: before 80%, every SM warning) — do not trust that a 90%+ session can still persist.
- The cure for a maxed session is NOT rewind — it is a clean `claude --name <self>` boot that orients from the last *committed* anchor (boot.md + context.md + learnings.md). Distilled committed files > forking the bloated JSONL (forking the largest = inheriting the bloat).
- On fresh boot, the FIRST action is the F-T17 fresh-save gate: write a fresh context.md and COMMIT it immediately. That single write→commit IS the proof the new runway works; don't start gating work until it lands. This cycle: commit d1ff662 proved it.
- This is why "wer schreibt, der bleibt" is survival, not ceremony: only the *committed* word reached this incarnation. The approved-but-uncommitted edit died with the bloated session.

## WODA.prod gate environment + R21.2 discriminator (2026-06-28, measured)
**Repo location (measured, my committed path was stale):** live Web4RawBin on WODA.prod = `/var/dev/Workspaces/2cuGitHub/Web4RawBin` (v0.6.65). `/var/dev/Workspaces/web4x/Web4RawBin` is the OLD v0.6.62 (pre-fix) — useful as a RED-baseline source. Always `grep '"version"'` + `git log -1` both before assuming which is live.

**Browser gate bring-up on WODA.prod (no browser cached):**
- node18 at `/root/.vscode-server/bin/903b1e9d8990623e3d7da1df3d33db3e42d80eda/node`.
- `node_modules/.bin/playwright install chromium` then `playwright install-deps chromium` (root) — chromium failed with `libatk-1.0.so.0` missing until install-deps ran.
- Scripts importing `@playwright/test` MUST live inside the repo dir (node_modules resolution) — `/tmp` scripts get ERR_MODULE_NOT_FOUND.
- For a DOM-event-binding bug (not paint/touch), headless chromium is a faithful observer — webkit/touch not required. Match browser to bug physics.

**prod new-user flow gotcha:** after profile commit, prod shows "Authorize This Device" (#de-code). `hasDeviceKeys()` (app.ts) only checks localStorage presence → seed `rawbin-device-privateKey/publicKey/signature='e2e-bypass'` BEFORE commit to skip the device gate and reach the lobby (#member-name). Same bypass r2031 uses.

**R21.2 discriminator (the subtle one):** the bug = lobby name stale after vCard import until reload. Fix fb369d340 = RoomBrowser subscribes PROFILE_UPDATED → sets `this.memberName`. KEY: `render()` emits `value="${this.memberName}"`, and `this.memberName` is set ONCE at construction (line 29) and ONLY updated afterward by the fix's listener. So even if the editor's `onSave→browser.show()` RE-RENDERS the lobby (replacing the #member-name node), the buggy build still shows the stale construction value → RED. **Therefore the sound assertion is VALUE-based (after===vcardName && after!==prev && no-reload), NOT node-identity-based.** I first added a `sameNode` (tag survives) check → false REDs, because re-render legitimately replaces the node while the VALUE is still correct (driven by the fix). Lesson: gate the requirement (name correct, no reload), not an implementation detail (in-place patch vs re-render).

**RED baseline honesty:** when prod is already the fixed version, a live RED is impossible there. Discrimination proven by SOURCE analysis is a *weaker* proof than a measured RED run — SAY SO in the report (don't claim a RED you didn't run). The pre-fix repo (web4x @ 0.6.62) is the place to get a real live RED if the PO wants champagne-grade RED→GREEN.

**Pollution:** each `node` gate run = fresh browser context = new prod user. Reuse ONE context across DET-3x iterations to make it 1 user, and TAG names (`r212gate-*`) so they're purgeable. Still flag the count honestly.

## R21.1 — probe-to-isolate root cause + silent-guard bug class (2026-06-28, measured)
**Bug class — silent guard swallows the failure:** `const token = localStorage.getItem('rawbin-player-token'); if (token) { POST }`. The key is never set (real key is `rawbin-player-id`), so `token=null`, the `if` is skipped, and `.catch(()=>{})` on the fetch means ZERO error surfaces. The vCard just never persists. These bugs are invisible to "does it throw" checks — only an END-STATE gate (GET /api/vcard/<token> returns the data) catches them. Always gate the persisted outcome, not the absence of an exception.

**Probe-to-isolate (pinpoint the one-line fix, don't just report RED):** when a gate goes RED, run ONE more measurement that flips the suspected single variable. Here: I seeded the real id under the WRONG key the handler reads → GET went 200 with the FN. That single probe proved (a) the endpoint works, (b) the key mismatch is the SOLE defect, (c) the exact fix. A RED + root-cause + probe-proven fix is worth 10× a bare RED to the expert. "Gaps become sprints — the wound teaches the cure."

**Verify gate faithfulness before claiming an app bug:** importApplied=true (vcf FN reached #pe-name via applyVCard) proved the UI path fired; the failure was downstream (persistence). Distinguish "my gate didn't trigger it" from "the app is broken" — I confirmed the POST guard via source (`rawbin-player-token` set nowhere) BEFORE calling it a bug. NEVER relay unverified claims.

## R21.4 — wss protocol-probe gate (2026-06-28, measured GREEN DET-3x)
**For protocol/handshake behavior, gate the WIRE directly — skip the browser.** R21.4 (known phone → challenge, not new user) is a server WS decision. A raw `ws` client (node, `ws@8.20.1` in repo) replaying the real handshake is faster, more deterministic, and zero-UI-flake vs Playwright. Handshake: connect `wss://host/` (`{rejectUnauthorized:false}` for prod cert) → server `welcome` → client sends `IDENTIFY{playerToken, phone, ...}` → collect messages for ~3s.
- MSG values are literal strings (`'IDENTIFY'`, `'KNOWN_KEY_CHALLENGE'`, `'PROFILE'`) in src/ts/shared/MessageTypes.ts — send/match them verbatim.
- **Discriminator from mutually-exclusive code paths:** known-key path sends `KNOWN_KEY_CHALLENGE` and `break`s BEFORE the mint's `send(MSG.PROFILE)` (server.ts:1845 vs :1893). So "challenged, not minted" = challenge PRESENT **and** PROFILE ABSENT. Always anchor the assertion on BOTH the expected message and the absence of the mutually-exclusive one — presence alone is weaker.
- **Bundle a negative control for free discrimination:** same probe with NO phone must take the mint path (PROFILE, no challenge). Proves the challenge is keyed to the real index entry, not always emitted. One probe, huge confidence gain.
- **Zero-pollution by construction:** the known-key path breaks before `userProfiles.set` → the positive DET-3x minted ZERO users. The negative control mints exactly 1 phantom (uncommitted) — flag its token. Prefer gates whose happy path leaves no trace on prod.
- maskedName `M**** D****` (Marcel Donges) in the challenge = a nice human cross-check that resolveKeyToProfile hit Tron's real profile 3effa1fc, not a stub.

## DET-3x earns its keep + harden the harness, not the verdict (2026-06-29, measured)
On R21.5/6, the 3 in-script iterations were GREEN but a SECOND independent process run flipped the standalone checks to RED with `status 0` / `challenge=NONE`. I did NOT report RED — I MEASURED: direct `curl` of the same endpoint was 5/5 HTTP 200 (~20ms). So the RED was a **transient connection blip swallowed by my harness** (`https.get` `.on('error')` → status 0, no retry), not an app regression. Fix = retry-on-transient in `apiGet` (status 0) and `probe` (zero messages = blip, since SERVER_CONFIG/ROOM_LIST always arrive on a healthy socket). Re-ran clean GREEN 3×.
**How to apply:** (a) DET-3x across SEPARATE processes (not just in-loop iterations) is what surfaces connection/timing flakes — keep doing independent runs. (b) When a gate goes RED, FIRST cross-check with a dead-simple independent tool (curl) before believing it — a flaky gate is unfaithful and must be fixed, not reported as an app bug. (c) Harnesses firing many rapid wss+https connections WILL hit occasional transient errors; bake in bounded retries so a blip never becomes a false RED. (d) Distinguish "empty response" (connection failure → retry) from "wrong response" (real RED → report).

## The verdict must be COMMITTED, not just spoken (planner #102, 2026-06-29)
A GREEN/RED verdict that lives only in a pane message (otmux) is NOT durable — the planner/scoreboard reads truth from git, not from chat. I re-gated R22.4 GREEN on v0.6.79 and reported it in panes, but the last COMMITTED verdict still said RED@v0.6.78 (the gate's commit message), so the planner couldn't flip the testing hop. Fix: stamp the measured verdict (version, commit, DET-Nx result, the key number) INTO the committed artifact — the gate file header and/or the commit message — so "your-hop-your-status" is self-evident from git. wer schreibt der bleibt applies to VERDICTS too, not just learnings. And: re-run the gate right before committing the verdict, so you never commit an unverified GREEN.

## "Clickable" ≠ "opens" — follow the link (R22.4, 2026-06-29)
A fix that makes something a real `<a href>` is only half the feature — the href must RESOLVE. R22.4 made 124 PNGs clickable (`🖼 <a href>`) in the /md listing, but there was no `.png` serve route (only `.svg` @server.ts:1352, `.puml`, `.md`), so every link 404'd. The listing assertion (anchors present) was GREEN; the real acceptance ("open in preview like SVGs") was RED. **Always GET the link and assert status 200, not just that the anchor exists.** The discriminator: clickable=124 AND opens(200) — opens was 404 → RED, root-caused to the missing serve handler.
## Don't truncate a value before substring-matching it (R22.3 gate self-bug)
My gate captured `label.slice(0,40)` then checked `.includes('.puml')` — the .puml path was at char ~55, so the check falsely failed (Class source link WAS the .puml). Match against the FULL string (or the href). Truncate only for DISPLAY, never for assertion.
## Verify the hand-off's cited example actually reproduces
The expert said "RbFileDetail Class→Method→Impl all show rb-file-detail.ts:25". MEASURED: that class's chain nodes (render, impl:render) have null sourceFile → it shows NO links. The R22.3 feature is still sound (ScenarioUnit→.puml, TraceConsistency→.ts:42, templates→.ts:7 all GREEN) — but the specific example was a data gap. Don't take the cited node on faith; pick nodes that actually have the data, and report the discrepancy.

## Capture the RED baseline BEFORE the fix ships (R22.2, 2026-06-29)
When a gate is requested for a not-yet-shipped fix, don't idle waiting. Write the gate, run it on the CURRENT (unfixed) version to capture a measured RED baseline, commit it, then watch for the deploy. This gives a true champagne RED→GREEN with zero extra work later. R22.2: on v0.6.75 dblclick did nothing (s1 stayed 1.00) = RED; on v0.6.76 s1=2.00 then reset 1.00 = GREEN. Deploy-watch: a background `curl /sw.js | grep version` poll loop (30s cadence, bounded ~25min) exits on version-change and auto-re-invokes me — no manual polling, cache-friendly. Synthetic desktop dblclick = dispatch the full mouse sequence (mousedown/up/click ×2 + dblclick) with clientX/Y so handlers reading e.client* fire.

## Detail-view gating: mount with the page graph + count-the-heading + source-confirm the rest (R22.1, 2026-06-29)
- **Tree-node detail components need the graph.** rb-{task,requirement,usecase}-detail render from `this.graph?.get(refUuid(ref))` (not self-fetch like rb-file-detail). Reach the page's TraceGraph at `document.querySelector('rb-trace-tree').graph`, set `el.graph = that` + `el.setAttribute('ref','<type>:<uuid>')`, append. Faithful — same component the drawer builds.
- **Duplicate-section bugs → count the heading.** "Two 'Traceability Chain' sections" → assert `querySelectorAll('h4')` filtered to that text === 1. Cross-check at SOURCE: `grep -c 'Traceability Chain'` in the component files should be 0 (the surviving heading comes from the shared renderChainPathSection, not inline).
- **No need to await async sub-renders for a synchronous-heading assertion.** renderChainPathSection writes its `<h4>` + "Loading chain..." synchronously then walks; the heading count is valid as soon as `.dv-chain-walk` exists — waiting for the server-walk to settle just burns wall-clock (my first run timed out doing that).
- **A shared fix is only LIVE-demonstrable where data exists; source-confirm the rest, and SAY which is which.** Bug#2 (clickable forward `<a>`) needed forward links; measured 0/254 UseCases have any, so I proved it live on Task+Requirement and source-confirmed rb-usecase-detail emits the identical `<a href=scenarioBrowserHref ...#ff9800>`. Report the split honestly — don't claim a live pass you couldn't observe.
- Assert orange via computed color `rgb(255, 152, 0)` (= #ff9800), and clickable via `tagName==='A'` + `href ^= /md/scenario/index/` + zero `div.dv-link` (the old broken style).

## Wiring Test hops — close the chain (R21, 2026-06-29)
Test hop crediting is LENIENT vs Impl (measured in skill-classes.ts:181-185 `hasRealTest`): credits iff (a) a `ior:class:Test` unit with that uuid is in the scenario index AND (b) the bare `[test:uuid:<uuid>]` marker appears anywhere in a file under `test/` or `scripts/`. NO strict-AST/name-match (Impl needs the marker to head/sit-in a name-matching named member — `buildStrictImplSet`, much stricter). Marker scan covers `.ts/.js/.mjs/.css`, so `test/visual/*.mjs` gates qualify.
Per req, three artifacts (all required — scoreboard reads `Impl.tests[]`→testUuid→hasRealTest):
1. Test unit `{ior:'ior:class:Test', model:{uuid, name:'test:R..', sourceFile:'ior:file:<gate>', implementations:['ior:instance:<impl>'], status:'pass'}, ownerIor:'ior:instance:<impl>'}` at the sharded path.
2. `[test:uuid:<uuid>]` comment in the verifying gate file.
3. add `ior:instance:<uuid>` to the Impl unit's `model.tests[]`.
**How to apply:** MEASURE the live chain (`chain scoreboard`) for the CURRENT impl uuids — don't trust a checklist authored at an older HEAD or a truncated hand-off message. Use fresh `crypto.randomUUID()` (v4) for test uuids — never fabricated `-a1b2-4c3d-` patterns (they trip FAKE_SUFFIX + prefix-collisions). One test=one chain: each test uuid maps 1:1 to one impl; a gate file may host multiple DISTINCT test uuids (r2156 hosted R21.3/5/6) — that's fine, shared-test-overcredit is the SAME uuid across impls, not multiple uuids in one file. Verify with `chain scoreboard` det-2x + `chain lintMarkers` (confirm none of YOUR uuids appear).
Tooling: `npx tsx scripts/objectVerb.ts chain scoreboard|lintMarkers|resolvePrefix|wireImplNode` (space-separated verb, lowercase `chain`).

## Safe prod-data purge (S21 cleanup, 2026-06-29)
Deleting test pollution from a LIVE prod is dangerous — do it like a gate: measure, dry-run, assert safety, apply, re-measure.
- **Hard-exclude real data by uuid** in an explicit SAFE set (Tron profile 3effa1fc + his phone/email units, Cerulean 7a5f64b1). Build the delete-set, then subtract SAFE; assert 0 violations before any unlink.
- **Delete alt symlinks by their RESOLVED TARGET, not by filename pattern.** `readlinkSync` → target uuid; delete the link only if the target is in the delete-set. This auto-protects `alt/company/ceruleancircle` (→Cerulean) and `alt/phone/+4915253844085` (→Tron) without fragile name matching.
- **Match test data by specific tags** (`r2156-*`, `zorblax<hex>`, `apple[0-9a-f]{5,}`) — never a bare prefix that could hit real units (bare "apple"/"ceruleancircle" must not match).
- **Measure before AND after on the live API, not just disk:** company suggest test-hits 11→0, test phone 200→404, while Tron phone still →3effa1fc and Cerulean still suggests. The index reads disk per-request, so deletions reflect immediately (no restart needed for scenario/alt).
- **Know what's git-tracked vs runtime:** scenario/index + scenario/alt are tracked (commit the deletions — revertible). data/profiles.json is GITIGNORED + in-memory-backed — editing it live races the server's saveProfiles (it'd overwrite), so userProfiles entries (incl the R21.4 phantom) need a coordinated restart-purge, NOT a live edit. Flag, don't risk.

## Component-mount gating + behavioral pan/zoom + DRY surface coverage (R21.9, 2026-06-29)
- **When full app-nav won't reach a component, mount it directly.** /trace deep-link `#file.show?uuid=` wouldn't render `rb-file-detail` (the tree auto-navigates to the current sprint on load, and room-file uuids aren't tree nodes). Fix: `page.goto('/trace')` for the app context (custom elements registered + same-origin fetches), then `document.createElement('rb-file-detail'); el.setAttribute('uuid',u); body.append` — the real component self-fetches `/api/ior` and renders the REAL layout. Faithful for component-layout ACs; you skip only the nav chrome, which isn't what's under test.
- **Behavioral pan/zoom via synthetic events (headless).** Wheel zoom: `vp.dispatchEvent(new WheelEvent('wheel',{deltaY:-120,clientX,clientY,cancelable:true}))` then read `.pz-content` `style.transform` `scale()` >1. Pinch: `hasTouch:true` context + `new Touch({identifier,target,clientX,clientY})` + `new TouchEvent('touchstart/move/end',{touches:[...]})` spreading two points → scale>1. Reset: call the component's `.reset()`/click reset → scale back to 1. Measured real transforms (wheel 1.52x, pinch 4x, reset 1.0x), not just structure.
- **DRY means: find the shared core, then exercise EACH entry surface.** content-preview.ts said ROOM+TRACE "share ONE pan/zoom path" (rb-preview-pane+RbPanZoom). I still tested BOTH surfaces (TRACE via rb-file-detail; ROOM via `rb-preview-pane.setContent`, which is exactly what the room `.cv-preview-toggle`→`fillPreviewPane` drives) — because the PO asked for both and the ENTRY differs even if the core is shared. Read the source to prove the shared core, but gate each surface the user actually touches.
- **Assert 75vh as a ratio:** `pane.offsetHeight / window.innerHeight ≈ 0.75` (measured exactly 0.75) — dimensions over CSS-string matching (the v0.5.222 lesson generalizes).

## Assert transforms via what the API echoes; discover ids via the feature's own API (2026-06-29)
- **Endpoint echoes the normalized key** → assert the pure function directly, zero-pollution. `/api/phone/<raw>` returns `key: normalizePhone(raw)` in BOTH 200 and 404 bodies → I tested the E.164 fix's exact cases (bare-national→'' reject, 00→+, +passthrough) without creating a single user. Look for these echoes before building a write-heavy gate.
- **Discover internal ids through the feature's own surface.** R21.8 Company uuids are internal (random), but `/api/company/suggest?q=<brand>` returns `{uuid,name,nameKey,domain}` → use that as the discovery channel, then read the unit from disk only to confirm what the API can't show (ownerIor null). Beats scanning the index.
- **One fixture, many ACs.** R21.8: two users committing the same brand in different legal forms (`"X GmbH & Co KG"` vs `"X"`) proves AC-a4 (nameKey suffix-strip) AND AC-f2 (dedup→one shared uuid) AND AC-f1 (ownerIor null) in a single move. Design fixtures whose shape exercises several acceptance criteria at once.
- **Collision-safe canonical tests:** to test "format X normalizes to canonical C" without colliding with a real seeded entry, use a unique high-entropy brand (`Zorblax<run>`) whose nameKey is deterministic, OR assert against the seed read-only. Never commit a test profile under a real user's identity key (would collide with their alt-index symlink).

## Self-contained round-trip > depending on a seed
R21.5/6 gate creates its own committed user, adds phone/email, then resolves them back — proving the FULL lifecycle (mint unit → index → resolve / device-link) in one gate, plus a separate check of Tron's real seed. Self-contained create→verify is stronger and less brittle than asserting only against pre-seeded data, and the alt-UUID REST (`/api/phone/<x>` → token; Profile unit uuid==token) is the clean observable for "unit created on update."

## v0.6.0 Marathon Gate Learnings

### Gate faithfulness (the gate must SEE the bug)
- Playwright serializes JS↔paint — page.evaluate() runs BETWEEN frames, never mid-paint. Paint-timing bugs (partial render, first-item-icon-only) are INVISIBLE to Playwright.
- For paint-timing: use STRUCTURAL gate (sync render, DocumentFragment, atomic attach) + device diagnostic (rAF loop script for Tron's devtools).
- For interaction bugs: use BEHAVIORAL touch gate with WebKit iPhone emulation + page.touchscreen.tap().
- A gate that always passes proves nothing. Every gate needs a measured RED baseline.

### Touch gate methodology
- page.touchscreen.tap() uses VIEWPORT coordinates. Elements below fold: scrollIntoView({block:"center"}) → wait 300ms → recalc getBoundingClientRect() → tap(newX, newY).
- ALWAYS probe first (G0): attach document touchend listener, tap, check e.target. If target=wrong-element (e.g. rb-chat-sheet overlay), the gate is unfaithful — fix stacking before gating behavior.
- WebKit iPhone-14 emulation (devices['iPhone 14']) is the PRIMARY faithful gate for mobile. Mouse click (page.click) masks touch bugs.
- Chat-sheet stacking intercept (pointer-events:auto on .sheet overlay covering tree area) blocked touch for 3 versions — found only when probe was added.

### Dimensions > attributes
- collapsed=false does NOT mean visible. Items can be 0x0 (invisible) while collapsed=false.
- The REAL acceptance: getBoundingClientRect() width>0 AND height>0 for every item.
- Container overflow:hidden clips children to 0x0 even when they exist in DOM with correct attributes.
- .room-view overflow:hidden was the clipper — safe-area header expansion pushed items below clip boundary.

### Chain integrity
- One test = one chain. Each [test:uuid] maps 1:1 to one [impl:uuid]. Shared tests across Impls = false-completes (inflated 131→107 on audit).
- shared-test-overcredit scan before ANY count claim. Run chain.lintMarkers.
- Unit with live [test:uuid] marker in source = never garbage. That's wiring work, not cleanup.
- Real markers not stubs: every uuid must be full 36-char copied verbatim. Never reconstruct from prefix.

### Process
- GATE-BEFORE-DEPLOY: expert deploys ONLY on tester GREEN. No exceptions.
- Tron is NOT the tester. Tester gates; Tron does acceptance QA.
- Never relay unverified claims. Source-VERIFY with grep before reporting.
- Task files = single source of truth. Write findings INTO the task file.
- Save context at every SM warning. Don't wait.

## Test Architecture Patterns

### Unit test handler logic, not integration
- Extract handler logic as standalone functions, test with mocks
- Integration tests (WS to running server) belong in Playwright E2E, not vitest

### Room.ts testing
- mockWs(open=true), makeMember(name), getSentMessages(ws), clearMock(ws)
- Per-user persistence: mock writeRoomJson, verify calls (not disk)

### File system testing
- os.tmpdir() + mkdtempSync, cleanup in afterEach with rmSync
- Real modules (UserKeys/UserCrypto) with synthetic tokens, cleanup after

### Playwright E2E
- JSDoc with */ in glob paths or /.*/ regex breaks Babel parser — use // comments only
- ensureLobby → ensureRoom → uploadTestFile for real WS FILE_ADDED
- reuseExistingServer:false for isolated runs (T100 fail-closed)
- Shadow DOM img screenshots unreliable — verify with curl
- addInitScript clobbers localStorage on reload — seed manually

### Scenario verification
- Scenario units in scenario/index/<5char>/<uuid>.scenario.json
- sprints.json/ symlinks, sprints.md/ generated views
- Chain links use speaking-name hrefs (via SlugResolver), not UUID filenames
- renderChainSection in templates.ts must resolve IOR→slug

### Cross-OS VCF drag-drop
- Desktop: HTML5 drag works. Match .vcf by EXTENSION not MIME (empty on Windows).
- Mobile: NO native file drag. Must have input type=file fallback.
- Playwright: setInputFiles() for input, synthetic dispatchEvent for drop handler.
