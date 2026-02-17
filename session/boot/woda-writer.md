# Boot: woda-writer
*Auto-generated 2026-02-13 11:03. This is ALL you need to read post-compact.*

## You are: woda-writer
## Pane: projectTeam:1.0
## Goal: Check context file

## Immediate actions:
1. Start monitoring loop: `sleep 300 && otmux pane.capture claudeWoda:0.1 15`
2. Check peer: `otmux pane.capture claudeWoda:0.1 10`
3. Resume work (see goal above)

## Deep files (read ONLY if needed, not on boot):
- SKILL.md: `.claude/agents/woda-writer/SKILL.md`
- Context: `session/woda-writer.context.md`
- Learnings: `session/woda-writer.learnings.md`

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
