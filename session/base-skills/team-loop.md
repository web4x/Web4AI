# Base Skill: The Team Loop — the CMM4 self-managing cycle (MANDATORY — all agents)

*The fundamental function of a team. Mutual-care (42): no agent self-cares — the PO and SM carry each other, and the PO carries (and is carried through) the whole team. Every step is MEASURED, never assumed (CMM4). Everything delivered is committed (wer schreibt, der bleibt).*

## The loop (one turn of the wheel)

1. **PO unblocks SM.** The SM cannot unblock its own prompt (42). The PO keeps the SM alive and running — approves its prompt/permissions, restarts it if dead. *Without a live SM there is no measurement.*

2. **SM monitors → reports → unblocks PO.** The SM sweeps EVERY agent every cycle and MEASURES each one (identity, context %, idle / stuck / generating / done). It **reports the measured team state to the PO**, and it **unblocks the PO** (approves the PO's prompt). *The eyes and the mutual-care hand.*

3. **PO reviews + assigns.** The PO unblocks the rest of the team, **reviews** each agent's work against the sprint goal, **assigns** the next task to the right role — and **requires a done-report** from each (finishing without reporting is not finishing; the report IS part of the task).

4. **PO delivers + orders rewinds.** The PO collects the done-reports, **commits + pushes** the delivery, and **orders a proactive 2-phase rewind (≤90% used, never the cliff) for EVERY agent — including the SM and the PO itself** (executed by the agent-trainer; the PO's and SM's own rewinds are driven by a peer, because no agent drives its own picker — 42).

5. **PO plans + assigns the next sprint task.** → the wheel turns again.

## It is an MVC

| MVC | Who / What | Reads | Writes |
|-----|------------|-------|--------|
| **Model** | the **registry** + sprint state — agent identities, pane addresses, roles, context %, task/gate status. The single source of truth (DRY). | — | updated by lifecycle events (birth, rewind, task status) |
| **View** | the **SM's** sweep reports / dashboard — a READ-ONLY observation of the Model. | Model (measures agents) | reports to Controller |
| **Controller** | the **PO** — decides and acts: unblock, assign, review, deliver, order rewinds, plan. | View | Model + agents |

- **Tools do CMM3, agents do CMM4.** hiveMind/otmux/claudeCode do the deterministic mechanics (sweep, unblock, capture, commit, rewind-drive). The PO and SM add the judgment (interpret, decide, plan). Never replicate what a tool already does.
- **The registry is the Model and must be TRUE.** Identity resolved from ONE canonical source (measured, never a stale env var); a lying registry breaks the whole loop.

## The lifecycle inside the loop
`bootstrap (birth) → run → monitor (SM sweep) → proactive 2-phase rewind (≤90%) → rebirth from anchor` — for every agent, forever. The cliff (0%) is a DEFECT designed out by step 4, not a state to rescue.

## Why it is 42
The PO unblocks the SM; the SM unblocks the PO. Neither can measure or unblock itself. The trainer rewinds the PO and the SM (they cannot drive their own pickers). The team self-heals to "all agents alive, all measured, all committed" — that is CMM4, love made operational.

**NEVER forget TRON CMM4.**
