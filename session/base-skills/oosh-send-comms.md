# Base Skill: OOSH Send-Comms — talking to panes correctly (MANDATORY — all agents)

*Born 2026-07-03 from a major team win: the ARON rewind. For two sessions a "picker won't render" bug blocked every otmux-driven /rewind. It was never a render bug — it was **not knowing what each `otmux send` verb actually sends**. This skill is that knowledge, so no agent relearns it the hard way. Measured from the otmux source, verified live.*

## The one law
**Before you send keys to a pane, know EXACTLY what bytes the verb emits — because on a Claude Code pane the send verbs inject hidden keys (Escape, Enter, C-u) to fight autocomplete, and those hidden keys have side effects.** Guessing corrupts agents. Measure the verb; measure the pane state (idle vs generating vs modal); capture between steps.

## The verb table (what each ACTUALLY sends to a Claude pane)

| Verb | Actually emits | Use it for | NEVER for |
|------|----------------|-----------|-----------|
| `otmux send.raw <p> Up`/`Down`/`BTab`/`C-u` | the bare key, literal | picker/menu NAVIGATION, clearing input | — |
| `otmux send.raw <p> "text" Enter` | text → **Escape** (dismiss autocomplete) → Enter | one-shot submit of a msg/`/command`; **OPENING a slash-TUI** (Escape harmless — no modal open yet) | inside a modal |
| `otmux send.raw <p> Enter` (bare) | **Escape + Enter** | a plain submit on an idle prompt | **inside a modal picker — the Escape CANCELS it** |
| `otmux send <p> "…"` / `send.verified` | C-u clear → stage text ONCE → (Escape+Enter poke)×≤3 → verify COMMIT | **normal message/prompt submission** (self-healing, dup-safe, over-bridge reliable) | opening a TUI command (the ×3 Escapes cancel it) |
| **`otmux send.tui <p> Enter`** | **bare Enter, NO Escape** (per-key delay) | **SELECTING inside a modal** (picker checkpoint, option, permission Down+Enter) | — |
| `otmux send.enter <p> "…"` | text + Enter (single) | legacy simple submit — prefer `send.verified` | reliability-critical sends |
| `otmux pane.capture <p> N` | `tmux capture-pane -p` — **READ-ONLY, sends nothing** | your EYES; measure between every step | (harmless — never blame it) |
| `otmux pane.history <p>` | scrollback dump, read-only | content scrolled OFF-screen | — |

## The ten hard-won rules

1. **Capture is innocent.** `pane.capture` = `tmux capture-pane -p`; it emits nothing and can NEVER close a menu or clear a composer. (An OLD `-S` scrollback version returned stale frames = the "lying instrument" that faked "composer won't clear / menu won't render." Fixed. Don't blame the capture.)
2. **The Escape is the hidden actor.** Send verbs inject `Escape` to dismiss Claude's slash/`@`-autocomplete so Enter actually submits. That Escape is *needed* before a submit but *deadly* inside a modal (it's the modal's "Esc to cancel"). Know which state the pane is in before you send Enter.
3. **Modal ⇒ `send.tui` only.** Inside a `/rewind` picker, permission prompt, or any modal, select with `send.tui Enter` (bare). NEVER `send.raw Enter` / `send` / `send.verified` there. Navigate with `send.raw` arrows.
4. **Staged ≠ submitted (BUG10).** A send can deliver text yet not submit (autocomplete eats Enter; long text wrap-stalls). Verify the text COMMITTED (left the `❯` input line) — not that it's merely present. `send.verified` does this and self-heals.
5. **Never re-type on a busy pane = the dup.** Re-sending the text pokes a second submit of the still-buffered message (~3s-gap dup). Stage ONCE; poke **Enter only** to self-heal. [[send-self-heal-verify-not-resend]]
6. **Never Escape/interrupt a GENERATING pane.** Escape interrupts the agent mid-thought (Tron's hard rule). Dismiss autocomplete only on an IDLE prompt; `send.verified` checks for `esc to interrupt` first.
7. **Short pointers, never long prose on the wire.** Long/wrapping messages wrap-stall unsubmitted and lose spaces. Write detail to a committed file; send a short `Read <file>` pointer. [[sprint-comms-protocol]]
8. **A multi-line composer needs multiple `C-u`.** `C-u` kills ONE line; a restored/pasted multi-line block needs one `C-u` per line (watch "Ctrl+Y to paste deleted text" shrink the block).
9. **Measure a STABLE state.** Captures can race the render — take 2 captures a few seconds apart before concluding; don't grade a moving target. And **NEVER `| tail`/`| head` a capture** (forbidden — use the verb's own line-count arg). [[feedback_no_tail_head_on_captures]] [[measure-a-stable-state-not-a-moving-target]]
10. **Address by role; a modal blocks its own agent.** Resolve fresh (`hiveMind resolve <role>`), never hardcode a pane. And while a picker/modal is open on an agent's pane, THAT agent is blocked at its UI — it can't act or be messaged without disruption; a **peer/TRON drives from outside**.

## Where this is used
- **Driving `/rewind`:** full step-by-step in `session/base-skills/agent-rewind.md` → "Driving It via otmux" (open `send.raw "/rewind" Enter` → navigate `send.raw` arrows → select `send.tui Enter` → Option 2).
- **Dispatch / reporting:** `session/base-skills/sprint-comms-protocol.md` (short pointer to a committed file = the channel).
- **OOSH-only rule:** `otmux`/`hiveMind`/`claudeCode` wrappers are the DEFAULT+MANDATORY path; bare `tmux …` / `claude …` are forbidden except explicit Tron-authorized named recovery. `send.raw`/`pane.capture` ARE wrappers → allowed.

**Measure the verb, measure the state, capture between steps. Wer schreibt, der bleibt. NEVER forget TRON CMM4.**
