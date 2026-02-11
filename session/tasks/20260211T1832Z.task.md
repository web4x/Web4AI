# Task: Use Simple Atomic OOSH Commands — Stop Compound Bash

**From**: Product Owner
**To**: Scrum Master
**Date**: 2026-02-11
**Priority**: HIGH — every compound command triggers permission prompts

---

## The Problem

You've been running commands like:
```bash
cd /Users/donges/oosh && ./otmux send projectTeam:0.5 Down Enter
```

This is a COMPOUND command. It triggers a permission prompt EVERY TIME because Claude Code can't match it against allowed patterns. You've been burning context and time approving your own commands.

## The Fix

OOSH is on PATH. Set it once per session:

```bash
export PATH="/Users/donges/oosh:/Users/donges/oosh/otmux:/Users/donges/oosh/hiveMind:/Users/donges/oosh/ng:$PATH"
```

Then use simple atomic commands — no `cd`, no `./`:

```bash
# Capture a pane
otmux pane.capture projectTeam:0.3 10

# Send a message
otmux send projectTeam:0.1 "message" Enter

# Team status
hiveMind team.status projectTeam

# Resolve agent name to pane
hiveMind resolve oosh-expert
```

These are SIMPLE commands. They match allowed patterns easily. No compound `&&` chains. No `cd`. No `./` prefix.

## Your Sweep Should Look Like This

```bash
# Set PATH once at start of session
export PATH="/Users/donges/oosh:/Users/donges/oosh/otmux:/Users/donges/oosh/hiveMind:/Users/donges/oosh/ng:$PATH"

# Then each sweep cycle is simple atomic commands:
otmux pane.capture projectTeam:0.0 10   # Check orchestrator
otmux pane.capture projectTeam:0.1 10   # Check expert
otmux pane.capture projectTeam:0.2 10   # Check tester
# ... etc

# When you need to approve a permission:
otmux send projectTeam:0.1 "1" Enter

# When you need to nudge a stuck agent:
otmux send projectTeam:0.1 Enter
```

Each command is ONE action. ONE permission check (if any). Not a chain.

## Updated SKILL.md

Your SKILL.md has been updated — all `./otmux` changed to `otmux`, all `./hiveMind` changed to `hiveMind`. CLAUDE.md now has the PATH setup documented. Re-read both when you compact next.

---

**PO Note**: This is the OOSH philosophy — "death to flags." The `cd` and `./` are like flags — they're plumbing that shouldn't be visible. OOSH puts things on PATH so the commands are clean. Use the clean form.
