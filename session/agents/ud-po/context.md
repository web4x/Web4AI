# ud-po Context — Save Point 2026-05-04

**Role:** UpDown Product Owner
**Pane:** upDownTeam:0.0 on MacStudio
**Branch:** qndNow

## Team
```
upDownTeam:0.0  ud-po (me)
upDownTeam:0.1  ud-architect (context tight ~70%)
upDownTeam:0.2  ud-expert
upDownTeam:0.3  ud-expert-shell (Web4 init)
upDownTeam:0.4  ud-tester
upDownTeam:0.5  ud-tester-shell (server runs here)
```
SM peer: TRONinterface:0.1

## Sprint 1 — COMPLETE (de-monolithization)
- 9/9 tasks done, 14 components at 0.3.23.1 (all compile clean)
- Server start parity verified (once-v0.3.23.0 startClientServer = once-v0.3.22.1)
- @web4x/cli created — CLI infrastructure shared, not duplicated
- ADR-001: npm exports field replaces re-exports (POC passed)
- ADR-002: Version mapping X.Y.Z.W → X.Y.Z-W
- 11 PUML diagrams, 58 MDAv4 CLASS units, 20 .ts.unit files
- 57 sprint task files (CMM3 compliance)
- Sprint planning: scrum.pmo/sprints/sprint-1-monolithic-functionality/planning.md

## Sprint 3 — COMPLETE (QnD Multiplayer Game)
- 26 game tasks + 11 bugs fixed
- Task 27-28: DRY refactoring done (MessageTypes.ts, ShareUtil.ts)
- Task 32: Vitest migration — 9 files, 47 tests, 47/47 PASS
- Traceability: matrix (75 UCs with UUIDs) + diagram + PUML annotations
- Architect: 9 task files with 61 acceptance criteria, use case diagram, DRY audit
- Game URL: https://home.donges.it:3443/mp
- Pre-created rooms: stable slugs 2p, 3p, 4p, 5p, party
- Pending: Tron mobile/PWA verification only
- Sprint planning: scrum.pmo/sprints/sprint-3-qnd-multiplayer-game/planning.md

## Sprint 2 — NOT STARTED (UpDown Game in ONCE + Lit Views)
- Planning at scrum.pmo/sprints/sprint-2-updown-game-lit-views/planning.md
- Depends on Sprint 1 (done) — ready to start

## Key Spec Files
- qnd/spec/traceability-matrix.md — 75 UCs with UUIDs, impl:line, test:line
- qnd/spec/traceability-diagram.puml — status dashboard (needs chain arrows merged back)
- qnd/spec/qnd-usecase-diagram.puml — 26 top-level UCs with @uc:uuid annotations
- qnd/spec/usecase-coverage.md — detailed coverage audit (17% → ~50%)
- qnd/test/vitest/ — 9 test files, 47 tests
- qnd/test/protocol-test-suite.js — original 37 tests (still works)

## Known Issue: Traceability Diagram
The architect replaced the original chain-arrow diagram (UC→Task→Impl→Test) with a flat status dashboard. Need to merge BOTH: status overview + detailed chains for covered UCs.

## Web4 Shell Init
`cd /Users/Shared/Workspaces/AI/Claude.All/UpDown && bash --init-file source.env`
