# web4-architect Context — Save Point 2026-04-24

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

## Base Paths
- UpDown: `/Users/Shared/Workspaces/AI/Claude.All/UpDown/`
- Components: `.../UpDown/components/`
- Sprint planning: `.../UpDown/scrum.pmo/sprints/sprint-1-monolithic-functionality/`
- MDAv4 examples: `/Users/Shared/Workspaces/2cuGitHub/Web4Articles/MDAv4/`
- Architect role: `/Users/Shared/Workspaces/2cuGitHub/Web4Articles/scrum.pmo/roles/Architect/process.md`
- SKILL.md: `.claude/agents/web4-architect/SKILL.md`

## Version Strategy
- Dev: 0.3.23.1
- Release: 0.3.24.0 (after Sprint 1 tests pass)

## COMPLETED TASKS

### Task 6.0a — W4TSC+IMC Class Diagram ✅
- `Web4TSComponent/0.3.23.1/src/puml/W4TSC-IMC-ClassDiagram.puml` (77KB SVG)

### Task 6.0b — W4TSC+IMC Use Case Diagram ✅
- `Web4TSComponent/0.3.23.1/src/puml/W4TSC-IMC-UseCaseDiagram.puml` (66KB SVG)

### Task 6.1 — UCP Class Diagram ✅
- `UCP/0.3.23.0/src/puml/UCP-ClassDiagram.puml` (106KB SVG)
- Shows ISR proxy, pluggable loader registry, all 5 layers

### Task 6.2 — Unit Class Diagram ✅
- `Unit/0.3.23.0/src/puml/Unit-ClassDiagram.puml` (58KB SVG)

### Task 6.3 — Persistence Class Diagram ✅
- `Persistence/0.3.23.0/src/puml/Persistence-ClassDiagram.puml` (43KB SVG)

### Task 6.4 — Infrastructure Diagrams (4 components) ✅
- `User/0.3.23.0/src/puml/User-ClassDiagram.puml` (32KB SVG)
- `Filesystem/0.3.23.0/src/puml/Filesystem-ClassDiagram.puml` (54KB SVG)
- `HTTP/0.3.23.0/src/puml/HTTP-ClassDiagram.puml` (48KB SVG)
- `TLS/0.3.23.0/src/puml/TLS-ClassDiagram.puml` (46KB SVG)

### Task 6.5 — Full Dependency Diagram ✅
- `ONCE/0.3.23.0/src/puml/Web4x-ComponentDependency.puml` (57KB SVG)
- Shows all 13 components, build order, dependency arrows

### Task 6.6 — Framework Components Diagram ✅
- `Web4TSComponent/0.3.23.1/src/puml/W4TSC-FrameworkComponents.puml` (54KB SVG)
- web4test, tootsie, pdca, idealminimal — shared template pattern

### Task 7.1 — UnitModel MDAv4 Extension Spec ✅
- Spec: `scrum.pmo/.../task-7.1-architect-unit-mdav4-spec.md`
- PUML: `Unit/0.3.23.0/src/puml/UnitModel-Enhanced.puml` (8.6KB SVG)
- Key finding: UnitModel ALREADY has origin/typeM3/references from Unit/0.3.0.5
- Changes needed: (1) FOLDER in TypeM3 enum, (2) tsUnitCreate() method, (3) PumlUnitConverter class
- 9 acceptance criteria for Expert

## REMAINING TASKS (Sprint 1)
- Task 8.1: Define MDAv4/M3/CLASS/ structure — depends on Task 7 implementation
- Task 4.1: Spec path accessors (UCP vs W4TSC) — can do anytime

## KEY KNOWLEDGE

### UnitModel (already exists in UCP/0.3.23.0)
- `origin: string` — IOR to source .ts file
- `typeM3?: TypeM3` — CLASS/ATTRIBUTE/RELATIONSHIP (needs FOLDER)
- `references: UnitReference[]` — {linkLocation, linkTarget, syncStatus}
- `SyncStatus` enum: SYNCED/OUTDATED/BROKEN/UNKNOWN/MODIFIED/TO_BE_CHECKED/RUNTIME

### MDAv4 Pattern (from Web4Articles)
- `MDAv4/M3/CLASS/{ClassName}.unit` — M3 metaclass
- `{component}/src/ts/layer2/{Class}.ts.unit` — tracking file next to source
- Same UUID in both, bidirectional references[]
- `origin` field points to .ts file via IOR

### PlantUML Tools
- Installed: `brew install plantuml graphviz`
- Render: `plantuml -tsvg path/to/file.puml`
- Verify: `plantuml -tsvg -failfast2 -v path/to/file.puml`

### 11 Diagrams Created (all zero errors)
Total SVG output: ~592KB across 11 diagrams covering all 13 components
