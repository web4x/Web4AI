---
name: acceptance-criteria-link-tests
description: Every Acceptance Criterion must LINK to the test that verifies it (AC↔test). An AC with no test is unverifiable.
metadata:
  type: reference
---

Every **Acceptance Criterion links to the test that proves it** (AC↔test traceability): `- [ ] AC1: <criterion> — verified by [TS1](./task-N.M-tester-<slug>.md#ts1)`. An AC with no linked test is unverifiable — you cannot gate on "met" without a test that measures it.

**Why:** TRON 2026-07-03 found even the Web4 canonical task shape "lacks the test to the acceptance criteria." Measure-don't-assume applied to acceptance: the test IS the measurement of the AC.
**How to apply:** in every task template, each AC line ends with a link to its verifying test case (in the tester sub-task). Gate `Done` only when the linked tests pass. See [[dual-links-pdca]], [[template-is-clean-headers]].
