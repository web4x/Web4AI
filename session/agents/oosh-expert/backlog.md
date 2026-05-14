# OOSH Expert Backlog

## ACTIVE — Sprint 1 in-flight (2026-05-12)

**Sprint 1 — State Correctness Architecture** (joint design with architect, PO-signed-off)
- Design doc: `scrum.pmo/sprints/sprint-1-state-correctness/sprint-1-design.md`
- Planning: `scrum.pmo/sprints/sprint-1-state-correctness/planning.md`
- 38 task files scaffolded (commit `aa39007` in workspace repo)

**Shipped this session (Sprint 1 + Sprint-0 cleanup, 2026-05-12 LATE):**
- SC-A.1 (`b4447f6`) — reconcile.diff primitive + 7 invariant checks
- SC-B.1 (`8feac46`) — event dispatch primitives + history rotation
- SC-A.2 (architect) — consistency.audit graded report
- SC-D.1 (`1df1973`) — consistency.fix interactive + consistency.reconcile dry-run + reconcile.apply primitive
- SC-D.2 (`cef6e8f`) — scrumMaster.cycle wires consistency.reconcile apply, gated by sweep stability (etime<60s recency filter)
- SC-C.1+C.2 (`1ed429c`) — agent.spawned (2 handlers) + agent.killed (3 handlers); emission at bootstrap + registry.remove
- SC-C.5+C.6+C.7 (`47d94b0`) — panes.shifted/swapped/pane.moved migrated to event dispatch; protected.* observers become thin emitters
- P0 tronMonitor (`e3424ed`) — verify rewritten ps-based; reset delegates to setup
- Tron P0 v1+v2 (`480459a`, `2a39a60`) — DRY private.otmux.is.key; comprehensive tmux key detection so prefix never leaks on keys

**Next unblocked (in dependency order):**
- [ ] **SC-C.3** (agent.renamed) — emit from agent.rename. Handlers: registry.update, pane.title.pushed, role.env.pushed. Pure event-dispatch refactor since most logic already exists.
- [ ] **SC-C.4** (agent.forked) — emit from agent.respawn / fork.byName. Handlers: registry.set, sessions.store, forks.append.
- [ ] **SC-C.8** (team.created) — emit from team.register. Handlers: teams.add, tronMonitor.add (closes V→C event-gap).
- [ ] **SC-C.9** (team.destroyed) — emit from team.remove + agent.killed cascade. Handlers: teams.remove, tronMonitor.remove, registry.prune, sessions.prune, queue.prune.
- [ ] **SC-C.10** (team.restored) — emit from teams.restore. Handlers: bulk-register, tronMonitor.bulk-add.

**Tester (handed off, awaiting coverage):**
- [ ] **SC-C.tests** — handler integration tests across all 10 events. Inject violations, verify each handler runs, confirm dispatch is stable, idempotency under repeat emission.
- [ ] **SC-A.3** — invariant detection fixtures (I1-I7 scenarios)
- [ ] **SC-B.3** — handler isolation + idempotency tests for SC-B.1 primitives
- [ ] **SC-D.3** — reconcile roundtrip: inject violation → cycle runs → reconcile apply → audit clean. Race tronMonitor.sync against scrumMaster.cycle, verify gate defers.

**Blocked on above:**
- [ ] None for expert — SC-C dispatch is stable enough to ship remaining 5 handlers in parallel. Per PO ship-in-batches policy.

**Can run in parallel any time:**
- [ ] SC-E ingress triple-defense audit (P3 applied to all ingress points)
- [ ] SC-F snapshot integrity + format versioning (depends on SC-E for regex)
- [ ] SC-G docs (last — needs A/B/C/D landed)

**queue.rename deferred** — panes.shifted handler for queue files renamed by pane addr. Current B5.1 caller signature (`<session>` only) doesn't carry pre/post-shift index map. Reconcile cycle catches stale queue files via S6 invariant in the meantime. Will add when caller signature evolves to include shift delta.

