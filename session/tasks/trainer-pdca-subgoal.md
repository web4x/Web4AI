# Trainer Sub-Goal: SM Training + KB/SKILL Updates

**From**: Orchestrator (PO-approved PDCA plan)
**Priority**: HIGH
**Full plan**: Read `/Users/donges/.claude/plans/streamed-gathering-hippo.md` first

## Your Sub-Goals (3 items)

### 1. Train SM on Intelligent Monitoring (PRIMARY)

SM must independently:
- Detect which agents are actively WORKING (not idle)
- Assess burn risk: working agent + low context = danger
- Act through YOU (trainer) to compact before 0%
- Use status bar capture workaround for INC-002: `otmux pane.capture <pane> 5` and look for "Context low (X% remaining)" text

**Training approach**: Send SM a monitoring protocol that includes:
- Check subscription every 3 sweeps
- Focus monitoring on ACTIVE agents (skip idle ones)
- When context < 20%: alert trainer immediately
- When context < 10%: trigger compact through trainer
- Interpret, don't just read: "Context low" in status bar = act NOW

### 2. Add Common Skills Section to Every SKILL.md

Add this section to ALL agent SKILL.md files:

```markdown
## Common Skills (all agents share these)

### Web 4.0
Self-improving systems using CMM4 methods. Read: session/knowledge-base/cmm-web4x.md

### CMM — Capability Maturity Model
Levels 1-5. Composed maturity = weakest link. L3 = deterministic, L4 = PDCA feedback loops. YOUR level sets the team ceiling.

### PDCA — Plan Do Check Act
Every task: Plan approach → Do work → Check results → Act on findings. Not "receive order, execute, report" (CMM2).

### WODA
Read: session/woda/woda-overview.md

### Mini-PDCA for every sub-goal
1. Plan: How will I achieve this? What could go wrong?
2. Do: Execute the plan
3. Check: Did it work? Did I miss something?
4. Act: Adjust, report results, or escalate
```

### 3. Disseminate KB #27-29

Add references to these KB articles in affected SKILL.md files:
- KB #27 (PO PDCA Operating Model) → PO, orchestrator SKILL.md
- KB #28 (DRY Architectural Principle) → oosh-expert, hiveMind-expert SKILL.md
- KB #29 (Role Boundaries) → PO, SM, trainer, orchestrator SKILL.md

## Your Mini-PDCA

1. **Plan**: Enter plan mode. Write your approach to all 3 sub-goals. Address all 7 approval criteria.
2. **Do**: Execute — train SM, update SKILL.md files, add KB references
3. **Check**: Capture SM after training — is it monitoring intelligently? Check SKILL.md files have Common Skills section.
4. **Act**: Report completion to orchestrator. If SM still mechanical, adjust training.

## Budget
Weekly at 82%, cap 92%. Be token-efficient. Batch SKILL.md updates.

## Communication
Report completion: write `session/tasks/trainer-results.md`, then send orchestrator "Read session/tasks/trainer-results.md"
