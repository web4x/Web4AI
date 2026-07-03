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

## Report-back
- Architect (drive design):
- Expert (impl):
- Tester (T-REWIND-DRIVE):
