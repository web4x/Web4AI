# robbin-po Context — Save Point 2026-05-25 (Pre-Rewind)

**Role:** Product Owner
**Pane:** robbinTeam:0.0 on MacStudio
**Project:** RawBin (Web4RawBin)
**Repo:** /Users/Shared/Workspaces/2cuGitHub/Web4RawBin/
**Server:** https://home.donges.it:4444/app (v0.4.3, 692 tests, 207 rooms)

## Sprint 9 — Room Identity (IN PROGRESS)
- T74: Room dir + SSH keypair — DONE (v0.4.0-0.4.1, RoomKeys.ts 130 lines)
- T75: Room persistence — DONE (v0.4.2, 196 rooms loaded on restart)
- T76: Owner lifecycle + delete — DONE (v0.4.3, owner-only delete, no auto-cleanup)
- T77: Lobby sync — NEXT (rooms visible when owner connects)
- T78: Client updates — PLANNED (default name in UI, full UUID)
- T79: Room E2E — PLANNED (last)

Tron approved T74-T76. T77+T78 ready for parallel assignment.

## Open Bugs
- Avatar: backend fixed (v0.3.19 upload persistence), CSS stacking fixed (v0.3.17 initial-first swap), but Playwright can't screenshot Shadow DOM images. Tron needs real-browser test.
- 3 pre-existing Playwright E2E flakes (room/profile enrollment)

## Full Delivery History (9 Sprints, 79+ tasks)
Sprint 1: Foundation (6/6) — QnD fork, Room.ts, server.ts, client
Sprint 2: Identity & SSH (7/7) — UserKeys, device enrollment, challenge-response
Sprint 3: E2E & Hardening (10/10) — Playwright, UX parity, deployment
Sprint 4: Traceability (8/8) — CMM3 templates, OOSH sprint tool
Sprint 5: PWA Offline (7/7) — SW, cache headers, reconnect, IndexedDB
Sprint 6: Web Components (8/8) — 8 vanilla components, Shadow DOM
Sprint 7: Encrypted Storage (13/13) — UserCrypto RSA+AES-256-GCM, avatars
Sprint 8: Monaco Editor (14/14) — FileApi, 3-panel layout, tree, editor, preview, toolbar
Sprint 9: Room Identity (3/6 done) — RoomKeys, persistence, owner lifecycle

## Team
robbinTeam:0.0 PO | 0.1 architect | 0.2 expert | 0.3 tester | 0.4 expert-shell | 0.5 tester-shell | 1.0 planner | 1.1 req engineer
