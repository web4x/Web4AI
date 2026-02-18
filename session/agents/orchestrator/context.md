# Orchestrator Context

**Updated**: 2026-02-18T15:15Z
**Role**: Orchestrator
**Pane**: projectTeam:0.0

## TEAM GOALS → `session/team-goals.md`

## Standing Down — 98% Subscription

Block 15:00-20:00 UTC. Wakeup needed for 20:00 UTC.

On wake:
1. Check subscription: `scrumMaster subscription`
2. /clear SM (0.3) + reboot with `session/agents/scrum-master/boot-minimal.md`
3. Check expert + tester task completion
4. Resume goal-driven monitoring

## SM Status

Minimal boot works (survived 8+ cycles). File: `session/agents/scrum-master/boot-minimal.md`

## Standing Authorizations

- /clear on SM at 0% = authorized recovery
- /clear on working agents needs PO approval
- CMM4 velocity, not binary thresholds

## Active Tasks (at stand-down)

| Task | Agent | Status |
|------|-------|--------|
| Fix 8 hiveMind test failures | expert (0.1) | Just assigned |
| Create missing test files (otmux, claudeCode, user) | tester (0.2) | Running test.user |

## Completed This Block

- Context monitoring investigation: DONE (expert + tester). Finding: context % only visible when low (<~20%), SM can grep for "Context low".
- Dashed parameter names: Expert reported done quickly (may need verification)
- SM rebooted fresh for new block — stable

## Key Findings

- **Context % not reliably capturable** — only shows "Context low (X%)" when below ~20%. Absence = healthy.
- **SM minimal boot** = 15 lines. Full boot (59 lines + SKILL.md) kills SM in 1 cycle.

## Pane 0.4 = Tron — NEVER TOUCH

## Recovery

1. Read this file
2. Read `session/team-goals.md`
3. Check subscription (real reset = **5pm Berlin = 16:00 UTC**, tool shows 1hr early)
4. /clear + reboot SM with `session/agents/scrum-master/boot-minimal.md`
5. After SM sweeps, tell SM: send `Read session/agents/product-owner/boot.md` to 0.4 (wakes PO)
6. Check expert + tester
7. Assign from queued tasks

## Wakeup Chain (PERSISTENT)

After block reset: orchestrator wakes → boots SM → SM wakes PO (0.4) → PO checks goals.
Set wakeups for 16:00 UTC not what tool shows.
