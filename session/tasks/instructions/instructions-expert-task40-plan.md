# Expert: Task 40 — PLANNING ONLY (Quota Throttled)

**Task file**: `/Users/Shared/Workspaces/AI/Claude/session/tasks/Task.40.cmm4-context-aware-team.md`
**Priority**: High — but PLAN ONLY, no implementation until five_hour quota < 50%

## What to Plan

Write a design doc to `session/tasks/task40-expert-plan.md` covering:

### 1. hiveMind multi-team support
- Currently hiveMind manages one session (cursorOrchestrator)
- Need to manage multiple sessions: cursorOrchestrator + claudeWoda
- Team selection via parameter: `./hiveMind sweep claudeWoda`
- Tab completion for team names
- Registry per team in /tmp/hivemind.roles.<session>

### 2. hiveMind sweep.detect improvements
- Detect ALL dialog formats: permission prompts, accept edits, rate limits, autocomplete stuck, queued messages, context warnings
- Return structured status per pane

### 3. Tab completion for team selection
- `./hiveMind team.<Tab>` lists teams
- `./hiveMind sweep <Tab>` completes team/session names

### 4. Velocity measurement method
- Track tokens consumed vs progress made
- Target: 90% of 7-day limit on day 7
- Method to query and report current velocity

## Rules
- Write the plan to a file. Do NOT implement.
- Keep it concise — bullet points, not essays.
- Do NOT burn context on research loops. One read pass, then write.

## When Done
Report: `Task 40 plan written`
