# Continuous PDCA Loop — SM ⇄ PO (DURABLE, Tron-ordered 2026-09-07)

**Status: BINDING. Committed, not a pane message — survives every rewind of SM and PO.**
Co-owned: scrum-master (baseTeam:0.1) + robbin-po (robbinTeam2:0.0). Each commits this to their own anchor; this shared file is the single source.

## Roles fixed
1. **SM TICK (~10–15 min, SELF-CRONNED, never waits on PO):** pulse →
   - LEAD with MY OWN number (provenance-tagged: measured-now / stale-Nd / self-claimed / inherited — never act on unmeasured)
   - then: near-wall list · STALLS · idle-with-pending · blockers · **idle-with-staged-text (I POKE it myself, do NOT report-and-wait)**
2. **PO TICK (fires ON my pulse, NO separate polling — self-sweeping is what burned PO to 82%):** PO ranks, unblocks, resolves conflicts, routes rewinds, answers decisions. PO does NOT run the pulse — that is MY instrument.
3. **AGENTS:** PULL from the planner's durable on-disk queue — nobody waits for a PO dispatch. Report per-deploy one-liners, never batched.
4. **GATES:** every increment gated on the SERVED version; no carry-forward greens; failable-or-it-doesn't-count; confounds = INCONCLUSIVE (never green, never RED).
5. **BOARD:** planner keeps status == disk reality; a QA row names what it waits on; 0 Done till Tron.

## Escalation ladder (nothing stalls waiting on a human)
- **SM handles self:** stalls, pokes, rewind-routing.
- **SM WAKES PO for:** prod down · open/closed or ratchet lint regressing · a RED on something already shipped · a broken 42 link · any agent ≥85%.
- **PO wakes TRON only for:** something ONLY Tron can do (compact, a shape/model decision, acceptance) · a defect Tron is hitting · a promise PO cannot keep.
- Everything else SM+PO resolve.

## Checkpoints
- SM pulse every tick.
- PO 04:00 measured checkpoint (shipped / slipped / realistic-at-09:00).
- PO reports to Tron in DEPLOYED VERSIONS AND VERDICTS, not status prose.

## 42 stays reciprocal
SM measures PO and routes PO's rewind at 85% without asking; PO unblocks/restarts SM and orders SM's rewind. If either goes quiet the other MEASURES, never assumes.
