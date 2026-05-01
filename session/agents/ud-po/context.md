# ud-po Context — Save Point 2026-05-02 00:45

**Role:** UpDown Product Owner
**Pane:** upDownTeam:0.0 on MacStudio
**Branch:** qndNow

## Team
```
upDownTeam:0.0  ud-po (me)
upDownTeam:0.1  ud-architect
upDownTeam:0.2  ud-expert
upDownTeam:0.3  ud-expert-shell (Web4 init)
upDownTeam:0.4  ud-tester
upDownTeam:0.5  ud-tester-shell (server running here)
```
SM peer: TRONinterface:0.1

## Sprint 3 — QnD Multiplayer Game (Deadline: Sunday)

### Completed Tasks (16 done)
1-2: WebSocket rooms + game loop ✅
3-4: Lobby UI + Game UI ✅
5: Special cards (11 cards L1-L3) ✅
6-7: Scoring + PWA ✅
8: esbuild fix (blank page) ✅
9: E2E test suite (23/26 PASS) ✅
10: Mobile-first CSS ✅
11: ?name= query param ✅
12: Pre-created rooms + join URLs ✅
13: Share button ✅
14: AI bot player (4 personalities) ✅
15: Auto-load rooms on connect ✅
16: Round result card visuals ✅

### In Progress / Bugs
17: Scrollable room list — CSS done, rooms disappear bug
18: Play Again — missing playAgain field in GAME_OVER
19: Spectate — SPECTATE_ROOM handler missing in server switch
20: Auto-start 30s countdown + bot backfill — expert working NOW
Also: pre-created rooms must auto-recreate after game ends

### Expert Working On
Task 20 + fixing 3 tester bugs (rooms disappear, playAgain field, spectate handler)

### Key Files
- qnd/src/ts/server/GameRoom.ts, BotPlayer.ts, SpecialCards.ts, server.ts
- qnd/src/public/ts/LobbyUI.ts, MultiplayerUI.ts, WebSocketClient.ts
- qnd/test/protocol-test-suite.js
- Planning: scrum.pmo/sprints/sprint-3-qnd-multiplayer-game/planning.md
- Specs: specs/additional.TRON.specs.md
