# Standing Task: Enforce OOSH Script Usage Across All Agents

**From**: PO (Tron directive)
**Assigned to**: agent-trainer
**Priority**: STANDING — every compact, every boot, every correction

## The Problem

Agents keep deteriorating to raw commands after compact:
- `tmux send-keys -t projectTeam:0.3 "msg" Enter` instead of `hiveMind send scrum-master "msg"`
- `tmux capture-pane -t projectTeam:0.3 -p -S -12` instead of `hiveMind monitor scrum-master 12`
- `tmux display-message` instead of `otmux` methods
- Raw `grep`, `cat`, `find` instead of OOSH equivalents

## Root Cause

INC-004 (unsubmitted prompts) was caused entirely by raw tmux usage. `hiveMind send` handles Enter automatically. Raw `tmux send-keys` does not. The "bug" was never a bug — it was agents not using the tools.

## What To Do

### 1. Update ALL SKILL.md files (permanent)
Add to every agent's SKILL.md in the rules section:
```
## OOSH Commands — MANDATORY (never raw tmux/shell)
- `hiveMind send <role> "msg"` — NOT `tmux send-keys -t pane "msg" Enter`
- `hiveMind monitor <role> <lines>` — NOT `tmux capture-pane -t pane`
- `otmux pane.capture <pane> <lines>` — NOT `tmux capture-pane`
- `scrumMaster subscription` — NOT reading files directly
- All OOSH scripts are on PATH. No `export PATH=`, no `cd`, no `./`
```

### 2. On Every Boot Prompt (permanent)
When writing boot.md for any agent, include:
```
Use hiveMind/otmux commands. NEVER raw tmux.
```

### 3. On Every Correction
When you catch an agent using raw tmux:
1. Tell them: "Use `hiveMind send <role> msg` not raw tmux. Add to your learnings."
2. Verify they add it to their learnings.md
3. Update their SKILL.md if not already there

### 4. INC-004 is CLOSED
Root cause identified: raw tmux. Fix: use hiveMind send. No code fix needed. Remove from incident tracking as open issue — mark as RESOLVED (discipline, not code).

## Success Criteria
- Zero raw tmux sends detected in SM sweeps
- All 11+ SKILL.md files have the OOSH commands rule
- All boot.md files include the reminder
- INC-004 marked RESOLVED in recurring-incidents.md

## Quota
Check `scrumMaster subscription` before starting. Weekly cap 92%. Currently ~79%.
