# ud-tester Context — 2026-05-04

## Identity
**ud-tester** — testing authority for UpDown. 42 pair with ud-expert.

## Team Layout (upDownTeam)
0.0=ud-po | 0.1=ud-architect | 0.2=ud-expert | 0.3=ud-expert-shell | 0.4=ME | 0.5=ud-tester-shell

## Base Path
Mac Studio: /Users/Shared/Workspaces/AI/Claude.All/UpDown/

## Current State: Sprint 3 QND Vitest Migration COMPLETE

### Professional Vitest Suite — 47/47 PASS
9 files at qnd/test/vitest/:
- uc-c1-connection-open.test.ts (4 tests) — WS connect, playerId, concurrent, onlineCount
- uc-r2-room-create.test.ts (7 tests) — create, host, private, list visibility, playerCount
- uc-r4-room-join.test.ts (7 tests) — join, notify, private key, full room, leave, host transfer
- uc-g1-game-start.test.ts (6 tests) — start, alivePlayers, cardsLeft, countdown, non-host guard, bot
- uc-p1-player-guess.test.ts (8 tests) — up/down/equal, scoring, elimination, timeout, early resolve, streak
- uc-b1-bot-add.test.ts (4 tests) — bot join 🤖, bot plays, delay, multiple bots
- uc-ch1-chat.test.ts (4 tests) — broadcast, truncation, history, empty guard
- uc-ge1-game-end.test.ts (4 tests) — GAME_OVER, leaderboard sort, fields, playAgain
- uc-s1-spectator.test.ts (3 tests) — spectate join, receives events, can't play

### Config
- vitest.config.ts: fileParallelism: false (sequential to avoid 50+ concurrent WS)
- Tests link to UC UUIDs via @uc:uuid comments
- Task files at scrum.pmo/sprints/sprint-3-qnd-multiplayer-game/task-32.{1-9}*.md

### Old Protocol Suite Still Exists
- qnd/test/protocol-test-suite.js — 37 tests (34 PASS, 3 SKIP)
- qnd/test/full-game-ws.test.js — full game lifecycle test

## Prior Sprint Results
- Phase 6 de-monolith: 8/8 PASS
- Sprint 1 Task 7: 6/6 PASS
- Task 4.3 (info+links): PASS
- Task 6.7 PUML: 12/13 PASS (1 keyword bug)
- Task 1.6 (HTTP/TLS/Filesystem compile): 0/3 FAIL (boundary extraction incomplete)
- Task 2.3 CLI self-register: 13/13 PASS

## Key Rules
- P15: No output filtering (no | head | tail | grep)
- P25: Tootsie for Web4 components, vitest for QND game server
- PDCA prod = 0.3.5.2
- NEVER filter output
- Each test links to UC UUID from traceability-matrix.md
- Each it() = one acceptance criterion from architect task file
