# Team Pull & Remote Offloading

**Created**: 2026-03-25
**Context**: UpDown.ai Docker container memory-overloaded, needed to offload agents to MacStudio.native

## What Was Built

### `hiveMind team.pull <sshConfigName>`
- SSHs into remote machine, runs `teams.save` to create snapshot
- Downloads: snapshot, roles.env, sessions.env, teams.env into `~/config/hivemind.pull.<host>/`
- Downloads ALL JSONL session files for each UUID in the snapshot (enables fork)
- Uses `ossh exec` and `ossh scp` for all remote operations (DRY — no raw ssh/scp)
- Tab completion via `private.ossh.config.complete.hosts`

### `hiveMind agent.restart <pullDir> <role>`
- Restarts ONE agent by role name from a pulled config directory
- Reads snapshot, finds matching role, creates session/pane, forks Claude session
- Session collision handling: prefix with host name if name already exists
- Tab completion for both pullDir and role

### `hiveMind team.restart <pullDir>`
- Restarts ALL agents from pulled config (bulk version)
- Same logic as agent.restart but iterates full snapshot

## Key Bugs Found and Fixed

### stdin consumption in while-read loops (2dcbfa9)
- **Root cause**: `while IFS='|' read ... done < file` with `ossh exec`/`ossh scp` inside the loop. These commands consume stdin, eating remaining lines of the snapshot file.
- **Symptom**: Only first JSONL downloaded, loop stops after 1 iteration
- **Fix**: All 6 snapshot loops now use fd 3: `read <&3 ... done 3< file`
- **Pattern**: Classic bash bug. ANY command inside `while read < file` that reads stdin will break the loop. Always use alternate file descriptors.

### teams.save DRY violation (fa722ac)
- **Root cause**: teams.save had inline UUID discovery (grep ps args + session.id + session.probe) instead of using `session.resolve.uuid`
- **Symptom**: 5 of 9 agents got stale parent UUIDs for forked/autocompacted sessions
- **Fix**: Single call to `private.hiveMind.session.resolve.uuid`

### Sender prefix on bash panes (e4a165c)
- **Root cause**: `otmux.send` prefixed ALL targets with `[@role pane]`, including bash shells
- **Symptom**: Shell commands prefixed with `[@oosh-tester projectTeam:0.3]` — bash interprets as command
- **Fix**: Guard prefix with `private.otmux.pane.isClaudeCode` — only Claude Code panes get prefix

## Commits (chronological)

| Commit | Description |
|--------|-------------|
| f8ac6f8 | Initial team.pull + agent.restart |
| 33d9f3d | 16 TDD tests |
| 3503ddf | Align implementation with test expectations |
| a0c22b1 | Sender prefix `[@role pane]` on otmux.send |
| e4a165c | Guard prefix with isClaudeCode |
| ceec723 | ossh.scp for JSONL transfer |
| d94e9cc | agent.restart = single-role, old behavior → team.restart |
| 2dcbfa9 | fd 3 fix on all 6 stdin-consuming loops |
| fa722ac | DRY teams.save UUID via session.resolve.uuid |

## Lessons

1. **Build the tool, then use the tool** — we built team.pull, then used it to migrate ourselves
2. **stdin consumption** is the most common bash loop bug — always use fd 3 for while-read loops with subcommands
3. **DRY violations surface as UUID mismatches** — every inline UUID discovery was wrong for forks/autocompact
4. **TDD works** — tester wrote failing tests first, expert fixed, all passed. The stdin bug test even reproduced the bug by exhibiting it
5. **Sender prefix needs target awareness** — not all panes are agents, guard with isClaudeCode
