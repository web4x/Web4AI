[Back to Task C3](./task-c3-sweep-detect-fixture-tests.md)

# Task C3.2: Expert - 18-State Test Fixtures
[task:uuid:e4434cf3-d429-4b57-a615-00750e946d43]

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement (reviewed sweep.detect line 4531 — 18 states + variants)
  - [x] creating test cases (25 fixtures produced)
  - [x] implementing (commit afc57d3)
  - [x] testing (fixtures delivered for C3.3 tester to execute)
- [x] QA Review
- [x] Done

## Deliverable

Commit `afc57d3`. Location: `/Users/donges/oosh/test/test.data/sweep.detect/`

**25 fixtures:**
- 18 canonical states, one `.txt` file each
- 7 edge-case variants for the 3 false-positive-prone states:
  - permission: edit-variant, proceed-variant, **false-positive-prose** (text without ❯ menu)
  - rate-limit: 529-Overloaded variant, **false-positive-source** (detector's own grep regex displayed)
  - subscription-limit: billing-cap variant, **false-positive-source**

**README.md maps each fixture to its expected `status|action|severity|detail` output** and documents the prose-scrub rationale (why false-positive fixtures must NOT trigger their apparent state).

## Key insight documented for C3.3

The fixture harness via `load-buffer` + `paste-buffer` is flaky — tmux reflow and pane.capture line handling don't guarantee the fixture content is preserved verbatim in the pane. A cleaner future refactor would expose a testable entry point on `private.hiveMind.sweep.detect` that accepts content via stdin instead of pane-capture. Flagged in README as future work.

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
