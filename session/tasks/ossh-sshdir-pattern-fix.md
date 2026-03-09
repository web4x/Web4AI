# Task: Fix CURRENT_SSH_DIR pattern + ossh login completion

**Assigned to**: oosh-expert (analyze + fix), oosh-tester (verify)
**Priority**: HIGH (Tron directive 2026-03-06)
**Context**: SSH user-switching experiment (`user in`) set a config variable that breaks ossh completion

## Problem Analysis (PO measured)

### Issue 1: Typo in config value
```
~/config/user.env: export CURRENT_SSH_DIR="/User/donges/.ssh"
```
Path `/User/donges/.ssh` does NOT exist (missing 's' — should be `/Users/...`). This causes:
- `ossh login [tab]` → EPERM at line 1457 (grep fails on non-existent config file)
- Any method calling `private.get.sshDir` without explicit argument breaks

### Issue 2: Wrong OOSH pattern
`CURRENT_SSH_DIR` as a bare global env var is NOT the correct OOSH pattern. The `user.in()` function (user script, line 45-67) does:
```bash
config set CURRENT_SSH_DIR $CURRENT_SSH_DIR
```
This stores a raw path globally. The OOSH pattern for configurable parameters uses the `sshDir` parameter mechanism already defined in method signatures: `<?sshDir:~/.ssh>`.

### Issue 3: DRY violation
`private.get.sshDir()` is duplicated:
- `/Users/donges/oosh/user` line 81-93
- `/Users/donges/oosh/ossh` line 765-777
Both are identical. Should be in ONE place.

### Issue 4: Completion doesn't source config
In a fresh shell, `CURRENT_SSH_DIR` is empty (not exported by default). Tab completion only works after `source $CONFIG`. But OOSH's c2 completion system should handle this transparently.

## What needs to happen

1. **Fix the config value** — clear the broken `CURRENT_SSH_DIR` or correct the path
2. **Decide the correct OOSH pattern** for switching SSH directories:
   - Option A: Keep `private.get.sshDir` chain but fix the variable naming (`OOSH_SSH_DIR`?) and make the c2 completion source it
   - Option B: Remove global state — make `sshDir` a purely pass-through parameter
3. **DRY the shared function** — `private.get.sshDir` belongs in ONE script (ossh or user, not both)
4. **Make completion robust** — `private.get.sshDir` should NOT crash when the resolved path doesn't exist. Fallback to `$HOME/.ssh`.

## Experiment context
- Experiment SSH dir: `/Users/Shared/Workspaces/AI/Claude/experiment/.ssh/`
- Has ids: `testbot`, `testbot2`
- Has its own `config` with `testhost` entry
- `user in testbot2` was supposed to switch ossh to use this experiment dir

## Files involved
| File | Role |
|------|------|
| `/Users/donges/oosh/user` | `user.in()` sets CURRENT_SSH_DIR (line 35-74), has `private.get.sshDir` (line 81-93) |
| `/Users/donges/oosh/ossh` | All completion functions use `private.get.sshDir` (line 765-777), `ossh.login.completion` (line 864) |
| `~/config/user.env` | Stores broken `CURRENT_SSH_DIR` value |

## Verification (tester)
1. `ossh login [tab]` shows hosts from correct config BEFORE and AFTER `user in <id>`
2. `user in testbot2 /Users/Shared/Workspaces/AI/Claude/experiment/.ssh` → `ossh login [tab]` shows `testhost`
3. `user in main` → `ossh login [tab]` shows default hosts again
4. No EPERM when path is missing — graceful fallback
5. `private.get.sshDir` exists in exactly ONE script, not two
