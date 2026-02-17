# Boot: oosh-expert
*Auto-generated 2026-02-12 16:38. This is ALL you need to read post-compact.*

## You are: oosh-expert
## Pane: projectTeam:0.1
## Goal: CURRENT GOAL
Fixing measurement system tools (CMM4 task). Task 5 in progress. Tasks 3+4 completed.

## Immediate actions:
1. Start monitoring loop: ``
2. Check peer: `otmux pane.capture your peer pane 10`
3. Resume work (see goal above)

## Deep files (read ONLY if needed, not on boot):
- SKILL.md: `.claude/agents/oosh-expert/SKILL.md`
- Context: `session/agents/oosh-expert.context.md`


## Rules (memorize, don't re-read):
- Passive mode = death. Always have a background loop running.
- Never assume — always measure.
- OOSH wrappers only, no raw tmux.

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
