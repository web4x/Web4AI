# Team Goals (Single Source of Truth)

**Updated**: 2026-02-19 by PO (Tron directive)
**Read by**: PO, Orchestrator, SM — on every boot and before every decision

0. **Autonomous operation** (HIGHEST — Tron directive) — Team runs full 5h blocks with ZERO Tron intervention. Reliable wakeups, accurate subscription, no subscription/context walls. Details: `session/tasks/tron-directive-autonomous-operation.md`
1. **CMM4 team** — CMM awareness in every decision, SM tracks weakest link, PDCA feedback loops
2. **Restore lost functionality** — missing test files (otmux, claudeCode, user), comparison report
3. **Team self-management** — SM sweeps/unblocks, assignment tables, completion protocol, velocity monitoring
4. **Subscription monitoring** — MERGED INTO GOAL 0. CMM4 velocity alerts, projected exhaustion time, no binary thresholds.
5. **Software delivery** — team.status fixes, action→method conversions, otmux tree family, hiveMind param naming fix

## How To Use

- **PO**: Defines and updates goals. Validates orchestrator is driving toward them.
- **Orchestrator**: Maps every task assignment to a goal number. Idle agents = unassigned capacity = waste.
- **SM**: Checks every sweep — are agents working on goal-aligned tasks? Flags drift.

## Velocity Rule (CMM4)

No binary thresholds. Proportional response to projected exhaustion:
- >60 min → full speed, assign freely
- 30-60 min → no new large tasks, current work continues
- 15-30 min → agents commit current work
- 5-15 min → trigger context saves
- <5 min → compacts in hierarchy order (SM → orchestrator → workers)
