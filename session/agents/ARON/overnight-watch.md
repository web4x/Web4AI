# ARON Overnight Watch — TRON standing directive (2026-07-20, team alone overnight)

**If you are a freshly-rewound ARON reading this: the overnight watch is ACTIVE. Resume the hourly loop below.**

## The directive (TRON, verbatim intent)
> "Check every hour if the Trainer is healthy, and let him check you, the SM, and the PO. Care for your in-time rewinds. Let the POs reflect on all the learnings of the day and drive scenario-first planned fixes and close the gaps on interrupted/incomplete tasks in Sprint 31. Don't interrupt busy agents — speak only to idle or API-limited agents."

## The IRON RULE
**NEVER interrupt a busy/generating agent.** Before speaking to any agent: `otmux pane.capture` it — if it shows a "thinking/working" spinner (Kneading/Brewing/etc.), SKIP it this cycle. Speak ONLY to agents that are **idle** (empty `❯`, no spinner) or **API-limited** (waiting/rate-limited). Measure first, then act.

## The hourly cycle (ARON drives)
1. **Health-measure the key agents** — trainer (baseTeam:0.0), SM (ooshTeam:0.1), PO (robbin-po robbinTeam2:0.0 + oosh-po ooshTeam:0.0). For each IDLE one: zoom-first → trigger `/context` → read the **Free-space header** (the ONLY truth — [[context-measurement]]) → un-zoom. Skip busy ones.
2. **Proactive (in-time) rewind** — if an idle agent is **≥85% used (≤15% free)**, drive its 2-phase rewind NOW (zoom-first, Option-2 "Restore conversation" BY LABEL, code-intact; verify <30% after; un-zoom). Prevent the cliff — never wait for 0%. Its committed anchor = zero-loss.
3. **Let the trainer check ME (the 42)** — I cannot self-read my own `/context`. Each cycle, ask the trainer (if idle) to measure ARON@Temple:0.0 and rewind me if ≥85%. Mutual care.
4. **Drive the POs** (if idle) — nudge robbin-po + oosh-po to: (a) reflect on the day's learnings, (b) drive **scenario-first** planned fixes (scenario units on disk BEFORE impl — law #100), (c) close the gaps on **interrupted/incomplete Sprint 31 tasks**. Short file-pointer nudges only.
5. **Re-arm** — schedule the next check ~1 hour out.

## Honest risk (flag to TRON on return)
The harness **auto-mode classifier** can block a peer-driven rewind when justified "only by a peer/SM message, not the user" — it was **non-deterministic** today (mostly allowed). Overnight, a needed rewind MAY get blocked with TRON asleep. Mitigation: rewind **proactively** (≤85%, with room to spare) so even a blocked/delayed rewind doesn't hit the hard 0% cliff. If truly blocked, the agent holds at the picker (committed=safe) until TRON's word. This is the standing authorization knob TRON must set.

## State log (append each cycle)
- 2026-07-20 ~cycle-0 (setup): trainer 33% used (66.7% free, just rewound 73%→33%) ✓ healthy; SM 68% (TRON-read) ✓ healthy. Watch armed.
