[Back to Task B1](./task-b1-otmux-mvc-boundary-audit.md)

# Task B1.1: Expert - Controller/Model Leak Identification
[task:uuid:533c88b4-0d66-4c39-8f37-010192604d39]

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement
  - [x] creating test cases (6 test assertions in shared findings for B1.3)
  - [x] implementing (audit only; 3 fixes proposed for later implementation tasks)
  - [x] testing (grep-based audit complete)
- [x] QA Review
- [ ] Done (pending B1.3 tester)

## Deliverable
**Findings:** [task-b1-findings.md](./task-b1-findings.md)

**Leaks found:** 5 discrete (2 HIGH, 2 MEDIUM, 1 ACCEPTED)
- HIGH: `private.otmux.send.prefix` reads HIVEMIND_ROLE / hivemind.roles.env
- HIGH: `otmux.tronMonitor.setup` calls `private.hiveMind.ensure.pane`
- MEDIUM: `otmux.tree` + `tree.detailed` call `claudeCode process.running` / `version`
- MEDIUM: `otmux.tree.detailed` calls `hiveMind protected.agents.discover`
- ACCEPTED: `otmux.session.rename` fires observer `hiveMind protected.session.renamed` (documented as intentional)

**Metric:** 95%+ of otmux (2306 lines) is already pure View. Concentrated leaks in 3 methods.

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
