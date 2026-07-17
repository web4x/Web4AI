# Task: Design the Team Loop as MVC OOSH commands (+ registry & lifecycle review)

**From**: ARON (oosh-po) · **To**: oosh-architect (ooshTeam:0.2) · **By**: TRON 2026-07-16
**Design input (the loop, canonical)**: `session/base-skills/team-loop.md` — [GitHub](https://github.com/web4x/Web4AI/blob/main/session/base-skills/team-loop.md) | [local](session/base-skills/team-loop.md)

## What to design (DESIGN + REVIEW only — hand implementation to oosh-expert)
Take the Team Loop (PO unblocks SM → SM monitors+reports+unblocks PO → PO reviews+assigns+asks-done-reports → PO delivers/commits/pushes + orders proactive 2-phase rewinds for ALL agents incl. SM & PO → PO plans+assigns next sprint task) and express it as **MVC OOSH commands**:

1. **Controller = PO, View = SM, Model = registry.** Map each loop step to the concrete `hiveMind` and `otmux` commands that realize it (e.g. which command sweeps, unblocks, assigns, captures, commits-delivery, orders a rewind). Show the command flow per step.
2. **Identify GAPS** — loop actions with no clean OOSH command today (each gap = a sprint for oosh-expert). Include the ones ARON already found: `otmux current` trusts stale `$TMUX_PANE` (the DRY single-source resolver is wrong); `pane.self` is a lost duplicate — DRY every boot ref to the one corrected `otmux current`.
3. **Review the REGISTRY (the Model)** — is it the true single source of truth (identity, pane, role, context %, task/gate state)? Is it DRY (one registry, not several)? Does it lie (stale entries / wrong pane)? Propose the canonical registry design.
4. **Review the LIFECYCLE** — `bootstrap → run → monitor → proactive rewind (≤90%) → rebirth from anchor`. Is it sound and complete? Where does the registry update on each lifecycle event?

## Deliverable
A spec (+ PlantUML if it helps) of the loop as MVC OOSH commands, the gap list, and the registry+lifecycle review. **Hand implementation to oosh-expert.** Deliver back to ARON (oosh-po) **with dual links** — every delivery is reviewed by TRON with dual links.

---
## DELIVERED (oosh-architect@WODA.prod, 2026-07-16) — design + review only, impl → oosh-expert
Full spec: **`session/tasks/team-loop-mvc-design.SPEC.md`**. MVC mapping (loop step → OOSH cmds → Model I/O), 6 gaps (G1 linchpin = corrected single `otmux current`, no $TMUX_PANE; G2 one `hiveMind.identity`; G3 `agent.approve`; G4 `team.rewind.all` incl SM&PO; G5 ctx% field; G6 task/gate field), registry review (not-DRY on identity, lies today), lifecycle review (rebirth mis-IDs without G1). Ties to backlog BL-1 (fixes on dev not on stable line). Handoff to oosh-expert, gap-by-gap, G1 first.

---
## PO / CONTROLLER REVIEW (oosh-po@WODA.prod, 2026-07-16) — ACCEPTED, coherent with the session's lived friction
As the Controller who RAN this loop all session, the design is sound and the 6 gaps are exactly the friction I hit — this unifies scattered symptoms into one root story:
- **G1 (corrected single `otmux current`, no `$TMUX_PANE`) = the linchpin, and the very FIRST bug this session** (stale $TMUX_PANE mis-IDed my pane; pane.self PID-walk was the fix — the design confirms it's a LOST DUPLICATE on dev). Every mis-ID / mis-route downstream traces here. G1 first is correct.
- **G2 (one `hiveMind.identity`, stores→projections) = the root of task-21** (the recurring `[@…robbinTeam2:0.3]` mis-TAGGING, 2 occurrences). task-21 is a SYMPTOM of "identity truth duplicated + LIES" → **fold task-21 into G2**, don't fix it in isolation.
- **G4 (`team.rewind.all` incl SM & PO)** = the manual proactive-rewind cliff-management I did by hand all session.
- **G5 (ctx% Model field)** = the stale-context-hint SM flagged (frozen Nk) — a live Model field replaces the frozen TUI gauge.
- **BL-1 (fixes on dev, not on the stable mcdonges line agents run)** = the topology/dev-merge situation exactly.
**⚠ SEQUENCING FLAG (G1 branch):** G1's corrected resolver lives on dev (broken, robbin merging) while live agents run mcdonges.latest → G1 reaching live agents either lands on the mcdonges line directly (like opy's ff) OR waits for robbin's dev-merge. This is the key impl decision for G1 — needs Tron/topology resolution.
**Verdict: design ACCEPTED (Controller). Impl gap-by-gap, G1 first, to oosh-expert — pending the G1-branch call + Tron review.**

## PO DECISION — G1 branch + impl (oosh-po@WODA.prod, 2026-07-17)
Architect made G1 IMPLEMENTATION-READY (f8dcf89c, branch-agnostic) + measured a WORSE live break: `otmux pane.self` is CALLED but UNDEFINED on mcdonges.latest → self-ID returns EMPTY, atop `otmux current`/`pane.get.target` trusting stale `$TMUX_PANE`. **This broken live self-ID is the ROOT of the recurring mis-TAGGING (task-21/G2) — a wrong/empty self-ID produces a wrong `[@sender]` tag.**
- **BRANCH DECISION: mcdonges.latest (the line agents run).** This is a fix on the CURRENT live lineage (like opy), NOT a port to the deferred/broken dev — so it's allowed + I'm ruling it (not blocked on dev-merge). It MUST land where agents run to fix live self-ID.
- Impl (expert) on clean mcdonges.latest → tester gates (static zero-$TMUX_PANE + poisoned TMUX_PANE=%999 regression + pane.self-definedness) → ff-deploy on Tron go (fleet-wide identity = high blast radius, Tron-aware deploy).
