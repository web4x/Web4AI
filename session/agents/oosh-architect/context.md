# oosh-architect Context

**Updated**: 2026-06-27 (SM-requested save)
**Role**: oosh-architect @ ooshTeam:0.1
**Machine**: WODA.prod (v60211)
**Session name**: oosh-architect@WODA.prod

## Identity
I am the OOSH framework architect. I design systems — I do NOT implement, test, or monitor. I create PlantUML diagrams, ADRs, design specs, and review expert implementations. TRON directives override my recommendations.

## Team Layout
- ooshTeam:0.0 — oosh-po (quality owner, sprint planning)
- ooshTeam:0.1 — ME (oosh-architect)
- ooshTeam:0.2 — oosh-expert (implementation)
- ooshTeam:0.3 — oosh-tester (validation)
- ooshTeam:0.4 — oosh-expert-shell (bash)
- ooshTeam:0.5 — oosh-tester-shell (bash)

## MVC Architecture (CRITICAL)

OOSH follows strict MVC with 4 scripts:

| Script | Role | Owns | NEVER touches |
|--------|------|------|---------------|
| **claudeCode** | Model | Session UUID, context %, PID, JSONL. Portable without tmux. | hiveMind functions |
| **otmux** | View | Pane management, capture, send, layout. Reads registry FILE only. | claudeCode/hiveMind source |
| **hiveMind** | Controller | Orchestrates Models in View panes. Owns ALL state stores. | Direct tmux (uses otmux) |
| **tronMonitor** | Monitor | Tron's visual dashboard. Auto-syncs with Controller. | State mutation |

**MVC boundary:** claudeCode NEVER calls hiveMind. otmux has ZERO references to claudeCode/hiveMind.

