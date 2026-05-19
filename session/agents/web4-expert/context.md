# ud-expert Context — Save Point 2026-05-04 (pre-rewind)

**Role**: UpDown Implementation Authority (ud-expert)
**Pane**: upDownTeam:0.2
**Shell**: upDownTeam:0.3 (Web4 initialized)
**Branch**: qndNow
**Last commit**: 9dc76b36c

## Team Layout
- upDownTeam:0.0 — ud-po
- upDownTeam:0.1 — ud-architect
- upDownTeam:0.2 — ME (ud-expert)
- upDownTeam:0.3 — ud-expert-shell
- upDownTeam:0.4 — ud-tester
- upDownTeam:0.5 — ud-tester-shell

## Base Paths
- UpDown project: `/Users/Shared/Workspaces/AI/Claude.All/UpDown/`
- QnD game: `qnd/`
- Components: `components/`
- Web4 init: `bash --init-file source.env` from UpDown root

## Sprint 1 (COMPLETE) — Web4 De-monolithization
- 14 @web4x/* components at 0.3.23.1, all compile clean
- @web4x/cli extracted (DRY — no copied DefaultCLI)
- ONCE server start parity verified
- npm exports subpath pattern (ADR-001)
- Semantic links: ONCE dev+latest→0.3.23.0, W4TSC dev→0.3.23.0

## Sprint 3 (COMPLETE) — QnD Multiplayer Card Game
All tasks 1-32 done. Branch qndNow, pushed to GitHub.

### Server Files (qnd/src/ts/server/)
- **GameRoom.ts** — rooms, GM dealing, rounds, 10s countdown, elimination, scoring, diamonds, bots, spectators, chat history, pre-created rooms with stable slug IDs (2p/3p/4p/5p/party), auto-recreate
- **SpecialCards.ts** — 11 cards L1-L3, priority resolution
- **BotPlayer.ts** — card-counting AI, 4 personalities, 25% random nerf, 30% shield play rate
- **server.ts** — HTTPS+WS, room manager, .env config, /api/config endpoint, all protocol handlers, SERVER_CONFIG on connect, ROOM_LIST on connect+leave

### Client Files (qnd/src/public/ts/)
- **WebSocketClient.ts** — protocol client + shareOrCopy() + generateInviteMessage() (DRY)
- **LobbyUI.ts** — room list, create, join, share, spectate, ?join= auto-join, ?name= param
- **MultiplayerUI.ts** — game board, cards with visual comparison, countdown, guess buttons, special cards from inventory, chat bottom sheet (Google Maps style), player profiles (slide-up), spectate mode, invite button
- **multiplayer.ts** — entry point with /api/config loader

### Shared (qnd/src/ts/shared/ + qnd/src/shared/)
- **MessageTypes.ts** — 36 MSG constants, single source of truth

### Tests (qnd/test/vitest/)
- 9 UC test files, 47 tests, 47 PASS
- vitest.config.ts configured

### Key Bugs Fixed
- BUG-1: disconnected player vanishes (mark+cleanup pattern)
- Double resolveRound race (re-entry guard)
- Bot elimination (nerf + shield probability)
- Score in ROUND_RESULT (name+score+streak+roundScore)
- Inventory sync (per-player ROUND_START)
- Room recreate instant (no 2s gap)
- Chat history on join (max 50)
- ROOM_LIST on LEAVE_ROOM
- .env BASE_DOMAIN=home.donges.it

### Key Decisions
- Pre-created rooms: stable slug IDs, auto-recreate, host transfers to first human
- No auto-start countdown — host always clicks Start, bots fill on start
- navigator.share() on mobile, clipboard on desktop
- esbuild bundles client TS → dist/multiplayer.js
- <base href="/"> in multiplayer.html for /mp route
