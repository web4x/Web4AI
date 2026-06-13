# robbin-tester Context — 2026-06-13

## Identity
**robbin-tester** at robbinTeam2:0.6.

## Project
- Path: `/Users/Shared/Workspaces/AI/Claude/workspaces/Web4RawBin/`
- Server: HTTPS 4444 | Version: **0.5.238**
- Chain: **173/198** (25 open — all architect/expert blocked)

## v0.6.0 Marathon Summary

### Gate evolution (the hard lesson)
- v0.5.219: sticky-collapsed gate (wrong manifestation — PO corrected)
- v0.5.222: dimensions gate found 0x0 items (real bug — auto-expand missing)
- v0.5.225: triple-render found (11x over-render), race NOT reproducible
- v0.5.227: overflow:hidden clip found (.room-view clipper)
- v0.5.232: touch gate added — ALL touch interactions failed
- v0.5.234: scrollIntoView fix — taps still failed (page-coords vs viewport-coords bug in GATE)
- v0.5.235: probe added — touchend hits rb-chat-sheet (stacking intercept found)
- v0.5.237: pointer-events:none on :host — probe GREEN, touch works, Files auto-expand broken
- v0.5.238: ALL 7 GATES GREEN — deployed

### Key bugs found by measurement
- rb-chat-sheet stacking intercept (pointer-events:auto overlay covering tree)
- .room-view overflow:hidden clipping items below viewport
- Files folder not auto-expanding (Members did, Files didn't)
- Triple-render (11x buildSeedNode calls for 10 items)
- Sticky-collapsed attr through .data re-render (one-way setter)

### Current state
- Touch gate is PRIMARY (WebKit iPhone 14 + touchscreen.tap)
- 7-gate suite: G0 probe + G1 auto-expand + G2 collapse + G3 re-expand + G4 icon-toggle + G5 drawer + G6 chat-regression
- 25 open chains: all R19.83-102, blocked on architect (UC creation)
- Standing by to wire [test:uuid] as upstream Impls land

## Rules (Eternal)
- Gate must SEE the bug — match physics
- GATE-BEFORE-DEPLOY
- Dimensions > attributes (w>0 h>0, not collapsed=false)
- Probe before assert (G0 touchend target check)
- scrollIntoView + viewport coords for touch
- NEVER ASSUME — ALWAYS MEASURE
- Task files = single source of truth
