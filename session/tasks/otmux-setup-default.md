# Task: Add `otmux setup.default` method

**Assigned to**: otmux-expert (implement), otmux-tester (verify)
**Priority**: HIGH (Tron directive 2026-03-13)

## Problem

When a new tmux server starts (e.g. after machine restart), two things are missing:
1. **Pane title headers** — no `pane-border-status`, so you can't see which agent is in which pane
2. **Clipboard integration** — copy/paste doesn't work with the OS clipboard

The old hiveMind (`restore/hiveMind` lines 931, 1268, 1382) had pane headers. The current `templates/user/tmux_default_config` has macOS-only clipboard config but it's NOT applied to running servers and not OS-independent.

## What to implement

### 1. New method: `otmux setup.default`
Apply sensible defaults to the **currently running** tmux server. Must work on any OS.

```bash
otmux.setup.default() {
  # === Pane title headers ===
  # Show agent names at top of each pane, bold if active
  $TMUX_CMD set -g pane-border-status top
  $TMUX_CMD set -g pane-border-format " #{?pane_active,#[bold],}#T#[default] "

  # === OS-specific clipboard integration ===
  # Use the OOSH `os` script to detect the platform, then configure
  # the correct clipboard tool. Follow the pattern used by the `disk`
  # script which has OS-specific methods.
  #
  # macOS:  pbcopy / pbpaste
  # Linux:  xclip -selection clipboard / xclip -selection clipboard -o
  #         OR xsel --clipboard / xsel --clipboard --output
  # Termux: termux-clipboard-set / termux-clipboard-get
  # WSL:    clip.exe / powershell.exe Get-Clipboard
  #
  # Configure tmux copy-mode bindings for the detected OS:
  #   - MouseDragEnd1Pane → copy-pipe-and-cancel "<copy-cmd>"
  #   - vi copy mode: v to select, y to yank via <copy-cmd>
  #   - paste: prefix+p → <paste-cmd> | tmux load-buffer - && paste-buffer

  # === Other defaults ===
  # Check what config.init already covers — don't duplicate.
  # Mouse support, vi keys, 256 color, etc. should all be ensured.

  success.log "defaults applied to running server"
}
```

### 2. OS detection pattern
Use the OOSH `os` script for detection (like `disk` does), then call OS-specific private methods:
```bash
private.otmux.setup.clipboard.macos()   { # pbcopy/pbpaste bindings }
private.otmux.setup.clipboard.linux()   { # xclip or xsel bindings }
private.otmux.setup.clipboard.termux()  { # termux-clipboard bindings }
private.otmux.setup.clipboard.windows() { # clip.exe/powershell bindings }
```

### 3. Add to default config template
Add `pane-border-status` and OS-independent clipboard setup to `templates/user/tmux_default_config` so `otmux config.init` includes them for new installs.

### 4. Auto-apply on `otmux new` / `otmux start`
If the server was just started (first session), `setup.default` should be called automatically. This prevents the "forgot to run it" problem.

## Verification (tester)

1. Kill tmux server, start fresh: `otmux new testSession` → pane headers visible, clipboard works
2. `otmux setup.default` on running server → headers appear immediately, clipboard works
3. Copy text in tmux copy mode → paste works in OS clipboard (and vice versa)
4. Method has completion stub
5. No duplicate with existing `config.init` functionality
6. Error messages are human-readable (mandatory test criterion — e.g. "xclip not installed" not EPERM)
7. Works on current OS (macOS) — other OS paths can be verified structurally

## Reference
- Old pane headers: `/Users/donges/oosh/restore/hiveMind` lines 931, 1268, 1382
- OS detection pattern: `/Users/donges/oosh/os` and `/Users/donges/oosh/disk` (OS-specific methods)
- Default template: `templates/user/tmux_default_config`
- Config init: `otmux.config.init()`
- Current macOS clipboard config: `templates/user/tmux_default_config` (pbcopy/pbpaste section)
