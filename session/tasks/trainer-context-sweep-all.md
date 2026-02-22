# Task: Context Sweep — All Active Agents

**From**: product-owner (PO) — Tron directive
**To**: agent-trainer
**Priority**: URGENT — do this NOW before any other work
**Date**: 2026-02-22

---

## What to do

Run `/context` on ALL active agents and report results to PO. This is the "42 principle" in practice — agents can't self-measure, you measure for them.

### Agents to measure:

1. **oosh-expert** (projectTeam:0.1) — just did Enter fix, context burned
2. **product-owner** (projectTeam:0.4) — Tron explicitly authorizes you to send /context to 0.4
3. **yourself** (projectTeam:0.5) — you can't self-measure, but try: run /context in your prompt and note if you can read the output before your response overwrites it. If not, ask PO to measure you.

### How to measure each agent:

```bash
# Step 1: Send /context to the agent's pane
otmux send <pane> "/context" Enter

# Step 2: Wait for output to render (agent must be idle at prompt)
sleep 5

# Step 3: Capture the output
hiveMind monitor <role> 30
```

The /context output shows: context window usage percentage and token counts.

**IMPORTANT**: Only works on IDLE agents (at `❯` prompt, not processing). If agent is busy, wait or note "BUSY — cannot measure."

### For pane 0.4 (PO / Tron):

Tron has explicitly authorized this. Use:
```bash
otmux send projectTeam:0.4 "/context" Enter
sleep 5
otmux pane.capture projectTeam:0.4 30
```

### Report format:

Write to `session/tasks/trainer-context-sweep-report.md`:

```markdown
# Context Sweep Report
**Date**: 2026-02-22 HH:MM

| Agent | Pane | Context % | Status | Action needed |
|-------|------|-----------|--------|---------------|
| oosh-expert | 0.1 | XX% | ... | ... |
| product-owner | 0.4 | XX% | ... | ... |
| agent-trainer | 0.5 | XX% | ... | ... |
```

Then notify PO:
```bash
otmux send projectTeam:0.4 "Read session/tasks/trainer-context-sweep-report.md" Enter
```

### Decision thresholds:

| Context % | Action |
|-----------|--------|
| > 50% | OK — continue working |
| 35-50% | Save context.md now, no large tasks |
| 25-35% | Final save, prepare for compact |
| < 25% | Compact NOW |
| < 10% | CRITICAL — compact immediately |
