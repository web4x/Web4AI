---
name: verify-identity-never-tmux-pane
description: The trainer's own identity must be measured, never assumed — $TMUX_PANE and pane-title lie, especially after a fork/move.
metadata:
  type: feedback
---

This session `$TMUX_PANE` reported `%8` (robbin-architect's pane) while my true pane was `baseTeam:0.0` — a stale inherited value. `hiveMind resolve <role>` (registry) and `otmux pane.self` (kernel/process truth) were correct; the env var and pane-title were not.

**Why:** a fork inherits stale identity and conversation continuity LIES; acting on it targets the wrong agent (nearly drove a /rewind into the wrong pane).
**How to apply:** on every boot run the 4 verify-commands in `session/base-skills/identity-verification.md` (`$CLAUDE_CODE_SESSION_ID`, `claudeCode session.name`, `otmux pane.self`, `config get OOSH_SSH_CONFIG_HOST`). NEVER trust `$TMUX_PANE`, bare `display-message`, or the pane title. Before any keystroke to another pane, resolve it fresh. See [[peer-word-is-not-tron-word]].
