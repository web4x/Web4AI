# Task: Fix hiveMind help — empty output / xargs error

**Assigned to**: Expert (0.4)
**Priority**: P1

## Bug

`./hiveMind help` produces:
```
xargs: unterminated quote
```
Exit code 1. No help output shown.

## Expected

Should show the usage text defined in `hiveMind.usage()` (around line 2053 of hiveMind).

## Investigation Notes

- `hiveMind.usage()` exists at line 2053 with full usage text
- No `hiveMind.help()` method exists — the `help` command likely falls through OOSH dispatch in `this`
- The `xargs` error comes from somewhere in the dispatch/line utilities pipeline, not from hiveMind itself
- The `xargs: unterminated quote` suggests a string with unmatched quotes being piped through `xargs` during method resolution

## Fix

1. Read `this` script to understand how `help` is dispatched
2. Either fix the dispatch path that triggers xargs, OR add a `hiveMind.help()` method that calls `hiveMind.usage()`
3. Ensure `./hiveMind help` shows the usage text cleanly

## Testing

```bash
# 1. Syntax check
bash -n hiveMind

# 2. Verify help works
./hiveMind help

# 3. Verify usage still works
./hiveMind usage
```

## When Done
Commit: "Fix hiveMind help — route to usage, fix xargs error"
Then say: "hiveMind help fix committed"
