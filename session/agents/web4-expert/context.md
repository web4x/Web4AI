# web4-expert Context — Save Point 2026-04-24

**Role**: Web4AI Implementation Authority
**Status**: Sprint 1 Tasks 7.2-7.6 DONE, 7.7 handed to tester
**Machine**: Mac Studio
**Pane**: web4team:0.2

## Team Layout
- web4team:0.0 — web4-po (quality owner, CMM4 goal)
- web4team:0.1 — web4-architect (PUML/MDAv4/Units)
- web4team:0.2 — ME (web4-expert)
- web4team:0.3 — web4-tester
- web4team:0.4 — expert-shell (Web4 initialized)
- web4team:0.5 — spare

## Base Path
`/Users/Shared/Workspaces/AI/Claude.All/UpDown/components/`

## De-monolithization — ALL PHASES DONE

| Phase | Status |
|-------|--------|
| 0: @web4x/ucp | DONE |
| 1: @web4x/web4tscomponent | DONE |
| 1.25: BUG-W02 fix | DONE |
| 1.5: Cascading auto-build | DONE |
| 2: @web4x/unit | DONE |
| 3a-e: persistence/user/filesystem/http/tls | DONE |
| 4: @web4x/once | DONE |
| 5: web4test/tootsie/pdca/idealminimal | DONE |
| 6: Testing 8/8 PASS | DONE |

## 13 Components at 0.3.23.0 (all compile clean)
@web4x/ucp, unit, persistence, user, filesystem, http, tls, web4tscomponent, once, web4test, tootsie, pdca, idealminimalcomponent

## Sprint 1 — Current Work (0.3.23.1)

### Tasks 7.2-7.6 (DONE)
- 7.2 VERIFIED: UnitModel has origin, typeM3, references
- 7.3 DONE: Added FOLDER to TypeM3 enum in UCP/0.3.23.1
- 7.4 VERIFIED: references[] exists in UnitModel
- 7.5 DONE: tsUnitCreate() on UnitDiscoveryService in Unit/0.3.23.1
- 7.6 DONE: PumlUnitConverter in Unit/0.3.23.1/src/ts/layer2/
- 7.7: Handed to tester — awaiting verification

### Key Files Modified
- `UCP/0.3.23.1/src/ts/layer3/TypeM3.enum.ts` — added FOLDER
- `Unit/0.3.23.1/src/ts/layer2/UnitDiscoveryService.ts` — added tsUnitCreate() + imports
- `Unit/0.3.23.1/src/ts/layer2/PumlUnitConverter.ts` — NEW file

### Spec File
`/Users/Shared/Workspaces/AI/Claude.All/UpDown/scrum.pmo/sprints/sprint-1-monolithic-functionality/task-7.1-architect-unit-mdav4-spec.md`

## Semantic Links
- W4TSC: prod→0.3.19.1, test→0.3.19.3, dev→0.3.20.6, latest→0.3.23.1
- ONCE: prod→0.3.22.1, test→0.3.21.6, dev→0.3.21.6, latest→0.3.22.1

## Loss Report (from de-monolithization)
~20 files at domain boundaries not extracted to standalone components (remain in ONCE 0.3.23.0):
- HTTPSServer, ServerHierarchyManager, ProxyRoute, ReverseProxyRoute, HeaderRewriter, HrefRewriter
- ScenarioManager, ScenarioLoader (L2+L4), UnitCacheManager
- ACMEChallengeRoute, StaticFileRoute, FileOrchestrator
- All Layer5 views for filesystem
- DefaultEnvironmentInfo

## CMM Understanding
- Web4 = CMM4 (self-optimizing systems)
- Composed maturity = weakest link
- Assuming = L2, measuring = L3, PDCA loop = L4
- Current composed level: L1 (zero PDCA files, no Tootsie tests)
- PO goal: reach CMM4

## Key Learnings This Session
- Web4 shells need `bash --init-file source.env` from UpDown root
- otmux pane.lock for persistent pane titles
- CLI scripts must self-register version symlinks
- PROJECT_ROOT derived from component path (3 levels up), never from $PWD
- Ask oosh-expert when stuck on otmux methods — don't guess
