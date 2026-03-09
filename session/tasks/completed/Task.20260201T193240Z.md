# Task 19 — File-Based Communication Workflow

**Created**: 2026-02-01T18:20Z
**Status**: Done (commits d3ddafb, b1e5abb) — updated by Task Agent 2026-02-01
**Requested by**: Product Owner
**Assigned to**: Agent Trainer (0.2)

## Original Directive (verbatim)

> Change how work is communicated. Stop sending long token-heavy messages between agents. Instead: 1) Tasks are defined and planned in task files in session/tasks/. 2) Agents pick up their work description from the task files, not from messages. 3) Messages between agents should only be short notifications like 'new task ready at session/tasks/task-10.md' or 'task done'. 4) Have Agent Trainer update ALL SKILL.md files with this file-based workflow. This saves tokens and creates documentation automatically.

## Plan

| Step | Agent | Action |
|------|-------|--------|
| 1 | Agent Trainer | Add "File-Based Communication" section to all SKILL.md files |
| 2 | Agent Trainer | Define the workflow: task files for work descriptions, short messages for notifications |
| 3 | Agent Trainer | Update Orchestrator SKILL.md with delegation pattern: create task file → send short notification |
| 4 | Agent Trainer | Update ScrumMaster SKILL.md: relay short notifications, not full task descriptions |
| 5 | Tester | Verify all SKILL.md files have the new section |

## Communication Rules (to be added to all SKILL.md)

- Tasks are defined in `session/tasks/Task.{N}.{YYYYMMDDHHMM}.md`
- Agents read full work descriptions from task files, NOT from messages
- Messages between agents: SHORT notifications only
  - "New task: session/tasks/Task.19.202602011820.md" (assignment)
  - "Task 19 done" (completion)
  - "Task 19 blocked: reason" (escalation)
- This saves tokens and creates documentation automatically
