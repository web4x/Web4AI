# Agent Trainer Context

**Updated**: 2026-02-23T13:30Z (saving before compact — ~34% context)
**Role**: agent-trainer
**Pane**: projectTeam:0.5
**State**: COMPACT NEEDED — saving context

## Current Task: Phase A SKILL.md Alignment (trainer-alignment-task.md)

PO-approved plan at `/Users/donges/.claude/plans/unified-munching-bee.md`

### Batch 2 Progress: 30/83 SKILL.md files have Common Skills + Plan Mode

**Completed commits:**
- `612522b` — Batch 1: 5 key role SKILL.md updates (orchestrator, SM, trainer, oosh-expert, PO) — role-specific edits + KB refs
- `a61b492` — Group 1: 10 files (developer, oosh-tester, task-agent, woda-scribe, woda-writer, script-product-owner, ossh-expert, snet-expert, tt-expert, hiveMind-expert)
- `2523648` — Group 2: 10 files (this-expert, myId-expert, oo-expert, state-expert, loop-expert, share-expert, os-expert, ossh-po, ossh-tester, config-expert)
- `0bc6ca6` — Group 3: 10 files (disk-expert, certificates-expert, map-expert, check-expert, line-expert, replace-expert, index-expert, log-expert, path-expert, test.suite-expert)

### Next Steps (priority order)

1. **Group 4**: Edit 10 already-read files (otmux-expert, claudeCode-expert, osx-expert, status-expert, scrumMaster-expert, claudeFlow-expert, agentRoom-expert, debug-expert, fix-expert, context-expert) — insert Common Skills before `## Git Safety`
2. **Remaining groups**: Glob + grep to find ~43 files still missing Common Skills, edit in groups of 10, commit each group
3. **Special cases**:
   - 5 key files need Common Skills ADDED (they got Batch 1 role-specific edits but not the template yet)
   - SM: Common Skills YES, Plan Mode Mandate NO (SM exempt)
   - Orchestrator: needs different anchor point (no `## Git Safety`)
4. **Batch 3**: Update all 17 boot.md files with foundational reading (one by one, read first)
5. **Report**: Write `session/tasks/trainer-results.md` when Phase A complete

### Template (insert before `## Git Safety`)
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

## Plan Mode Mandate

Enter plan mode before any execution. Write sub-plan covering 7 criteria. Get approval from orchestrator (or PO for orchestrator). SM is exempt (continuous monitoring loop).
```

### Method
1. Grep all SKILL.md for "Common Skills" to find which are done
2. Read each remaining file, Edit to insert template before `## Git Safety`
3. Commit in groups of ~10
4. Verify with grep count after each commit

## PO Directive
"Do NOT wait for PO before continuing — complete Phase A, PO will spot-check when back"

## Key Tron Directives This Session
- "team care prio 1" — compact lifecycle takes priority over all other work
- "do not do parallel work until compact is done successful"
- "bulk read is ok...but be careful with batch writes... do not approve them"
- CHECK must be behavioral (CMM4), not just file grep (CMM2)
