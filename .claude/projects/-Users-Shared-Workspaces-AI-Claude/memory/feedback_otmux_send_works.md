---
name: otmux send works from Bash tool
description: otmux send is NOT tty-sensitive — it works from the Bash tool. Use it for self-reports to PO.
type: feedback
---

otmux send WORKS from the Bash tool. It is NOT tty-sensitive.

**Why:** Previously assumed otmux send was tty-sensitive like ssh login or brew prompts. Wrong — otmux send just writes text to a tmux pane, no tty needed. oosh-expert confirmed.

**How to apply:** After every task completion, immediately run:
`otmux send upDownTeam:0.0 "T{N} DONE — {summary}, vitest {count}, server restarted: {yes/no}" Enter`

Common mistakes to avoid:
1. Missing trailing `Enter` argument
2. Quoting collision — use double quotes for the message, not single quotes (shell escaping)
3. Don't confuse tty-sensitive commands (ssh login, OSC 52, brew prompts) with otmux send
