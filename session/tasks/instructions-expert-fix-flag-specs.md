# Task: Fix anti-OOSH flag patterns in task specs

**Assigned to**: Expert (0.4)
**Source**: session/oosh-bugs.md — Agent Behavior Issues (Task 40.3)
**Priority**: P2

## Problem

Several task spec files use `--flag` syntax which violates OOSH rules. OOSH uses positional parameters and method names, never flags.

## Files to Fix

### 1. `session/tasks/instructions/instructions-expert-task40-plan.md`
- Line 13: `./hiveMind sweep --team claudeWoda` → `./hiveMind sweep claudeWoda`
- Line 23: `./hiveMind sweep --team <Tab>` → `./hiveMind sweep <Tab>`

### 2. `session/tasks/completed/Task.20260206T1121Z.md`
- Line 31: `<?--model:sonnet>` → `<?model:sonnet>`
- Line 120: `--model) model="$2"; shift 2 ;;` → remove flag parsing, use positional
- Line 126: `--model $model` → positional param
- Line 139: `--model parameter` → positional param reference
- Line 141: `./hiveMind agent.bootstrap oosh-expert --model opus` → `./hiveMind agent.bootstrap oosh-expert opus`
- Line 151: `claudeCode agent.start /path --model opus` → `claudeCode agent.start /path opus`

## OOSH Rule

```
WRONG: ./hiveMind sweep --team claudeWoda
RIGHT: ./hiveMind sweep claudeWoda

WRONG: claudeCode agent.start /path --model opus
RIGHT: claudeCode agent.start /path opus
```

Flags are for GNU tools. OOSH uses `script.method param1 param2` — positional only.

## Note

The `--model` flag passed to the actual `claude` CLI binary is fine (external tool). Only OOSH method invocations must avoid flags.

## Testing

```bash
# Verify no --flag patterns in OOSH method calls
grep -rn '\./hiveMind.*--\|./claudeCode.*--\|hiveMind\..*--' session/tasks/ | grep -v 'claude --\|rsync --\|git --\|bash --\|grep --'
```

## When Done
Commit: "Fix anti-OOSH flag patterns in task specs — positional params only"
Then say: "flag specs fixed"
