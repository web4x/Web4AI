# Dev Branch Sync Analysis — dev vs test/macos.latest

**Date:** 2026-05-14
**Author:** oosh-architect
**Purpose:** Identify features in dev branch missing from our working branch (macos/test/macos.latest). Tron checks which to merge.

## Summary

| Direction | Scripts Affected | New Methods |
|-----------|-----------------|-------------|
| **Dev → Macos** (dev has, we don't) | 18 scripts | ~200+ methods |
| **Macos → Dev** (our Sprint 0 work) | 5 scripts | ~170+ methods |

The branches diverged significantly. Dev has infrastructure (init, user mgmt, SSH hardening, platform tests, backup, disk calc) that we never pulled. We have MVC lifecycle (fork.to, agent.send, context-aware send, layout persistence, state correctness) that dev doesn't have.

---

## MERGE CANDIDATES: Dev → Macos (check to merge)

### this (kernel)

- [ ] `this.git.branch.short()` — return short branch name
- [ ] `this.methodNotFound()` — structured handler for unknown methods

### oo (framework lifecycle)

- [ ] `oo.mode.setup()` — initialize mode system
- [ ] `oo.mode.stage()` — staging workflow
- [ ] `oo.mode.align()` — align branches
- [ ] `oo.stage()` — stage changes
- [ ] `oo.branch.list()` — list branches
- [ ] `oo.dev.to.testing()` — promote dev → testing
- [ ] `oo.testing.to.prod()` — promote testing → prod
- [ ] `oo.promote.report()` — show promotion status
- [ ] `oo.promote.status()` — promotion pipeline status
- [ ] `oo.method.new()` — create new method (rename of new.method?)
- [ ] `oo.test.new()` — create new test
- [ ] `oo.prereqs.install()` — install prerequisites
- [ ] `oo.tmp.cleanup.testing()` — cleanup temp testing files
- [ ] Parameter completions for branch/stage/cmd/packageName/baseBranch

### config (configuration)

- [ ] `config.init.check()` — verify config state
- [ ] `config.init.env()` — initialize environment
- [ ] `config.init.full()` — full initialization
- [ ] `config.init.shared()` — shared config setup
- [ ] `config.init.user()` — user-specific init
- [ ] `config.ssh.set.config.host()` — set SSH host in config
- [ ] `config.unset()` — remove config variable
- [ ] `config.v()` — short alias for version/value?
- [ ] Parameter completions for name/sshConfigName/username

### log (logging)

- [ ] `log.install()` — install log infrastructure
- [ ] `log.install.errors()` — error log setup
- [ ] `log.install.finish()` — finalize install
- [ ] `log.install.init()` — initialize install logging
- [ ] `log.install.live()` — live log setup
- [ ] `log.live.panes()` — live log to panes
- [ ] `log.live.panes.stop()` — stop live pane logging

### state (state machines)

- [ ] `state.on()` — web4 compliance alias for state.of
- [ ] `state.entry.list()` — object.verb rename of state.list
- [ ] `state.entry.add()` — object.verb rename
- [ ] `state.entry.find()` — find state entry
- [ ] `state.entry.rename()` — rename state
- [ ] `state.entry.set()` — set state entry
- [ ] `state.transition.check()` — check transition validity
- [ ] `state.transition.next()` — advance state
- [ ] `state.transition.stage()` — stage transition
- [ ] `state.machine.diagnose()` — diagnose machine issues
- [ ] `state.declaration()` — show state declaration
- [ ] `state.edit()` — edit state file

### line (text processing)

- [ ] `line.clean.config()` — clean config file
- [ ] `line.filter.emptyLines()` — filter blank lines
- [ ] `line.find.function()` — find function in file
- [ ] `line.get.parameter()` — extract parameter from line

### path

- [ ] `path.parameter.completion.file()` — file path completion

### ossh (SSH management) — LARGE

- [ ] `ossh.cmd()` — run command on remote
- [ ] `ossh.exec.tty()` — TTY-aware remote exec
- [ ] `ossh.harden()` — full server hardening suite
- [ ] `ossh.harden.sshd()` — harden SSH daemon
- [ ] `ossh.harden.fail2ban()` — install fail2ban
- [ ] `ossh.harden.firewall()` — configure firewall
- [ ] `ossh.harden.packages()` — security packages
- [ ] `ossh.harden.unattended.upgrades()` — auto-updates
- [ ] `ossh.harden.sshd.allowusers()` — restrict SSH users
- [ ] `ossh.create.and.install()` — create key + install
- [ ] `ossh.install.log()` — install logging
- [ ] `ossh.install.user.remote()` — remote user install
- [ ] `ossh.key.folders.create/delete()` — key folder mgmt
- [ ] `ossh.key.get/set.name()` — key name management
- [ ] `ossh.known.hosts.remove()` — remove known host
- [ ] `ossh.pm.discover()` — discover package manager
- [ ] `ossh.prereqs.install()` — install prerequisites
- [ ] `ossh.publicId.get()` — get public key
- [ ] `ossh.server.get.ip()` — get server IP (darwin/linux)
- [ ] `ossh.server.get.port()` — get SSH port
- [ ] `ossh.fix.rights()` — fix file permissions
- [ ] `ossh.config.shared.create/link()` — shared SSH config
- [ ] 20+ parameter completions

### user (user management)

- [ ] `user.create.completion.*()` — creation completions (uid, gid, password, username)
- [ ] `user.group.add.completion.*()` — group completions
- [ ] `user.linux.delete()` — delete Linux user
- [ ] `user.oosh.install()` — install OOSH for user
- [ ] `user.password.set()` — set password (darwin/linux)
- [ ] `user.authorized.keys.update()` — update authorized_keys
- [ ] Parameter completions for groupName/userName

### os (system info)

- [ ] `os.platform.list()` — list platforms
- [ ] `os.platform.test()` — test platform support
- [ ] `os.platform.test.all()` — test all platforms

### disk (disk tools)

- [ ] `disk.calc.bytes.from/to.gb/mb/kb/tb()` — 8 byte conversion methods

### myId (identity)

- [ ] `myId.create()` — create SSH identity
- [ ] `myId.create.github.deploy.key()` — GitHub deploy key
- [ ] `myId.get()` — get identity
- [ ] Parameter completion for sshConfigName

### certificates

- [ ] `certificates.once.scenario.list()` — list scenarios
- [ ] Parameter completion for scenario

### backup — LARGE

- [ ] `backup.backupPath.get()` — get backup path
- [ ] `backup.errors.list()` — list backup errors
- [ ] `backup.file.list.notBackedUp/onlyInBackup/onlyInSource/onlyInTarget/same()` — file diff methods
- [ ] `backup.folderLink.replace.by()` — symlink replacement
- [ ] `backup.log.capture.mode()` — capture logging mode
- [ ] `backup.path.get.relative()` — relative path
- [ ] `backup.result.list.lastDiff/lastRaw()` — result listing
- [ ] Parameter completions for configPath

### test.suite

- [ ] `test.suite.core()` — run core tests only
- [ ] `test.suite.extended()` — run extended tests
- [ ] `test.suite.parameter.completion.logLevel()` — log level completion

### claudeCode (Model)

- [ ] `claudeCode.session.probe()` — invasive UUID discovery via /status (we moved this to hiveMind per A1.2)
- [ ] `claudeCode.context.read.tui()` — TUI-based context read fallback
- [ ] `claudeCode.list.named()` — list sessions with names
- [ ] `claudeCode.recover()` — session recovery
- [ ] `claudeCode.yolo()` — skip permissions alias
- [ ] `claudeCode.c()` / `claudeCode.p()` / `claudeCode.v()` — short aliases
- [ ] Parameter completions for file/model/pane/path/sessionId/workdir

### otmux (View)

- [ ] Short aliases: `otmux.a/d/dp/kp/kw/ls/lsb/lsc/lscm/lsk/lsp/lsw/msg/nw/rp/rw/sp/sw/v/z()` — ~20 convenience shortcuts
- [ ] `otmux.pane.capture.full()` — full scrollback capture
- [ ] `otmux.pane.split/split.h/split.v()` — additional split aliases
- [ ] `otmux.pane.up/down/left/right()` — directional nav aliases
- [ ] `otmux.pane.zoom()` — zoom alias
- [ ] `otmux.session.*()` — full session namespace aliases (attach/detach/has/kill/list/lock/new/next/prev/switch)
- [ ] `otmux.send.confirm/display/menu/prompt/run()` — tmux command wrappers
- [ ] `otmux.send.keys()` — legacy send keys
- [ ] `otmux.copy.mode()` — enter copy mode
- [ ] `otmux.paste()` — paste buffer
- [ ] Parameter completions for buffer/client/file/option/pane

### hiveMind (Controller)

- [ ] Short aliases: `hiveMind.sweep/unblock/teach/train/focus/spawn/monitor()` — convenience wrappers
- [ ] `hiveMind.cold.recover()` — cold recovery
- [ ] `hiveMind.cycle.full()` — full monitoring cycle
- [ ] `hiveMind.auto.commit()` — auto git commit
- [ ] `hiveMind.fix.path()` — fix PATH
- [ ] `hiveMind.improvement()` — CMM improvement workflow
- [ ] `hiveMind.handoff()` — agent handoff
- [ ] `hiveMind.oosh.init()` — initialize OOSH in session
- [ ] `hiveMind.monitor.approve()` — approve from monitor
- [ ] Various completion functions
- [ ] Parameter completions for agentId/name/pane/workdir

### scrumMaster

- [ ] `scrumMaster.context.measure()` — measure context
- [ ] `scrumMaster.evaluate.measure()` — evaluate metrics
- [ ] `scrumMaster.health.measure()` — health check
- [ ] `scrumMaster.pane.measure()` — pane metrics
- [ ] `scrumMaster.speed.measure()` — speed metrics
- [ ] `scrumMaster.subscription.measure()` — subscription metrics
- [ ] `scrumMaster.subscription.measure.api()` — API-based measurement
- [ ] `scrumMaster.team.measure()` — team metrics
- [ ] `scrumMaster.velocity.measure()` — velocity metrics
- [ ] `scrumMaster.velocity.measure.target()` — velocity target
- [ ] `scrumMaster.metrics.cycle()` — metrics cycle
- [ ] Parameter completions for machineName/session/agentName

### ng/c2 (completion system)

- [ ] Object.verb renames (c2.functions.get, c2.functions.format, c2.function.declaration.get, c2.function.parameter.get, c2.function.description.format)
- [ ] Sub-method completion logic (word >1 → check sub-methods before params)
- [ ] Compound method resolution (oo mode stage [tab])
- [ ] Exact match narrowing (rm vs rmi)
- [ ] addDefaultValue suppression (prevents literal placeholder in completion)
- [ ] Boot fix: symlink resolution via cd+pwd (fixes line 636 bug)
- [ ] Package manager DRY (apt/dnf/$OOSH_PM)
- [ ] File permission hardening (private.ensure.groupWrite)
- [ ] Parameter completions: c2.parameter.completion.script/path/functionNameFilter/method

### ng/c2 — CRITICAL FIX NEEDED

- [ ] **.protected. filter** — dev REMOVED the `| line.filter "\.protected\."` at both filter locations. I already patched this back into dev (lines 94 + 148). Verify patch is committed.

---

## NOT RECOMMENDED TO MERGE (conflicts with Sprint 0 MVC decisions)

| Dev Method | Why NOT merge |
|-----------|---------------|
| `claudeCode.session.probe()` | Moved to hiveMind per A1.2 — invasive TUI method belongs in Controller, not Model |
| `scrumMaster.*measure*()` | We renamed to object.verb: `*.check()`, `*.read()`, `*.capture()` etc. Dev has verb.object naming |
| `hiveMind.monitor/sweep/unblock()` (bare aliases) | We use `agent.monitor`, `team.sweep`, `agent.unblock` — fully qualified object.verb |

---

## BIDIRECTIONAL MERGE NEEDED

The branches must eventually converge. Recommended approach:
1. **Tron checks** which dev features to pull into macos
2. **Expert merges** checked items one script at a time
3. **Our Sprint 0 work** needs to go INTO dev (separate task — 170+ new methods)
4. **Naming conflicts** (measure vs check, monitor vs agent.monitor) resolved per OOSH object.verb convention
