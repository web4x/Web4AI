# robbin-tester Learnings — 2026-06-13

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
