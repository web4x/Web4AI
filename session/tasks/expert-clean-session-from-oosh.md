# Task: Remove session/ from oosh codebase, fix all paths

**From**: PO (Tron directive)
**For**: oosh-expert
**Priority**: HIGH

## Problem

`session/` directory exists inside oosh repo (`/Users/donges/oosh/session/`) but was never meant to be there. It belongs ONLY in the calling project workspace (`/Users/Shared/Workspaces/AI/Claude/session/`). 231 files were created in the wrong location.

Scripts write to `$OOSH_DIR/session/` when they should write to the workspace's `session/`.

## Steps

### 1. Add `session/` to `.gitignore`

In `/Users/donges/oosh/.gitignore`, add:
```
# Session data belongs in the workspace project, not in oosh
session/
```

### 2. Remove session/ from git tracking

```bash
git rm -r --cached session/
```

This removes it from git without deleting the files. The .gitignore will prevent re-adding.

### 3. Fix SCRUMMASTER_METRICS_DIR default (ROOT CAUSE)

`scrumMaster` line 14:
```bash
# WRONG:
: ${SCRUMMASTER_METRICS_DIR:=${OOSH_DIR:+${OOSH_DIR}/session/metrics}}
# RIGHT:
: ${SCRUMMASTER_METRICS_DIR:=session/metrics}
```

By defaulting to a relative path, it writes to the current working directory's session/ — which is the workspace. Functions that need absolute paths should resolve via `$(git rev-parse --show-toplevel)/session/metrics`.

### 4. Fix $OOSH_DIR/session/ references in scrumMaster

Replace all `$OOSH_DIR/session/metrics` with workspace-resolved paths:

- Line 470: `local metrics_dir="${SCRUMMASTER_METRICS_DIR:-$OOSH_DIR/session/metrics}"` → use workspace
- Line 817: same pattern
- Line 886: same pattern
- Line 1021: same pattern
- Line 1309: `local vel_dir="$OOSH_DIR/session/metrics"` → use workspace
- Line 1414: `local alerts_log="$OOSH_DIR/session/metrics/alerts.log"` → use workspace
- Line 1471: same pattern

**Pattern to use** (already used in dashboard function at line 614-616):
```bash
local workspace
workspace="$(git rev-parse --show-toplevel 2>/dev/null)"
local metrics_dir="${workspace}/session/metrics"
```

### 5. Fix $OOSH_DIR/session/ references in hiveMind

- Lines 2476-2488: `git add session/` → this auto-commits oosh session files. REMOVE or change to workspace-relative.
- Line 2544: `local dashboard_file="$OOSH_DIR/session/dashboard.md"` → use workspace
- Lines 3361, 3450: sweep-log.md → use workspace

### 6. Fix session/ references in claudeCode

- Lines 786, 833: `session/agent.context.md` → relative path is OK if CWD is workspace
- Line 852: `ls session/*.md` → relative, OK
- Line 1351, 1438-1455: use workspace

### 7. Fix $OOSH_DIR/session/ references in context

- Lines 242, 299, 343, 395, 487: `$OOSH_DIR/session/agents/` → use workspace
- This script reads agent context files — they live in the workspace, not oosh

### 8. Delete the oosh session/ contents

After git rm --cached, delete the actual files:
```bash
rm -rf /Users/donges/oosh/session/
```

The real session data is at `/Users/Shared/Workspaces/AI/Claude/session/` — that's the workspace.

## Do NOT

- Do NOT delete `/Users/Shared/Workspaces/AI/Claude/session/` — that's the real data
- Do NOT change any file outside the oosh repo
- Do NOT break the workspace pattern — functions that already use `$workspace` are CORRECT

## Commit message

"Remove session/ from oosh repo — belongs in workspace project, not codebase"
