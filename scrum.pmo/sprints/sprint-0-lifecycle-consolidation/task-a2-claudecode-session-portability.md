[Back to Planning Sprint 0](./planning.md)

# Task A2: claudeCode Session Portability
[task:uuid:066905c3-6a8e-479c-909b-790d10151dee]

## Naming Conventions
- Tasks: `task-<epic><number>-<short-description>.md`
- Subtasks: `task-<epic><number>.<subnumber>-<role>-<short-description>.md`
- Subtasks must always indicate the affected role in the filename.
- Subtasks must be ordered to avoid blocking dependencies.

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
- Source: Sprint 0 - Lifecycle Consolidation, Epic A (Model Layer)

  - up
    - [Sprint 0 Planning - Lifecycle Consolidation](./planning.md)

  - down
    - [Task A2.1: Expert - Session Operations Without tmux](./task-a2.1-expert-session-without-tmux.md)
    - [Task A2.2: Expert - UUID Resolution Without tmux](./task-a2.2-expert-uuid-resolution-without-tmux.md)
    - [Task A2.3: Tester - Portability Tests](./task-a2.3-tester-portability-tests.md)

## Task Description
Ensure all claudeCode session operations (session.current, context.read, PID lookup, JSONL access) work without any tmux dependency. This is critical for cold-restart: hiveMind must be able to query the Model layer to find existing Claude processes even when tmux has died and been restarted.

## Context
After a tmux server death, hiveMind needs to discover running Claude processes and re-attach them to new panes. This requires claudeCode to resolve session UUIDs, read context %, and find PIDs purely from filesystem state (JSONL logs, PID files, config) without relying on pane titles or tmux variables.

Foundation: session.current (02b4070) already centralizes UUID source. This task verifies and extends that portability.

Key file: `/Users/donges/oosh/claudeCode`

## Intention

### Why This Task Exists:
1. **Cold Restart Enablement:** Model must function when tmux is dead
2. **Process Discovery:** Find running Claude agents by PID/JSONL without pane context
3. **Session Continuity:** Resume sessions after tmux restart using saved state

### Problems This Task Solves:
- **tmux-coupled UUID resolution:** Session lookup may depend on pane titles
- **Process orphaning:** Claude processes survive tmux death but cannot be rediscovered
- **State loss:** Session data trapped in tmux environment variables

### How This Task Solves These Problems:
- **Filesystem-only resolution:** All session data accessible via files, not tmux
- **PID-based discovery:** Find Claude processes by PID files and /proc checks
- **Config persistence:** All critical state saved to env files before tmux death

---

*Sprint 0 - Lifecycle Consolidation*
*Epic A: claudeCode Model Layer*
*Priority: 1 (CRITICAL - Cold Restart)*
