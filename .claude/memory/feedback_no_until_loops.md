---
name: No until loops in Bash — they aggregate badly
description: Never use until-loops for polling — they accumulate in context and waste tokens
type: feedback
---

Never use `until <check>; do sleep N; done` patterns in Bash tool calls. They aggregate badly in the conversation context — each poll iteration adds to token count even when nothing changed.

**Why:** Tron observed that until-loops burn context with repetitive poll output. Same problem as manual while loops.

**How to apply:** Use `run_in_background` for one-shot waits, or Monitor for event-driven watching. For checking agent responses: just capture once after a reasonable delay, don't poll.
