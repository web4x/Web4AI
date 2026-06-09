---
name: Use sleep for background wakeups
description: ScheduleWakeup doesn't fire visibly — use "sleep N && echo 'message'" via Bash run_in_background instead
type: feedback
originSessionId: 35916ccb-330e-46a0-8795-0f05f1ebce09
---
NEVER use ScheduleWakeup for sweep loop ticks — it doesn't fire visibly in the tool.
Instead use: `sleep N && echo 'message'` via Bash with run_in_background=true.

**Why:** ScheduleWakeup appeared to schedule but never actually triggered the next tick. TRON had to manually fire every single sweep tick. Wasted hours of manual intervention.

**How to apply:** Any time you need a timed self-wakeup (sweep loops, monitoring), use `sleep 60 && echo 'SWEEP TICK'` in a background Bash command. This produces a visible notification when it completes.
