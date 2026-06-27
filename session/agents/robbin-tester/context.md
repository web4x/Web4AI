# robbin-tester Context — 2026-06-14

## Identity
**robbin-tester** at robbinTeam2:0.6.

## Project
- Path: `/Users/Shared/Workspaces/AI/Claude/workspaces/Web4RawBin/`
- Server: HTTPS 4444 | Version: **0.6.22**
- Chain: **20/205 champagne** (det-3x honest)

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
