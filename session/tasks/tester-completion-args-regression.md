# Task: Test completion [args...] fix + write regression test

**From**: PO (Tron directive)
**For**: oosh-tester
**Priority**: HIGH

## Context

Expert fixed a completion bug (commit 58048e1). When `oo use` triggered completion, the parser choked on `[args...]` in the method signature:

```
/Users/donges/config/current.method.env: line 8: declare: '[args...]=addDefaultValue': not a valid identifier
```

Fix: `line.parse.paramList.new()` now strips `[...]` markers before generating PARAM_* variables.

## Part 1: Verify fix via otmux send (test as user would)

On ooshDebug:0.1:

```bash
# Test 1: oo use completion — no declare errors
otmux send ooshDebug:0.1 "oo use" Enter
sleep 2
otmux pane.capture ooshDebug:0.1 15
# EXPECT: method help shown, NO "not a valid identifier" error

# Test 2: oo use Tab completion — branch list
otmux send ooshDebug:0.1 "oo use " Tab
sleep 2
otmux pane.capture ooshDebug:0.1 15
# EXPECT: branch list (dev, main, latest, etc.)

# Test 3: oo use dev Tab — command completion
otmux send ooshDebug:0.1 "oo use dev " Tab
sleep 2
otmux pane.capture ooshDebug:0.1 15
# EXPECT: command list from dev branch

# Test 4: Check current.method.env is clean
otmux send ooshDebug:0.1 "oo use" Enter
sleep 1
otmux send ooshDebug:0.1 "cat /Users/donges/config/current.method.env" Enter
sleep 1
otmux pane.capture ooshDebug:0.1 15
# EXPECT: PARAM_branch and PARAM_command only, no [args...] in any declare line
```

## Part 2: Write regression test in test.suite

Create a test case that catches this bug if it ever regresses. The test should:

1. Call `line.parse.paramList.new` (or whatever parses method signatures) with a signature containing `[args...]`
2. Verify the output contains only valid bash identifiers (no brackets, no dots in variable names)
3. Verify `[args...]` is stripped, not converted to a broken PARAM_* variable

Use `test.suite` patterns:
```bash
test.case - "completion: [args...] stripped from paramList" line.parse.paramList.new "oo.use # <branch> <command> [args...]"
# Then check that current.method.env has no invalid identifiers
```

## Deliverable

1. Test report in `session/tasks/tester-completion-args-regression.done.md`
2. Regression test committed to dev.claude (test file for `line` script)
