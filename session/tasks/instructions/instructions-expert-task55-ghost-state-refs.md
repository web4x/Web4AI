# Task 55: Fix ghost state machine references

**Priority**: Medium
**Source**: WODA story — old PDCA_TEST_* references linger in current.state.machine.env

## Bug

After running state machine tests, old `PDCA_TEST_*` variables persist in `current.state.machine.env` (or similar state file). This pollutes the state namespace and can cause false readings in subsequent state machine operations.

## Investigation

1. Read `components/OOSH/dev.claude/state` — find how state machines are created/destroyed
2. Find where `current.state.machine.env` lives — check `~/config/` or `$OOSH_DIR/`
3. Search for `PDCA_TEST` references: `grep -r 'PDCA_TEST' components/OOSH/dev.claude/`
4. Check if there's a `state.destroy` or `state.cleanup` method
5. Look at the test files for state: do they clean up after themselves?

## Likely Fix

- Add or fix a `state.cleanup` / `state.destroy` method that removes state vars
- Make test.suite cleanup state after test runs
- Or: make state machines namespace-isolated so test state can't leak into production state

## Testing

```bash
# Check current ghost refs
cat ~/config/current.state.machine.env 2>/dev/null | grep PDCA_TEST
# After fix, run state tests and verify no PDCA_TEST vars persist
./test.suite run state 1
cat ~/config/current.state.machine.env 2>/dev/null | grep PDCA_TEST
# Should be empty
```

## When Done
Commit: "Task 55: Fix ghost state machine refs — cleanup PDCA_TEST vars"
Then say: "Task 55 committed"
