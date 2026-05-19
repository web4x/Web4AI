[Back to Task G1](./task-g1-claudecode-context-read-1m-fix.md)

# Task G1.3: Tester - Test context.read for 1M agent
[task:uuid:eah4f6d3-c275-4gb1-e8d4-3j4567890123]

## Status
- [ ] Planned
- [ ] In Progress
- [ ] QA Review
- [ ] Done

## Traceability
- up
  - [Task G1: claudeCode context.read 1M fix](./task-g1-claudecode-context-read-1m-fix.md)

## Description
After expert fixes land:
1. Run `claudeCode context.read ooshTeam:0.1` — should return positive % (~40-70%) not -226%
2. Run `claudeCode context.velocity ooshTeam:0.1` — should show reasonable tokens/hr and time-to-compact
3. Test with mock JSONL containing `"model":"claude-opus-4-6[1m]"` — verify 1M max used
4. Test with mock JSONL containing `"model":"claude-sonnet-4-6"` — verify 200k max used
5. Verify dashboard shows correct % for all running agents
