[Back to Task B1](./task-b1-otmux-mvc-boundary-audit.md)

# Task B1.2: Expert - Sender Prefix Layer Decision
[task:uuid:126a7ed8-f636-43df-8a53-507d161c71af]

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement
  - [x] creating test cases (4 assertions in shared findings for B1.3)
  - [x] implementing (decision documented; implementation deferred to later task pending tester)
  - [x] testing (evaluated 3 options against current behavior)
- [x] QA Review
- [ ] Done (pending B1.3 tester + implementation in next task)

## Decision
**Option B: Controller wraps View.** `hiveMind.send.message` builds the `[@role pane]` prefix
and passes prefixed text to a prefix-agnostic `otmux send`. Deprecation shim in otmux short-
circuits when `HIVEMIND_SEND_PREFIX_OWNED_BY_CONTROLLER=1` env is set (prevents double-prefix
during migration).

Rationale in [task-b1-findings.md](./task-b1-findings.md) — "B1.2 Sender Prefix Layer Decision":
- Option A (prefix parameter) rejected — ambiguous with `<text...>` positional, breaks OOSH no-flags convention
- Option B accepted — clear layer separation, hiveMind.send.message already exists as wrapper
- Option C (per-pane config) rejected — introduces persistence burden; "skip /commands" rule needs Controller semantics regardless

**Implementation steps documented:** 4-step migration with backward-compat shim period.

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
