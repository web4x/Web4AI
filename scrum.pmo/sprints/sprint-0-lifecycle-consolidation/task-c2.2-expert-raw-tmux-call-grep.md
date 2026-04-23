[Back to Task C2](./task-c2-hivemind-dry-remaining-audit.md)

# Task C2.2: Expert - Raw tmux Call Grep
[task:uuid:0bca197e-7581-4802-b3e7-d46cfaa7d627]

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
  - [Task C2: hiveMind DRY Remaining Audit](./task-c2-hivemind-dry-remaining-audit.md)

## Description
**Role: oosh-expert**

Grep hiveMind for all raw tmux CLI calls that should go through otmux instead:

1. **tmux send-keys** — should use `otmux send`
2. **tmux capture-pane** — should use `otmux pane.capture`
3. **tmux split-window** — should use `otmux split` or equivalent
4. **tmux select-pane** — should use otmux pane selection methods
5. **tmux list-panes / list-sessions** — should use otmux query methods
6. **Any other direct tmux CLI calls**

For each raw call found, replace with the corresponding otmux method. If otmux lacks the needed method, document it as a gap for otmux to implement.

Key file: `/Users/donges/oosh/hiveMind`

---

*Sprint 0 - Lifecycle Consolidation*
*Epic C: hiveMind Controller Layer*
