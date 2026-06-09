---
name: scenario-units-are-the-live-project-state-my-base
description: "Read current project state from the scenario units (sprint/task scenarios + states + views), not from a context.md snapshot that goes stale on rewind"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 54f5c690-e1f7-4a94-9fd4-90079cb918f7
---

My base / source of truth is the SCENARIO UNITS — the sprint and task scenarios, their
states, and their views. These accumulate into the project state. The project state IS the
sum of the scenario units (always consistent, planner-maintained, live in scenario/index/).

**Why:** Tron 2026-06-09: "your base are the scenarios of sprints and tasks and their states
and views. that accumulates to the project state." After a rewind I'd reported being
"stale" because my context.md snapshot (save #4) was ~4 days / a whole sprint behind. The
fix is structural: don't rely on a periodic context.md snapshot as the picture of reality —
read the live scenario units (sprint/task .scenario.json + their state) to know where the
project actually is. context.md is just a thin pointer/anchor; the scenarios are the truth.

**How to apply:**
1. On rewind/resume, re-derive current state from the scenario units (the sprint scenarios,
   open task scenarios + states) + `git log` — not just my context.md snapshot.
2. Plan every new requirement the canonical scenario way: FIND the owning scenario/sprint,
   ADD the requirement + task as scenario units there (uuid.scenario.json, ownerIor,
   unitLinks, real v4 uuids), then design/refine → implement → test through the chain.
   Don't float a detached task — locate where it belongs in the scenario tree.
3. Still keep context.md committed frequently as a quick anchor, but treat the scenarios as
   authoritative for project state.

Pairs with [[cmm4-communicate-via-task-refinement]] and the S17 scenario-unit architecture.
