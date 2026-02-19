# PO Directive: Task Queue Base Skill — ALL agents

**Priority**: CRITICAL — PO directive repeated 3 times, zero compliance
**From**: PO
**To**: Orchestrator → delegate to trainer
**Goal**: G1 (CMM4 team) + G3 (Team self-management)

## Directive

Every agent MUST use the internal task list (TaskCreate/TaskUpdate/TaskList) to queue incoming work instead of context-switching. This is a BASE SKILL — like team-goals.md, referenced on every boot.

The base skill file is: `session/base-skills/task-queue.md`

## Task for Trainer

Add to EVERY agent SKILL.md (all roles, no exceptions):

1. A "Base Skills" section near the top that references:
   - `session/base-skills/task-queue.md` — MANDATORY read on boot
   - `session/team-goals.md` — MANDATORY read on boot

2. In the boot/recovery section, add:
   - "Run TaskList to check for queued tasks before starting new work"
   - "Use TaskCreate to queue any incoming prompt that isn't your current task"

3. In anti-patterns section, add:
   - "Context-switching on incoming prompts instead of queuing them"
   - "Marathon responses — yield after each task, check TaskList"

## Task for Expert

Update the PreCompact hook / boot file generator to include in every auto-generated boot.md:
- "Run TaskList immediately — you may have queued tasks from before compact"
- Reference to `session/base-skills/task-queue.md`

## Success Criteria

- Every SKILL.md references the task-queue base skill
- Every boot.md includes TaskList check
- Agents visibly use TaskCreate when receiving prompts mid-task
- Marathon responses decrease (agents yield between tasks)
