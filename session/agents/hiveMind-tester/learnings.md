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
