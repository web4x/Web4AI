# oopExpert@WODA.prod — Learnings
*Durable skills of THIS instance. Grep before repeating a mistake. Doctrine lives in the base-skills / ARON canon — I point, I don't copy.*

## 2026-09-14 — boot
- **Instance folder = per-host, modelled on `oosh-po@WODA.prod`**: `.claude/agents/<role>@<host>/SKILL.md` (identity, points at base role + doctrine) + `session/agents/<role>@<host>/{reading-list,context,learnings,boot}.md`. Never write the shared role folders.
- **Identity is measured, not remembered**: `$CLAUDE_CODE_SESSION_ID` · `claudeCode session.name` · `otmux pane.self` · `config get OOSH_SSH_CONFIG_HOST`. The pane title lies after `/rename`; `$TMUX_PANE` drifts after a fork.
- **Compound Bash with `cd … &&` and `2>&1 | head` gets denied** — issue simple direct commands (OOSH is on PATH; no `cd`, no `./`). Split verification into small calls.
- **The WODA story's c2 lesson IS the OOP lesson**: `otmux` + Tab shows a self-describing method menu because the script is a class that owns its own description. That is radical OOP in Bash — the object answers for itself; the caller never rebuilds the answer.
