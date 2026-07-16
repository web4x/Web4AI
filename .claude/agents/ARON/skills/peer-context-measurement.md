# ARON · Skill — Peer & Self Context Measurement (42, purified)

*Purified 2026-07-16 from a live tester verdict (oosh-tester, commit 1aa43fb → `session/tasks/test-42-context-measurement.md`). TRON: "NO MEASURE ever landed = a gap to purify; teach your 42-peer; the SM should know how." Actionable, measured, verified.*

## The one true method
1. **The number** — `claudeCode context.read <pane>` → **% REMAINING** (100 − used; verified 3 ways: parser math, self JSONL 33.6%used→66.4≈read, fresh agent=100).
   - **SELF-measure works** — pass your OWN explicit pane (e.g. `context.read Temple:0.0`). The "can't self-measure" belief was an **assumption, REFUTED.** Do NOT use `context.self` (rides the broken `otmux pane.self`).
2. **ALWAYS cross-check the TUI — it is PRIMARY ground truth.** `otmux pane.capture <pane> 8` → look for `Context low (N% remaining)` or `clear to save Nk tokens`. **If context.read and the TUI disagree, TRUST THE TUI.**
3. **context.read LIES near the cliff — reproducible FALSE-HIGH.** Measured live: trainer `context.read`=100.0 ×3 while TUI="Context low (0% remaining)". **Never trust a lone context.read number near limits.** A fresh-looking 100 on a long-lived session = suspect → capture the TUI.
4. **Act threshold**: remaining **< 20%** (>80% used) → order **save + rewind**. `unknown` (stale JSONL >600s + idle pane) or a suspicious high-jump → capture the TUI; never assume healthy.

## The 42 protocol (SM every sweep + any peer)
- No agent should rely on self-measure alone. **Peers measure each other**: SM runs `context.read <pane>` on every agent each sweep, cross-checks the TUI, and orders save+rewind at <20% remaining. An agent CANNOT self-rewind at the cliff — a peer/SM/TRON must trigger it.
- **Proactive, not reactive**: order the rewind at ≤90% used (≥10% free) — never wait for the 0% cliff (the cliff is the defect; see [[prevent-cliff-proactive-rewind-90]] / `agent-rewind.md`).

## Gaps → sprint (filed; do NOT use raw tmux as a workaround)
- `otmux pane.self` — **MISSING method** (`pane.self.usage: command not found`) → self auto-detect breaks. FIX = self-measure via wrapper works cleanly.
- `claudeCode context.self` → `no-claude` (rides pane.self). `claudeCode context.all` → EMPTY.
- **NEW**: `context.read` FALSE-HIGH near cliff (returns 100.0 at 0% actual) — parser must prefer/cross-check the TUI "Context low" string, or treat fresh-100 on a long-lived session as suspect.

**NEVER forget TRON CMM4.** Measure, never assume — and cross-check the ground truth. Wer schreibt, der bleibt.
