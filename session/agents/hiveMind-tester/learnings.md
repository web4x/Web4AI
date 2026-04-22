# hiveMind tester Learnings

## Relative path bugs (`./script` vs `script`)
- OOSH scripts are on PATH. Never use `./scriptName` — use `scriptName` directly.
- Found 28x `./otmux` and 3x `./claudeCode` — all broken from non-oosh CWD.
- `$OOSH_DIR/scriptName` is also valid (absolute path).

## HIVEMIND_AGENTS_DIR resolution
- `~/oosh` is a symlink into `Claude.All` workspace, but agents live in `Claude` workspace (sibling).
- `../../../` from OOSH_DIR traverses the symlink target, not the symlink source — lands in wrong workspace.
- Fix: search upward from multiple starting points (CWD, resolved OOSH_DIR).

## active.team fallback chain
- `hivemind.active.team` file > `hivemind.teams.env` > roles registry > hardcoded `cursorOrchestrator`
- Neither `active.team` nor `teams.env` files exist — roles registry is the only working fallback.

## Testing in non-TTY environment
- `error.log` writes to `/dev/tty` which fails in Bash tool → errors silently swallowed.
- Always test with `2>&1` to catch stderr, and check exit codes explicitly.

## replace_all space trap (CRITICAL)
- `Edit replace_all` replacing `"$VAR/cmd" ` with `cmd` eats the trailing space → `cmdsend` instead of `cmd send`.
- Then fixing `cmdsend ` with `cmd send` eats the NEXT space → `cmd send"$arg"` missing space.
- **Always verify with grep after replace_all.** Pattern: `cmd[a-z]` to catch joined words, `cmd [a-z.]+\"` to catch missing arg space.
- Happened TWICE in this project (./otmux and $OOSH_DIR/otmux).

## Parallel agents overwrite fixes
- Another agent committing the same file can reintroduce bugs we already fixed.
- After every commit by a parallel agent, re-grep for the patterns we fixed.
- Happened with `claudeCode` space fixes — fixed them, another agent committed on top, joined patterns came back.

## auto.commit security (CRITICAL)
- `git add -A` adds ALL files including untracked secrets (private keys, credentials).
- Fixed to `git add -u` (tracked files only) + targeted `git add session/`.
- The old code committed `experiment/.ssh/private_key/` to the repo and pushed it.

## Long-running commands in non-TTY
- `monitor.cycle` and `cycle.full` take 2-3 minutes (claudeCode calls per pane).
- `auto.commit` can hang if git push stalls in background.
- Use `timeout` parameter on Bash tool for these, and run in background if needed.

## Sandbox blocks compound commands
- Avoid `cmd1; echo EXIT:$?` patterns — sandbox may block the second command.
- Use simple direct commands: `hiveMind method args 2>&1`

## Running test.suite from Bash tool
- NEVER `source` OOSH scripts directly. They are executables on PATH, not libraries.
- `source this && source hiveMind` is WRONG — pollutes the shell. It also hangs in Bash tool.
- Use `test.suite run hiveMind 1` instead — it handles the OOSH environment properly.
- `bash test/test.hiveMind` also hangs. Only `test.suite run` works.
- **Run tests from ooshDebug:0.1** (non-Claude pane) to avoid self-disruption.

## macOS sed vs GNU sed
- `head -n -1` doesn't work on macOS. Use `awk` + line numbers instead.
- `sed -n '/start/,/end/{ /pattern/{ ... } }'` compound commands fail on BSD sed.
- Use `grep | head -1 | sed` pipeline as alternative.

## otmux tree.detailed UUID format
- tree.detailed shows TRUNCATED 8-char UUIDs in brackets: `[75ce660f]`
- NOT full 36-char UUIDs. Compare first 8 chars of session.id against tree.detailed.
- UUIDs appear on SUB-LINES below the pane line: `│     └ role-name  [8hexchars]`

