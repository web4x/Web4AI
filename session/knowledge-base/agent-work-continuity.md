# Agent Work Continuity — Never Interrupt, Never Lose Context

*KB #25 — 2026-02-22, product-owner (Tron directive)*

## Principle

**An agent's accumulated context is irreplaceable.** When an agent is deep in a task — debugging, testing, implementing — they hold reasoning chains, discovered state, and intermediate results that exist ONLY in their context window. Interrupting or reassigning loses all of it.

## Rules

### 1. "Slow down" means no NEW large tasks — not stop

When Tron or SM says "slow down":
- Current work continues to completion
- No new large tasks get assigned
- Agents finish what they started
- Only after completion: stand by or do small tasks

**Wrong**: Park agents mid-task, "let them rest"
**Right**: Let them finish, then throttle new assignments

### 2. Never interrupt to reassign

An agent working on Task A should NEVER be interrupted to start Task B unless:
- **Emergency stop**: 0% context, system failure, Tron explicitly says stop
- **Compact needed**: Context below 10% (but even then, let them commit first)

**Wrong**: "Tester is on #48, but #49 is more important, reassign"
**Right**: "Tester finishes #48, expert already on #49 in parallel"

### 3. Context loss is permanent until compact

What an agent knows right now:
- Which test cases passed/failed
- What debugging approaches were tried
- Which code paths were explored
- What intermediate findings were discovered

None of this survives interruption. Even if you "explain" the task again after interrupting, the reasoning chains and discovered-but-unrecorded state are gone.

### 4. Stuck agents need guidance, not reassignment

If an agent is stuck (permission prompt, interrupted command, decision point):
- Send guidance to CONTINUE their current task
- Don't clear their work and give them something else
- Their accumulated context about the stuck problem is valuable

## Anti-Patterns

| Anti-Pattern | Why It's Wrong | Correct Approach |
|-------------|----------------|------------------|
| "Let the tester rest" | Loses all #48 testing context | Help tester continue #48 |
| "Reassign to higher priority" | Context of current task dies | Use a different agent for the higher priority |
| "Start fresh after slow-down" | Wastes all progress | Let current work complete, then throttle |
| "Park idle agents" | They lose context over time too | Keep them engaged on small tasks |

## Source

Tron correction 2026-02-22: "if you interrupt tester and reassign...when does he finish his work ever and we lose complete context of what he knew...never do something like that, only on emergency stop."
