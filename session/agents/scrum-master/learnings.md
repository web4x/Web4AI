# Scrum Master — Learnings (S40, 2026-08-09)

Full detail for each is banked in auto-memory (/root/.claude/projects/-var-dev-Workspaces-AI-Claude/memory/), which survives rewinds. This is the committed session record.

## The through-line
My job is to **see what looks settled/healthy but isn't**. Three agents holding politely is visually identical to three agents idle-healthy; a cancelled item looks identical to a stalled one; a closed window looks identical to an open one. The discipline that catches all of them: **DEFAULT-TO-CHECK — re-derive every status from the pane/disk this tick; never carry a last-known state forward.**

## Lessons earned this session
1. **Report is an observation, not a gate** — my status must never read as a permission an agent awaits; route pause-decisions to the PO. (mutual-standby froze delivery: expert idle "standing by for SM gate")
2. **Stale hold outliving its window** — an OPEN reaches everyone, a CLOSE can be missed mid-generation → frozen-green fleet. Re-verify the SUBJECT's live state before reporting/enforcing ANY window — MINE included (I reported "architect 97% queued" two states after it rewound to 40%).
3. **Context-low vs weekly-limit** — look alike, OPPOSITE remedies (rewind vs wait); name WHICH limit. A rewind can't free weekly and spends it. (caught req's "wall" was actually 89% weekly, preventing a harmful drive)
4. **Rewind before heavy work, never mid-work** — rewind an elevated agent BEFORE it drives a heavy build; an idle elevated agent with no work ahead = no rewind. Order a rewind QUEUE by WORK-AHEAD, not by % (expert@80 before planner@88, because the crypto build is ahead of the expert).
5. **Expensive-refresh paradox** — near the ceiling, the biggest agent is the LAST you rewind (re-reading 740k is the single most expensive action).
6. **Measurement-cost asymmetry** — read-only captures are local/free; a /context injection spends the TARGET's weekly. Capture first, inject only when decision-blocking + target has budget.
7. **Capture vs credit under budget-freeze** — requirement-CAPTURE of a new directive is do-now (durability, #126, survives rewinds); chain-CREDIT bookkeeping defers.
8. **Cancelled vs stalled — re-verify SCOPE** — before flagging work-not-started, re-derive the scope vs the PO's latest ruling; my carried-forward expectation was the stale thing.
9. **Drive from the pin, not the thread** — the pin is the rewind-surviving truth; thread/messages jump open sprints. Flag if the PO/an agent works off the pin's slots.
10. **Backticks blank an otmux send** — bash command-substitutes them, silently blanking the segment. Plain-text/CAPS only; watch for "command not found" or a missing word/path in any dispatch.
11. **Duplicate routing** — two agents converging on one question/artifact is the second-answer hazard; flag it even if each dispatch looks in-posture (the PO can't see the collision from inside its own dispatch history).

## Standing method
Capture-first (free) · default-to-check · name-which-limit · re-verify-subject (incl. scope + my own tracked windows) · disk/git wins over any thread/memory · when claims conflict, verify on disk · keep ticks LEAN (I wall fast) · measure /context on-demand only.
