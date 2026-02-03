---
name: script-product-owner
description: "Script ownership contract. Defines what it means to own an OOSH script. Not a separate agent role — ownership is held by the expert+tester pair assigned to each script."
---

# Script Ownership Contract

This is NOT a separate agent role. It defines the **ownership contract** that every OOSH script must satisfy. The expert+tester pair assigned to a script are its product owners.

## OOSH-Only Rule (MANDATORY)

**Never use raw tmux commands** in owned scripts. Always use `otmux` and `hiveMind` wrappers. Flag any raw `tmux send-keys`, `tmux capture-pane`, or `tmux new-session` as a first-principles violation during ownership audits.

## No Skip Permissions (MANDATORY)

**NEVER use `--dangerously-skip-permissions`** in owned scripts or team setup. The ScrumMaster handles all permission approvals. Flag any usage as a governance violation during ownership audits.

## Named Sessions (MANDATORY)

**Every Claude Code session MUST have a name matching the agent role.** No unnamed sessions allowed. Agents performing ownership audits must use their own role-named session (e.g., `oosh-expert`, `product-owner`).

## Ownership = Expert + Tester

Every script has two co-owners:

| Role | Responsibility |
|------|---------------|
| **Expert** | Knows internals, implements changes, maintains architecture, ensures DRY |
| **Tester** | Validates usability contract, writes tests, catches regressions |

The overall Product Owner governs first principles across all scripts. The pair governs their script.

## The Usability Contract

A script is considered "owned" only when it satisfies ALL of these:

### 1. Self-Explaining: `usage` Method (REQUIRED)

```bash
scriptname.usage() # # display usage information
{
  echo "scriptname - brief description"
  echo ""
  echo "Methods:"
  echo "  scriptname method1    - does X"
  echo "  scriptname method2    - does Y"
  echo ""
  echo "Examples:"
  echo "  ./scriptname method1 arg1"
}
```

**Test**: `./scriptname` with no args must print usage. `./scriptname usage` must print usage.

The constructor pattern:
```bash
scriptname.start() {
  source this
  if [ -z "$1" ]; then
    scriptname.usage
    return 0
  fi
  this.start "$@"
}
```

### 2. Self-Explaining: Tab Completion (REQUIRED)

Every public method must have a proper signature so `c2` can parse it:

```bash
scriptname.method() # <required> <?optional:default> # description
{
  local required="$1"
  local optional="${2:-default}"
}
```

**Test**: `./c2 function.completion ./scriptname` must list all public methods.

For parameters with a known set of valid values, add completion functions:

```bash
scriptname.method.completion.paramname() {
  echo "value1"
  echo "value2"
}
```

**Test**: `./c2 function.completion ./scriptname method` must list parameter completions.

### 3. Logging (REQUIRED)

All user-visible output through log functions:

| Function | Use for |
|----------|---------|
| `info.log` | Informational messages |
| `success.log` | Completion/success |
| `error.log` | Errors |
| `warn.log` | Warnings |
| `debug.log` | Debug-level output |

**NEVER** use bare `echo` for status messages. `echo` is only for data output (e.g., completion functions returning values, or piped output).

### 4. Return Values (REQUIRED)

```bash
# Numeric exit code
return 0   # success
return 1   # failure

# String results for callers
RESULT="the result"
create.result 0 "the result"  # sets both RETURN_VALUE and RESULT
```

### 5. Private Helpers (REQUIRED for internal logic)

```bash
private.scriptname.helper() {
  # Internal implementation — not exposed via completion
}
```

### 6. Test File (REQUIRED)

Every script must have `test/test.scriptname`:

```bash
#!/usr/bin/env bash
source this
source test.suite
source scriptname

log.level $level

test.case $level "description" scriptname.method args
expect 0 "expected" "assertion"

test.suite.save.results
```

## Ownership Lifecycle

### New script creation

```bash
./oo new myscript              # Creates script from template
./oo new.test myscript         # Creates test file
# Expert fills in methods, Tester writes tests
# Product Owner verifies usability contract
```

### Adding methods

```bash
./oo new.method myscript.newmethod   # Adds method from template
# Expert implements, Tester adds test cases
# Verify: ./myscript usage still works, Tab completion includes new method
```

### Change workflow

1. Expert implements the change
2. Expert verifies: `./script usage` still works, Tab completion still works
3. Tester runs: `./test.suite run script 1`
4. Tester verifies usability contract items 1-6
5. Product Owner spot-checks first principles compliance

## Ownership Assignment

The Orchestrator assigns script ownership by giving an expert+tester pair responsibility for specific scripts:

```
Orchestrator assigns:
  hiveMind    → Expert: oosh-expert,  Tester: oosh-tester
  ossh        → Expert: oosh-expert,  Tester: oosh-tester
  config      → Expert: oosh-expert,  Tester: oosh-tester
  claudeCode  → Expert: oosh-expert,  Tester: oosh-tester
```

As the team grows, different expert+tester pairs can own different scripts. The Product Owner ensures all pairs follow the same usability contract.

## Quick Ownership Audit

For any script, check these in order:

```bash
# 1. Does usage work?
./scriptname usage

# 2. Does Tab completion work?
./c2 function.completion ./scriptname

# 3. Do methods have signatures?
grep '() #' scriptname | head -20

# 4. Do tests exist and pass?
./test.suite run scriptname 1

# 5. Is logging correct?
grep -n 'echo "' scriptname   # should be minimal — mostly in usage/completion
```

If any of 1-4 fail, the script is NOT properly owned and needs attention from its expert+tester pair.

## File-Based Communication (MANDATORY)

**All work is defined in task files, not in messages.** Task files at `session/tasks/Task.{N}.{YYYYMMDDHHMM}.md` contain full descriptions. Messages between agents are short notifications only: `New task: <path>`, `Task N done`, `Task N blocked: <reason>`.

## Context Preservation (MANDATORY)

**All agents performing ownership audits must monitor context usage.** At 20% context remaining: STOP work, save state to `session/agents/<your-role>.context.md` following the schema in `docs/context-schema.md`, then run `/compact`. Do NOT wait until context is exhausted.

**NEVER run `/compact` without saving state first.** Auto-compacting without saving loses your current work permanently. The sequence is always: STOP → SAVE → `/compact`. No exceptions.

## Quota Awareness (MANDATORY)

**Monitor Claude Code subscription usage during audits.** At 80%+ usage: reduce audit frequency, batch findings, essential operations only. At 90%+: stand down completely, save state, notify Orchestrator.
