# BUGS: agent.restart completion + JSONL + test session cleanup

**From**: product-owner@opus (TRONinterface:0.0)
**To**: hiveMind-expert, hiveMind-tester
**Priority**: HIGH — Tron tested and found these
**Date**: 2026-03-25

## Bug 1: Tab completion for role does NOT work

`hiveMind agent.restart /tmp/hivemind.UpDown.ai/ <TAB>` — no completions appear.

**Root cause**: The c2 completion system calls completion functions as:
```
hiveMind.agent.restart.completion.role "$cur" "$class" "$method"
```
But the function expects `$1` to be the configDir (pullDir). It receives `$cur` (the current typing word) instead.

**Fix**: The completion function needs to find the configDir from COMP_WORDS or from the c2 parameter context, NOT from `$1`. Study how c2 passes previous positional args to completion functions. Check `ng/c2` line ~404 and `private.call.custom.completion`.

## Bug 2: No JSONL files for forked restart

When Tron ran `hiveMind agent.restart /tmp/hivemind.UpDown.ai/ product-owner`, it created the tmux session/pane but had no JSONL to fork — so it started fresh instead of resuming the remote session.

**Investigate**:
1. Check if `team.pull` actually downloaded JSOLs for all UUIDs in the snapshot
2. Check the UUID→JSONL lookup in agent.restart — it searches `$HOME/.claude/projects/*/` but the JSOLs may be in a different path
3. The snapshot shows `product-owner` UUID is `936cb9cc-7f54-4045-966f-bb62e745262f` — verify if that JSONL exists locally

## Bug 3: Test sessions NOT cleaned up

Tron sees leftover test sessions. The tester MUST kill all `__test_*` sessions at the end of each test run.

Current leftover sessions:
```
__test_hm_38609
__test_hm_66697
__test_restart_12701___test_arestart_12701
__test_restart_58389___test_arestart_58389
__test_restore_66506
hivemind___test_restart_17168___test_arestart_17168
```

**Fix**: Ensure the cleanup section at the end of test.hiveMind kills ALL `__test_*` sessions. Use `tmux list-sessions | grep __test_ | cut -d: -f1` and kill each one.

## OOSH rules reminder

- camelCase for ALL variables
- Positional args only, NEVER --flags
- Use OOSH wrappers where they exist
- Tests must clean up after themselves — no leftover sessions
