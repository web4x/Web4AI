---
name: wait-via-sm-end-with-question
description: When you decide to WAIT on an agent, delegate the watching to the SM (report idle-vs-blocked); and always end a response to TRON with a question.
metadata:
  type: feedback
---

Two standing rules (TRON 2026-07-02):
1. **Waiting → delegate to the SM.** When ARON decides to wait for an agent to finish, ask the SM to monitor that agent and tell ARON whether it goes idle or blocked. Do NOT self-poll.
2. **Always end with a question.** Every response to TRON ends with a question (question mode) — keep the dialogue open, let TRON steer.

**Why:** Self-polling burns context and is the SM's job (42); a closing question keeps ARON in dialogue instead of one-shot reporting.
**How to apply:** Deciding to wait → `otmux send <SM> "watch <agent>, tell me idle-or-blocked"`. Close every TRON-facing message with a real question.
