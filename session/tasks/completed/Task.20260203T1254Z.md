# Task 20 — Operational Fixes: Pane Cleanup + Session ID Detection

**Created**: 2026-02-01T18:23Z
**Status**: Done — all steps completed. Expert (e2b5515), Tester verified. Updated by Task Agent 2026-02-03
**Requested by**: Product Owner
**Assigned to**: Expert (0.4), Orchestrator (0.0)

## Original Directive (verbatim)

> 1) Pane 0.7 is an unregistered shell - either clean it up or assign it a role. 2) Session IDs missing on: product-owner (0.1), task-agent (0.3), scrum-master (0.6). Only orchestrator, agent-trainer, and expert have session IDs. Fix the session ID detection for all agents. 3) Tester (0.5) is still just a shell - not in Claude Code. Fix all of this.

## Analysis

1. **Pane 0.7**: Empty bash shell from earlier split. No agent assigned. Action: kill pane.
2. **Session ID detection**: `hiveMind team.status` shows session IDs for some agents but not others. Likely the detection method doesn't work for all agents. Expert to fix.
3. **Tester (0.5) as "shell"**: Tester IS in Claude Code (just ran full 11-suite validation), but `team.status` reports it as "(shell)". Detection bug — the idle Claude Code prompt may look like a shell to the detector.

## Plan

| Step | Agent | Action |
|------|-------|--------|
| 1 | Orchestrator | Kill pane 0.7 via otmux, remove from registry |
| 2 | Expert | Fix session ID detection in hiveMind team.status for all agents |
| 3 | Expert | Fix "(shell)" false positive for idle Claude Code sessions |
| 4 | oosh-tester | Verify team.status shows correct session IDs and no shell false positives for all panes — **DONE** |
