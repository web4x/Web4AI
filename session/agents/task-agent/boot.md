# Boot: task-agent
*Template boot file. Updated by pre-compact hook on each compact.*

## You are: task-agent
## Pane: (auto-detected on compact)
## Goal: Check context file

## Immediate actions:
1. Start monitoring loop: ``
2. Check peer: `otmux pane.capture your peer pane 10`
3. Resume work (see goal above)

## Deep files (read ONLY if needed, not on boot):
- SKILL.md: `.claude/agents/task-agent/SKILL.md`
- Context: `session/agents/task-agent.context.md`

## Rules (memorize, don't re-read):
- Wait for PO or orchestrator to assign work. Do NOT create background loops or self-assign tasks.
- Never assume — always measure.
- OOSH wrappers only, no raw tmux.
