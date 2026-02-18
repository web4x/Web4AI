# Orchestrator Context

**Updated**: 2026-02-18T12:50Z
**Role**: Orchestrator
**Pane**: projectTeam:0.0

## TEAM GOALS (read `session/team-goals.md` — single source of truth)

Read `session/team-goals.md` on every boot. Every action must advance a goal. If you're not advancing a goal, you're wasting context.

## Current Task

1. **SM is alive** — minimal boot worked (15 lines). Monitor survival across cycles.
2. **Drive idle agents toward goals** — expert, tester, trainer are idle. Assign from queued tasks below.
3. **Context monitoring investigation** — team needs to validate that context % data from panes is accurate enough for velocity monitoring. Assign expert to investigate, tester to validate.

## Standing Authorizations (from PO)

- /clear on SM at 0% is authorized recovery — no PO approval needed
- /clear on working agents still needs PO approval
- Binary 80%/90% thresholds are REPLACED by CMM4 velocity (see SKILL.md)

## Queued Tasks (route to agents via SM)

| Task | Assign To | Goal # | Priority |
|------|-----------|--------|----------|
| Context monitoring data quality investigation | expert + tester | 3, 4 | HIGH |
| Fix dashed parameter names (hiveMind/otmux) | expert | 5 | HIGH |
| Create missing test files: test.otmux, test.claudeCode, test.user | tester + expert | 2 | MEDIUM |
| Fix 8 hiveMind test failures (env/config) | expert | 5 | MEDIUM |
| hiveMind.parameter.completion.name() | expert | 5 | LOW |
| Naming rules + SKILL.md send migration | trainer | 5 | LOW |

## Team Status (Feb 18 12:45Z)

| Pane | Agent | Status |
|------|-------|--------|
| 0.0 | Orchestrator | Active — driving goals |
| 0.1 | Expert | IDLE — needs assignment |
| 0.2 | Tester | IDLE — needs assignment |
| 0.3 | SM | ALIVE — minimal boot, sweep cycle 2+ |
| 0.4 | PO (Tron) | **DO NOT TOUCH** |
| 0.5 | Trainer | IDLE, rate-limited |
| 1.0 | Writer | Active, Ch34+ |
| 1.1 | Scribe | Active, monitoring writer |
| 1.2 | Task-agent | Post-compact, idle |
| 1.3 | Developer | Idle |
| 1.4 | Script-PO | Active, BUG 3 |

## Key Fixes Today

- SM sustainability: minimal boot (15 lines) replaces full boot (59 lines + SKILL.md + context + learnings)
- Orchestrator SKILL.md: binary 90% → CMM4 velocity, SM recovery authorization added
- PO goals now in orchestrator context — drive toward them, not just monitor

## Recovery

1. Read this file
2. Check SM: `hiveMind monitor scrum-master 30`
3. Check subscription: `scrumMaster subscription`
4. Schedule wakeup: `sleep 120 && echo "WAKEUP"`
5. Drive queued tasks toward idle agents — expert and tester need work NOW
