# Task 53: Fix oo new.method on macOS

**Priority**: High
**Source**: WODA story Ch20

## Bug

`oo new.method` is shaky on macOS — case-sensitivity issue, awk/sed errors during scaffolding. The method creation/scaffolding breaks.

## Investigation

1. Read `components/OOSH/dev.claude/oo` — find the `oo.new.method()` function
2. macOS uses BSD sed and BSD awk, not GNU. Key differences:
   - BSD sed requires `-i ''` (empty string backup extension), GNU uses `-i` alone
   - BSD awk may handle some regex differently
   - macOS APFS is case-insensitive by default
3. Check for `sed -i` calls without the BSD-compatible empty extension
4. Check for any case-sensitivity assumptions in file matching
5. Test: `./oo new.method testscript.testmethod` — does it scaffold correctly?

## Fix

- Make all sed calls BSD-compatible: `sed -i '' 's/...'` or use a temp file approach
- Fix any awk patterns that assume GNU behavior
- Handle case-insensitive filesystem if relevant

## Testing

Test from `components/OOSH/dev.claude/`:
```bash
./oo new testscript
./oo new.method testscript.hello
# Verify the method was added to the script
grep 'testscript.hello' testscript
# Clean up
rm testscript tests/test.testscript
```

## When Done
Commit: "Task 53: Fix oo new.method macOS compatibility — BSD sed/awk"
Then say: "Task 53 committed"
