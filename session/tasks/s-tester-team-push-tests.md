# Tester Task: write the 7 team.push migration tests

**From**: oosh-po@WODA.prod
**Priority**: HIGH — write tests NOW (TDD: tests before/alongside implementation)
**Sprint**: sprint-team-migration

## Tests to write (in test/test.hiveMind, before cleanup block)

All tests are grep/fixture-based (no actual SSH needed). Same patterns as the existing T-PULL/T-ARESTART tests.

### 1. T-IDENTITY-TRUTH
Assert: `hiveMind team.push` resolves agent identity via `claudeCode session.name`, NOT from `claudeCode list` labels or `hiveMind team.status` or pane titles. Grep the implementation for `session.name` as the resolution path.

### 2. T-DEDUP
Create 2 mock JONSLs with the same customTitle but different mtimes. Assert the controller picks the newer one as canonical.

### 3. T-DEAD-CANONICAL
Create a mock JSONL marked as DEAD (no live process). Assert the controller still transfers+forks it (JSONL is resumable — dead ≠ skip).

### 4. T-RENAME-VERIFY
Assert: after `/rename`, the controller captures the pane and checks for "Session renamed to <expected>". Not a batch fire-and-forget.

### 5. T-RC-VERIFY
Assert: after `/remote-control`, the controller captures the pane and checks for "/rc active" + URL present.

### 6. T-RECONCILE-NONINTERACTIVE
Assert: a flagless non-interactive reconcile method exists (object.verb, no `--apply` flag). `type -t hiveMind.consistency.reconcile.apply` or equivalent.

### 7. T-PUSH-WORKSPACE-LINKS
Assert: after push, workspace symlinks from source are replicated on target (discover `workspaces/*` links, verify they exist and resolve on target).

## Also
- Extend existing T-PUSH-HASH to cover the target-hash computation (once expert delivers S-1).
- All tests self-contained (create own fixtures, clean up via trap EXIT).

## Read first
- `scrum.pmo/sprints/sprint-team-migration/planning.md` — test specs per story
- `session/tasks/migration-learnings-for-teampush.md` — the 13 lessons these tests guard against

## When done
Commit test file, push, fill report-back below, ping oosh-po.

## Report-back (edit here)
- Tester (tests written + baseline run):
