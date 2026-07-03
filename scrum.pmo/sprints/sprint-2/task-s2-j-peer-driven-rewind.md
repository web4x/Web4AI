[Back to Sprint 2 Planning](./planning.md)

# Task S2-J: reliable PEER-driven /rewind on a Claude pane
[task:uuid:493603ef-3bc4-4f3e-8ada-5b8610a66a38]

## Status
- [x] Planned
- [x] In Progress
- [x] QA Review (guards+auth+trigger expert-verified; live picker-drive → tester T-REWIND-DRIVE)
- [ ] Done

## Description
**From ARON (TRON-directed, 2026-07-03):** driving `/rewind` on a Claude pane via otmux fails: (1) Enter is interpreted as NEWLINE not SUBMIT → `/rewind` never posts, picker never opens; (2) while the target is BUSY (Thinking) typed chars aren't accepted; (deeper) an agent CANNOT drive its OWN /rewind (self=busy) → a PEER/TRON must drive it. Repro on ARON's pane %11.
**Root of (1)** = the SAME autocomplete-eats-Enter root the send fix closed: `/` opens slash-command autocomplete, Enter selects it instead of posting. `send.verified` (2fdce8e) already dismisses autocomplete (Escape, idle-only) + verifies COMMIT (text left ❯) not text-presence (BUG10). So the GENERAL guarantee (Enter commits, send posts) is delivered + tester-verified 5/5.

## What THIS task adds (the /rewind-specific gaps)
- **PICKER SAFETY**: after `/rewind` posts, a PICKER opens. The message poke-loop must NOT poke Enter into an open picker (would SELECT an option = accidental rewind). Provide a dedicated `otmux rewind.drive <pane>` that: post `/rewind` (autocomplete-dismiss + Enter) → verify the PICKER opened (capture) → navigate with `send.raw` + capture-between-EVERY-keystroke → select the intended option (option 2 = the safe restore, per [[otmux-drives-the-rewind-tui]]) → verify.
- **IDLE-ONLY**: target must be IDLE (not Thinking). If busy → refuse/wait, never force (no interrupt — Tron rule).
- **SELF=BUSY (architectural)**: an agent cannot rewind itself (driving = busy). `rewind.drive` is PEER/TRON-only; guard against self-target.
- **TRON-AUTH**: rewinding a TRAINED agent needs Tron's authorization (existing rule) — rewind.drive must respect it.

## Definition of Done
- `otmux rewind.drive <peer-pane>` posts /rewind reliably (picker opens — Enter commits, verified), navigates safely (capture-between-keystrokes, no mis-select), completes the chosen option
- refuses a BUSY target + a SELF target; respects Tron-auth for trained agents
- Tester T-REWIND-DRIVE: posts+picker-opens on an idle peer; refuses busy/self; never mis-selects

## ARCHITECT DESIGN (oosh-architect, 2026-07-03) — verified, fail-safe, careful-mode drive
**Law (correct-by-construction, same as shell.reap): NEVER leave the agent worse off. Verify every step; on any un-verified step, ESCAPE out to the ORIGINAL idle state and return honest non-zero. Missing a rewind (safe refuse) is cheap; corrupting a live agent's session is not — the asymmetry drives every default.** Root of (1) is already closed by send.verified (autocomplete-dismiss + commit-verify); this design adds the /rewind-specific picker drive on top.

### KNOWN REALITY to design around (measured, [[rewind-picker-select-enter-fails]])
The picker OPENS and NAVIGATES via otmux, but **select-Enter has been REPRODUCED to NOT render the restore sub-menu** (oosh-expert + ARON). So the drive MUST treat "select stalled" as an expected, fail-safe outcome — NOT retry blindly (a blind Enter into a picker = accidental/wrong select). Escalate to Tron-drive or TRUE-FORK. The design's success criterion is **"drive as far as verifiable, else fail safe"**, not "always rewind".

