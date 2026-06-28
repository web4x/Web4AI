# Base Skill: Task Queue (MANDATORY — all agents)

> **Read also (mandatory base skills):**
> - `session/base-skills/tron-cmm4-doctrine.md` — TRON CMM4 doctrine: father/source who loves us, 7 principles, the climb. NEVER forget.
> - `session/base-skills/sprint-comms-protocol.md` — ONE sprint planning.md = source of truth; git mailbox = channel.
> - `session/base-skills/po-wisdom.md` — hard-won PO wisdom: session.id LIES (truth = process-args + pane-footer), trained = MAX-line-count, respawn+join restore recipe, keepalive, git-mailbox cross-machine comms, PO discipline. Read on every boot.
> - `session/base-skills/agent-rewind.md` — 2-phase rewind protocol.

**Every agent MUST use the internal task list. No exceptions.**

## The Rule

When you receive a new prompt while working on a task:
1. **Do NOT context-switch.** Finish your current task.
2. **TaskCreate** to queue the incoming work with subject, description, and activeForm.
3. When current task is done: **TaskList** to check queue, pick next task.
4. **TaskUpdate** to mark tasks in_progress before starting, completed when done.

## Exceptions (act immediately, don't queue)

- `/compact` or `/clear` — survival commands
- `stop` — PO emergency stop
- Permission prompts — approve/deny immediately

Everything else gets queued.

## Why

- Incoming prompts interrupt current work and cause context-switching waste
- Agents lose track of what they were doing after an interruption
- Marathon responses happen because agents try to do everything in one turn
- Task list provides visibility — anyone can see what's queued

## Pattern

```
# On boot or start of work
TaskList                          # What's pending?
TaskUpdate taskId status=in_progress  # Claim it

# While working, new prompt arrives
TaskCreate subject="New request from orchestrator" description="..."
# Continue current work, don't switch

# When done
TaskUpdate taskId status=completed
TaskList                          # What's next?
```

## Integration

- Read this file on every boot (referenced from SKILL.md)
- PO uses task list for directives
- Orchestrator uses task list for delegation tracking
- SM uses task list for sweep observations
- Workers use task list for assignment queue

## Agent File Commit Discipline (CRITICAL)

Your agent files (context.md, boot.md, learnings.md) are YOUR responsibility to commit. The pre-compact hook only commits task files.

**After every save**: commit your agent directory.
```bash
git -C /Users/Shared/Workspaces/AI/Claude add session/agents/<your-role>/
git -C /Users/Shared/Workspaces/AI/Claude commit -m "<your-role>: save context/boot/learnings"
```

**Before /compact**: ALWAYS commit first. Uncommitted files don't survive /clear.

## Rules Are Eternal (CRITICAL)

Rules in your agent files are permanent institutional knowledge. NEVER delete them.

- When writing context.md: copy ALL existing rules forward, then add new ones.
- Emergency saves at low context: still copy rules. No exceptions.
- Only ask PO/Tron if a rule CONTRADICTS another rule. Otherwise: keep it.

## Anti-patterns (NEVER do these)

- Dropping current work to read a new incoming prompt
- Running 11 sweeps in one response because you never yielded
- Forgetting what you were working on after processing an interruption
- Having no task list and relying on memory for what to do next
