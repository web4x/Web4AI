# OOSH Expert Backlog

## Open Bugs

- [ ] **JSONL stdin fd3** — some JSONL reads fail with fd3 redirection issue
- [ ] **Fork project dir** — forked sessions may cd to wrong project directory
- [ ] **agent.restart pane safety** — ensure.pane should verify pane is empty before sending commands
- [ ] **tronMonitor multi-instance** — derive screen name + env file from monitorPane
- [ ] **agent.monitor → tronMonitor switch recursion** — mitigated via timeout in f5bc1b8; full fix queued (screen.ensure re-entry guard + remove from auto paths). See `task-bug-agent-monitor-segfault.md`.

## Open Tasks (Sprint 0 implementation, awaits tester coverage)

- [ ] **A1.2 fixes** (pending A1.3 tester): (1) private.claudeCode.complete.panes raw `tmux` → `otmux panes`, (2) session.probe split into fromCapture parser + Controller TUI flow, (3) agent.recover deletion (duplicate of hiveMind.agent.unblock)
- [ ] **C1 cold-restart implementation** (pending C1.4 tester): extend teams.save with layout/cwd/model/kind fields; rewrite teams.restore to compose `otmux layout.restore` + per-pane `claudeCode fork/join.byID`
- [ ] **B1 Option B migration** (pending B1.3 tester): move prefix logic from `private.otmux.send.prefix` → `hiveMind.send.message`. Deprecation shim with `HIVEMIND_SEND_PREFIX_OWNED_BY_CONTROLLER` env guard.

## Open Tasks (legacy, not in Sprint 0)

- [ ] Permission grants reset on /compact — unfixable (Claude Code behavior)
- [ ] T-54 otmux process detection — observer-independent ground truth
- [ ] T-59 otmux tree.detailed — missing sub-branch for new sessions
- [ ] T-63 otmux pane.capture delay parameter
- [ ] T-67 DRY reduction for remaining scripts (config, log, state, etc.)

## Done — Sprint 0 (2026-04-24)

- [x] G1 per-session max_tokens detection (1M vs 200k) — commit ca49445
- [x] G1 DRY refactor — 3 env constants — ae002cd
- [x] A1.1 Model Boundary Audit — findings
- [x] A1.2 View Leak Refactor Plan — findings
- [x] A2.1+A2.2 session-op portability — 1dc8b91
- [x] A2 UUID resolution chain documented
- [x] B1.1+B1.2 otmux MVC audit + sender-prefix decision
- [x] B2 otmux layout.save/restore — ec7fe28
- [x] B3.1 otmux pane.lock idempotent — 75ab018
- [x] C1.1+C1.2+C1.3 cold-restart audit + design
- [x] C3.2 sweep.detect fixtures — afc57d3
- [x] D1.4 tronMonitor prune EPERM + __test_ — 26c4fdf
- [x] D1.5 pane resolution — a030f68
- [x] D1.6 screen resilience — cd23b6e
- [x] D1.4+D1.5 (renumbered) attach -r + window-size largest — e9723ff
- [x] D1.10 proven Tron recipe — 0f9330b
- [x] D2.1+D2.2 team.register/remove → tronMonitor observer — 597f93e
- [x] F1.1+F1.2 scrumMaster velocity time-series + alerts — 3fd0420
- [x] Agent monitor defensive timeout — f5bc1b8
- [x] docs/oosh.md "Starting an OOSH Shell" — a2161a7

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
