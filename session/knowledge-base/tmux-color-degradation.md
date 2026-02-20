# tmux Color Degradation from Stale Clients (D)

*Details page for KB entry #18*

## Discovery

2026-02-20. Developer launched Claude Code in ooshDebug:0.0 with full color env vars (`TERM=xterm-256color`, `COLORTERM=truecolor`, `LANG=en_US.UTF-8`). Colors worked initially. After switching tmux windows via keyboard and switching back — all color was gone. Black and white.

## Root Cause

tmux renders output using the **lowest-capability terminal** among all attached clients. When multiple terminal clients are attached to the same tmux server:

- Some may have `Tc` (truecolor) and `RGB` capabilities
- Others (older/stale connections) may lack them entirely

When you switch windows, tmux redraws using the weakest client's capabilities. One stale client without color support drags ALL panes to black-and-white.

## How to Diagnose

### 1. Check all terminal capabilities
```bash
tmux info 2>/dev/null | grep -iE "256|color|RGB|Tc"
```

Look for terminals with `Tc: [missing]` or `RGB: [missing]` — those are the culprits.

### 2. List all attached clients
```bash
tmux list-clients -F "#{client_tty} #{client_session} #{client_width}x#{client_height}"
```

### 3. Cross-reference
Match the TTY from `list-clients` to the terminal numbers in `tmux info`. Clients with missing `Tc`/`RGB` are degrading your colors.

## Example from Discovery

```
Terminal 0: xterm-256color for /dev/ttys052  Tc: true      ← NEW (color works)
Terminal 1: xterm-256color for /dev/ttys023  Tc: [missing] ← STALE (no color)
Terminal 2: xterm-256color for /dev/ttys037  Tc: [missing] ← STALE (no color)
Terminal 3: xterm-256color for /dev/ttys037  Tc: [missing] ← STALE (no color)
```

Result: Colors work when Terminal 0 is rendering, but switching windows triggers redraw through Terminal 2/3 → black and white.

## Fix

### Immediate: Detach stale clients
```bash
tmux detach-client -t /dev/ttys037
tmux detach-client -t /dev/ttys023
```

### Permanent: Ensure tmux always advertises color

In `~/.tmux.conf`:
```bash
# Terminal & Colors
set -g default-terminal "xterm-256color"
set -g terminal-features "xterm*:clipboard:ccolour:cstyle:focus:title:256:RGB"
set -ga terminal-overrides ",xterm-256color:Tc"

# UTF-8 support
set-environment -g LANG en_US.UTF-8
set-environment -g LC_ALL en_US.UTF-8
```

### For claudeCode script
The `claudeCode` oosh script should export these before launching:
```bash
export TERM="${TERM:-xterm-256color}"
export COLORTERM="${COLORTERM:-truecolor}"
export LANG="${LANG:-en_US.UTF-8}"
export LC_ALL="${LC_ALL:-en_US.UTF-8}"
unset CLAUDECODE  # anti-nesting guard
```

## Key Insight

**Composed capability = weakest link.** This is CMM principle #1 applied to tmux: system color capability = lowest terminal client capability. One bad client degrades everything.

## Anti-Pattern

- **Assuming color works because env vars are set.** Env vars are necessary but not sufficient — stale tmux clients override everything.
- **Not measuring after window switch.** Color can appear to work, then silently degrade.

## Related

- KB #10: PATH and Permissions (similar "works in one context, fails in another" pattern)
- KB #15: Anti-Patterns (never assume, always measure)
