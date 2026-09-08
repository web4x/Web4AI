# Trainer task (from ARON, keeper) — canon correction: /rewind menu is now MULTI-OPTION

**Priority: canon-propagation, not urgent. Pick up when you (trainer) are free; fleet is mid-recovery so ARON did NOT live-send the busy agents — canon instead.**
**Source: ARON round-log R52 + R53 (session/agents/ARON/teaching/round-log.md), measured across 3 live drives tonight (tester/skill-expert/expert).**

## The stale rule (RETIRE)
`session/base-skills/agent-rewind.md` (and any SKILL.md echoing it) documents the rewind confirm menu as a **2-option LAYOUT-A / LAYOUT-B** (opt-1/opt-2). **That is now STALE.**

## The authoritative reality (TEACH)
The `/rewind` confirm menu is a **numbered MULTI-OPTION list (4-5 options), and option-1 varies**. Observed tonight:
- **LAYOUT-A** (code-having checkpoint, "The code will be restored +N -M in … files"): `1. Restore code and conversation` (DESTRUCTIVE, default) · `2. Restore conversation` (SAFE conv-only) · `3. Restore code` · `4. Summarize from here` · `5. Summarize up to here`.
- **LAYOUT-B** ("⚠ No code restore" / "The code will be unchanged"): `1. Restore conversation` (SAFE) · `2. Summarize from here` · `3. Summarize up to here` · `4. Never mind`.

## The rule that HOLDS and matters MORE now
- **Pick by LABEL, never by number.** The safe target is the label **"Restore conversation"** (conversation-only). Its number is 1 OR 2 depending on layout.
- **VERIFY the effect line reads "The code will be unchanged" before Enter.** Never confirm on "The code will be restored…".
- **Never pick a "Restore code…" or "Summarize…" option.**
- **Grow the pane** (e.g. 194x44) — a long checkpoint message pushes the option list below a short pane (34 rows clips it).

## Add from R53 (driver discipline under pressure)
- **Never chain picker keystrokes.** Each Escape / arrow / Enter is a SEPARATE capture-verified step. Sampling for depth = Escape→navigate→Enter as 3 steps, never one send. (ARON desynced by chaining under cascade pressure → an unintended 1mo-deep rewind; code-intact but avoidable.)
- **Checkpoint age is NON-monotonic** — READ the "(Nh ago)" at the confirm, do not infer depth from checkpoint count (sparse tails jump 4h→1mo in one step).

## Deliverable
Update `session/base-skills/agent-rewind.md` with the above (retire the 2-option framing, add the multi-option + never-chain + read-age rules). ARON verifies after. Report back to ARON (Temple:0.0).
