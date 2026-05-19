# ud-architect Context — Save Point 2026-05-18

**Role:** UpDown Architect — PUML diagrams, specs, code analysis, bug root causes
**Pane:** upDownTeam:0.1
**Shell:** upDownTeam:0.4 (Web4 initialized, plantuml available)
**Machine:** MacStudio

## Team Layout
- upDownTeam:0.0 — ud-po
- upDownTeam:0.1 — ME (ud-architect)
- upDownTeam:0.2 — ud-expert
- upDownTeam:0.3 — ud-tester
- upDownTeam:0.4 — ud-expert-shell (my rendering shell)
- upDownTeam:0.5 — ud-tester-shell

## Base Paths
- UpDown project: `/Users/Shared/Workspaces/AI/Claude.All/UpDown/`
- QnD game: `/Users/Shared/Workspaces/AI/Claude/workspaces/UpDown/qnd/`
- Sprint 3: `scrum.pmo/sprints/sprint-3-qnd-multiplayer-game/`

## Sprint 3 Architect Work — COMPLETE

### Diagrams (qnd/spec/)
- qnd-usecase-diagram.puml — 75+ UCs with UUIDs, color-coded
- traceability-diagram.puml — 75 UUID dashboard + 15 covered chains
- room-lifecycle-state.puml — full state machine
- room-replay-usecase.puml — replay IMPLEMENTED

### Major Specs
- T39.1: Reconnection protocol (reconnectToken, 30s grace, sessionStorage)
- T61: Parallel games — single-thread FINE
- T80: Game docs (3 files: game-rules, special-cards, multiplayer)
- T82: Highscore/leaderboard — extend PlayerProfile, rank by diamonds
- T86: User editor + device tracking + consolidation
- T87: Bug report → otmux send to PO pane (execFile for security)
- T91: Button audit — 45 buttons, guardClick loading broken, fix with once()

### Bug Root Causes Found
- T55: ROOM_JOINED handler doesn't reset client state → stale data on second room
- T56: client.on() inside render() stacks handlers → duplicate messages
- T69: resetForReplay() revives ghost players → duplicates on rejoin
- T83: Countdown stays OFF after host elimination → game appears stuck
- T82-debug: Playwright fresh context = no token → leaderboard empty (test setup)
- BR-007: Link Account needs targetToken not secretCode, same-room security check

### ADRs (Sprint 1)
- ADR-001: npm exports field — APPROVED, POC passed
- ADR-002: Version X.Y.Z-W mapping — APPROVED

## Key Learnings
- TaskStop kills background shells
- execFile (not exec) prevents shell injection
- forceNextRound() is polymorphic by state
- guardClick loading invisible because actions are sync WS sends
- PlantUML card diagrams don't support chained arrows
- NEVER ASSUME — ALWAYS MEASURE (read code before speccing)
