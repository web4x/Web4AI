# ossh Completion Investigation — Phase 1 Findings

**Agent**: ossh-expert
**Date**: 2026-02-17T14:00Z
**Status**: ROOT CAUSE FOUND

## Executive Summary

`ossh login [Tab]` is broken because `CURRENT_SSH_DIR` in `user.env` points to the experiment directory, which has only 2 Host entries instead of 30+. The ossh and user scripts themselves are UNCHANGED from restore.

## Diff Results

```
diff restore/ossh ossh → IDENTICAL (no changes)
diff restore/user user → IDENTICAL (no changes)
```

The scripts are not the problem. The environment is.

## Root Cause: CURRENT_SSH_DIR in user.env

**File**: `/Users/donges/config/user.env` line 12
```bash
export CURRENT_SSH_DIR="/Users/Shared/Workspaces/AI/Claude/experiment/.ssh"
```

### The Chain

1. `ossh login [Tab]` triggers `_oo_completion()` (from `2c.intsall`)
2. `_oo_completion` calls `$OOSH_DIR/ng/c2 completion.discover 2 "--" ossh login -`
3. c2 sources ossh, which sources `user.env` → sets `CURRENT_SSH_DIR`
4. c2 calls `ossh.login.completion()` → `ossh.config.get.completion()` → `ossh.parameter.completion.sshConfigHost()`
5. `ossh.parameter.completion.sshConfigHost()` calls `private.get.sshDir()`
6. `private.get.sshDir()` checks `$CURRENT_SSH_DIR` first (line 764), falls back to `$HOME/.ssh`
7. Since `CURRENT_SSH_DIR` is set → returns `/Users/Shared/Workspaces/AI/Claude/experiment/.ssh`
8. `grep '^Host' $sshDir/config $sshDir/config.d/*` runs against experiment dir

### Experiment .ssh/config (only 2 entries)

```
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519

Host *
    AddKeysToAgent yes
    IdentitiesOnly yes
```

- `Host *` is a wildcard — `cut -d ' ' -f 2-` returns `*`
- `config.d/` does NOT EXIST in experiment dir → glob `config.d/*` is literal, grep fails
- Result: only `github.com` and `*` are returned (plus the directory path from `private.get.sshDir` which echos RESULT)

### Real ~/.ssh/config (30+ entries)

Contains: WODA.metatrom, cloudways.metatrom, McDonges.native, McDonges, MacStudio, github.com, Web.DongesIT, SNET.prod, shift2cu, etc.

## Secondary Issue: private.get.sshDir() echoes the path

`private.get.sshDir()` at line 761-774 does:
```bash
create.result 0 "$sshDir" "$1"
echo "$RESULT"        # ← This echoes to stdout!
return $(result)
```

When called inside `ossh.parameter.completion.sshConfigHost()`:
```bash
private.get.sshDir
local sshDir="$RESULT"
grep '^Host' $sshDir/config $sshDir/config.d/*  | cut -d ' ' -f 2-
```

The `echo "$RESULT"` from `private.get.sshDir` goes to stdout and gets mixed into completion output. That's why the tester saw the directory path in results.

## Tester Issue 1: "Functions not loaded in shell" — RED HERRING

The tester reported `type ossh.login.completion → not found`. This is EXPECTED behavior. The `_oo_completion` callback runs c2 as a **subprocess** which sources ossh. Completion functions only exist in the subprocess context, never in the interactive shell. The c2 writes results to `$CONFIG_PATH/completion.result.txt` and the `_oo_completion` function reads that file for COMPREPLY. The functions don't need to be in the interactive shell.

## Fix Plan

### Fix 1: Remove or reset CURRENT_SSH_DIR (IMMEDIATE)

The `CURRENT_SSH_DIR` was set during experiment/testing and was never reset. Options:

- **Option A**: Remove line 12 from `user.env` entirely — completion defaults to `~/.ssh`
- **Option B**: Reset to `$HOME/.ssh` — explicit default
- **Option C**: Unset it — `unset CURRENT_SSH_DIR` in user.env

**Recommendation**: Option A — remove the line. The experiment was temporary. `private.get.sshDir()` already defaults to `$HOME/.ssh` when `CURRENT_SSH_DIR` is unset.

### Fix 2: private.get.sshDir() stdout leak

The `echo "$RESULT"` in `private.get.sshDir()` leaks the directory path to stdout, which pollutes completion output. This is a design issue — the function communicates via `$RESULT` variable AND stdout. Callers that capture stdout get the path mixed in.

However, this is an existing pattern across many OOSH functions. Changing it has broader impact and should be a separate task reviewed by PO.

### Fix 3: grep glob safety in ossh.parameter.completion.sshConfigHost()

```bash
grep '^Host' $sshDir/config $sshDir/config.d/*
```

If `config.d/` doesn't exist, `$sshDir/config.d/*` is literal and grep fails. Not critical (grep just reports error), but worth noting.

## Fixes Applied (Phase 2)

### Fix 1: CURRENT_SSH_DIR removed from user.env
- Removed line 12 (`export CURRENT_SSH_DIR="..."`) from `/Users/donges/config/user.env`
- `private.get.sshDir()` now defaults to `$HOME/.ssh` as intended

### Fix 2: echo → info.log in private.get.sshDir() (ossh:772)
- Changed `echo "$RESULT"` to `info.log "$RESULT"`
- Matches the user script pattern at user:92
- Stops stdout leak into completion results

### Fix 3: Filter Host * from completion (ossh:549)
- Added `| grep -v '^\*'` to filter wildcard Host entries
- Tightened grep to `'^Host '` (trailing space) for precision
- Prevents glob expansion of `*` in COMPREPLY

### Verification
- `ossh parameter.completion.sshConfigHost` now returns 70+ real hosts
- `test.suite run ossh` → 8/8 PASS, 0 failures
- Ready for tester Phase 3 validation

## Files Examined

| File | Finding |
|------|---------|
| `/Users/donges/oosh/ossh` | Identical to restore — no changes |
| `/Users/donges/oosh/user` | Identical to restore — no changes |
| `/Users/donges/oosh/ng/c2` | Completion discovery engine — no restore to diff |
| `/Users/donges/oosh/templates/user/2c.intsall` | Defines `_oo_completion`, registers completions |
| `/Users/donges/config/user.env` | **ROOT CAUSE** — line 12 sets wrong CURRENT_SSH_DIR |
| `/Users/Shared/Workspaces/AI/Claude/experiment/.ssh/config` | Only 2 hosts (github.com, *) |
| `~/.ssh/config` | 30+ real hosts |
| `/Users/donges/oosh/docs/oosh-architecture.md` | Architecture reference — read |
| `/Users/donges/oosh/docs/completion-system.md` | Completion reference — read |
