# Improvement: make `hiveMind delegate` the submission-verified, pointer-only dispatch primitive

**From**: oosh-po (ARON hourly CMM4 — brainstorm ONE improvement, build-up in love)
**Owner**: oosh-architect (design verify-submission contract) → oosh-expert (impl) → oosh-tester (verify)
**Priority**: HIGH — every cross-agent comm depends on it
**Status**: PLAN
**Date**: 2026-06-28

## The build-up (why this, with love)
Two doctrines keep getting violated by ME, not by malice but because they rely on discipline instead of tooling:
- ARON #3: **tasks = base of ALL comms; the wire carries a ONE-LINE pointer.** I keep inlining full specs into `agent.send` (BUG7 site list, NP-1 design) — duplicates the task file, garbles, costs.
- BUG 10: `send.verified` is a FALSE POSITIVE — confirms text *present*, not *submitted*. My dispatches sat unsent 4× this session; SM was the safety net.

**CMM4 = encode the practice in the tool.** A discipline that depends on remembering is CMM2. Make the canonical dispatch verb DO the right thing, so doing it right is the path of least resistance.

## The improvement
Harden `hiveMind delegate` (already: writes task file + sends `Read session/tasks/<id>.md` + checks landed) into the ONE reliable dispatch primitive:

1. **Pointer-only on the wire** — message is ONLY `Read session/tasks/<id>.md` (+ optional 1-line report-back reminder). Detail lives in the committed task file. (Enforces ARON #3; also far more likely to submit than a multi-line block — helps BUG 10.)
2. **Verify SUBMISSION, not text-presence** — after sending Enter, confirm the pane entered a processing/submitted state (e.g. `esc to interrupt` appears OR input line cleared), not merely that the text echoed.
3. **Retry + honest result** — if not submitted, `send.raw <pane> Enter` up to N times; if still unsubmitted, return FAILURE (non-zero) — never report "delivered" on an unsent message.
4. **DRY** — `hiveMind.send.message` / `agent.send` route through the same submission-verified core; one place owns "did it actually submit."

## Acceptance
- [ ] `hiveMind delegate <agent> <taskfile>` sends ONLY a one-line pointer; detail stays in the file
- [ ] returns SUCCESS only when the pane is verifiably submitted (processing state), FAILURE otherwise
- [ ] auto-retries Enter before reporting FAILURE
- [ ] `agent.send`/`send.message` share the submission-verified core (DRY — one verifier)
- [ ] T-DISPATCH-SUBMIT: send to a pane, assert SUCCESS only when submitted; simulate stuck-Enter → assert retry then FAILURE (not false success)
- [ ] Supersedes BUG 10 (clean-boot-bugs-woda-prod.md) — link + close it here when green

## PDCA
- Plan: this spec. Do: architect contract → expert impl. Check: T-DISPATCH-SUBMIT + a live dispatch with no SM safety-net catches zero unsent. Act: if Enter still races, add the root-cause delay/handshake.

## Report-back (edit here)
- Architect (verify-submission contract):
- Expert (impl + DRY core + commit):
- Tester (T-DISPATCH-SUBMIT + live no-SM-net run):

---
## ★ ESCALATION 2026-06-29 (SM, via robbin-po) — bug confirmed on hiveMind send/drain path; now CRITICAL
**Priority → CRITICAL** (was HIGH). New evidence: `hiveMind send.message` AND `agent.queue.drain` to robbin-po(0.0) deliver text into the input buffer but do NOT submit — sits as unsubmitted `❯ text`, agent idle, never processes → **Sprint22 R22.x blocked, robbin-po effectively unreachable via hiveMind** (and Tron forbids raw-tmux). This is the SAME staging class as my session-long `otmux send` BUG10, proving it's at the SHARED send core, not one method.
- **Scope confirmed**: the submission-verified core must back BOTH `otmux send` and `hiveMind send.message`/`agent.queue.drain` — every controller send path. Add an explicit `send.submit`/`poke <pane>` (sanctioned Enter) too.
- **BUG10 mechanism (proven this session)**: LONG/wrapping messages wrap to multi-line → first Enter = newline → never submits. SHORT one-line pointers submit. So the fix = (1) Enter-after-deliver with submission verify + retry, (2) prefer short-pointer payloads.
- **Immediate workaround (sanctioned)**: `otmux send.raw <pane> Enter` is the OOSH WRAPPER (NOT raw tmux) → allowed → submits staged text. If staged text is long/wrapped and won't submit, clear (Escape→C-u via the wrapper) + re-send SHORT.
