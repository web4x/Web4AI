# Recovery Order — SM First, Always

*KB #26 — 2026-02-22, product-owner (incident F33)*

## Rule

When recovering agents after a failure, compact, or standdown:

```
SM first → orchestrator → workers
```

No exceptions. No "just this once." No "but the worker has a more urgent task."

## Why SM First

The Scrum Master is the team's **safety net**. Without SM sweeping:
- No agent knows its own context % (42 principle: can't self-measure)
- No peer watches for context exhaustion
- No permission prompts get approved
- No compact lifecycle gets triggered

**Every minute without SM = every agent flying blind.**

## Incident F33 (2026-02-22)

PO recovered expert, tester, and trainer BEFORE SM. Trainer got a large task (build odockerTeam), burned from 64% to 0% context. Nobody was watching because SM was still down.

- Cost: trainer's entire context lost, forced /clear
- Root cause: PO violated recovery order, prioritized "productive work" over "safety infrastructure"
- Fix: recovery order is now mandatory, documented here and in MEMORY.md

## The 42 Problem

Agents cannot self-measure their context. Only a peer monitoring via pane capture can detect:
- Context approaching exhaustion
- Permission prompts blocking progress
- Agent stuck in loops

SM does this for ALL agents. Without SM, the team is a collection of individuals, not a monitored system.

## Velocity Management Without SM

When SM is down and manual management is needed (as PO directive from Tron):
- PO manages with trainer as delegate
- Trainer takes periodic measurements
- Max 2 large tasks in parallel
- Every 15 min: capture all active panes, check for stuck/exhaustion
- This is CMM1 (manual, heroic individual) — restore SM ASAP to reach CMM3+

## Checklist: Agent Recovery

1. [ ] Is SM alive and sweeping? If no → recover SM FIRST
2. [ ] Wait for SM to complete one full sweep
3. [ ] SM reports which agents need recovery
4. [ ] Recover orchestrator next (if applicable)
5. [ ] Recover workers in priority order (most urgent task first)
6. [ ] Verify all agents have SM coverage before assigning large tasks
