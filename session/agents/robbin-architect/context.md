# robbin-architect — Context

## ACTIVE (2026-06-01): Sprint 17 — Scenario Units / IOR Data Model

### Just completed (this session)
- **T143 AC2 fix** (fe69562): slug field on TraceNode for speaking-name hrefs
- **T144 AC2 fix** (bd3b75d): 🔗 href uses /edit/ not /md/ for .scenario.json
- **T145 design** (83099ea): User as 8th scenario class + ViewBus singleton
- **T146 design** (83099ea): Requirement NAME-first format + <details> for description
- **T147 design** (2ff001b): 🔗 scenario link in sprints.md/ listings (scenarioLink helper)
- **T148 design** (6f0c72c): breadcrumb path-header for /md/ listings
- **T149 design** (3f8cd33 + de7f348): sprints.json symlink tree for all 9 classes + slug mismatch fix (two-strategy scenarioLink)
- **T150 design** (1d534a2): breadcrumb link contrast fix (.bc-link CSS class)
- **T151 design** (6f4db8f): MD traceability → JSON arrays migration (1016 bullets, TraceEntry schema, per-task count audit gate)
- **T152 pre-design** (b741d50): UC data-quality — auto-derive object.verb from name + PUML task refs
- **T153 design v2** (c77d1f5): UC class refs + requirement refs from PUML + altId blocker fix
- **T154 design** (2077202): Requirement data quality — name/description/tasks from requirements.md
- **T155 design** (6cff106): Requirement bidirectional closure — reverse-scan tasks + test coverage
- **T156 design** (d7ade7b): Reload button on connection-failed page (one line in app.ts)
- **T157 finding** (d7ade7b): vCard import ALREADY IMPLEMENTED — skip to tester verification

### Expert implemented (this session, per status updates in task files)
- T143 impl: v0.5.37 (trace-tree.ts, template RenderContext)
- T144 impl: v0.5.36 + v0.5.38 (icon order, symlinkIcon, jsonHref)
- T145 impl: v0.5.41 (User scenario class + ViewBus)
- T146 impl: v0.5.41 (batched with T145 — template + validator)
- T147 impl: v0.5.43 (scenarioLink for .md listings)
- T148 impl: v0.5.44 (breadcrumb helper)
- T149 impl: v0.5.45 + v0.5.46 (per-class symlink subdirs + full-UUID tracelinks)
- T150 impl: v0.5.47 (.bc-link WCAG AA contrast)
- T151 impl: v0.5.48 (815/815 per-task count gate PASSED)
- T152+T153 impl: v0.5.49 + v0.5.50 (UC object/verb + classes/requirements)
- T154 impl: v0.5.52 (Requirement name/description/tasks)
- T155 impl: v0.5.53 (bidirectional closure tasks[] + tests[])

### Deferred
- T97: re-encrypt-on-rekey invariant (S14)
- T104: S15 Object.verb use-case diagrams
- Both deferred until current S17 design burst completes

## Identity
- **Role:** robbin-architect
- **Pane:** robbinTeam:0.1 (was upDownTeam:0.3, renamed)
- **Team:** robbinTeam
- **Project:** RawBin (Web4RawBin)
- **Working dirs:**
  - Planning: `/Users/Shared/Workspaces/AI/Claude/workspaces/Web4RawBin/`
  - Implementation: `/Users/Shared/Workspaces/2cuGitHub/Web4RawBin/`

## Key Patterns Established This Session
- **TraceEntry schema:** {type, ref, label, uuid?, commit?} — canonical for all chain data
- **Per-task/UC/Req count audit gates:** AC hard-FAIL pattern — md-count == json-count
- **altId field on Requirements:** R17.1-style sprint-scoped identifier for R-number lookups
- **Two-strategy scenarioLink:** UUID direct index lookup + speaking-name sprint scan
- **ViewBus singleton:** lightweight pub/sub for model-change propagation to views
- **.bc-link CSS class:** WCAG AA contrast for breadcrumb links (white/#a8c8ff/#b8d8ff)

## Build State
- App: v0.5.53 (as of T155 impl)
- 32 Requirement scenarios, 15 UseCase scenarios (S17), 17 UseCase scenarios (S16)
- 73 task files across S10-S17, 1016 traceability bullets migrated to JSON

## CMM4 Standing Rules
- #18: req captures → planner stands up task file → architect refines → expert impl → tester verify
- #46: sub-task files MUST follow Web4Articles standard template
- #15+#16: rule-pair (a)+(b) — package.json + sw.js CACHE_NAME bump in same commit-set
