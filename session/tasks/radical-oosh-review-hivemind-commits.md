# RADICAL REVIEW: OOSH Architecture Violations in Recent Commits

**From**: product-owner@opus (TRONinterface:0.0)
**To**: oosh-expert (primary reviewer), oosh-tester (test verification)
**Priority**: CRITICAL — Tron directive
**Date**: 2026-03-11

## Problem

The hiveMind-expert committed changes to `claudeCode`, `hiveMind`, and `otmux` that violate OOSH architecture. Specifically: **introducing flags and raw system commands where OOSH patterns should be used.**

OOSH methods use POSITIONAL arguments, not `--flags`. OOSH has wrappers for common operations — use them instead of raw `find`, `stat`, `head` etc.

## Commits to Review

### 1. `102fa81` — claudeCode fork validation + session.id staleness

**File**: `claudeCode`

Violations found:
- `find "$HOME/.claude/projects" -name "${sessionId}.jsonl" -type f 2>/dev/null | head -1` — raw `find` with flags instead of OOSH file discovery
- `stat -f %m "$jsonlFile"` / `stat -c %Y "$jsonlFile"` — raw `stat` with platform-specific flags
- `date +%s` — raw date command
- The staleness check logic (JSONL age > 300s) is useful but implemented with raw commands

Questions for expert:
- Is there an OOSH way to check file existence/age?
- Should `check` script methods be used here?
- Should the JSONL age threshold be a config value, not hardcoded `300`?

### 2. `aa6e313` — Ghost pane detection in hiveMind sweep + otmux tree

**File**: `hiveMind`

Violations found:
- The `hasProcess=yes/no` pattern is fine (OOSH uses positional/variable patterns)
- But `claudeCode process.find "$target" >/dev/null 2>&1` with redirect suppression — is this the right OOSH pattern?
- Multiple `grep -qE` with complex regex patterns inline — should these be named OOSH methods?

**File**: `otmux`

Violations found:
- `is_ghost=0/1` with `[ "$is_ghost" -eq 1 ]` — C-style flags inside OOSH
- The ghost detection logic uses `[[ ... =~ ^[A-Z] ]]` regex matching — should this be a proper OOSH method like `otmux.pane.isGhost`?
- The `⚠ DEAD` marker is hardcoded in printf — should be configurable

### 3. `1604e3e` — teams.migrate with `--fork mode`

**MOST CRITICAL**: This commit introduces `--fork` as a flag-style argument to an OOSH method. OOSH methods are `script.method arg1 arg2` — NEVER `script.method --flag`. If fork is a mode, it should be a separate method: `hiveMind teams.migrate.fork` not `hiveMind teams.migrate --fork`.

## What You Must Do

### oosh-expert:
1. Review ALL three commits thoroughly
2. Identify every OOSH architecture violation
3. Propose OOSH-compliant alternatives for each
4. Refactor the code to follow OOSH patterns:
   - Positional args, never `--flags`
   - OOSH wrappers over raw system commands
   - Named methods over flag-based dispatch
   - `check` script for validation where appropriate
   - Config values for thresholds, not hardcoded numbers
5. Commit the fixes

### oosh-tester:
1. Write test cases that DETECT flag usage in OOSH methods
2. Test: `grep -r '\-\-' /Users/donges/oosh/hiveMind /Users/donges/oosh/claudeCode /Users/donges/oosh/otmux` — find ALL `--flag` patterns in method interfaces
3. Test the refactored code works correctly
4. Verify ghost pane detection still works after refactor
5. Verify fork validation still works after refactor

## OOSH Architecture Rules (for reference)

- Methods: `scriptname.methodname arg1 arg2` — positional only
- Sub-modes: `scriptname.method.submethod` — separate method, not flag
- Private helpers: `private.scriptname.helperName`
- Config: `config set THRESHOLD 300` — not hardcoded
- File checks: `check file.exists <path>` — not raw `find`/`stat`
- Error output: `error.log "message"` — human readable sentences
