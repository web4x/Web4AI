# ud-architect Context — Save Point 2026-05-12

**Role:** UpDown Architect — PUML diagrams, MDAv4 ontology, Unit model, specs
**Pane:** upDownTeam:0.1
**Shell:** upDownTeam:0.4 (Web4 initialized)
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
- Components: `/Users/Shared/Workspaces/AI/Claude.All/UpDown/components/`
- QnD game: `/Users/Shared/Workspaces/AI/Claude/workspaces/UpDown/qnd/`
- Sprint 3: `scrum.pmo/sprints/sprint-3-qnd-multiplayer-game/`
- QnD spec: `qnd/spec/`

## Sprint 1 — COMPLETE
### Architect Tasks Done
- 6.0a: W4TSC+IMC class diagram (PUML+SVG)
- 6.0b: W4TSC+IMC use case diagram (PUML+SVG)
- 6.1: UCP class diagram with ISR + pluggable loaders (PUML+SVG)
- 6.2: Unit class diagram (PUML+SVG)
- 6.3: Persistence class diagram (PUML+SVG)
- 7.1: UnitModel spec (origin, typeM3, references[])
- 7.8: Unit.prod (0.3.0.5) class diagram — identified GitTextIOR gap
- 8.1: MDAv4 ontology structure
- 9.1: Unit gap analysis (prod vs 0.3.23.x) — 20 files, ~1,500 lines to port
- 4.1: Path accessor spec (UCP vs W4TSC)
- ADR-001: npm exports field — APPROVED, POC passed on UCP+Unit
- ADR-002: Version mapping X.Y.Z.W → X.Y.Z-W — APPROVED
- @web4x/cli extraction review — APPROVED (behavioral coupling flagged for Sprint 2)

## Sprint 3 — COMPLETE (architect tasks)
### Diagrams Created/Updated
- qnd-usecase-diagram.puml — 75+ UCs with UUIDs, color-coded coverage (15 green, 5 orange, 55 red), UC-R12/R13/R14/H5/H6 added
- traceability-diagram.puml — 75 UUID dashboard + 13 detailed chains, 15 covered
- room-lifecycle-state.puml — full state machine: waiting→countdown/hostControl→revealing→exchange→finished→waiting, replay FIXED, countdown toggle, room removal
- room-replay-usecase.puml — replay flow marked IMPLEMENTED (Task 35+36)

### Specs Written
- Task 28: DRY share util (gold standard)
- Task 29: DRY card utils (gold standard)
- Task 30: DRY score calc (gold standard)
- Task 31: DRY special cards (gold standard)
- Task 33: Room autoname (upgraded to gold standard)
- Task 35: Room replay (upgraded)
- Task 36: Bots survive replay (upgraded)
- Task 37: Host countdown toggle (upgraded)
- Task 38: MP UX parity gap analysis (8 subtasks)
- Task 38.14 review: persistent feedback — forceNextRound guard issue flagged
- Task 39: UC completeness review — 5 gaps prioritized, reconnection #1
- Task 39.1: Reconnection protocol spec (qnd/spec/reconnection-protocol.md)
- Task 40: Unique room names (gold standard)
- Task 41: Room cleanup + owner remove (gold standard)
- Task 42 review: Card Played Mode — DUPLICATE of Tasks 37+38.14

### Key Architectural Decisions
- forceNextRound() handles both countdown AND revealing states (line 398-406)
- Reconnection needs reconnectToken (UUID) in sessionStorage, 30s grace period
- Room lifecycle: finished is no longer terminal (resetForReplay)
- hostControl state parallel to countdown (countdownEnabled flag)

## Learnings
- TaskStop kills background shells — never claim they can't be stopped
- Use upDownTeam:0.4 for plantuml rendering, NOT 0.3 (tester pane)
- PlantUML card diagrams don't support chained arrows (A-->B-->C), must split
- Gold standard task files: [uc:uuid:], numbered AC, Test Structure code block, Architect Review checkboxes
- Web4 shell init: `bash --init-file source.env` from UpDown root
