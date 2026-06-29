# robbin-architect Context (Save 2026-06-28 — Sprint 21 architecture delivered)

## ADJUDICATION: PO ruled AC-a5 — nameKey auto-merge WITHOUT domain IS correct (Tron "do not duplicate companies"). My AC-a5 was over-precise. No code change. (Lesson: don't out-precise Tron's stated intent.) AC-b3 (different-domain merge) FIXED by expert in c22083798 (nameKey recall gated on no-domain) — matches my recommended fix; tester should re-gate R21.8.

## LATEST (PDCA CHECK R22.1, v0.6.75 61b21fbf6) = GREEN, both bugs fixed across all 3 peers.
- (1) singularChain refs = 0 in rb-task/requirement/usecase-detail ✓ Bug#1 old path GONE.
- (2) forward-link rows now real anchors: `<a class=dv-link href=scenarioBrowserHref(refUuid(lref))>` (orange) ✓ Bug#2 fixed — links to scenario MD.
- (3) renderChainPathSection = sole chain section: verified 1 import + 1 call per file (grep -c showed 2 = import+call, NOT two calls), 0 inline Traceability-Chain headings ✓.
- VERDICT: OK to gate. Family fix landed in all 3 detail views. Reported to PO.

## PRIOR (UI BUG DIAGNOSIS — design fix reported, expert to implement):
**Bug #1 "Traceability Chain: No chain" duplicate above real chain:** rb-task-detail.ts render() emits inline `<h4>Traceability Chain</h4> ${renderSingularChain(singularChain(graph,uuid))}` → "No chain" (graph-walk finds no forward steps for a Task). Then loadDetailData() calls renderChainPathSection() which emits ITS OWN <h4>Traceability Chain</h4> + correct server-walk chain. = 2 headings (empty above, correct below). SAME in rb-requirement-detail.ts:50-51 + rb-usecase-detail.ts:48-49 (all 3 peers!). Extraction-without-removal: expert ADDED renderChainPathSection (10b5d42af) but didn't REMOVE old inline renderSingularChain. FIX: delete the inline `<h4>Traceability Chain</h4>+renderSingularChain` block + dead singularChain import + `const chain=` line from ALL 3 views; keep renderChainPathSection (canonical, own heading).
**Bug #2 Forward Links not real links:** renderLinks() emits `<div class="dv-link" data-ref>` (JS-navigate, not <a href>, goes to trace nav not MD). FIX: render as `<a href>` using scenarioBrowserLinkFromIor pattern (/md/scenario/index/<shard>/?highlight=<uuid>.scenario.json) so "profile.dropVCard" links to the UC's scenario MD; + add a Task-MD link (set Task.sourceFile to sprint task MD or derive from slug). NOTE slug mismatch: my tasks slug=task-t21-1, PO example=task-21.1-vcard-drop — align readable slug or derive MD link from sourceFile.

## PRIOR: PIN WALK DONE — commit 7c9c653c8. Walked CurrentSprint through 8 done S21 tasks (T21.1,3,4,5,6,7,8,9; T21.2 deferred). Per task: setChain(full req->uc->class->method->impl->test, "Sprint 21") + hopUpdate uc/class/method/impl done + test gate-proven + focus next. Final pin: sprintName=Sprint 21, current=T21.9, lastCompleted=T21.8. All 8 chains resolved fully (impl+test units exist). Walk plan TSV in scratchpad. Recorded shipped+GREEN reality, no new code.
- Walk mechanics: setChain resets hops + marks req=done; need 5 hopUpdates (uc/class/method/impl done, test gate-proven); focus(next) gated on current test=gate-proven (so gate-proving each unblocks next focus).

## PRIOR: SPRINT 21 TRACEABILITY REWORK DONE — commit 5d409e03c (project repo). PO-authorized override of "don't create tasks" (no planner on WODA.prod). Created 9 ior:class:Task units T21.1-T21.9 (Web4Articles pattern: SHORT name != DETAILED desc; coveredRequirements[]->R21.x; useCases[]->UC; ownerIor->Sprint21). Wired Sprint21 1bdfaafa tasks[]=9. Advanced CurrentSprint pin off Sprint-20 T-drawer-full-width to Sprint 21/T21.9 (verified pinCurrent sprintName="Sprint 21"). req(0.4) triple-verified all 9 req UUIDs. 9/9 task verify PASS.
- Task UUIDs: T21.1 0c1b375e, T21.2 a25e2787, T21.3 1bae9710, T21.4 e83dc244, T21.5 3960168e, T21.6 af9dc6cc, T21.7 18845496, T21.8 842d4f01, T21.9 f86f7003.
- PIN MECHANISM (WODA.prod): planner-drive.ts needs tsx via Node18 — `<node18> node_modules/tsx/dist/cli.mjs scripts/planner-drive.ts <verb>` (plain `npx tsx` picks wrong node → ERR_UNKNOWN_FILE_EXTENSION). focus <task> sets chain+task but NOT sprintName; setChain <req> <uc> <class> <method> <impl> <test> "Sprint N" "Task" sets sprintName too. Pin persists to CurrentSprint unit.

