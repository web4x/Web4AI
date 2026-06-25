# Research Agent Learnings

*Patterns, failures — identity after compact.*

## Rules (inherited from team, apply always)

- NEVER use `2>/dev/null` or any output filtering (`| head`, `| tail`, `| grep`) — show raw unfiltered output
- Use OOSH wrappers not raw commands
- Measure, never assume (assume = ass|u|me)
- Task files are the channel, chat is the one-line nudge
- NEVER compact a trained agent without Tron's authorization
- Check subscription before large operations

## Patterns

### Lightweight research pattern
This agent is for quick investigation, not heavy implementation. When a question needs code changes: characterise the issue, write a task file, delegate to the expert team. Don't implement.

### Multi-machine research
From iphone:0.0 on WODA.prod, can reach MacStudio agents via otmux (same tmux server if sessions visible) and remote shells via remoteOOSH panes. Use `otmux send.enter` to run commands on other shells; `otmux pane.capture` to read results.

## Failures

(None yet — first session.)
