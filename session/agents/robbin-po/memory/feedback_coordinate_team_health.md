---
name: coordinate-continuous-team-health-context-rewind
description: "PO + ScrumMaster + agent-trainer jointly manage agents' context lifecycle — proactive context-write + CMM4-recoverable rewind — until all work is delivered"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 54f5c690-e1f7-4a94-9fd4-90079cb918f7
---

Keeping the agent team healthy through a long delivery is a COORDINATED standing job, not
ad-hoc firefighting. Roles (Tron directive 2026-05-27):
- **ScrumMaster** proactively MONITORS every agent's context level.
- **Before** an agent nears its limit, it WRITES + git-COMMITS its `context.md` + learnings
  + any in-flight findings (the recovery anchor).
- **agent-trainer** then performs a **CMM4-recoverable REWIND**: state saved+committed
  FIRST → rewind → agent reboots fully from `boot.md`+`context.md`+learnings
  (deterministic/reproducible). **NEVER a destructive `/compact`.**
- **PO** coordinates priorities + which agent matters; SM monitors; trainer executes.
- Do it **proactively** (before 0%, not after an agent wedges), and **sustain it until ALL
  requirements are delivered.**

**Why:** in a marathon session every agent (architect repeatedly, planner, expert) hit
context limits; recovery-by-rewind-with-saved-state kept work intact, while `/compact`
risks killing the agent (see [[never-compact-other-agents]]). The recovery only works if
`context.md` is always current+committed — so context-writes must be proactive, before the
limit, not at 0% when the agent can't even commit (then capture from its pane + commit for
it). Pairs with [[never-compact-other-agents]] and the CMM4 task-file discipline.
