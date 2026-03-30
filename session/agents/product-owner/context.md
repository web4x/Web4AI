# Product Owner Context

**Updated**: 2026-03-30 (pre-compact)
**Role**: product-owner
**Pane**: TRONinterface:0.0 (LOCAL tmux — NOT MacStudio)

## Session Summary
Post-compact recovery. Monitored MacStudio agents, verified d026f82 pushed, tester 8/8 tests pass for 3-level dispatch. Found config set subprocess bug (pipeline race), expert fixed (6beb2d8). Found mode.base.get/set mismatch (getter reads user.env, setter writes oosh.env). Delegated oo checkout task to baseTeam. Asked otmux team about attach.remote feasibility.

## Commits on test/macos.latest (MacStudio)
- `c6c2bd9` — otmux setup.default: pane headers + OS-independent clipboard
- `d488b8e` — hiveMind task.delegate: remote scp+send automation with completion
- `6e99856` — otmux pane.history: deep scrollback capture
- `31aee95` — oo mode: configurable base directory
- `d026f82` — oo mode fix: config set not config.set, base.get not _base, remove bootstrap delegation
- `3422f9c` — test/test.oo: 8 tests for oo mode 3-level dispatch (all pass)
- `6beb2d8` — Fix config set pipeline race (cat|tee same-file)
- `ff01735` — oo mode.base.set: use config save oosh OOSH to persist to oosh.env
- `3ebd296` — Fix config save: exclude OOSH_/LOG_ vars from user.env
- `e159f09` — Fix config save prefix matching
- `1cd415b` — Fix hiveMind consistency.audit: generic roles, dup UUIDs, garbage entries

## Active Tasks

| Team | Agent | Task | Status |
|------|-------|------|--------|
| baseTeam:0.0 | oosh-expert | `oo checkout <version>` + fix mode.base.get | DELEGATED — paired with tester |
| baseTeam:0.1 | oosh-tester | Test oo checkout + regression tests | DELEGATED — paired with expert |
| hiveMindTeam02_03_26:0.0 | hiveMind-expert | Fix consistency.audit (audit misses panes, bash 3.2 compat) | IN PROGRESS |
| hiveMindTeam02_03_26:0.1 | hiveMind-tester | Test consistency.fix (was at 11% context) | May have compacted |
| otmuxTeam:0.0 | otmux-expert | Assess `otmux attach.remote <sshConfig> <session>` feasibility | ASKED — investigating fork/dup UUIDs first |

## Open Issues

1. **mode.base.get/set mismatch**: setter writes to oosh.env via `config save oosh OOSH`, getter uses `config get` which reads user.env → empty → wrong fallback. Reported to oosh-expert.
2. **hiveMind consistency.audit bash 3.2**: `local -A` crashes on macOS bash 3.2. Shebang resolves to /bin/bash not homebrew bash 5. PATH ordering issue.
3. **hiveMind audit misses panes on McDonges**: Only shows 1 of 6 local panes. Silently skips unregistered panes.
4. **otmux pane.title no target completion**: `<target>` param needs completion for pane addresses.
5. **hiveMind task.delegate scp fails**: `scp` to MacStudio.native works manually but fails via task.delegate.

## Tron Feedback This Session (F41-F47)
- **F41**: Don't start untrained agents claiming expert role
- **F42**: No underscores in OOSH methods
- **F43**: `config set` (space) not `config.set` (dot)
- **F44**: When oosh symlink switched, use `./oo mode` to recover
- **F45**: NO RAW TMUX — use otmux wrappers always
- **F46**: Use otmux shells (TRONinterface:0.1 remote, 0.3 local) — don't run cd+git in direct Bash
- **F47**: Never STOP agents unless doing something wrong. Unfinished work = damage. Send "after current work:" not "STOP"

## TRONinterface Layout (McDonges local)
- 0.0 = PO (me)
- 0.1 = SSH to MacStudio.native (remote commands) — title: remote.ooshShell
- 0.2 = shell
- 0.3 = local oosh shell

## MacStudio Team Layout (from tree.detailed)
- baseTeam: 0.0=oosh-expert, 0.1=oosh-tester, 0.2=agent-trainer, 0.3=test shell
- hiveMindTeam02_03_26: 0.0=hiveMind-expert, 0.1=hiveMind-tester, 0.2=test shell
- otmuxTeam: 0.0=otmux-expert, 0.1=otmux-tester, 0.2=test shell
- osshTeam: 0.0-0.2=zsh shells, 0.3=sm-ossh
- projectTeam, backupTeam, claudeCodeTeam, odockerTeam also exist

## Local State
- `~/oosh` on McDonges → macos.latest worktree
- `~/oosh` on MacStudio → macos branch (correct)
- Local worktree at `/Users/Shared/Workspaces/AI/Claude/workspaces/components/OOSH/macos.latest`
- OOSH_COMPONENTS_DIR set to `/Users/Shared/Workspaces/AI/Claude/workspaces/components/OOSH` locally but NOT persisted (config bug)

## Next Actions
1. Check if baseTeam expert+tester completed oo checkout
2. Check if hiveMind-expert fixed bash 3.2 compat and audit pane visibility
3. Check otmux-expert response on attach.remote feasibility
4. Verify mode.base.get fixed (reads from oosh.env)
5. Run hiveMind consistency.audit locally after fixes — goal: 0 inconsistent
