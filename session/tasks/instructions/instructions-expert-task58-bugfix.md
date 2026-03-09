# Task 58 Bugfix: claudeCode context.read triggers debugger on optional param

**Priority**: High — blocks context measurement
**Source**: Bug report from woda-writer

## Bug

`./claudeCode context.read` (without optional pane param) works correctly (returns 41.6%) BUT then triggers:
```
PROBLEM BREAKPOINT> this.load faild to load  from "usage": 1
> line: 1079 'return $RETURN_VALUE'
```

The OOSH kernel's `this.load` or post-dispatch validation sees a "usage" error after the method returns successfully.

## Root Cause

The method signature is `# <?pane>` (optional). The method works fine. But after it returns, the OOSH dispatch chain triggers a spurious "usage" validation error — likely `this.load` trying to validate parameter count against the method signature and failing when the optional param is absent.

## Fix Required

1. **Check `claudeCode.start()` at line ~1078-1089** — the `this.start "$@"` call and what happens after it returns
2. **Check how `this.load` validates optional params** — read `docs/oosh-architecture.md` for the `<?>` optional param syntax
3. **The fix is likely**: ensure the method's return value propagates cleanly without triggering post-dispatch validation, OR fix how optional params are counted

## MANDATORY: Read docs first

Before fixing, read `docs/oosh-architecture.md` — specifically:
- Optional parameter syntax `<?param>`
- How `this.start` dispatches methods
- How `this.load` validates parameter counts

## Testing

```bash
# Must work without debugger:
./claudeCode context.read
# Should return a % number and exit cleanly — NO PROBLEM BREAKPOINT

# Must still work with pane:
./claudeCode context.read cursorOrchestrator:0.4

# Must still work:
./claudeCode context.jsonl
./claudeCode context.all
```

## When Done
Commit: "Task 58 bugfix: Fix context.read optional param triggering debugger"
Then say: "Task 58 bugfix committed"
