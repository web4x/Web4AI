# ossh Completion Test Report — Phase 1

**Agent**: ossh-tester
**Date**: 2026-02-17T13:30Z
**Shell**: OOSH bash (after fixing test shell from zsh)

## Summary

`ossh login [Tab][Tab]` is BROKEN. It shows file/directory listings instead of SSH config host names. Root cause is two-fold.

## Test Environment

- Test shell: osshTeam:0.1
- Shell: bash (sourced via `source ~/.bashrc` in bash subshell)
- OOSH loaded: YES — prompt shows `[oosh McDonges.native]`
- Completion registered: YES — `complete -F _oo_completion ossh`

## Test Results

| # | Test | Expected | Actual | Result |
|---|------|----------|--------|--------|
| 1 | `ossh [Tab]` | List of ossh methods | Shows methods correctly (config.edit, config.get, login, list.ids, etc.) | **PASS** |
| 2 | `ossh login [Tab]` | SSH host names (github.com, Web.DongesIT, etc.) | Shows usage/help text, then file listings | **FAIL** |
| 3 | `ossh login [Tab][Tab]` | SSH host names | Shows file/directory listings from $PWD | **FAIL** |
| 4 | `ossh config.get [Tab]` | SSH host names | Shows usage/help text, then interactive prompt | **FAIL** |
| 5 | `complete -p ossh` | Completion function registered | `complete -F _oo_completion ossh` | **PASS** |

## Root Cause Analysis

### Issue 1: Completion functions not loaded into shell

```
$ type ossh.login.completion
bash: type: ossh.login.completion: not found

$ type ossh.config.get.completion
bash: type: ossh.config.get.completion: not found

$ type ossh.parameter.completion.sshConfigHost
bash: type: ossh.parameter.completion.sshConfigHost: not found
```

The completion functions exist in the `ossh` script file but are NOT sourced into the bash session. The `_oo_completion` callback (from c2) needs these functions to be in memory, but they aren't. So it falls through to default file completion.

### Issue 2: `ossh.parameter.completion.sshConfigHost` returns wrong results

When called via OOSH dispatch:
```
$ ossh parameter.completion.sshConfigHost
/Users/Shared/Workspaces/AI/Claude/experiment/.ssh
github.com
*
```

Expected: A list of SSH config host names from `~/.ssh/config` (github.com, Web.DongesIT, SNET.prod, shift2cu, etc.)

Actual: Returns a directory path, one host, and a wildcard. Only `github.com` is a valid host. The path and `*` are wrong.

### Issue 3: Initial test shell was zsh (not bash)

The tmux pane osshTeam:0.1 started in zsh (macOS default). OOSH completions use bash's `complete` builtin which doesn't exist in zsh. All `add_to_completion:7: command not found: complete` errors at startup confirm this. This was fixed by starting bash and sourcing OOSH.

## Hosts That SHOULD Appear (from ~/.ssh/config)

```
github.com, Web.DongesIT, SNET.prod, shift2cu, Web.CC, Web.2cu.it,
KPP.root, KPP, backup.sfsre.com, patricia-backs-macbook-2.fritz.box,
pubuntu, qnap, 13mi, 2cuBitbucket, surface, githubCC.cerulean,
githubCC.tech4people, githubCC.soundcurrency, iMac, WODA.test.once2023,
samsungTablet, avis.login, avis.jump, avis.admin.avis.exchange.login,
avis.exchange.login, avis.web1.avis.land.dev, avis.web1.avis.land.db,
avis.srvavis.avis.technology, avis.user.exchange.login
```

## Additional Observations

1. The `your command >` display (printed by `_oo_completion`) shows up during Tab, which creates a confusing interactive prompt that interferes with normal completion flow.
2. `completion.result.txt` at `~/config/` is written by the completion system and does contain some results — but they're wrong (path + wildcard instead of host names).
3. `ossh [Tab]` (method completion) works correctly — methods are listed properly. The bug is parameter-level completion only.

## Recommended Investigation for ossh-expert

1. **Check how c2 loads completion functions** — are they supposed to be sourced into the shell, or called via subprocess? If subprocess, the OOSH dispatch works but the bash completion callback can't use them.
2. **Fix `ossh.parameter.completion.sshConfigHost()`** — it should parse `~/.ssh/config` for `Host` lines and return host names. Currently returns a directory path and wildcard.
3. **Check `completion.result.txt` pipeline** — the `_oo_completion` function reads from this file. If the file contains wrong data, completion will be wrong.
4. **Compare `c2` current vs `restore/c2`** — may reveal changes that broke the loading mechanism.
