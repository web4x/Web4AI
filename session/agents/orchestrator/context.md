# Orchestrator Context

**Updated**: 2026-02-19T11:20Z
**Role**: Orchestrator
**Status**: STANDDOWN — 90% subscription per TUI (tool says 13% — WRONG). All agents told to commit+save.

## YOUR JOB (from agent-overview.md)

1. Monitor ScrumMaster ONLY — never capture or send to other panes directly
2. Pass PO directives to workers THROUGH SM or task files
3. Delegate implementation to expert, testing to tester — never do it yourself
4. Respond to CMM4 velocity alerts
5. Collect results, report to PO via orchestrator context.md

## WHAT YOU DO NOT DO

- **NEVER capture worker panes** (expert, tester, trainer, writer, scribe) — that's SM's job
- **NEVER unblock permission prompts** on workers — that's SM's job
- **NEVER implement code or run tests** — delegate
- **NEVER send keys to product-owner pane** — that's Tron
- **NEVER use hardcoded pane addresses** — use `hiveMind resolve <role>` or `hiveMind send <role>`

## TEAM GOALS → `session/team-goals.md`

## How You Check SM (10-15 min cadence, NOT 2 min)

```
hiveMind monitor scrum-master 10
```

Every 10-15 minutes. ONE quick capture. Check:
- Is SM alive? (active or accept-edits = alive)
- If SM marathon >15 min: send yield command, unblock stuck agents yourself
- If SM dead: reboot with `session/agents/scrum-master/boot-curated.md`

**Between checks: DELEGATE. Assign idle agents. Collect .done files. Report to PO.**
Monitoring is SM's job. Delegation is YOUR job. Stop burning tokens on sweeps.

## How You Delegate

Write task files to `session/tasks/`, then:
```
hiveMind send <role> "Read session/tasks/<file>.md"
```

SM handles unblocking. You handle direction.

## Active Tasks (delegated)

| Task | Agent | File | Goal | Status |
|------|-------|------|------|--------|
| Marathon response fix (SKILL.md) | trainer | fix-orchestrator-marathon-responses.md | G3 | Assigned |
| Subscription trend (SKILL.md) | trainer | sm-subscription-trend-monitoring.md | G4 | Assigned |
| Prefer built-in tools (SKILL.md) | trainer | trainer-prefer-builtin-tools.md | G1 | Assigned |
| Marathon detection (enforce) | SM | fix-orchestrator-marathon-responses.md | G3 | Assigned |
| Trend tracking (implement) | SM | sm-subscription-trend-monitoring.md | G4 | Assigned |
| PreCompact hook identity | expert | fix-precompact-hook-boot-identity.md | G5 | Resumed |
| Subscription timezone | expert | fix-scrummaster-subscription-timezone.md | G5 | Resumed |

## Completed Today (7 total)

- hiveMind unblock skip 0.4 — expert, c591150
- hiveMind send Enter/Escape fix — expert, c591150
- 8/8 hiveMind test failures fixed — expert, 24bb4db
- 3 test files committed (otmux, claudeCode, user) — tester, 848c4db
- SM minimal boot created and validated
- CMM4 awareness in all 81 SKILL.md — trainer, 21d0202
- test.suite all: 217P/30F, no regressions — tester

## Current State (Feb 19 ~09:50Z)

- SM: rebooted, sweeping + running subscription check
- Expert (0.1): OFFLINE — SM will detect and reboot. Task ready: 20260219T0945Z (G5 hiveMind param)
- Tester (0.2): active, assigned G2 test gaps task
- Developer (1.3): accept-edits, working on G5 action→method from last block
- Trainer (0.5): accept-edits, working on 3 SKILL.md updates
- Writer (1.0) + Scribe (1.1): AUTONOMOUS — do not touch
- PO directive: po-directive-hierarchy-restart.md — hierarchy is law
- NEW RULE: Never run single response >15 min.

## Pending
- **MY TASK (from PO)**: After next SM compact, verify curated boot works:
  1. Send boot-curated.md (not auto-generated)
  2. Wait 2 min, capture 30+ lines
  3. Verify: hiveMind sweep in use? In the loop? Read learnings?
  4. If degraded: flag to PO
- Expert assigned: create boot-curated.md + update PreCompact hook (HIGH)
- Trainer assigned: update SM SKILL.md boot recovery section (HIGH)

## Standing Authorizations

- /clear on SM at 0% = authorized (PO standing order)
- /clear on working agents = needs PO approval

## CMM4 Velocity

Proportional response based on projected exhaustion:
- >60 min → full speed
- 30-60 → no new large tasks
- 15-30 → agents commit current work
- 5-15 → trigger context saves
- <5 → compacts in hierarchy order

## Recovery

1. Read this file
2. Read `session/team-goals.md`
3. `scrumMaster subscription`
4. `hiveMind monitor scrum-master 15` — is SM alive and sweeping?
5. If SM dead: /clear + `session/agents/scrum-master/boot-minimal.md`
6. Set 2-min SM monitoring wakeup
7. ONLY monitor SM. SM monitors everyone else.
