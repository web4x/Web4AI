[Back to Task C3](./task-c3-sweep-detect-fixture-tests.md)

# Task C3.3: Tester - Fixture-Based Detection Tests
[task:uuid:85f23d72-85f0-499d-b00f-c0931988d280]

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
**Role: oosh-tester**

Write test.suite tests that feed fixture files into sweep.detect and verify correct classification:

1. **Per-state tests** — for each of the 18 states, feed the fixture into sweep.detect and verify it returns the correct state
2. **False-positive tests** — feed prose/edge-case fixtures and verify they are NOT misclassified
3. **Regression tests** — include the specific patterns from eca047a and b3a63ae that were previously false positives
4. **Bulk fixture test** — iterate all fixture files and verify 100% correct classification
5. **Unknown input test** — feed random/unexpected output and verify graceful handling

Use the test.suite framework. Tests should mock pane.capture by providing fixture file content directly to the detection logic.

Key file: `/Users/donges/oosh/hiveMind`

---

*Sprint 0 - Lifecycle Consolidation*
*Epic C: hiveMind Controller Layer*
