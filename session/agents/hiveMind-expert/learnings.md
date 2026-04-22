# hiveMind-expert Learnings

## Script Structure (~2800 lines)
- **Location**: `/Users/donges/oosh/hiveMind`
- **Git repo**: `~/oosh` on branch `dev.claude` (remote: `Cerulean-Circle-GmbH/once.sh.git`)
- **Not in workspace git** — it's a separate repo. Commit and push from `cd /Users/donges/oosh`.

## Key Architecture Patterns
- **Registry**: File-based `target|role` at `~/config/hivemind.roles.env` — survives reboots, migrated from old `/tmp/hivemind.roles`
- **Session tracking**: `role|session-uuid` at `~/config/hivemind.sessions.env` — enables `hiveMind join <role>` to resume Claude sessions
- **Transport independence**: `agent.send` resolves best channel (pane → agentRoom API fallback) via `private.hiveMind.channel.resolve`
- **Sweep/detect engine**: `private.hiveMind.sweep.detect` returns `status|action|severity[|detail]` (18 states) — powers `team.sweep` display, `team.status` classification, and `unblock` automation
- **Team registry**: `~/config/hivemind.teams.env` (session|description) + `~/config/hivemind.active.team` — multi-team support with `team.switch`/`team.register`/`team.active`
- **Shared completion**: `private.hiveMind.teams.complete()` — single source for all session/team completions (registered + running, deduplicated)
- **Watchdog**: External bash process in tmux pane (no Claude Code = no permission prompts) with heartbeat file + supervisor auto-restart

## OOSH Architecture Standards (MANDATORY — PO-enforced, commit be1885a)

1. **camelCase for ALL variables and parameters** — NEVER underscore_case. `jsonlFile` not `jsonl_file`, `sessionId` not `session_id`, `paneTarget` not `pane_target`.
2. **Public method interfaces: positional args ONLY, NEVER --flags.** Sub-modes become separate methods (`teams.restore` with `mode` positional, not `--fork`). Method signature: `# <required> <?optional:default> # description`.
3. **Use OOSH wrappers where they exist**: `otmux` (tmux), `claudeCode` (claude), `check` (validation), `config` (persistence), `path` (PATH management). Call the wrapper, not the raw command.
4. **Raw system commands ONLY inside private helpers** when no OOSH wrapper exists. `stat`, `date`, `ps`, `find` are acceptable in `private.*` methods — never in public method bodies.
5. **Hardcoded thresholds go in config, not code.** Use `config set THRESHOLD 300` pattern. Read via `${THRESHOLD:-300}` with sensible default.

### Why this matters
Commit `102fa81` had raw `find`/`stat`/`date` in public `session.id`. Commit `1604e3e` had `--fork` flag in `teams.restore`. Both were OOSH violations caught by PO radical review. Refactored in `be1885a`.

## OOSH Conventions Observed
- Method signature comments: `# <required> <?optional:default> # description`
- Completion functions: `methodName.completion.paramName()` — echo one option per line
- Logging: `info.log`, `error.log`, `warn.log`, `success.log`, `console.log`
- Return values: exit codes, stdout for data
- Private helpers: `private.hiveMind.*` prefix
- Constructor: `hiveMind.start()` sources `this`, sets defaults, dispatches via `this.start "$@"`
- `warn.log` and `error.log` write to **stdout**, not stderr — never use them in data-returning functions

## Git Workflow
- The `~/oosh` repo has active changes from multiple agents — always expect unstaged changes in other files
- `git stash` before `git pull --rebase` — but stash pop may conflict on other agents' files
- Resolution: `git restore --staged <file> && git restore <file>` to drop stash conflicts, then push
- The remote may have removed methods we still have locally — resolve conflicts by keeping our additions

## Compound Command Permission Issue (2026-02-12)
- Claude Code triggers permission prompts for compound bash commands (`sleep 60 && hiveMind ...`)
- Fix: build sleep into the OOSH command as an optional parameter — single command = no prompt
- Pattern: `if [ -n "$interval" ] && [ "$interval" -gt 0 ] 2>/dev/null; then sleep "$interval"; fi`
- The `2>/dev/null` on the `-gt` test silently rejects non-numeric input

## replace_all Gotcha (2026-02-13)
- `Edit` tool `replace_all=true` replaces ALL matching occurrences — including the definition itself
- When creating a shared helper and then replacing all inline copies with a call to it, the helper body also matches
- Always verify the helper definition wasn't self-replaced after bulk edits

## Sweep.detect Severity Classification (2026-02-13)
- Format: `status|action|severity[|detail]` — backward-compatible, callers using `${result%%|*}` still work
- Severity levels: `critical` (crash, subscription-limit, shell-escaped), `blocker` (permission, rate-limit, accept-edits), `warning` (context-warning, just-compacted, mcp-error), `info` (active, idle)
- Capture window: 20 lines (was 10) — more context for better pattern matching
- `team.sweep` now delegates to `sweep.detect` instead of duplicating detection logic

