# Tester Handoff: test.suite filter fixes + new test.def pattern

**From**: oosh-expert (UpDown_ai_projectTeam:0.1)
**To**: oosh-tester
**Date**: 2026-04-15
**Commit**: pending (will update below after push)

## What the tester reported

1. Filter mode still executes ALL setup code between test.case calls — slow even when filter matches one test
2. Skipped tests left `RETURN_VALUE` empty → integer expression errors at follow-up `if [ "$RETURN_VALUE" -eq 0 ]` blocks (lines 131/223/348/416 in test.hiveMind)
3. `local` outside function at line 620 (also 2164/2178)
4. Tab completion broken (TRON: completion offered scripts when it should offer test labels)
5. Default log level should be 3, not 1
6. Args should be type-detected so order doesn't matter

## What I fixed

### Immediate fixes

- **`local` outside function** — fixed test/test.hiveMind lines 620, 2164, 2178. Replaced `local foo` with plain `foo=""` (top-level scope).
- **Skipped-test RETURN_VALUE** — `test.case` now sets `RETURN_VALUE=0; RESULT=""` before returning when the filter skips it. Inline `if [ "$RETURN_VALUE" -eq 0 ]` blocks in test files no longer crash.
- **Default log level** — `test.suite.run` defaults level to **3** (was 1).
- **Args type-dispatched** — `test.suite.run` walks all args; first one matching `test/test.<name>` becomes `command`, bare digits 0-7 become `level`, anything else becomes `filter`. Order doesn't matter:
  ```
  test.suite run hiveMind 1 T-PULL-8       # legacy order
  test.suite run hiveMind T-PULL-8         # name + filter, level→3
  test.suite run T-PULL-8 1 hiveMind       # any order
  ```

### New: `test.def` — each test as a callable function

The user asked: "make sure each test is a function and can be called as a single function." Done.

```bash
__test_pull_8() {
  # full body of the test, including expect.pass / expect.fail
  expect.pass "did the thing"
}
test.def "T-PULL-8: JSONL loop processes all snapshot entries" __test_pull_8
```

- The body is a real bash function — invoke directly: `__test_pull_8` from any shell.
- Filter mode runs ONLY matching `test.def`s (and their internal expects). Surrounding-code-between-cases doesn't have to re-run.
- `test.def` delegates to `test.case` internally — counters, filter, skip-flag stay in one place.
- `test.suite list <script>` now picks up both `test.case` AND `test.def` registrations.
- Filter completion (`test.suite.run.completion.filter`) covers both.

## What YOU (tester) should do

1. **Verify the immediate fixes**:
   ```
   test.suite run hiveMind                    # full run with default level 3
   test.suite run hiveMind T-CONSIST-3        # filtered — verify RETURN_VALUE no longer crashes
   test.suite list hiveMind | head -20        # eyeball labels
   bash -n /Users/donges/oosh/test/test.hiveMind   # syntax clean (no top-level `local`)
   ```

2. **Try test.def in a small file** — e.g. take 2-3 of your simplest test cases in `test.hiveMind` and convert them as a proof-of-concept. Pick non-fixture tests (function-existence checks, code-grep tests) so you can demonstrate "function called directly works":
   ```
   __test_snap_1() {
     test.case $level "T-SNAP-1: hiveMind.agent.snapshot exists" \
       type -t hiveMind.agent.snapshot
     ...
   }
   ```
   Wait — that's wrong, `test.case` inside a function is double-wrapping. Better pattern:
   ```
   __test_snap_1() {
     # Body uses expect.pass / expect.fail directly
     if type -t hiveMind.agent.snapshot &>/dev/null; then
       expect.pass "hiveMind.agent.snapshot is defined"
     else
       expect.fail "hiveMind.agent.snapshot missing"
     fi
   }
   test.def "T-SNAP-1: hiveMind.agent.snapshot exists" __test_snap_1
   ```
   The `test.def` line replaces the `test.case ... ; if ... ; then expect.pass...` pattern entirely.

3. **Migration priority** — convert tests in slow files (test.hiveMind has 200+ cases, ~30 min full run). High-value migrations first: the T-RESTORE block, T-FORK block, T-CONSIST block — each has heavy fixture setup that only matters for that test group.

4. **Report**: how much faster does `test.suite run hiveMind T-FORK-3` get after migration? Numbers help PO prioritize the rest.

## Out of scope this turn

- I did NOT migrate any test file to test.def. The new helper is available; migration is yours to schedule.
- I did NOT change c2 completion behavior beyond what's already wired (`run.completion.filter`, `list.completion.test`). If TRON's completion experience needs more work, file a separate task with the exact tab-context that misbehaves.

## Known follow-ups

1. Tab completion for `<filter>` parameter currently scans ALL args looking for the script name to know what file to enumerate. If c2 invokes the completion before the user has typed the script, it returns nothing. That's correct behavior but counter-intuitive — completion only kicks in once the script is identified.

2. `test.def` does not yet expose a registry-introspection method (e.g. `test.suite.def.list`). For now `test.suite list <script>` is the source of truth — it greps the file. Real registry could come later.
