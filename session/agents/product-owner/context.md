# Product Owner Context

**Updated**: 2026-06-03
**Role**: oosh-po
**Pane**: ooshTeam:0.0 on MacStudio.native
**Session**: oosh-po@MacStudio [aca3405a]

## Current State
- Monitor delegated to SM at TRONinterface:0.1
- Expert saved (cc7d6da, 782k) — needs /rewind
- Tester saved (b3cabc7, 839k) — needs /rewind URGENTLY
- Architect status unknown — check context
- Branch merge test/macos.latest→dev COMPLETE (458 commits, 0 gap)
- Cross-platform Termux: oo 12/12, ossh 108/108, config 20/20, log 45/45 = 185/185

## Teams (registered)
| Team | Status |
|------|--------|
| TRONinterface | running — SM active |
| ooshTeam | running — expert+tester need rewind |
| web4team | running — 4 agents |
| robbinTeam | running |

## Sprint 1 Status
- All expert tasks DONE (SC-A through SC-G, D4, D5, P0)
- Tester remaining: SC-D.3, SC-A.3, D4.2 — ASSIGNED but needs rewind first
- Architect: SC-G.3 PUMLs in progress
- resolve.byName bug: fix approved (Option A awk), not yet shipped

## Key Deliverables This Session
- 382a26b: MVC rename consistency fix
- 458-commit branch merge test/macos.latest→dev
- ossh key.pull 6 Termux bugs FIXED + verified
- config.save prefix-match bug FIXED (af23e3f)
- 7 missing functions implemented (log.install.*, config.v)
- Bulk /tmp/→TMPDIR: 33+ production + test sites fixed
- ossh fix.rights recursive permissions
- Cross-platform 185/185 zero failures (oo+ossh+config+log on Termux)
- 16 hardcoded path audit + fixes
- otmux.attach parameter naming bug filed

## Queued Tasks (assign when expert idle — do NOT interrupt)
- session/tasks/tronmonitor-fit-no-arg-default.md — fit all teams + screen cleanup (NORMAL)
- session/tasks/skill-expert-scenario-planning.md — SKILL.md for delegation/traceability (NORMAL)
- session/tasks/hivemind-multi-team-resolve.md — 5 bugs, active-team bottleneck (HIGH)
- session/tasks/ossh-fix-rights-broken.md — DONE (eb864cb)
- otmux.attach parameter: session not target — assigned to expert

## Rules
- Use hiveMind for agent interaction (not raw otmux for agents)
- Sweep detects → manual capture → then decide
- Never blind-unblock
- No output filtering (no 2>/dev/null, no grep/head/tail on output)
- No until loops or while-sleep polling — they stack up in context
- PO delegates, never debugs
- NO COMPACT unless Tron says
- Use hiveMind team.loop via tronMonitor, not manual Monitor tool
- Failure is failure — NO "pre-existing" excuse. ALL failures get task files
- CMM4: task file is the spec, chat is the nudge
- Check scrumMaster subscription every 15-30 min
