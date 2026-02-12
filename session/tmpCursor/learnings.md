# OOSH Expert Learnings

## Patterns

- Context path is `session/agents/oosh-expert/context.md` (subdirectory), NOT the old flat file `session/agents/oosh-expert.context.md`
- Symlink at `.claude/agents/oosh-expert/context.md` points to the subdirectory version
- Use `git rev-parse --show-toplevel` for workspace root — OOSH_DIR-based relative paths hit symlink resolution issues
- `private.scrumMaster.parse.state()` sets METRIC_STATE as side effect — call directly, not in `$(...)` subshell
- OOSH is on PATH via ~/.bashrc — no `export PATH=...` prefix needed

## Failures & Fixes

- `$TMUX_CMD` undefined in hiveMind — only exists in otmux. Use plain `tmux` in hiveMind.
- `context.read` same-value bug — root cause: `context.jsonl()` returned global most-recent JSONL. Fix: added pane parameter for per-pane resolution.
- Dashboard workspace path resolved to `Claude.All` instead of `Claude` — HIVEMIND_AGENTS_DIR traversal hit symlinks. Fix: use `git rev-parse --show-toplevel` as primary.
