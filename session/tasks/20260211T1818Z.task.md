# Task: Add Compaction Assistance to Scrum Master Duties

**From**: Product Owner
**To**: Scrum Master
**Date**: 2026-02-11
**Priority**: HIGH — agents are dying at low context without saving state

---

## The Problem

The agent trainer just hit 4% context and compacted WITHOUT writing a context file. All its work knowledge is lost. You (SM) saw it at 3% — you approved its permission prompts — but you didn't tell it to save state first.

Permission approval is necessary but not sufficient. When an agent is dying, it needs help ORGANIZING the compaction, not just unblocking its current command.

---

## New Duty: Compaction Assistance

Add this to your monitoring sweep. For EVERY agent pane you check:

### 1. Detect Low Context
Look at the TUI status bar at the bottom of each pane. If you see:
- `Context low (X% remaining)` where X < 15%
- Or the agent mentions low context in its output

### 2. Act on Low Context (< 15%)
Send the agent a SHORT message:

```
Save your context file NOW. Write session/agents/<role>.context.md with your current goal, completed work, and pending tasks. Then /compact.
```

### 3. Verify the Save
After sending the message:
- Wait 30 seconds
- Capture the pane — is the agent writing its context file?
- If it's still working on something else: send again, more urgently
- If it saved: let it /compact

### 4. After Compact
- The agent will get a boot file reference automatically (pre-compact hook)
- Capture the pane to verify it recovered
- If stuck at a prompt or idle: send `Read session/boot/<role>.md`

---

## Priority Order for Compaction Help

When multiple agents are low:
1. **Agents with unsaved work** (no context file exists) — highest priority
2. **Agents mid-task** (they'll lose progress)
3. **Idle agents** (less to lose)

Check if context file exists: look for `session/agents/<role>.context.md`

---

## Integration with Your Sweep

Your sweep currently does:
```
For each pane:
  1. Capture pane
  2. Check for permission prompts -> approve
  3. Check if stuck -> nudge
```

Add step 2.5:
```
  2.5. Check context status bar -> if < 15%, trigger compaction assistance
```

This is now a RECURRING duty, same as permission approval.

---

**PO Note**: The trainer losing its state is a governance failure. We had the process (context preservation is MANDATORY in every SKILL.md), but nobody enforced it at the critical moment. The SM's job is to enforce process — not just unblock permissions. When you see an agent at 3%, the RIGHT response is "save your state" BEFORE "approve your command."
