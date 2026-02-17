# ossh Completion — Phase 1 Test Report
**Agent**: ossh-tester
**Date**: 2026-02-17
**Task**: 20260217T1300Z.ossh-team.md

## Environment
- Shell: bash (test shell at osshTeam:0.1)
- OOSH initialized via `source ~/.bashrc`
- Working directory: ~/oosh

## Test Results

### Test 1: `ossh [Tab]` — method completion
**RESULT: PASS**
- Shows all ossh methods correctly (config.create, exec, login, list, etc.)
- `complete -p ossh` confirms: `complete -F _oo_completion ossh`
- Method names display properly with usage descriptions

### Test 2: `ossh login [Tab]` — SSH host completion
**RESULT: FAIL**
- Shows ALL files in current directory instead of SSH hosts
- Paged output (--More--) listing directory contents

### Test 3: `ossh config.get [Tab]` — config key completion
**RESULT: FAIL**
- Same behavior as login — shows all files in current directory

## Root Cause Analysis

### Bug 1: `private.get.sshDir` stdout leak (ossh:772)
```bash
private.get.sshDir() {
  ...
  create.result 0 "$sshDir" "$1"
  echo "$RESULT"          # <-- THIS LEAKS TO STDOUT
  return $(result)
}
```
OOSH convention: use `RESULT` variable, NOT `echo`. When called from a completion function, this echo output becomes a completion option. The path `/Users/Shared/Workspaces/AI/Claude/experiment/.ssh` appears as a selectable completion item.

### Bug 2: `Host *` not filtered from completion
`ossh.parameter.completion.sshConfigHost()` (ossh:546-550):
```bash
grep '^Host' $sshDir/config $sshDir/config.d/* 2>/dev/null | cut -d ' ' -f 2-
```
SSH config has `Host *` (catch-all). The `*` is included in completion results. When bash puts `*` in COMPREPLY, it glob-expands to ALL files in the current directory.

### Bug 3: CURRENT_SSH_DIR persisted to experiment path
`config get CURRENT_SSH_DIR` = `/Users/Shared/Workspaces/AI/Claude/experiment/.ssh`
This was set by a previous `user ssh.id` call. The experiment/.ssh/config only has 2 hosts (github.com, *) instead of the full 20+ hosts in ~/.ssh/config.

### How the bugs combine:
1. `ossh login [Tab]` triggers `ossh.parameter.completion.sshConfigHost()`
2. `private.get.sshDir` gets `CURRENT_SSH_DIR` from user.env → `experiment/.ssh`
3. `echo "$RESULT"` leaks `experiment/.ssh` path to stdout → completion item #1
4. `grep '^Host'` on experiment config finds: `github.com`, `*` → completion items #2, #3
5. Bash processes COMPREPLY containing `*` → glob-expands to all files in cwd
6. Result: file listing instead of SSH hosts

## Additional Observations

### `_oo_completion` vs `_oo_commands` functions
- `_oosh_commands` file defines `_oo_commands()` (different function name)
- `complete -p ossh` uses `_oo_completion` (from c2/ng system)
- The `_oo_commands` function also has a fallback bug at lines 16-18:
  ```bash
  if [ $COMP_CWORD -gt 1 ] && [ "" = "${COMP_WORDS[-1]}" ]; then
    COMPREPLY=( $(compgen -o default $cur) )  # falls back to file completion
    return 0
  fi
  ```

### c2 errors when sourced directly
`. /Users/donges/oosh/c2` produces:
- `bash: cd: ng: No such file or directory`
- `bash: /../this: No such file or directory`
Not blocking for completion, but indicates c2 has path issues.

### OOSH intercepts shell commands
In the OOSH-initialized shell:
- `echo` is intercepted (tries to `cat` args instead)
- `grep | grep` fails with EPERM (OOSH blocks pipes)
- `type <function>` for script-internal functions returns "not found" (expected — they're not shell functions)

## Fixes Required (for Expert)

1. **Remove `echo "$RESULT"` from `private.get.sshDir()` (ossh:772)** — callers should use `$RESULT`
2. **Filter `Host *` from completion** in `ossh.parameter.completion.sshConfigHost()` (ossh:549) — add `| grep -v '^\*$'`
3. **Same fix needed in user script** — `private.get.sshDir` at user:81-87 (check if same echo bug exists)

## Pre-fix Completion Result (completion.result.txt after Tab)
```
/Users/Shared/Workspaces/AI/Claude/experiment/.ssh
github.com
*
```
Expected: list of SSH hosts from ~/.ssh/config (20+ hosts)
