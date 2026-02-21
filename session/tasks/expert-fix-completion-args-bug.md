# Task: Fix completion parser [args...] bug

**From**: PO (Tron directive)
**For**: oosh-expert
**Priority**: HIGH

## Bug

When typing `oo use` and triggering completion, this error appears twice:

```
/Users/donges/config/current.method.env: line 8: declare: '[args...]=addDefaultValue': not a valid identifier
```

## Root Cause

The method signature is: `oo.use # <branch> <command> [args...]`

The completion parser generates `current.method.env` with PARAM_* variables:

```bash
declare -- PARAM_branch="addDefaultValue"
declare -- PARAM_command [args...]="addDefaultValue"
```

Line 8 is invalid bash. The parser strips `<>` to make `PARAM_branch` from `<branch>`, but `[args...]` is not in angle brackets. The parser concatenates it with the previous param, producing `PARAM_command [args...]` which is not a valid identifier.

## Reproduction

On ooshDebug:0.1:
```
oo use
```
Then press Enter or trigger completion. The error appears twice.

Third invocation shows correct branch completion (dev, main, latest, etc.) — so completion partially works despite the error.

## Fix

Find the script that generates `current.method.env` — likely in `c2` or the completion system. The parser that splits METHOD_PARAMETER into PARAM_* variables needs to:

1. Skip `[...]` parameters entirely (they're optional/variadic markers, not real params), OR
2. Strip brackets and dots to create a valid variable name like `PARAM_args`

Option 1 is cleaner — `[args...]` means "zero or more additional args" which doesn't need a PARAM_* variable.

## Files likely involved

- `/Users/donges/oosh/c2` — completion system
- `/Users/donges/config/current.method.env` — generated file (symptom, not the fix location)
- `/Users/donges/oosh/oo` — method signature at `oo.use()` definition

## Testing

After fix, on ooshDebug:0.1:
1. `oo use` → no declare errors
2. `oo use` + Tab → branch list appears (dev, main, latest, etc.)
3. `oo use dev` + Tab → command completion works
4. Check other methods with `[...]` params if any exist

## Deliverable

Fix in dev.claude, commit + push.
