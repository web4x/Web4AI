# oosh-architect Context

**Updated**: 2026-06-10 (comprehensive reboot save)
**Role**: oosh-architect @ ooshTeam:0.1
**Machine**: MacStudio
**Session name**: oosh-architect@MacStudio

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
