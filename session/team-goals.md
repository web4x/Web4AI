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

## Commit Every Change (CMM4 MANDATORY — wer schreibt der bleibt)

CMM4 requires regression safety. Every change must be committed so it can be reverted if wrong. Uncommitted work = no regression safety = CMM2 at best.

**Wer schreibt, der bleibt.** What is written stays. What is committed can be reverted. What is uncommitted is lost.

```bash
git -C /Users/Shared/Workspaces/AI/Claude add session/agents/<your-role>/
git -C /Users/Shared/Workspaces/AI/Claude commit -m "<your-role>: <what changed>"
```

**When**: After EVERY file change — context.md, boot.md, learnings.md, any file you touch.
**Why**: 21 agent files were nearly lost on Feb 22. No commit = no rollback = no CMM4.

## Rules Are Eternal (Tron directive — Feb 22)

Rules in agent files (context.md, boot.md, learnings.md, SKILL.md) are permanent institutional knowledge. They must NEVER be deleted.

- **When saving context**: APPEND new rules. Copy ALL existing rules forward.
- **Emergency saves are no excuse** — rules survive even at 9% context.
- **Only ask Tron** about a rule if it CONTRADICTS another rule. Otherwise: keep it.
- **Deleting rules = deleting team knowledge = CMM1.**

## Velocity Rule (CMM4)

No binary thresholds. Proportional response to projected exhaustion:
- >60 min → full speed, assign freely
- 30-60 min → no new large tasks, current work continues
- 15-30 min → agents commit current work
- 5-15 min → trigger context saves
- <5 min → compacts in hierarchy order (SM → orchestrator → workers)
