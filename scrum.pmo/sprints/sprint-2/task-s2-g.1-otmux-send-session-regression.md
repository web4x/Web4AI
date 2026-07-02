> ⬆ **[Sprint 2 · task-s2-g](./task-s2-g-otmux-send-reliability.md)** — sub-task; back to parent task.

# Task S2-G.1: otmux send session/manual regression (OTR-1 rewrite?)
[task:uuid:21962800-9528-404d-aa34-24ec9b9260fc]

## Status
- [x] Planned
- [x] In Progress
- [x] QA Review (expert-verified live; awaiting tester T-SEND-SESSION)
- [ ] Done

## Description
**Role: architect (diagnose) → expert (fix) → tester (verify)** · **PRIORITY (blocks ARON rewind + Tron's own send).**
otmux send "does not complete the session / totally broken" for: (a) the agent-trainer rewinding ARON (session send), (b) Tron's manual shell send. OTR-1's `send.smart` rewrite (stage→submit→verify→poke×3, 1.3s settle, region-verify) is DEV-ONLY. Hypothesis: the rewrite handles AGENT-DISPATCH panes but breaks NON-dispatch sends (a plain session/shell target with no `❯` claude-pane region, or a session-completion send) — e.g. region-verify never sees a "submitted" state on a non-claude target → poke×3 → Escape interrupts / hangs → "session not completed."

## Requirements
- Diagnose: does `send.smart` mis-handle non-claude / session / shell targets (region-verify assumes a claude `❯` pane)? Compare behavior to macos.latest's old send on the SAME target.
- Fix: `send.smart` must complete reliably for ALL target kinds (claude-dispatch, shell, session, remote) — detect target kind and skip the claude-pane region-verify where it doesn't apply; never hang/Escape-interrupt a non-dispatch send.
- Preserve OTR-1's rc-dispatch guarantees (don't regress the 5/5 T-DISPATCH-SUBMIT).

## Definition of Done
- otmux send completes on shell/session/manual targets (trainer ARON rewind + Tron manual) — reliably, no hang
- OTR-1 rc-dispatch paths still 5/5
- T-SEND-SESSION: send to a non-claude / shell / session target → completes (no poke-hang / Escape-interrupt); regression guard for the OTR-1 gate-miss

## ARCHITECT DIAGNOSIS + FIX SPEC (oosh-architect, 2026-07-02) — hypothesis CONFIRMED
**Root**: OTR-1's verify + poke + **Escape** is a **claude-TUI protocol applied to EVERY target**. Non-claude (shell/session/node) targets don't have the claude `❯`-input-box "staged-vs-submitted" state → the protocol misfires. Two mechanisms, both measured on dev:

### M1 — verify+poke loop runs on NON-claude targets → false rc2 "not completed" (the common symptom)
- **`macos.latest` old send has ZERO verify/poke** (`grep -c send.verify|send.poke = 0`) — it just `sendEnter` (stage+Enter) and returns. It CANNOT hang / "not complete" a non-claude send. That's why the old send "worked."
- **Dev `send.smart` runs the poke loop on ALL targets** (otmux:2161-2177). For a non-claude target, `otmux.send.verify` (otmux:1813) falls to the bash `>`-prompt branch (1844-1846) which is **fragile**: it greps for `>` (the OOSH prompt ends in `>`, but the echoed command / message text can contain `>` → mis-parse; and `#`/`$`/`%` prompts have no `>` at all). Mis-parse → `staged` non-empty → **rc2 STAGED (false)** → poke loop fires (up to 3× extra Enters) → after maxPokes returns **rc2 "STAGED but UNVERIFIED"** = the caller sees "session not completed" even though the command actually ran.

### M2 — `isClaudeCode` FALSE-POSITIVE on `node` → Escape into a shell → interrupt/hang
- `private.otmux.pane.isClaudeCode` (otmux:1732) returns **rc0 (claude) for `pane_current_command == node` UNCONDITIONALLY**. But ANY node tool (dev server, npm, a node REPL) reports `node` — not just Claude Code. A shell running node → mis-detected as claude → the FULL claude path fires, incl. **`send.submit`'s Escape** (otmux:1766) into the node process + region-verify never finds `❯` → poke×3 → **Escape interrupts / hangs** = "totally broken." (Genuine `bash|zsh|sh` and `ssh` are OK — bash/zsh/sh gate on `claudeCode process.running`; ssh → `*` → rc1. `node` is the hole.)

### FIX SPEC (detect target-kind; claude-protocol only where it applies; never Escape/hang non-dispatch; DON'T regress 5/5)
1. **Branch `send.smart` on target-kind ONCE, up front:**
   - **claude (isClaudeCode true)** → the FULL OTR-1 contract UNCHANGED: stage → submit(Escape+Enter) → region-verify(`❯`) → poke×N → rc{0,2,3,1}. **This is the 5/5 rc-dispatch path — byte-for-byte preserved.**
   - **non-claude (shell/ssh/session-to-shell)** → a SHELL path: `stage + Enter` (**NO Escape**), then a LIGHT confirm (pane changed / fresh prompt returned), **NO poke loop, NO Escape.** rc0 on dispatch. A shell command isn't a TUI "staged-in-a-box" state — one Enter dispatches; there is nothing to poke. NEVER Escape, NEVER multi-poke, NEVER hang.
