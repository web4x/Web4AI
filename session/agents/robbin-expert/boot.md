# Boot: robbin-expert
*Save point 2026-05-25 (Sprint 9 T80 shipped). Read this first after rewind/compact.*

## You are: robbin-expert — Web4RawBin Implementation Authority
## Pane: robbinTeam:0.2
## Status: v0.5.4 (T94, commit f884672). PO SEQUENCE COMPLETE: ✓T91+T92(f2e019c) ✓T82(86256fa,v0.5.0) ✓T92-refix(057d491,v0.5.1) ✓T93(492221a,v0.5.2) ✓T83(c67bc11,v0.5.3) ✓T94(f884672,v0.5.4). Standing by.
## Latest commit: v0.5.6 (T100 DATA_DIR isolation, 21d46fa) — server-only, prod no-op (default byte-identical). Not yet deployed (no need for T100 test; tester sets DATA_DIR on their own test server).
## DEPLOYED: iphone:0.1 on v0.5.5 (T95 newest-first). v0.5.6 pending deploy on PO auth.
## AVATAR FIX DONE ✓ (2 halves, both DEPLOYED): (1) v0.5.9 commit 75053e4 rekeyUser() in UserCrypto re-encrypts files/* on rotation (tester 6/6 PASS). (2) v0.5.10 commit 0dc085e T109 ensureAvatar decrypt-FAILURE catch PRESERVES the file (no overwrite-with-default). Together: no new orphans + no destruction of existing → avatar never lost on rekey. rekeyUser = reusable guardrail for S14 T97. iphone:0.1 on v0.5.10, rooms=3. Tester verifying part 2.
## S15 BUILD (PO-approved sequence T103→T105→T106→T107→T108): ✓T101(caeb71b) ✓T102(74b33ad) ✓T103(fca4540 routing seam: TraceRouter/VerbRegistry/ViewBus/rb-trace-view in src/public/ts/trace/) ✓T105(950add4 rb-object-item draggable) ✓T106(e0df213 rb-list-overview+SearchProvider). NEXT: T107 (rb-detail-view + rb-overview, computed-from-graph) → T108 (rb-trace-tree capstone, sibling to file tree in /edit, GET /api/trace). Each: read task file, build, version-bump, commit+report, hand jsdom tests to tester. Latest v0.5.16. trace/ layer browser-only (extends HTMLElement); server uses only shared TraceModel.
## vCARD FIX shipped mid-sequence (commit 148e9b8 v0.5.14 DEPLOYED): downloadVCard photo from token + UUID in NOTE + base64 loop fix.
## T108 RELOCATED (2026-05-27, v0.5.22 DEPLOYED): Traceability is now a DOCS TOP-NAV choice (pageNav 'Traceability'→/trace next to App), NOT /edit sidebar. New GET /trace page + trace-page.ts bundle (build.mjs entry) mounts rb-trace-tree+detail off /api/trace; removed mountTraceBrowser from edit.ts. FIXED a /trace 500 crash: route referenced MD_CSS (const declared later in handleRequest = TDZ ReferenceError → HEADERS_SENT). Lesson: don't reference handleRequest's late local consts (MD_CSS@525) in early routes. /trace HTTP 200, rooms=3.
## S15 BUILD COMPLETE ✓ (R1-R7): ✓T101 ✓T102 ✓T103 ✓T105 ✓T106 ✓T107(ce15c08) ✓T108(b2a1104,v0.5.18 DEPLOYED). rb-trace-tree in /edit + GET /api/trace (live: 119 objects/14 broken/110 issues). Tester verified 787/787 batch + verifying T107/T108. Trace layer: src/public/ts/trace/ (TraceModel shared/DOM-free; views browser-only). viewRegistry() = production wiring; defaultRegistry = T103 proof.
## T99 COMPLETE ✓ (gate MET: T98 PASS + Tron auth). ec0423d(v0.5.19) removed loadFromDisk + deleted data/rooms + 141 token-* originals. THEN verify caught data/rooms REGENERATING via Room.persist dual-write → 9c1b0a0(v0.5.20) removed the legacy WRITE (persist per-user only), dropped persistDir/'data/rooms' default + dead loadFromDisk/fromPersisted/setPersistDir/removePersisted. Runtime-proven + live: new room create writes NO data/rooms; restart rooms=3 from per-user, data/rooms NOT recreated. Backup web4rawbin-pre-T99-backup-20260526T175321Z.tar.gz (sha256 4359315d…). Tester: full regression + UI-room-create no-data/rooms re-confirm. Sprint 14 fully closed (legacy consistently removed).
## Tester fixed playwright.config leak (now default-isolated, E2E_LIVE=1 opt-out) — uncommitted in tree, theirs to commit.
## jsdom gotcha: trace component self-register guard skips under vitest (module eval before customElements) — tests must ensure-define. Applied to my trace tests.
## S14 T96/T97 CODE DONE (commit 5dc7a53, v0.5.12): Migration.ts + migrate-cli.ts (npm migrate/migrate:rooms/migrate:userdirs) + migration.test.ts. Copy-only, idempotent, legacy untouched. T96 skip-already-per-user + quarantine orphans→_unowned. T97 copy token-*→UUID + rewrite owner refs + token-remap.json + defensive profile-redirect (no-op).
## MIGRATION RAN ✓ (PO-authorized 2026-05-26): T96 skipped=3/orphans=0; T97 migrated=141 token-dirs→UUID, remap data/migration/token-remap.json (141), roomsRewritten=0 (token dirs empty post-purge). Sanity ALL PASS: legacy data/rooms=3 + 141 token originals INTACT (copy-not-move), 141 new UUID dirs exist, 0 dangling token- refs in copies, 0 orphans. Server v0.5.12 rooms=3. Pre-migration backup web4rawbin-premigration-backup-20260526T185145.tar.gz (65M). Tester running T98. T99 removal STAYS Tron-gated — do NOT delete.
## ROOM PURGE DONE ✓ + RE-PURGED leak (2026-05-26). Allowlist KEEP fe4d5664 (Marcel Surface Mini) + 99e6a422 (Marcel Donges's Room). Backup web4rawbin-data-backup-20260526T161601.tar.gz (46M). data/ gitignored. PURGE MECHANISM: stop server (C-c, verify curl down) → guarded delete (assert both keep ids present, then rm non-allowlist in data/users/*/rooms/<uuid>/ + data/rooms/<id>.json) → restart.
## v0.5.7 DEPLOYED (commit 86780fc): T100 DATA_DIR + process.env.HTTPS_PORT/PORT override (unset=exact prod). T100 AC4 PASS (tester ed5c5de) — isolated run on 4445/tmp, prod untouched, no leak. Prod=3 REAL rooms (Marcel Surface Mini f4798dae + Marcel Donges's Room + Admins's Room, both 3dca7f5e Tron device). 7 disk-assert spec fails = tester's E2E_DATA_DIR follow-up.
## AC4 LEAK LESSON: Playwright reuseExistingServer:true reused live 4444 (prod data) → leaked. FIX recipe for tester: reuseExistingServer:FALSE + webServer.env{DATA_DIR:tmp,HTTPS_PORT:4445,PORT:4001} + baseURL localhost:4445 → fully isolated, no downtime.
## Tester verified: T80 21/21, T91, T92 re-fix 6/6, T93 4/4 (AC1-6), T78 1/1. Pending tester: T81/T82/T83/T84/T94. T92 gap: 1 live HTTP upload before Tron QA.
## Task dirs: T82/T83=sprint-10-contacts-ui/, T91/T92/T93/T94=sprint-13-stability/. T84=sprint-12-editor-fixes/.
## T93 plan (architect fix in task-93): per-user load on start+IDENTIFY (loop all data/users/<token>/rooms/*/room.json), reconcile legacy data/rooms, owner-aware listing via listRoomsForOwner so owner sees own private/empty rooms. AC1-6. My deploy evidence already in task-93.
## Shipped/pending verify: T80 (25b1e47) Done. T78 (f5d7df4) accepted. T81 (f083a29) handed. T84 (24482f7) handed.
## iphone:0.1 DEPLOYED v0.4.10 (PO-authorized 2026-05-26). /api/health=0.4.10, rooms:191. Restart ritual worked via otmux send (C-c; cd+git pull+build+dev).
## T93 FINDING (evidence in task-93, commit 8fe057a): legacy data/rooms (191) shadows per-user persistence (173) at startup — loadFromDisk() loads legacy first, scanAllRooms skips all overlapping IDs (loaded=0). "Only one shows in lobby" = likely listRooms/broadcastRoomList FILTER, not load. Architect owns T93 refinement.
## Task source dirs: T81=sprint-10-contacts-ui/, T84=sprint-12-editor-fixes/. T84 fix in EDITOR bundle (edit-*.js), not app.js. T84: parent dir from this._path w/ root guard (/md/ not //), ← Back label.