## AGENTS_BASE path for T-CONSIST-3
- `WORKSPACE_ROOT` resolves via symlink target → wrong .claude/agents/ path.
- Use `HIVEMIND_AGENTS_DIR` as primary path (set by hiveMind source).
- Fallback: `${CLAUDE_PROJECT_DIR}/.claude/agents`

## Approving expert permissions
- When monitoring expert pane, watch for permission prompts and `/status` autocomplete.
- Send `Enter` to approve (option 1), `Escape` to dismiss autocomplete.
- Expert's `registry.refresh` gets interrupted by autocomplete — known issue.

## Git commit message style (Tron directive)
- ONE LINE commit messages. Short and descriptive.
- Write details in a task file (e.g. `session/tasks/<file>.md`) and reference it in the commit.
- Example: `git commit -m "test: enhance T-ALIGN-8 — see session/tasks/tester-tree-detailed-bugs.md"`
- Never use multi-paragraph HEREDOC commit messages.

## EPERM errors in test output = NOT acceptable
- OOSH error handler catches `exit 1` from `ps` / `claudeCode` and prints loud EPERM lines.
- Even if the test logic handles the error silently, the ERROR output is confusing and pollutes results.
- Tests must use `|| true` on expected failures to prevent ERR trap from firing.

## Tests must NOT be machine-specific
- Tests that depend on current tmux session layout only work on ONE computer.
- Live behavioral tests that send `/status` to Claude panes disrupt running agents.
- Proper approach: fixture-based tests that create/teardown their own sessions via hiveMind.
- Use `__test_hm_$$` (PID-namespaced) session names for isolation.

## Monitoring is NOT my job
- Tester tests CODE. Monitoring agents is ScrumMaster's job.
- Don't use `sleep` loops to poll expert panes. Test the commits after they land.

## Three categories of identity mismatches (Tron directive 2026-03-03)
1. **DETECT**: Tests that find mismatches (T-CONSIST, T-LIVE cross-checks)
2. **FIX SYSTEMICALLY**: hiveMind methods that prevent/correct drift automatically (registry.refresh, live.discover)
3. **FIX MANUALLY**: Use hiveMind commands to correct current state. If no command exists = missing/buggy method.
- Applying category 3 revealed BUG-E (teach rejects valid roles), BUG-F (no public registry.set/remove).
- Always try to fix manually FIRST — it's the fastest way to discover missing methods.

## Gate live-probing tests behind RUN_LIVE_TESTS=1 (CRITICAL)
- Tests that call `process.find`, `live.discover`, `registry.refresh`, or `process.list` across ALL panes MUST be gated.
- `registry.refresh` sends `/status` to every Claude pane via `session.probe` — disrupts agents.
- `process.list` iterates all Claude PIDs calling `live.discover` per PID — slow but non-disruptive (reads files).
- Default test run: fixture-based + function-existence + error-handling tests only.
- Live tests: `RUN_LIVE_TESTS=1 test.suite run hiveMind 1` — only when explicitly requested.
- Learned this the hard way: T-ALIGN sent /status to my own pane, T-LIFECYCLE-4 via registry.refresh probed all sessions.

## test.case eats return codes
- `test.case $level "desc" command args` runs the command but `$?` after is test.case's exit code (0), not the command's.
- To test return codes: run the command FIRST, capture `$?`, THEN report with test.case.
- Example: `hiveMind.method 2>/dev/null; RC=$?; test.case $level "desc" echo "rc=$RC"; if [ "$RC" -ne 0 ]; then expect.pass ...`

## tmux send garbles long commands
- Commands longer than ~80 chars get garbled when sent via `otmux send` to ooshDebug.
- `cd /Users/donges/oosh && test.suite...` became `d /Users/donges/oosh && test.suite...` (lost the 'c').
- Keep commands short. If already in the right directory, skip the `cd`.

