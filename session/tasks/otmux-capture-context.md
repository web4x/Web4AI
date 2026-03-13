# Task: Improve otmux pane.capture to include agent conversation context

**Assigned to**: otmux-expert (implement), otmux-tester (verify)
**Priority**: HIGH (Tron directive 2026-03-13)

## Problem

`otmux pane.capture <pane> <lines>` only captures the LAST N lines of the visible terminal. When a PO or coordinator captures an agent pane, they see:
- Permission prompts
- Status bar
- Maybe the last few lines of output

But they DON'T see what the agent actually said, decided, or did — the conversation context that scrolled off screen. This makes the coordinator effectively blind to agent activity.

Tron: "the current pane capture methods do not give you any context what the agent did say lately... we have to fix that... you are too blind otherwise."

## What to implement

### Enhanced capture: `otmux pane.capture` with scrollback

The current `pane.capture` uses `tmux capture-pane -p`. Tmux supports scrollback capture via:

```bash
# Capture scrollback buffer (last N lines including scrolled-off content)
tmux capture-pane -t <target> -p -S -<lines>
```

The `-S -<lines>` flag captures from N lines back in the scrollback buffer, not just the visible pane.

### Options to consider

1. **Increase default capture depth** — instead of just visible lines, capture from scrollback by default (e.g. `-S -100`)
2. **Add `otmux pane.history <target> <lines>`** — separate method for deep scrollback capture, leaves `pane.capture` as-is for quick checks
3. **Add `otmux pane.context <target>`** — smart capture that finds the last agent response (looks for Claude output markers like `⏺`, `✻`, `❯`) and captures from there

### Recommendation

Option 2 is simplest and most useful. `pane.history <target> <lines>` gives you the last N lines of scrollback including everything that scrolled off. The `<lines>` parameter controls how deep to look back. PO can use `pane.history otmuxTeam:0.0 100` to see the last 100 lines of agent activity, or `pane.history otmuxTeam:0.0 500` for a full session review.

## Verification (tester)

1. Agent outputs 50+ lines, only 10 visible → `pane.capture` shows 10, `pane.history` shows all 50+
2. Scrollback content is accurate (matches what agent actually output)
3. Method has completion
4. Human-readable errors
