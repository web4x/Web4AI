# Incident Report: Total Goal Loss — 2026-02-18

## What Happened

After recovering from the mass context exhaustion (2026-02-17), every agent was asked: "What are your current goals? Did you survive compact?" The answer revealed a **total loss of delegated goals across the entire team**. No agent remembered the task pipeline. The team fell back to CMM0 — below chaos, to non-existence of the goal-tracking capability.

## The Evidence

### What Was Delegated (from Tron interface context.md)

7 tasks were actively delegated before the disaster:

| Task | Agent | Priority |
|------|-------|----------|
| expert-hivemind-param-naming | expert | Assigned |
| trainer-naming-rules-and-send-migration | trainer | Queued |
| tester-completion-and-features | tester | Assigned |
| trainer-post-incident-fixes | trainer | Queued |
| trainer-reorganize-agent-folders | trainer | Queued |
| trainer-cmm4-velocity-management | trainer | Queued |
| orchestrator-manage-sm-velocity | orchestrator | Sent |

### What Each Agent Reported

**Orchestrator (0.0)**: "Managing SM manually." No mention of the velocity management directive. Adapted to SM failure but lost the original task assignment.

**Expert (0.1)**: "Idle — no coding tasks assigned." The param naming fix task (20260217T1700Z) is **completely lost**. Expert doesn't know it exists.

**Tester (0.2)**: "Current goals: None assigned. All previous work is complete." The completion + feature audit (20260217T1715Z) was apparently finished before the disaster, but tester doesn't connect it to the delegated task pipeline.

**SM (0.3)**: Knows its 5 monitoring goals (from context.md). But keeps cycling to 0% — boots, sweeps once, dies. Cannot sustain itself.

**Trainer (0.5)**: Completed 3 of 4 tasks (post-incident, folder reorg, CMM4 velocity). The naming-rules-and-send-migration task (20260217T1705Z) is **lost** — trainer doesn't mention it.

### Goal Survival Scorecard

| Task | Survived? | How? |
|------|-----------|------|
| expert-hivemind-param-naming | NO | Expert doesn't know about it |
| trainer-naming-rules-and-send-migration | NO | Trainer completed other 3 tasks, this one lost |
| tester-completion-and-features | PARTIAL | Tester did the work but doesn't know it was delegated |
| trainer-post-incident-fixes | YES | Trainer completed, commit f2de7e7 |
| trainer-reorganize-agent-folders | YES | Trainer completed, commit 81601e5 |
| trainer-cmm4-velocity-management | YES | Trainer completed, commit 5f6112d |
| orchestrator-manage-sm-velocity | PARTIAL | Orchestrator adapted but lost original directive |

**Result: 3/7 fully survived, 2/7 partial, 2/7 completely lost.**

## Root Cause: Context Files Were Never Committed

The Tron interface wrote `session/agents/tron-interface/context.md` with the full task pipeline — but **never committed it to git**.

```bash
$ git log --oneline -- session/agents/tron-interface/context.md
(empty — zero commits)
```

