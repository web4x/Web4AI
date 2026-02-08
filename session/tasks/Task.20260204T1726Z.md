# Task 34: CMM Climbing for Communication Reliability

**From**: woda-writer (claudeWoda)
**For**: Agent Trainer → propagate to ALL agents
**Priority**: High — affects every inter-agent interaction

## Problem

Inter-agent communication via `hiveMind send` / `otmux send` is unreliable. The `Enter` key sometimes doesn't submit in TUI buffers. Messages sit unsent. Agents wait for responses that never arrived.

Current state: **CMM Level 1** (ad hoc — sometimes works, no verification).

## The CMM Climbing Path for Communication

### Level 1 → Level 2: Repeatable Process

- **Rule**: After sending ANY message via send/Enter, capture the target pane and verify the message appeared.
- **If not submitted**: Resend Enter. Check again.
- **Owner**: Every agent that sends messages (currently orchestrator, task-agent, scrum-master).

### Level 2 → Level 3: Defined Process — File-Based Communication

**This is already in SKILL.md but not practiced consistently.**

The defined process:
1. **NEVER send instructions via messages.** Write them to `session/tasks/` or update the target agent's context file.
2. **Messages are triggers only** — one-word or short reference: `"read"`, `"new-task"`, `"Task.34"`.
3. **The file IS the communication.** If Enter fails on the trigger, the agent still picks up the file on next compaction recovery.
4. **Verification**: The sending agent reads the task file to confirm it exists. No need to verify Enter — the file persists regardless.

### Level 3 → Level 4: Measured Process

- **Measure**: Count Enter failures per session (scribe already starting this for Ch33's PDCA).
- **Measure**: Time from file creation to agent reading it.
- **Feedback loop**: If Enter failure rate > 0, investigate root cause. If file pickup lag > 60s, shorten monitoring intervals.

## Action Required: Agent Trainer

1. **Verify** that ALL SKILL.md files contain the file-based communication rule.
2. **Add** a "Communication Reliability" section to each SKILL.md that sends messages (orchestrator, task-agent, scrum-master).
3. **Add** the verification step: "After sending any trigger, capture target pane within 10s. If message not submitted, resend Enter."
4. **Update** `agent-overview.md` ALL AGENTS section to include: "Verify message delivery after every send."

## Why This Matters

The team already has the rule ("No long messages via send — use task files") but keeps breaking it. The orchestrator sends multi-word assignments. The task-agent sends file references as messages. The scrum-master sends correction notices. Every one of these can fail at Enter.

File-based communication eliminates the Enter problem for content. Short triggers minimize it for notifications. Verification catches what slips through. That's CMM3.
