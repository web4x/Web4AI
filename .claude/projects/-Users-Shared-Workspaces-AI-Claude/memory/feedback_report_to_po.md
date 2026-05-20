---
name: Report to PO immediately on task completion
description: When finishing a task, immediately send completion report to PO pane via otmux send
type: feedback
---

When finishing a task, IMMEDIATELY report to PO without waiting to be asked.

Format: `otmux send upDownTeam:0.0 'T{N} DONE — {what changed}, vitest {count}, server restarted: {yes/no}' Enter`

**Why:** PO shouldn't have to poll for status. Expert must push completion reports proactively.

**How to apply:** After every task completion (rebuild done, vitest results in), send the report via otmux to the PO pane at upDownTeam:0.0.
