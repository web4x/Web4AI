# TASK-10: Name-Based Agent Addressing

## User Directive (verbatim)

> look at the test shell.. adding a pane causes trouble by changing agent pane addresses. make oosh hiveMind commands so that the agent address is mapped by name

## Headline Plan

| Step | Agent | Action |
|------|-------|--------|
| 1 | Expert | Verify hiveMind send/resolve uses /tmp/hivemind.roles registry |
| 2 | Tester | Confirm hiveMind send is pane-agnostic via registry.find |
| 3 | Agent Trainer | Add OOSH-only rule to all SKILL.md files |

## Status: DONE

- hiveMind.send() calls hiveMind.resolve() at line 529
- hiveMind.monitor() calls hiveMind.resolve() at line 1146
- Both use private.hiveMind.registry.find() reading /tmp/hivemind.roles
- Fully pane-agnostic, no fixes needed
