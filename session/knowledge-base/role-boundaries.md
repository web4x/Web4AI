# KB #29: Role Boundaries — Don't Compensate, Delegate

## Problem
When PO does SM's monitoring, trainer's training, or expert's specs:
1. The compensated role never develops the capability
2. PO burns context on non-PO work
3. Gaps are masked — system looks functional but isn't self-sustaining
4. Composed maturity = weakest link stays low

Example: oosh-expert burned to 0% unnoticed because PO was monitoring manually instead of SM. SM's monitoring capability stayed at CMM1, making the team's monitoring maturity CMM1 regardless of PO's skill.

## Solution: Strict Role Boundaries

| Role | Does | Does NOT |
|------|------|----------|
| PO | Plan (PDCA), decide, agree with Tron, approve plans | Train agents, monitor context, write code, coordinate |
| Orchestrator | Coordinate execution, delegate, collect results, report | Make architectural decisions, make priority decisions |
| SM | Monitor context, approve permissions, enforce OOSH/roles, remove impediments | Write code, train agents, delegate tasks, interact with plan-mode agents |
| Trainer | Train agents, execute compacts, update SKILL.md/boot.md | Make prioritization decisions, coordinate teams |
| Expert | Architectural reviews, DRY prevention, specifications | Implementation (that's hiveMindTeam) |

## Key Principle
"Fix the weakest link, don't work around it." The system's CMM level = lowest component. If SM monitoring is CMM1, the whole team's monitoring is CMM1 — no matter how good PO is at compensating.

## Who needs this
- PO: stop compensating, delegate properly
- SM: own the monitoring responsibility
- Trainer: train roles, not just technical skills
- Orchestrator: enforce boundaries when agents cross them
- All agents: understand their role limits

## Delegation & handoff (folded from team-delegation.md, 2026-08-07)
- **File-based handoff:** write the work to a task file in `session/tasks/`, send only a SHORT pointer — never long instructions via `otmux send`/`hiveMind send` (they garble). Detail lives in the file.
- **Current pane→role map:** see `.claude/agents/agent-overview.md`. (The old `projectTeam` 0.0–1.4 map is retired — teams are now per-host: `robbinTeam2` / `ooshTeam` / `baseTeam` / `Temple`.)
- Action checklist: `actions/delegate-task.md`.
