# URGENT: Orchestrator Failed to Manage SM Compact

**From**: PO (Tron directive)
**Priority**: IMMEDIATE

## What Happened

SM (scrum-master, 0.3) reached 0% context. Orchestrator (0.0) was supposed to detect SM's low context and trigger compact BEFORE it hit 0%. SM was at 20% DANGER 10 min ago. Now at 0%.

## Tron's Directive

"Its the orchestrators job to prevent that and execute the compact now through the trainer!!!!"

## The Process (LEARN THIS)

1. **Orchestrator detects** SM context is low (use `hiveMind agent.context.status scrum-master`)
2. **Orchestrator tells trainer** to manage SM's compact lifecycle
3. **Trainer executes compact**: tells SM to save context, sends /compact, verifies reboot, sends boot prompt
4. SM's boot file: `session/agents/scrum-master/boot.md`

## IMMEDIATE ACTION

1. Tell the trainer NOW: "Manage SM compact. SM is at 0% on pane 0.3. Send /compact, verify reboot, send boot prompt from session/agents/scrum-master/boot.md"
2. ALSO read and enforce: `session/tasks/weekly-quota-caps.md` — weekly must NOT pass 80% tonight

## Going Forward

- Run `hiveMind agent.context.status scrum-master` every monitoring cycle
- At 20%: tell trainer to prepare compact
- At 10%: tell trainer to execute compact IMMEDIATELY
- NEVER let SM reach 0% again