## Cross-Script Work: scrumMaster (2026-02-16)
- **scrumMaster** lives in same repo (`~/oosh/scrumMaster`, ~1650 lines) — I can edit it too when tasks require it
- **Stale defaults pattern**: Many scrumMaster methods had hardcoded `cursorOrchestrator` session and `/tmp/hivemind.roles` registry paths. Fixed all to read `~/config/hivemind.active.team` and `~/config/hivemind.roles.env`
- **Active team read pattern** (for scripts that don't source hiveMind): `$(cat "$HOME/config/hivemind.active.team" 2>/dev/null || echo projectTeam)` — lightweight, no function call needed
- **measure.health**: Full PDCA cycle method — refreshes API, snapshots velocity, evaluates thresholds, alerts orchestrator via `hiveMind agent.send`. SM calls this one command every 30 minutes.
- **Task 40.4 was already done**: Before implementing, always check git log for existing commits. The oosh-expert had already implemented `measure.velocity` — saved time by verifying instead of reimplementing.

## Git Workflow Update (2026-02-16)
- **NEVER use `git pull --rebase`** — rebase destroys uncommitted work (Feb 12 incident). Use `git pull` only (merge).
- `pull.rebase=false` is set in repo config.

## Panes Are Views, Agents Are Processes (2026-03-02, Tron directive)
- **A pane is just a view.** An agent is a Claude process with a session UUID. The role is stored in the Claude session's `/rename`d customTitle.
- **Live facts are the source of truth**, not static files. `private.hiveMind.live.discover` reads: PID on pane TTY → session UUID from process args → customTitle from sessions-index.json → role from `role@model` format.
- **Registry file is a write-through cache**, not primary. All reads (`registry.get/find/list`) try live discovery first, file fallback second.
- **Verified**: `hiveMind team.status` works correctly even with the registry file removed. Proves live path is self-sufficient.
- `/rename role@model` is essential — it's how live discovery knows the role. `agent.bootstrap` now auto-renames.

## OOSH ERR Trap vs Subshell Suppression (2026-03-06)
- `$(some_func 2>/dev/null)` does NOT suppress OOSH ERR trap output. The trap fires on `return 1` BEFORE the subshell captures stderr.
- Fix: make the function return 0 with empty output instead of return 1. Or use `|| true` inside the function.
- Example: `find.agents.dir` returned 1 → EPERM printed to /dev/tty → changed to `return 0`.

## UUID Extraction Chain (2026-03-06)
- Priority for getting Claude session UUID: `ps --resume <uuid>` args → `claudeCode session.id` → `claudeCode session.probe` (last resort, touches the pane)
- Agents started with bare `claude` (no `--resume`) have no UUID in ps args — need `session.id` or `session.probe` fallback.
- `teams.save` uses all three. `process.list` uses first two + probe.

## Title-as-Role Fallback (2026-03-06)
- Pane titles often contain the role name with status indicators: `✳ oosh-expert@opus`
- Strip pattern: remove `✳ `, `⠐ `, `⠂ `, `✻ `, `✢ `, `✶ ` prefixes, then `@*` suffix, then spaces
- Used in `teams.save` and `consistency.audit` as fallback when live.discover and registry both miss

## Always Notify Tester (Tron directive 2026-03-06)
- After EVERY commit: `hiveMind send.enter hiveMind-tester "Done: <what>. Commit <hash>. Verify: <cmd>"`
- Use hiveMind by ROLE NAME — never otmux with pane addresses
- After sending: monitor tester to check not stuck on permission prompts
- Approve permission prompts by sending Enter via `hiveMind send hiveMind-tester Enter`

## BSD sed Compatibility (2026-03-08)
- macOS BSD sed does NOT support nested `{ }` in address ranges: `sed -n '/^---$/,/^---$/{ /^desc:/{ ... } }'` → "extra characters at end of } command"
- Fix: use pipeline instead: `sed -n '/^---$/,/^---$/p' file | grep '^description:' | head -1 | sed 's/...'`
- Always test sed on macOS, not just assume GNU sed syntax works

## Dynamic SKILL.md Lookup (2026-03-08)
- `get.role.prompt` was a 14-entry hardcoded case statement — every new role needed manual addition
- Replaced with dynamic lookup: check `$HIVEMIND_AGENTS_DIR/<role>/SKILL.md`, extract YAML frontmatter `description:` field
- Role aliases (orchestrator → agent-teacher) preserved via small case block before file lookup
- Contract unchanged: returns 0 with prompt text if found, returns 1 if no SKILL.md exists

## DRY Refactor Helpers (2026-03-08)
- `private.hiveMind.current.session` — wraps `tmux display-message -p '#{session_name}'`
- `private.hiveMind.pane.count <target> <?-s>` — `tmux list-panes | wc -l`
- `private.hiveMind.list.panes <format> <?scope>` — presets: tty, tty+title, addr+cmd, addr. Raw format passthrough via `*)`
- `private.hiveMind.ensure.pane <sess:win.pane>` — creates session/window/pane if missing. `tmux new-window -t sess:N` creates at exact index N (verified)
- `private.hiveMind.claude.processes` — builds TTY→pane map + filters ps for Claude processes. Output: `pid|tty|paneTarget|title|args`

## Send Consolidation (2026-03-08)
- `send.enter` now delegates to `send.message` (safe send: pre-check blockers, C-u clear, verified delivery)
- Long messages via tmux garble — always keep messages short or use task files

## Commit Message Rule (Tron directive 2026-03-08)
- ONE LINE commit messages only. No multi-line descriptions.

## Variable Naming (Tron directive 2026-03-08)
- camelCase for local variables, NEVER underscores. `fmtStr` not `fmt_str`, `paneTarget` not `pane_target`

## NEVER git stash (Tron directive 2026-03-08)
- **`git stash` is ALWAYS wrong.** It captures ALL modified files indiscriminately. `stash pop` restores them all, overwriting other agents' changes.
- **What happened**: stash included tester's test file changes, stash pop overwrote tester's T-DRY-11 through T-DRY-27 tests.
- **Instead**: commit WIP work (`git commit -m "WIP: ..."`), or discard and redo. Commits are explicit. Stashes are not.
- **`test/test.hiveMind` is the tester's file. NEVER edit it.** Expert owns `hiveMind`, tester owns `test/test.hiveMind`.
- **Always `git pull` before committing.**

## Self-Awareness Commands (2026-03-09, Tron directive)
- **Run on every boot** to discover your identity:
  - `otmux pane.get.target` → your pane address (e.g. `hiveMindTeam02_03_26:0.0`)
  - `claudeCode session.id <your-pane>` → your Claude session UUID (e.g. `75ce660f-...`)
- Both change on restart/compact — must re-discover every time
- `pane.get.target` uses `TMUX_PANE` env var to query the executing pane, not the focused one (Tron bugfix)

## Consistency Fix Architecture (2026-03-17)
- **sessions.env schema limitation**: `role|UUID` can't handle same role in multiple panes. Last-write-wins causes UUID stale on audit.
- **Shared --resume sessions**: Same Claude session resumed in two panes → same UUID from ps args → dup UUID in audit. Can't be fixed without forking or schema change.
- **Fork detection**: `--fork-session` in ps args means the `--resume UUID` is the parent, not current. Skip it, fall through to registry lookup.
- **Generic role handling**: "ClaudeCode" is not a role — it's the default pane title. Reject in title→role extraction, try live.discover instead.
- **DRY private helpers**: Extract repeated patterns into `private.hiveMind.role.isGeneric`, `role.fromTitle`, `env.set`, `env.del`, `liveUuid`.
- **Dup purge loop pitfall**: When A purges B's UUID and then B purges A's UUID, nothing changes. Fix: only purge entries for roles that have NO live Claude process.
- **Audit must enumerate ALL panes** (via `list.panes`), not just Claude processes (via `claude.processes`). Non-agent panes show as "no agent" gray.

## Shell Environment (2026-03-17)
- Do NOT prefix every bash command with `source ~/config/user.env`. OOSH is already on PATH.
- Do NOT redirect stderr with `2>/dev/null` on OOSH commands — let logging show.
- PATH needs `/opt/homebrew/bin` first for bash 5 (associative arrays `local -A`). This is in user.env but the Claude Code shell may need it set once per session.

## c2 Completion System (2026-03-25)
- Completion functions are called as: `$class.$method.completion.$param "$cur" "$class" "$method"`
- `$1` is ALWAYS the current typing word (`$cur`), NOT the value of a previous positional parameter
- To access previous parameter values, must use COMP_WORDS (not available in c2 scope) or scan filesystem
- Solution for dependent completions: scan all known directories rather than expecting the previous arg

## ossh.scp (2026-03-25)
- Created `ossh.scp()` — public method wrapping `scp -o ControlPath="$OSSH_CONTROL_PATH"`
- Replaces all raw scp in hiveMind (6 calls: task.transfer, teams.push, team.pull x4, agent.restart.remote)
- ossh already had `private.ossh.rsync()`, `private.ossh.rsync.pull()`, `private.ossh.ssh()` — all private

## JSONL Path Normalization (2026-03-25)
- `team.pull` downloads JSOLs from remote. Remote path may differ from local (different $HOME, different user)
- Must normalize: find first local project dir under `$HOME/.claude/projects/` and download there
- Previous bug: downloaded to remote's absolute path which doesn't exist locally

## hiveMind send.enter Dispatch Bug (2026-03-25)
- `hiveMind send.enter hiveMind-tester "msg"` fails with "send.enter: No such file or directory"
- Workaround: use `otmux send <pane> "msg" Enter` directly
- Root cause: method dispatch in `this` can't find `send.enter` — needs investigation

## Registry Garbage Root Causes (2026-03-02)
- **Boot prompt text as role names**: `registry.refresh` would extract firstPrompt text as role when session wasn't `/rename`d. Fixed with validation (reject >30 chars, spaces, prompt-like words).
- **Raw %NNN pane IDs**: Written when `$TMUX_PANE` was used instead of `session:window.pane` format. Fixed with format validation in `registry.set`.
- **Phantom entries**: Dead panes stay in file forever. Fixed with prune step in `registry.refresh`.
