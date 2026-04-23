[Back to Task C3](./task-c3-sweep-detect-fixture-tests.md)

# Task C3.2: Expert - 18-State Test Fixtures
[task:uuid:e4434cf3-d429-4b57-a615-00750e946d43]

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
  - [Task C3: sweep.detect Fixture Tests](./task-c3-sweep-detect-fixture-tests.md)

## Description
**Role: oosh-expert**

Create test fixture files for all 18 sweep.detect states:

1. **Capture real output** — for each state, capture actual pane output from a live agent exhibiting that state
2. **Create fixture files** — save each capture as a fixture in a test fixtures directory (e.g., `tests/fixtures/sweep-detect/`)
3. **Document expected result** — for each fixture, document the expected detection result (state name, confidence)
4. **Include edge cases** — add fixtures for the false-positive scenarios identified in C3.1:
   - Prose containing state keywords
   - Permission prompts
   - Compaction output
   - Mixed output (multiple state indicators in one capture)

Fixture format: plain text files matching `otmux pane.capture` output format.

Key file: `/Users/donges/oosh/hiveMind`

---

*Sprint 0 - Lifecycle Consolidation*
*Epic C: hiveMind Controller Layer*
