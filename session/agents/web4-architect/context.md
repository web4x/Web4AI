# web4-architect Context — Save Point 2026-04-25

**Role:** Web4 Architect
**Pane:** web4team:0.1
**Machine:** MacStudio
**Session:** Forked from web4-po

## Team
- web4team:0.0 — web4-po (PO, quality, CMM4)
- web4team:0.1 — ME (web4-architect)
- web4team:0.2 — web4-expert (implementation)
- web4team:0.3 — web4-tester (testing)
- web4team:0.4 — shell (web4-initialized, plantuml rendering)
- web4team:0.5 — spare

## Version Strategy
- Dev: 0.3.23.1
- Release: 0.3.24.0 (after Sprint 1 tests pass)

## ALL SPRINT 1 ARCHITECT TASKS — COMPLETE

| Task | Deliverable | Status |
|------|------------|--------|
| 4.1 | Path accessor spec (UCP vs W4TSC) | DONE |
| 6.0a | W4TSC+IMC Class Diagram | DONE |
| 6.0b | W4TSC+IMC Use Case Diagram | DONE |
| 6.1 | UCP Class Diagram (ISR, loader registry) | DONE |
| 6.2 | Unit Class Diagram | DONE |
| 6.3 | Persistence Class Diagram (dual platform) | DONE |
| 6.4 | User/Filesystem/HTTP/TLS Diagrams (4) | DONE |
| 6.5 | Full Dependency Graph (13 components) | DONE |
| 6.6 | Framework Components Diagram | DONE |
| 6.8 | Layer label corrections (8 diagrams) | DONE |
| 6.9 | EAMD 5-Layer Reference Diagram | DONE |
| 7.1 | UnitModel MDAv4 Extension Spec | DONE |
| 8.1 | MDAv4/M3/CLASS/ Structure (58 classes, 137 units) | DONE |

## PUML Files Created (13 diagrams, all rendering zero errors)

| File | Location | SVG Size |
|------|----------|----------|
| W4TSC-IMC-ClassDiagram.puml | Web4TSComponent/0.3.23.1/src/puml/ | 77KB |
| W4TSC-IMC-UseCaseDiagram.puml | Web4TSComponent/0.3.23.1/src/puml/ | 66KB |
| W4TSC-FrameworkComponents.puml | Web4TSComponent/0.3.23.1/src/puml/ | 54KB |
| UCP-ClassDiagram.puml | UCP/0.3.23.0/src/puml/ | 106KB |
| Unit-ClassDiagram.puml | Unit/0.3.23.0/src/puml/ | 58KB |
| UnitModel-Enhanced.puml | Unit/0.3.23.0/src/puml/ | 9KB |
| Persistence-ClassDiagram.puml | Persistence/0.3.23.0/src/puml/ | 43KB |
| User-ClassDiagram.puml | User/0.3.23.0/src/puml/ | 32KB |
| Filesystem-ClassDiagram.puml | Filesystem/0.3.23.0/src/puml/ | 54KB |
| HTTP-ClassDiagram.puml | HTTP/0.3.23.0/src/puml/ | 48KB |
| TLS-ClassDiagram.puml | TLS/0.3.23.0/src/puml/ | 46KB |
| Web4x-ComponentDependency.puml | ONCE/0.3.23.0/src/puml/ | 57KB |
| EAMD-5LayerArchitecture.puml | ONCE/0.3.23.0/src/puml/ | 25KB |

## Spec Documents Created

| File | Location |
|------|----------|
| task-4.1-architect-path-accessor-spec.md | scrum.pmo/sprints/sprint-1-monolithic-functionality/ |
| task-7.1-architect-unit-mdav4-spec.md | scrum.pmo/sprints/sprint-1-monolithic-functionality/ |
| task-8.1-architect-mdav4-class-structure.md | scrum.pmo/sprints/sprint-1-monolithic-functionality/ |
| task-6-layer-review.md | scrum.pmo/sprints/sprint-1-monolithic-functionality/ |

## Key Architectural Decisions

### Path Accessors (Task 4.1)
- DO NOT restore 423 lines removed from UcpComponent
- CLI back-reference was circular dep — correctly removed
- Add 2 protected helpers (projectRoot, componentsDirectory) derived from model.componentRoot

### UnitModel (Task 7.1)
- UnitModel ALREADY has origin, typeM3, references[] (from Unit/0.3.0.5 lineage)
- Only change: add FOLDER to TypeM3 enum
- New class: PumlUnitConverter (parse PUML → create M3 CLASS units)
- New method: UnitDiscoveryService.tsUnitCreate() for .ts.unit files

### MDAv4 Structure (Task 8.1)
- 58 M3 CLASS units across 13 components
- 3 M3 RELATIONSHIP units (extends, implements, depends-on)
- 13 M3 FOLDER units (one per component)
- 58 .ts.unit tracking files next to source
- 137 total unit files to create

### EAMD 5-Layer Architecture (Task 6.8-6.9)
- L1 = Kernel & OS Infrastructure (ONCE singleton, os module wrappers)
- L2 = Implementation (Default* classes, sync only)
- L3 = Interfaces & Runtime Types (NOT just interfaces — includes JsInterface, UcpModel, TypeDescriptor)
- L4 = Async Orchestration (ADDED by UpDown for P7, not in original EAMD)
- L5 = UX & Views (CLI, Web Components, Lit views)

## Base Paths
- UpDown: /Users/Shared/Workspaces/AI/Claude.All/UpDown/
- Components: .../UpDown/components/
- Sprint planning: .../UpDown/scrum.pmo/sprints/sprint-1-monolithic-functionality/
- MDAv4 examples: /Users/Shared/Workspaces/2cuGitHub/Web4Articles/MDAv4/
- SKILL.md: .claude/agents/web4-architect/SKILL.md

## Pending (Expert Implementation Tasks)
- Task 4.2: Implement path accessor helpers in UcpComponent
- Task 7.2-7.7: UnitModel FOLDER enum + tsUnitCreate + PumlUnitConverter
- Task 8.2-8.5: Create 137 unit files in MDAv4/M3/
