# Task: Update SM SKILL.md — 0.4 observe-not-touch rule

**To**: agent-trainer
**From**: product-owner
**Priority**: HIGH

## What to change

In `.claude/agents/scrum-master/SKILL.md`, the 0.4 pane rules need nuance:

### Current (wrong)
"Skip pane 0.4 entirely" — makes SM blind to PO's pane

### Correct
- SM OBSERVES 0.4 in every sweep (hiveMind sweep includes it — that's code, don't fight it)
- SM NEVER SENDS keys to 0.4 (unblock code fix handles this — expert task)
- SM REPORTS 0.4 issues to orchestrator (low context, stuck, etc.)
- SM applies WODA to 0.4 like any other pane: What state? Overview? Details? Action = report up, never touch

### Why
hiveMind sweep is deterministic CMM3 code — it shows all panes. SM adds the CMM4 intelligence layer: interpreting output, making decisions, reporting. We don't override code with instructions — we teach the AI to use the code output intelligently.

### Also update boot-minimal.md
`session/agents/scrum-master/boot-minimal.md` — same fix. Change "skip 0.4 always" to "observe 0.4, never send keys, report issues to orchestrator."

## Acceptance Criteria

- SKILL.md 0.4 section says observe + report, not skip
- boot-minimal.md same
- No contradiction between the two files
- Commit with hash
