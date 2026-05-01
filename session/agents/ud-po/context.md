# ud-po Context — Save Point 2026-05-01

**Role:** UpDown Product Owner (cloned from web4-po)
**Pane:** upDownTeam:0.0 on MacStudio
**Branch:** qndNow

## Team Layout
```
upDownTeam:0.0  ud-po (me)
upDownTeam:0.1  ud-architect
upDownTeam:0.2  ud-expert
upDownTeam:0.3  ud-expert-shell (Web4 initialized)
upDownTeam:0.4  ud-tester
upDownTeam:0.5  ud-tester-shell (Web4 initialized, server running)
```
SM peer: TRONinterface:0.1

## Sprint 3 — QnD UpDown Multiplayer Game (Deadline: Sunday)

### Status: 5/7 tasks DONE
| Task | Status |
|------|--------|
| 1: WebSocket Game Rooms | ✅ DONE (GameRoom.ts 380 lines) |
| 2: Multiplayer Game Loop | ✅ DONE (merged into Task 1) |
| 3: Lobby UI | ✅ DONE (LobbyUI.ts, WebSocketClient.ts) |
| 4: Multiplayer Game UI | ✅ DONE (MultiplayerUI.ts, multiplayer.html/css) |
| 5: Special Cards | ✅ DONE (SpecialCards.ts 241 lines, 11 cards L1-L3) |
| 6: Scoring + Economy | 🔧 Expert working |
| 7: PWA + Mobile | PLANNED |

### Tester Results
- Tasks 1-4: 8/9 PASS (score field was missing — fixed)
- Task 5: Special card play silently fails — inventory ID mismatch between client/server. Expert notified.
- BUG-1 FIXED: disconnected player elimination
- BUG-SCORE FIXED: scores in ROUND_RESULT

### Key Files
- `qnd/src/ts/server/GameRoom.ts` — room + game loop (380 lines)
- `qnd/src/ts/server/SpecialCards.ts` — 11 special cards (241 lines)
- `qnd/src/ts/server/server.ts` — HTTPS + WebSocket server
- `qnd/src/public/ts/LobbyUI.ts` — lobby Lit component
- `qnd/src/public/ts/MultiplayerUI.ts` — game UI
- `qnd/src/public/ts/WebSocketClient.ts` — WS client
- `qnd/src/public/multiplayer.html` — multiplayer page
- Sprint planning: `scrum.pmo/sprints/sprint-3-qnd-multiplayer-game/planning.md`

### What Expert Is Working On
Task 6 (scoring/leaderboard) + special card inventory bug fix

### What's Left for Sunday
1. Fix special card inventory sync (client needs card IDs from server)
2. Task 6: Scoring display + leaderboard in game over
3. Task 7: PWA manifest for multiplayer, mobile touch
4. Final tester pass on all features

## Sprint 1 — COMPLETE (web4 de-monolithization)
- 14 components at 0.3.23.1, all compile clean
- Server start parity verified
- ADR-001 (npm exports) + ADR-002 (version mapping) approved
- @web4x/cli component created
- 11 PUML diagrams, 58 MDAv4 CLASS units
- Planning: scrum.pmo/sprints/sprint-1-monolithic-functionality/planning.md

## Process
- Commit and push regularly to qndNow branch
- Sprint planning files at scrum.pmo/sprints/sprint-3-qnd-multiplayer-game/
- SM at TRONinterface:0.1 monitors permissions and velocity
- All agents save context after each task
- QnD = quick and dirty, web2 OK, no web4 ceremony