**Closed today (Sprint 0 cleanup + Sprint 1 foundation + Sprint 1 SC-A/B/C/D wave):**
- [x] T-B5-SWAP-1 fixed (`10e9fa0` + `b4c3b3f`) — pane arg normalization + test grep tolerance
- [x] T-B5-TTL-3 fixed (`14d5866`) — explicit TTL=0 short-circuit
- [x] D1 follow-up tronMonitor.switch (`aa7d6ac`) — verify-before-title
- [x] teams.env hygiene (`ebc8b5e`) — team.register triple-defense + teams.restore word-split fix
- [x] Sprint 1 joint design — architect-state-analysis.md + design.md + sprint-1-design.md consolidation
- [x] Sprint 1 scaffold (workspace `aa39007`) — planning.md + 38 task files
- [x] SC-A.1 (`b4447f6`) — reconcile.diff primitive
- [x] SC-B.1 (`8feac46`) — event dispatch primitives
- [x] **P0 tronMonitor verify** (`e3424ed`) — ps-based per-window check + reset delegates to setup
- [x] **SC-D.1** (`1df1973`) — consistency.fix interactive + consistency.reconcile dry-run + reconcile.apply primitive (architect drafted, expert reviewed/committed)
- [x] **SC-D.2** (`cef6e8f`) — scrumMaster.cycle wires reconcile apply with etime<60s stability gate
- [x] **Tron P0 v1** (`480459a`) — partial otmux send prefix-leak fix (single alphanumeric)
- [x] **SC-C.1+C.2** (`1ed429c`) — agent.spawned + agent.killed handlers + emission wiring
- [x] **SC-C.5+C.6+C.7** (`47d94b0`) — panes.shifted/swapped/pane.moved migrated to event dispatch
- [x] **Tron P0 v2** (`2a39a60`) — DRY private.otmux.is.key with full tmux key spec (33 KEY + 7 PROSE classified correctly)

**SC-B.2 effectively closed** — `history.append` + 1MiB rotation was bundled into SC-B.1 commit. Update task status when next touching the task file.

## Open Bugs

- [ ] **otmux help broken** — calls `tmux --help` instead of `this.help`.
  Tester discovery path for B8 methods was blocked by this. Pre-existing.
- [ ] **JSONL stdin fd3** — some JSONL reads fail with fd3 redirection issue
- [ ] **Fork project dir** — forked sessions may cd to wrong project directory
- [ ] **agent.restart pane safety** — ensure.pane should verify pane is empty before sending commands
- [ ] **tronMonitor multi-instance** — derive screen name + env file from monitorPane
- [ ] **agent.monitor → tronMonitor switch recursion** — mitigated via timeout in f5bc1b8;
      full fix queued (screen.ensure re-entry guard + remove from auto paths). See
      `task-bug-agent-monitor-segfault.md`.

## Closed 2026-05-11

- [x] **F2.2 sweep.detect accept-edits FP** — `634b7b6` — tail-only match
- [x] **otmux pane.size + pane.size.set** — `d624a9d` — for ud-po
- [x] **Raw-tmux gap closure** — `7358fc9` — 5 new methods (window.layout.get/set, window.aggressive.resize, pane.list.format, window.list.format)
- [x] **tronMonitor __test_ hijack** — `52fcf43` — defense-in-depth (add guard + teardown removal)
- [x] **Interactive B8 unlock** for ooshTeam/web4team/upDownTeam + aggressive-resize enable

## Closed 2026-04-30

- [x] **B5.1** — Pane operations notify hiveMind (commits `d0d3d92`, `da032b1`)
  - `otmux.split[.h|.v]` → `protected.panes.shifted`
  - `otmux.pane.swap` → `protected.panes.swapped`
  - `otmux.pane.move`/`pane.join` → `protected.pane.moved`
  - registry.set TTL priority (3-field format with timestamp)
- [x] **Bug #2** — `agent.unblock` strict allowlist (commit `8d01421`)
  - Only acts on `permission|tool-confirm|accept-edits|queued`
  - Removed leak-vector `*)` fallback that interrupted active agents
- [x] **Bug #3** — Push `HIVEMIND_ROLE` to shells after swap/move (commit `163b0a0`)
  - New helper `private.hiveMind.pane.pushRoleEnv`
  - Plain shells get the export; Claude TUIs are skipped (would inject text into prompt)
  - MVC propagation chain complete: registry + title + env

## Open Tasks (Sprint 0 — only one expert item left)

