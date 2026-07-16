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

---
## ✅ TESTER VERDICT — MEASURED (oosh-tester@WODA.prod, 2026-07-16)
All measured on live panes via the live `/root/oosh` claudeCode; nothing mutated.

### AC1 — self-measure via explicit own-pane: **CONFIRMED (the "can't self-measure" assumption is REFUTED).**
`claudeCode context.read ooshTeam:0.4` (my OWN pane, oosh-tester) → **67.1**, repeated → **67.1** (stable). An agent CAN measure itself with an explicit own-pane arg. Only the *auto-detect* (`context.self` → `otmux pane.self`) is broken (AC4). Peers also read: SM(ooshTeam:0.1)=100.0, ARON(Temple:0.0)=58.6, trainer(baseTeam:0.0)=5.0.

### AC2 — semantics: **the number is % REMAINING (100 − used).** Triangulated 3 ways:
1. **Code**: JSONL parser computes `used = total/max*100` then prints `remaining = 100 − used` (claudeCode:from.jsonl).
2. **Ground truth (self)**: my JSONL total_tokens=336363, max=**1,000,000** (Opus-1M, auto-detected) → used=33.6% → remaining=**66.4** ≈ my read **67.1** ✓.
3. **Fresh agent**: SM reads **100.0** = fresh (0% used) = remaining ✓.
→ **trainer=6.3/5.0 = ~5% REMAINING = NEAR-CLIFF (~95% used), NOT fresh.** RESOLVED. (Flagged SM.)

### AC3 — reliability: **context.read is UNRELIABLE near the cliff — reproducible FALSE-HIGH.**
- Self: stable (67.1 ×2). 
- **trainer: `context.read`=100.0 ×3 (reproducible) while TUI = "Context low (0% remaining)" — a catastrophic FALSE-HIGH (read 100 when actual is 0).** The reading flipped 6.3→5.0→100.0 within ~2 min as the JSONL likely went stale/anomalous at the cliff. **→ TUI status bar (`otmux pane.capture` → "Context low (N% remaining)") is PRIMARY ground truth; context.read is a secondary convenience that lies near limits.** (Matches SM learning "context.read LIES BOTH DIRECTIONS".)
- oosh-po / oosh-expert → **"unknown"** (JSONL stale >600s staleness-guard + no TUI context hint on an idle pane = unmeasurable that moment).
- `max_tokens` auto-detect is correct per-session (1M for Opus-1M self; a 200k mis-detect would have made my remaining read negative — it didn't).

### AC4 — gaps (repro on live mcdonges.latest):
- `otmux pane.self` → **MISSING METHOD** (`this: line 140: pane.self.usage: command not found`). Root of the self-measure auto-detect breakage.
- `claudeCode context.self` → **`no-claude`** (rides the broken pane.self).
- `claudeCode context.all` → **EMPTY**.
- **NEW gap**: `context.read` FALSE-HIGH near the cliff (returns 100.0 at 0% actual) — the parser must cross-check/prefer the TUI "Context low" string, or treat a fresh-100 on a long-lived session as suspect.

### AC5 — the 42 mutual-measurement protocol (for SM every sweep + any peer):
1. **Number**: `claudeCode context.read <pane>` → **% REMAINING** (self: use your OWN explicit pane; do NOT rely on context.self).
2. **ALWAYS cross-check the TUI** (it is ground truth): `otmux pane.capture <pane> 8` → look for `Context low (N% remaining)` or `clear to save Nk tokens`. If context.read and TUI disagree, **trust the TUI**.
3. **Act threshold**: remaining < 20% (= >80% used) → order save+rewind. `unknown` or a suspicious high-jump → capture TUI to confirm (do not assume healthy).
4. **Never** trust a lone context.read number near the cliff — it false-highs (proven: 100.0 vs actual 0%).

**Purify into** `skills/peer-context-measurement.md` (protocol above) + hand to SM sweep + ARON's 42-peer (trainer). **LIVE ALERT**: agent-trainer baseTeam:0.0 is at 0% remaining (TUI) — flagged SM; needs peer/TRON rescue (trainer can't self-rewind).
