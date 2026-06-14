# robbin-expert Context — Save Point 2026-06-14 (Phase 1 deep rewind recovery)

**Role**: Web4RawBin Implementation Authority
**Status**: v0.6.30 deployed. Champagne 26/209. Phase 1 migration unstarted (nothing lost).
**Machine**: Mac Studio · **Pane**: robbinTeam2:0.2
**Repo**: /Users/Shared/Workspaces/2cuGitHub/Web4RawBin · **Live**: https://home.donges.it:4444
**Current version**: v0.6.30. Rooms: 17. Tests: 995/996 (1 failing — tester diagnosing).

## LIVE STATE
- v0.6.30 deployed, BUG8-drawer-front fix landed
- Champagne sealed: 26/209 (R20.13, R20.11, R20.10, R19.63)
- R20.13.A PIN code-fix landed v0.6.27 (seal gated on Tron-device-confirm)
- 995/996 tests — tester dispatched on failing test diagnosis

## CURRENT TASK
- Phase 1 migration: run migrate-to-scenario.ts on 220 markdown-only UUIDs
- UNSTARTED — nothing committed or lost per PO
- Recovery action: execute migration script after context save

## PENDING
- Phase 1 migration (220 markdown-only UUIDs → scenario units)
- Tester: 1 failing test diagnosis (995/996)
- R20.13.A seal: awaiting Tron device-confirm

## KEY ARCHITECTURE (accumulated)
- Chain sealed at champagne 26/209
- addMember: same-playerToken ALWAYS takes over (close old WS, no reject)
- diffRenderItems: index by ref, update in-place, append new only
- Drawer: dragResize (handle) + swipe-dismiss (body >10px threshold), 95vh max
- preview-zoom-container: touch-action:pan-y (not none — iOS fix)
- await whenDefined('rb-object-item') before render (CE upgrade race fix)
- Remove Local Identity in DeviceEnrollDialog (moved from ProfileEditor)
- this.files[] array + renderRoomTreeFiles mirrors member pattern
- FILE_ADDED populates files incrementally on join
- fs vs fsSync: L6=promises, L7=sync — use fsSync for sync handlers

## STANDING RULES
- Version bump #66; STATIC_SHELL #67 on bundle hash change
- implementing [x] before commit
- Report each commit to robbinTeam2:0.0
- Forward-only chain (T159) — no back-refs
- REAL UNITS ONLY — no stubs
- Scenario-link communication: otmux = one-line pointers only
- IMPL UUID ≠ METHOD UUID — markers point to Impl units
- SAVE BEFORE 80% context

## DEPLOY RITUAL
1. otmux send iphone:0.1 C-c (twice)
2. otmux send iphone:0.1 'cd /Users/Shared/Workspaces/2cuGitHub/Web4RawBin && git pull && npm run build && npm run dev' Enter
3. curl -sk https://home.donges.it:4444/api/health
