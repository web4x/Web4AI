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
