# TASK-14: Bootstrap Task Agent

## User Directive (verbatim)

> Create a Task Agent. Split Scrum Master pane in tmux to add him. Task Agent role: 1) Creates task files by quoting the user directive. 2) Adds a headline plan and plans which agent does what. 3) Then you (Orchestrator) kick off the agents according to that plan.

## Headline Plan

| Step | Agent | Action |
|------|-------|--------|
| 1 | Agent Trainer | Create task-agent/SKILL.md with format template |
| 2 | ScrumMaster | Split pane, start Claude, teach Task Agent role |
| 3 | ScrumMaster | Register in /tmp/hivemind.roles |
| 4 | Task Agent | Receive directives from PO, create task files |

## Status: DONE

- Step 1 DONE: Agent Trainer created .claude/agents/task-agent/SKILL.md (142 lines)
- Steps 2-4 DONE: Task Agent bootstrapped and active on pane 0.3
- Updated by Task Agent (task board) 2026-02-01
