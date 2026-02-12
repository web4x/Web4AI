# Validate: otmux send.verified method

**Assigned to**: Tester (0.5)
**Commit**: 805aecc
**Source**: session/tasks/instructions-expert-send-verified.md

## What Was Implemented

`otmux.send.verified()` — sends text to a pane and verifies delivery via before/after pane capture. Returns DELIVERED/CHANGED/FAILED.

## Validation Steps

From `components/OOSH/dev.claude/`:

```bash
# 1. Syntax check
bash -n otmux

# 2. Verify method exists
grep -n 'otmux.send.verified()' otmux

# 3. Verify completion stub exists
grep -n 'send.verified.completion' otmux

# 4. Check method signature follows OOSH pattern
# Should have: # <target> <text> <?timeout:N> # description
grep 'send.verified().*#' otmux

# 5. Functional test — send to Task Agent pane (0.3, idle/rate limited)
./otmux send.verified cursorOrchestrator:0.3 'echo hello'
echo "RESULT=$RESULT"

# 6. Verify RESULT variable is set (DELIVERED, CHANGED, or FAILED)
# Should be one of the three documented outcomes
```

## Expected Outcomes

- `bash -n otmux` exits 0
- Method signature follows OOSH `# <param> # description` pattern
- Completion stub exists
- Functional test returns 0 (success) with RESULT set
- RESULT is one of: DELIVERED, CHANGED, FAILED

## When Done
Say: "send.verified validation ALL PASS" or report failures.
