# Task 51: Fix test.suite all infinite loop

**Assigned to**: Expert (cursorOrchestrator:0.4)
**Priority**: High
**Source**: woda-writer via ScrumMaster

## Bug

`./test.suite all` enters an infinite loop printing `this.call to:` endlessly.
Individual test suites work fine (e.g. `./test.suite run ossh 1`).

The problem is ONLY in the `all` method — the loop that discovers and runs all test files.

## Investigation Steps

1. Read `components/OOSH/dev.claude/test.suite` — find the `test.suite.all()` method
2. Look for how it iterates over test files — likely a loop calling each suite
3. The `this.call to:` message comes from the OOSH kernel (`this` script) — it's the method dispatch trace
4. Likely cause: recursive call back into test.suite itself, or a test file that sources test.suite triggering re-entry
5. Check if `test.suite all` somehow includes itself in the file list it iterates

## Likely Fix Areas

- The glob/find pattern that discovers test files may match `test.suite` itself
- Or the iteration may call `./test.suite run test.suite` which re-enters
- Or a sourced test file re-sources `test.suite` causing recursion

## Testing

After fixing, run:
```bash
./test.suite all 1
```
It should complete without looping. Use `otmux send` to test in cursorOrchestrator panes (NOT claudeWoda — off limits).

## When Done

Commit with message "Fix test.suite all infinite loop (Task 51)"
Then say: "Task 51 committed"
