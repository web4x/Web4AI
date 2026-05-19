[Back to Task D2](./task-d2-tronmonitor-hivemind-integration.md)

# Task D2.3: Tester - Integration Tests
[task:uuid:55f37142-6390-4d12-950b-0250fcb7de0a]

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
  - [Task D2: tronMonitor-hiveMind Integration](./task-d2-tronmonitor-hivemind-integration.md)

## Description
**Role: oosh-tester**

Write integration tests verifying hiveMind-tronMonitor event wiring:

1. **Register triggers add test** — register a team in hiveMind, verify tronMonitor.add was called and team appears in tronMonitor
2. **Remove triggers remove test** — remove a team from hiveMind, verify tronMonitor.remove was called and team disappears from tronMonitor
3. **tronMonitor unavailable test** — register a team when GNU screen is not running, verify hiveMind still completes successfully (graceful degradation)
4. **Idempotency test** — register the same team twice, verify tronMonitor has exactly one entry
5. **Restore triggers add test** — restore a team from config, verify tronMonitor.add is called for each restored team

Use the test.suite framework. These tests require both tmux and GNU screen.

Key files: `/Users/donges/oosh/hiveMind`, `/Users/donges/oosh/tronMonitor`

---

*Sprint 0 - Lifecycle Consolidation*
*Epic D: tronMonitor Monitor Layer*
