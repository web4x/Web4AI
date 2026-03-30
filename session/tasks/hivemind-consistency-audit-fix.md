# Task: Fix hiveMind consistency audit — all audits must be green

**Assigned to**: hiveMind-expert (hiveMindTeam02_03_26:0.0)
**Priority**: HIGH

## Current audit: 11 consistent, 8 inconsistent

### Issue 1: UUID stale (3 panes)
Registry/session env has old UUID, live agent has new UUID.

| Pane | Role | Sess.env UUID | Live UUID |
|------|------|---------------|-----------|
| projectTeam:0.0 | oosh-expert | 0f0755a8 | a2c6b6c4 |
| projectTeam:0.4 | oosh-tester | 6213b3dc | d177f466 |
| backupTeam:0.1 | ClaudeCode | 6213b3dc | d45f08a4 |

**Root cause**: When agents restart (compact, crash, manual restart), the session env file keeps the old UUID. The registry and env must be updated when a new Claude session starts in a pane.

### Issue 2: dup UUID (5 panes)
Multiple panes share the same UUID — impossible if each is a separate Claude session.

| UUID | Panes sharing it |
|------|-----------------|
| a2c6b6c4 | baseTeam:0.0 (agent-trainer) — but this UUID also appears as live UUID for projectTeam:0.0 |
| 6213b3dc | baseTeam:0.2 (ClaudeCode), baseTeam:0.1 (ClaudeCode) — also stale in projectTeam:0.4 and backupTeam:0.1 |
| a552f5ac | otmuxTeam:0.0 (otmux-expert), claudeCodeTeam:0.0 (claudeCode-expert) |
| a79b35f1 | otmuxTeam:0.1 (otmux-tester), claudeCodeTeam:0.1 (claudeCode-tester) |

**Root cause**: Registry entries not cleaned up when agents move between teams/panes, or pane titles set to "ClaudeCode" (generic) instead of role names.

### Issue 3: Generic "ClaudeCode" role names
baseTeam:0.1, baseTeam:0.2, backupTeam:0.1 show "ClaudeCode" as role — these should be their actual role names (oosh-tester, oosh-expert, backup-tester).

## What to fix

1. **Auto-update registry on agent restart**: When a new Claude session starts in a pane, detect the new UUID and update the registry + session env
2. **Clean up stale entries**: Provide `hiveMind consistency.fix` or similar that resolves stale/dup issues
3. **Prevent dup UUIDs**: Ensure each pane registration is unique — deregister old pane when agent moves
4. **Fix generic role names**: Panes with "ClaudeCode" should get their proper role from bootstrap

## Verification

After fix: `hiveMind consistency.audit` must show **0 inconsistent**.

Commit, push, notify tester.
