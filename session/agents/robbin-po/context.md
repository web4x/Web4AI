# robbin-po Context — Save Point 2026-05-24 (Pre-Rewind)

**Role:** Product Owner
**Pane:** robbinTeam:0.0 on MacStudio
**Project:** RawBin (Web4RawBin)
**Repo:** /Users/Shared/Workspaces/2cuGitHub/Web4RawBin/
**Server:** https://home.donges.it:4444/app (v0.2.29, 485 tests, 70KB bundle)

## Delivery History — 7 Sprints, 59 Tasks, Empty Repo to Production PWA

### Sprint 1 — Foundation (6/6 DONE, 2026-05-22)
- T1: Team bootstrap (cloned from upDownTeam)
- T2: Architecture plan (QnD fork analysis, architect 458-line audit)
- T3: Room.ts (297 lines, 33 tests, 3 alignment iterations)
- T4: server.ts stripped (1681→910 lines, profiles+devices separated)
- T5: Client UI (RoomBrowser, RoomView, RawBinClient, 637 lines)
- T6: Rebrand UpDown→RawBin (zero references remaining)
- Key commit: first sprint completed in one session

### Sprint 2 — Identity & SSH (7/7 DONE, 2026-05-23)
- T7: ProfileEditor (name/phone/url/avatar/secretCode, gate+normal modes)
- T7.0: MD browser PUML/SVG support
- T8: Mandatory profile gate (new users must commit profile before rooms)
- T9: UserKeys.ts (RSA-2048 via Node.js crypto, OOSH .ssh/ directory pattern)
- T10: Device enrollment (secret code → device keypair → user key signing)
- T11: vCard download (ProfileSheet, V3.0 format)
- T12: SSH challenge-response login (Web Crypto RSASSA-PKCS1-v1_5)
- Key decision: encryption-at-rest (server holds keys), E2E deferred

### Sprint 3 — E2E & Hardening (10/10 DONE, 2026-05-23)
- T13: Playwright E2E (6 specs, gate→room→chat→leave journey)
- T14: Integration tests refactored to unit (202→all pass in 2.9s)
- T15: MD browser SVG/PUML routes + PROJECT_ROOT fix
- T16: Deployment (rawbin.sh auto-restart, stop.sh, /api/health, log rotation)
- T17: Session flow bugs fixed (ROOM_JOINED not sent to creator — root cause)
- T18-T20: UX parity (header, member badges, chat bottom sheet from UpDown)
- T21: Tron feedback (profile edit button, avatar upload, QR invite)
- T22: Lobby fixes (private room key, Watch removed, md linking)
- Key learning: ROOM_JOINED missing was the root cause of all session bugs

### Sprint 4 — Traceability (8/8 DONE, 2026-05-23)
- T23-T25: Audit all task files (136 unchecked AC, 28 missing dates)
- T26: Web4Articles CMM3 templates (hierarchical Status checklist)
- T27: OOSH sprint tool (522 lines, 7 methods)
- T28: Fix all 33 task files (3 rejections before correct — learned CMM3)
- T29: Sprint tool update (template enforcement)
- T30: PO process doc (scrum.pmo/roles/PO/process.md)
- Key learning: Web4Articles Status is hierarchical checklist, not flat field

### Sprint 5 — PWA Offline (6/6 + hotfixes, 2026-05-23)
- T31: Service worker (pre-cache app shell, cache-first/network-first)
- T32: Cache headers (content-hash JS, ETag 304, no-cache for HTML/SW/CSS)
- T33: Auto-reconnect (exponential backoff, message queue, replay)
- T34: One-click update (RED banner, version check, skipWaiting)
- T35: iOS PWA (Apple meta tags, splash screens, icon-180)
- T36: IndexedDB offline persistence
- T37: Hotfixes (private room key, CSS, RED update bar, version 0.2.0)
- T38: iOS safe-area insets for headers
- Key bugs: SW CACHE_NAME was static 'rawbin-v1' — never purged old assets
- Key fix: CACHE_NAME versioned per build (rawbin-v0.2.X)

