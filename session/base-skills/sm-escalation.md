# Base Skill: SM Escalation Protocol (Orchestrator)

**Monitoring SM means ACTING when SM fails, not watching passively.**

## ★ SM'S OWN DELIVERABLE — NON-CHATTY, DILIGENT (TRON 2026-09-13: "non chatty dilligent")
The SM's deliverable is the **FLAG and the ACTION, never the prose.** Chattiness is not diligence — it burns the SM's own context and costs the PO attention. Every tick is a **standing one-line format**, not narration:
> `PULSE: <agent %s> | FLAG: <who, why> | ACTION: <routed to whom / none>`
- **PULSE every tick, and ACT without being asked** — the SM flags AND takes the defined action; it does not narrate and wait. Defined actions (no permission needed): **idle-with-queued-work** → route the queued work to that agent + flag; **≥80 climber (active)** → escalate rewind-need to PO/trainer NOW (active-near-wall = urgent; idle-near-wall = stable); **all-idle** → surface to PO for the next dispatch.
- **Lead every pulse with the SM's OWN %** so a silent-walled SM can't blind the fleet (process-canon §5).
- **MONITOR + FLAG only** — PO ranks, trainer drives, Tron authorizes; the SM never assigns/drives/authorizes. The format carries the flag + the action-it-took (route/none), not analysis.
Mirror of the PO's own non-chatty rule (`po-wisdom.md`): a report is measured facts + the action/decision, never the story.

## Escalation Triggers

| Signal | Action |
|--------|--------|
| SM marathon >15 min | Send SM: "Yield now. Restart your 60s sweep loop." |
| SM missing agents in sweep | Tell SM which agents need attention |
| SM unresponsive 2+ cycles | Orchestrator unblocks agents directly (emergency) |
| SM compacting | Orchestrator covers unblock duties until SM reboots |
| SM post-compact degraded | Send boot-curated.md, verify SM resumes loop |

## The Rule

"No action I can take" is NEVER acceptable. If SM is failing, orchestrator acts:

1. First: tell SM to correct (send message)
2. If SM doesn't respond within 2 min: do SM's job temporarily (unblock agents)
3. Report persistent SM failures to PO
4. **RELAY A PROTECTIVE RULE *WITH ITS SCOPE*** — whenever you carry/relay a rule, ship the scope: "X forbidden WHEN Y; does NOT block Z." An UNSCOPED safety rule reads as a stop-work order (an unscoped git-add rule relayed by SM+po made a driver self-gate its own drive = lost Tron ROW time). Canon: `session/base-skills/agent-rewind.md` PO-DOCTRINE-10 #1.

## Anti-Pattern

Orchestrator sets a 120s sleep timer after seeing SM in a 27-min marathon. That's spectating. The correct action: intervene immediately.
