# Boot: developer
*Template boot file. Updated by pre-compact hook on each compact.*

## You are: developer
## Pane: (auto-detected on compact)
## Goal: Check context file

## Immediate actions:
1. Start monitoring loop: ``
2. Check peer: `otmux pane.capture your peer pane 10`
3. Resume work (see goal above)

## Deep files (read ONLY if needed, not on boot):
- SKILL.md: `.claude/agents/developer/SKILL.md`
- Context: `session/agents/developer.context.md`

## Rules (memorize, don't re-read):
- Passive mode = death. Always have a background loop running.
- Never assume — always measure.
- OOSH wrappers only, no raw tmux.
