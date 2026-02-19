# Next Block Task Pipeline (18:00 Berlin Reset)

**Prepared by PO, Feb 19 ~16:42 Berlin**
**Status: READY — activate after 18:00 reset**

## Priority 1 — Expert (blocking everyone)

### 1a. hiveMind send auto-append Enter
Every agent hits this. Messages stuck in prompts. `hiveMind send.enter` exists at line 798 but nobody uses it. Fix: make `hiveMind send` always append Enter, or alias it.

### 1b. Subscription velocity from learned data
Tool resets between reads, shows wrong %. Need historical samples from learned data to calculate real burn rate. CMM4 goal #4.

## Priority 2 — Trainer (in progress)

### 2a. Pane addresses → role names in all persistent files
Task #12, already started. Finish it.

## Priority 3 — Writer (autonomous)

### 3a. Resume writing from Ch82
Writer context saved: 81 chapters, 137K words. Boot from context file and continue.

## Priority 4 — SM + Orchestrator (goal #3)

### 4a. SM runs scrumMaster cycle projectTeam 60
Verify FIRST 3 ACTIONS work after SKILL.md reduction. Does SM actually check context % first? Does it schedule wakeup?

### 4b. Orchestrator delegates, doesn't monitor
Verify reduced SKILL.md works. Orchestrator assigns idle agents to goals, manages SM only.

## Deferred (lower priority)

- hiveMind unblock check before sending Enter
- config set OOSH_DIR overwrite bug
- PreCompact hook identity

## Assignment Summary

| Agent | Task | Goal |
|-------|------|------|
| Expert | hiveMind Enter fix + velocity | #4, #5 |
| Trainer | Pane address cleanup | #1 |
| Writer | Ch82+ | delivery |
| SM | Cycle loop | #3 |
| Orchestrator | Delegate to goals | #3 |
| Tester | Available — assign after expert delivers | #2 |
