[Back to Task B1](./task-b1-otmux-mvc-boundary-audit.md)

# Task B1.1: Expert - Controller/Model Leak Identification
[task:uuid:533c88b4-0d66-4c39-8f37-010192604d39]

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

Grep the otmux script for all references that cross MVC boundaries:

1. **claudeCode references** — any calls to claudeCode methods (session, context, PID)
2. **hiveMind references** — any calls to hiveMind methods (team, agent, role operations)
3. **Agent-specific logic** — any code that knows about agent roles, bootstrap, or session UUIDs
4. **Source statements** — any `source` of Model or Controller env files (roles.env, sessions.env)

For each leak found, document: method name, line number, what it does, and whether it should move to hiveMind (Controller) or be deleted.

Key file: `/Users/donges/oosh/otmux`

---

*Sprint 0 - Lifecycle Consolidation*
*Epic B: otmux View Layer*