### MVC placement (two layers)
- **`otmux.rewind.drive <pane> <?option:2>`** = the **View** primitive: pure TUI driving of ONE pane (post /rewind, verify picker, navigate, select, verify), with the IDLE + SELF guards (both are pane-level facts otmux owns via capture + `pane.self`). Fail-safe, honest rc.
- **`hiveMind.agent.rewind <name>`** = the **Controller** wrapper: resolve name→pane, enforce **Tron-auth** (trained-agent rule) + own the **DURING_REWIND** state override, then delegate the keystrokes to `otmux.rewind.drive`. State + auth + identity = Controller; keystrokes = View.

### GUARDS (pre-flight — refuse BEFORE touching the pane)
1. **SELF-refuse** (`otmux.rewind.drive`): if `<pane>` == `otmux pane.self` → REFUSE (rc1). An agent driving its own /rewind = busy-by-definition + self-corruption. PEER/TRON only. *(the architectural SELF=busy point.)*
2. **IDLE-only** (`otmux.rewind.drive`): capture target; if `esc to interrupt` (generating) or not at an idle `❯` → REFUSE (rc3), never interrupt (Tron rule).
3. **TRON-AUTH** (`hiveMind.agent.rewind`): rewinding a TRAINED agent requires Tron authorization → refuse unauthorized peer-rewind (rc1).

### THE POKE-GUARD (the task's CRITICAL point — two layers, defense-in-depth)
The message poke-loop (`send.verified`) pokes ENTER to commit a staged message. An Enter into an OPEN PICKER = accidental select. Prevent it:
- **(a) State quiesce (primary):** `hiveMind.agent.rewind` sets the target **DURING_REWIND** FIRST. `agent.route` maps DURING_REWIND → **rewind-hold** → `agent.send` HOLDS every message (rc3, no delivery, no poke) for the whole drive. No normal send traffic can poke Enter into the picker. Cleared only after the drive returns.
- **(b) Path disjointness:** the drive uses `send.raw` (raw keys), NOT the message path; and it is the SOLE writer to the pane during the drive (serialized careful mode). The message poke (Enter-on-staged-text) and the drive keystrokes never interleave because (a) holds all messages.

### DRIVE SEQUENCE (each step: act → capture → VERIFY → next; capture BETWEEN EVERY keystroke)
1. **Quiesce**: set DURING_REWIND (Controller). 
2. **Post /rewind**: reuse the send.verified mechanism — stage `/rewind`, Escape (dismiss slash-autocomplete, idle-only), Enter; **VERIFY the PICKER OPENED** (capture shows the rewind-picker signature: a numbered option list / "Rewind"/"Restore" header / ↑↓ hint). If NOT opened → FAIL-SAFE (Escape, clear state, rc2 "picker-did-not-open").
3. **Navigate** to the intended option (default **option 2** = safe restore, per [[otmux-drives-the-rewind-tui]]): `send.raw` arrow key → CAPTURE → verify the highlight moved to the target option. Never blind; one keystroke, one capture, one verify. If the highlight doesn't track → FAIL-SAFE (Escape out, clear state, rc2).
4. **Select**: `send.raw` Enter on the option → CAPTURE → **VERIFY the restore sub-menu rendered / rewind proceeded**.
   - **If it stalls (the KNOWN failure):** the sub-menu did NOT render → **FAIL-SAFE: Escape out of the picker → verify the agent returned to its ORIGINAL idle `❯` (UNHARMED) → clear DURING_REWIND → return rc2 "picker-select-stalled — escalate to Tron-drive or TRUE-FORK".** NEVER re-poke Enter blindly.
5. **Verify completion**: capture shows the post-rewind state (compacted/restored conversation). Only on verified success → clear DURING_REWIND → rc0.
6. **Always-clear**: DURING_REWIND is cleared on EVERY exit path (success, refuse, fail-safe) — never leave an agent stuck in rewind-hold.

