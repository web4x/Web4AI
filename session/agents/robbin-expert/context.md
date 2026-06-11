# robbin-expert Context — Save Point 2026-06-11 (SM HEALTH HOLD)

**Role**: Web4RawBin Implementation Authority
**Status**: SM HEALTH HOLD — sealed 173/173 checkpoint. R19.84 partial committed, R19.85 wireIframePinchZoom JS pending.
**Machine**: Mac Studio · **Pane**: robbinTeam2:0.2 · **Shell**: robbinTeam2:0.4 (mine)
**Repo**: /Users/Shared/Workspaces/2cuGitHub/Web4RawBin · **Live**: https://home.donges.it:4444
**Current version**: v0.5.204 deployed. 946/946 tests pass.

## Latest commits this session
- 862868bfe R19.84 partial + R19.85 wrapper (dragResize + iframe zoom container)
- 8f6ae18e5 R19.83 chain close (Impl e4b1fe11 renderRoomTreeFiles)
- 15ea21619 v0.5.204 file-items fix (this.files[] + renderRoomTreeFiles)
- 0d68f2e95 v0.5.201 R19.79/80 fix (preserve drawer-header)
- ef220eaa8 v0.5.200 R19.78-81 (buttons above name + grab + 95vh + pinch-zoom)
- c43f20980 v0.5.203 R19.59 refine (same-playerToken always takes over)
- 197d73f8e v0.5.196 167/167 full chain closure (R19.73+R19.74 Impl units)
- a9cbc7cf2 v0.5.197 preview-auth (token param on content URLs)
- c26a1d928 R19.75 chain close (Impl 4c897dae)
- 5b7ed2117 v0.5.198 R19.77 URL file action buttons
- 8d3171785 v0.5.199 R19.77 fix MIME order

## IN-FLIGHT (R19.84/85 partial)
- R19.84 dragResize: DONE in rb-detail-drawer.ts (handle=resize, body=dismiss)
- R19.85 iframePinchZoom: iframe wrapper (.preview-zoom-container) DONE, wireIframePinchZoom() JS NOT landed (classifier blocked mid-edit). Needs: export function wireIframePinchZoom(container) with 2-finger pinch dist ratio → transform:scale on iframe, clamp [0.25,4]
- R19.82 Impl 84910216 wired (addMemberTakeover)
- R19.80 Method 363920d4→Impl c23f3022 wired

## Key architecture
- Chain sealed at 173/173 (SM-verified)
- addMember: same-playerToken ALWAYS takes over (close old WS, no reject)
- Drawer: dragResize (handle) + swipe-dismiss (body), 95vh max
- this.files[] array in RoomView, renderRoomTreeFiles() mirrors member pattern
- FILE_ADDED pushes + re-renders; files populate via server FILE_ADDED on join

## Standing rules
- SM HEALTH HOLD: no new reqs until Tron directs
- Version bump #66; STATIC_SHELL #67 on bundle hash change
- Report each commit to robbinTeam2:0.0
- Forward-only chain (T159)
- REAL UNITS ONLY — no stubs

## Deploy ritual
1. otmux send iphone:0.1 C-c (twice)
2. otmux send iphone:0.1 'cd /Users/Shared/Workspaces/2cuGitHub/Web4RawBin && git pull && npm run build && npm run dev' Enter
3. curl -sk https://home.donges.it:4444/api/health

## Build/test
npm run build · npm test · 946/946 tests

## Hard-Won Patterns (173/173 session)
- VALIDATE vs GROUND TRUTH: every Impl must have a matching [impl:uuid:] marker AT the actual function in source — scan source, not trust unit existence
- DETERMINISTIC ≠ CORRECT: a script can produce 322 Impl units deterministically and all be fake — bulk-gen without real source backing = false coverage
- DECISIVE OVER-CREDIT SCAN: when chain count jumps suspiciously, audit Method.implementations[] against grep for [impl:uuid:] in source — delete unmatched
- REAL MARKERS NOT STUBS: if no real code exists, DELETE the unit; never stub an Impl pointing to a file without a marker at the function
- RECONCILE BY METHODOLOGY: when SM/tester flags a count, walk the chain yourself (Method→Impl→source grep) rather than trusting the number
- SAVE BEFORE 80%: context saves at 58% survived; at 0% chat-context is lost — commit+push+save at every natural break
- SAME-TOKEN ALWAYS TAKES OVER: addMember dedup must never reject the same user — close old WS, swap, no false 'Room full'
- IMPL UUID ≠ METHOD UUID: [impl:uuid:] markers point to Impl units, NOT Method units — Method.implementations[] wires them
- CSS-ONLY IMPLS: when impl is pure CSS (no TS handler), marker goes in CSS comment; scorer needs .css scanning
- MIME ORDER MATTERS: specific types (text/html, text/uri-list) must dispatch BEFORE generic catch-all (text/*)
- fs vs fsSync: server.ts L6=node:fs/promises (async), L7=node:fs (sync) — use fsSync for existsSync/readdirSync in sync handlers

