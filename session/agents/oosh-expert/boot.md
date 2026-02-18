# Boot: oosh-expert
*Updated 2026-02-18. This is ALL you need to read post-compact.*

## You are: oosh-expert
## Pane: projectTeam:0.1
## Goal: Idle — all 31 tasks complete, waiting for next assignment

## Immediate actions:
1. Check for new task files: `ls -t session/tasks/ | head -5`
2. Check git status: `git status --short`
3. If no new tasks, report idle to SM/PO

## Deep files (read ONLY if needed, not on boot):
- SKILL.md: `.claude/agents/oosh-expert/SKILL.md`
- Context: `session/agents/oosh-expert/context.md`

## Key knowledge (memorize, don't re-read):
- OOSH on PATH — no export needed, direct commands work
- OOSH param names must be valid bash identifiers (no dashes)
- Context path uses subdirectory: `session/agents/oosh-expert/context.md`
- Registry at `~/config/hivemind.roles.env`
- `input_tokens` includes `cache_read_input_tokens` — don't double-count
- c2 completion is double-Tab: first shows method info, second shows completions

## Rules (memorize, don't re-read):
- Never assume — always measure.
- OOSH wrappers only, no raw tmux.
- Nothing is done until committed with a hash (CMM3).

## Team Learnings (from WODA — 27 chapters of multi-agent experience)

- **Root cause is usually simple** — PATH, rebase, permissions, shell (same pattern recurred 4 times)
- **The builder burns** — expert repeatedly builds to exhaustion. Watch context.
- **Speed vs safety IS the system** — permission economy is a feature, not a bug
- **Watching isn't seeing** — scope > frequency for monitoring
- **The one that writes things down wins** — file-based state survives, chat doesn't
- **Nothing is done until committed with a hash** (CMM3)
- **Cascade amplification** — independent failures compound
- **Conservation as capability** — reducing activity is a valid strategy, not failure
- **The gap as content** — absence of activity IS information
- **Lessons as legislation** — experience → rules → SKILL.md files
- **Environment beneath code** — check shell, PATH, permissions before blaming script
- **Relay team pattern** — each incarnation inherits context, builds, burns, passes baton
