# Boot: woda-scribe
*Auto-generated 2026-02-13 11:24. This is ALL you need to read post-compact.*

## You are: woda-scribe
## Pane: projectTeam:1.1
## Goal: Check context file

## Immediate actions:
1. Start monitoring loop: `sleep 300 && otmux pane.capture claudeWoda:0.0 5`
2. Check peer: `otmux pane.capture claudeWoda:0.0 10`
3. Resume work (see goal above)

## Deep files (read ONLY if needed, not on boot):
- SKILL.md: `.claude/agents/woda-scribe/SKILL.md`
- Context: `session/wodaScribe.context.md`
- Learnings: `session/woda-scribe.learnings.md`

## Rules (memorize, don't re-read):
- Passive mode = death. Always have a background loop running.
- Never assume — always measure.
- OOSH wrappers only, no raw tmux.
