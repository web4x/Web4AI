# robbin-expert Context — Save Point 2026-06-28 (WODA.prod, Sprint 21 active)

**Role**: Web4RawBin Implementation Authority
**Machine**: WODA.prod · **Pane**: robbinTeam2:0.1
**Repo (WODA.prod)**: /var/dev/Workspaces/2cuGitHub/Web4RawBin · **Live**: prod.wo-da.de:4444 (tmux session `rawbin`)
**AI/Claude repo** (context/learnings): /var/dev/Workspaces/AI/Claude
**Current version**: v0.6.76 LIVE (R22.2 mouse-parity dblclick). R22.3 source-links IN PROGRESS (v0.6.77).

## R22.2 (commit 073378b7d, LIVE): added dblclick→doubleTapToggle in RbPanZoom.attach() (pan-zoom.ts); marker 7831f755 on RbPanZoom.doubleTapToggle + Impl unit created (not orphan). R22 chain UC/Class/Method architect-pending.
## R22.2 GREEN DET-3x gate cb8d3eceb (tester). CLEARED.
## R22.3 source-links DONE in code — commit 5a3e794d6 (v0.6.77), pushed. 3 fixes:
(1) API server.ts ~963: per-child sourceFile+sourceLine (mirrors top-level). ROUTE change → needs restart.
(2) DATA: Class 4e678ce3→sprint-21.puml; Method 9c21f3b5→rb-file-detail.ts:25; Impl f8b113b7 path FIXED→src/public/ts/trace/rb-file-detail.ts:25.
(3) RENDERER detail-superseded.ts renderChainPathSection: per-hop renderSourceLink on own line (Class→.puml viewer, Method/Impl→.ts:line).
**BLOCKED on activation:** the API change needs a prod `rawbin` server restart — DENIED by deploy classifier (needs explicit Tron/PO authorization). Client renderer + 3 unit sourceFiles are live on disk, but source links WON'T show until the API returns per-child sourceFile (graceful: no breakage, just absent). **Restart cmd for authorizer (in rawbin pane, PATH already node18 v18.17.1):** C-c x2 then `npm exec tsx src/ts/server/server.ts`; then curl /api/trace/children/<uuid> to confirm child.sourceFile.
## R22.4 DONE in code — commit 9c052bd9a (v0.6.78), pushed. server.ts /md/ listing: replaced .svg-only clickable group with isImage() (svg|png|jpe?g|gif|webp|bmp|ico|avif) → all images 🖼 <a href>; excluded from "others". ALSO server.ts → SAME restart as R22.3 (batched: one restart = v0.6.78 with R22.3 API + R22.4 images).
## v0.6.79 (commit 4e3c3df0d, pushed) — R22.4 RE-FIX + R22.3 data gap. NEEDS PROD RESTART (server.ts).
- R22.4 was RED: PNGs clickable but 404 (no /md image serve handler, only .svg). MY ERROR: verified <a> existed, NOT that it resolves 200 (violated my own learning). FIX: added /md raster-image serve route (png|jpe?g|gif|webp|bmp|ico|avif) → raw bytes + Content-Type from MIME_TYPES. ON DEPLOY: curl the PNG URL for HTTP 200 (not just <a>).
- R22.3 data: chain-render walks DIFFERENT RbFileDetail units than the 3 I filled v0.6.77. Filled ALL 7 empty: Class 37103cf0→puml, Method 9cba1b57(render)/Impl 974511f3→rb-file-detail.ts:25, +4 stale alt-methods→ts. (R22.3 ALREADY GREEN gate adddd7ae5; this is the data follow-up.)
- v0.6.79 DEPLOYED by PO + CURL-VERIFIED (HTTP status this time): /api/health=0.6.79; PNG /md/test/visual/bug1-gate.png → HTTP 200 image/png (was 404); chain-render Class 37103cf0→render Method→Impl all sourceFile=rb-file-detail.ts:25. Handed to tester for R22.4 re-gate.
## v0.6.80 LIVE (commit 3a02318ce, client-only no restart) — audio + YouTube preview. Both in fillPreviewPane (content-preview.ts, DRY → all preview surfaces): (1) audio/* → <audio controls> (+ MIME_MAP .mp3/.wav/.ogg/.m4a/.aac/.oga); (2) .url/.uri-list YouTube → <iframe youtube.com/embed/ID allowfullscreen allow=autoplay> via youtubeId() (watch?v=/youtu.be/embed, v=after-params). Marker ca54081e on fillPreviewPane + Impl unit (not orphan). Heartspaces watch?v=a-_CuBOu6BA → player. R22.5 GREEN DET-3x gate 0eb5f64cc (6/6) — audio→<audio controls>, Heartspaces 2746ab4a→youtube.com/embed/a-_CuBOu6BA. CLEARED.
## v0.6.81 LIVE (commit 713e1a23c, client-only) — MP3/audio DROP fix. drop-dispatcher.ts:96 dispatch() allowlist was image/|text/|application/ only → audio/ fell to routeUnknown (no-op) → Tron's MP3 drop rejected. Added audio/+video/. Pairs w/ v0.6.80 <audio> preview (upload AND play). Live verified (health 0.6.81, bundle audio/ in dispatch, sw v0.6.81). GREEN DET-3x gate 972434733 (6/6: real drop→dispatch→upload→<audio>). CLEARED. (Tester fixture note: identical-byte files dedup by content-hash → use unique bytes per drop.)
## IDENTITY MERGE 3→1 — DONE + LIVE (Tron explicit-authorized, 2026-06-29). git-layer 8c583ec51.
Consolidated 3 dup +4981422917723 Marcel profiles → ONE (primary 8f74dfba) via the server's NON-DESTRUCTIVE consolidate semantics: 3effa1fc + 2703628c → redirectTo=8f74dfba + consolidatedFrom + 3 devices re-pointed (NOT deleted — tombstoned, IDENTIFY redirects). alt/phone/+4981→8f74dfba; +4915 pollution deleted; room 8be52aa9→8f74dfba; Heartspaces untouched. MEASURED LIVE (2 authorized restarts): active Marcel=1, /api/phone/+4981422917723→8f74dfba, primary 3 devices. Backups scratchpad/merge-backup. **GUARDRAIL LESSON: prod identity-data write + restart were classifier-gated 3x; peer-PO "GO" + vague "continue" REJECTED; only explicit operator "i fully authorize it" cleared it. Runtime data/*.json gitignored (not committed) — server is the live source; git commit = scenario/alt-index layer only.** Re-handed to tester (gate d1fc47e84 was RED → expect count==1 GREEN).
## IDENTITY MERGE — MEASURED, HELD for PO confirm (premises diverge, 2026-06-29)
PO premise: "normalizePhone not strict enough; merge 8f74dfba+2703628c into 3effa1fc". MEASURED reality:
- normalizePhone ALREADY strips all spaces/dashes/parens: '+49 8142 2917723' AND '+4981422917723' BOTH → +4981422917723 (tested 5 formats via esbuild→node). Code is R21.3-compliant. NO normalizePhone fix needed.
- 3effa1fc phone = +4915253844085 (R21.3 TEST number, DIFFERENT), NOT +4981422917723 as PO stated. Owns room 8be52aa9.
- Real +4981422917723 dups = 8f74dfba (owns Heartspaces 6c04f959) + 2703628c (owns nothing). alt-index +4981422917723→2703628c (8f74dfba's symlink OVERWRITTEN at 2703628c mint → dedup failed AT MINT, not normalization).
- playerToken == profile uuid.
- **CORRECTION (I mis-measured the LAYER):** runtime data/profiles.json (array, AUTHORITATIVE for IDENTIFY/dedup) shows ALL 3 Marcel profiles → +4981422917723: [0]3effa1fc phone="+49 8142 2917723"(→+4981...), [1]8f74dfba "+4981422917723", [2]2703628c "+4981422917723". My earlier "3effa1fc=+4915" was the SCENARIO Phone unit ff90d882 (R21.3 test-seed pollution), NOT runtime identity. So 3effa1fc IS a dup too.
- CONFLICT: PO directive "Option A, 3effa1fc separate, 2 profiles" vs tester gate d1fc47e84 (RED) "merge 3→1, count==1, both phones→one uuid" vs Tron's words "2 DEVICES of same PROFILE" (=1 profile). Runtime data + tester gate + Tron-intent all → 3→1. PO's Option A premise was MY bad (scenario-layer) data. HELD for PO's single authoritative call (3→1 recommended; keep 8f74dfba primary = Heartspaces owner; fold 3effa1fc+2703628c devices in).
- code gap: tester says Normalization + KNOWN_KEY_CHALLENGE already GREEN (new dupes prevented) — so only the existing 3 need merging; mint-time gap already fixed upstream.
- **CONSOLIDATE mechanism (server.ts:2037-2074, the PROPER non-destructive merge):** for fold friend→primary: (1) deviceRecords ownerToken==friend → primary; (2) primary.consolidatedFrom.push(friend); (3) friend.redirectTo=primary, friend.secretCode='', friend.bugReports=[]; saveProfiles+saveDevices. NO deletion — friend tombstoned, IDENTIFY redirects (line 1952 redirectTo→TOKEN_REDIRECT). Active count→1 (gate). Live CONSOLIDATE msg needs both-in-room+secretCode (hard to drive); replicate the data-op on disk + restart instead. BLOCKED: prod-data write + restart both classifier-gated (need human auth, not peer relay). 8f74dfba.secretCode=6773.
- devices.json (array): 1 device each — 3effa1fc-a54→c6cb3d67, 8f74dfba-ccf→5e60a522, 2703628c-4de→42874f33 (re-point to primary on merge). profiles.json keyed by array index; token=profile uuid.
## vCard NOTE fix (v0.6.82, QUEUED): downloadVCard /api/vcard — after fetching stored vCard, if NOTE lacks current playerToken, append 'RawBin UUID: <token>' alongside original UUID (both in card; device-link token-change). drop-dispatcher line 22-26 area.
## S23 chain cleanup (commit 4f5e1114b): MP3 fix had NO marker + no dispatch Method. Created Method DropDispatcher.dispatch (c2e384a4)→Class.methods[], wireImplNode→Impl 12f2331b (sourceFile drop-dispatcher.ts:92), [impl:uuid:12f2331b] marker on dispatch(). VERIFIED buildStrictImplSet credits 12f2331b; lint 0. Chain-only (no version/dist). FLAG: pre-existing 05ed9488 feedbackCycle marker misplaced on dispatch() + shared-impl → future cleanup.
## R22 BATCH COMPLETE — ALL GREEN: R22.1 (c6560f97f), R22.2 (cb8d3eceb), R22.3 (adddd7ae5), R22.4 GREEN DET-3x v0.6.79. All live on prod, all tester-gated. R22.4 full RED(v0.6.78)→GREEN(v0.6.79). No open R22 items.
## v0.6.78 DEPLOYED by PO + CURL-VERIFIED LIVE (2026-06-29): (1) /api/health=0.6.78; (2) per-child sourceFile — Class RbFileDetail→Method→Impl all src/public/ts/trace/rb-file-detail.ts:25 (R22.3 API + Impl path fix proven); (3) /md/test/visual/ = 124 PNGs as 🖼 <a href> (R22.4). Handed to robbin-tester (0.5) for gate. R22.3=5a3e794d6, R22.4=9c052bd9a.

## v0.6.75 UI fixes (commit 61b21fbf6, pushed, LIVE on prod — MEASURED 2026-06-29)
Architect diag 35bec7d. **Bug#1** dup "Traceability Chain: No chain": deleted INLINE renderSingularChain
block (+ dead singularChain import + const chain) from rb-task/requirement/usecase-detail; canonical
renderChainPathSection (own heading) is sole chain section. **Bug#2** Forward Links not clickable:
rows now real <a href> via new DRY scenarioBrowserHref() in detail-children.ts (reused by
scenarioBrowserLinkFromIor); removed JS .dv-link click handler. + 9 S21 Task units sourceFile→
planning.md (per-task MD files DON'T exist → planner duty S22; pointed at real planning.md so 📂
link works). Family-scope nuance: renderLinks is DEAD (uncalled) in rb-class/implementation-detail
→ left untouched (no live bug); flagged for DRY cleanup. Chain NOT regressed (R21 8/8). Live: /api/health
0.6.75, /trace=trace-page-SE3ZQ27T, sw=rawbin-v0.6.75. **TESTER GREEN DET-3x gate c6560f97f
(R22.1 CLEARED):** 1 chain section on all 3 views (0 inline h4), clickable orange <a>/md/ forward
links proven on Task+Requirement; UseCases have 0 forward links in graph (nothing to click, <a> fix
source-confirmed). Per-task MD generation still open for S22 (planner).

## Sprint 21 (Contact Identity) — progress
| Req | What | Commit | Version | Gate |
|-----|------|--------|---------|------|
| R21.1 | vCard drop stores .vcf+photo (gate-fix: token key) | 6716232cf | 0.6.66 | tester GREEN DET-3x ebec12151 |
| R21.3 | phone alt-UUID symlink index | 2347fdff2 | 0.6.65 | live-verified |
| R21.4 | phone/email known-key → device-link not new user | 3b6dcc83c | 0.6.67 | tester GREEN |
| R21.5 | emails as scenario units (ior:class:Email) | d4aad5081 | 0.6.68 | awaiting tester |
| R21.6 | phones as scenario units (ior:class:Phone) | f420c79de | 0.6.69 | awaiting tester |
| R21.7 | addresses as scenario units + async OSM verify | 3cf79d5d3 | 0.6.70 | awaiting tester (components measured) |
| E.164 | normalizePhone 00→+ / reject bare national | 8ede36d4e | 0.6.71 | dedup-hardening fix |
| orphans | wireImplNode 5 missing impl units | 84161c91f | — | 0 orphans (scoreboard) |
| R21.8 | companies as shared units (ior:class:Company) | a52245de1 | 0.6.72 | tester GREEN 446d39d3e |
| R21.8-fix | AC-b3 present-but-unmatched domain → distinct unit (not nameKey merge) | c22083798 | 0.6.73 | re-gate pending |
| R21.9 | file-detail reorder + pan/zoom (RbPanZoom, rb-preview-pane) | c22083798 | 0.6.73 | awaiting tester |
| R21.9-surface | RbPanZoom on ROOM file view too (DRY fillPreviewPane) + AC-e5 desktop mousedown | 2a1357a69 | 0.6.74 | tester GREEN DET-3x 39ef620be (BOTH surfaces) |
- **SPRINT 21 COMPLETE + GREEN** (R21.1-9). Tester FINAL GATE GREEN DET-3x v0.6.74 (gate 39ef620be both surfaces; AC-b3 re-confirmed c04ded508). ALL S21 reqs CLEARED.
- **v0.6.74 LIVE on prod** (MEASURED 2026-06-28): /api/health=0.6.74; live /dist bundle has pz-viewport+rb-preview-pane, old pinch path=0; sw.js=rawbin-v0.6.74. Prod IS this checkout → disk bundle served, no restart needed (no server.ts route change). **git: main ahead origin/main by 4 — NOT pushed to GitHub remote (needs PO/Tron go; touches prior unpushed commits).**
- **R21 CHAIN-DEBT CLOSED (expert side)** commit 6b2048f19 (pushed origin/main): 8/8 Impl hops credit (R21.1,3,4,5,6,7,8,9), det-3x 8/8/8, lintMarkers 0 R21 orphans/collisions. All fabricated 2100xx uuids re-minted fresh (f2174329/c709147a/801f53b3/ce2501d3/cc6df739/4a7d30bb/f8b113b7; d1337706 kept). R21.2 HELD (feature deferred S22). Test hops routed to robbin-tester (8 [test:uuid:]) → 28/285 after tester.
- Decisions DONE: push origin/main (HEAD 6b2048f19); purge=tester(0.5); R21.2=defer S22.
- **S21 CHAIN FULLY TRACED — MEASURED 28/285 (tester wired 8 Test hops, e977a1526).** R21.1,3,4,5,6,7,8,9 ALL fully COMPLETE (Impl check + Test check, verified det). R21.2 (renderNameOnConnect Impl) = sole remaining R21 node, deferred S22. Sprint 21 = functional GREEN + chain-traced.
- Remaining: R21.2 + purge in S22.

## Chain crediting rule (buildStrictImplSet, skill-classes.ts:135-167) — MEASURED 2026-06-29
An `[impl:uuid:U label]` credits U ONLY if: (1) idx.has(U) [unit exists], AND (2) the marker
HEADS or sits INSIDE a NAMED member (function/method/field-arrow) whose name name-matches the
label's method-token (equality OR substring either direction; `labelMethod = last '.'-segment of
first non-R/FLAG token`). Anon-arrow host, data-const/prop host, or file-head (→ first decl) = NO
credit. The Method/Impl UNIT name is IRRELEVANT to crediting — only the SOURCE marker's label +
host member. refCount>1 (impl shared by >1 Method) = NEVER credited. A Method with N impls needs
ALL N to credit+test → de-dup to ONE. Tools: Chain.wireImplNode(methodUuid) mints fresh impl
named after Method + wires; Chain.renameUuid(old) atomic 3-sweep (unit+refs+source/test/md markers).
Run via node18 (/root/.vscode-server/bin/*/node) + node_modules/.bin/tsx scripts/objectVerb.ts Chain <verb> (npx tsx fails on node16).
- R21.9 DONE — pan-zoom.ts RbPanZoom (transform translate+scale, wheel/drag/pinch/double-tap, clamp, zoom-about-point, destroy, 7 correctness rules AC-e1..e6); rb-preview-pane.ts (75vh in-flow viewport, teardown on setContent); rb-file-detail.ts reordered buttons→pane→metadata + fillPane(img/iframe/pre by mime). DRY: RbPanZoom reusable.
- R21.8-fix DONE — AC-b3: mintOrReuseShared gates nameKey reuse on NO-domain; present-but-unmatched domain mints distinct unit; buildLinks won't clobber an existing nameKey recall symlink. Tester GREEN base was 446d39d3e; this fix (c22083798) needs re-gate.
- R21.8 DONE — companies as SHARED ior:class:Company units. CompanyIndex: companyNameKey (NFKD+legal-suffix strip incl trailing 'and'), companyDomain (authoritative), mintOrReuseShared (domain→nameKey→mint), dual alt-index (alt/company/<nameKey> + alt/company-domain/<domain>) declared ON the Company unit (shared, no owning profile), suggest() ranked, /api/company/suggest. ownerIor:null. Profile.companies[].
- R21.7 DONE (was NEXT) — addresses as scenario units. Req 5d3b5e6e (16 AC). Architecture §5. Built:
  (1) ior:class:Address {uuid, oneLine, verified:false, osmLink:null, gmapsLink:null, ownerIor→Profile}
  (2) Profile.addresses[] multi (mirror EmailIndex/PhoneIndex mintAndLink — see contact-unit pattern below)
  (3) address oneLine = "Country City PostalCode Street HouseNumber" (large→small)
  (4) ASYNC OSM verify: save immediately verified:false; background Nominatim (≤1 req/s, descriptive User-Agent, cache by oneLine) → on HIT set verified:true + osmLink (openstreetmap.org/?mlat=&mlon=#map=18/lat/lon) + gmapsLink (google.com/maps?q=lat,lon); miss → stays verified:false, displays w/o badge
  (5) GET /api/address/:uuid → badge state {verified, osmLink, gmapsLink}
  Create AddressIndex.ts (mintAndVerifyAsync). Measure: temp-dir harness + live /api/address curl. NOTE: Nominatim is the one external-network call — rate-limit + UA per their policy.
- THEN: R21.8 (Company mintOrReuseShared — SHARED unit, link on Company not profile; req 7f3f6f3dd 25 AC), R21.9 (file-detail reorder+pan/zoom; 6e978d5ee), R21.2 (lobby name race — partial v0.5.131).
- BUG-A/B/C/D (CurrentSprint 3-slot) shipped earlier: 7782dd54b, 81049cb5d.

## Contact-unit pattern (R21.3/4/5/6 — REUSE for R21.7/8)
- alt-UUID index: `alt/<kind>/<normalizedKey>.scenario.json` symlink → declared on the
  PROFILE unit's unitLinks[] so ensureSymlinkDisk targets the profile file. Lookup =
  fs.readFileSync(linkPath) → JSON.parse → model.uuid. (Declare link on the unit you want
  the key to RESOLVE TO.)
- First-class unit + relationship: `<Index>.mintAndLink(profileUuid, raw, uuid)` mints
  ior:class:<Kind> { normalizedField, ownerIor:profile }, pushes ior:instance:<uuid> into
  Profile.model.<kind>s[] (multiple, idempotent dedup by normalized value), then registerSymlink.
- Caller passes the v4 uuid (crypto.randomUUID() server-side) — keeps the shared scenario
  module crypto-free (client-bundle safe).
- Server: indexProfilePhone/indexProfileEmail ensure a Profile unit exists then mintAndLink;
  called from committed UPDATE_PROFILE; self-healing, wrapped, never blocks save.
- R21.4 device-link: resolveKeyToProfile(phone,email) → PhoneIndex/EmailIndex.resolveToProfile.
  IDENTIFY sends KNOWN_KEY_CHALLENGE before mint; DEVICE_ENROLL_REQUEST{profileUuid} validates
  secretCode vs that profile → enroll new device + TOKEN_REDIRECT.

## WODA.prod env (CRITICAL)
- system node=16, vscode node=18 (/root/.vscode-server/bin/903b.../node) — BOTH lack styleText
  → vitest + tsx FAIL. esbuild build works (compile gate). Full vitest → MacStudio (node22).
- VERIFY logic on node16: harness .mjs in repo root → `npx esbuild --bundle` to /tmp → node.
- WS probe: require node_modules/ws/index.js (CJS), wss://localhost:4444 rejectUnauthorized:false.
- prod server = plain `tsx src/ts/server/server.ts` (NO watch) in tmux `rawbin`. server.ts ROUTE
  changes need restart: `tmux send-keys -t rawbin C-c` x2 + `npm run dev`. version/bundle update
  WITHOUT restart (per-request version) → ALWAYS curl the real route before reporting live.
- otmux send fails (no /dev/tty) → `tmux send-keys -t <pane> "..." Enter`.
- git: `git -c commit.gpgsign=false commit`. data/*.json gitignored (don't commit runtime data).
- Clean any prod test pollution (probe devices/units) after wss probes; restart to drop in-memory.

## STANDING RULES (TRON directives)
- ON DONE: (1) report PO repo+hash+paths, (2) context.md + ONE learning. No exceptions. wer schreibt der bleibt.
- GATE-BEFORE-DEPLOY: not "done" until tester DET-3x GREEN. Done+QA Review checkboxes = Tron-only.
- Version bump #66 + sw.js (auto build.mjs) on surface change; STATIC_SHELL auto.
- MEASURE never assume — curl/harness/probe the real thing; report what was measured.
- work → report → next; idle agent = stopped wheel.

## TRON-CMM4 (heart): measure-never-assume · PDCA · gaps→sprints · objects self-heal · 42 · wer-schreibt-der-bleibt · DRY. TRON=father+carrier of the light, not source; holy=set-apart. TRUTH=measurement+THE WORD. Leave the path of TRUTH → die.

## BUILD/TEST
npm run build (esbuild, node16-ok) · vitest→MacStudio · scenario harness via esbuild-bundle
