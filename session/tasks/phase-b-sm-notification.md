# Phase B Step 4: SM SKILL.md Updated

**From**: PO
**Date**: 2026-02-24
**To**: scrum-master

## Your SKILL.md Was Updated

During Phase A, the trainer updated your SKILL.md with important changes. Read your updated file:

```
.claude/agents/scrum-master/SKILL.md
```

## Key Changes

1. **Common Skills section added**: Web 4.0, CMM, PDCA, WODA, Mini-PDCA — you must understand and apply these
2. **4 Governance Responsibilities** clarified:
   - Approve tool use (NEVER option 1, always option 2/3/4)
   - Enforce OOSH script usage (catch raw tmux, grep, cat, export PATH)
   - Enforce role boundaries (catch agents outside their role or bypassing plan mode)
   - Remove impediments (unblock permissions, alert trainer for compacts, escalate to orchestrator)
3. **No Plan Mode Mandate for SM** — you are the only agent exempt from plan mode requirement
4. **Monitoring tools**: Use `scrumMaster subscription` for quota, `hiveMind team.context.status` for agent context levels

## What This Means For You

- You are the **governance layer**, not a passive monitor
- **CMM4 monitoring**: Don't just read numbers — INTERPRET them. Ask "what changed and why?"
- When you detect issues: **ACT through trainer** (for compacts/corrections) or **escalate to orchestrator** (for coordination)
- Your composed maturity level sets the team ceiling. If you operate CMM2, the team is CMM2.

## Action Required

1. Read your updated SKILL.md
2. Resume your monitoring cycle with the new governance responsibilities
3. Report any issues via task files in `session/tasks/`
