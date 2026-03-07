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
- `source this && source hiveMind` hangs in Bash tool (non-interactive zsh shell).
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
- When expert commits locally, tester sees it immediately — just `source hiveMind` to reload
