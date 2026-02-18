# Action: Recover from Mass Context Exhaustion

*When multiple agents hit 0% context simultaneously. From incident 2026-02-17 (F15-F20).*

## Prerequisites

- **Know your own pane** — run `tmux display-message -p "#{session_name}:#{window_index}.#{pane_index}"` FIRST
- **Never send commands to your own pane** — you will brick yourself
- **Skip pane 0.4** — that's the Tron/user interface, not a managed agent

## Step 1: Classify All Agents

Do ONE capture pass across all panes. Sort into groups:

| Group | Detection | Count |
|-------|-----------|-------|
| **Dead (0%)** | "Context limit reached" or completely unresponsive | |
| **Low (< 20%)** | "Context low (X% remaining)" in status bar | |
| **Healthy (> 20%)** | Normal processing or idle | |
| **Accept-edits** | Status bar shows accept-edits indicator | |

```bash
# Capture each pane — 30+ lines minimum
hiveMind sweep projectTeam
```

**Do NOT act yet.** Classify first, then act by group.

## Step 2: Recover by Communication Hierarchy

Order matters. SM first (unblocks everyone), then orchestrator (coordinates), then workers.

### 2a. Recover ScrumMaster

```bash
# If SM is at 0%:
hiveMind send scrum-master /clear
# Wait 5 seconds, then:
hiveMind send.enter scrum-master "Read session/agents/scrum-master/boot.md"

# If SM is low but not 0%:
hiveMind send.enter scrum-master "Save your context and run /compact NOW"
# Wait 10 seconds, verify compact completed, then:
hiveMind send.enter scrum-master "Read session/agents/scrum-master/boot.md"
```

**Verify SM is processing before moving on.** Capture the pane, look for activity indicators.

### 2b. Recover Orchestrator

Same pattern as SM. Use `hiveMind send orchestrator ...`

### 2c. Recover Workers (Expert, Tester, Trainer, etc.)

Once SM is alive, SM can handle remaining agents. But if doing it manually:

```bash
# For each dead agent (0%):
hiveMind send <role> /clear
# Wait 5s
hiveMind send.enter <role> "Read session/agents/<role>/boot.md"

# For each low agent:
hiveMind send.enter <role> "Save your context and run /compact NOW"
# Wait 10s, verify, then:
hiveMind send.enter <role> "Read session/agents/<role>/boot.md"
```

## Step 3: Verify Each Agent

After sending recovery commands, verify processing started:

1. Capture the pane (30+ lines)
2. Look for activity: spinning verbs (Composing, Misting, etc.) or "X tool uses"
3. If still showing `❯` with no activity — the prompt may not have been submitted. Send Enter.
4. Mark each agent as recovered before moving to next

## Key Rules

| Rule | Why |
|------|-----|
| **0% = /clear only** | /compact cannot compress zero context. Don't waste time retrying. |
| **Accept-edits is non-blocking** | The `❯` prompt accepts commands even with accept-edits showing. Don't send Escape (that interrupts). |
| **Never send unknown.md** | Always use the NAMED boot file: `session/agents/<role>/boot.md` |
| **Track state** | Use TaskCreate per agent recovery. Mark completed when verified. |
| **One at a time** | Don't batch-loop all panes with the same command. Verify each before moving on. |

## Prevention

To avoid this situation:
1. **SM monitors context %** in every sweep cycle (added to SKILL.md)
2. **Orchestrator limits** to max 2 large parallel tasks (delegation throttle in SKILL.md)
3. **All agents** know their own pane on boot (self-pane detection in SKILL.md)
4. **All agents** have named boot files in `session/agents/<role>/boot.md`
