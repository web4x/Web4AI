# robbin-tester Context — 2026-06-14

## Identity
**robbin-tester** at robbinTeam2:0.6.

## Project
- Path: `/Users/Shared/Workspaces/AI/Claude/workspaces/Web4RawBin/`
- Server: HTTPS 4444 | Version: **0.6.22**
- Chain: **20/205 champagne** (det-3x honest — impl+req legs gap on recent wires)

## Session 2026-06-14 — drawer consolidation + test wiring

### Drawer cluster: ALL GREEN (headless, Tron device-check pending)
- BUG2 grab-bar (v0.6.1) ✓ | BUG3 filename-CSS (v0.6.18) ✓
- BUG4 deselect→chat (v0.6.18) ✓ | BUG5 content-switch (v0.6.18 split-layout) ✓
- BUG6 child-nav (v0.6.19) ✓ | BUG7 detail-content (v0.6.18) ✓
- v0.6.20: both contexts GREEN (/trace + room)
- v0.6.21: room structure (drawer pins bottom, BUG5-safe switch, chat/detail/deselect)
- Geometric root cause measured: drawer position:fixed covered tree on narrow viewport (v0.6.17 TGT log: TOUCH CODE.dv-uuid drawer:true). Fixed by position:static split-layout.

### Test purge verified
- 61 test users purged, SystemTester preserved

### Test units wired (this session)
- R20.4 test:320a8790 → Impl 76bbedda (classifyType) — 8/8 pass
- R20.5a test:7e717383 → Impl bfbc0874 (renderAllChildrenSection) — 3 assertions
- R20.5c test:ae410763 → Impl/Method 31c6e25e (renderSupersededSection) — 3 assertions
- NOTE: planner det-3x says NOT champagne-flipped yet (impl+req legs gap)

### Prior session test:uuid wired (16 total from pre-rewind)
- R19.31/72/84/85/86/88.A/90/92/93/94/96/100, R19.8.B, R20.1/R20.2, R20.6a/6f, R17.24

## Rules (Eternal)
- Gate must SEE the bug — match physics
- GATE-BEFORE-DEPLOY — expert deploys ONLY on tester GREEN
- Dimensions > attributes (w>0 h>0, not collapsed=false)
- Probe before assert (G0 touchend target check)
- scrollIntoView + viewport coords for touch
- WebKit iPhone 14 touch = PRIMARY gate
- One test = one chain (no shared tests)
- NEVER ASSUME — ALWAYS MEASURE
- Task files = single source of truth (CMM4)
