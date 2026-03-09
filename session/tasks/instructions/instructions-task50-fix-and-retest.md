# Task 50: Not Done Yet — Fix + Real Test

## Bug Found by ScrumMaster

`ossh.exec` at line 1256 uses raw `ssh` without ControlPath:
```bash
ssh $toHost "source config/user.env; $@"
```

This means `ossh push.key` (line 982) calls `ossh.exec` which opens a NEW ssh connection — defeating single-password auth. The user gets prompted twice.

### Fix for Expert
Add ControlPath to `ossh.exec`:
```bash
ssh -o ControlPath="$OSSH_CONTROL_PATH" $toHost "source config/user.env; $@"
```

### Also check
- `user` script (lines 119, 137, 181) hardcodes `/tmp/ossh-%r@%h:%p` instead of using `$OSSH_CONTROL_PATH` — if the path ever changes, user breaks.

## Real Testing for Tester

The previous "validation" only did grep + bash -n. That's not testing.

**Actual tests needed:**
1. `bash -n ossh` — syntax (already done, keep it)
2. `grep -c 'scp ' ossh` — should be 0 functional scp calls (1 commented OK)
3. `grep 'ssh .*\$toHost' ossh` — find any raw ssh calls missing ControlPath
4. Verify `ossh.exec` now has ControlPath
5. Verify ALL `ssh` calls in push/pull methods use either `private.ossh.ssh` or have `-o ControlPath`
6. Check `user` script ssh calls also use ControlPath
7. If test.suite tests exist for ossh, RUN THEM: `./test.suite run ossh 1`

## Flow
1. Expert: fix ossh.exec + user script, commit
2. Tester: run real validation per above, report PASS/FAIL to pane 0.6
3. When ALL PASS: notify ScrumMaster at pane 0.6 with "Task 50 DONE — tested"
