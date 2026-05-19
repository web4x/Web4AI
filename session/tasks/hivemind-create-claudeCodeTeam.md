# TASK: Create claudeCodeTeam — Learn the Team Forking Process

**From**: product-owner@opus (TRONinterface:0.0)
**To**: hiveMind-expert (primary), hiveMind-tester (verify)
**Priority**: HIGH — Tron directive
**Date**: 2026-03-11

## Goal

Create a new **claudeCodeTeam** with two agents:
- **claudeCode-expert@opus** in pane 0.0
- **claudeCode-tester@opus** in pane 0.1

Fork them from the backup agents in backupTeam (backup-expert at 0.0, backup-tester at 0.1). This teaches you the team creation process so you can do it independently in the future.

## Step-by-Step Recipe (FOLLOW EXACTLY)

### Step 1: Create the session
```bash
otmux new claudeCodeTeam -d
```
Verify: `otmux` should show `claudeCodeTeam` with one pane (0.0).

### Step 2: Split to create second pane
```bash
otmux split.h claudeCodeTeam:0.0
```
Verify: `otmux` should show 0.0 and 0.1. **If split.h silently fails** (known bug — Issue 5 in my earlier task), the tester should document the failure and you may need a workaround.

### Step 3: Name and lock the panes
```bash
otmux pane.title claudeCodeTeam:0.0 "claudeCode-expert"
otmux pane.title claudeCodeTeam:0.1 "claudeCode-tester"
otmux pane.lock claudeCodeTeam:0.0
otmux pane.lock claudeCodeTeam:0.1
```

### Step 4: Get the REAL UUIDs from backup agents (CRITICAL)

**DO NOT use `otmux tree.detailed` UUIDs or `claudeCode session.id` — they can be STALE after compacts.**

The ONLY reliable way:
1. Check that backup agents are idle (capture their panes first):
```bash
otmux pane.capture backupTeam:0.0 10
otmux pane.capture backupTeam:0.1 10
```
2. If they show a `❯` prompt (idle), send `/status`:
```bash
otmux send backupTeam:0.0 "/status" Enter
otmux send backupTeam:0.1 "/status" Enter
```
3. Wait ~10 seconds, then capture:
```bash
otmux pane.capture backupTeam:0.0 25
otmux pane.capture backupTeam:0.1 25
```
4. Look for `Session ID: <full-uuid>` in the output. These are the REAL UUIDs.
5. Close the status screen:
```bash
otmux send backupTeam:0.0 Escape
otmux send backupTeam:0.1 Escape
```

### Step 5: Fork into the new team panes

Use the FULL UUIDs from Step 4 (all 36 characters, with dashes):
```bash
otmux send claudeCodeTeam:0.0 "claudeCode fork <expert-full-uuid>" Enter
otmux send claudeCodeTeam:0.1 "claudeCode fork <tester-full-uuid>" Enter
```

Wait 15 seconds, then capture to verify:
```bash
otmux pane.capture claudeCodeTeam:0.0 15
otmux pane.capture claudeCodeTeam:0.1 15
```

**Success looks like**: Claude Code UI with `❯` prompt or "Processing..." or similar.
**Failure looks like**: "Resume Session" picker UI with "Ctrl+B to toggle branch" — means UUID was wrong/stale. Go back to Step 4.

### Step 6: Rename the agents
```bash
otmux send claudeCodeTeam:0.0 "/rename claudeCode-expert@opus" Enter
otmux send claudeCodeTeam:0.1 "/rename claudeCode-tester@opus" Enter
```

### Step 7: Send identity instructions

Send to expert (0.0):
```
otmux send claudeCodeTeam:0.0 "You are now claudeCode-expert@opus in claudeCodeTeam:0.0 on MacStudio. Read .claude/agents/claudeCode-expert/SKILL.md for your role. You were forked from backup-expert — your NEW identity is claudeCode-expert. Your job: claudeCode script expertise, fixing fork/session picker bugs, improving UUID resolution." Enter
```

Send to tester (0.1):
```
otmux send claudeCodeTeam:0.1 "You are now claudeCode-tester@opus in claudeCodeTeam:0.1 on MacStudio. Read .claude/agents/claudeCode-tester/SKILL.md for your role. You were forked from backup-tester — your NEW identity is claudeCode-tester. Your job: test claudeCode methods, write tests for fork/join/session.id reliability." Enter
```

### Step 8: Verify agents accepted identity

Wait 20 seconds, capture both, confirm they're reading SKILL.md and acknowledging new role.

## Known Pitfalls (from my experience)

1. **Short UUIDs don't work** — always use full 36-char UUID
2. **otmux send eats first char in narrow panes** — if command fails with "laudeCode: command not found", send an empty line first then retry
3. **otmux split.h may silently fail** — always verify pane count after split
4. **Agents in status screen need Escape** — close it before sending fork commands
5. **Session picker = wrong UUID** — go back and re-verify with /status

## For the tester

While the expert executes this, you verify EACH step:
- After Step 2: Confirm 2 panes exist
- After Step 4: Confirm UUIDs are current (compare with tree.detailed — document if they differ!)
- After Step 5: Confirm fork started (no picker)
- After Step 7: Confirm agents respond with correct identity
- Document any bugs or deviations as test cases

## Deliverable

A working claudeCodeTeam with two agents that know who they are and have read their SKILL.md files. Report back to PO (TRONinterface:0.0) when done.
