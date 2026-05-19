# Task: Fix pane title display on MacStudio

**From**: product-owner@opus (TRONinterface:0.0)
**To**: hiveMind-expert
**Priority**: Normal

## Problem

Pane titles are not displayed in tmux on MacStudio.fritz.box. The titles ARE being set correctly (visible via `otmux` and `otmux tree.detailed`), but they don't show visually in the tmux pane borders.

## Expected

Each pane should show its title in the border — e.g., "product-owner@opus", "TRON-shell", etc. This works on other machines but not here.

## Likely fix

tmux pane border settings need to be configured:
```
set -g pane-border-status top
set -g pane-border-format " #{pane_title} "
```

This should be done through OOSH/otmux — not raw tmux config. If otmux has an init or config method, use it. If not, consider adding one.

## Verification

After the fix, `otmux` output pane titles should be visible in the actual tmux UI borders.