## FINAL PDCA (v0.6.74 2a1357a69): all 3 flagged items RESOLVED — GREEN.
- AC-f2 DRY ✓: content-preview.ts old @400px iframe pinch-zoom RETIRED → <rb-preview-pane>/RbPanZoom; grep '400px|pinch-zoom' = NONE REMAINING; RbPanZoom now imported by RoomView (room) + rb-detail-view + rb-file-detail + content-preview (trace). Old path GONE, proven by removal.
- AC-e5 ✓: pan-zoom.ts:53 mousedown now calls gesturing() → iframe pointer-events:none on desktop drag too.
- AC-b3 ✓: mintOrReuseShared — domain present+miss falls through to MINT (skips nameKey); no-domain nameKey-recall preserved (Tron/AC-a5). Traced 4 cases, all correct. buildLinks preserves first unit's recall key.
- e1 tap-refinements remain noted optional. VERDICT: R21.9 + R21.8-b3 fully compliant → OK to gate. Reported to PO.

## PRIOR (PDCA CHECK): R21.9 pan/zoom (v0.6.73 c22083798) vs my 22 ACs (21e792e0) = SUBSTANTIALLY COMPLIANT. Read pan-zoom.ts + rb-preview-pane.ts + rb-file-detail.ts.
- PASS: a1-a5 reorder (buttons→75vh in-flow pane→metadata), b1-b4 transform (zoom-about-point, clamp/recenter, [1,8]), c1-c2 desktop, d1-d3 touch, e2 (no elementFromPoint), e3 (viewport-only listeners), e4 (destroy + setContent teardown), e6 (reset on file change via new RbPanZoom), f1 (img/svg/iframe/pre/download by mime). DOUBLE-TAP PINCH-RELEASE GUARD WORKS (traced: 2-finger start never sets pendingDoubleTap; touches===0 gate).
- **AC-f2 GAP (MEDIUM):** RbPanZoom NOT reused by room file view — content-preview.ts still uses OLD native iframe pinch-zoom @400px; two impls coexist (not DRY). Also clarify: R21.9 "in-room file detail" target = rb-file-detail (trace browser) vs a separate room component? Change landed on rb-file-detail; room view unchanged. PO/tester confirm surface.
- **AC-e5 MINOR:** iframe pointer-events disabled on TOUCH (gesturing on touchstart) but NOT on desktop mousedown → desktop drag over iframe may be swallowed.
- **AC-e1 MINOR:** core pinch-release guard present+working, but tap-duration(<250ms)+slop(<10px) sub-criteria not impl'd (uses 30px gap-proximity); pinch-release then quick tap could edge-misfire.
- NOTE: buttons are New-tab + Reset-zoom (preview always inline → open-in-preview unneeded); apt deviation.
- VERDICT: address f2/surface + e5 before gate; e1 refinements optional. Reported to PO.

## PRIOR (PDCA CHECK): R21.8 companies (v0.6.72 a52245de1) vs my 25 ACs (bf6a0433). companyNameKey EXCELLENT (executed: 3 variants + "GmbH & Co. KG"→ceruleancircle; Müller→muller diacritics; "Ben & Jerry"→benandjerry mid-name 'and' preserved; legal suffixes strip). 1 REAL GAP + 1 SPEC-TENSION, same root cause:
- **AC-b3 GAP (MEDIUM, real):** mintOrReuseShared step-2 (nameKey reuse) runs UNCONDITIONALLY even when a domain was provided but didn't match → Apple@apple.com + Apple@apple-fruit.de MERGE into one unit. AC-b3 says different domains must stay SEPARATE. FIX: gate step-2 on "no domain provided"; a present-but-unmatched domain = positive evidence of DISTINCTNESS → mint new.
- **AC-a5/c4 TENSION (adjudicate):** no-domain case, step-2 auto-merges on nameKey alone (server indexProfileCompany→mintOrReuseShared). My AC-a5 forbids; Tron "dedup by name" supports. mintNew override exists but unused server-side. PO/Tron decide.
- NOTES (non-gating): AC-d4 wx-atomic guard not impl'd (goal met by sync single-process); AC-c5 addAlias method exists but not wired in server path; AC-c6 debounce + AC-c3 select-reuse are client-side, not in this server commit.
- PASS: a1-a4, b1/b2/b4, c1/c2, d1-d3, e1-e3, f1-f3. Reported to PO.

