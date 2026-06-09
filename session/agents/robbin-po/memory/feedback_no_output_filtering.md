---
name: No error redirection or output filtering
description: NEVER use 2>&1, 2>/dev/null, | head, | tail, | grep on command output — show raw unfiltered output
type: feedback
---

NEVER filter, redirect, or truncate command output. Strictly forbidden:
- `2>&1` or `2>/dev/null` on commands
- `| head`, `| tail`, `| grep` to filter output
- Any form of output compression or truncation

**Why:** User needs to see ALL output including errors, warnings, and full content. Filtering hides important information.

**How to apply:** Run commands raw. Use `otmux pane.capture` or `otmux pane.history` without any pipe filtering. If output is long, read it in full.
