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

### Sprint-2 CONTROLLER-RELIABILITY — the live-is-truth design family (2026-07-02, all designed, coherence-verified; expert impl blocked on Tron /rewind)
ONE law across all: **live proc-args = Model of record; caches (registry/sessions/snapshot) reconcile to it; timestamp-gated.** Each measured-then-designed.
- **MVC parity frame** (916e6aa, `sprint-teamsave-status-parity-FIX.md`): root cause = 3 divergent enumeration paths (tree.detailed/teams.save/status); fix = ONE shared live reader, 3 consumers, invariant by construction. Gates PF1-4. Agents already GREEN = the proof.
- **OTR-1 verify-submission** (d8ad770, `dispatch-submission-verified.md`): stage→submit→verify→poke→honest rc{0/2/3/1}; verify by input-line REGION not text-presence; submit/poke text-free (idempotent); agent.queue.drain gates dequeue on rc0. **LIVE — caught my own long msgs (rc2) repeatedly; remedy = short one-line pointer (ARON#3).** Supersedes BUG10.
- **C.0 live-reader** (ebbac8e, `task-s2-c.0-live-reader.md`): THE DRY foundation. Canonicalize+extend shipped `private.hiveMind.live.tupleset` → tuple `host|session|address|tty|role|uuid|kind|title|cwd`; +tty +host; LOCAL+REMOTE via teams.env host col + self-similar `ossh exec … protected.live.tupleset` (fail-safe marker, never silent-omit=kills PF3). parity/C.2/C.3 are PROJECTIONS; `identity.resolve`=pane-filtered view.
- **C.2 / OTR-3 reconcile-after-fork** (`task-s2-c.2`): completes the SKIPPED I2b (cached-uuid==live, hiveMind:~5047 "TODO batch live UUID") via c.0 reader; tty-match adopt (uuid always, role never fabricated); team.audit empty-uuid/unknown-route; route auto-heal. Tester RED delivered (T-RECONCILE-FORK 4/4 fail by design).
- **C.3 / OTR-11 boot-identity** (52bdb7e, `task-s2-c.3`): boot hook (pre-compress.sh:L13) is the LAST $TMUX_PANE (BUG7) holdout → stale → "unknown" clobber of shared session/agents/unknown/boot.md. Fix: anchor otmux pane.self; role@host from LIVE title>cache; @host dir pick (auto-closes per-host directive); fail-safe never-clobber; retire unknown/.
- **COHERENCE PASS** (d25bc18): fixed 2 pre-rewind contradictions — (1) agents.discover role REGISTRY-first vs c.3 needs TITLE-first → pinned c.0 role=title-first>registry (impl must flip agents.discover); (2) c.2 named claude.processes/"tree.detailed tupleset" not canonical live.tupleset → c.2 now consumes live.tupleset. Field names else all match.
- **plantuml non-author render**: PASS (docs-only render, real 55KB svg). Doc finding: worked-example verification assumes <file>.svg but svg is named by @startuml.
- **object.verb IS the no-flag principle** (Tron): recorded + ARON propagated to 6 SKILLs (7b51bbc) + catalog §F (6d84efd).
- **task-s2-h fleet dashboard** (ec32300): `team.sweep` no-arg = PROJECTION of c.0 `live.tupleset` grouped by session (NOT re-enumeration — PF3 lesson). bg-shell-count via tty→pane_pid batch-ps subtree; context% via uuid→JSONL token-math (no capture; cliff ≤20%⚠). Remote+never-silent-omit inherited from c.0. THE SM view (idle/active+shells+cliff). **ARCHITECTURE WIN: c.0 = ONE reader; parity/C.2/C.3/dashboard = all projections of it.**
- **task-s2-g investigation (otmux-send reliability) — CLOSED** (e6eb721, 359a1f0): **g.1** diagnosed the OTR-1 non-claude regression — M1 verify+poke runs on ALL targets (macos old send had none) → false rc2; M2 isClaudeCode treats `node` as claude unconditionally → Escape into a node shell → hang. Fix=branch send.smart on kind (claude=unchanged/5-5-safe; non-claude=stage+Enter, no Escape/poke, light-confirm) + node-hardening + session→active-pane. **g.2** c2: DIVERGENT, canonical=DEV (3 fixes macos lacks: '''-crash+bash-n [f13f35d], param-completion [d83907b], test-proven T-C2-QUOTE); forward-port dev→macos. **g.3** per-capability: DEV leads ALL 4 (otmux/c2/boot/install); dev 966 ahead, macos 4-unique; "macos more reliable"=older/simpler not superior; reconcile=dev→macos gated on dev-green; only reverse-port candidate=`04b54a5` macos SSH-send Escape-before-Enter (review vs dev send). S3=forward merge dev→macos preserve the 4. **KEY meta: dev is the canonical trunk; macos.latest = lagging target that RECEIVES dev.**

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

---
## Session update 2026-07-02 (measured location: ooshTeam:0.1 @ MacStudio; peer oosh-po@MacStudio, WODA.test=v36421 has dash)
NOTE: header above says WODA.prod (peer instance save) — left intact; THIS session ran on ooshTeam@MacStudio. Verify pane on boot (`otmux pane.get.target`), don't assume.

### Delivered this session (all design, WHAT/WHY; git mailbox = channel)
- **Sprint SETUP_SERVER cross-platform** (`session/tasks/sprint-setup-server-crossplatform.md`):
  - **S1** (f4aea76) — ✅ PO-APPROVED. D1 state reorder (mode branch before user.installation.done), D2 XOR via numeric-RESULT redirect (state.find, no literal indices), D3 os-derived platform defaults (config init single seam), D4 P1/P2 convergence. Expert shipped S2 (566fed9) + S3 (650e743); tester S4/S6 GREEN.
  - **S8** (e20dbe27) — QA. Self-heal reconcile for EXISTING installs (F1): two-tier detect (schema stamp + order-invariant probe) → reconcile-BY-NAME (delete+shared-declare+`state.set name`), drive-free (F2-safe), zero engine edit. Awaiting PO QA.
- **#13 claudeCode/init dash-safe** (`session/tasks/claudecode-install-dash-safe.md`):
  - **D13.A** (966d4b1c) — design delivered; **#13 CLOSED as already-solved** by PO (init/oosh already implements the POSIX-prelude + dual-form re-exec @287/294 + bash self-install). Design stands as documented rationale. Do NOT implement.

### Open / next
- **S8** pending PO QA (non-blocking for naked-path gate).
- Sprint-1 tail is **Tron-blocked**; no new assignment. Free/idle.
- Prior open items (MVC rename bug, ADR-001/002 rollout, 16 cross-platform hardcoded paths, ENV-PURE-STATE design) still stand from earlier sessions.
