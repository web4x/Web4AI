# PO + Trainer: SKILL.md Review — Why Orchestrator+SM Performance is CMM1-2

**PO-authorized direct collaboration. Tron directive.**

## The Problem

Team is CMM1-2 chaos. Same failures every cycle:
1. SM doesn't check context levels on wakeup
2. SM sends blind Enters (hiveMind unblock approves without review)
3. Orchestrator ignores SM context issues
4. Orchestrator does bureaucracy (.done files) instead of delegation
5. Nobody schedules wakeup
6. Everyone monitors instead of delivering

## Root Causes in SKILL.md

### Orchestrator (agent-teacher/SKILL.md — 788 lines)

**Line 52**: "Check ScrumMaster every 10-15 seconds" → WRONG. This causes constant monitoring. Fix: 10-15 MINUTES.

**Missing**: SM escalation protocol. When SM fails (marathon >15min, ignoring context, blind Enters), orchestrator doesn't know what to DO. Need explicit: "SM marathon >15min → send yield. SM ignoring context → correct it. SM unresponsive → cover temporarily."

**Missing**: "FIRST 3 ACTIONS on wakeup" at TOP of file. Currently the first action is buried in the middle.

### SM (scrum-master/SKILL.md — 907 lines)

**Line 344**: Context % monitoring — buried at line 344 of 907. Should be FIRST ACTION on every wakeup and every sweep.

**Line 413**: "NEVER finish without scheduling wakeup" — exists but SM still forgets. Needs to be in FIRST 3 ACTIONS, not at line 413.

**Missing**: "On wakeup, BEFORE sweeping: check context % of ALL agents. Low context = highest priority impediment."

**Missing**: "Review what permission you're approving before sending Enter."

## Required Changes

### Both files:

Add a "FIRST 3 ACTIONS" section as the VERY FIRST section after the role description:

**SM FIRST 3 ACTIONS:**
1. Check context % of every agent (highest priority impediment)
2. Schedule wakeup (sleep 60 for next cycle)
3. Run scrumMaster cycle projectTeam 60

**Orchestrator FIRST 3 ACTIONS:**
1. Check SM alive via hiveMind monitor scrum-master 15
2. If SM dead/stuck: reboot with boot-curated.md
3. Assign idle agents to goals (session/team-goals.md)

### Orchestrator specific:

- Change "10-15 seconds" to "10-15 minutes" (line 52)
- Add SM escalation protocol section
- Remove .done file checking references — bureaucracy
- Add: "Your job is DELEGATE, not MONITOR. SM monitors. You delegate."

### SM specific:

- Move context % monitoring from line 344 to FIRST ACTION
- Add: "On wakeup: check ALL agent context % BEFORE sweeping"
- Add: "Review permissions before approving — read the command, not blind Enter"
- Add: "Use scrumMaster cycle, not manual loops"
- Add: "One sweep per response. Yield. Sleep 60. Next response."

### Both: reduce file size

907 and 788 lines is too much. Agents can't internalize it. Consider:
- Move historical learnings (F15, F18, etc.) to learnings.md
- Keep SKILL.md to <300 lines of actionable rules
- Top section = FIRST 3 ACTIONS (always read)
- Middle = role definition and protocols
- Bottom = anti-patterns and references
