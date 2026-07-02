> ⬆ **[Sprint 2 · Epic E](../../scrum.pmo/sprints/sprint-2/task-s2-e-tooling-hygiene.md)** — this spec is traced from that epic.

# `test.suite regression.check <baseBranch>` — systematize regression-vs-preexisting triage

**From**: oosh-po (ARON cycle — improvement as task, via _TEMPLATE)
**Owners**: oosh-architect (contract) → test.suite-expert/oosh-expert (impl) → oosh-tester (verify)
**Priority**: MEDIUM
**Status**: PLAN
**Date**: 2026-06-28
**Sprint**: — (QA tooling; serves every sprint gate)
**Related**: `session/tasks/s1-suite-failures.md` (the manual run that proved the technique)

## Problem / Why
When a full-suite run shows many reds, "regressions or pre-existing?" was decided by eye — error-prone, and almost let BUG6's pkill regression hide among 82 pre-existing fails. The tester resolved it OBJECTIVELY by re-running the suites on the base branch (test/macos.latest @8374cc5, zero sprint commits): red-on-dev-green-on-base = regression; red-on-both = pre-existing. This manual technique should be a first-class tool so every sprint gate uses proof, not judgment.

## Design / Approach
`test.suite regression.check <script> <baseBranch>` — run `<script>`'s suite on current branch AND on `<baseBranch>` (worktree/stash-safe checkout), diff the fail sets, classify each fail: REGRESSION (dev-red/base-green) | PRE-EXISTING (red-both) | FIXED (dev-green/base-red). Output the 3 lists. DRY: reuse test.suite's existing run+parse; no new test runner. Self-care: restore the working branch/tree even on failure (trap). No flags.

## Acceptance Criteria
- [ ] `test.suite regression.check otmux test/macos.latest` outputs REGRESSION / PRE-EXISTING / FIXED lists
- [ ] Correctly classifies a known regression (BUG6 pkill) as REGRESSION, the otmux ~24 as PRE-EXISTING
- [ ] Restores original branch + working tree on exit (trap), even mid-run
- [ ] T-REGRESSION-CHECK: seed a dev-only failing test → classified REGRESSION; a both-branches fail → PRE-EXISTING
- [ ] DRY: reuses test.suite run/parse, no duplicate runner

## PDCA
- Plan: this spec · Do: expert adds regression.check · Check: T-REGRESSION-CHECK + re-run on the S1 set, matches tester's manual verdict · Act: tune classification edge cases (new-test-absent-on-base = not a regression)

## Report-back (owners edit here; one line each, with commit hash)
- Architect (contract / checkout-safety):
- Expert (regression.check impl):
- Tester (T-REGRESSION-CHECK + matches S1 manual verdict):
