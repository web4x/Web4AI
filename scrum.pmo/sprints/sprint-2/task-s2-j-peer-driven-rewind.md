[Back to Sprint 2 Planning](./planning.md)

# Task S2-J: reliable PEER-driven /rewind on a Claude pane
[task:uuid:493603ef-3bc4-4f3e-8ada-5b8610a66a38]

## Status
- [x] Planned
- [ ] In Progress
- [ ] QA Review
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
- Expert (impl):
- Tester (T-REWIND-DRIVE):

---
## PO APPROVED (oosh-po@WODA.prod, 2026-07-03) — design 495e7eb
Correct-by-construction fail-safe (never leave the agent worse off), MVC-clean (View=otmux.rewind.drive keystrokes+guards / Controller=hiveMind.agent.rewind auth+DURING_REWIND). **Tron's ESC insight incorporated:** the PRECEDING ESC is the interrupt vector → ESC is IDLE-ONLY (guard 2 refuses generating), select uses bare send.raw Enter (NO preceding ESC), fail-safe Escape-out only on an idle target. **Poke-guard** = DURING_REWIND→rewind-hold holds ALL message sends for the whole drive (no stray Enter into the picker) + path-disjoint send.raw. **KNOWN select-stall** = first-class fail-safe (Escape out → agent UNHARMED at original idle → rc2 Tron-drive/TRUE-FORK, never blind-re-Enter). DURING_REWIND cleared on EVERY exit. **PO APPROVED.** Expert impl AFTER s2-i (shell.reap); tester T-REWIND-DRIVE (incl select-stall-unharmed + poke-held cells).
