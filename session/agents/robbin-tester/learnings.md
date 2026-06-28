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
