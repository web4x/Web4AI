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

### Sprint 0 Status: CLOSED (2026-05-04)
| Task | Owner | Status |
|------|-------|--------|
| 1.1-1.3 | Expert | DONE — findings-expert-source-analysis.md |
| 1.5 | Tester | DONE — findings-tester-unit-comparison.md |
| 2.1 | Architect | DONE — findings-architect-rootcause.md, fix review APPROVED |
| 3.2 | Expert | DONE — UnitRepair.ts compiles |
| 3.4 | Expert | DONE — astray dirs cleaned (archive/domain/index/type only) |
| 4.1 | Expert | DONE — TsAstExtractor uuidToIndexPath() fix, architect APPROVED |
| 4.3 | Expert | DONE — 0.0.0.0 version dirs removed |
| PDCA | PO | DONE — pdca-checkpoint-1.md + pdca-closing.md |

### Open Issue for Sprint 1
Flat file count discrepancy: `find index -maxdepth 1` shows 10,016 but tester earlier measured 0. Need consistent measurement command.

### Next: Sprint 1
Port prod Unit features (0.3.0.5) to 0.3.23.1. Sprint 1 backlog:
- Verify/resolve flat file count discrepancy
- TsAstExtractor→ScenarioService DRY refactor (architect recommendation)
- UnitCLI commands (create, list, info, repair)
- .ts.unit file creation in UnitDiscoveryService
- MDAv4 fields (origin, typeM3, references[]) in UnitModel
- PUML→Unit converter

### Key Paths
- Scenarios: /Users/Shared/Workspaces/AI/Claude/workspaces/UpDown/scenarios/
- Unit 0.3.23.1: components/Unit/0.3.23.1/
- W4TSC 0.3.23.1: components/Web4TSComponent/0.3.23.1/
- Sprint: scrum.pmo/sprints/sprint-0-unit-migration-repair/
