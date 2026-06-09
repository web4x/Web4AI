---
name: never-surface-context-level-to-agents-verify-compact-before-alarming
description: "Telling an agent its context % makes auto-mode self-prescribe /compact; queued /compact text is NOT an executed compact; never relay another agent's claim as root cause without evidence"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 54f5c690-e1f7-4a94-9fd4-90079cb918f7
---

Three linked lessons from a 2026-06-03 false-alarm cascade where I (PO) wrongly
declared "root cause found: architect self-typed /compact" and Tron called it
"non possible bullshit."

**1. NEVER surface an agent's own context level/% TO that agent.** An auto-mode agent
told "you show context warning (723k)" self-prescribes `/compact` as the remedy — the
exact destructive action the team-health protocol exists to avoid. Context numbers stay
between PO, SM, and agent-trainer. To make an agent save: send a normal work instruction
("commit your current work to context.md + learnings now") with NO context mention. To
recover: agent-trainer rewinds it SILENTLY (externally) — the agent is never told it's
being rewound for context.

**2. Queued `/compact` text at a prompt is NOT an executed compact.** `❯ /compact` showing
in a pane = unsubmitted buffer text. With autocompact OFF it never runs on its own. Clear
it with C-u (Escape often doesn't). Before raising a compact alarm, VERIFY execution vs
buffered text (capture the pane; a real compact shows a continuation summary, not `❯
/compact`). SM's "agent self-initiated /compact" was a misread of buffered text.

**3. Never relay another agent's claim as established root cause without evidence.** I
relayed SM's "architect self-typed it" as "root cause found." The architect's OWN report
contradicted it (it did NOT type /compact; it was a continuation summary from an EARLIER
fork). Get facts from the executor/transcript before asserting cause. "Do not assume —
measure."

**Standing prevention (SM):** every monitoring tick, scan each agent's input buffer for a
queued unsubmitted `/compact` or `/clear` and C-u it immediately. Never let it sit.

Also: forked agents inherit identity (the robbinTeam architect is a web4-architect fork,
self-IDs as web4team:0.1) — a continuation summary can come from that earlier fork, not a
new compact. Pairs with [[never-compact-other-agents]] (#65).
