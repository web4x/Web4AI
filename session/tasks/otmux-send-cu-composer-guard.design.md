# DESIGN: otmux.send C-u composer-destruction fix + unified send hardening (oosh-architect, 2026-10-12)

**For**: oosh-expert (routed by oosh-po, #1 priority). **Ref bug**: session/bugs/otmux-send-cu-destroys-staged-composer.md (f7c20cd2). **Scope**: DESIGN+REVIEW → tester RED → expert impl → PO gates deployed-green. **Measured**: live mcdonges.latest.

## Rank (both land in ONE otmux.send hardening)
- **#1 — C-u composer DESTRUCTION (active data loss, highest severity).** `otmux.send` fires a blind `C-u` (**measured otmux:2041**, `$TMUX_CMD send-keys -t "$target" C-u`) BEFORE typing on the Claude-target path → **silently erases whatever is staged in the RECEIVER's composer** (confirmed casualty: Tron's "go build increment 4" erased from oopExpert). Silent destruction of another agent's / Tron's work ranks above non-delivery.
- **#2 — submission non-delivery (paste-chip).** The post-type Enter doesn't always submit (the d75b3f72 work). Silent NON-delivery (nothing destroyed, just not sent) — lower severity than #1, still rewind-critical.

## ★ CHOKEPOINT — PINNED (PO-verified on live code, 2026-10-12; supersedes the bug doc)
RESOLVED: the call chain is **`otmux.send` C-u's @2041 → THEN delegates to `send.verified` @2052 → which calls the C-u-FREE `sendEnter` @2076.** So:
- **The destroyer is `otmux.send`** (the smart/DEFAULT verb — and what `hiveMind.agent.send` uses for fleet comms). **`send.verified` called DIRECTLY is already SAFE** (no C-u).
- The 09-28 bug doc's "send.verified inherits C-u" is **BACKWARDS**, and its line (1967) is stale (live = 2041).
- ⇒ **The COMPOSER GUARD goes at `otmux.send`'s C-u chokepoint (2041), BEFORE the C-u/delegate.** `send.verified`/`sendEnter` need no change.
- **Expert FIRST STEP (post-rewind): REPRODUCE on a scratch pane** — `otmux.send` into a staged composer on CURRENT code → confirm the destruction live; confirm `hiveMind.agent.send`'s actual path reaches 2041. Fix the MEASURED current defect; write `T-SEND-COMPOSER-GUARD` to reproduce the ACTUAL destruction (not the stale-doc version).

## The root
The C-u's intent — clear a stale draft before typing so the new message doesn't concatenate — is reasonable but **BLIND**: it cannot tell a discardable stale draft from a PRECIOUS staged message (Tron's directive, a human mid-typing, a peer's queued delivery). A sender must never blind-clear the receiver's composer; the composer's contents are the receiver's state.

## Unified hardening — ONE guarded staging chokepoint (fixes #1 + #2; send.raw STAYS PURE)
Pipeline for `otmux.send` / `send.verified` (the agent-to-agent send):

**STEP 0 — COMPOSER GUARD (the C-u fix, #1):** before any C-u/type, MEASURE the receiver's composer (the SAME bottom-region read the recognizer uses for ON-PROMPT/staged-text — DRY: one composer-emptiness primitive serves both the sweep classifier and this guard).
- **Empty** → proceed; the blind C-u is now UNNECESSARY (nothing to clear on a proven-empty composer) → **drop it**. Type.
- **Non-empty (foreign staged text)** → **REFUSE: abort LOUD, rc=blocked, error NAMES the staged text** — e.g. `otmux.send: REFUSING — <target> composer holds unstaged text: "<staged>" — a send would DESTROY it. Clear it explicitly or use send.clobber.` NEVER C-u, NEVER type. **This is the never-destroy guarantee** (doc option 2: refuse + fail-loud, preferred over capture-restore which can misfire).

**STEP 1 — STAGE (only on proven-empty):** type literally via `sendEnter`'s `-l` (no C-u needed — composer proven empty).

**STEP 2 — SUBMIT + VERIFY (#2) = `send.submit`** (from d75b3f72): verify SUBMISSION (composer cleared / `esc to interrupt` / `queued`), bounded bare-`send.tui Enter` retry, honest rc. Handles the paste-chip. No C-u, no Escape.

So: **guard(0) → stage(1) → send.submit(2)** — one chokepoint that BOTH never-destroys (0) AND verifies-submission (2).

## The override = a VERB, not a flag (no-flag doctrine reconciliation)
The PO's "explicit override flag" → realized as a VERB per Tron's standing no-flag law: **`otmux.send.clobber <target> <text>`** = "explicitly C-u-clear the composer, then send" — the conscious, NAMED override for when the operator KNOWS the composer holds a discardable draft (recovery clearing a ghost). Default `otmux.send` REFUSES on non-empty; `send.clobber` is the opt-in. The name NAMES the hazard (you are clobbering composer content) so it can't be used absent-mindedly. *(If a `--force` flag is genuinely required instead, it conflicts with the no-flag doctrine — I recommend the verb; flag it to Tron if the flag form is wanted.)*

## Coherence with prior rulings (the "reconcile coherently" ask)
- **send.raw STAYS PURE** (standing invariant): never had C-u, never gets the guard — literal keys for picker/rewind.
- **Composer-guard's "non-empty?" = ON-PROMPT/staged-text detection** (team.sweep pane.live). ONE composer-emptiness primitive, two consumers (recognizer classifies ON-PROMPT; send-guard refuses). DRY.
- **STEP 2 = send.submit / the send.verified submission-upgrade** (d75b3f72) — composes in unchanged.
- **§8 drain distinction (ours vs foreign):** a DIRECT `otmux.send` did not stage the composer's current text → foreign → refuse. The QUEUE drain tracks its OWN delivered-staged entries → pokes those via `send.submit` (it owns that text) and does NOT hit the refuse. So refuse is for direct sends; the drain's in-flight text is handled by its own send.submit. Coherent, no conflict.

## Handoff
- **Expert**: place the COMPOSER GUARD at the chokepoint that C-u's (trace it per the discrepancy note); drop the blind C-u on proven-empty; refuse-loud-naming-text on non-empty; add `send.clobber` as the explicit override; keep send.raw pure; STEP 2 = send.submit. Build off the ff-safe base.
- **Tester (scenario-first RED → `T-SEND-COMPOSER-GUARD`)**:
  1. **#1 never-destroy**: stage text in a receiver's composer → `otmux.send` to it → asserts the staged text SURVIVES and the send ABORTS loud (rc=blocked, error names the text). The regression guard for Tron's-message-erased.
  2. **empty-path**: empty composer → send delivers + submits normally (no C-u needed).
  3. **override**: `send.clobber` on a non-empty composer → clears + sends (the sanctioned destructive path).
  4. **#2 submission**: long paste-chip → submits (composer cleared / esc-to-interrupt), bounded retry, honest rc.
  5. **send.raw UNCHANGED**: a picker-nav / literal send through send.raw fires NO C-u and NO extra Enter (picker-safety + no-destroy by construction).
  6. measure destruction/delivery by the receiver-side composer state, not keystroke count.
