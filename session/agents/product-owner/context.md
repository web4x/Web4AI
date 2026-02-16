# Product Owner Agent Context

**Session**: product-owner@opus
**Role**: product-owner
**Pane**: projectTeam:0.4
**Updated**: 2026-02-12T18:00Z
**State**: compacting — post-incident investigation

## CURRENT GOAL — #1 PRIORITY

**Self-improving CMM4 team. Agent health + adaptive sweep timing.**

### Subscription measurement: DONE
`scrumMaster subscription` and `subscription.json` work. Alert thresholds work (saw WARNING at 83%).

### The 90% Rule (Tron directive)
80%=throttle, 90%=stop. SM has directive (20260212T1732Z.task.md) for adaptive sweep timing.

## CRITICAL INCIDENT: Rebase Destroyed Work

**Full writeup**: `session/teamfailure.md`

hiveMind-expert ran `git pull --rebase` on Feb 12 17:20. Dropped commit `17340f6` containing:
- otmux tree three-level view (session IDs per pane)
- claudeCode FORCE_COLOR fix, list.named(), improved list
- ossh ssh directory improvements
- user script improvements

**Recovery**: Files extracted to `/Users/donges/oosh/restore/`. Tron manually comparing via `diffReview` tmux session.

**Prevention**: `pull.rebase=false` in repo config. NEVER rebase. All SKILL.md being updated.

## TEAMS RUNNING

- **projectTeam** — 12 panes (0.0-0.5, 1.0-1.5)
- **hiveMindTeam** — 2 panes (expert + tester)
- **diffReview** — Tron's manual comparison session

## ACTIVE TASKS

1. SM adaptive sweep timing (20260212T1732Z) — calculate sleep from burn rate
2. Completion reporting protocol (20260212T1702Z) — trainer pushing to SKILL.md
3. Git safety rule — trainer pushing "NEVER rebase" to all SKILL.md
4. Restore lost features from `17340f6` (20260212T1745Z) — Tron reviewing
5. scrumMasterTeam deployment (20260212T1731Z) — orchestrator

## VERIFIED DONE

- [x] scrumMaster subscription + subscription.json
- [x] hiveMind team.status with session IDs
- [x] hiveMindTeam deployed and productive
- [x] Sweep interval parameter (hiveMind sweep session interval)
- [x] 33 script specialist teams created
- [x] Task naming convention enforced
- [x] Rebase forensic investigation complete
- [x] teamfailure.md documented
- [x] pull.rebase=false set in repo

## FAILURES (10 this session)

F1-F9: See learnings.md
F10: git pull --rebase destroyed uncommitted work (17340f6)

## RECOVERY STEPS

1. "I am the Product Owner agent."
2. Read `session/agents/product-owner/context.md` (this file)
3. `scrumMaster subscription` — check subscription FIRST
4. `hiveMind sweep projectTeam` — team state
5. Check `session/teamfailure.md` for incident status
6. Drive adaptive sweep timing as #1 priority
