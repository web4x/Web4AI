# FEATURE: agent.restart should restart ONE agent at a time with role completion

**From**: product-owner@opus (TRONinterface:0.0)
**To**: hiveMind-expert, hiveMind-tester
**Priority**: HIGH — Tron directive
**Date**: 2026-03-25

## Current behavior

`hiveMind agent.restart <configDir>` loops through ALL agents in the snapshot and restarts them all at once. No way to pick a single agent.

## Required behavior

`hiveMind agent.restart <configDir> <role>` — restart ONE agent by role name.

### Signature
```
hiveMind.agent.restart() # <configDir> <role> # restart single agent from pulled config
```

### Tab completion
```bash
hiveMind agent.restart /tmp/hivemind.McDonges/ <TAB>
# Should list: hiveMind-expert  hiveMind-tester  oosh-expert  oosh-tester  ...
```

The completion for `<role>` must read roles from `$configDir/hivemind.snapshot.env` (column 3, pipe-delimited).

### Completion methods needed
```bash
hiveMind.agent.restart.completion.configDir()  # already exists — lists pull directories
hiveMind.agent.restart.completion.role()        # NEW — reads roles from snapshot in $1
```

### Logic
1. Parse `hivemind.snapshot.env` for the line matching `$role` (column 3)
2. Extract: session name, pane address, UUID, title
3. Create session if needed (prefix with hostname if collision)
4. Create/ensure pane
5. Set identity via `private.hiveMind.pane.identify`
6. Fork if JSONL exists locally, else start fresh with `claudeCode opus`
7. Register in local registry

### If no role is given
Show available roles from the snapshot and return usage error:
```
Usage: hiveMind agent.restart <configDir> <role>
Available roles in /tmp/hivemind.McDonges/:
  hiveMind-expert  hiveMind-tester  oosh-expert  oosh-tester
```

### JSONL files
`team.pull` already downloads JSOLs (step 6). The agent.restart method just needs to check if the JSONL exists locally before forking. This already works in the current code.

## OOSH rules reminder

- camelCase for ALL variables (configDir, pullDir, localSess — NOT config_dir)
- Positional args only, NEVER --flags
- Use OOSH wrappers: `otmux`, `claudeCode`, `ossh` — NEVER raw tmux/claude/scp
- Completion method naming: `scriptname.method.completion.paramName()`

## Test requirements

hiveMind-tester must verify:
1. Tab completion lists roles from a test snapshot file
2. Single role restart creates correct session/pane
3. No-role shows usage with available roles
4. Role not found in snapshot returns error
5. JSONL present → fork, JSONL missing → fresh start
