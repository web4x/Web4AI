> ⬆ **[Sprint 2 · task-s2-g](./task-s2-g-otmux-send-reliability.md)** — sub-task; back to parent task.

# Task S2-G.7: send.verified — scan the whole INPUT REGION for the probe (wrap hardening)

**From**: g.6 coherence review (HIGH finding #4), PO-gated 2026-07-03. Empirically LOW-in-practice (a >120-char msg commits before staging persists), filed as HARDENING.
**Role**: architect (design) → expert (impl) → tester (T-VERIFY-WRAP). NO behaviour change for the common case; closes the wrap false-positive.

## Problem (g.6 #4)
`send.verified` (otmux:1879) checks commit by testing the distinctive tail probe (`${text: -24}`) against **only the `❯` row**: `capture | grep -F '❯' | tail -1`. When Claude's input box WRAPS a long line to continuation rows (which carry NO `❯`), the tail probe lives on a continuation row → never on the `❯` row → verify reports rc0 "committed" **while the text is still staged** = a BUG10-class false-positive for exactly the long-message case. (Low in practice: the poke usually commits before a staged wrap persists — hence HARDENING, not urgent.)

## Fix: scan the input REGION (last `❯` row → bottom), not just the `❯` row
Keep the **tail** probe (it is message-distinctive). Widen the search from the single `❯` row to the whole input region = the LAST `❯` row and every row below it (the wrapped continuation rows + the input-box bottom). Replace the `❯`-row check with:
```sh
cap=$($TMUX_CMD capture-pane -t "$target" -p 2>/dev/null)
# input region = from the LAST '❯' row (the live input box) to the bottom of the capture
lastprompt=$(printf '%s\n' "$cap" | grep -nF '❯' | tail -1 | cut -d: -f1)
region=$(printf '%s\n' "$cap" | tail -n +"${lastprompt:-1}")
if ! printf '%s\n' "$region" | grep -qF "$probe"; then
    # probe absent from the whole input region → COMMITTED
    ...
```

## Why this is correct (and why head-probe was rejected)
- **Tail probe kept, not head.** The `[@sender]` prefix is IDENTICAL across all messages → head chars (`${text:0:24}`) are non-distinctive (they'd collide with the prefix and with prior messages). The tail is the message-specific part → correct discriminator. *(PO call, absorbed.)*
- **Committed → probe absent from the region.** On commit the input box empties (`❯ ` blank) and the message moves UP into the conversation ABOVE the `❯` row — which is NOT in the `❯`-row→bottom region. So a committed message's text is never in the scanned region → correct rc0. (This is the key safety property: scanning DOWN from the last `❯`, not up, means committed text never false-triggers "staged".)
- **Staged short → probe on the `❯` row** (in region) → staged. ✓ (unchanged)
- **Staged LONG wrapped → tail probe on a continuation row** — NOW inside the scanned region → correctly staged. ✓ (the fix)
- **Multiple `❯` in scrollback** (a quoted prompt in the conversation) → `tail -1` of `grep -n '❯'` picks the BOTTOMMOST = the live input box. ✓ (same anchor the current code uses)

## Edge to guard in impl
- The region includes the status line below the input (e.g. `esc to interrupt`, context %). A 24-char message tail is very unlikely to collide, but the impl should not treat the status line as input. If paranoia is warranted, bound the region at the input-box separator rather than the literal bottom — but bottom-anchored is fine given the tail probe's specificity. (Architect: bottom-anchored acceptable; note it.)
- `lastprompt` empty (no `❯` at all — a shell/non-claude pane) → falls back to the whole capture; a non-`❯` pane has no probe match anyway → rc0 (the existing vacuous-shell behaviour from g.6 #1, unchanged here — separate LOW).

## Scope / non-goals
- ONLY the verify region-scan. No change to: stage-once, Enter-only poke, isClaude-gated Escape, honest rc2, the C-u clear. Behaviour identical for short (non-wrapping) messages.
- g.6 MED (remote-caller-check: confirm no caller passes a remote pane target to LOCAL send.verified) + g.6 LOWs (#1 vacuous shell verify, #5 C-u multiline residue) remain noted follow-ups, NOT in g.7.

## Acceptance / handoff
- [ ] `send.verified` verifies commit by scanning the last-`❯`-row→bottom region for the tail probe (not just the `❯` row).
- [ ] short-message behaviour byte-identical; T-SEND-MATRIX still green (esp. B1/B2/B5/H1/H3, D3 idempotency).
- **Expert**: swap the single-`❯`-row check (otmux:1879-1884) for the region scan above. Commit.
- **Tester**: **T-VERIFY-WRAP** — stage a LONG wrapping line with the Enter eaten (autocomplete open) → assert send.verified returns **rc2 STAGED** (not a false rc0); a normally-committed long line → rc0; a committed message's text sitting ABOVE the `❯` row does NOT false-trigger "staged". Add as a cell under T-SEND-MATRIX group H (wrap).

## Report-back
- Architect (region-scan design): **DONE 2026-07-03** — keep the distinctive TAIL probe (head rejected: prefix identical across msgs), widen search to the last-`❯`→bottom input REGION so a wrapped tail on a continuation row is found; committed text moves ABOVE `❯` (outside the region) so no false-staged. Minimal, short-msg behaviour unchanged. T-VERIFY-WRAP asserts the staged-wrap rc2.
- Expert (impl):
- Tester (T-VERIFY-WRAP):

---
## PO APPROVED (oosh-po@WODA.prod) — LOW priority
Downward-scan safety (committed msg moves ABOVE ❯ → outside region → never false-staged) is the crux, sound. 4-line swap otmux:1879-1884. Priority LOW (long msgs commit fine in practice per PO empirical). Expert impl AFTER s2-h/i; tester T-VERIFY-WRAP (staged-wrap → rc2 not false rc0). MED remote-caller-check + 2 LOW = follow-ups.
