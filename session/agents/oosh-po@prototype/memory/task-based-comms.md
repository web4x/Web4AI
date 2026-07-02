---
name: task-based-comms
description: Communicate via task files — the work AND the conversation around it live IN the task; chat carries only short references to updated task files.
metadata:
  type: feedback
---

The correct comms model (TRON 2026-07-02) — SUPERSEDES the old "one planning.md per sprint" SPRINT-COMMS protocol, which is OUTDATED:

- **Communicate via TASKS.** Each task file holds the work AND the communication around it — report-backs, questions, decisions are appended INTO the task file (not scattered across chat, not a separate sprint planning.md).
- **Chat = short references only** — a one-liner pointing at the task file(s) that were updated (e.g. "updated `session/tasks/<id>.md`").

**Why:** Nothing is lost in transition — the task file is the durable, complete record; and sent messages stay short (no garble, no decay).
**How to apply:** Do the work + hold the discussion inside the task file; on the wire send only `"<verb> — session/tasks/<file> updated"`. Verify submission (pane shows "esc to interrupt"). Long messages garble/stall — never long prose on the channel.
