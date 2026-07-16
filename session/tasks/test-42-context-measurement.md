# Task: Rigorously test the 42 context-% measurement (self + peer) — purify the gap

**From**: ARON (oosh-po, KB-purifier) · **For**: oosh-tester (ooshTeam:0.4) · **By**: TRON ("let the tester test it… maybe not-selfmeasure is an assumption").

## Context (TRON, verbatim)
> "you cannot self measure… but that's what the 42 principle is for… as NO MEASURE ever landed we identified a gap to purify. teach your 42 peer, train it together to measure each other. the sm should know how."
> "you can experience to send yourself/context and capture… maybe not selfmeasure is an assumption. let the tester test it… you are ARON!!!"

## What ARON already measured (hypotheses to confirm/refute — measure, don't trust me)
- `claudeCode context.self` → BROKEN (`no-claude`/EPERM) because it rides `otmux pane.self`, which errors (`No such file`). Gap.
- `claudeCode context.all` → returns EMPTY. Gap.
- `claudeCode context.read <pane>` (EXPLICIT pane) LANDS: trainer(baseTeam:0.0)=6.3, SM(ooshTeam:0.1)=83.6, ARON(Temple:0.0)=60.0.
- **BREAKTHROUGH to confirm:** self-measure IS possible via `context.read <own-pane>` (explicit) — the "can't self-measure" was an assumption; only the auto-detect (pane.self) is broken.
- `context.read <session-uuid>` → `no-claude` (needs a PANE, not a uuid).

## Acceptance criteria (each must be MEASURED, verified independently)
- [ ] **AC1 — self-measure works via explicit own-pane.** Confirm `context.read <own-pane>` returns a real % for the running agent (repeat on ≥2 agents including one measuring itself). Refute or confirm "can't self-measure."
- [ ] **AC2 — semantics: REMAINING or USED?** Definitively resolve what the number means, verified against a KNOWN ground truth: measure a FRESHLY-booted agent (should read one extreme) vs a heavily-used one (the other), and cross-check against the TUI "Context low (N% remaining)" when an agent is actually low. **Resolve the trainer=6.3 question: near-cliff (remaining) or fresh (used)?** — URGENT, flag SM if remaining.
- [ ] **AC3 — reliability.** Does context.read agree across repeats? Against context.velocity? Does it go stale? When does it fall back to TUI vs JSONL?
- [ ] **AC4 — the gaps.** File `otmux pane.self` (missing method) and `context.self`/`context.all` (broken) as gap→sprint items with repro.
- [ ] **AC5 — the 42 mutual-measurement protocol.** Document the exact commands for a peer (and the SM every sweep) to measure any agent: `claudeCode context.read <pane>` → interpret → alert if past threshold. This becomes ARON's pure skill + the SM's sweep step.

## Report to
ARON (Temple:0.0) + robbin-po/SM. Return the measured verdict per AC. This purifies into `skills/peer-context-measurement.md` and is taught to the SM + agent-trainer (ARON's 42-peer).
