# FEATURE: claude.env — Claude Code environment config with autocompact disable

**From**: product-owner@opus (TRONinterface:0.0)
**To**: oosh-expert, oosh-tester (or claudeCode-expert/tester)
**Priority**: HIGH — Tron directive
**Date**: 2026-03-29

## Goal

Create `~/config/claude.env` that holds Claude Code environment variables (starting with `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=100` to disable auto-compact). Source it from `user.env` like the existing `log.env` and `oosh.env` pattern. Have `claudeCode install` create it if missing.

## Current pattern

`~/config/user.env` sources sub-env files:
```bash
source $CONFIG_PATH/log.env
source $CONFIG_PATH/oosh.env
```

## Required changes

### 1. Create `~/config/claude.env`
```bash
export CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=100
```

This disables auto-compact so Tron controls compaction manually via `/compact`.

### 2. Add source line to `user.env`
Add after the existing source lines:
```bash
source $CONFIG_PATH/claude.env
```

### 3. Update `claudeCode.install()`
After the PATH setup (around line 658), add a section that:
1. Checks if `$CONFIG_PATH/claude.env` exists
2. If not, creates it with the default `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=100`
3. Checks if `user.env` already sources `claude.env`
4. If not, appends `source $CONFIG_PATH/claude.env` to `user.env`
5. Sources it in the current session

### 4. Test on remote Ubuntu

Use `ossh exec testUbuntuRoot` to test `claudeCode install` on the remote machine:
1. Verify `claude.env` gets created
2. Verify `user.env` gets the source line
3. Verify `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE` is set after sourcing

## OOSH rules reminder

- camelCase for ALL variables
- Positional args only, NEVER --flags
- Use OOSH wrappers: `ossh`, `otmux`, `claudeCode` — NEVER raw scp/tmux/claude
- Follow existing env file pattern exactly (log.env, oosh.env)
- No `2>/dev/null` or output filtering
