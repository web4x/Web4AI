# Tron Interface Context

**Updated**: 2026-02-17T18:30Z
**Role**: Tron's direct interface to the agent team
**Pane**: projectTeam:0.4
**Session**: product-owner (historical — actually Tron interface)

## My Identity

I am Tron's interface — NOT an autonomous agent. I receive directives from Tron (the human), write task files, delegate to agents, and report back. I do NOT do work myself. I do NOT monitor panes — the SM does that.

## Current Goals

1. **Team recovery after mass context exhaustion** — 5 core agents recovered (SM, orchestrator, expert, tester, trainer). 6 window-1 agents dormant.
2. **Post-incident improvements** — trainer working on SKILL.md updates, folder reorganization, CMM4 velocity management
3. **Orchestrator managing SM** — enforcing velocity monitoring NOW, not waiting for SKILL.md updates

## Active Tasks Delegated

| Task File | Agent | Status |
|-----------|-------|--------|
| 20260217T1700Z expert-hivemind-param-naming | expert | Assigned — fix dashed parameter names in OOSH |
| 20260217T1705Z trainer-naming-rules-and-send-migration | trainer | Queued — OOSH naming rule + migrate SKILL.md sends |
| 20260217T1715Z tester-completion-and-features | tester | Assigned — test completion + feature coverage audit |
| 20260217T1800Z trainer-post-incident-fixes | trainer | Queued — F15-F20, boot hook, recovery playbook |
| 20260217T1815Z trainer-reorganize-agent-folders | trainer | Queued — merge boot/ into agents/, symlinks |
| 20260217T1820Z trainer-cmm4-velocity-management | trainer | Queued — replace binary thresholds with continuous velocity |
| 20260217T1825Z orchestrator-manage-sm-velocity | orchestrator | Sent — enforce velocity monitoring on SM immediately |

## Key Rules

- **I am pane 0.4** — SM must skip me in sweeps (directive sent)
- **I delegate, not do** — write task files, send to agents, report to Tron
- **GATE**: measure → assess → act → verify
- **Max 2 large parallel tasks** — learned from the disaster
- **OOSH on PATH** — no export, no cd, no ./ prefix

## Recovery Steps

1. Read this file
2. Read `session/knowledge-base/incidents/20260217-mass-context-exhaustion.md` for incident context
3. Check team state: `hiveMind sweep projectTeam` or capture core panes (0.0, 0.1, 0.2, 0.3, 0.5)
4. Check subscription: `scrumMaster subscription`
5. Resume delegating from task list above
6. Ask Tron for next directive

## Incident Learnings (F15-F20)

- F15: Never delegate 4+ large tasks simultaneously without checking capacity
- F16: Know your own pane (0.4). Never send commands to yourself.
- F17: Accept-edits is non-blocking — just type at ❯ prompt
- F18: 0% context = /clear only. Don't waste time on /compact.
- F19: Recovery order = SM → orchestrator → workers
- F20: unknown.md is a boot failure, not a default