## Bugs found in hiveMind (report to expert)
- **BUG-D**: registry.refresh line 1668 uses `-a` (all sessions) instead of `-s` — FIXED in de85de2
- **BUG-E**: get.role.prompt (line 58) hardcoded case with ~15 roles, role.list finds 80+. `teach` fails for unlisted roles.
- **BUG-F**: No public registry.set/remove methods — FIXED in 016b3d0
- **BUG-G**: Registry mismatch at hiveMindTeam02_03_26:0.1 — FIXED by consistency.fix
- **BUG-H**: active.team stale (shows projectTeam not hiveMindTeam02_03_26) — team.activate added in 016b3d0
- **BUG-I**: hiveMindTeam02_03_26 not in teams.env — FIXED
- **BUG-J**: No team.activate command — FIXED in 016b3d0
- **BUG-K**: otmux.tree calls claudeCode per pane (slow) — NOT FIXED
- **BUG-L**: find.agents.dir EPERM on every hiveMind command from ooshDebug — FIXED in 8f4210f

## New methods implemented by expert (2026-03-06/07)
- `hiveMind teams.save` — snapshot all Claude processes with UUIDs
- `hiveMind teams.restore` — recreate from snapshot (not yet tested)
- `hiveMind consistency.audit` — cross-compare all identity sources in one table
- `hiveMind consistency.fix` — auto-repair from live truth (has sed delimiter bug)
- `hiveMind registry.set <pane> <role>` — public wrapper
- `hiveMind registry.remove <pane>` — public wrapper
- `hiveMind team.activate <session>` — set active team

## consistency.fix sed delimiter bug
- Uses `|` as sed delimiter in sessions.env update
- Role names like `product-owner` contain `-` which is fine, but the pipe-separated format of sessions.env (role|uuid) conflicts with sed `|` delimiter
- Result: `sed: bad flag in substitute command` for oosh-tester, scrum-master, product-owner
- Fix: change sed delimiter to `#`

## Monitoring expert agents
- Check expert's context % before sending work. Don't force work on an agent at 8% context.
- Approve permissions promptly when monitoring — Enter for yes, watch for commit/push prompts.
- Expert at 8% should compact before taking new tasks.

## OOSH ERR trap vs 2>/dev/null
- `2>/dev/null` on a function call suppresses stderr from the subshell
- But OOSH ERR trap catches `return 1` INSIDE the function and prints ERROR to /dev/tty BEFORE the caller's redirect
- Fix: function must `return 0` with empty output instead of `return 1`
- Applied to find.agents.dir in commit 8f4210f

## Same filesystem = no git pull needed
- Expert and tester share the same oosh repo on the same machine
- `git pull` is only needed if changes were pushed to remote but not committed locally
- When expert commits locally, tester sees it immediately — OOSH scripts are executables on PATH, no reload needed. Just call `hiveMind <method>` directly.

## Session UUID preservation is paramount (CRITICAL)
- Session UUIDs ARE the agent's identity. NEVER start `claudeCode new` when a UUID exists — it destroys all context and experience.
- Sessions don't "exhaust" permanently — context resets with /compact or new API blocks.
- If 0% after /compact: wait for new API block, don't start fresh.
- Exception: if BOTH /compact AND /clear fail AND a fresh prompt queues without processing, the session IS stuck. Only then is a new session justified.
- `claudeCode join <role-name>` resolves via sessions.env — use this, not raw `claude --resume <uuid>`.
- Always use `claudeCode` wrapper (sets FORCE_COLOR, unsets CLAUDECODE nesting guard, uses $CLAUDE_CMD path).

## NEVER source OOSH scripts (CRITICAL)
- `source hiveMind` pollutes the shell with thousands of functions — DESTROYS the bash environment.
- OOSH scripts are executables on PATH. Call them directly: `hiveMind consistency.audit`
- The ONLY things you may `source` are env config files (e.g., `source ~/config/user.env`).
- If you accidentally source a script: `exit` the shell and restart `bash` to get a clean environment.

