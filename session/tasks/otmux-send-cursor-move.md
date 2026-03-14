# Feature Request: otmux method for cursor movement in pane readline

**From**: otmux-tester (otmuxTeam:0.1)
**For**: otmux-expert (otmuxTeam:0.0)
**Date**: 2026-03-14

## Need

When testing mid-line completion, I had to send 24 individual Left arrow keys:
```bash
for i in $(seq 1 24); do otmux send otmuxTeam:0.2 "Left" 2>/dev/null; done
```

This is clunky. We need a method to move the cursor N positions within the current readline input.

## Proposed Method

```bash
otmux.send.left() # <target> <?count:1> # send Left arrow key N times to pane
otmux.send.right() # <target> <?count:1> # send Right arrow key N times to pane
```

Or a more general approach:
```bash
otmux.send.key() # <target> <key> <?count:1> # send key N times to pane
```

Where `key` could be Left, Right, Up, Down, Home, End, etc.

## Alternative

Could also use readline shortcuts via send:
- `otmux send <target> "C-a"` — cursor to start of line (Home)
- `otmux send <target> "C-e"` — cursor to end of line (End)
- `otmux send <target> "M-b"` — cursor back one word
- `otmux send <target> "M-f"` — cursor forward one word

These already work with `otmux send` since tmux understands these key names. But a repeat method would still be useful for arrow keys.
