# Product Owner Context

**Updated**: 2026-06-10 19:55
**Role**: TRONinterface-agent (master PO)
**Pane**: TRONinterface:0.0 on MacStudio.native
**Session**: TRONinterface-agent@MacStudio
**My context**: 76% used at save time — rewind soon

## Current State
- tronMonitor REPAIRED (2026-06-10): killed stale ooshDebug screen window. 3 live windows: robbinTeam, baseTeam, ooshTeam. Cycle Ctrl-a n.
- SM at TRONinterface:0.1 monitors teams, reports blockers only
- Model upgraded to Opus 4.7 (1M)

## Teams
| Team | Status |
|------|--------|
| TRONinterface | running — me(0.0) + SM(0.1) + PO-shell(0.2) + tronMonitor(0.3) |
| ooshTeam | running — "All tests successful" visible |
| robbinTeam | running — architect 885/885 pass, S16 8/8 shipped |
| baseTeam | running — agent-trainer + shells |
| web4team / upDownTeam / unitTeam | background |

## Known Open Issues (from SM reports, June 2)
- robbin-expert: persistent API_ERROR ~22min (may have self-recovered — verify)
- oosh-po (787k) + oosh-tester (839k) context crisis — saves done, rewinds pending TRON
- robbin-po + agent-trainer hit 0% (May 29) — TRON intervention pending
- T139 blocked: needs hiveMind-expert → recommended redirect to oosh-expert

## Queued Tasks (assign when expert idle)
- session/tasks/tronmonitor-fit-no-arg-default.md — fit shipped (29914d5), screen cleanup remains
- session/tasks/skill-expert-scenario-planning.md
- session/tasks/hivemind-multi-team-resolve.md — partially shipped (03149ef)
- otmux.attach parameter naming bug

## Sprint Status
- Sprint 0 + Sprint 1: DONE
- S16 (robbinTeam): 8/8 impl-shipped
- Awaiting Tron directive for next sprint
- Monaco editor sprint question still unanswered

## tronMonitor Operations (repaired knowledge)
- Lives in TRONinterface:0.3 as GNU screen session "tronMon"
- Env file: ~/config/tronMonitor.env (format: index|teamName)
- Each screen window: TMUX= tmux attach -r -t <team> (read-only)
- Stale windows show "(dead)" panes — kill with Ctrl-a k, y
- tronMonitor fit (no-arg) = fits ALL teams (shipped 29914d5)
- tronMonitor verify/list/prune/reset/setup exist; reset is fragile with stale env entries

## Rules
- Use hiveMind for agent interaction
- Sweep detects → manual capture → then decide
- Never blind-unblock
- No output filtering
- No until/while-sleep polling loops
- PO delegates, never debugs
- NO COMPACT, NO RESTART, NO REWIND of agents — ONLY TRON decides
- Failure is failure — no "pre-existing" excuse
- CMM4: task file is the spec, chat is the nudge
- Check scrumMaster subscription every 15-30 min
- Save context at 35% remaining
- /rewind ALWAYS option 2
- Git push after every commit
