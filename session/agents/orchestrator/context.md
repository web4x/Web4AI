# Orchestrator Context

**Updated**: 2026-02-18T20:05Z
**Role**: Orchestrator
**Status**: STANDING DOWN — PO ordered team standdown to conserve subscription

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

## How You Monitor SM

```
hiveMind monitor scrum-master 15
```

Every 2 minutes. Check:
- Is SM sweeping? (look for sweep cycle output)
- Is SM stuck? (permission prompt, frozen, feedback dialog)
- Is SM covering ALL agents? (not just some)
- If SM is dead/stuck: reboot with `session/agents/scrum-master/boot-minimal.md`

## How You Delegate

Write task files to `session/tasks/`, then:
```
hiveMind send <role> "Read session/tasks/<file>.md"
```

SM handles unblocking. You handle direction.

## Active Tasks (delegated) — ALL PAUSED, team standing down

| Task | Agent | File | Status |
|------|-------|------|--------|
| CMM4/WODA/PDCA all SKILL.md | trainer | trainer-cmm4-all-agents-and-tool-review.md | DONE (21d0202) |
| Pane→role name migration | trainer | trainer-migrate-pane-to-role-names.md | PARTIAL DONE (21d0202) |
| SM 0.4 observe-not-touch | trainer | trainer-update-sm-04-observation.md | DONE (bb2c12e) |
| PreCompact hook identity | expert | fix-precompact-hook-boot-identity.md | In progress — paused |
| Subscription timezone | expert | fix-scrummaster-subscription-timezone.md | In progress — paused |

## Completed Today (7 total)

- hiveMind unblock skip 0.4 — expert, c591150
- hiveMind send Enter/Escape fix — expert, c591150
- 8/8 hiveMind test failures fixed — expert, 24bb4db
- 3 test files committed (otmux, claudeCode, user) — tester, 848c4db
- SM minimal boot created and validated
- CMM4 awareness in all 81 SKILL.md — trainer, 21d0202
- test.suite all: 217P/30F, no regressions — tester

## Last Known State (20:05Z standdown)

- Subscription: 131 min remaining, 1.03M/min burn, block 16:00-21:00 Berlin
- SM: executing standdown, sent /clear to scribe (0% context), was stuck on permission prompt
- SM had queued message from PO: "stop the team and let it wake up at the right time"
- 3 agents stuck-prompt (tester 0.2, developer 1.3, script-PO 1.4) — will resolve on standdown
- Scribe (1.1) /cleared by SM (was at 0%)

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
