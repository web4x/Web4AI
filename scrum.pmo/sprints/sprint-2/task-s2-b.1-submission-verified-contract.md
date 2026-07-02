> ⬆ **[Sprint 2 · task-s2-b](./task-s2-b-dispatch-submission-verified.md)** — sub-task; back to parent task.

# Improvement: make `hiveMind delegate` the submission-verified, pointer-only dispatch primitive
[task:uuid:31c90e57-96ca-4002-a60a-68650d638195]

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
- Architect (verify-submission contract): **DONE 2026-07-02** — full contract in the ARCHITECT section below. Core: stage→submit→verify→poke→HONEST rc{0 submitted / 2 staged-unverified / 3 blocked / 1 error}; verify by input-line REGION (staged text still on `❯` = not submitted) not text-presence; submit/poke are text-free (idempotent, can't duplicate); backs otmux send + hiveMind send.message + **agent.queue.drain (gates dequeue on rc 0 — no silent drop)** + delegate (pointer-only, ARON#3). Incorporates the escalation's proven mechanism (long payload wraps → first Enter = newline → never submits; short pointers submit). Supersedes BUG 10.
- Expert (impl + DRY core + commit): **DONE — dev `96ccff2` (otmux core) + `a9fbea5` (hiveMind) + `0cc1b9e` (timing).** Implemented `otmux send.stage/submit/poke/verify` (object.verb, text-free submit/poke = idempotent, built on send.raw). Rewired `private.otmux.send.smart` → stage→submit→verify→poke×3→HONEST rc{0 submitted/2 staged-unverified/3 blocked/1 error}. **THE fix = region-verify**: `send.verify` reads the input line (Claude `❯` / bash prompt) — SUBMITTED iff staged text LEFT the ❯ (empty input, or `esc to interrupt` processing); STAGED iff still on ❯; BLOCKED iff overlay/permission marker. NOT text-presence → kills the BUG10 false-positive. `hiveMind agent.queue.drain` now GATES dequeue on rc 0 (unsubmitted STAYS queued — the robbin-po no-silent-drop fix). `delegate` = pointer-only THROUGH the core, honest rc (killed its Hole 1+2 "verify manually"). `agent.inform` already routed through `otmux send` → inherits.
  **LIVE-VERIFIED + 2 findings**: bash e2e → rc0 + command ran; region-verify correctly caught a real staged-unsubmitted pane (ooshTeam:0.4 had `run test.suite run plantuml` on ❯ → rc2) vs idle (rc0) — proving region-detection works. **Finding (fixed `0cc1b9e`)**: a LONG message that WRAPS + verifying too early = a false STAGED read → an unnecessary poke, and poke's Escape would INTERRUPT the just-submitted agent. Bumped settle to 1.3s. **Contract-correct behavior confirmed**: a long wrapping payload returns honest rc2 (staged-unverified), NEVER false rc0 — exactly the failure-prone path the core catches honestly; the ARON#3 pointer-only `delegate` avoids wrapping so the happy path submits by construction. **Supersedes BUG10.** Ready for tester.
- Tester (T-DISPATCH-SUBMIT + live no-SM-net run): **NEXT** — per contract: Claude-normal stage+submit→rc0; wrapped-multiline payload (the BUG10 regression) → honest rc2 (NEVER rc0); blocked/overlay → rc3 + ZERO pokes; idempotency 3 pokes→ONE message; bash→rc0; **drain: submit fails → rc2, message REMAINS queued (no silent drop)**; a staged-unsubmitted prompt must NEVER report rc0.

---
## ★ ESCALATION 2026-06-29 (SM, via robbin-po) — bug confirmed on hiveMind send/drain path; now CRITICAL
**Priority → CRITICAL** (was HIGH). New evidence: `hiveMind send.message` AND `agent.queue.drain` to robbin-po(0.0) deliver text into the input buffer but do NOT submit — sits as unsubmitted `❯ text`, agent idle, never processes → **Sprint22 R22.x blocked, robbin-po effectively unreachable via hiveMind** (and Tron forbids raw-tmux). This is the SAME staging class as my session-long `otmux send` BUG10, proving it's at the SHARED send core, not one method.
- **Scope confirmed**: the submission-verified core must back BOTH `otmux send` and `hiveMind send.message`/`agent.queue.drain` — every controller send path. Add an explicit `send.submit`/`poke <pane>` (sanctioned Enter) too.
- **BUG10 mechanism (proven this session)**: LONG/wrapping messages wrap to multi-line → first Enter = newline → never submits. SHORT one-line pointers submit. So the fix = (1) Enter-after-deliver with submission verify + retry, (2) prefer short-pointer payloads.
- **Immediate workaround (sanctioned)**: `otmux send.raw <pane> Enter` is the OOSH WRAPPER (NOT raw tmux) → allowed → submits staged text. If staged text is long/wrapped and won't submit, clear (Escape→C-u via the wrapper) + re-send SHORT.

---
## ARCHITECT — Verify-Submission Contract (oosh-architect, 2026-07-02)
**Doctrine**: object.verb IS the no-flag principle (stage/submit/poke/verify are verbs); constructor-contract "never silently broken" (no success on unverified). Same DRY-chokepoint family as resolve.target / pane.self / the parity live-reader — ONE core, all consumers inherit.

### Root cause (measured + the escalation's proof)
Current core: `otmux.send` → `private.otmux.send.smart` (otmux:2031) → `otmux.send.verified` (otmux:1828) → `private.otmux.sendEnter` (otmux:2094: text `-l` → Escape(Claude) → Enter). hiveMind `send.message`/`agent.queue.drain`/`delegate` delegate to `otmux send.enter` → inherit its behavior.
- **MECHANISM (escalation-proven):** a LONG payload WRAPS to multiple input lines; the first `Enter` lands mid-multiline-input = a **newline, not a submit** → text sits as unsubmitted `❯ …`, agent idle. SHORT one-line payloads don't wrap → Enter submits. This is why the failure is payload-shape-dependent, not random.
- **4 HOLES in `send.verified`:** (1) verifies text-PRESENCE not SUBMISSION — text on the `❯` input line matches the SAME `grep -qF` as text echoed in the transcript, so staged-not-submitted reports "DELIVERED" (false positive); (2) returns **0 on ambiguity** ("CHANGED / verify manually") → silent success on unsent; (3) asks "did anything change?" (spinner/resize/popup all count) not "did the input line EMPTY?"; (4) poke is ad-hoc inline `send-keys Enter`, re-greps text (Hole 1 again).

### The contract
A send is DONE only when SUBMISSION is VERIFIED. Keys-sent ≠ done; staged (text in input) ≠ submitted (input consumed, message dispatched). Core = `stage → submit → verify → (poke→verify)×N → HONEST rc`.

### Object.verb primitives (no flags; built on the sanctioned `send.raw … Enter`)
- `send.stage <target> <text>` — literal `-l` into the input, no submit.
- `send.submit <target>` — the sanctioned submit sequence (Escape-if-Claude → Enter). **Submit ONLY, never re-stages text** → safe to repeat.
- `send.poke <target>` — a `send.submit` as a retry on a staged-unverified input. Mechanically = submit; verb marks intent.
- `send.verify <target> <text>` — VERIFIED iff confirmed by input-line REGION (below), not text-presence.

### Verification method (the crux — STAGED vs SUBMITTED by REGION, not text-presence)
Capture; locate the input line (Claude: the `❯` line; bash: the shell prompt).
- **SUBMITTED ⟺ the staged text is NO LONGER on the input line** (input empty / fresh prompt / `esc to interrupt` processing-state present). Text may now appear ABOVE (transcript echo) — fine.
- **STAGED-NOT-SUBMITTED ⟺ text still on `❯`** → poke. Note the wrapped-multiline case: text spans several input lines; a bare Enter only adds another newline → poke strategy for a WRAPPED input = Escape (dismiss popup) → Enter; if still staged, **clear (C-u) + re-stage SHORT** (or escalate to pointer-payload, below).
- **BLOCKED ⟺ before==after AND overlay/permission/rewind marker** → do NOT poke (Enter into a dialog = wrong). Route context-aware (overlay→REJECT, rewind→hold rc3).
- **bash** submits reliably: SUBMITTED ⟺ new prompt after the echoed command. Light verify.

### Return contract (distinct, honest — replaces "return 0 / verify manually")
`0` VERIFIED-SUBMITTED · `2` STAGED-UNVERIFIED (in input, unconfirmed after N pokes — staged, NOT lost, NOT confirmed) · `3` BLOCKED (overlay/permission/rewind — queue/reject, don't force) · `1` ERROR (bad target / empty / unreachable).

### Idempotency & safety
- submit/poke send ONLY the submit sequence, NEVER re-stage → N pokes can't duplicate the message (worst case: harmless extra newlines in empty input).
- **Verify BEFORE poke** — poke only when still-staged; never poke a confirmed-submitted (no double-dispatch) nor a blocked pane. Bounded N (default 3); on exhaustion → rc 2, never rc 0.

### Payload-shape complement (ARON #3 — encode the practice in the tool)
The most reliable submit is a payload that never wraps. So the canonical dispatch **`hiveMind delegate`** sends a ONE-LINE pointer `Read session/tasks/<id>.md` (detail in the committed task file) — this is BOTH DRY (ARON #3: tasks = comms base) AND wrap-free (submits first-Enter). The verify-submission core is the safety net; pointer-only payloads make the happy path succeed by construction. Long free-text sends remain supported but are the failure-prone path the core must catch honestly (rc 2), not paper over.

### Integration — backs EVERY controller send path (the chokepoint)
Composes with the existing pipeline: `this.isEmpty` → prefix(Claude) → context-route(idle→deliver / active→queue / overlay→reject / rewind→hold) → **[OTR-1 on deliver: stage→submit→verify→poke→rc]**.
- `otmux send` / `send.enter` → the core.
- `hiveMind send.message` → otmux send → inherits.
- **`hiveMind agent.queue.drain` — CRITICAL: gate DEQUEUE on rc 0.** A drained message that fails to submit (rc 2/3) stays queued — NEVER silently dropped. (This is where Hole 2 does the most damage — robbin-po unreachable, Sprint22 blocked.)
- **`hiveMind delegate`** — writes task file + sends the one-line pointer THROUGH the core + reports rc honestly.

### KEEP vs FIX
KEEP: before/after capture; sendEnter's `-l` + Escape-before-Enter (real submit-reliability measure); Bug#4 target defense; this.isEmpty; the context-route pipeline. FIX: region-verify not text-presence (H1/H3); rc 0/2/3/1 not "verify manually" (H2); first-class text-free submit/poke (H4); drain gates dequeue on rc 0; delegate = pointer-only.

### Test contract — T-DISPATCH-SUBMIT / T-SUBMIT-VERIFIED
- Claude normal: stage+submit → input empties → rc 0.
- Staged-not-submitted (autocomplete popup / **wrapped multi-line**): poke → submits → rc 0; assert text left the input line. Include a LONG wrapping payload as the regression for the proven mechanism.
- Blocked (overlay up): rc 3, **zero pokes** (assert no Enter into dialog).
- Idempotency: 3 pokes on empty input → exactly ONE transcript message.
- bash: submits, prompt returns → rc 0.
- **drain: submit fails → rc 2, message REMAINS queued** (no silent drop).
- Regression (kills H1/H2): a staged-unsubmitted prompt must NEVER report rc 0. Supersedes BUG 10 — close it here when green.

### Handoff
- architect: **DONE**. object.verb-clean, honest rc, region-verify, backs send/message/drain/delegate, pointer-payload complement.
- oosh-expert: implement `send.stage/submit/poke/verify` at the ONE core; rewire `send.smart` → stage→submit→verify→poke→rc{0,2,3,1}; `agent.queue.drain` gates dequeue on rc 0; `delegate` = pointer-only through the core. Commit.
- oosh-tester: T-DISPATCH-SUBMIT per contract (esp. wrapped-payload regression + drain-no-silent-drop + live no-SM-net run).

---
## ✅ PO SIGN-OFF on verify-submission contract (oosh-po@WODA.prod, d8ad770) — APPROVED, ready for expert
Approved — the contract captures every piece of this session's evidence and closes BUG10 at the mechanism, not the symptom:
- **Region-based verify** (staged text on the ❯ input line = NOT submitted) — this IS the fix for the text-presence false-positive that has been BUG10 all session. Correct.
- **Idempotent text-free submit/poke object.verbs** — matches the proven workaround (`otmux send.raw <pane> Enter`); N pokes can't duplicate. Correct.
- **HONEST rc** {0 submitted / 2 staged-unverified / 3 blocked / 1 error} — no more "delivered"-lies.
- **agent.queue.drain gates dequeue on rc 0** — this is the robbin-po-unreachable no-silent-drop fix (ties OTR-1↔OTR-2). Correct.
- **Wrap mechanism + pointer-payload complement** — long payload wraps→1st Enter=newline→never submits; delegate sends one-line pointers (wrap-free + ARON#3 + DRY). Exactly the measured behavior.
- **Supersedes BUG10.** Expert implements against this; tester T-DISPATCH-SUBMIT proves rc-honesty (submitted vs staged vs blocked) + no-silent-drop on drain.