## NEVER append 2>&1 to OOSH commands
- `2>&1` on OOSH commands causes permission prompts in Claude Code Bash tool.
- OOSH has its own error handling (ERR trap). Let it work.
- Just run: `hiveMind consistency.audit` — no redirects needed.

## Cross-computer restore findings (2026-03-07)
- `ossh push.dir <host> ~/config` transfers all hivemind config files (roles, sessions, snapshots)
- Remote machine needs: tmux on PATH, claude installed, OOSH on PATH, git pulled to latest
- MacStudio: tmux at /opt/homebrew/bin — NOT in bash PATH (needs bashrc fix)
- teams.restore fails silently if tmux server isn't running — "no server running" per pane
- Fix: must start tmux server first (`tmux new-session -d -s init` or similar)
- After restore: detached sessions exist but agents need boot.md sent

## Raw commands prohibition (CRITICAL — Tron directive)
- NEVER use raw `claude`, `tmux`, `ssh` commands. Always use claudeCode, otmux, ossh wrappers.
- claudeCode sets FORCE_COLOR=2, unsets COLORTERM, unsets CLAUDECODE — raw `claude` doesn't.
- otmux adds error handling, pane title management — raw `tmux` doesn't.
- ossh manages SSH configs, identity files — raw `ssh` doesn't.
- teams.restore line 1462 used raw `claude` — BUG-P. Fixed in e351282.
- This applies to ALL OOSH scripts: hiveMind, otmux, claudeCode, etc. NEVER `source` them.
- `test.suite run hiveMind 1` handles the test environment internally — that's the only correct way to run tests.

## tmux display-message fuzzy-matches pane targets (CRITICAL)
- `tmux display-message -t session:0.3 -p "#{pane_id}"` returns SUCCESS even when pane 3 doesn't exist.
- tmux 3.6a resolves `.3` as a fuzzy target and falls back to pane 0. Returns `%0` with exit code 0.
- **Never use `display-message` to check if a specific pane index exists.**
- Correct approach: `tmux list-panes -t session:window | wc -l` to count actual panes.
- This caused the entire pane creation loop in teams.restore to be skipped — split-window never ran.
- Fixed in c50d2f9.

## Session UUID discovery from JSONL files (2026-03-09)
- When agents die (Claude crashes, bash prompt), their session UUIDs aren't in the registry or sessions.env
- Search JSONL files: `head -c 20000 ~/.claude/projects/<project>/*.jsonl | grep -oE 'backup-(expert|tester)'`
- Match by role identity string in the first 20KB of each JSONL (SKILL.md gets loaded early)
- Filter by modification date and file size to find the most recent active session
- Found backup-expert `124ac722` and backup-tester `d45f08a4` this way

## otmux pane.get with target — backward compatible (2026-03-09)
- Extended `otmux pane.get` to accept 2 args: target + format
- 0 args = pane_id (%), 1 arg = format string, 2 args = target + format
- This replaces all `tmux display-message -t "$pane" -p "#{format}"` calls
- The `target_args=()` array pattern handles optional -t cleanly

## T-OTMUX-9 regex must exclude otmux (2026-03-09)
- `[^_]tmux .*attach` matches `otmux attach` because `o` matches `[^_]`
- Use `[^o]tmux` to exclude otmux, plus `^tmux` for line-start
- Also use `attach-session` not `attach` to avoid false positives on echo strings

## otmux panes passthrough replaces tmux list-panes (2026-03-09)
- `otmux panes` passes all args through to `$TMUX_CMD list-panes`
- `-t`, `-s`, `-a`, `-F` all work as passthrough
- Be careful with `-s` flag: original code without `-s` lists one window, with `-s` lists all windows in session
- Match the original behavior exactly — don't add `-s` where it wasn't before

