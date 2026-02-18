# Agent Context — ossh-expert (operating in script-product-owner pane)

## Metadata
- **Updated**: 2026-02-18T13:30Z
- **Role**: ossh-expert
- **Session**: projectTeam
- **SKILL.md**: `.claude/agents/ossh-expert/SKILL.md`

## Recovery Steps
1. Read this file
2. All 3 bugs from test coverage audit are DONE
3. Look for new work via TaskList or wait for assignment

## Completed Work: Fix 3 Bugs from Test Coverage Audit

### BUG 1: Dashed parameter names — FIXED (commit 55cdca4)
- **File**: `/Users/donges/oosh/this` line 683-692
- **Fix**: Added `[[ "$1" == *-* ]]` check in `this.start()` to reject dashed names with error suggesting dot notation

### BUG 2: this.isNumber accepts non-numbers — FIXED (commit 55cdca4)
- **File**: `/Users/donges/oosh/this` line 43-45
- **Fix**: Replaced `case` pattern with bash regex `[[ "$1" =~ ^[0-9]+$ ]]`

### BUG 3: scrumMaster PDCA state name mismatch — FIXED (commit 1bb673c)
- **File**: `/Users/donges/oosh/this` line 126-128 (this.init)
- **Fix**: Added `: ${CONFIG_PATH:=$HOME/config}` + `export CONFIG_PATH` to `this.init()`
- **Root cause**: `this.init()` never set CONFIG_PATH. Subprocess calls like `./scrumMaster pdca.state` had empty CONFIG_PATH, so `$CONFIG_PATH/stateMachines/` resolved to `/stateMachines/` — state file not found, fell back to "initialized"
- **Test result**: 9/9 test.scrumMaster pass, 7/7 test.this pass

## All Committed & Pushed
- `55cdca4` — BUG 1 + BUG 2 fixes
- `1bb673c` — BUG 3 fix
- Both pushed to `origin/dev.claude`

## Learnings
- Bash tool runs in zsh, not bash — always use `bash -c '...'` for OOSH testing
- `[[ "$1" =~ ^[0-9]+$ ]]` is more reliable than `case *[!0-9]*` for number checking
- `./script` from clean shell triggers debug trap (setTrap → step DEBUG) causing hangs — test from OOSH-initialized env instead
- CONFIG_PATH must be set for state machine operations — `this.init()` now provides default
- The state machine uses files in `$CONFIG_PATH/stateMachines/` to persist state across subprocesses
- oosh repo: `/Users/donges/oosh/`, branch `dev.claude`
- Workspace repo: `/Users/Shared/Workspaces/AI/Claude/`, branch `main`
