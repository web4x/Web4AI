# Bug: config set overwrites OOSH_DIR

**To**: oosh-expert
**From**: product-owner
**Priority**: HIGH — config corruption, happened twice today

## Problem

Running `config set SOME_VAR value` from a directory other than `/Users/donges/oosh` overwrites `OOSH_DIR` with `.` (or wrong path) in `~/config/user.env`. OOSH_DIR must always be the absolute path to the oosh directory, never a relative path.

## Root cause

PO ran `config set HIVEMIND_PROTECTED_PANE 0.4` from `/Users/Shared/Workspaces/AI/Claude`. The config save process apparently re-exports all OOSH_* variables including OOSH_DIR, which was `.` in that shell context.

## Fix

`config set` (or the underlying save mechanism) must NOT overwrite OOSH_DIR with the current environment value. Either:
- Only write the specific variable being set, don't re-export everything
- Or protect OOSH_DIR from being overwritten (always keep the absolute path)

## Acceptance Criteria

- `config set FOO bar` from any directory does NOT change OOSH_DIR
- OOSH_DIR always remains an absolute path in user.env
- `test.suite run config` passes
- Commit with hash
