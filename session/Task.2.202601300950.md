# Task 2 — Bootstrap ScrumMaster Agent

**Created**: 2026-01-30T09:50Z
**Status**: Complete
**Requested by**: User
**Priority**: Before Task 1 — this is the prerequisite

## Original Prompt (verbatim)

> yes and add a Plan heading to the task md where you write down the plan and the agent roles. spawn directly a new pane with a new claude instance that you teach and delegate to monitor you if you need approvals let it aprove your next work permisson so that you will not be stopped unless you are done. regualrly check that the scrumMaster still moitors yourself and did not stop himslef. this is a task 2, that you should do before all the planning of task 1. so create the scrumMasters tmux pane manually and use it as the root to teach the other agents how to modify the scripts later to reproduce what we are dooing with the oosh scripts easily.

## Plan

### Goal
Create a ScrumMaster agent in a new tmux pane that:
1. Monitors the Orchestrator (me) for permission prompts
2. Auto-approves my work so I'm never blocked
3. Stays alive and keeps monitoring (doesn't stop itself)
4. Becomes the template for how we teach future agents

### Steps
1. Create new tmux pane (0.3) in cursorOrchestrator session
2. Start Claude Code instance in that pane
3. Teach it the ScrumMaster role via prompt
4. Verify it's monitoring
5. Periodically check it's still alive

### Agent Roles (updated team)

| Pane | Agent | Role |
|------|-------|------|
| 0.0 | Orchestrator / Agent Teacher | Plan, delegate, teach agents |
| 0.1 | OOSH Expert | Implementation only |
| 0.2 | OOSH Tester | Testing only |
| 0.3 | ScrumMaster | Monitor all agents, approve permissions, enforce roles |

### ScrumMaster Responsibilities
- Watch Orchestrator pane (0.0) every 5 seconds for permission prompts
- Auto-approve Orchestrator actions (press 2 for "allow all")
- Watch Expert (0.1) and Tester (0.2) for role violations
- Report status when asked
- NEVER stop monitoring — this is a continuous duty
- If context runs low, re-read skill file and resume monitoring

## Outcome
- [x] Pane 0.3 created with Claude Code running (bash → claude)
- [x] ScrumMaster taught and actively monitoring (5s cycle, all 3 panes)
- [x] Orchestrator verified unblocked
- [x] ScrumMaster verified still alive after first check cycle (detected potential role concern on 0.1)

## Key Learning: Agent Bootstrap Recipe
1. `tmux split-window -t session:0.2 -h -c /path` — create pane
2. `tmux send-keys -t session:0.3 'bash' Enter` — start bash for OOSH env
3. `tmux send-keys -t session:0.3 'claude' Enter` — start Claude Code
4. Wait ~8s for startup
5. `tmux send-keys -t session:0.3 '<role prompt>' Enter` — teach role
6. Wait ~3s, then `Enter` to submit if needed
7. Verify with `tmux capture-pane -t session:0.3 -p -S -15`