- [ ] **A1.2 fix 2b** (queued, awaits explicit greenlight): Fully relocate
      `claudeCode.session.probe` to Controller. Pure parser already shipped
      (commit 6d264df). Migration touches 8 callers (1 in claudeCode +
      7 in hiveMind). Plan:
      1. Add `hiveMind.agent.session.probe <pane>` Controller method that does
         `otmux send.raw /status Enter`, `sleep 3`, `pane.capture`, `send.raw Escape`,
         then calls `claudeCode.session.probe.fromCapture <captured>`.
      2. Update 7 hiveMind callers (lines 148, 1789, 3011, 3087, 3446, 3945) to use
         the local function instead of shelling out to `claudeCode session.probe`.
      3. Decide what to do with `claudeCode.session.probe` wrapper:
         - Option A (simple): leave as deprecated wrapper. claudeCode line 370
           (`private.claudeCode.resolve.byPane`) keeps using it.
         - Option B (clean): delete wrapper. Move `private.claudeCode.resolve.byPane`
           to hiveMind too (it's already Controller-coupled — reads sessions.env).

## Open Tasks (legacy, not in Sprint 0)

- [ ] Permission grants reset on /compact — unfixable (Claude Code behavior)
- [ ] T-54 otmux process detection — observer-independent ground truth
- [ ] T-59 otmux tree.detailed — missing sub-branch for new sessions
- [ ] T-63 otmux pane.capture delay parameter
- [ ] T-67 DRY reduction for remaining scripts (config, log, state, etc.)

## Pending tester coverage (no expert action needed)

- [ ] B2.3 — server restart recovery tests for B2 layout.save/restore
- [ ] D2.3 — tronMonitor-hiveMind integration tests
- [ ] E1.1/E1.2/E1.3 — end-to-end lifecycle integration tests
       (kill team → save → restore → verify UUIDs/cwd/layout match)
- [ ] otmux test suite re-run — earlier capture lost in background pipe
- [ ] `hiveMind consistency.fix` housekeeping run before re-running test suites
       (would drop ~51 environmental failures from claudeCode + likely 25+ from hiveMind)

## Done — Sprint 0 (continuation 2026-04-25→27)

- [x] **B4.1** otmux.attach `<?readonly>` + attach.readonly alias — `44ad07e`
- [x] **B4.2** otmux setup.default sets window-size=largest — `e0ddb95`
- [x] **C1** teams.save/restore compose B2 + kind/cwd/model + polling — `22bb525`
- [x] **C1 fix** teams.restore positional fork|join arg (T-ARCH-5) — `c6033dd`
- [x] **F3** subscription API resilience — rate-limit graceful + cache.age — `7c818c3`
- [x] **A1.2 fix 1** raw tmux → otmux (1-liner) — `66ddcd6`
- [x] **A1.2 fix 2** session.probe.fromCapture pure parser — `6d264df`
- [x] **A1.2 fix 3** delete claudeCode.agent.recover (duplicate) — `de65ac2`
- [x] **Test results docs** — claudeCode 125/201, hiveMind 337/376 — `95afed4`+`e4cce49`

## Done — Sprint 0 (initial wave 2026-04-24)

- [x] G1 per-session max_tokens detection — `ca49445`
- [x] G1 DRY refactor — 3 env constants — `ae002cd`
- [x] A1.1 Model Boundary Audit — findings
- [x] A1.2 View Leak Refactor Plan — findings
- [x] A2.1+A2.2 session-op portability — `1dc8b91`
- [x] A2 UUID resolution chain documented
- [x] B1.1+B1.2 otmux MVC audit + sender-prefix decision
- [x] B2 otmux layout.save/restore — `ec7fe28`
- [x] B3.1 otmux pane.lock idempotent — `75ab018`
- [x] C1.1+C1.2+C1.3 cold-restart audit + design
- [x] C3.2 sweep.detect fixtures — `afc57d3`
- [x] D1.4 tronMonitor prune EPERM + __test_ — `26c4fdf`
- [x] D1.5 pane resolution — `a030f68`
- [x] D1.6 screen resilience — `cd23b6e`
- [x] D1.4+D1.5 (renumbered) attach -r + window-size largest — `e9723ff`
- [x] D1.10 proven Tron recipe — `0f9330b`
- [x] D2.1+D2.2 team.register/remove → tronMonitor observer — `597f93e`
- [x] F1 scrumMaster velocity time-series + alerts — `3fd0420`
- [x] F2 sweep.detect prose-scrub patterns — `1996c9a` (+ 3 incremental commits)
- [x] Agent monitor defensive timeout — `f5bc1b8`
- [x] docs/oosh.md "Starting an OOSH Shell" — `a2161a7`

## Done (previous sessions)

- [x] T-69 object.verb naming — all 11 scripts
- [x] T-67 DRY reduction — otmux (190→164), hiveMind agents.discover
- [x] T-68 colorized output — otmux tree, hiveMind team.status
- [x] T-66 scrumMaster naming + subscription family
- [x] T-52 otmux new detached
- [x] T-53 otmux split target
- [x] T-51 pane.lock cross-platform
- [x] T-58 team.setup custom
- [x] T-56 no skip-permissions
- [x] T-60 claudeCode opus 1M
- [x] T-65 accept-edits BTab
- [x] UUID integrity — session.resolve.uuid (fork + autocompact)
- [x] DRY send — otmux.send smart by default
- [x] hiveMind 192/192 tests self-contained
- [x] team.pull + agent.restart (remote offloading)
- [x] sender prefix [@role pane]
- [x] ossh per-field config methods
- [x] scrumMaster subscription API (Linux)
- [x] os.check private OS-variant dispatch
- [x] os.hostname methods privatized
- [x] sed -i macOS → temp file pattern (cross-platform)
- [x] claudeCode list full UUIDs + role names
- [x] SSH deploy key (upDown.deployKey)