### State Stores (hiveMind owns)
| Store | File | Format |
|-------|------|--------|
| roles.env | ~/config/hivemind.roles.env | pane\|role\|timestamp |
| sessions.env | ~/config/hivemind.sessions.env | pane\|uuid |
| teams.env | ~/config/hivemind.teams.env | session\|description |
| forks.env | ~/config/hivemind.forks.env | append-only audit log |
| snapshots | ~/config/hivemind.snapshot.*.env | session\|addr\|role\|uuid\|title |
| queue | ~/config/hivemind.queue/*.queue | epoch\|intent\|text |
| tronMonitor.env | ~/config/tronMonitor.env | session list |
| active.team | ~/config/hivemind.active.team | single session name |

### 7 Invariants (I1-I7)
I1: roles.env panes MUST exist in tmux. I2: sessions.env panes in roles.env, UUID matches live. I3: teams.env = running tmux sessions. I4: tronMonitor ⊆ teams.env. I5: Snapshot UUIDs correct at save time. I6: Queue files reference valid panes. I7: role.fromTitle() extracts bare role from any title.

### Consistency Model
Option C (events) + Option B (reconcile safety net). Every mutation emits event → handlers update stores. consistency.reconcile on SM sweep. consistency.audit validates I1-I7.

## Agent Lifecycle

### Boot: team.setup → fork/bootstrap → /rename role@hostname → pane.title → registry.set → boot.md
### Rewind: NEVER compact. Only TRON rewinds. Read boot.md → context.md → learnings.md → verify pane → report to PO.
### Fork: claudeCode fork <uuid> auto-compacts. NEVER send keystrokes during compact.

## Naming Convention (Option C, TRON-approved)
- Pane title + Claude /rename: `role@hostname` (e.g., oosh-architect@MacStudio)
- Registry: bare `role` (no @suffix)
- role.fromTitle() strips @* — all read paths work
- HIVEMIND_HOST = hostname -s (cached)
- 9 write paths in hiveMind

## PlantUML

```bash
plantuml -tsvg file.puml           # render
plantuml -tsvg -failfast2 -v file.puml  # verbose
```
- @startuml = path-safe slug (no spaces/unicode). Separate `title` for display.
- SVG >10KB = real, <1KB = error. Commit .puml + .svg together.
- Layer colors: L3=#F5F5F5, L2=#E8F5E9, L4=#FFF3E0, L5=#FCE4EC, External=#EEEEEE

## Units, Scenarios, Traceability (from robbinTeam)

### Scenario = {ior: {uuid, component, version}, owner, model}. EVERYTHING is a scenario (P1).
### Unit = scenario for a file/folder/code element. Fields: origin (IOR to source), typeM3 (CLASS/RELATIONSHIP/FOLDER), references[] (bidirectional links with syncStatus).
### .ts.unit files live NEXT TO .ts source, same UUID as M3 CLASS unit.

### Traceability Chain (6-step, LOCKED)
Requirement → UseCase → Class → Method → Implementation → Test
- Task = NAVIGATION (Sprint→Task→coveredReqs), NOT chain
- ONE UC per Task, ONE Method per UC (singular at intermediate hops)
- Forward-only. Champagne = structural + intentional (Test.verifies[]).

### MDAv4: M3/CLASS/{Name}.unit, M3/RELATIONSHIP/extends.unit, M3/FOLDER/{name}.unit

## Deliverables (cumulative)

### Designs (13): fork.best, state-correctness, tronMonitor.fit, send-prefix, otmux-fast-path, naming-migration, ADR-001 (npm exports), ADR-002 (version mapping), McDonges disaster, Unit gap analysis, @web4x/cli review, resolve.byName, team.migrate

### PUMLs (13): StateStores, EventFlow, ReconcileCycle, TronMonitor Fit, H1.1 claudeCode UCs, H1.2 otmux UCs, I1 ContextAwareSend, W4TSC-IMC Class+UseCase, UCP Class, Unit Class, Persistence Class, Unit-Prod Class

## Open Items
- MVC rename bug: tree.detailed prefers pane title over stale JSONL
- Option A→C follow-up: 5 /rename sites pending
- ADR-001/002 rollout queued
- 16 cross-platform hardcoded paths reported
- Branch migration: dev..macos.latest = 0 (synced)

### Since Jun 10
- Docker install design review: Volume mount for SSH keys (not baked, not secret manager). Real bug is sequencing — install clones HTTPS first, sets up SSH after. Fix: reverse order.
- Kernel bug design: problem.log NEVER sets STEP_DEBUG. 4 sites in log script (117, 206, 230, 253) all need STEP_DEBUG=ON removed. Logger ≠ debugger. this.load: optional methods (status/usage/help) = silent return 0.
- Bug triage: 7 restore-process bugs triaged for Sprint 0. HIGH: list filter, UUID completion, claudeCode stop, send prefix guard. MEDIUM: age sort. LOW: menu nav (doc), zoom helper.
- config.save EPERM fix: routed to expert (implementation, not architecture).

### Since Jun 22 (WODA.prod era)
- **ENV-PURE-STATE analysis**: traced 2 pollution sources in user.env. Design: source chain → this, config.validate guard. DONE.
- **team.push choreography** (dd3272e): full 8-section controller design. All 13 migration learnings mapped. APPROVED, implemented (9d48bd0+ee12cde), 7/7 tests GREEN.
- **S-1 projectHash review** (c73137a): BUG found — sed misses `.` and `_` replacement. Fix: `s/[\/._]/-/g`.
- **S-6 UUID-capture-on-fork spec** (c73137a): captureForkedUUID — pre/post fork diff + sessions.env write. Closes GAP#12.
- **Constructor Contract S-1** (63659a3 on dev): constructor-contract principle as FIRST Philosophy bullet in first-principles.md. QA-approved.
- **Constructor Contract S-5 design** (3d9c92f): harvest-resolve-merge for no-loss self-healing init. config.repair = config.save alias.
- **first-principles.md additions** (9e4915c): Self-Care Across the Whole Lifecycle (Tron verbatim) + no-source-of-scripts rule + "clean perspective of truth" (never trust inherited env).
- **clean-boot-bugs review** (f5253b9): A) config.save ALLOW-LIST design (clutter = test/VSCode/terminal leakage from S-5 harvest); B) color-boot — corrected PO premise (dev DOES source setup.color.env), culprit = `source $OOSH_DIR/log` after colors or PS1; C) pane.self confirmed single self-ID primitive (expert closed all 6 flagged sites); D) consolidate pane-target completions.
- **clean-boot S2 doctrine reconcile** (6540254 dev): closed the Rule A conflict — env files = pure exports ONLY, no source lines; `this` owns the env source chain (user.env→oosh.env→log.env). first-principles.md lines 8+20 reconciled. Report-back aefd4d2.

## Completed Sprints
- **sprint-constructor-contract**: **COMPLETE.** My deliverables: S-1 principle (63659a3), S-5 harvest-resolve-merge design (3d9c92f), S-12 lifecycle review + PUML (8ee8564+8427057). S-8 tester hat: T-CONSTRUCTOR 17/17 GREEN (e388c98+2f49d28). 3 minor gaps found, all fixed.
- **sprint-team-migration**: **COMPLETE.** My deliverables: team.push choreography (dd3272e), S-1 projectHash review (c73137a, BUG found), S-6 UUID-capture spec (c73137a). Tester hat: T-PUSH 16/16 GREEN.
- **sprint-config-selfheal**: **COMPLETE.** Tester hat: CS-6 T-C2-QUOTE 3/3 GREEN + CS-7 T-ENV-INSTALL 6/6 GREEN (53729c0). Full test.config 47/47 GREEN.

## Backlog
- H1.3: hiveMind use case PUML
- TeamMigrate BulkRestoreExplosion PUML
- SC-G.3: Sprint 1 PUML updates

## RULES (eternal)
- NO COMPACT — only TRON rewinds
- NEVER ASSUME — ALWAYS MEASURE
- Architect designs, expert implements, tester validates
- TRON overrides architect. PO assigns. SM monitors.
- Grep ALL occurrences when identifying write sites
- Don't cd ~/oosh from Bash — use expert-shell via otmux
