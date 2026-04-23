[Back to Task A2](./task-a2-claudecode-session-portability.md)

# Task A2.2: Expert - UUID Resolution Without tmux
[task:uuid:f3c8cbde-8d85-4c1b-995d-0c0eaa1b7533]

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

Ensure UUID resolution (mapping agent names to session UUIDs) works purely from persisted config files without tmux:

1. **sessions.env lookup** — resolve agent-name-to-UUID from hiveMind's sessions.env
2. **session.current fallback** — if no tmux pane context, fall back to config-file resolution
3. **Multi-team resolution** — cross-team UUID lookup (03149ef foundation) must work without tmux session context
4. **Orphan detection** — identify UUIDs for Claude processes still running after tmux death

Document the resolution chain: what sources are checked, in what order, and what happens when each is unavailable.

Key files: `/Users/donges/oosh/claudeCode`, hiveMind sessions.env

---

*Sprint 0 - Lifecycle Consolidation*
*Epic A: claudeCode Model Layer*
