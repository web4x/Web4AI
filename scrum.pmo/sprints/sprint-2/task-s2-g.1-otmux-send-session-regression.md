> ⬆ **[Sprint 2 · task-s2-g](./task-s2-g-otmux-send-reliability.md)** — sub-task; back to parent task.

# Task S2-G.1: otmux send session/manual regression (OTR-1 rewrite?)
[task:uuid:21962800-9528-404d-aa34-24ec9b9260fc]

## Status
- [x] Planned
- [ ] In Progress
- [ ] QA Review
- [ ] Done

## Description
**Role: architect (diagnose) → expert (fix) → tester (verify)** · **PRIORITY (blocks ARON rewind + Tron's own send).**
otmux send "does not complete the session / totally broken" for: (a) the agent-trainer rewinding ARON (session send), (b) Tron's manual shell send. OTR-1's `send.smart` rewrite (stage→submit→verify→poke×3, 1.3s settle, region-verify) is DEV-ONLY. Hypothesis: the rewrite handles AGENT-DISPATCH panes but breaks NON-dispatch sends (a plain session/shell target with no `❯` claude-pane region, or a session-completion send) — e.g. region-verify never sees a "submitted" state on a non-claude target → poke×3 → Escape interrupts / hangs → "session not completed."

## Requirements
- Diagnose: does `send.smart` mis-handle non-claude / session / shell targets (region-verify assumes a claude `❯` pane)? Compare behavior to macos.latest's old send on the SAME target.
- Fix: `send.smart` must complete reliably for ALL target kinds (claude-dispatch, shell, session, remote) — detect target kind and skip the claude-pane region-verify where it doesn't apply; never hang/Escape-interrupt a non-dispatch send.
- Preserve OTR-1's rc-dispatch guarantees (don't regress the 5/5 T-DISPATCH-SUBMIT).

## Definition of Done
- otmux send completes on shell/session/manual targets (trainer ARON rewind + Tron manual) — reliably, no hang
- OTR-1 rc-dispatch paths still 5/5
- T-SEND-SESSION: send to a non-claude / shell / session target → completes (no poke-hang / Escape-interrupt); regression guard for the OTR-1 gate-miss

## Report-back
- Architect (diagnosis vs macos.latest):
- Expert (fix + commit):
- Tester (T-SEND-SESSION):
