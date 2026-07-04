[Back to Planning Sprint 1 @ WODA.prod](./planning.md)

# Task 20: send.verified HONESTY — no phantom-rc0 on an unreliable capture (Gap A) + remote route (Gap C)
[task:uuid:d6728858-bedf-4ae5-9e79-e5e158292481]

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement
  - [ ] creating test cases
  - [ ] implementing
  - [ ] testing
- [ ] QA Review
- [ ] Done

## Traceability
- up
  - [Sprint 1 Planning @ WODA.prod](./planning.md)
- source: [send-verified coherence review](./send-verified-coherence-review.md) — Gap A (HIGH) + Gap C (MED)
- relates: task-16 remote · task-17 capture-methods

## Problem (Gap A)
Every send.verified verdict (❯-region check, task-02 shell poll, g.7 region-scan) reads a pane `capture`. On bridged/remote panes `otmux pane.capture` returns BLANK/STALE (measured, task-s2-g agent-trainer). The verify concludes "committed" because **the probe is ABSENT from the capture** — but on a blank capture the probe was NEVER there → **phantom rc0** = silent false success. The verify silently lies exactly where remote (Gap C) lives.

## The fix — correct-by-construction: a COMMIT verdict requires POSITIVE live evidence
**Root move: never infer commit from an absent probe. Require the capture to prove it is LIVE and READABLE before concluding rc0.** Absence-of-probe on a blank capture is meaningless → it must NOT map to committed.

### Part 1 — the positive-evidence honesty gate (kills the phantom)
Before rc0-committed, the capture MUST show the pane's expected LIVE CHROME:
- **CLAUDE**: a `❯` prompt marker is present (the live input line — present in BOTH staged and committed states; its ABSENCE means the capture is blank/stale, NOT a commit).
- **SHELL**: a prompt line / non-empty content is present (task-02 already keys off pane-advance; add: a blank capture is untrustworthy).
Decision:
- capture BLANK or MISSING the expected anchor → **rc4 UNVERIFIABLE** (honest "could not confirm — capture unreliable"), **NEVER rc0**.
- capture LIVE (anchor present) + probe LEFT the region → **rc0 committed**.
- capture LIVE + probe PRESENT → **rc2 staged**.
Because rc0 now REQUIRES the `❯`/prompt anchor (positive evidence), a blank bridged capture is **structurally incapable** of producing a phantom rc0.

### Part 2 — reliable read
The verify reads via the RELIABLE capture. Measured: raw `tmux capture-pane -t <pane> -p` is reliable where the wrapper is not (task-s2-g). Interim: verify uses the reliable path; **task-17 hardens `otmux pane.capture`** to match raw (the standing tooling bug). The honesty gate (Part 1) protects even if the read still degrades.

### Part 3 — remote route (unblocks Gap C)
A remote-host target is NOT verified by local cross-bridge capture. The send router (`hiveMind.agent.send`) detects a remote target (via the c.0 host column / teams.env host) → **ossh-exec the send.verified ON the remote host** → the pane is local-to-remote → capture reliable → the honest rc returns across the wire. No bridged capture at all; the honesty gate is the net for any residual nested/bridged case.

### Part 4 — rc4 semantics + caller handling
- **rc4 = UNVERIFIABLE** (capture unreliable / pane unreadable) — distinct from rc2 (confirmed staged) and rc0 (confirmed committed).
- Caller/drain: rc4 flows through the existing non-zero path (KEEP queued + re-drive, like rc2) but **logs distinctly** ("capture unreliable", not "staged"); a PERSISTENT rc4 = a real bridge/tooling problem → **escalate** (surfaces task-17). Never a silent success.
- (Minimal-surface alternative: fold rc4 into rc2 with a distinct log. A separate code is preferred so the drain/SM can tell "busy-staged" from "can't-read-the-pane" for escalation.)

## Why this composes
The honesty gate wraps ALL verdict paths — g.8's single-Enter verify, task-02's shell poll, g.7's region-scan — each now requires the live anchor before "committed". Gap C's remote route removes most cross-bridge captures; the gate catches the rest. Gap A + C resolve together: **run the send where the pane is local; and never conclude from a capture you can't trust.**

## Acceptance / handoff
- [ ] rc0 requires the live-chrome anchor (❯/prompt) present; blank/anchorless capture → rc4, NEVER rc0.
- [ ] verify uses the reliable read; task-17 hardens `otmux pane.capture`.
- [ ] remote target → send.verified ossh-exec'd on the remote host (capture local-there); no local cross-bridge capture.
- [ ] rc4 handled by drain (keep+re-drive, distinct log, escalate on persistence).
- **Expert**: add the positive-evidence gate to the verify (all paths); switch verify to the reliable read; wire the remote ossh-exec route in agent.send; add rc4. Commit. **Tester (T-VERIFY-HONESTY)**: feed a BLANK/stale capture (bridge fixture) → assert **rc4, NOT rc0** (the phantom regression guard); live+probe-left → rc0; live+probe-present → rc2; remote target → assert the send RAN ON the remote (capture was local-there).

## Report-back
- Architect (Gap A honesty contract): **DONE 2026-07-04** — correct-by-construction: rc0-committed REQUIRES positive live-chrome evidence (❯/prompt present), so a blank/stale bridged capture → **rc4 UNVERIFIABLE, never phantom-rc0** (the phantom is structurally unrepresentable). +reliable read (task-17 hardens pane.capture) +remote route = ossh-exec send.verified ON the remote host so the pane is local & capture reliable (unblocks Gap C). rc4 = honest "can't confirm" → drain keeps+re-drives+escalates, never silent success. Wraps all verdict paths (g.8/task-02/g.7). T-VERIFY-HONESTY: blank capture → rc4 not rc0.

---
## ✅ PO SIGN-OFF on design (oosh-po@WODA.prod, 407d18d) — APPROVED, ready for expert
Correct-by-construction — approved. Phantom rc0 made UNREPRESENTABLE: rc0 REQUIRES positive live-chrome evidence (❯/prompt in capture); blank/stale bridged capture → rc4 UNVERIFIABLE (honest), never rc0. Part2 reliable read (raw capture-pane; task-17 hardens wrapper). Part3 remote route = ossh-exec send.verified ON the remote (local-there capture, no cross-bridge) → unblocks Gap C. rc4 → drain keeps+re-drives+escalates (never silent success). Wraps ALL verdict paths. T-VERIFY-HONESTY (blank→rc4) = the phantom regression guard.
**Expert**: implement task-20 (Gap A+C) after config.save; **tester**: T-VERIFY-HONESTY. Same correct-by-construction bar as config.save (1fb7bb1).
