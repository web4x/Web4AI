[Back to Task A2](./task-a2-claudecode-session-portability.md)

# Task A2.3: Tester - Portability Tests
[task:uuid:b8eda3a7-20f4-458b-a0c3-bef3d6d93dc8]

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
**Role: oosh-tester**

Write tests verifying claudeCode session operations work without tmux:

1. **No-tmux session.current test** — with TMUX env var unset, verify session.current resolves from config
2. **No-tmux context.read test** — verify context % is readable from JSONL without pane capture
3. **No-tmux PID lookup test** — verify PID discovery works from filesystem
4. **Graceful degradation test** — verify methods return meaningful errors (not crashes) when both tmux and config are missing

Tests should use the test.suite framework and be runnable outside of tmux.

Key file: `/Users/donges/oosh/claudeCode`

---

*Sprint 0 - Lifecycle Consolidation*
*Epic A: claudeCode Model Layer*
