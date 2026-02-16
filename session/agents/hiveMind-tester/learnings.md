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

## Sandbox blocks compound commands
- Avoid `cmd1; echo EXIT:$?` patterns — sandbox may block the second command.
- Use simple direct commands: `hiveMind method args 2>&1`
