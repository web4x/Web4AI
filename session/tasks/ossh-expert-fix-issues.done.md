# Done: Fix 3 Issues Found in ossh/user Testing

**Agent**: ossh-expert
**Task**: ossh-expert-fix-issues.md
**Result**: PASS (2 fixed, 1 not-a-bug)
**Commit**: `7b063e0`

## Issue 1: `user get.current.identity` — FIXED

**Root cause**: The `echo "$RESULT"` line was commented out at line 536 in `user`.
**Fix**: Uncommented echo and added method signature comment.
**Verification**: `user get.current.identity` now outputs `/Users/donges/.ssh` with exit 0.

Note: The tester's "No such file or directory" error could not be reproduced — dispatch correctly matches `user.get.current.identity()` (not `user.get()`). The function worked but produced no output due to the commented echo.

## Issue 2: `ossh config.create` — NOT A BUG

**Finding**: `ossh.config.create` already uses `private.detect.ssh.key` for auto-detection (lines 255-260). The key detection order is: `id_ed25519 → id_ecdsa → id_rsa → id_dsa`.

The tester's `~/.ssh` has `id_rsa` (confirmed: `ls ~/.ssh/id_*` shows only `id_rsa` and `id_rsa.pub`). The code correctly detected `id_rsa` because that's the key that exists.

The tester compared `ossh isInstalled` (tested against experiment dir with `id_ed25519`) vs `config.create` (which uses default `~/.ssh` with `id_rsa`). Different dirs, different keys — not a bug.

The `CURRENT_SSH_DIR` is persisted as `/Users/donges/.ssh` in `~/config/user.env`, which `ossh.start()` sources before dispatch.

## Issue 3: `ossh list.ids` exit code 1 — FIXED

**Root cause**: `line.find ""` (empty pattern) returns error code 1 ("EPERM 1 Operation not permitted"). When no `$id` filter is provided, the empty string was passed to `line find`.
**Fix**: Skip `line find` when `$id` is empty — just run `tree` directly.
**Verification**: `ossh list.ids "" /experiment/.ssh` now returns exit 0 with correct output. Filtered case (`ossh list.ids testbot /experiment/.ssh`) also returns exit 0.

## Files Changed

| File | Change |
|------|--------|
| `/Users/donges/oosh/user:536` | Uncommented echo, added method signature |
| `/Users/donges/oosh/ossh:119-127` | Conditional `line find` only when id is non-empty |

## Acceptance Criteria

- [x] Issue 1 fixed and verified
- [x] Issue 2 investigated — not a bug (auto-detection already works)
- [x] Issue 3 fixed and verified
- [x] Committed: `7b063e0`, pushed to origin/dev.claude
