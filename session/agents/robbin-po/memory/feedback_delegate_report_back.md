---
name: delegate-with-explicit-report-back
description: Every delegation directive must tell the agent to report completion back to the PO pane (robbinTeam:0.0)
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 54f5c690-e1f7-4a94-9fd4-90079cb918f7
---

Every otmux directive I send to a team agent must end with an explicit instruction to
report back to my pane (robbinTeam:0.0) when the work is finished.

**Why:** I dispatched the architect to diagnose the member-click/vCard bug and said only
"report root cause + fix owner" — I never said WHERE to report. The architect produced a
complete diagnosis inside its own pane and never pushed it to me; I only found it by
manually running `otmux pane.capture`. Tron caught this: "did you delegate the work and
remind the agents to report back when finished?" A delegation without a close-the-loop
destination leaves the PO blind and forces polling.

**How to apply:** Close every delegation with a concrete report-back, e.g.
">>> WHEN DONE: report back to robbinTeam:0.0 with <the specific artifact: commit hash /
file path / result>." This pairs with [[feedback-use-sleep-for-wakeup]] / not polling:
the agent's self-report to 0.0 is the signal, so I must make sure I actually asked for it.
Applies to diagnosis, implementation, testing, and planning directives alike.
