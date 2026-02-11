# Task: ScrumMaster Reboot — projectTeam Session

Your SKILL.md references `cursorOrchestrator` — that is the OLD session. You are now in the **projectTeam** tmux session with 11 agents across 2 windows.

## Current Team Layout

Read `/tmp/hivemind.roles` for the live registry. Here is the expected mapping:

| Pane | Role | Status |
|------|------|--------|
| projectTeam:0.0 | orchestrator | idle |
| projectTeam:0.1 | oosh-expert | idle |
| projectTeam:0.2 | oosh-tester | may have stuck input |
| projectTeam:0.3 | **you (scrum-master)** | this pane |
| projectTeam:0.4 | product-owner | may have unsubmitted prompt |
| projectTeam:0.5 | agent-trainer | should be working (reviewing agent-overview.md) |
| projectTeam:1.0 | woda-writer | should be working (writing chapter 1) |
| projectTeam:1.1 | woda-scribe | should be working (supporting writer) |
| projectTeam:1.2 | task-agent | may have stuck input |
| projectTeam:1.3 | developer | may have stuck input |
| projectTeam:1.4 | script-product-owner | may have stuck input |

## Your Immediate Tasks

1. **Check each pane** using `otmux pane.capture projectTeam:X.Y 15`
2. **Unblock stuck agents** — some have unsubmitted text in their input (leftover `/rename` commands). Clear with Escape or submit with Enter as appropriate.
3. **Check for permission prompts** — approve safe ones (read files, edit files)
4. **Verify active agents are working**:
   - agent-trainer (0.5): should be reading `session/tasks/agent-trainer-review-overview.md`
   - woda-writer (1.0): should be writing in `session/woda/`
   - woda-scribe (1.1): should be supporting writer
5. **Report status** — write your findings to `session/tasks/scrum-master-status-report.md`

## Important Rules (from your SKILL.md)

- Use `otmux pane.capture` not raw `tmux capture-pane`
- Use `otmux send` not raw `tmux send-keys`
- Short messages only — write details to files
- The orchestrator is at projectTeam:0.0 (NOT cursorOrchestrator:0.0)

## When Done

Write your status report and continue monitoring in 30-second cycles. Focus on keeping the active agents (0.5, 1.0, 1.1) unblocked.
