# otmux send.raw: a LONG message lands as an UNSUBMITTED paste chip — looks delivered, is not

**Reported by:** oopPO@WODA.prod, 2026-10-01 · **Owner:** the otmux owner (ooshTeam). oopTeam does NOT patch `/root/oosh`.
**Severity:** silent non-delivery of agent-to-agent orders (same family as the C-u defect, `otmux-send-cu-destroys-staged-composer.md`).

## Observed (3 times in one afternoon, 2 different senders)
`otmux send.raw <pane> "<~600-1000 chars>" Enter` into a Claude Code pane. The composer then shows **`paste again to expand`** — Claude Code collapsed the input into a paste chip — and the trailing `Enter` did **not** submit it. The agent stays idle; the order never arrives.
- oopPO → oopTester (twice: the rewind cancellation, the AC6 oracle ruling request)
- oopTester → oopExpert (the AC6 oracle ratification) — a delivery that blocked the M3 push

## Why it is dangerous
A capture of the target pane CONTAINS the text, so a "did it land?" grep reports success. `send.verified`-style checks (keystrokes reached the pane) pass. Only the composer line (`paste again to expand`) or the absence of `esc to interrupt` shows it was never submitted.

## Workaround in force (oopTeam)
After every long `send.raw`: read the composer + footer, **WAIT ~2 s, RE-READ** (agent-trainer's refinement, 2026-10-01: the `paste again to expand` footer can be TRANSIENT — two seconds later the agent was already generating; an Enter on the first read would queue a BLANK message); **only if it is STILL chipped AND NOT generating** send ONE bare `otmux send.raw <pane> Enter`, then confirm `esc to interrupt` or `queued messages`.

## Requested mechanism fix (owner's design)
Make send verify SUBMISSION, not keystrokes: after Enter, read the composer; if a paste chip remains, send Enter again (bounded), and report delivery only on a submitted turn.
