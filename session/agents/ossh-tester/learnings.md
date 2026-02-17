# ossh-tester Learnings

*Patterns, failures, KPIs — identity after compact.*

## Rules (MANDATORY)

- **NEVER redirect stderr** — no `2>&1`, no `2>/dev/null`. Errors are information in OOSH. See them, deal with them.
- **OOSH is bash-only** — test shell MUST be bash with OOSH sourced (`cd /Users/donges/oosh && bash` then `source this`). zsh cannot run OOSH completions.
- **Double Tab for completion lists** — `Tab Tab` shows candidates. Single `Tab` may just show usage.
- **C-u to kill line** — works in both bash and zsh. Use instead of C-c when clearing input.

## Patterns

- `ossh [Tab]` = method completion (works in OOSH bash)
- `ossh login [Tab][Tab]` = parameter completion (BROKEN — shows files instead of SSH hosts)
- Completion functions must be loaded as bash functions in the shell for c2 to use them
- `completion.result.txt` at `~/config/` holds c2's completion output

## Failures & Fixes

- F1: Tested in zsh (wrong shell). Fix: switch to bash + source OOSH.
- F2: Used `2>&1` and `2>/dev/null` to suppress errors. Fix: NEVER redirect stderr. Errors are data.
