# OOSH Expert Backlog

## Open Bugs

- [ ] **JSONL stdin fd3** — some JSONL reads fail with fd3 redirection issue
- [ ] **Fork project dir** — forked sessions may cd to wrong project directory
- [ ] **agent.restart pane safety** — ensure.pane should verify pane is empty before sending commands
- [ ] **tronMonitor multi-instance** — derive screen name + env file from monitorPane
- [ ] **agent.monitor → tronMonitor switch recursion** — mitigated via timeout in f5bc1b8;
      full fix queued (screen.ensure re-entry guard + remove from auto paths). See
      `task-bug-agent-monitor-segfault.md`.

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