## Immediate actions:
1. Read context: `session/agents/robbin-expert/context.md`
2. Read learnings: `session/agents/robbin-expert/learnings.md`
3. Check PO for tasks: `otmux pane.capture robbinTeam:0.0 20`
4. Resume / await assignment

## Key facts:
- Project: Web4RawBin at /Users/Shared/Workspaces/2cuGitHub/Web4RawBin
- Live: https://home.donges.it:4444/app — server on iphone:0.1
- v0.4.0: per-user persistent rooms with RSA-2048 SSH keypairs (RoomKeys.ts)
- 663/663 vitest (14 files), 15 Playwright
- 13 Web Components, Monaco editor, encrypted avatar storage

## Deploy ritual (every version):
bump package.json version → npm run build → git push → restart iphone:0.1:
`tmux send-keys -t iphone:0.1 C-c; sleep 2; tmux send-keys -t iphone:0.1 "cd /Users/Shared/Workspaces/2cuGitHub/Web4RawBin && git pull && npm run build && npm run dev" Enter`
then verify: `curl -sk https://localhost:4444/api/health`

## T78 NEXT (PO-assigned): room card UUID/owner display + persistence indicator. Default room name from profile.name (already done in T74). app.css already has .room-owner/.room-id stubs (uncommitted). See task-78-client-updates.md + requirements.md.
## Sprint 9 also remaining: UC-RM.2 room persistence on mutation, UC-RM.4/5 dormant rooms + owner-connect advertising, remove cleanupStale auto-delete, migrate data/rooms/*.json

## Rules:
- Wait for assignment from PO (robbinTeam:0.0). Self-report there via otmux send.
- Never assume — always measure (curl /api/health, read the file).
- tsc + build + test before reporting. Verify with real WS/Playwright, not assumptions.
- Tron QA gate: sprint.done does NOT auto-check QA Review.
