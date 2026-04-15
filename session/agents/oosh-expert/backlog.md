# OOSH Expert Backlog

## Open Bugs

- [ ] **JSONL stdin fd3** — some JSONL reads fail with fd3 redirection issue
- [ ] **Fork project dir** — forked sessions may cd to wrong project directory
- [ ] **agent.restart pane safety** — ensure.pane should verify pane is empty before sending commands
- [ ] **tronMonitor multi-instance** — derive screen name + env file from monitorPane

## Open Tasks

- [ ] Permission grants reset on /compact — unfixable (Claude Code behavior)
- [ ] T-54 otmux process detection — observer-independent ground truth
- [ ] T-59 otmux tree.detailed — missing sub-branch for new sessions
- [ ] T-63 otmux pane.capture delay parameter
- [ ] T-67 DRY reduction for remaining scripts (config, log, state, etc.)

## Done (this session)

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