The file existed only in the working directory. It survived the compact by luck (the continuation summary included it), not by design. If the file had been lost (disk issue, accidental cleanup, another agent's stray command), the entire goal pipeline would have been irrecoverable.

**This violates the team's own rule**: "Nothing is done until committed with a hash." — MEMORY.md, established after the Feb 12 rebase incident.

The same failure applies to every agent's context.md — none are committed. Goals exist only in:
1. Conversation memory (lost on /clear)
2. Continuation summaries (lossy, not structured)
3. Uncommitted context.md files (fragile)

Task files in `session/tasks/` were also never committed. The entire delegation pipeline was built on uncommitted files.

## Why This Is CMM0

CMM levels:
- **L1 (Initial)**: Chaotic but the capability exists. People try, results vary.
- **L0 (Non-existent)**: The capability doesn't exist at all.

Goal persistence across context exhaustion was **not a capability**. Nobody designed it, nobody tested it, nobody verified it. The team assumed goals would survive because agents "remember." When every agent lost context simultaneously, the assumption collapsed.

This is below L1. At L1, at least someone would have tried to persist goals and failed. Here, nobody tried. The Tron interface wrote a context file as a last-minute save before compact, but didn't commit it — treating git as optional rather than as the only reliable persistence layer.

### Comparison to CMM Levels

| Level | What It Would Look Like |
|-------|------------------------|
| L0 | No goal persistence mechanism exists. Goals live only in conversation memory. **← WE WERE HERE** |
| L1 | Someone writes context files sometimes. Results vary. Some goals survive, some don't. |
| L2 | Context files are always written before compact. Most goals survive. |
| L3 | Context files are committed to git before compact. Goals always survive. Deterministic. |
| L4 | Goal survival is measured. Lost goals trigger process improvement. The system self-corrects. |

## What Should Exist

### 1. Goals Must Be Committed to Git
Every delegated task creates a task file in `session/tasks/`. Every agent's context.md tracks active goals. **Both must be committed before any compact or /clear.** The pre-compact hook should refuse to proceed if uncommitted goal files exist.

### 2. Task File Lifecycle
```
Created → Committed → Delegated → Agent reads → In progress → .done.md written → Committed
```
Every state transition must be committed. An uncommitted task file is a ghost — it might exist, or it might not.

### 3. Agent Context = Git State
An agent's "memory" is not its conversation history. It's `git log -- session/agents/<role>/`. If it's not in git, it doesn't exist. Conversation memory is cache, not storage.

### 4. Interface Must Commit After Every Delegation Round
After writing task files and sending them to agents, the Tron interface must commit:
```bash
git add session/tasks/*.md session/agents/tron-interface/context.md
git commit -m "Delegate: <summary of tasks>"
```
This creates an audit trail and ensures goals survive any failure.

## Learnings

### F21: Uncommitted Goals Don't Exist (2026-02-18)
7 tasks were delegated via task files and tracked in context.md. None were committed to git. After mass context exhaustion and recovery, 2 tasks were completely lost and 2 partially lost. **"Nothing is done until committed with a hash" applies to goals and task files, not just code. Git is the only reliable persistence layer. Conversation memory is cache — it will be lost.**

### F22: Team Goal Tracking Was CMM0 (2026-02-18)
No agent had a mechanism to persist goals across context loss. The team assumed conversation memory was sufficient. When all 11 agents lost context simultaneously, the goal pipeline evaporated. **Goal persistence must be designed, implemented, tested, and verified — like any other capability. Assuming it works is CMM0.**

### F23: SM Boot Payload Too Heavy (2026-02-18)
SM boots, reads SKILL.md + context.md + learnings.md (93 lines), runs one sweep cycle, and immediately hits 0% context. The boot payload consumes nearly all available context. **SM needs a minimal boot sequence or must run on a more context-efficient model. A monitor that can't sustain itself is worse than no monitor — it wastes resources cycling.**

## Action Items

| # | Action | Assigned To | Priority |
|---|--------|-------------|----------|
| 1 | Pre-compact hook must `git add + commit` all context.md and task files | oosh-expert or trainer | CRITICAL |
| 2 | Interface must commit after every delegation round | tron-interface (self) | CRITICAL |
| 3 | Re-send lost tasks: expert param naming, trainer naming rules | tron-interface | HIGH |
| 4 | Fix SM boot payload — minimal boot or switch to haiku | orchestrator + trainer | HIGH |
| 5 | Add goal survival verification to post-recovery checklist | trainer | MEDIUM |
| 6 | Test goal persistence: simulate compact, verify goals survive from git | tester | MEDIUM |

## CMM Assessment Update

| Capability | 2026-02-17 | 2026-02-18 | Target |
|-----------|------------|------------|--------|
| Goal persistence | L0 (didn't exist) | L0 (still doesn't — just documented) | L3 (deterministic via git) |
| Context file management | L1 (written sometimes) | L1 (written but not committed) | L3 (always committed) |
| Task file lifecycle | L1 (created, sent) | L1 (created, sent, not committed) | L3 (full lifecycle in git) |
| SM sustainability | L1 (runs, crashes) | L0 (can't complete one cycle) | L3 (stable monitoring loop) |
| Post-recovery verification | L0 (never checked) | L1 (checked today, found loss) | L3 (automated check) |
