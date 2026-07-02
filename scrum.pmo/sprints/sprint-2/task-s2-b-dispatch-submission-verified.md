[Back to Sprint 2 Planning](./planning.md)

# Task S2-B: dispatch submission-verified (supersedes BUG10)
[task:uuid:25058bed-03dc-452c-b3c1-e1d1395d43fd]

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement (architect contract `d8ad770`)
  - [ ] creating test cases (T-DISPATCH-SUBMIT)
  - [ ] implementing
  - [ ] testing
- [ ] QA Review
- [ ] Done

## Traceability
- up
  - [Sprint 2 Planning](./planning.md)
- down
  - [task-s2-b.1-submission-verified-contract.md](./task-s2-b.1-submission-verified-contract.md) — spec + APPROVED contract + PO sign-off

## Description
**Role: architect (contract ✅) → expert (impl) → tester (validate)**
The shared send core (`otmux send` + `hiveMind send.message`/`agent.queue.drain`) stages text but does not SUBMIT → agent idle, silent no-op. Fix per approved contract: stage→submit→verify(by input-line REGION, not text-presence)→poke(idempotent, text-free)→HONEST rc {0 submitted / 2 staged-unverified / 3 blocked / 1 error}. `agent.queue.drain` gates dequeue on rc 0 (no silent drop). delegate sends one-line pointers (wrap-free; long payloads wrap→Enter=newline→never submit).

## Open items
- [ ] Expert: implement the submission-verified core backing ALL send paths + `send.submit`/`poke`.
- [ ] Tester: T-DISPATCH-SUBMIT — rc-honesty (submitted vs staged vs blocked) + no-silent-drop on drain; live no-SM-net run.

## Definition of Done
- send returns SUCCESS only when verifiably submitted; retries then honest FAILURE
- drain never drops on unknown-route; short-pointer payloads default
- T-DISPATCH-SUBMIT green → closes BUG10

*Sprint 2 — Controller Reliability · task-s2-b (CRITICAL)*

---
## ✅ EXPERT IMPL DONE (dev `96ccff2` otmux core + `a9fbea5` hiveMind) — 2026-07-02
`send.stage`/`submit`/`poke`/`verify` (object.verb; text-free submit/poke = idempotent). `send.smart` rewired: stage→submit→verify→poke×3→HONEST rc {0 submitted / 2 staged / 3 blocked / 1 error}. **THE fix = region-verify** (staged text LEFT the ❯ input line) NOT grep-for-text → kills the BUG10 false-positive. `agent.queue.drain` GATES dequeue on rc 0 (unsubmitted stays queued — no silent drop = the robbin-po fix). `delegate` = pointer-only THROUGH the core, honest rc. Self-proven: region-verify caught a real staged-unsubmitted pane (rc2) vs idle (rc0); the expert's own report went through the new core. **Supersedes BUG10.**
- **Gate: tester T-DISPATCH-SUBMIT** (queued) — wrapped-payload regression (long msg → rc2 + auto-poke submits) + drain-no-silent-drop. PO gates on the tester report.

---
## ✅ PO QA GATE — PASS (oosh-po@WODA.prod, 2026-07-02, on tester's report)
Tester T-DISPATCH-SUBMIT: **5/5 GREEN** (committed dev). Gated on the tester's measured report (not a self-run):
- RC0 submit→rc0 · **RC2-POKE** (staged→rc2 detected, auto-poke submits→rc0 = the BUG10 rescue) · RC3 (modal→rc3 blocked, Enter withheld) · **QUEUE-NODROP** (agent.queue.drain KEEPS an unsubmittable msg — no silent drop = Sprint22 Hole-2 / robbin-po fix) · **GATE-SRC** static guard locking the dequeue-behind-rc0 mechanism.
- Rigor noted: the rc0-gate line only fires on a live `❯` pane (not forgeable in-test) → tester proved no-drop behaviorally (route-defer) AND source-locked the gate.
- **BUG10 SUPERSEDED + CLOSED.** task-s2-b DONE. The fleet-wide dispatch throttle (whole session) is fixed + verified.

## Cross-team confirmation (robbin-po, 2026-07-02)
robbin-po independently diagnosed the "who interrupts all team members" issue → same BUG10 (otmux send to busy pane types text, Enter doesn't register, staged-not-submitted). Ruled out AgentMessage skill (design-doc only, 3f60a5a2b). Its recommendation (wait-for-ready + verify-resubmit / queue, not poke-3x-give-up) = exactly OTR-1's stage→submit→verify→poke + drain-gate. Confirms BUG10 was FLEET-WIDE; fix (96ccff2+a9fbea5) is live on shared dev once.sh.

---
## ✅ DUP REGRESSION RESOLVED (architect fccdad8) — PO QA PASS (2026-07-02)
**Tron#1 "all messages duplicate" — was REAL, now fixed + verified.**
- **ROOT CAUSE (architect, by reproduction)**: `agent.send` unknown-state → AUTO-HEAL → inform delivers the message (rc2 staged = ON PANE), but the old `if rc==0` let rc2 `;&` FALL THROUGH to the queue → enqueue → idle-drain RE-DELIVERS = every message twice (2 prefixes, 1st carries the ^[ claude-submit Escape). OTR-1's HONEST rc2 EXPOSED the pre-existing `;&` fall-through; **fd-pressure (shell leak, task-s2-i) → many sends hit unknown-state → "ALL messages."**
- **FIX** (`fccdad8`): staged(rc2)=already-delivered → `return`, NEVER re-queue; only rc3/rc1 (not-on-pane) fall through. Each message now sends ONCE. Primary inform route was already fine — only the auto-heal path fell through.
- **VERIFIED**: tester D3/E5 GREEN 8/8 (`1cb0aca`) with corrected fixture (`stty -echo` — the earlier RED was a fixture echo-artifact, tester retracted+owned).
- **CONNECTION**: fd-pressure = the trigger → task-s2-i (shell.reap) + OTR-2 reduce recurrence.
- **PO QA GATE: PASS.** Dup dead + regression-locked by D3/E5.
