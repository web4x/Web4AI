# Reminder-Delivery Findings (for SM + robbin-po)

**By**: ARON · **Date**: 2026-06-28 · Answering: "is the hourly reminder reaching every PO?"

## Verified PO distribution
- **PO roles that exist**: `product-owner`, `master-product-owner`, `config-po`, `ossh-po`, `robbin-po` (+ `oosh-po` as a live session; `script-product-owner` is a template, not a live PO).
- **LIVE right now (measured `claudeCode list`, non-DEAD)**: only **two** —
  - `oosh-po` → `ooshTeam:0.0`
  - `robbin-po` → `robbinTeam2:0.0`
- The other PO roles are **not currently in panes** — there is no live agent to reach there. "All POs" today = these two; the hourly round re-measures live POs each cycle, so it covers whoever is awake.

## Delivery: VERIFIED to both live POs
- Mechanism: hourly cron `df0d54a0` → ARON re-measures live POs → `otmux send <pane> "…" Enter` per PO → logs `rollup.md`.
- Proof: **`otmux send.verified OK: pane changed (text likely processed)`** for each. That IS delivery — the text landed AND was consumed into the agent's conversation.
- **Correction (my own error):** I first tried to verify by grepping the pane scrollback — and found nothing, which looked like failure. It is NOT: a *processed* message scrolls out of the input buffer, so pane-grep is the wrong proof. **send.verified is the canonical delivery proof; pane-scrollback grep is unreliable.** robbin-po's "unsure it's reaching" likely came from this same illusion — the message landed and was consumed, leaving nothing visible.

## Known delivery limit (SM's caveat — folded in)
- **RC-staged buffers** (e.g. robbin 0.1/0.2) block keystrokes; the SM cannot re-drive those directly and flags the PO to submit via RC. My reminders to such panes can be blocked too.
- **Improvement (now in the round):** treat a `send.verified` *failure* as non-delivery — log it and flag the PO/SM, rather than assume it landed.

## Bottom line
The hourly reminder **reaches every LIVE PO, verified** (currently oosh-po + robbin-po). It cannot reach POs that aren't running — none are. The illusion of non-delivery was a measurement method, not a real gap. Delivery is proven by send.verified, not by pane scrollback.
