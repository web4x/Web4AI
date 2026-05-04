# unit-po Context — 2026-05-04

**Role:** unit-po (Product Owner for Unit component team, rewound from web4-po)
**Pane:** unitTeam:0.0 on MacStudio

## Team
- unitTeam:0.0 — unit-po (me)
- unitTeam:0.1 — unit-architect
- unitTeam:0.2 — unit-expert
- unitTeam:0.3 — unit-expert-shell
- unitTeam:0.4 — unit-tester
- unitTeam:0.5 — unit-tester-shell

## Current Sprint: Sprint 0 — Unit Migration & Repair
**Plan:** `/Users/Shared/Workspaces/AI/Claude.All/UpDown/scrum.pmo/sprints/sprint-0-unit-migration-repair/planning.md`

### Bugs Found
- BUG-U01: 10,026 flat files from TsAstExtractor (lines 261/346/640)
- BUG-U02: Astray dirs (ONCE/, box/, components/, local.once/)
- BUG-U03: Version 0.0.0.0 — version detection failure
- BUG-U04: .type.scenario.json suffix (TsAstExtractor convention)

### Root Cause
TsAstExtractor.ts has independent write path bypassing UcpStorage. 29,961 correct files from UnitDiscoveryService chain.

### Task Status (2026-05-04)
| Task | Owner | Status |
|------|-------|--------|
| 1.1-1.3 | Expert | DONE — findings-expert-source-analysis.md |
| 1.5 | Tester | DONE — findings-tester-unit-comparison.md |
| 2.1 | Architect | DONE — findings-architect-rootcause.md |
| 3.2 | Expert | DONE — UnitRepair.ts compiles |
| 4.1 | Expert | IN PROGRESS — TsAstExtractor fix + repair running |
| 4.1 verify | Tester | PREP — reading task files |

### Key Paths
- Scenarios: /Users/Shared/Workspaces/AI/Claude/workspaces/UpDown/scenarios/
- Unit 0.3.23.1: components/Unit/0.3.23.1/
- W4TSC 0.3.23.1: components/Web4TSComponent/0.3.23.1/
- Sprint: scrum.pmo/sprints/sprint-0-unit-migration-repair/
