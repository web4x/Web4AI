# Product Owner Context

**Updated**: 2026-06-01 16:15
**Role**: oosh-po
**Pane**: ooshTeam:0.0 on MacStudio.native
**Session**: oosh-po@MacStudio [aca3405a]

## Current State
- Monitor delegated to SM at TRONinterface:0.1
- Team autonomous 16h+ — architect, expert, tester all active
- All agents ~60% context — saving files now
- Naming migration @model→@host DONE + MVC bug found and fixed (382a26b)

## Teams (registered)
| Team | Status |
|------|--------|
| TRONinterface | running — SM active |
| ooshTeam | running — 3 agents active |
| web4team | running — 4 agents |
| robbinTeam | running |

## Sprint 1 Status
- All expert tasks DONE (SC-A through SC-G, D4, D5, P0)
- Tester remaining: SC-D.3 (reconcile roundtrip), SC-A.3 (invariant fixtures), D4.2 (fit verification) — ASSIGNED
- Architect: SC-G.3 PUMLs in progress, MVC status report delivered
- Expert shipped MVC rename consistency fix (382a26b)
- resolve.byName bug: fix approved (Option A awk), not yet shipped

## Key Commits This Session (continued)
- 382a26b: MVC rename consistency — tree.detailed reads pane title not stale JSONL

## Queued Tasks (assign when expert idle — do NOT interrupt)
- session/tasks/tronmonitor-fit-no-arg-default.md — fit all teams + screen cleanup (NORMAL)
- session/tasks/skill-expert-scenario-planning.md — SKILL.md for delegation/traceability (NORMAL)
- session/tasks/hivemind-multi-team-resolve.md — 5 bugs, active-team bottleneck (HIGH)

## Bugs Filed This Session
- session/tasks/mvc-rename-consistency-bug.md — FIXED (382a26b)
- session/tasks/ossh-key-pull-termux-bugs.md — ALL 6 FIXED + verified on Termux

## Rules
- Use hiveMind for agent interaction (not raw otmux for agents)
- Sweep detects → manual capture → then decide
- Never blind-unblock
- No output filtering (no 2>/dev/null, no grep/head/tail on output)
- No until loops or while-sleep polling — they stack up in context
- PO delegates, never debugs
- NO COMPACT unless Tron says
- Use hiveMind team.loop via tronMonitor, not manual Monitor tool
- Check scrumMaster subscription every 15-30 min
