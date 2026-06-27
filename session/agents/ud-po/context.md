# ud-po Context — Save Point 2026-05-20

**Role:** UpDown Product Owner
**Pane:** upDownTeam:0.0 on MacStudio
**Branch:** qndNow
**Session:** rewind prep

## Team
```
upDownTeam:0.0  ud-po (me)
upDownTeam:0.1  ud-architect
upDownTeam:0.2  ud-expert
upDownTeam:0.3  ud-tester
upDownTeam:0.4  ud-expert-shell
upDownTeam:0.5  ud-tester-shell (server)
```
SM peer: TRONinterface:0.1

## Sprint 3 — QnD Multiplayer Game

### Completed (92 tasks + 14 bug reports)
- Tasks 1-70: Core game, rooms, identity, devices, buttons, cross-device
- Tasks 78-92: Home button, version nav, md renderer, game docs, player level, leaderboard, host elimination, chat, user editor, bug report pipeline, QR invite, vCard, DRY buttons, char counter
- T29-31: DRY (CardUtils, ScoreCalculator, SpecialCards)
- BR-001-014: All fixed and verified

### In Progress
- BR-015: Room creator leave/rejoin/delete — JUST FILED, needs architect+expert

### Remaining
- Mobile/PWA testing — needs Tron device
- Task 39: WebSocket reconnection (deferred)

### Key Infrastructure
- Bug report: browser → otmux send → PO. API: POST /api/bug-status (KEY: updown-admin-2026)
- Leaderboard: /leaderboard, /api/leaderboard, disk persistence
- Profile: /profile, devices+status, secret code (editable in lobby editor)
- Link Account: player popup, secret code verify, redirect stub
- MD renderer: /md/* serves .md as HTML
- QR invite: popup in game room
- Special cards: two-step select/confirm with target picker

### Key Files
- Planning: scrum.pmo/sprints/sprint-3-qnd-multiplayer-game/planning.md
- Profiles: qnd/data/profiles.json
- Bug reports: scrum.pmo/sprints/sprint-3-qnd-multiplayer-game/bug-report-*.md

## CMM4 Process
1. Task file first — never relay via chat
2. Architect specs → expert implements → tester verifies
3. Expert self-reports via otmux send upDownTeam:0.0
4. PO updates task file + planning.md
5. Bug lifecycle API for status updates
6. Never interrupt — queue tasks
7. Measure before acting
8. Review before unblocking
9. Preexisting issues = tasks to fix
