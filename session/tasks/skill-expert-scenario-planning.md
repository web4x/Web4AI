# Task: Skill-Expert — scenario-based SKILL.md for planning, delegation, traceability

**Priority**: NORMAL (queue — do NOT interrupt current work)
**Date**: 2026-06-01
**Origin**: Tron directive, T139 (robbinTeam blocked), T137 (planner scenarios)

## Context

The robbinTeam planner (learnings #19) established that planning.md becomes a generated VIEW from scenario JSON units. The planner reads/writes scenario.json as the planning unit. But SKILL.md files don't yet leverage scenarios for:
- Task delegation (which agent gets what, based on scenario state)
- Traceability (req → UC → PUML → method → test chain)
- Consistency checking (does the plan match the code reality?)

## What the skill-expert should produce

1. **SKILL.md template section**: "Scenario Integration" — how each role uses scenario.json for task intake, status reporting, and handoff
2. **Planning-as-view pattern**: document how planning.md is generated from scenario units, not hand-edited
3. **Delegation protocol**: task.plan() → task.startRefinement() → task.assign() FSM verbs mapped to agent roles
4. **Traceability standard**: each task links to scenario UUID, each test links to UC UUID — auditable chain

## Implementation approach

- oosh-expert reads robbin-planner context (session/agents/robbin-planner/context.md + learnings.md)
- Reviews existing scenario model in robbinTeam sprints (S14-S17)
- Writes the SKILL.md template additions
- Writes docs/scenario-planning.md as the reference

## Dependencies

- robbin-planner learnings #19 (scenario-as-planning-unit)
- T133 Task FSM verbs (task.plan, task.startRefinement, etc.)
- T126 ViewGenerator pattern

## Assign when

Expert is idle after current work (branch merge, Termux fixes, tronMonitor). PO decides timing — do NOT interrupt active work for this.
