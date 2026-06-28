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
- Server: HTTPS 4444 | last gated Version: **0.6.62**
- Chain: champagne standard (det-3x honest)

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
