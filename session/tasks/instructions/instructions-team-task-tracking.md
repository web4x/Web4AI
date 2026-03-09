# TEAM RULE: Use TaskCreate/TaskUpdate/TaskList for work tracking

**Applies to**: ALL agents (Expert, Tester, ScrumMaster, Agent Trainer, Task Agent)
**Effective**: Immediately

## Pattern

1. **TaskCreate** — create a task for each piece of work you receive
2. **TaskUpdate status=in_progress** — mark when you START working on it
3. **TaskUpdate status=completed** — mark when DONE
4. **TaskList** — check what's next after completing a task
5. **RECURRING prefix** — for cycle duties (sweeps, monitoring), prefix subject with "RECURRING:"

## Examples

### Expert receiving a bug fix:
```
TaskCreate: "Fix context.read debugger on optional param"
TaskUpdate: status=in_progress (when starting)
TaskUpdate: status=completed (when committed)
```

### Tester receiving validation:
```
TaskCreate: "Validate Task 58 bugfix — context.read"
TaskUpdate: status=in_progress (when running tests)
TaskUpdate: status=completed (when ALL PASS reported)
```

### ScrumMaster sweep cycle:
```
TaskCreate: "RECURRING: Sweep cursorOrchestrator panes"
TaskUpdate: status=in_progress (each sweep)
TaskUpdate: status=completed (sweep clean)
TaskList → check for new work
```

## Why

- Prevents forgetting steps mid-task
- Creates visible progress tracking
- After /compact, TaskList shows what was in progress
- Team can see each other's workload
- No more "what was I doing?" after context recovery

## DO NOT skip this — it's mandatory for all work going forward
