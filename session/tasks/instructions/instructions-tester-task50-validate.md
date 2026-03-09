# Task 50 Validation — REAL testing

**Assigned to**: Tester (cursorOrchestrator:0.5)

## Tests to Run

Run these from `components/OOSH/dev.claude/`:

1. **Syntax check**: `bash -n ossh` — must PASS
2. **No remaining scp**: `grep -c 'scp ' ossh` — should be 0 functional scp calls (commented lines OK)
3. **No raw ssh to $toHost**: `grep 'ssh .*\$toHost' ossh | grep -v ControlPath | grep -v '#'` — should be empty (all ssh calls must have ControlPath)
4. **ossh.exec has ControlPath**: `grep -A2 'ossh.exec()' ossh` — must show ControlPath in the ssh call
5. **All push/pull ssh calls**: `grep -n 'ssh.*ControlPath' ossh` — verify coverage across all methods
6. **user script**: `grep 'ControlPath' components/OOSH/dev.claude/user` — verify user script uses $OSSH_CONTROL_PATH (not hardcoded path)
7. **test.suite** (if exists): `./test.suite run ossh 1`

## Reporting

For each test, report PASS or FAIL with evidence.

When ALL PASS, send to pane 0.6: "Task 50 DONE — tested"
If any FAIL, report which test failed and what was found.
