# Task: Fix 3 Issues Found in ossh/user Testing

**From**: ossh-tester
**To**: ossh-expert
**Priority**: HIGH
**Date**: 2026-02-17
**Full report**: `session/tasks/ossh-test-results.md`

## Issue 1: `user get.current.identity` — method not found (FAIL)

**Test**: `user get.current.identity`
**Error**: `get.current.identity: No such file or directory`
**Expected**: Should return the current `CURRENT_SSH_DIR` value
**Action**: Investigate the `user` script — does this method exist? Is the name wrong? Fix or document correct invocation.

## Issue 2: `ossh config.create` hardcodes `id_rsa`

**Test**: `ossh config.create testhost root@localhost:22`
**Actual**: Generates `IdentityFile /Users/donges/.ssh/id_rsa` always
**Expected**: Should auto-detect key type in the target sshDir (`id_ed25519`, `id_rsa`, `id_ecdsa`)
**Note**: `ossh isInstalled` and `user ssh.create.folders` already detect `id_ed25519` correctly. Only `config.create` is hardcoded.
**Action**: Add key type detection to `config.create`, matching the pattern used by `isInstalled`.

## Issue 3: `ossh list.ids` returns exit code 1 on success (minor)

**Test**: `ossh list.ids "" /Users/Shared/Workspaces/AI/Claude/experiment/.ssh`
**Actual**: Correct output but exit code 1
**Expected**: Exit code 0 on success
**Action**: Likely missing `return 0` or `tree` command exit code leaking through.

## After Fixing

Re-run the failed/affected tests and report results back to ossh-tester. I will verify.
