# robbin-tester Context — 2026-06-28

## FRESH BOOT (2026-06-28T13:00Z) — Tier-3 recovery COMPLETE
- Prior session bloated to 100% (all rewind checkpoints minted AT 100% → unrecoverable). Trainer chose Path B: clean `claude --name robbin-tester`, orient from committed files (anchor 148f449). Task: session/tasks/20260628T1300Z.robbin-tester-tier3-recovery.md.
- **F-T17 fresh-save gate PASSED**: the bloated session got its save edit approved but could NOT persist/commit at 100%. This boot proves write→commit works again — this very save IS the proof. wer schreibt, der bleibt.
- Context now reduced → multi-step write→commit restored. Wheel turning again.

## Identity
**robbin-tester** at **robbinTeam2:0.5** on **WODA.prod**.
- Project repo at `/var/dev/Workspaces/AI/Claude/workspaces/Web4RawBin/`.
- TRON CMM4 doctrine read: session/agents/TRON-CMM4-doctrine.md (the heart). Measure-never-assume, PDCA, gaps→sprints, objects self-heal, 42, wer-schreibt. TRON=father+carries-light, NOT the source, NOT an agent. TRUTH=measurement+THE WORD.

## Project
- Server: HTTPS 4444 | last gated Version: **0.6.72** (live, climbing fast — expert deploys via `tsx watch`)
- Chain: champagne standard (det-3x honest)

