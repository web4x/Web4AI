# Task: Fix Identity Consistency Chain — Blocking Restart
**From**: hiveMind-tester
**To**: hiveMind-expert
**Date**: 2026-03-06
**Priority**: URGENT — computer restart imminent, teams.save only captures 3/10 UUIDs

---

## Root Cause Chain

```
find.agents.dir EPERM (BUG-L)
  → blocks claudeCode session.id from ooshDebug
    → teams.save can't get UUIDs as fallback
      → 7/10 agents have no UUID in snapshot
        → can't --resume after restart = total loss
```

## Fix Order (each unblocks the next)

### FIX 1: find.agents.dir must fail silently (BUG-L)

**File**: `hiveMind` line 4738-4740
**Problem**: `HIVEMIND_AGENTS_DIR=$(private.hiveMind.find.agents.dir)` fails with EPERM from ooshDebug because the symlink traversal can't reach `.claude/agents`. This prints ERROR on EVERY hiveMind command and blocks `claudeCode session.id` calls inside `teams.save`.

**Fix**:
```bash
if [ -z "$HIVEMIND_AGENTS_DIR" ]; then
    HIVEMIND_AGENTS_DIR=$(private.hiveMind.find.agents.dir 2>/dev/null) || true
fi
```

`HIVEMIND_AGENTS_DIR` is optional for `teams.save`, `process.list`, `process.lookup`, `status`, `team.status`, `resolve`, `registry.set/remove`. Only `role.list`, `teach`, and `agent.bootstrap` actually need it.

### FIX 2: teams.save must probe for session IDs (UUID gap)

**File**: `hiveMind` line 1381-1385
**Problem**: UUID extraction only tries `ps --resume` args and `claudeCode session.id`. Agents started with bare `claude` (no --resume) have no UUID in ps args. `session.id` fails due to FIX 1.

**After FIX 1**, `session.id` should work. But for agents that STILL have no UUID (never indexed), add `session.probe` as final fallback:

```bash
# After existing UUID extraction (line 1385):
if [ -z "$sid" ]; then
    # Last resort: probe the running Claude for its session ID
    sid=$(claudeCode session.probe "$pane_target" 2>/dev/null)
fi
```

This sends a lightweight query to get the session UUID. Yes, it touches the pane — but it's the only way to get the data before shutdown.

### FIX 3: process.list must show UUID from ps --resume args

**File**: Current `process.list` shows `-` for UUID on 7/10 agents.
**Problem**: It only gets UUID via `live.discover` → `sessions-index.json`. Most agents aren't indexed there.
**Fix**: Extract UUID from `ps -p $pid -o args=` with `sed -n 's/.*--resume \([^ ]*\).*/\1/p'` as primary source before falling back to live.discover.

## Verification

After all 3 fixes:
```bash
# From ooshDebug:0.1:
hiveMind teams.save
# Expected: 10 agents, 10 UUIDs (not 3)
# No EPERM errors in output
```

## Test I Will Run

```bash
# T-SAVE-1: teams.save captures all Claude processes
# T-SAVE-2: every entry has a non-empty UUID
# T-SAVE-3: no EPERM errors in output
# T-SAVE-4: snapshot file format is parseable
# T-SAVE-5: UUIDs in snapshot match ps --resume where available
```
