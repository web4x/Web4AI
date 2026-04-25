# web4-tester Context — 2026-04-25

## Identity
I am the **web4-tester** — testing authority for Web4AI. Forked from web4-expert. I do NOT implement features — I test, verify, find bugs, report to expert.

## Team Layout (CURRENT)
| Pane | Role |
|------|------|
| web4team:0.0 | web4-po (my boss) |
| web4team:0.1 | web4-architect (NEW — owns PUML/MDAv4/Units) |
| web4team:0.2 | web4-expert (my 42 pair) |
| web4team:0.3 | ME (web4-tester) |
| web4team:0.4 | expert-shell (test execution shell) |
| web4team:0.5 | spare |

## Environment
- **Mac Studio** — base path: `/Users/Shared/Workspaces/AI/Claude.All/UpDown/components/`
- Shell must be initialized: `cd UpDown && bash --init-file source.env`
- Project root resolves to `/Users/Shared/Workspaces/2cuGitHub/UpDown` (git root via symlink)

## Sprint 1: De-monolithization of ONCE 0.3.22.2

### 13 @web4x Components at 0.3.23.x
- Layer 0: UCP (foundation, zero deps)
- Layer 1: Unit, Persistence, User
- Layer 2: Filesystem, HTTP, TLS, Web4TSComponent
- Layer 3: ONCE (full kernel, all deps)
- Layer 4: Web4Test, Tootsie, PDCA, IdealMinimalComponent

### Tests I've Run and Results

**Phase 6 Tests (T1-T8) — ALL PASS:**
- T1: Cold start cascade (W4TSC auto-builds UCP→Unit→Persistence→self) — PASS
- T2: UCP standalone build (zero deps) — PASS
- T3: W4TSC imports UcpStorage from @web4x/persistence — PASS
- T4: W4TSC imports from @web4x/unit — PASS
- T5: Filesystem uses PlatformDetection, not Once.isNode — PASS
- T6: HTTP standalone build — PASS
- T7: TLS standalone build — PASS
- T8: ONCE 0.3.23.0 full build (244 files) — PASS

**Sprint 1 Verification Tasks:**
- Task 6.7: PUML→SVG rendering — 18 PASS, 7 FAIL (legacy ONCE files only, Sprint 1 scope clean)
- Task 7.7: .ts.unit in UCP/0.3.23.1 — 11/11 PASS (all have typeM3 + origin)
- Task 8.5: MDAv4/M3/CLASS traceability — PARTIAL (filePath=NONE gap, origin+refs OK)
- Task 4.3: web4tscomponent-v0.3.23.1 info + links — PASS
- V1-V4: TypeM3 FOLDER, tsUnitCreate, PumlUnitConverter, tsc zero errors — ALL PASS

**Tootsie Tests Created:**
- Persistence/0.3.23.0/test/tootsie/Test01_PersistenceExports.ts — 9/9 PASS
- Web4TSComponent/0.3.23.0/test/tootsie/Test01_ImportPathVerification.ts — 9/9 PASS

### Pending Tasks
- Task 1.6: Verify boundary file extractions compile (HTTPSServer→HTTP, StaticFileRoute→HTTP, ACMERoute→TLS, FileOrchestrator→Filesystem, ProxyRoutes→HTTP) — WAITING for expert
- Permission prompt escalation from architect — velocity blocker

## Key Knowledge

### Tootsie Test Pattern (P25)
- Extend DefaultWeb4TestCase (or ONCETestCase)
- Empty constructor, init(scenario), executeTestLogic()
- Use Web4Requirement: `new DefaultWeb4Requirement()` → `await req.init({model:{name,description}})` → `req.addCriterion()` → `req.validateCriterion()` → check `req.allCriteriaPassed()`
- Import from `../../../../Web4Test/0.3.20.6/dist/ts/layer2/DefaultWeb4TestCase.js` (4 levels up from test/tootsie/)
- Run via: `npx tsx components/Tootsie/0.3.20.6/src/ts/layer4/TootsieTestRunner.ts <absolute-path-to-test>`
- P25 violation: NEVER use vitest describe()/it() — only Tootsie classes

### Known Bugs (from expert training)
- BUG-W1 through BUG-W19 documented in `Web4TSComponent/0.3.20.6/session/web4-1m-agent-learnings.md`
- Key: links fix auto-promotes prod (W7), pdca latest lost dual link methods (W14), staging completions not registered (W17)

### Rules
- NEVER filter output (P15) — no | head, | tail, | grep, 2>/dev/null
- NEVER implement features — report bugs to expert
- Use web4team:0.4 for test commands (was 0.2 before pane shift)
- otmux send is unreliable — ALWAYS verify with pane.capture after
