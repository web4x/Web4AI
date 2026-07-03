> ⬆ **[Sprint 2 · task-s2-g](./task-s2-g-otmux-send-reliability.md)** — sub-task; back to parent task.

# Task S2-G.6: COHERENCE REVIEW — send.verified self-heal (2fdce8e)

**Role**: architect (review, NO impl) → PO gates follow-up. **Reviewed**: `otmux.send.verified` (otmux:1829) + `send.smart` delegation + hiveMind rc2 chain, at commit 2fdce8e (tester 5/5). Measured, not assumed.

## Verdict: mostly coherent — **1 HIGH + 1 MEDIUM + 2 LOW real gaps**; rc2-chain + MVC are CLEAN.

### 🔴 HIGH — (4) wrap/probe: the last-24-char probe can FALSE-POSITIVE "committed" for a LONG message
`send.verified` verifies commit by: `probe="${text: -24}"` (last 24 chars) must have LEFT `capture-pane | grep -F '❯' | tail -1` (the `❯` input row). **Failure mode:** if Claude's input box WRAPS a long line to continuation rows (which carry NO `❯`), the `❯` row holds only the HEAD of the text — the last-24 probe lives on a wrapped continuation row. So `grep '❯' | tail -1` never contains the probe **whether staged or committed** → verify returns rc0 "committed" on poke 1 **even while the text is still staged** = the exact BUG10 silent-loss this commit exists to kill, for exactly the long-message case.
- **Conditional**: holds IFF the TUI WRAPS long input. If it instead HORIZONTAL-SCROLLS to the cursor (tail visible on the `❯` row), the probe works. **Confirm empirically** (send a >120-char message to a real claude pane, watch the input box).
- **Fix direction** (if wrap confirmed): probe the **HEAD** (`${text:0:24}` — always on the `❯` row) instead of the tail, OR scan the whole input REGION (from the `❯` row down to the input-box separator), not just `tail -1` of the `❯` row.

### 🟡 MEDIUM — (2) remote: send.verified is LOCAL-tmux ONLY; a cross-host target verifies the WRONG pane
`$TMUX_CMD send-keys`/`capture-pane` are the LOCAL tmux (0 ossh/remote refs in the function). A remote pane (another host's tmux) is invisible locally → if a `session:win.pane` target is passed **directly** to local send.verified: send-keys/capture hit a LOCAL same-named pane (wrong pane) or a dead one, and the no-`❯` capture returns empty → probe absent → **false rc0 "committed"**. Coherent ONLY if remote delivery runs send.verified **ON the remote host** (`ossh exec <host> "otmux send …"`, the c.0 self-similar pattern). **Confirm**: no caller (hiveMind.agent.send remote route / task.delegate) passes a remote pane target to the LOCAL send.verified.

### 🟢 LOW — (1) shell recipients: Escape correctly gated OFF; but verify is VACUOUS (always rc0)
Escape is `isClaude`-gated (1873) → a shell/ssh recipient gets NO Escape (the g.1 hazard is preserved even though send.smart's explicit non-claude branch was folded into send.verified's internal gate — coherence-positive). **But** a shell has no `❯` → `grep '❯'` empty → probe never found → **unconditional rc0** regardless of whether the command actually dispatched. Practically OK (shell Enter is reliable, no autocomplete), but the "verify delivery" contract is not actually met for non-`❯` panes — a genuinely-failed shell dispatch reports success. Optional: for `!isClaude`, verify via a light shell signal (fresh prompt) or document that shell verify is best-effort.

### 🟢 LOW — (5) C-u vs a partially-staged prior input
`send-keys C-u` (1861) clears ONE readline line. A prior MULTILINE staged input (wrapped/multiline staged message left by a previous rc2) is not fully cleared → the new text prepends the residue → **corrupted commit**. Narrow (needs a multiline prior stage). Single-line stale input is cleared fine. (Queue integrity is safe — a prior rc2 message stays queued and re-drains; this is only the on-screen buffer.)

### ✅ CLEAN — (3) rc2-STAGED exhaustion propagation
Traced end-to-end: `send.verified` returns 2 → `send.smart` `return $?` → `agent.inform` `return $?` → `agent.send` primary inform returns `$rc` (no fall-through) AND auto-heal inform returns rc2 without re-queue (my fccdad8 dup-fix) → `agent.queue.drain` gates DEQUEUE on rc0, keeps rc2 queued + stops the drain (a420664). **No silent drop, no re-loop, no dup.** Coherent.

### ✅ CLEAN — MVC fit
send.verified is pure **View**: capture-pane + send-keys + isClaude pane-inspection; ZERO Controller/registry state mutation. Prefix (send.smart) is read from the registry FILE (View reads file — allowed per MVC doc). No boundary violation.

## Recommendation
Gate #4 (empirical wrap check) as the one that can silently lose a real long message — it's the BUG10 class. #2 is a confirm-the-caller check. #1/#5 are hardening. If #4's wrap is not reproducible on the current TUI and no caller passes a remote target directly (#2), the fix is **safe to close** with #1/#5 noted as known best-effort edges.

## Report-back
- Architect (coherence review): **DONE 2026-07-03** — 1 HIGH (wrap probe false-positive, empirical-confirm), 1 MED (local-only verify vs remote target), 2 LOW (vacuous shell verify, C-u multiline residue); rc2-chain + MVC CLEAN; g.1 Escape-hazard preserved via send.verified's internal isClaude gate.
- PO (gate):
