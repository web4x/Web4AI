---
name: Task queue discipline
description: Do NOT context-switch on new messages — queue with TaskCreate, finish current task first
type: feedback
---

When a new message arrives while working, do NOT drop current work. Use TaskCreate to queue it, finish the current task, then TaskList for next.

**Why:** PO rule — context switching wastes work and causes incomplete commits.

**How to apply:** On new message mid-task: (1) TaskCreate to queue it, (2) finish current task, (3) commit, (4) TaskList for next.
