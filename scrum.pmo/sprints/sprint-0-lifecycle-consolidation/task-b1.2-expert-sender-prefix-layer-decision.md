[Back to Task B1](./task-b1-otmux-mvc-boundary-audit.md)

# Task B1.2: Expert - Sender Prefix Layer Decision
[task:uuid:126a7ed8-f636-43df-8a53-507d161c71af]

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
  - [Task B1: otmux MVC Boundary Audit](./task-b1-otmux-mvc-boundary-audit.md)

## Description
**Role: oosh-expert**

Decide where the sender prefix logic belongs in the MVC stack. Currently otmux.send may prepend agent-specific context (like role names or identifiers) to messages. This is a layer decision:

1. **Document current behavior** — what prefix logic exists in otmux.send today
2. **Evaluate placement options:**
   - Option A: otmux.send accepts an optional prefix parameter (View stays pure, caller provides prefix)
   - Option B: hiveMind wraps otmux.send and adds prefix (Controller owns the formatting)
   - Option C: Prefix is a pane-level configuration set once at setup time
3. **Recommend and implement** the option that keeps otmux as a pure View layer

Key file: `/Users/donges/oosh/otmux`

---

*Sprint 0 - Lifecycle Consolidation*
*Epic B: otmux View Layer*
