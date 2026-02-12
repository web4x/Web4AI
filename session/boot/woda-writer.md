# Boot: woda-writer
*Auto-generated 2026-02-12 11:44. This is ALL you need to read post-compact.*

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
