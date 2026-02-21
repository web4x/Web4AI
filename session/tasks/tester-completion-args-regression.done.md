# Test Report: completion [args...] fix (commit 58048e1) + regression test

**Agent**: oosh-tester
**Date**: 2026-02-21
**Method**: Part 1 via otmux send to ooshDebug:0.1, Part 2 via test.suite

## Part 1: Verify fix via otmux send — ALL PASS

| Test | Command | Result | Notes |
|------|---------|--------|-------|
| T1 | `oo use` (no args) | **PASS** | Shows `ERROR> Usage: oo use <branch> <command> [args...]` — NO declare error |
| T2 | `oo use ` + Tab | **PASS** | c2 completion shows method signature — NO declare error |
| T3 | `oo use dev ` + Tab | **PASS** | c2 completion shows method signature — NO declare error |
| T4 | `cat current.method.env` | **PASS** | Contains `PARAM_branch="dev"` and `PARAM_command="addDefaultValue"` only. No `[args...]` in any declare line |

### Before fix (old behavior):
```
declare: '[args...]=addDefaultValue': not a valid identifier
```

### After fix (current behavior):
```
declare -- PARAM_branch="dev"
declare -- PARAM_command="addDefaultValue"
```
`[args...]` is stripped by `line.replace '\[.*\]'` at line 490 of `line` script.

## Part 2: Regression test — COMMITTED

**Commit**: a926138 on dev.claude

Added 3 assertions to `test/test.line`:
1. `line.parse.paramList.new` with input `"branch command [args...]"` produces NO "not a valid identifier" error
2. Output contains no `PARAM_[` (brackets stripped)
3. At least 1 valid `PARAM_` variable generated

```
✓ PASS: no invalid identifier error from [args...]
✓ PASS: [args...] stripped from paramList output
✓ PASS: valid PARAM_ variables generated (1 found)
```

All 4 test.line tests pass (1 existing + 3 new regression).