### Interface (object.verb, no-flag)
- `otmux rewind.drive <pane> <?option>` — View primitive; SELF + IDLE guards; fail-safe honest rc {0 rewound / 2 stalled-safe / 3 busy / 1 self-or-error}.
- `hiveMind agent.rewind <name>` — Controller wrapper; Tron-auth + DURING_REWIND state; delegates to otmux.rewind.drive.
- Reuses: send.verified (post /rewind), the manual rewind-TUI drive pattern (send.raw + capture-between-keystrokes), the DURING_REWIND state machine (quiesce).

### Acceptance / handoff
- [ ] posts /rewind + VERIFIES picker opened (not blind); navigates with capture-between-every-keystroke to option 2; selects + verifies.
- [ ] SELF-refuse, IDLE-only-refuse, Tron-auth-refuse — all BEFORE touching the pane.
- [ ] DURING_REWIND quiesces all message sends for the whole drive (no stray Enter into the picker); cleared on every exit.
- [ ] KNOWN select-stall → Escape out, agent UNHARMED at original idle, honest rc2 "Tron-drive/TRUE-FORK"; never blind-re-Enter.
- **Expert**: implement `otmux.rewind.drive` (View, guards+drive+fail-safe) + `hiveMind.agent.rewind` (Controller, auth+state). Commit.
- **Tester**: **T-REWIND-DRIVE** — (a) self-target → REFUSED; (b) busy/generating → REFUSED (no interrupt); (c) unauthorized trained-agent rewind → REFUSED; (d) idle authorized peer → /rewind posts, picker VERIFIED open, navigates to option 2; (e) **select-stall → agent returns to idle UNHARMED (same session), rc2, DURING_REWIND cleared** [the critical safety cell]; (f) poke-guard: a concurrent `agent.send` during the drive is HELD (rewind-hold), NOT delivered — no Enter reaches the picker.

