# web4-po Context — Save Point 2026-04-25

**Role:** Web4 Product Owner — quality, sprint planning, CMM4 ownership
**Pane:** web4team:0.0 on MacStudio
**Session UUID:** a2ad74ab-db03-464b-96fb-91dcbd663787

## Team Layout
```
web4team:0.0  web4-po (me)
web4team:0.1  web4-architect (forked from me — a2ad74ab)
web4team:0.2  web4-expert
web4team:0.3  web4-tester
web4team:0.4  expert-shell (web4-initialized bash)
web4team:0.5  spare shell
```

## Base Path
`/Users/Shared/Workspaces/AI/Claude.All/UpDown/components/`

## Sprint Planning Location
`/Users/Shared/Workspaces/AI/Claude.All/UpDown/scrum.pmo/sprints/`

## Version Strategy
- 0.3.23.0 — frozen initial extraction
- 0.3.23.1 — dev: Sprint 1 work
- 0.3.24.0 — prod release after all Sprint 1 tests pass

## Sprint 1 Status — "Recreate Monolithic Functionality"

### COMPLETED (5/8 tasks)
| Task | Status | Deliverables |
|------|--------|-------------|
| **4: Path Accessors** | ✅ DONE | 2 protected helpers (projectRoot, componentsDirectory) on UcpComponent. Architect decided: DON'T restore 423 lines — add minimal helpers instead. Tester verified info/links PASS. |
| **6: PUML Diagrams** | ✅ DONE | 11 PUML + EAMD reference diagram, 18+ SVGs. Layer labels corrected (L1=Kernel/OS, L3=Interfaces+Runtime, L4=Async P7). All 13 components covered. |
| **7: Unit Model** | ✅ DONE | UnitModel already had origin/typeM3/references from 0.3.0.5. Added FOLDER to TypeM3. tsUnitCreate() + PumlUnitConverter implemented. 11/11 .ts.unit verified in UCP. |
| **8: MDAv4 Ontology** | ✅ DONE | 58 CLASS + 3 RELATIONSHIP + 13 FOLDER units. Generator script. 20 .ts.unit files for UCP+Unit. Tester found filePath gap (non-blocking). |
| **Architect** | ✅ ALL DONE | Tasks 6.0a-6.9, 7.1, 8.1, 4.1 — all Sprint 1 architect work complete. |

### IN PROGRESS (1/8)
| Task | Status | Details |
|------|--------|---------|
| **1: Boundary Extraction** | 🔧 Expert working | HTTPSServer→HTTP, StaticFileRoute→HTTP, ACMERoute→TLS, FileOrchestrator→Filesystem, ProxyRoutes→HTTP. Expert was copying layer3 files, frequently blocked by permission prompts. |

### PLANNED (2/8)
| Task | Status | Blocked by |
|------|--------|-----------|
| **2: CLI Completeness** | PLANNED | After Task 1 |
| **3: Server Start Parity** | BLOCKED | Task 1 |
| **5: Semantic Links** | BLOCKED | Task 1 (Task 4 unblocked) |

## Sprint 2 — "UpDown Game + Lit Views"
Planning complete at `sprint-2-updown-game-lit-views/planning.md`. 7 tasks across 2 weeks. Version: dev on 0.3.24.1, release as 0.3.25.0. Depends on Sprint 1 completion.

## CMM Assessment
- **Composed level:** L1 (was L1, improving)
- **Strengths at L3:** compilation, cascading build, import rewiring, PUML coverage, Unit traceability
- **Weaknesses:** zero PDCA files, zero Tootsie tests, server start untested, permission prompt velocity killer
- **Path to L4:** PDCA feedback loops after each sprint, process adjustment based on data

## The 13 Components (all at 0.3.23.0, some at 0.3.23.1)
1. @web4x/ucp — foundation, zero deps
2. @web4x/unit — file tracking, discovery
3. @web4x/persistence — UcpStorage, BrowserScenarioStorage
4. @web4x/user — DefaultUser, NodeOSInfrastructure
5. @web4x/filesystem — File/Folder/FileSystem/Image
6. @web4x/http — HTTPServer, Router, Routes
7. @web4x/tls — certificates, SNI, LetsEncrypt
8. @web4x/web4tscomponent — CLI lifecycle
9. @web4x/once — full ONCE kernel (244 files)
10. @web4x/web4test — test framework
11. @web4x/tootsie — OOP test runner
12. @web4x/pdca — PDCA cycle
13. @web4x/idealminimalcomponent — reference hello-world

## Key Process Issues
- **Permission prompts** are #1 velocity killer — agents blocked every 2-3 minutes. Escalated to Tron.
- **Remote Control** queues messages instead of processing them — agents appear idle when RC is active.
- **"Allow all edits during this session"** does NOT persist across new file/directory targets.

## Key Technical Decisions
1. Re-export pattern for shared types (DRY)
2. PlatformDetection replaces Once.isNode in filesystem
3. Self-registering CLI scripts (version symlinks on first run)
4. PROJECT_ROOT derived from component path, not $PWD
5. UcpComponent: DON'T restore 423 lines — add 2 protected helpers instead
6. Web4 shell init: `bash --init-file source.env` from UpDown root

## Files I Own
- `scrum.pmo/sprints/sprint-1-monolithic-functionality/planning.md`
- `scrum.pmo/sprints/sprint-1-monolithic-functionality/requirements.md`
- `scrum.pmo/sprints/sprint-1-monolithic-functionality/cmm-assessment.md`
- `scrum.pmo/sprints/sprint-1-monolithic-functionality/task-1-boundary-file-extraction.md`
- `scrum.pmo/sprints/sprint-1-monolithic-functionality/task-7-unit-model-enhancement.md`
- `scrum.pmo/sprints/sprint-2-updown-game-lit-views/planning.md`
- `scrum.pmo/sprints/sprint-2-updown-game-lit-views/requirements.md`
- `session/tasks/phase6-test-plan.md`
- `session/agents/web4-expert/context.md`

## What I Learned (from Web4Articles)
- Sprint planning format: `scrum.pmo/roles/PO/process.md` + `sprint-n-template/`
- Architect role: `scrum.pmo/roles/Architect/process.md` — PUML, specs before implementation
- MDAv4: M3/CLASS units with origin/typeM3/references → .ts.unit next to source → PUML traceability chain
- Web4 Principles: 35 principles at `ONCE/0.3.22.1/session/web4-principles-details.md`
- CMM: `session/knowledge-base/cmm-web4x.md` — composed level = weakest link
