# Task: Review All SKILL.md Files for Communication Hierarchy

## PO Directive

Review and update all SKILL.md files and the agent-overview.md to enforce the correct communication hierarchy:

```
Tron (user) <-> PO (product-owner)
                  |
                  v
             Orchestrator
              /          \
     Writer+Scribe    Scrum Master
        |                 |
     (autonomous)    (sweeps all)
```

## Rules to Enforce

1. **PO talks only to Tron.** No direct communication with writer/scribe/expert/tester.
2. **Writer and scribe talk to orchestrator**, not PO, not Tron.
3. **Orchestrator monitors mainly the SM** and coordinates writer/scribe.
4. **SM sweeps all panes** — permission approvals, stuck agents, context health.
5. **Expert and tester receive tasks from orchestrator** (via task files).

## What to Check in Each SKILL.md

- Does the Communication section match the hierarchy above?
- Are there stale references to old communication patterns (e.g. writer talking to PO directly)?
- Does the agent know WHO to report to and WHO to receive work from?

## What to Update in agent-overview.md

- Add a Communication Hierarchy section showing the chain above
- Make clear: PO is governance, not operations. Orchestrator is operations.

## Files to Review

1. `.claude/agents/agent-overview.md`
2. `.claude/agents/orchestrator/SKILL.md`
3. `.claude/agents/woda-writer/SKILL.md`
4. `.claude/agents/woda-scribe/SKILL.md`
5. `.claude/agents/scrum-master/SKILL.md`
6. `.claude/agents/oosh-expert/SKILL.md`
7. `.claude/agents/oosh-tester/SKILL.md`
8. `.claude/agents/product-owner/SKILL.md`
9. `.claude/agents/agent-trainer/SKILL.md`
10. `.claude/agents/task-agent/SKILL.md`
11. `.claude/agents/developer/SKILL.md`

Also update the Peer Compact Protocol if any SKILL.md still says the peer writes the context. Correct version: peer TRIGGERS the agent to save its own state, does NOT write it for them.
