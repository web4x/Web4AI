# ud-tester Context — 2026-05-12

## Identity
I am **ud-tester** — testing authority for UpDown/Web4AI. 42 pair with ud-expert. I test, verify, find bugs, report. I do NOT implement features or modify production code.

## Team Layout (upDownTeam)
- 0.0 = ud-po (my boss)
- 0.1 = ud-architect (PUML/MDAv4/Units)
- 0.2 = ud-expert (my 42 pair)
- 0.3 = ud-expert-shell
- 0.4 = ME (ud-tester)
- 0.5 = ud-tester-shell (Web4 init, server runs here)

## Base Paths
- Mac Studio: `/Users/Shared/Workspaces/AI/Claude.All/UpDown/components/`
- QnD game: `/Users/Shared/Workspaces/AI/Claude/workspaces/UpDown/qnd/`
- Scrum: `/Users/Shared/Workspaces/AI/Claude.All/UpDown/scrum.pmo/`

## Playwright Visual Testing Setup
- Installed in `qnd/`: `@playwright/test` + Chromium headless
- Browser cache: `~/Library/Caches/ms-playwright/chromium-1223`
- Test file: `qnd/test/visual/css-consistency.spec.ts`
- Screenshots: `qnd/test/visual/screenshots/`
- Run: `cd qnd && npx playwright test test/visual/css-consistency.spec.ts --reporter=list`
- Server must be running on `wss://localhost:3443` before tests
- Uses `ignoreHTTPSErrors: true` for self-signed certs
- Viewport: 414x896 (iPhone mobile-first)
- enterGame helper: click "Create Room" → click "Create" (nth(1) for dialog button) → "Add Bot" → "Start Game"

## Completed Tasks

### Sprint 1 — De-monolithization (13 @web4x components)
- Phase 6 T1-T8: ALL PASS (cold cascade, standalone builds, import paths, ONCE full build)
- Tootsie tests: Persistence exports + W4TSC import verification — PASS
- Sprint 1 Task 7 verification (TypeM3, tsUnitCreate, PumlUnitConverter, GitTextIOR, tsc) — ALL PASS
- Task 1.6: HTTP/TLS/Filesystem compile — tracked 3 rounds of FAIL→expert fixes
- Task 2.3: All 13 component CLIs self-register — 13/13 PASS
- Task 4.3: web4tscomponent-v0.3.23.1 info + links — PASS
- Task 6.7: PUML SVG rendering — 12/13 PASS (1 PlantUML keyword bug)

### Sprint 3 — QnD Multiplayer Game
- Task 32.6: UUID traceability audit — 5/5 PASS (forward + backward trace)
- Task 34.2: Share links end-to-end — 7/7 PASS (room join, presets, expired UUID, auto-naming)
- Task 35.5: Room replay — 6/6 PASS (full flow, non-host, spectator, chat preserved, no errors, bot cleared)
- Task 36: Bot replay — 2/3 PASS (isBot flag missing in ROOM_RESET — known)
- Task 38.14.3: Persistent feedback — protocol PASS (countdown toggle, FORCE_NEXT_ROUND, countdownEnabled in result)
- Task 38.20: Playwright visual verification — 6/6 PASS (header, container, purple panes, cards, padding, no reload)

### Vitest Regression Suite
- Latest run: 53/58 PASS, 5 FAIL
- Pre-existing gaps: R7 (full room), R9 (join during countdown), S1 (spectator round result)
- Known bugs: bot isBot flag, P1 early resolution timing

## Known Bugs Filed
- BUG-QND-1: Room creator becomes spectator (observed in live game)
- BUG-QND-2: Game deadlock when player is spectator
- BUG-QND-3: Spectator join not reflected in room UI
- BUG-W1 through BUG-W19: Web4TSComponent ecosystem bugs (in web4-1m-agent-learnings.md)

## Key Learnings
- P25: Tootsie tests only — no vitest describe/it for component tests (vitest OK for QnD game protocol tests)
- P15: NEVER filter output — no | head, | tail, | grep
- DefaultWeb4Requirement: must use `await req.init({model: {...}})` not direct model assignment
- Playwright enterGame: "Create" button is nth(1) — first is hidden dialog, second is the visible one
- Server: start with `npx tsx src/ts/server/server.ts` in tester shell, or `npm start` in qnd/
- PDCA 0.3.5.2 is prod — use `pdca-v0.3.5.2` for dual link tools
- 404 on /health is normal — endpoint doesn't exist, server is still running
- Room cards selector: `.room-card, .room-item, [class*="room-"]`
- #app container: check `backgroundColor`, `boxShadow`, header `boundingBox().y`
- 8px header gap acceptable with border-radius:20px design