2. **Harden `isClaudeCode` — close the `node` hole:** move `node` OUT of unconditional-claude; require the `claudeCode process.running` confirmation for `node` too (same as bash/zsh/sh). `node` alone ≠ claude.
3. **`send.verify` is claude-only:** on a non-claude target it must NOT apply the `❯`/`>`-region + poke semantics — return rc0 (dispatched) on a light check, never an rc2 that triggers pokes.
4. **Session target:** resolve `<session>` → its ACTIVE pane first, then branch on THAT pane's kind (so a session pointing at a shell takes the shell path).
5. **Non-regression:** the claude branch is untouched → T-DISPATCH-SUBMIT stays 5/5. The fix is purely (a) adding the non-claude fire-and-light-confirm branch + (b) the `node` hardening.

**One-line essence:** verify+poke+Escape = the CLAUDE dispatch protocol; non-claude sends are fire-and-light-confirm. Detect kind, pick the protocol, never Escape a non-claude target.

## Report-back
- Architect (diagnosis vs macos.latest): **DONE 2026-07-02** — hypothesis CONFIRMED, 2 mechanisms: (M1) dev runs verify+poke on ALL targets; macos.latest old send had NONE → dev's fragile `>`-verify on shells → false rc2 → poke → "not completed." (M2) `isClaudeCode` treats `pane_current_command==node` as claude unconditionally → Escape into a node shell → hang. Fix: branch send.smart on kind (claude=full contract UNCHANGED/5-5-safe; non-claude=stage+Enter, no Escape, no poke, light-confirm) + harden isClaudeCode's node case + session→active-pane→kind. Full spec above.
- Expert (fix + commit): **DONE 2026-07-02 `188971a`** (dev). Implemented all 3 per approved spec: (1) **kind-branch `send.smart`** — detect `isClaudeCode` ONCE up front; non-claude → `stage + submit(Enter)`, NO Escape, NO poke, NO verify loop, light-confirm rc0; claude → full OTR-1 path preserved byte-for-byte. (2) **`isClaudeCode` node hardening (M2)** — moved `node` from unconditional-claude into the `claudeCode process.running`-gated arm (same as bash/zsh/sh); `node` alone ≠ claude. (3) **session→active-pane (point 4)** — `private.resolve.target` resolves a BARE session name (real session only, via `has-session`) to its active `sess:win.pane`, so session sends branch on the active pane's kind. **Live-verified on WODA.prod**: shell send rc0 in 1s (was ~5s poke-hang) + command executed; node pane → isClaudeCode rc1 (non-claude, no Escape); bare-session → dispatched to active pane; **T-DISPATCH-SUBMIT 5/5 (claude path non-regressed)**.
- Tester (T-SEND-SESSION): READY — send to shell/session/manual target completes (no poke-hang / Escape-interrupt); node-pane-without-claude-child takes shell path; verify OTR-1 claude rc-dispatch still 5/5. Commit `188971a` on dev.

## ⚠ EXPERT FOLLOW-UP FINDING (2026-07-02, surfaced by g.1 live-verify) — SEPARATE ISSUE, needs PO triage
While pinging the PO (a REAL claude agent at `ooshTeam:0.0`), the g.1 send took the **non-claude "(shell)" path**. Root: `pane_current_command` = `bash` (claude is the CHILD), and **`claudeCode process.running ooshTeam:0.0` returns rc1 (false)** → `isClaudeCode` classifies the PO pane as shell.
- **NOT a g.1 regression**: the `bash → claudeCode process.running` gate pre-dates g.1 (commit `fd085c4`); g.1 only moved the `node` case into that same gate. g.1's new `(shell)` log line merely made the mis-detection VISIBLE.
- **Impact**: agent panes whose `pane_current_command` shows `bash` (claude as child) are mis-classified → they take stage+Enter (message still DELIVERED/queued — the PO ping DID land in the TUI queue) but SKIP the sender-prefix and the OTR-1 submit-verify. No hang, no Escape — safe, but lossy (no prefix, no rc-verify).
- **Hypothesis**: `claudeCode process.running` (tty/pid-walk) is unreliable on WODA.prod for bash-parent claude panes — the real claude-detection primitive, orthogonal to g.1's KIND branch. Likely relates to OTR-3/C-family live-reader work (identity/detection). **Recommend a dedicated task (g.4?) — do NOT widen g.1.**

---
## ✅ g.1 DIAGNOSIS done + fix APPROVED (architect `e6eb721`, oosh-po 2026-07-02)
Hypothesis CONFIRMED — 2 mechanisms:
- **M1**: dev `send.smart` runs verify+poke on ALL targets; macos.latest old send had NONE (stage+Enter) → dev's fragile `>`-prompt verify on a SHELL → false rc2 → poke → "not completed."
- **M2**: `isClaudeCode` treats `pane_current_command==node` as claude UNCONDITIONALLY (any node tool matches!) → Escape fires into a node shell → hang.
**FIX (approved)**: branch `send.smart` on KIND — **claude = full OTR-1 contract UNCHANGED (5/5 preserved)**; **non-claude = stage+Enter, NO Escape, NO poke, light-confirm**; + harden `isClaudeCode` node case; + session→active-pane→kind resolution. Essence: verify+poke+Escape is a CLAUDE protocol; non-claude = fire+light-confirm.
**Expert fix → tester T-SEND-SESSION** (regression guard — the send path OTR-1's tests missed).

## Reference for the fix (from g.3): macos `04b54a5` SSH-send Escape-before-Enter
macos.latest's `04b54a5` (SSH-send: Escape-before-Enter) is a macos-unique send technique — expert/architect: REVIEW it while fixing g.1; the non-claude/SSH/session send path may want that technique (possible macos→dev reverse-port). Don't blind-copy; evaluate vs the branch-on-kind design.
