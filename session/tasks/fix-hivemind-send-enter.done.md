# Done: Fix hiveMind.send() Enter Key Bug
**Agent**: oosh-expert
**Task**: fix-hivemind-send-enter.md (INC-001)
**Result**: PASS
**Commit**: 15a8a90
**File**: `/Users/donges/oosh/hiveMind` lines 756-777

## Root Cause
`hiveMind.send()` used `otmux send "$target" -l "$*"` — the `$*` joined all args into one string, so `"echo hello" Enter` became the single literal string `"echo hello Enter"`. The `-l` flag then sent it all as text.

## Fix
Detect trailing tmux key names via regex before sending. Three cases:
1. **Text + key** (`"echo hello" Enter`): send text with `-l`, sleep 0.05, send key as keypress
2. **Key only** (`C-u`): send as keypress without `-l`
3. **Text only** (`"partial text"`): send with `-l` (unchanged behavior)

Key name regex: `^(Enter|Escape|Tab|Space|BSpace|DC|IC|C-[a-z]|M-[a-z]|Up|Down|Left|Right|Home|End|PPage|NPage|F[0-9]+)$`

## Test Cases for Trainer
- `hiveMind send oosh-expert "echo test-a" Enter` → should print "test-a"
- `hiveMind send oosh-expert "echo 'hello world'" Enter` → spaces preserved
- `hiveMind send oosh-expert "partial text"` → at prompt, NOT submitted
- `hiveMind send oosh-expert C-u` → clears prompt
- `hiveMind send.enter oosh-expert "echo test-d"` → should print "test-d" (unchanged)

## Next
Trainer should run Phase 3 verification (all test cases A-F from task file).