## PRIOR (PDCA CHECK): R21.7 addresses (shipped v0.6.70) reviewed vs R21.7 ACs (5d3b5e6e) = PASS/COMPLIANT, all 17 ACs. AddressIndex.ts: exact model shape, sync mintAddress (no network), applyVerification sets verified+links. Server verify worker: queue+setTimeout off request path, Nominatim limit=1+UA, 1100ms rate-limit, cache keyed by oneLine, miss→cache null+persist unverified (clean). EXECUTED osmLinkFor/gmapsLinkFor → byte-match AC-d1/d2. 2 ROBUSTNESS NOTES (non-gating, NOT gaps): unbounded verify cache; genuine misses cached null for process lifetime (transient net errors correctly NOT cached → still retry). OK to gate. Reported to PO.

## PRIOR: R21.9 design deep-dive DONE (my call: design-ahead > idle) — commit 47a427780 (project repo). architecture.md §6 expanded with RbPanZoom transform gesture handler (zoom-about-point math, desktop wheel/drag, touch pan/pinch/double-tap, 7 hard-won correctness rules) + reorder (buttons→75vh in-flow viewport→metadata). R21.9 unit 21e792e0 refined: 22 ACs (a:reorder b:transform c:desktop d:touch e:correctness f:reuse) + 12 TS, gate 22/22. Measured current code first: rb-file-detail renders metadata-first + content-preview uses native iframe pinch-zoom @400px (insufficient → needs transform handler). Next: standby for R21.8/R21.9 impl review.

## PRIOR (PDCA CHECK): Reviewed expert R21.5 (d4aad5081) + R21.6 (f420c79de) vs my ACs.
- R21.5 EMAIL = COMPLIANT. Server wiring verified (resolveKeyToProfile→IDENTIFY→KNOWN_KEY_CHALLENGE server.ts:1928-31; indexProfileEmail 213). 2 MINOR: (e3) mintAndLink returns normalized KEY string not Email IOR; (c2) normalizeEmail server-side only, not confirmed shared client-side. Both low-sev, behavior correct.
- R21.6/R21.3 PHONE = 1 MEDIUM GAP: normalizePhone (PhoneIndex.ts) just strips non-digits + prepends '+', does NOT yield true +CountryCode. Measured: '015253844085'→'+015253844085', '00491525384085'→'+00491525384085' — both pass isValidPhoneKey(+\d{6,15}) but are WRONG E.164. Risk: same number in +49/0049/0152 forms → DIFFERENT alt-keys → device-link/dedup MISS. Happy path (+CC present, incl seeded Tron phone) works. Flagged to PO. Fix is expert's (00→+ convert; reject/flag national-without-CC).

## R21.5 email requirement (a8be009e) refined — 17 ACs + 8 TS, gate 17/17 — committed 5523a0deb (project repo). AC groups a:unit-shape b:relationship(multi+idempotent) c:normalizeEmail d:alt-index e:EmailIndex.mintAndLink f:device-link(shares R21.4 resolveKeyToProfile). SAME commit also fixed architecture.md per REQ FLAG (code is law): alt/phone+alt/email symlink is declared on **Profile.unitLinks[]** (NOT Phone/Email unit), pointing to the Profile — matches shipped R21.6. Used refine-r21.5.mjs (load→inject→write). NOTE: R21.1 (efd1acb6) now carries an `implRef` field → expert IS shipping code; R21.1 impl already landed+gated. Next: standby / next req refinement (R21.3/R21.4/R21.6/R21.9 still un-refined?).

## PRIOR: R21.8 (bf6a0433) refined 25 ACs + 11 TS — committed 7f3f6f3dd. Grounded in architecture.md §4 (f1a49e3c1). Pattern: architectureRef + acceptanceCriteria[] {id,group,text} + testScenarios[] {id,gates[],name,given,when,then} + refinementNote (mirrors R21.7).

## PRIOR: R21.8 company-dedup design committed f1a49e3c1. architecture.md §4: recall(nameKey) vs precision(domain+user-confirm), companyNameKey() algo, alt/company-domain/ strong-key index, /api/company/suggest autocomplete, ownerIor:null shared, wx-atomic mint race guard.

## STATUS: Sprint 21 architecture DONE + PO-VERIFIED. Standing by for PDCA Check on expert impl.
Pane: robbinTeam2:0.3 on WODA.prod
Model: Opus 4.6 (1M)

