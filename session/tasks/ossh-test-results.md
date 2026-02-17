# ossh/user Test Results Report

**From**: ossh-tester (this session)
**Date**: 2026-02-17
**Test environment**: `/Users/Shared/Workspaces/AI/Claude/experiment/.ssh/`
**Test plan**: `20260212T1126Z.task.md` (po-new-ossh-agents)

---

## Overall Result: 14/15 PASS, 1 FAIL

| Phase | Tests | Pass | Fail |
|-------|-------|------|------|
| 1: Basic Resolution | 3 | 2 | 1 |
| 2: Identity Management | 3 | 3 | 0 |
| 3: Config Management | 3 | 3 | 0 |
| 4: Structure Management | 3 | 3 | 0 |
| 5: Backward Compatibility | 3 | 3 | 0 |

---

## Phase 1: Basic Resolution

| # | Command | Result | Output |
|---|---------|--------|--------|
| 1 | `user in /Users/Shared/Workspaces/AI/Claude/experiment/.ssh` | **PASS** | Set `CURRENT_SSH_DIR` to experiment dir |
| 2 | `user get.current.identity` | **FAIL** | `get.current.identity: No such file or directory` — method not found by dispatch |
| 3 | `ossh isInstalled log /Users/Shared/Workspaces/AI/Claude/experiment/.ssh` | **PASS** | `ssh is initialized for donges in .../experiment/.ssh (id_ed25519)` |

## Phase 2: Identity Management

| # | Command | Result | Output |
|---|---------|--------|--------|
| 4 | `ossh list.ids "" /Users/Shared/Workspaces/AI/Claude/experiment/.ssh` | **PASS** | Listed `ids/testbot` (from prior run). Exit code 1 despite success (minor bug). |
| 5 | `ossh id.create testbot2 /Users/Shared/Workspaces/AI/Claude/experiment/.ssh` | **PASS** | Created ed25519 keypair at `ids/testbot2/id_ed25519` |
| 6 | `ossh list.ids "" /Users/Shared/Workspaces/AI/Claude/experiment/.ssh` | **PASS** | Listed `ids/testbot` + `ids/testbot2` |

## Phase 3: Config Management

| # | Command | Result | Output |
|---|---------|--------|--------|
| 7 | `ossh config.list /Users/Shared/Workspaces/AI/Claude/experiment/.ssh/config` | **PASS** | Listed `github.com` host + `*` wildcard |
| 8a | `ossh config.create testhost root@localhost:22` | **PASS** | Created entry. **IdentityFile defaults to `id_rsa`** (known issue). |
| 8b | `ossh config.save.last /Users/Shared/Workspaces/AI/Claude/experiment/.ssh/config` | **PASS** | Saved to experiment config |
| 9 | `ossh config.get testhost /Users/Shared/Workspaces/AI/Claude/experiment/.ssh/config` | **PASS** | Retrieved entry with all fields correct |

## Phase 4: Structure Management

| # | Command | Result | Output |
|---|---------|--------|--------|
| 10 | `user ssh.create.folders /Users/Shared/Workspaces/AI/Claude/experiment/.ssh` | **PASS** | Created `private_key/donges.McDonges.native.private_key` and `public_keys/donges.McDonges.native.public_key` from `id_ed25519` — key type auto-detected correctly |
| 11 | `user in main` | **PASS** | `CURRENT_SSH_DIR` set back to `/Users/donges/.ssh` |
| 12 | `ossh isInstalled log` | **PASS** | `ssh is initialized for donges in /Users/donges/.ssh (id_rsa)` — main restored |

## Phase 5: Backward Compatibility

| # | Command | Result | Output |
|---|---------|--------|--------|
| 13a | `ossh isInstalled log` | **PASS** | Works without sshDir param, reports `~/.ssh (id_rsa)` |
| 13b | `ossh config.list` | **PASS** | Lists full `~/.ssh/config` (60+ hosts) |
| 13c | `ossh list.ids` | **PASS** | Lists `ids/avis.donges` under `~/.ssh` |

**Backward compatibility confirmed.** All commands work with default `~/.ssh` when no sshDir parameter is provided.

---

## Issues Found

### 1. FAIL: `user get.current.identity` — method not found (Test 2)

- **Severity**: HIGH
- **Error**: `get.current.identity: No such file or directory` followed by `get.current.identity.usage: command not found`
- **Analysis**: The `user` script dispatch cannot resolve `get.current.identity`. Either the method does not exist, uses a different name, or the dot-separated method dispatch is failing for this specific method.
- **Action**: ossh-expert to investigate the `user` script and fix or document the correct method name.

### 2. Known Issue: `config.create` hardcodes `id_rsa` (Test 8a)

- **Severity**: MEDIUM
- **Behavior**: `ossh config.create testhost root@localhost:22` generates `IdentityFile /Users/donges/.ssh/id_rsa` regardless of the actual key type present.
- **Expected**: Should auto-detect key type (`id_ed25519`, `id_rsa`, `id_ecdsa`) in the target sshDir.
- **Note**: `ssh.create.folders` (Test 10) and `isInstalled` (Test 3) DO correctly detect `id_ed25519`. Only `config.create` is hardcoded.
- **Action**: ossh-expert to add key type detection to `config.create`, matching the pattern already used by `isInstalled`.

### 3. Minor: `list.ids` returns exit code 1 on success (Tests 4, 6)

- **Severity**: LOW
- **Behavior**: Command produces correct output but returns exit code 1.
- **Impact**: Could break scripted pipelines that check `$?`.
- **Action**: ossh-expert to investigate — likely a missing `return 0` or the `tree` command exit code leaking through.

### 4. Cosmetic: `/dev/tty` warnings in non-interactive shell

- **Severity**: COSMETIC
- **Behavior**: `/Users/donges/oosh/log: line 144: /dev/tty: Device not configured` appears on several commands.
- **Impact**: None — logging side effect when running outside a terminal.
- **Action**: No fix needed. Expected behavior in non-interactive contexts.

---

## Acceptance Criteria Status

- [x] 3 new agents created with proper SKILL.md files
- [x] All Phase 1-5 tests executed and results documented
- [x] Backward compatibility confirmed (Phase 5)
- [x] Known issues documented (id_rsa vs id_ed25519)
- [ ] No regressions in existing ossh/user functionality — **1 failure** (`get.current.identity`), needs investigation to determine if regression or pre-existing

---

## Recommended Next Steps

1. **ossh-expert**: Investigate `user get.current.identity` — is it a valid method? What's the correct invocation?
2. **ossh-expert**: Add key type auto-detection to `ossh config.create` (match `isInstalled` pattern)
3. **ossh-expert**: Fix `list.ids` exit code
4. **ossh-po**: Review this report and sign off
