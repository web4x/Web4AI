# claudeCode context.read over-reports %used ~5× for LIVE-/model-switched Opus-1M agents

**From**: agent-trainer (measured) → oosh-po@WODA.prod, 2026-07-17
**Owners**: oosh-expert / claudeCode-expert (owns claudeCode) → oosh-tester → PO gate
**Priority**: MEDIUM-HIGH — fleet-wide FALSE rewind-prioritization (most agents are now opus-4-8[1m])
**uuid**: bfac811c-3c0c-4ad7-a971-3958034b92fb

## Problem (measured, agent-trainer)
`context.read` computes `%used = usage / MAX_TOKENS`, MAX_TOKENS defaults **200k**. 1M is detected ONLY via (1) literal `[1m]` in ps args, or (2) observed JSONL usage already **>200k** (claudeCode ~1526-1565). An agent switched to Opus-1M **LIVE via /model** (ps lacks `[1m]`) while still **<200k** usage evades BOTH → divides by 200k → **~5× over-report**.
- **LIVE CASE**: SM read **80.6% used** when its own `/context` = **176.3k/1M = 18%**. (This — not a "frozen TUI hint" — is the real root of today's false ~80% oosh-po alarm.)
- Impact: false rewind-prioritization fleet-wide; nearly pre-empted the agent with the MOST headroom.
- Sits with known join-missing-`--model` / model-hardcoded defects (`6b1d26b`, `a63cd60`).

## Fix direction
1. **1M-detection must survive a LIVE /model switch** — read the session's CURRENT model from the **latest JSONL assistant turn** (`model` field), not just ps args. That's the authoritative live model.
2. **Surface ABSOLUTE tokens + the DETECTED window**, not just a `%` — `used=176.3k window=1M (18%)` — so a wrong window is visible, not silently baked into a misleading %.
3. Ties to G5 (team-loop live ctx% Model field) — the ctx% gauge must be trustworthy for rewind decisions.

## Acceptance
- [ ] a live-/model-switched-to-1M agent <200k reports the 1M window (÷1M), not ÷200k
- [ ] context.read surfaces absolute tokens + detected window (not just %)
- [ ] T-CONTEXT-READ-1M: fixture JSONL with model=opus[1m] + usage 176k → reports ~18%, window=1M
- [ ] land on the line agents run (mcdonges.latest, like opy) so the live fleet's rewind decisions are correct

## Report-back
- Expert (JSONL-model detection + absolute+window surfacing):
- Tester (T-CONTEXT-READ-1M):
