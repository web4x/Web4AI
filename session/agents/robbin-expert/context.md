# robbin-expert Context — Save Point 2026-06-28 (WODA.prod, Sprint 21 active)

**Role**: Web4RawBin Implementation Authority
**Machine**: WODA.prod · **Pane**: robbinTeam2:0.1
**Repo (WODA.prod)**: /var/dev/Workspaces/2cuGitHub/Web4RawBin · **Live**: prod.wo-da.de:4444 (tmux session `rawbin`)
**AI/Claude repo** (context/learnings): /var/dev/Workspaces/AI/Claude
**Current version**: v0.6.74 (R21.1-9 impl complete + E.164/AC-b3 + R21.9 surface-fix).

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