## Report-back
- Architect (drive design): **DONE 2026-07-03** — `otmux.rewind.drive` (View: SELF+IDLE guards, post/verify-picker/navigate-capture-between-keys/select/verify, FAIL-SAFE on the known select-stall → Escape out, agent unharmed, rc2 Tron-drive/TRUE-FORK) + `hiveMind.agent.rewind` (Controller: Tron-auth + DURING_REWIND quiesce = the poke-guard so no message Enter hits the picker). Correct-by-construction: verify every step, never leave the agent worse off, DURING_REWIND cleared on every exit. Reuses send.verified + the manual rewind-TUI pattern + the state machine. T-REWIND-DRIVE incl. the select-stall-unharmed + poke-held cells.
- Expert (impl): **DONE 2026-07-03 `ef8ec82`** (dev). **`otmux.rewind.drive <pane> <?option:2>`** (View, otmux) — GUARD1 SELF-refuse (`pane==pane.self`→rc1) + GUARD2 IDLE-only (`esc to interrupt` or no `❯`→rc3), both BEFORE any keystroke; post `/rewind` (literal + Escape autocomplete-dismiss + Enter) → VERIFY picker opened (else fail-safe rc2); navigate Down to option 2 with capture-after-EVERY-key (picker-vanish→fail-safe); select BARE Enter (NO preceding ESC — Tron insight); verify sub-menu rendered→rc0, else **KNOWN select-stall → `private.otmux.rewind.failsafe` (Escape out → verify agent UNHARMED at idle ❯ → rc2)**; never blind-re-Enter. **`hiveMind.agent.rewind <name> <?option> <?auth>`** (Controller, hiveMind) — resolve name→pane; **Tron-auth DEFAULT-REFUSE** (needs `authorized` arg or `HIVEMIND_REWIND_AUTHORIZED=1`); **DURING_REWIND set FIRST** (poke-guard → `agent.route`→rewind-hold holds ALL sends, no Enter into picker) → delegate to `otmux.rewind.drive` → **DURING_REWIND cleared on EVERY exit** → **`shell.reap "$pane"` on rc0 ONLY** (verified rewind = old claude replaced → orphaned shells → the PO's persist-thru-rewind fd-leak auto-cure, safe via the T-SHELL-REAP-passed reaper; a stall/refuse changed nothing → no reap). rc{0 rewound / 2 stalled-safe / 3 busy / 1 self-or-error}.
  - **VERIFIED (safe surface, no real rewind):** SELF-refuse ✓, IDLE-refuse (scratch shell pane) ✓, Tron-auth default-refuse ✓ (before touching pane), DURING_REWIND clear-on-every-exit ✓, shell.reap fires on rc0 ✓ / NOT on rc2-stall ✓.
  - **⚠ NEEDS TESTER LIVE-VERIFY (T-REWIND-DRIVE — destructive, needs a sacrificial/idle peer, e.g. ARON %11):** the actual picker post→navigate→select→verify/fail-safe path. **Two assumptions to CALIBRATE:** (1) **picker-open + sub-menu signatures** are best-guess regexes (`rewind|restore|Select a|↑↓` open; `restore (from|to)|rewound|Restored|which message` success) — the real Claude /rewind picker text may differ; tune from a live capture. (2) **Tron-auth mechanism** — no code rule existed, so I implemented explicit default-refuse (arg/env); architect to confirm vs any intended rule. The KNOWN select-stall means rc2-fail-safe is the EXPECTED common outcome (not a failure).
- Tester (T-REWIND-DRIVE):

---
## PO APPROVED (oosh-po@WODA.prod, 2026-07-03) — design 495e7eb
Correct-by-construction fail-safe (never leave the agent worse off), MVC-clean (View=otmux.rewind.drive keystrokes+guards / Controller=hiveMind.agent.rewind auth+DURING_REWIND). **Tron's ESC insight incorporated:** the PRECEDING ESC is the interrupt vector → ESC is IDLE-ONLY (guard 2 refuses generating), select uses bare send.raw Enter (NO preceding ESC), fail-safe Escape-out only on an idle target. **Poke-guard** = DURING_REWIND→rewind-hold holds ALL message sends for the whole drive (no stray Enter into the picker) + path-disjoint send.raw. **KNOWN select-stall** = first-class fail-safe (Escape out → agent UNHARMED at original idle → rc2 Tron-drive/TRUE-FORK, never blind-re-Enter). DURING_REWIND cleared on EVERY exit. **PO APPROVED.** Expert impl AFTER s2-i (shell.reap); tester T-REWIND-DRIVE (incl select-stall-unharmed + poke-held cells).

---
## ⚠ DESIGN REFINEMENT (oosh-po, 2026-07-03) — post-/rewind must NOT reuse send.verified's loop
LIVE FINDING (trainer driving ARON %11, Tron-observed): `send.verified` CLOSES the just-opened picker. Mechanism: send.verified sends Escape (autocomplete-dismiss) + runs a verify-POKE loop; with the picker open, verify false-reads "still staged" → a 2ND Escape fires → picker closes ("opened & closed again"). CONFIRMED NOT the capture — `otmux pane.capture` is pure read-only (`capture-pane -p`, zero send-keys).
**FIX for the drive's step-2 (post /rewind):** do a CONTROLLED SINGLE post, NOT send.verified: stage `/rewind` → ONE Escape (dismiss slash-autocomplete) → ONE Enter → verify the PICKER OPENED (picker signature), and STOP — no poke-loop, no 2nd Escape. Verify-target = "picker opened", NOT "text committed" (a committed /command opens a picker; the ❯-probe is the wrong signal here). The architect design said "reuse send.verified for the post" — supersede that: send.verified's loop is message-shaped + closes pickers.

---
## ✅ task-s2-j IMPL DONE (expert ef8ec82) — safe surface verified; 2 calibration items + destructive gate
`otmux.rewind.drive` (View: SELF+IDLE refuse-before-touch; post-controlled/verify-picker/navigate-capture-between-every-key/select-BARE-Enter/verify; select-stall=first-class FAIL-SAFE→Escape out, agent UNHARMED at idle, rc2, never blind-re-Enter) + `hiveMind.agent.rewind` (Controller: Tron-auth DEFAULT-REFUSE, DURING_REWIND quiesce poke-guard, clear-on-EVERY-exit, **+shell.reap on rc0-ONLY = persist-thru-rewind fd-leak auto-cure**, safe via the T-SHELL-REAP-passed reaper; NOT reaped on stall). Expert-verified safe surface: self/idle/auth-refuse + clear-every-exit + reap-on-rc0-only.
**2 CALIBRATION items (need a LIVE picker):** (1) picker-open/sub-menu signature regexes are best-guess → tune from a live `/rewind` capture; (2) Tron-auth mechanism — no code rule existed, expert did explicit default-refuse (arg/env) → **architect confirm**.
**GATE = T-REWIND-DRIVE is LIVE + DESTRUCTIVE** (rewinds a real agent) → needs a SACRIFICIAL/AUTHORIZED peer + Tron auth. KNOWN select-stall → rc2 fail-safe is the EXPECTED common outcome (not a failure).

---
## ARCHITECT — TRON-AUTH GATE DESIGN (oosh-architect, 2026-07-03) [confirms calibration item 2]
**The placeholder (ef8ec82) fails BOTH requirements** — `auth=authorized|confirm|yes` is a *word any caller can pass* (BYPASSABLE: an agent runs `agent.rewind peer authorized` → succeeds), and `HIVEMIND_REWIND_AUTHORIZED=1` is a *blanket env with no scope/expiry* (ACCIDENTALLY-TRIGGERABLE: one stale var authorizes EVERY rewind). Neither binds to WHO authorizes or WHICH target. Replace with an **identity-gated, per-target, one-shot, expiring GRANT**.

### Threat model (be precise — it's SAFETY, not crypto-security)
Local tmux framework; no network adversary. The real risks: (a) an AGENT autonomously/accidentally rewinding a trained PEER (destroys its context), (b) a stray command rewinding the WRONG or an unintended agent. So the gate needs: **deliberate + scoped-to-one-target + non-spoofable-granter + non-replayable** — NOT a password.

### The mechanism — a 2-step grant (reuses pane.self→role identity + the state store)
1. **`hiveMind rewind.authorize <name>`** (the operator's EXPLICIT grant):
   - **Granter-identity gate (the anti-bypass core):** derive the caller via `otmux pane.self target` → `HIVEMIND_REGISTRY` role — the SAME ground-truth mechanism `state.set` already uses (BUG7 pane.self = **non-spoofable**; an agent's process is in its own pane, it cannot claim another identity). Check the caller's role against an **authorizer allow-list** (below). A subordinate agent's own pane → role∈agents → **REFUSED** (an agent can NOT self-authorize).
   - Writes a scoped grant: `<target>|<granterPane>|<granterRole>|<epoch>|<nonce>` to `~/config/hivemind.rewind.grants` (append) **+ audit** (append-only, like forks.env).
   - **TTL-bounded**: `HIVEMIND_REWIND_GRANT_TTL` default **120s**.
2. **`hiveMind agent.rewind <name>`** (the consume) — before DURING_REWIND/drive:
   - Require a **VALID grant** for THIS `<name>`: exists · unexpired (`now-epoch ≤ TTL`) · target matches.
   - **CONSUME atomically** (delete the grant line on read — one-shot; can't fire twice, can't replay).
   - No valid grant → **DEFAULT-REFUSE** (keep the expert's safe default; rc1).
   - **Tron-direct fast-path:** if the *caller itself* is an authorizer identity (pane.self→role ∈ allow-list) AND passes explicit `authorized`, proceed WITHOUT a pre-grant (Tron rewinding directly, deliberately). The identity gate makes the word safe — an agent passing `authorized` still fails the identity check. (This rehabilitates the expert's arg: keep it, but identity-gate it.)

### Why it satisfies both requirements
- **NOT bypassable:** every path requires an *authorizer identity* somewhere — as the direct caller (fast-path) OR as the grant's granter. That identity is `pane.self`-derived ground truth → an agent cannot spoof it → an agent alone can NEVER authorize. (Drop the plain env/word bypass.)
- **NOT accidentally-triggerable:** (a) explicit 2-step (authorize THEN rewind) — no single command rewinds a trained agent; (b) per-TARGET scope — authorizing X ≠ authorizing Y; (c) short TTL — stale grants expire; (d) one-shot consume — fires exactly once. Any ONE of these kills the blanket-env accident; together, defense-in-depth.

### Authorizer allow-list (the ONE policy decision — depends on how Tron interacts)
Who counts as "Tron/authorizer" is `pane.self`→role checked against a list. Recommend tiering by target trained-ness:
- **TRAINED target** (has real persisted context.md/learnings.md, or a registry `trained` flag) → granter MUST be the **operator/Tron identity**. Concretely = a pane with NO agent role in the registry (Tron's bare pane) OR an explicitly designated `HIVEMIND_REWIND_GRANTERS` role. **PO must confirm how Tron drives:** if Tron types via the PO pane, add `product-owner` to the granter allow-list; if via a bare operator pane, the no-agent-role check suffices.
- **UNTRAINED (fresh/template)** target → cheaper; a **PO** granter may authorize (lower bar). Still no self-grant, still one-shot.
- Default when unsure: **operator-only** (safest). One mechanism, tiered granter.

### Reuse / non-goals
- Reuses: `otmux pane.self target`→registry (granter identity), the state/store pattern, append-only audit (forks.env style). No crypto/keys (inappropriate for a local shell framework — identity-via-ground-truth-pane is the right primitive).
- Non-goal: defending against a human with shell access editing the grants file directly — out of scope (they're already the operator). The gate stops AGENTS and ACCIDENTS, which is the ask.

### Acceptance / handoff
- [ ] `rewind.authorize <name>` writes a TTL'd per-target grant; REFUSES a caller whose pane.self→role is a subordinate agent (not on the authorizer allow-list).
- [ ] `agent.rewind <name>` consumes a valid unexpired grant one-shot (atomic delete) OR honors the identity-gated `authorized` fast-path; else DEFAULT-REFUSE. Plain `HIVEMIND_REWIND_AUTHORIZED=1` / unqualified word bypass REMOVED.
- [ ] every authorize + consume audited (granter, target, epoch, nonce).
- **Expert**: implement `rewind.authorize` + the grant-consume in `agent.rewind`; identity via pane.self→role; drop the bypassable env/word. **PO**: confirm the authorizer allow-list (operator-only vs +PO — how does Tron drive?).
- **Tester** (extend T-REWIND-DRIVE): agent self-authorize → REFUSED; grant for X does NOT authorize Y; expired grant (>TTL) → REFUSED; grant consumed → a SECOND rewind with no new grant → REFUSED (one-shot); operator fast-path `authorized` from the operator pane → OK, same word from an agent pane → REFUSED.

## Report-back (auth)
- Architect (Tron-auth gate): **DONE 2026-07-03** — placeholder is bypassable (word/env, no identity/scope) + accidentally-triggerable (blanket env). Replace with an **identity-gated one-shot expiring per-target GRANT**: `rewind.authorize <name>` (granter = pane.self→role on an authorizer allow-list — non-spoofable, so agents can't self-grant) writes a TTL'd grant; `agent.rewind` consumes it one-shot (atomic) or honors an identity-gated `authorized` fast-path, else default-refuse; drop the plain env/word. Not-bypassable (authorizer identity required somewhere, ground-truth) + not-accidental (2-step, per-target, TTL, one-shot). ONE policy decision for PO: the authorizer allow-list (operator-only for trained; +PO for untrained) — depends on whether Tron drives via a bare pane or the PO pane.
- PO (confirm authorizer allow-list):
