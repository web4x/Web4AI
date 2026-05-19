[Back to Task C2](./task-c2-hivemind-dry-remaining-audit.md)

# Task C2.3: Tester - DRY Pattern Tests
[task:uuid:972d94a9-cc1b-44b9-853c-65e646dd70bf]

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
**Role: oosh-tester**

Write regression tests that prevent DRY violations from returning:

1. **No inline UUID test** — grep hiveMind source for UUID regex patterns, JSONL parsing, pane-title UUID extraction; expect zero matches (excluding session.current delegation)
2. **No raw tmux test** — grep hiveMind source for direct `tmux ` calls; expect zero matches (all should go through otmux)
3. **Layer delegation test** — verify hiveMind calls claudeCode for data and otmux for display
4. **Pattern whitelist** — if some raw calls are intentionally kept, document and whitelist them

Use the test.suite framework with grep-based static analysis.

Key file: `/Users/donges/oosh/hiveMind`

---

*Sprint 0 - Lifecycle Consolidation*
*Epic C: hiveMind Controller Layer*
