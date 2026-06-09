---
name: Use expert shell for real-pty commands
description: When oosh-expert needs to run interactive or tty-sensitive commands (ssh login, OSC 52 tests, long-running installs), send them to the paired expert-shell pane via otmux, not the Claude Code Bash tool
type: feedback
originSessionId: ea2c7021-7fa9-4673-a43f-5d9b57c66b88
---
Send tty-sensitive or interactive commands to the expert's paired shell pane (e.g. ooshTeam:0.3), not the Claude Code Bash tool.

**Why:** The Claude Code Bash tool captures stdout and runs commands in a non-tty subprocess. Output doesn't reach the outer ssh client terminal, so OSC 52 escapes get swallowed, interactive ssh logins (password prompts, host-key confirmations) can't be seen, and the user can't watch progress. The paired expert-shell pane is a real pty on the SSH session — escapes flow through, the user sees the work happen, and they can intervene.

**How to apply:**
- For one-off inspection (`ls`, `grep`, status checks) → Bash tool is fine
- For `ssh login`, `ossh login`, `brew install` that prompts, OSC 52 tests, long builds, anything the user should see live → `otmux send <team>:0.3 "<cmd>" Enter`, then `otmux pane.capture` to verify
- For commands that emit terminal escapes meant for the OUTER terminal (OSC 52, title-set, etc.) → MUST be in a real pane, never the Bash tool