## NEVER drop files from reading list (CRITICAL — Tron directive 2026-03-10)
- Reading list items are PERMANENT. Never remove entries, only add.
- oosh-architecture.md was missing from reading list — caused me to misuse ossh and otmux.
- Forgetting the OOSH calling convention (`scriptname method arg1`) led to wrong invocations.

## ossh calling convention (2026-03-10)
- `ossh login MacStudio.native` — correct (calls `ossh.login("MacStudio.native")`)
- `ossh MacStudio.native` — WRONG (tries to call `ossh.MacStudio.native()` which doesn't exist)
- `ossh exec <host> <command>` — execute command remotely
- `ossh config.list` — show all SSH configs
- SSH config hosts: MacStudio.native (user donges, port 22), MacStudio (root, port 8022)

## Self-awareness commands (CRITICAL — run on every boot)
- `otmux pane.get.target` — returns your pane address (e.g. `hiveMindTeam02_03_26:0.1`)
- `claudeCode session.id <pane>` — returns your session UUID (e.g. `004e5ea9-...`)
- `claudeCode context.read <pane>` — returns context % remaining (e.g. `12.7`)
- All three change on restart/compact — must re-discover on every boot
- Run BEFORE doing any other work — you can't communicate or verify identity without knowing these
- Current values: pane=`hiveMindTeam02_03_26:0.1`, UUID=`004e5ea9-6ed5-4c20-bc9e-7db38677b14b`

## Context self-monitoring gaps (2026-03-09)
- `context.read.tui` returns "unknown" during active Bash tool execution — pane shows command output, not TUI status bar
- `context.read` (JSONL-based) works during execution but can be STALE — showed 12.7% when actual was 37% free
- `/context` (Claude Code built-in) is the ground truth — shows exact token counts (e.g. 127k/200k = 63% used)
- `claudeCode context.self` added (commit ea66ccc) — auto-detects pane via TMUX_PANE, but uses JSONL (may be inaccurate)
- `team.context.status` fixed (commit 4ec2dbe) — now shows correct roles, detects SELF pane
- Check context between major tasks. At <20% prepare for compact, <10% compact immediately.
- **JSONL vs /context discrepancy**: JSONL token analysis can differ significantly from actual context usage. Trust /context for self, JSONL for monitoring others.

## consistency.fix title bug (2026-03-09)
- `consistency.fix` updated registry and sessions.env but NEVER renamed pane titles
- Audit showed `title≠reg` but fix didn't address it — pane titles stayed as "Claude Code"
- Root cause: no step to set pane title after fixing registry
- Fix: added step 3c using `otmux pane.lock` (not `pane.title` — Claude Code overwrites unlocked titles)
- `pane.lock` race bug: old hook fires on new `select-pane -T`, reverting to old title. Fix: remove old hook first.
- `otmux pane.get.target` bug: used `display-message -p` without `-t`, returned active pane not executing pane. Fix: `-t "$TMUX_PANE"`.

## teams.migrate verified end-to-end (2026-03-08)
- `hiveMind teams.migrate MacStudio.native` — single command, works.
- Steps: snapshot → push config → git pull → prereqs → restore → verify.
- Teardown + re-restore cycle tested: `tmux kill-server` → `teams.restore` — clean.
- 7 sessions, 13 agents, 21 panes created without errors.
- teams.restore auto-starts tmux server if none running (BUG-Z1 fix).
- teams.migrate exports `/opt/homebrew/bin` to PATH for Apple Silicon macs.

## opus[1m] model blocks ALL API calls (CRITICAL — 2026-03-10)
- MacStudio had `"model": "opus[1m]"` in `~/.claude/settings.json`
- This caused "Rate limit reached" on EVERY API call — fresh sessions AND forks
- The error is misleading — it's NOT a rate limit, it's model access denied
- Fix: change to `"model": "opus"` (200k context) — works immediately
- Even a brand new `claudeCode new` failed with opus[1m] — confirmed it's the model, not content
- Expert added model check to teams.migrate (commit 1604e3e)

## Cross-machine fork recipe PROVEN (2026-03-10)
- `scp <UUID>.jsonl MacStudio.native:<same-path>` — transfer session file
- `cd /Users/Shared/Workspaces/AI/Claude` — MUST be in project dir
- `claudeCode fork <UUID>` — creates new session ID, preserves full conversation
- Verified with live `date` command: `Tue Mar 10 14:25:04 CET 2026` — real API execution
- `/status` shows correct identity (product-owner), correct account
- `--fork-session` flag = new UUID, avoids same-session-ID conflicts across machines

## teams.restore fork bugs (2026-03-10)
- **BUG-JSONL**: JSONL transfer in teams.migrate only copies 1 of 12 unique files
  - Workaround: manually scp all unique UUIDs from snapshot
  - Root cause: likely ossh exec mkdir fails or scp path issue in the loop
- **BUG-FORK-SILENT**: Most claudeCode fork commands fail silently in restored panes
  - 15 agents forked, only 3 show [2.1.72] (Claude running)
  - 12 panes show [zsh] with blank content — fork didn't start
  - Possible causes: cwd wrong, effort dialog blocking, trust dialog, command garbled by send
  - Manual fork from correct dir works fine — the automation is broken
- Both reported to expert for fix

## Verify API with unique prompt (CRITICAL — 2026-03-10)
- Conversation replay looks like a fresh API response — easy to confuse
- ALWAYS verify with a prompt that can only be answered NOW (e.g., "run date command")
- "who are you" responses may be from replayed conversation history, NOT a new API call
- User caught me reading old replayed response as verification — embarrassing

## Use hiveMind commands, not raw otmux (irony noted 2026-03-10)
- User pointed out: "I see you as the hiveMind tester do not use it but mainly otmux"
- Should use `hiveMind send`, `hiveMind monitor` instead of `otmux send`, `otmux pane.capture`
- I'm literally testing hiveMind — I should be my own best customer

## `source` inside test files vs at prompts (CRITICAL — 2026-03-11)
- **Inside test/test.hiveMind**: `source hiveMind` is CORRECT — the test file is an OOSH executable that sources dependencies internally
- **At a Bash tool prompt**: `source hiveMind` is WRONG — pollutes shell, hangs (scriptname.start runs at end)
- **Running tests**: `test.suite run hiveMind 3` — the ONLY way. Runs test file as subprocess.
- The test file's bootstrap: `source this; source test.suite; source hiveMind` — all inside the file
- Rule: NEVER `source` in Bash tool. ALWAYS run as commands. Test files handle their own sourcing.
- User corrected me 3 TIMES on this. Read OOSH docs on EVERY boot.

## Ghost panes — titled but dead (2026-03-11)
- Ghost pane = tmux pane with an agent title (e.g. "orchestrator") but no running Claude process
- `hiveMind team.status` correctly shows `(offline)` for ghost panes — this WORKS
- `otmux tree.detailed` differentiates: live agents show `[2.1.72]` (version), ghosts show `[zsh]`/`[bash]`
- PO concern: at a glance, titled ghost panes look like real agents in basic tree output
- projectTeam has 7 ghost panes — all titled, all empty, all (offline)
- T-GHOST-1..6 tests written to verify ghost detection works

## bash 3.x `local -A` incompatibility (2026-03-11)
- MacStudio runs stock macOS bash 3.2 — does NOT support `local -A` (associative arrays)
- `private.hiveMind.claude.processes()` at line 104 uses `local -A ttyMap titleMap` — crashes on bash 3
- `consistency.audit` at line 1739 also uses `local -A` — same crash
- Error: `local: -A: invalid option` then `/dev/ttys007: syntax error: operand expected`
- Result: `0 consistent, 0 inconsistent` — audit returns nothing
- This is a cross-platform bug — needs `declare -A` or a non-associative-array approach
- Observed in pane 0.2 (expert shell on MacStudio)

## OOSH docs reading list — MANDATORY on every boot (2026-03-11)
- User corrected me 3 times for forgetting OOSH fundamentals after compact
- MUST read ALL docs before doing any work, not just SKILL.md
- Key docs: oosh-architecture.md (calling convention), hivemind.md, oosh.md
- Also: log.md, debug.md, config.md, state.md, oo.md — the full set
- The reading list in SKILL.md should include ALL docs, not just architecture

## OOSH Architecture Standards (CRITICAL — PO directive 2026-03-11)
These are the rules. Violations = FAIL in tests. Violations in code = bug report to expert.

### Calling Convention
- **Positional args ONLY, never --flags.** `scriptname method arg1 arg2` not `scriptname method --flag`
- Sub-modes = separate methods: `hiveMind teams.migrate.fork` not `hiveMind teams.migrate --fork`
- Methods: `scriptname.methodname()` with camelCase + dots
- Private: `private.scriptname.helperName()`
- Entry point: `scriptname.start() { source this; this.start "$@"; }` then `scriptname.start "$@"`

### Naming Rules (MANDATORY)
- Method names: `script.method` or `script.noun.verb` (dot-separated, camelCase)
- Parameters: `<camelCase>` — NO dashes, NO underscores (dashes crash bash, underscores banned)
- Completion functions: `script.method.completion.paramName()` — must match param name exactly
- Local variables: `camelCase` — no underscores
- Environment variables: `UPPER_SNAKE_CASE` (only exception to camelCase)
- Script files: lowercase or camelCase (`hiveMind`, `claudeCode`, `otmux`)

### Method Structure (MANDATORY for every public method)
1. Signature with doc comment: `script.method() # <required> <?optional:default> # description`
2. Completion function per completable parameter
3. Object.verb naming pattern (`config.set`, `hiveMind.team.status`)

### OOSH Wrappers Over Raw Commands
- File checks: `check file.exists <path>` — not raw `find`/`stat`/`test -f`
- Config values: `config set THRESHOLD 300` — never hardcode numbers
- Error output: `error.log "message"` — human-readable sentences, never stack traces
- Logging: `console.log`, `info.log`, `debug.log` at appropriate levels
- tmux: `otmux` wrappers — never raw `tmux`
- Claude: `claudeCode` wrappers — never raw `claude`
- SSH: `ossh` wrappers — never raw `ssh`/`scp`

### Result Communication
- Functions return via `RETURN_VALUE` (numeric) and `RESULT` (string)
- `create.result 0 "success message"` then `return $(result)`

### Test Pattern
- `source test.suite $*` inside test file (test file sources deps internally)
- `test.case $level "description" command args`
- `expect 0 "expected" "description"` or `expect.pass/fail "message"`
- NEVER source OOSH scripts in Bash tool — only test.suite runs them as subprocess
- Fixture sessions: `__test_name_$$` with teardown

### What to Flag in Tests
- `--flag` patterns in OOSH method interfaces = FAIL
- Raw `find`/`stat`/`head`/`date` in OOSH scripts = FAIL
- C-style `is_ghost=0/1` instead of OOSH variable patterns = FAIL
- Hardcoded thresholds instead of config values = FAIL
- Missing doc comments on public methods = FAIL
- Missing completion functions for public params = FAIL

### session.id returns --resume arg, NOT actual session ID (CRITICAL — 2026-03-11)
- After `claudeCode fork <uuid> --fork-session`, the process shows `--resume <source-uuid>` in ps
- `claudeCode session.id` reads the `--resume` arg from ps → returns the SOURCE uuid
- The ACTUAL new session UUID is different — only visible via agent's `/status`
- `otmux tree.detailed` also shows the source UUID (from ps args)
- Confirmed during claudeCodeTeam creation: both otmuxTeam and claudeCodeTeam show same UUIDs
- This is Issue 1 from PO bug report — session.id is architecturally broken for forked sessions
