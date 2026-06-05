# Task: Fork robbin-skill-expert from robbin-expert

**Priority**: HIGH
**Date**: 2026-06-05
**From**: robbin-po via Tron directive
**Assigned**: oosh-expert (execute fork + log tooling gaps)

## Fork Spec

- **Source**: robbin-expert UUID a2ac40b0
- **Target pane**: robbinTeam:2.0 (window already created)
- **New role**: robbin-skill-expert
- **Purpose**: Build .skill files on scenario.json/IOR foundation (S17 done). Coordinate with robbin-planner + robbin-req.
- **First skills to stand up**: capture-tron-quote, propose-task, walk-chain, status-transition

## Execution Steps

1. Verify robbinTeam:2.0 exists and is empty shell
2. Set pane title: `otmux pane.title robbinTeam:2.0 robbin-skill-expert`
3. Lock title: `otmux pane.lock robbinTeam:2.0 robbin-skill-expert`
4. Fork session: `otmux send.enter robbinTeam:2.0 "claudeCode fork a2ac40b0"`
5. Wait for Claude boot
6. Rename session: send `/rename robbin-skill-expert@MacStudio`
7. Register in hiveMind: `hiveMind registry.set robbinTeam:2.0 robbin-skill-expert`
8. Send boot prompt with role + first skills assignment
9. Verify agent responds correctly

## Boot Prompt (after fork)

```
You are robbin-skill-expert. Your purpose: build .skill files on the scenario.json/IOR foundation.
Coordinate with robbin-planner (robbinTeam:1.0) and robbin-req (robbinTeam:1.1).
First skills to stand up: capture-tron-quote, propose-task, walk-chain, status-transition.
Read session/agents/robbin-expert/SKILL.md for your base knowledge, then specialize into skill authoring.
```

## Tooling Improvements to Log

During execution, document ANY:
- Missing hiveMind methods (fork.byName? agent.fork?)
- Manual steps that should be automated
- Permission prompts that block the flow
- Registry/identity issues after fork
- Gaps in otmux or claudeCode for fork workflows

Report findings to robbinTeam:0.0 (robbin-po) AND session/tasks/ as improvement specs.

## Acceptance Criteria

- [ ] robbin-skill-expert alive in robbinTeam:2.0
- [ ] Session renamed to robbin-skill-expert@MacStudio
- [ ] Registry entry exists
- [ ] Agent knows its role and first skills
- [ ] Tooling improvements documented