### Sprint 6 — Web Components (8/8 DONE, 2026-05-24)
- T39: rb-update-banner (84 lines, Shadow DOM, cross-page)
- T40: rb-header (46 lines, deduplicated header with attributes+events)
- T41: rb-overlay (60 lines, shared modal base class)
- T42: rb-chat-sheet (155 lines, Shadow DOM, RoomView 372→127 lines)
- T43: rb-member-badge + rb-member-list
- T44: Server pages shared shell (all pages get rb-update-banner)
- T45: rb-qr-popup (Shadow DOM)
- T46: Cleanup (dead code, E2E selector updates for Shadow DOM)
- Key decision: Light DOM default, Shadow DOM for chat-sheet + qr-popup only
- Key metric: RoomView 372→122 lines (-67%), app.ts 140→91 lines (-35%)

### Sprint 7 — Encrypted Storage + Avatar (13 tasks + hotfixes, 2026-05-24)
- T47: UserCrypto.ts (112 lines, hybrid RSA+AES-256-GCM)
- T48: Default avatar (thispersondoesnotexist → encrypted storage)
- T49: GET /api/avatar/:token (decrypt+serve, ETag, fallback)
- T50: POST /api/avatar (upload+encrypt, unlimited size)
- T51: ProfileEditor upload via API (not WS base64)
- T52: Avatar visible everywhere (lobby, profile, vCard)
- T53: Room member avatar from profile (removed per-connection random faces)
- T54: Cleanup (removed avatarCache)
- T55: Avatar backfill for existing profiles
- T56: rb-avatar Web Component (clickable, fullscreen zoomable overlay)
- T57: Lobby DRY, JS pinch-zoom, crop position save
- T58: Link contrast (white unvisited, light blue hover)
- T59: Floating back button on /md/ file views
- Hotfixes: size limits removed (v0.2.23), update banner race (v0.2.24), SW cache versioning (v0.2.25-26), crop percentage normalization (v0.2.27-28), avatar retry+SVG fallback (v0.2.29)
- Key PDCA: architect's use case diagram identified avatar refresh + crop bugs
- Key achievement: team self-caught update banner notch bug (v0.2.8)

## Architectural Decisions
1. QnD fork — strip game logic, keep infrastructure (7549→2161 lines)
2. SSH keys per user (OOSH .ssh/ directory pattern in Node.js)
3. Device enrollment via secret code + RSA signing
4. Hybrid RSA+AES-256-GCM encryption at rest
5. Vanilla Web Components (no framework, Light DOM default)
6. PWA with versioned SW cache (CACHE_NAME = rawbin-v{version})
7. object-position for avatar crop (not transform:translate)

## Version History
0.1.0 Sprint 1 foundation
0.2.0 Sprint 5 PWA milestone
0.2.1-0.2.6 Sprint 5 hotfixes (port, private room, update banner, CSS, safe-area, SW cache)
0.2.7-0.2.8 Sprint 3 safe-area for all headers (team self-caught notch bug)
0.2.9-0.2.13 Sprint 6 Web Components
0.2.14-0.2.19 Sprint 7 encrypted storage + avatar pipeline
0.2.20-0.2.29 Sprint 7 hotfixes (backfill, crop, upload, retry+SVG fallback)

## Active Work
- Sprint 8: Monaco editor for markdown browser (robbin-req writing requirements)
- Planner at 1.0 monitoring sprint consistency (0 issues)
- robbin-req at 1.1 (requirements engineer, forked from architect)

## Team Coordination Patterns
- PO → planner: "sync these changes" (planner updates files)
- PO → expert: task assignment via otmux with task file reference
- PO → architect: design review requests, PUML diagrams before fixes
- PO → tester: test assignment in parallel with expert
- PO → oosh team: pane operations, hiveMind state checks
- Expert → PO: self-report via otmux send
- Full PDCA Check: tester verify → architect review → PO verify → then Tron
