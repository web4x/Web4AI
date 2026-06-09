---
name: no-background-sleep-monitors
description: Never spawn background sleep timers to poll/monitor delegated agent work — rely on self-reports and completion notifications instead
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 54f5c690-e1f7-4a94-9fd4-90079cb918f7
---

Do NOT spawn `Bash run_in_background: sleep N && echo` timers as a heartbeat to "wait" for delegated agents to finish.

**Why:** In a long multi-agent session (orchestrating robbinTeam across 9 sprints) I spawned ~112 such timers — one per task monitored. Tron reacted: "you have 112 background tasks???? WTF???". They complete (exit 0) but accumulate in the harness registry / status-bar count — wasteful and alarming, makes it look like runaway processes.

**How to apply:** After delegating a task (e.g. via otmux send to an agent pane), just stop and yield. Two things bring the result back without polling:
1. The agent self-reports via otmux send — arrives as a user message.
2. Harness-tracked `run_in_background` work fires its own completion notification automatically.
To check progress on demand, use `otmux pane.capture` ONCE — never loop it with sleeps. The only valid sleep-wait is external state the harness genuinely can't track (a remote deploy/CI), and even then: one timer, not one per task.
