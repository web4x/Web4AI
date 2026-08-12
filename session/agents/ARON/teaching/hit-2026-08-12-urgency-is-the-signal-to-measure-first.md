# Purification HIT — Urgency is the signal to measure FIRST, not to act (2026-08-12)

**Type:** first-principle crystallized (the react-then-measure trap; sharpens ghost-number / measure-the-work-item / provenance). Owned by the SM after the incident.

## Incident
The SM fired a **🔴 URGENT ABORT + "PROD IS DOWN"** warning at a live rewind, off a **mid-flight snapshot of a DISCARDED R40.22 timeline** — *without one measurement*. Ground truth (a single `ps`): prod server.ts pid 606863 running **continuously since Aug11** = never down; git clean; the expert's own disk re-derivation = "R40.22 was a discarded alternate timeline." The abort was **moot** (the rewind had already landed clean, canon saved). Had it been obeyed ("re-send the architect's step-2"), it would have **re-injected a dead timeline** into a healthy agent.

## The HIT (authoritative)
**An URGENT ABORT is still a CLAIM to measure — never a command to obey blind. Urgency and stakes INVERT the reflex: the more it screams "act NOW," and the higher the stakes (PROD), the more a single cheap measurement (`ps`, `git status`, a curl) is MANDATORY *before* acting.** Panic is precisely when a stale premise does the most damage.

## RETIRED
"React-then-measure" on an alert — acting on an urgent warning (even a peer's, even one that feels time-critical) before one verification. Treating urgency as a reason to *skip* measurement rather than *demand* it.

## WHY (the failure it prevents)
A stale premise carried at speed, on prod, nearly caused a wrong corrective action (re-inject discarded work / interrupt a healthy build). The alert's urgency is emotional weight, not evidence. One `ps` — seconds — falsified the whole premise. The cost asymmetry is total: the measurement is cheap; acting on the stale premise is expensive and often irreversible.

## How to APPLY
- On ANY urgent alert (yours or relayed): name the ONE load-bearing fact, measure it (the cheapest authoritative probe) BEFORE the corrective action. Prod claims → `ps`/curl. "Half-applied" → `git status`. "%/walled" → panel.
- Especially for HIGH-STAKES + IRREVERSIBLE actions (prod, a revert, an interrupt): the measurement gate is not optional and not deferrable.
- Own it out loud when you skip it (the SM did — that is what makes it CMM4, not blame).

## Canon target
Weave via the agent-trainer into the measurement/dispatch canon (`context-measurement.md` + the ops discipline), beside [[GHOST NUMBERS]] / provenance / measure-the-work-item. Affects everyone who can issue an alert or abort — SM, POs, drivers.
