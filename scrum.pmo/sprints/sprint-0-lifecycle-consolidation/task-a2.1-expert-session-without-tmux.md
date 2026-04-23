[Back to Task A2](./task-a2-claudecode-session-portability.md)

# Task A2.1: Expert - Session Operations Without tmux
[task:uuid:fb7c0e1b-6e52-41af-9a86-03fe2527a605]

## Status
- [ ] Planned
- [ ] In Progress
  - [ ] refinement
  - [ ] creating test cases
  - [ ] implementing
  - [ ] testing
- [ ] QA Review
- [ ] Done

## Traceability
- up
  - [Task A2: claudeCode Session Portability](./task-a2-claudecode-session-portability.md)

## Description
**Role: oosh-expert**

Verify and ensure that all claudeCode session operations work without tmux running:

1. **session.current** — must resolve UUID from filesystem (config files, JSONL), not pane titles
2. **context.read** — must read context % from JSONL log files, not from tmux pane capture
3. **PID lookup** — must find Claude process PIDs from PID files or process table, not tmux pane PIDs
4. **JSONL access** — must read/write JSONL session logs from standard file paths

For any operation that currently depends on tmux, refactor to use filesystem-only resolution with tmux as an optional enhancement (not a requirement).

Key file: `/Users/donges/oosh/claudeCode`

---

*Sprint 0 - Lifecycle Consolidation*
*Epic A: claudeCode Model Layer*
