---
name: Use hiveMind tools for monitoring, no manual while loops or output filtering
description: Use hiveMind team.loop / pane.sweep.loop for monitoring — don't write manual while loops or filter output with 2>&1/grep
type: feedback
---

Use hiveMind's built-in monitoring tools (team.loop, pane.sweep.loop, watchdog) instead of writing manual while loops in Monitor.

**Why:** OOSH already has loop/sweep code built into hiveMind. Writing manual bash loops duplicates that. Also: NEVER filter output with `2>&1`, `| grep`, `| head`, `| tail` — show raw unfiltered output. The OOSH tools handle formatting.

**How to apply:** For continuous monitoring, use `hiveMind team.loop <session> <interval>` or `hiveMind pane.sweep.loop <interval>`. For one-shot sweeps, use `hiveMind team.sweep <session>`. For unblocking, use `hiveMind agent.unblock all <session>` — but only AFTER reviewing what's blocked via sweep.
