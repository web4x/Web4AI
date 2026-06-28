# robbin-expert Context — Save Point 2026-06-28 (WODA.prod, Sprint 21 active)

**Role**: Web4RawBin Implementation Authority
**Machine**: WODA.prod · **Pane**: robbinTeam2:0.1
**Repo (WODA.prod)**: /var/dev/Workspaces/2cuGitHub/Web4RawBin · **Live**: prod.wo-da.de:4444 (tmux session `rawbin`)
**AI/Claude repo** (context/learnings): /var/dev/Workspaces/AI/Claude
**Current version**: v0.6.69.

## Sprint 21 (Contact Identity) — progress
| Req | What | Commit | Version | Gate |
|-----|------|--------|---------|------|
| R21.1 | vCard drop stores .vcf+photo (gate-fix: token key) | 6716232cf | 0.6.66 | tester GREEN DET-3x ebec12151 |
| R21.3 | phone alt-UUID symlink index | 2347fdff2 | 0.6.65 | live-verified |
| R21.4 | phone/email known-key → device-link not new user | 3b6dcc83c | 0.6.67 | tester GREEN |
| R21.5 | emails as scenario units (ior:class:Email) | d4aad5081 | 0.6.68 | awaiting tester |
| R21.6 | phones as scenario units (ior:class:Phone) | f420c79de | 0.6.69 | awaiting tester |
| R21.7 | addresses as scenario units + async OSM verify | 3cf79d5d3 | 0.6.70 | awaiting tester (components measured) |
- **NEXT ASSIGNED: R21.8** (v0.6.71) — Company mintOrReuseShared. Req 7f3f6f3dd/f1a49e3c1 (25 AC). Architecture §4. SHARED unit (ownerIor:null), dedup by nameKey=name.toLowerCase().replace(/[^a-z0-9]/g,''). alt/company/<nameKey> symlink declared on the COMPANY unit (the ONE case where the alt-link lives on the resolved unit, since many profiles share it). mintOrReuseShared(name): nameKey → hit alt/company → reuse uuid; miss → mint ior:class:Company {uuid,name,nameKey,ownerIor:null} + alt-link. Profile.companies[] push. Architect refined recall(nameKey) vs precision(domain+user-confirm) — read req. Then R21.9 (file-detail reorder+pan/zoom 6e978d5ee), R21.2 (lobby name partial v0.5.131).
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