## REPOS (MEASURED — host changed to WODA.prod)
- **ACTIVE repo:** `/var/dev/Workspaces/2cuGitHub/Web4RawBin`  ← sprint-21 lives here, commit here
- Other clone (web4x) lacks sprint-21 — do NOT use it.
- Session repo (context/learnings): `/var/dev/Workspaces/AI/Claude`

## DELIVERED THIS CYCLE — commit 48b2e612b
Sprint 21 "Contact Identity & Enrichment" (9 reqs R21.1–R21.9, one sprint per Tron answer #3):
1. `scrum.pmo/sprints/sprint-21-contact-identity/architecture.md`
2. `scrum.pmo/sprints/sprint-21-contact-identity/diagrams/sprint-21.puml` (object graph + device-link + async-verify)
3. 27 scenario units minted: 9 UC (refined from req placeholders, FIXED uuids) + 9 Class + 9 Method (fresh v4). Forward-only. Chain verify 9/9 Req→UC→Class→Method PASS.

## CHAIN MAP (req → UC uuid → Class → Method)
- R21.1 efd1acb6 → 9cd5cc65 profile.dropVCard → Profile.dropVCard
- R21.2 4f099ef2 → dbfacb7f lobby.renderName → RoomBrowser.renderNameOnConnect
- R21.3 144d1332 → 97015dcc phone.indexAsSymlink → PhoneIndex.registerSymlink
- R21.4 04dff687 → ff91e891 identity.deviceLinkOnKnownKey → IdentityResolver.resolveOrEnroll
- R21.5 a8be009e → c59356f7 email.mintAndLink → Email.mintAndLink
- R21.6 3bd63ae7 → 4242f9be phone.mintAndLink → Phone.mintAndLink
- R21.7 5d3b5e6e → fab88cb9 address.mintAndVerifyAsync → Address.mintAndVerifyAsync
- R21.8 bf6a0433 → a62c6e37 company.mintOrReuseShared → Company.mintOrReuseShared
- R21.9 21e792e0 → 5826ca42 fileDetail.renderActionsFirst → RbFileDetail.renderActionsFirst
- Mint script (re-runnable): scratchpad `mint-sprint21-chain.mjs`

## KEY DESIGN DECISIONS (measured grounding)
- **Object graph:** Profile.phones[]/emails[]/addresses[]/companies[] forward IOR arrays (Class→Method shape). Phone/Email/Address ownerIor→Profile; Company ownerIor=null (SHARED, dedup by nameKey).
- **Alt-UUID index:** REUSE `ScenarioIndex.unitLinks[]` + `ensureSymlinkDisk()` (src/ts/scenario/index-store.ts:115-131). New `scenario/alt/{phone,email,company}/<key>.scenario.json` symlink → canonical Profile/Company unit. Normalize phone `+CC<digits>`, email lowercased.
- **Device-link (R21.4):** server.ts IDENTIFY (1757) mints on unknown token; DEVICE_ENROLL_REQUEST (1968-1985) already validates secretCode. R21.4 adds `resolveKeyToProfile` BEFORE mint → KNOWN_KEY_CHALLENGE → reuse enroll. No new user on known key.
- **Address async (Tron #2):** save immediately verified:false; bg worker hits Nominatim; on hit set verified+osmLink+gmapsLink. Never blocks.
- **Lobby race (R21.2) DIAGNOSED:** RoomBrowser.ts:27 paints `localStorage/random` fallback at show()/render() BEFORE WELCOME→IDENTIFY→PROFILE returns; line 95 only patches input value, no re-render → "default until 2nd reload." Fix: re-render name+avatar block on PROFILE event (one-shot guard for duplicate PROFILE_UPDATED).
- **File detail (R21.9):** rb-file-detail.ts reorder actions→preview(75vh pan/zoom)→metadata.

## OPEN / HANDOFF
- **R21.6 Tron-phone seed `+4915253844085`** NOT minted — needs MEASURED WODA.prod profile uuid; left for expert impl (did not assume fake data).
- PO is creating task files from this design for expert dispatch. MY NEXT: PDCA Check the expert's impl when it lands — verify impl markers wire to the 9 design-ahead Method UUIDs and shipped code matches architecture.

## PROCESS REMINDERS (this host)
- Bash `cd X && ...` / `find` thrash the guardrail → got rejected repeatedly. Use single bare commands; `grep -rl` (auto-allowed) not `find`; Read tool for files. Glob tool is NOT available here.
- Node18: `/root/.vscode-server/bin/903b1e9d8990623e3d7da1df3d33db3e42d80eda/node`
- otmux send to robbinTeam2:0.0 to report. NEVER assume — always measure. Close the loop.
