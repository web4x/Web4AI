# Re-Test: oo mode with latest symlink + oo use

**From**: PO
**For**: oosh-tester
**Priority**: HIGH

## What changed (commit 96be66e)

Expert implemented Tron's architecture to fix the bootstrap paradox:

1. **`latest` symlink** created: `/Users/Shared/Workspaces/AI/Claude.All/components/OOSH/latest -> dev.claude`
2. **`oo mode` bootstrap**: when NOT on latest's code, delegates to latest's oo.mode()
3. **`oo use <branch> <command> [args]`**: one-shot execution from any branch WITHOUT switching

## Where to test

Use **ooshDebug** tmux session, pane `ooshDebug:0.1` or `ooshDebug:0.2`.

```bash
otmux send ooshDebug:0.1 "command" Enter
otmux pane.capture ooshDebug:0.1 20
```

## Test Cases (9 tests)

### T1: `oo mode` — show current mode
```bash
oo mode
```
**Expected**: Shows "Mode: dev.claude", path, git status.

### T2: `oo mode main` — switch to main
```bash
oo mode main
ls -la ~/oosh
```
**Expected**: Output says "Switched to: main". `~/oosh` → `.../OOSH/main`.

### T3: From main: `oo mode dev.claude` — switch BACK (was FAIL before, MUST PASS now)
```bash
oo mode dev.claude
ls -la ~/oosh
```
**Expected**: `~/oosh` → `.../OOSH/dev.claude/`. This is the bootstrap paradox fix — oo mode on main delegates to latest.

### T4: From main: `oo use latest user list` — one-shot from latest
```bash
oo mode main
oo use latest user list
```
**Expected**: Runs dev.claude's `user list` command from main context. No error.

### T5: `oo use main oo mode` — one-shot shows main's branch
```bash
oo use main oo mode
```
**Expected**: Shows main's branch status (old oo.mode output).

### T6: `oo use nonexistent-branch config list` — error
```bash
oo use nonexistent-branch config list
```
**Expected**: Error message about branch not found. Exit code 1.

### T7: `oo use main nonexistent-command` — error
```bash
oo use main nonexistent-command
```
**Expected**: Error message about command not found. Exit code 1.

### T8: Round-trip switching
```bash
oo mode main && oo mode hannes && oo mode dev.claude && oo mode
```
**Expected**: All switches work. Final `oo mode` shows dev.claude.

### T9: Tab completion
```bash
oo.mode.completion.branch
oo.use.completion.branch
```
**Expected**: Both list available branches including `latest`.

## CRITICAL: Always restore to dev.claude

After EVERY test that switches, verify `~/oosh` points to dev.claude:
```bash
ls -la ~/oosh
```
If not, restore: `rm ~/oosh && ln -s /Users/Shared/Workspaces/AI/Claude.All/components/OOSH/dev.claude ~/oosh`

## Safe test order

1. T1 (show — no switch)
2. T9 (completion — no switch)
3. T6, T7 (errors — no switch)
4. T5 (oo use — no switch)
5. T4 (oo use from main — switch first, then oo use)
6. T2 → T3 (switch to main, switch back — THIS is the critical fix test)
7. T8 (round-trip)

## Report

Write results to `session/tasks/tester-retest-oo-mode-latest.done.md`. PASS/FAIL for each of 9 tests.
