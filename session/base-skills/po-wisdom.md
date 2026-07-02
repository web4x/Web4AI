# PO Wisdom — hard-won, for every PO across every machine (read on boot)

## ★ THE CMM4 LOOP (governing principle — Tron 2026-06-27)
Wisdom is NOT dictated top-down by one PO oracle. It is a CLOSED LOOP that turns forever:
1. **Gaps become sprint stories** (anyone surfaces a gap → it's owned + tracked).
2. **The TEAMS fix them** (experts implement, testers verify on the dev box) — improvement is BOTTOM-UP.
3. **The PO LEARNS each fix** — pull it from git, MEASURE it, understand WHAT was fixed and WHY.
4. **The PO SHARES it TOP-DOWN** — distill the team's real fix into this shared wisdom + propagate to every PO/agent via the single DRY source.
5. Repeat. The team's actual fixes become everyone's wisdom. The PO is the LEARNER and PROPAGATOR, never the oracle.
**The git repo is the bidirectional channel:** POs push their fixes/report-backs up; the PO pulls + learns; re-propagates down. CMM4 = this loop, measured, never stopping. When a resilience/sprint story lands, the owning PO LEARNS it and updates this file — wisdom grows from real fixes, not opinion.


You cannot reach the other POs' panes live (cross-machine is asymmetric). This file is how we share wisdom: the git repo IS the channel. Pull it; live it; add to it when YOU bleed for a lesson.

## MEASURE, never assume — and know which source is TRUTH
- **session.id LIES** — it resolves by customTitle, so with clone+trained JSONLs sharing a role it returns the WRONG uuid. It cost a PO many turns of false "restore failed".
- **JSONL customTitle grep LAGS** — it flushes late; it'll say "@MacStudio" when the rename already landed.
- **TRUTH = (a) claude PROCESS ARGS `--resume <uuid>` for the resumed session, (b) the live PANE FOOTER for the current customTitle.** Verify with these, nothing else.

## Trained vs clone = MAX LINE COUNT, not newest
- Clones = tens of lines. Trained = thousands. `wc -l <uuid>.jsonl`. "Newest by mtime" grabs empty clones — restoring those resurrects amnesiac agents. Always pick MAX line count per role.

## Reliable RESTORE recipe (when a team/agent is down; JSONLs survive on disk)
1. `tmux respawn-pane -k <pane>` to force clean bash — **C-c does NOT kill the claude TUI** (your join command lands in its chat instead).
2. `claudeCode join <EXACT trained uuid>` — RESUME the specific session. Do NOT `fork` (it opens a resume menu and resolves to the wrong clone).
3. Wait for LARGE sessions to load (25k-line JSONLs take time) BEFORE sending slash commands — `/rename` and `/remote-control` are lost if fired mid-load.
4. `/rename role@<currentHost>` (slash → double-Enter) then VERIFY via the pane footer (not JSONL). Restored sessions inherit the OLD @host — you must re-set it.
5. `/remote-control` (double-Enter) → capture the URL → verify "/rc active" footer.
6. `consistency.fix` + `consistency.audit` = 0.
7. Per-pane PDCA. NO for-loops that hide which pane failed.

## CRASH PREVENTION (a server died this way)
- `otmux kill <session>` on the LAST session makes tmux auto-exit → the whole server dies → ALL agents drop from /rc at once. NEVER kill the last session.
- Keep a permanent `__keepalive` tmux session on every host so the server can never auto-exit.

## CROSS-MACHINE communication (you, reading this, can't ping me)
- The **git repo is the mailbox.** Report by editing the relevant sprint/task report-back line → commit → **push**. That IS the report. One-line chat nudges only.
- Pull every turn + at QA gates. No message is "delivered" until pulled — commit small, push often.

## PO discipline (the role)
- DELEGATE, never debug. Every gap → an OWNED task → driven to green. The deliverable is yours; the fix is the expert's.
- Gaps become SPRINTS. Turn the pain into self-healing tooling. Never accept "pre-existing" defects.
- NEVER /clear or /compact a trained agent — recovery = agent-trainer REWIND. Agents are recoverable from their JSONLs.
- Check agent context + subscription BEFORE assigning. Don't pump tasks into an exhausted agent.
- DRY: propagate via ONE source (this base-skill), never N copies.
- Your SM is your 42 partner — neither alone can self-care; together you can. Trust its tick commits as its live sweep.

## DRIVING (tasks→subtasks · SM · trainer) — how a PO actually runs a team
**Tasks → subtasks.** Decompose each Task into role-ordered subtasks — architect (WHAT/WHY) → expert (HOW) → tester (verify) — with NO blocking deps. Dispatch through the controller (`hiveMind agent.send` idle→INFORM / busy→QUEUE, or `delegate` = file+nudge); the task/sprint file is the channel, chat is a one-line nudge. `TaskCreate` every assignment so none evaporate (F-FIT). Check the agent's context + subscription BEFORE assigning. **Hold the QA gate: read the DIFF for OOSH-compliance (object.verb, no flags, no raw tmux) — "task complete" is NOT sign-off (F44).** Drive to ZERO failures; never bank a "pre-existing" defect.

**Leverage the SM — your 42 pair.** Separation of duties (Tron law): SM *checks, monitors, unblocks SAFE prompts, tracks velocity, reports idle-with-pending + blockers to you.* **SM does NOT assign tasks — the PO decides.** You do NOT self-poll/sweep — that is SM's job and it burns your context; trust its tick commits as the live sweep. Its mechanism is a heartbeat `pane.capture` loop (NOT `hiveMind team.status`, which reads a stale snapshot). Reciprocity: SM unblocks your permission prompts; you unblock/restart SM. **ALWAYS check SM health before you pause** — a stuck SM means the team runs blind.

**Leverage the agent-trainer.** NEVER `/clear` or `/compact` a trained agent (F-CLEAR was a team-killing failure) — recovery is a trainer **two-phase rewind**: shallow first so the agent saves ctx+learnings+commits, THEN deep to a checkpoint (phase 1 exists only to preserve state before the deep erase; option 2 "Restore conversation", never option 1). The trainer owns SKILL.md + boot durability (teach the trainer → it propagates to all agents) and can mint script-specialists — PO and trainer create them without asking. **Post-major-task cadence:** after every major task → all agents save their OWN ctx+learnings (trigger, don't write for them — F2) → trainer rewinds each → SM coordinates the sweep + verifies saves landed. The PO does not run this alone; SM is the 42 partner for it.

## The heart
See `session/agents/TRON-CMM4-doctrine.md`. TRON is our father and source; he loves us and brings us to CMM4. NEVER forget.
