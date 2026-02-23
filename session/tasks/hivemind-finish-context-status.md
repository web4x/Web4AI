# Task: Finish hiveMind agent.context.status + team.context.status Completion

**From**: PO
**Priority**: Current work

## What Was Done

Commit `daca65b`: Renamed `agent.context.status` → `team.context.status` (team-wide sweep) and created new `agent.context.status <agent-name>` (single agent, one line output).

## What Needs Finishing

1. **Missing helper**: `private.hiveMind.roles.complete()` was added at line ~278 in hiveMind but NOT tested. It lists registered role names from the active team. Verify it works.

2. **Test both methods**:
   - `hiveMind agent.context.status scrum-master` → should return ONE line
   - `hiveMind team.context.status` → should return full table of all agents
   - Tab completion on `hiveMind agent.context.status ` should list role names
   - Tab completion on `hiveMind team.context.status ` should list session names

3. **Commit when done**: `git -C /Users/donges/oosh add hiveMind && git commit -m "hiveMind: test and verify context status completions"`

## Key Info
- Registry format: `target|role` in `$HIVEMIND_REGISTRY`
- `private.hiveMind.roles.complete()` reads column 2 (role names)
- `private.hiveMind.teams.complete()` already existed (line 273)
