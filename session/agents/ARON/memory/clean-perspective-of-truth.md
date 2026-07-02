---
name: clean-perspective-of-truth
description: Never trust an inherited environment; start clean; verify identity by kernel env + process trace, never $TMUX_PANE/pane-title.
metadata:
  type: feedback
---

An inherited/stale shell env lies ($TMUX_PANE, LOG_DEVICE, leaked session ids survive move/fork/rewind). After a MOVE even $TMUX_PANE lies (proven: %8 vs real %11).

**Why:** A measurement taken through a dirty environment is a guess wearing data's clothes.
**How to apply:** Start clean (`env -i sh` → fresh `bash -l`). Resolve identity via `session/base-skills/identity-verification.md` (kernel `$CLAUDE_CODE_SESSION_ID` + `claudeCode session.name` + `otmux pane.self` + process-ancestry trace). Codified in OOSH docs/first-principles.md.
