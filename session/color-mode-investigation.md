# Color Mode Investigation Report
**Agent**: oosh-tester
**Date**: 2026-02-16
**Task**: 20260216T1125Z — Investigate broken color mode in otmux attach vs raw tmux

## Root Cause

**tmux 3.6a auto-sets `COLORTERM=truecolor` in ALL sessions, regardless of the outer terminal's actual capability.**

Apple Terminal.app does NOT support 24-bit truecolor. But tmux tells every pane it does. Claude Code uses chalk/ink for rendering, which reads `COLORTERM` to decide color depth. When chalk sees `truecolor`, it emits 24-bit ANSI escape codes (`\e[38;2;R;G;Bm`) that Terminal.app cannot render correctly.

This is NOT an otmux-vs-raw-tmux issue. BOTH paths produce the same broken behavior because the tmux SERVER is the source of the incorrect `COLORTERM=truecolor`.

## Evidence

### Environment comparison (raw tmux vs otmux session vs OOSH bash)

| Variable | Raw tmux (zsh) | otmux session | OOSH bash | Outside tmux |
|----------|---------------|---------------|-----------|-------------|
| TERM | xterm-256color | xterm-256color | xterm-256color | xterm-256color |
| COLORTERM | truecolor | truecolor | truecolor | truecolor |
| FORCE_COLOR | (empty) | (empty) | (empty) | (empty) |
| NO_COLOR | (empty) | (empty) | (empty) | (empty) |
| tput colors | 256 | 256 | 256 | 256 |
| TERM_PROGRAM | tmux | tmux | tmux | Apple_Terminal |

**All three tmux session types are identical.** The difference is NOT between otmux and raw tmux.

### Where COLORTERM comes from

| Source | Sets COLORTERM? |
|--------|----------------|
| Apple Terminal.app | NO |
| ~/.zshrc | NO |
| ~/.bashrc | NO |
| OOSH `this` kernel | NO |
| tmux.conf | NO (but `default-terminal` is `xterm-256color`) |
| **tmux 3.6a server** | **YES — auto-sets `truecolor` in all panes** |
| otmux script (line 26) | YES (`export COLORTERM=truecolor`) — redundant |

**Test**: Created fresh session with `COLORTERM=""` before `tmux new-session -d`. Inside the session, `COLORTERM=truecolor` was set. tmux 3.6a sets it automatically.

### tmux server configuration

```
default-terminal: xterm-256color
terminal-overrides: linux*:AX@
terminal-features: xterm*:clipboard:ccolour:cstyle:focus:title
TERM_PROGRAM (outer): Apple_Terminal
```

### Outer terminal: Apple Terminal.app

- Version: 447.1
- `__CFBundleIdentifier`: com.apple.Terminal
- Supports: 256 colors
- Does NOT support: 24-bit truecolor (no RGB capability)
- tmux 3.6a incorrectly advertises truecolor to inner sessions

## Why the restored claudeCode fix didn't work

The restored `claudeCode` had:
```bash
if [[ "${COLORTERM:-}" != "truecolor" && "${COLORTERM:-}" != "24bit" ]]; then
    export FORCE_COLOR=2
fi
```

This fix checked `COLORTERM`, but tmux already set it to `truecolor`. The condition was always false. The fix never activated. **The restored fix was correct in intent but wrong in implementation** — it needed to check the OUTER terminal, not the tmux-provided COLORTERM.

## The FORCE_COLOR levels (chalk/ink)

| Value | Meaning |
|-------|---------|
| 0 | Disable colors |
| 1 | Enable basic colors (16) |
| 2 | Enable 256 colors |
| 3 | Enable truecolor (16 million) |

Claude Code needs `FORCE_COLOR=2` when the outer terminal is Apple Terminal.app.

## Contributing factors in otmux

Line 25-26 of `/Users/donges/oosh/otmux`:
```bash
export FORCE_COLOR=1   # only enables basic colors — too low
export COLORTERM=truecolor  # WRONG for Terminal.app — redundant with tmux auto-set
```

- `FORCE_COLOR=1` is too low — tells chalk to use only 16 colors
- `COLORTERM=truecolor` is redundant (tmux sets it) AND incorrect for Terminal.app
- Neither line helps; both may contribute to color confusion

## Suggested Fix

### Fix 1: In otmux (lines 25-26) — detect outer terminal

Replace the unconditional color exports with detection:

```bash
# Detect color capability from actual outer terminal
if [[ -n "$TMUX" ]]; then
  _outer_term=$(tmux show-environment -g TERM_PROGRAM 2>/dev/null | cut -d= -f2)
elif [[ -n "$TERM_PROGRAM" ]]; then
  _outer_term="$TERM_PROGRAM"
fi

if [[ "$_outer_term" == "Apple_Terminal" ]]; then
  # Terminal.app: 256 colors only, no truecolor
  export FORCE_COLOR=2
  export COLORTERM=""
else
  # iTerm2, Alacritty, etc.: full truecolor
  export FORCE_COLOR=3
  export COLORTERM=truecolor
fi
unset _outer_term
```

### Fix 2: In claudeCode.start() — set FORCE_COLOR before launching Claude

```bash
# Before launching claude CLI:
if [[ "$(tmux show-environment -g TERM_PROGRAM 2>/dev/null | cut -d= -f2)" == "Apple_Terminal" ]]; then
  export FORCE_COLOR=2
fi
```

### Fix 3: tmux.conf — override COLORTERM for Terminal.app

Add to `tmux.conf`:
```
# Don't advertise truecolor to panes when outer terminal doesn't support it
# (tmux 3.6a auto-sets COLORTERM=truecolor — incorrect for Terminal.app)
set-option -ga update-environment "COLORTERM"
```

This tells tmux to inherit COLORTERM from the client rather than auto-setting it. Since Terminal.app doesn't set COLORTERM, panes will correctly see it as empty.

## Recommendation

**Fix 1 (otmux) is the primary fix** — it's the central place where all OOSH tmux sessions are created. Fix 2 (claudeCode) is a belt-and-suspenders backup. Fix 3 (tmux.conf) is the cleanest but may have side effects for users who switch between Terminal.app and iTerm2.

Implement Fix 1 first, test, then evaluate if Fix 2/3 are needed.
