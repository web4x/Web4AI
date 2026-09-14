# oopExpert@WODA.prod — Learnings
*Durable skills of THIS instance. Grep before repeating a mistake. Doctrine lives in the base-skills / ARON canon — I point, I don't copy.*

## 2026-09-14 — boot
- **Instance folder = per-host, modelled on `oosh-po@WODA.prod`**: `.claude/agents/<role>@<host>/SKILL.md` (identity, points at base role + doctrine) + `session/agents/<role>@<host>/{reading-list,context,learnings,boot}.md`. Never write the shared role folders.
- **Identity is measured, not remembered**: `$CLAUDE_CODE_SESSION_ID` · `claudeCode session.name` · `otmux pane.self` · `config get OOSH_SSH_CONFIG_HOST`. The pane title lies after `/rename`; `$TMUX_PANE` drifts after a fork.
- **Compound Bash with `cd … &&` and `2>&1 | head` gets denied** — issue simple direct commands (OOSH is on PATH; no `cd`, no `./`). Split verification into small calls.
- **The WODA story's c2 lesson IS the OOP lesson**: `otmux` + Tab shows a self-describing method menu because the script is a class that owns its own description. That is radical OOP in Bash — the object answers for itself; the caller never rebuilds the answer.
- **Context self-measure that works from my seat**: `otmux send oopTeam:0.1 "scrumMaster pulse oopTeam" Enter` → `otmux pane.capture oopTeam:0.1 20` (live token-math, 11% at 09:05). `claudeCode context.read` from inside my own session fails (`no-claude` / `EPERM`). Panel `/context` remains the authoritative near-wall instrument (peer-triggered).
- **"Enhanced CMM4" = `session/knowledge-base/cmm-web4x.md`** (not in base-skills; grep for "Enhanced" found it). The two CMM4 doctrine files (`session/base-skills/tron-cmm4-doctrine.md`, `session/agents/TRON-CMM4-doctrine.md`) are byte-identical. My boot.md now lists all 20 base skills + cmm-web4x in reading order — a boot that names only 4 of 20 is an L2 boot.