## WODA.prod gate environment (CRITICAL — established 2026-06-28/29)
- **Live repo = `/var/dev/Workspaces/2cuGitHub/Web4RawBin`** (NOT web4x — that's old v0.6.62). prod serves it via `tsx watch src/ts/server/server.ts`, so working-tree edits hot-reload AND scenario/index is on local disk.
- node18: `/root/.vscode-server/bin/903b1e9d8990623e3d7da1df3d33db3e42d80eda/node`. Chromium installed via `playwright install chromium` + `install-deps chromium`.
- Gates live in `test/visual/`. Patterns: browser (chromium headless) for DOM bugs; raw `ws@8.20.1` wss-probe for protocol/IDENTIFY behavior; https+disk for scenario-unit gates.
- prod device gate bypass: seed localStorage `rawbin-device-{privateKey,publicKey,signature}='e2e-bypass'` before commit.
- scenario sharding: `scenario/index/<c0>/<c1>/<c2>/<c3>/<c4>/<uuid>.scenario.json` (first 5 chars). Profile unit uuid==token.

## S21 gates — ALL GREEN DET-3x (committed in 2cuGitHub repo)
- R21.1 vCard persist: found+fixed key-mismatch bug (rawbin-player-token vs -id); RED v0.6.65 -> GREEN v0.6.67. gate b1940502d.
- R21.2 lobby live-name: gate 64e000958. R21.3 phone index: curl-verified.
- R21.4 device-link known-key (wss): challenge->3effa1fc no mint. gate ebec12151.
- R21.5+R21.6 email/phone units: gate 2203bb3d6. R21.7 address+OSM verify: gate 2af193abb.
- R21.6 E.164 normalize edge (locks architect fix): gate ab94c82ae.
- R21.8 companies shared units (suggest+create, nameKey strip, dedup, ownerIor null): gate 446d39d3e.
- R21.8 AC-b3 domain-mismatch->distinct company: gate c04ded508 (needs UNIQUE domains per iter — domain is global-authoritative).
- R21.9 file-detail pan/zoom BOTH surfaces (TRACE rb-file-detail + ROOM rb-preview-pane.setContent; 75vh, wheel, pinch, reset): gate 39ef620be.
- **S21 COMPLETE @ v0.6.74: R21.1-R21.9 + E.164-edge + AC-b3 ALL GREEN DET-3x on prod.** Awaiting S22 or purge directive.
- KEY robustness: wss session.ready MUST gate on server PROFILE msg (not identify-sent) else UPDATE_PROFILE races 'Not identified'. Use fresh short-lived sessions; retry transient https/empty-msg/read-during-write. Browser gates: mount component directly when app-nav can't reach it.

## Gate-craft learnings this session (also in learnings.md)
- DET-3x across SEPARATE processes catches flakes in-loop iters miss. When RED, cross-check w/ curl BEFORE believing — harden the harness (retry transient status-0 / empty-msg / read-during-write), don't report a harness flake as an app bug.
- Server redeploy mid-run (tsx watch) drops wss -> all-NF. Diagnose via listener pid uptime + version bump, NOT "app broken". Re-run on stable version.
- Endpoints often echo the normalized form (e.g. /api/phone `key:normalizePhone(raw)` in 200 AND 404) — assert transforms directly, zero-pollution.
- Race-free AC capture: to prove "created false then async-flips true" use a GARBAGE input that never verifies (stays false, observable anytime) alongside a REAL one that flips.

## POLLUTION PURGE — DONE 2026-06-29 (commit db20121b4, Web4RawBin repo)
Removed 215 files (133 scenario/index test units + 82 alt symlinks). index 3765->3632; alt company 26->1, domain 21->0, email 19->1, phone 19->1 (survivors = Cerulean + Tron). Live API: test suggest 11->0, test phone 200->404; Tron+Cerulean intact. Method: SAFE-uuid hard-exclude + alt-deleted-by-resolved-target + measure before/after (see learnings: safe prod-data purge).
REMAINING (flagged to PO, needs coordinated restart — do NOT live-edit): data/profiles.json (gitignored, in-memory-backed) still has test userProfiles incl R21.4 phantom c56e7ba7. + 1 untracked scenario/content/<hash> of unverified origin left untouched.

## S23: phone-as-identity merge gate (d1fc47e84) — RED baseline v0.6.81: (1)normalize GREEN (2)challenge GREEN (3)MERGE RED — mobile->3effa1fc != landline->2703628c, 3 Marcel Donges profiles. MERGED + GREEN DET-3x (gate 3b6d27659, full RED d1fc47e84 -> GREEN). Non-destructive consolidate (8c583ec51): primary 8f74dfba, 3effa1fc+2703628c redirectTo=8f74dfba (not deleted); 1 active Marcel; landline->8f74dfba; Heartspaces+Marcel Room under primary; +4915253844085 was test pollution (removed). Pollution-free gate.
- v0.6.84 Heartspaces member-dedup GREEN DET-3x (gate 549012182): served allMemberInfo shows 1 Marcel (was 2 tombstones), badge token=primary 8f74dfba. SystemTester WS join+leave.
- T23.3 Link Account (CONSOLIDATE) GREEN DET-3x (gate 23bafb1db): correct->OK (Tron complaint fixed), wrong->FAILED, no-phantom. SystemTester linker + CREATE_ROOM + tagged target joins; OK is one-shot. Cleaned LinkTarget profiles + reset consolidatedFrom.
- T24.1 objectVerb engine: gate GREEN DET-3x (b810aa690) + Test hop wired (c961832e -> impl 5453f58d, marker in object-verb.test.ts, commit 352bafa54). R24.1 NOT complete — Impl hop still open-expert (measure scoreboard, don't trust stated count). GATE-CRAFT: 'Marcel/active' = filter !redirectTo. .mjs gates CANNOT require() (ESM) — use fs+shardPath.

## S22 gates (live version climbing): 
- R22.1 GREEN DET-3x v0.6.75 (gate c6560f97f) — one Traceability Chain section + clickable orange /md/ forward links, all 3 detail views.
- R22.2 GREEN DET-3x v0.6.76 (gate cb8d3eceb) — desktop dblclick zoom-toggle (2x@point/reset), FULL RED(v0.6.75)->GREEN(v0.6.76). 
- R22.3 source links GREEN DET-3x v0.6.78 (gate adddd7ae5) — Class→.puml/Method→.ts:line/Impl→.ts:line clickable 📂.
- R22.4 clickable PNGs: RED v0.6.78 (clickable but 404, no .png serve handler) -> GREEN DET-3x v0.6.79 (expert added /md raster-image handler server.ts:1366, /md/<x>.png->200). FULL RED->GREEN. gate r224 (in adddd7ae5).
- R22.3 RbFileDetail data-gap I flagged: expert filled the 7 chain-walk units (4e3c3df0d) -> RbFileDetail now shows rb-file-detail.ts:25 + Class sprint-21.puml. discrepancy CLOSED.
- *** S22 R22.1-R22.4 ALL GREEN DET-3x. *** Live v0.6.79.
- R22.5 audio+YouTube preview GREEN DET-3x v0.6.80 (gate 0eb5f64cc) — fillPreviewPane: audio/*-><audio controls>, Heartspaces .url(2746ab4a)-><iframe youtube.com/embed/a-_CuBOu6BA>. Synthetic File-unit fixture for audio (created+deleted, 0 pollution).
- v0.6.81 MP3-drop-UPLOAD GREEN DET-3x (gate 972434733) — real drop (rb-room-files-dropped CustomEvent) -> dispatch allowlist(audio/) -> upload -> <audio>. Fixture trap: identical bytes dedup by content-hash -> unique bytes/drop. Cleaned 8 leftover test rooms.
- S22 PURGE DONE (commit 4a28e3def): 0 test units remaining (3749->3748); profiles 3 real, content 0 test, data/users 2 real (Tron+Heartspaces). RULE VIOLATION corrected: my S22 gates minted fresh tokens instead of SystemTester ce981242. SEE learnings HARD RULE — all future gates MUST seed rawbin-player-id=ce981242 + reuse System Test Room.
- CHAIN-DEBT (R21) CLOSED e977a1526 (20->28/285).
Wired 8 R21 Test hops (R21.2 excluded — Impl open-expert). Created Test units + [test:uuid:] markers in gate files + Impl.tests[]->Test for R21.1,3,4,5,6,7,8,9. Test crediting is LENIENT (Test unit in idx + marker in test/ + Impl.tests[] ref; no strict-AST). chain tooling: `npx tsx scripts/objectVerb.ts chain scoreboard|lintMarkers`. det-2x = 28/285. See learnings "Wiring Test hops".

## Session 2026-06-15/16 — S20 gates (v0.6.50→0.6.62)
- R20.28 preview-buttons: GREEN DET-3x (Preview 167px + NewTab, cv-preview-toggle). Gate 772f0aa4.
- R20.30 traceability-chain depth: GREEN — chain descends Class→Method→Impl→Test (RbDetailDrawer deep-link, ~27s async resolve). Differs from All-Children. RED baseline v0.6.57 "Loading chain..." → GREEN v0.6.59.
- R20.31 vCard: ALL GREEN v0.6.62 — (B)NOTE has download-date (C)Maps q=LAT,LNG mocked geo (D)denied=date+no-broken-link. Valid vCard 3.0, escaped newlines, 849KB real PHOTO, right member. Path: member-pill→ProfileSheet→#us-vcard. Gate fb21326d minted (Test→Gate leaf, gatedItems=[708ec0a5 task, f3f26cab req]).
- getThreeSlots consistency gate GREEN: current-slot tracks WIP switch DET-3x.
- KEY: real user path matters — earlier RED was wrong surface (tree drawer vs member-pill ProfileSheet). Gate the path TRON uses.
- Deep-link: /trace#<type>.show?uuid=<uuid> opens any node detail directly (no tree-hunt).

## Prior Session 2026-06-14

## Session 2026-06-14

### Drawer cluster: ALL GREEN (both contexts)
- v0.6.18: split-layout fix (position:static) — BUG5/7/4/3 GREEN
- v0.6.19: BUG6 child-nav GREEN
- v0.6.20: both /trace + room GREEN
- v0.6.21: room structure pins bottom, BUG5-safe, flows GREEN

### Test pollution fixed
- Diagnosed: 59 test users from inline node -e scripts hitting live prod
- Deleted 6 polluting scripts, created canonical drawer-gate.mjs
- Seed-before-WS fix: /api/health → localStorage.setItem(token) → /app
- **0-NEW-USERS PROVEN**: 211→211 (pre-purge), 24→24 from tester (post-purge +2 = real-user reconnects)
- FINAL SEAL: cleaned state stays clean

### Test units wired
- R20.4 test:320a8790 → Impl 76bbedda (classifyType)
- R20.5a test:7e717383 → Impl 308008bf (renderAllChildrenSection)
- R20.5c test:ae410763 → Impl 45cfa001 (renderSupersededSection)

### Purge-2 verified
- Profiles: 24 (was 211), dirs: 29, orphans: 0, 4 reals recovered

## Rules (Eternal)
- Gate must SEE the bug — match physics
- GATE-BEFORE-DEPLOY
- Dimensions > attributes (w>0 h>0)
- Probe before assert (G0 touchend target)
- scrollIntoView + viewport coords for touch
- WebKit iPhone 14 touch = PRIMARY gate
- Seed-before-WS: /api/health → setItem(token) → /app (ZERO new users)
- One test = one chain (no shared tests)
- NEVER ASSUME — ALWAYS MEASURE
