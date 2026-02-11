# Multi-Agent Claude Code Blueprint

**A reproducible methodology for coordinated AI development using Claude Code, tmux, and OOSH.**

---

## Table of Contents

1. [Overview](#1-overview)
2. [The Foundation](#2-the-foundation)
3. [The Five Essential Patterns](#3-the-five-essential-patterns)
4. [The Minimum Viable Setup: A Pair](#4-the-minimum-viable-setup-a-pair)
5. [Scaling Up: The Full Team](#5-scaling-up-the-full-team)
6. [How to Reproduce for a New Project](#6-how-to-reproduce-for-a-new-project)
7. [How to Apply to OOSH Development](#7-how-to-apply-to-oosh-development)
8. [The Shutdown/Startup Lifecycle](#8-the-shutdownstartup-lifecycle)
9. [OOSH Implementation: New Methods](#9-oosh-implementation-new-methods)
10. [The Three Rules](#10-the-three-rules)

---

## 1. Overview

### The Method in One Sentence

Run multiple Claude Code instances in tmux panes, each with a defined role and strict boundaries, communicating through files (not messages), monitoring each other's health, and surviving context compaction through auto-generated boot files.

### Why It Works

A single Claude Code instance is powerful but fragile. It can't see its own context usage. It loses everything on compaction. It can't coordinate with other work happening in parallel.

Multiple instances in tmux panes solve all three problems:

- **Visibility**: Agent A can read Agent B's TUI status bar via `tmux capture-pane`, even though Agent B can't read its own. This asymmetry enables mutual health monitoring.
- **Resilience**: When one agent compacts, a pre-compact hook saves state to files and generates a boot file. The agent wakes up, reads 20 lines, and resumes. No context death spiral.
- **Coordination**: File-based task queues let agents divide work cleanly. One implements, one tests. One writes, one reviews. Boundaries prevent stepping on each other.

### What This Document Covers

This blueprint captures the complete methodology developed over 39 chapters and dozens of failures in the claudeWoda project. It is both a reference for reproducing this setup on new projects and a specification for the OOSH methods that automate it.

---

## 2. The Foundation

Claude Code has three native features that make multi-agent coordination possible:

| Feature | How It's Used |
|---------|---------------|
| **CLAUDE.md** | Every agent in the project reads the same workspace rules on startup |
| **`.claude/agents/<role>/SKILL.md`** | Each agent gets role-specific instructions (boundaries, protocols, recovery steps) |
| **`.claude/hooks/`** | Pre-compact hook auto-saves state and generates recovery files |

tmux adds the fourth piece: **panes are visible to other agents**. Agent A can't read its own TUI status bar, but Agent B can read Agent A's pane via `tmux capture-pane`. This asymmetry is the entire basis of the coordination.

### How the Pieces Interplay

```
+-- CLAUDE.md -----------------------------------------------+
| Global workspace instructions                              |
| - Agent team layout (pane assignments)                     |
| - Universal rules (file communication, never assume, etc.) |
| - Framework reference and key commands                     |
+----------------------------+-------------------------------+
                             |
              +--------------+--------------+
              v                             v
+-- .claude/hooks/pre-compress.sh --+  +-- .claude/agents/<role>/SKILL.md --+
| On /compact:                      |  | Agent role definition               |
| 1. Detect agent role via          |  | - Responsibilities & boundaries     |
|    $TMUX_PANE -> registry lookup  |  | - Monitoring protocol (with command)|
| 2. Auto-commit dirty session/     |  | - Context preservation protocol     |
| 3. Extract goal from context file |  | - Context recovery steps            |
| 4. Generate slim boot file        |  | - File-based communication rules    |
| 5. Schedule resume prompt (15s)   |  | - Task tracking format              |
+-----------------------------------+  +-------------------------------------+
```

**Data Flow:**

1. CLAUDE.md tells all agents: "Here's your team layout and the framework"
2. SKILL.md tells each agent: "Your role is X. Read these files. Do this workflow."
3. pre-compress.sh hook detects role via `$TMUX_PANE` -> registry lookup, generates boot file
4. Boot file (auto-generated) = minimal recovery instructions for post-compact
5. Agent reads boot file -> remembers role/pane -> reads SKILL.md again for full context

---

## 3. The Five Essential Patterns

These patterns were distilled from repeated failures. Each exists because its absence caused a specific class of problem.

### Pattern 1: Role Registry

Claude Code overwrites tmux pane titles. So agent identity lives in a file:

```
/tmp/claude-agents.roles
-------------------------
myproject:0.0|writer
myproject:0.1|reviewer
```

Scripts resolve role names to pane addresses via this file. Convention: `<session>:<window>.<pane>|<role>`.

**Why it matters**: Without a registry, agents lose track of who is where after compaction. The registry is the single source of truth for agent-to-pane mapping.

### Pattern 2: File-Based Communication

tmux `send-keys` garbles multi-word messages (spaces get lost, text lands behind dialogs). The proven alternative: write a task file, send a one-line reference.

```
session/tasks/Task.1.md    <- detailed work description
```

Then notify:

```bash
tmux send-keys -t peer "New task: session/tasks/Task.1.md" Enter
```

**Why it matters**: Every attempt at sending complex instructions via `send-keys` failed in production. Files are durable, verifiable, and don't get eaten by TUI overlays.

### Pattern 3: Pre-Compact Hook + Boot Files

When an agent runs `/compact`, the hook fires automatically:

1. Detects which agent is compacting (via `$TMUX_PANE` -> role registry)
2. Auto-commits any dirty session files
3. Generates a **boot file** (~20 lines) with: role, goal, next action, deep file references
4. Schedules a resume prompt to be sent to the pane 15 seconds later

The agent wakes up post-compact, reads the tiny boot file, and knows who it is and what to do. No death spiral of reading 3 large files and burning half the fresh context.

**Boot file example:**

```markdown
# Boot: writer
*Auto-generated 2026-02-11 14:30. This is ALL you need to read post-compact.*

## You are: writer
## Pane: myproject:0.0
## Goal: Complete chapter 18 draft

## Immediate actions:
1. Start monitoring loop for peer at 0.1
2. Check peer health
3. Resume writing chapter 18

## Deep files (read ONLY if needed):
- SKILL: `.claude/agents/writer/SKILL.md`
- Context: `session/agents/writer.context.md`
- Learnings: `session/learnings/writer.learnings.md`

## Rules:
- Passive mode = death. Always have a background loop running.
- Never assume -- always measure.
- File-based communication only.
```

### Pattern 4: Learnings Files (Identity Persistence)

Context files capture *what you're doing now* -- ephemeral, overwritten each compact. Learnings files capture *what you've learned* -- persistent, accumulated over the agent's lifetime.

After compaction, the learnings file IS the agent's identity. It contains hard-won patterns, failure modes discovered, and project-specific knowledge that would otherwise be lost.

```
session/learnings/<role>.learnings.md   <- accumulates, never overwritten
session/agents/<role>.context.md        <- snapshot, replaced each compact
```

**Why it matters**: Without learnings files, agents repeat the same mistakes after every compaction. With them, institutional knowledge survives indefinitely.

### Pattern 5: WODA Processing Pattern

When context is limited, information processing follows this model:

| Component | Nature | Responsibility |
|-----------|--------|----------------|
| **W**hat | Arrives via prompts | Ephemeral -- comes to you |
| **O**verview | Agent's job to maintain | CRITICAL -- the only active part |
| **D**etails | Accumulate in files | Durable -- persist on disk |
| **A**ctions | Execute via shell | Results persist as artifacts |

The O (Overview) is the only component requiring active maintenance. Everything else either arrives on its own or persists naturally. An agent that loses its Overview is dead -- it has details but no map.

---

## 4. The Minimum Viable Setup: A Pair

The atomic unit is **two agents watching each other**. This is the "Two-Gather" pattern.

### Layout

```
+---------------------------+---------------------------+
| Pane 0.0 -- Agent A       | Pane 0.1 -- Agent B       |
|                           |                           |
| Does: primary work        | Does: support work        |
| Monitors: Agent B         | Monitors: Agent A         |
| Can't see: own context %  | Can't see: own context %  |
| CAN see: B's context %    | CAN see: A's context %    |
+---------------------------+---------------------------+
```

### Why Pairs, Not Solo Agents

A solo agent doesn't know when its context is running low until it's too late. A pair can warn each other and trigger graceful compaction. **Neither alone can self-care. Together, both can.**

### Monitoring Loop

Each agent runs a background monitoring loop:

```bash
# Check peer every 5 minutes
sleep 300 && tmux capture-pane -t <peer-pane> -p -S -15
```

The loop checks:
- Is the peer alive (producing output)?
- What's the peer's context percentage (parsed from TUI status bar)?
- Is the peer stuck on a permission prompt?

If context is low, the monitoring agent alerts the peer to save state and compact.

### Mutual Care Protocol

1. Agent A checks Agent B's context every 5 minutes
2. Agent B checks Agent A's context every 5 minutes
3. If either sees context below 20%, they alert the peer
4. The low-context agent saves state, generates boot file, runs `/compact`
5. After compact, the fresh agent reads its boot file and resumes
6. The monitoring agent verifies the peer recovered successfully

### Pair Roles

Common pair configurations:

| Primary | Secondary | Use Case |
|---------|-----------|----------|
| Writer | Reviewer | Content creation |
| Expert | Tester | Code development |
| Implementer | Validator | Feature building |

The secondary agent typically runs the monitoring loop more frequently and takes on coordination overhead so the primary can focus on creative/implementation work.

---

## 5. Scaling Up: The Full Team

A full team is **composed pairs** with additional coordination roles.

### Layout

```
+------------------------------------------+
| Pane 0.0 -- Orchestrator                 |
|   Delegates to monitor, never watches    |
|   workers directly                       |
+------------------------+-----------------+
| Pane 0.2 -- Expert     | Pane 0.3 -- Test|
|   Implements code      |   Validates code|
|   Does NOT test        |   Does NOT edit |
+------------------------+-----------------+
| Pane 0.1 -- Monitor (ScrumMaster)        |
|   5-second sweep loop across all panes   |
|   Approves permissions, unblocks agents  |
+------------------------------------------+
```

### Role Definitions

| Role | Responsibilities | Boundaries |
|------|-----------------|------------|
| **Orchestrator** | Break work into tasks, delegate via files, track progress | Never monitor workers directly, never implement |
| **Monitor** | Continuous sweep loop, permission approval, health checks, unblocking | Never implement code, never make architecture decisions |
| **Expert/Implementer** | Architecture decisions, code implementation | Never run tests, never approve own work |
| **Tester/Validator** | Test writing, validation, code review | Never edit production code, never make architecture calls |

### Communication Flow

```
Orchestrator --[task file]--> Monitor --[dispatch]--> Worker
     ^                                                  |
     +------------------[completion file]---------------+
```

- Orchestrator writes task files to `session/tasks/`
- Monitor dispatches tasks to available workers
- Workers read task files, do the work, write completion status
- Orchestrator reads completion status and plans next task

### Pull System

The work queue uses a **pull system**: the requester adds ONE item when the implementer completes one. This prevents the queue from growing unbounded and keeps agents focused on one task at a time.

### Extended Team (11 agents)

For large projects, additional specialized roles can be added:

| Agent | Does | Does NOT |
|-------|------|----------|
| **Product Owner** | First-principles guardian, usability enforcement | Review individual code |
| **Task Agent** | Creates task files from directives, writes plans | Execute plans |
| **Developer** | Focused implementation following patterns | Architecture decisions |
| **Agent Trainer** | Improves all SKILL.md files based on learnings | Implement features |
| **WODA Writer** | Writes chapters, manages improvement pipeline | N/A |
| **WODA Scribe** | Implements improvements, maintains knowledge base | N/A |

---

## 6. How to Reproduce for a New Project

### Step 1: Create the Workspace Structure

```
your-project/
+-- CLAUDE.md                       # Workspace rules (all agents read this)
+-- .claude/
|   +-- settings.json               # Hook registration + permissions
|   +-- hooks/
|   |   +-- pre-compress.sh         # Generic pre-compact hook
|   +-- agents/
|       +-- _template/SKILL.md      # Template for new roles
|       +-- <role-a>/SKILL.md       # Role A definition
|       +-- <role-b>/SKILL.md       # Role B definition
+-- session/
|   +-- agents/                     # Per-agent context files
|   +-- boot/                       # Auto-generated boot files
|   +-- tasks/                      # File-based task communication
|   +-- learnings/                  # Per-agent identity persistence
|   +-- topology.md                 # Team topology (for shutdown/startup)
+-- docs/
    +-- (project documentation)
```

### Step 2: Write the CLAUDE.md

The CLAUDE.md contains universal rules that ALL agents read:

```markdown
# CLAUDE.md

## Project Type
[Your project description here]

## Multi-Agent Coordination

### Universal Rules (ALL agents)
| Rule | Description |
|------|-------------|
| **Named sessions** | tmux session name matches project name |
| **File-based communication** | Write details to session/tasks/, send short refs only |
| **STOP-SAVE-COMPACT** | At 20% context: stop work, save state, /compact |
| **Never assume** | Always measure state before acting on it |
| **Boot file recovery** | After compact: read session/boot/<role>.md ONLY |

### Context Preservation Protocol
At 20% context remaining:
1. STOP all current work
2. SAVE state to session/agents/<role>.context.md
3. RUN /compact

### Peer Monitoring Commands
# Read peer's pane content (last N lines)
tmux capture-pane -t <session>:<pane> -p -S -<lines>

# Check peer's context (parse TUI status bar)
tmux capture-pane -t <session>:<pane> -p -S -5 | grep -o 'Context.*%'

# Send short alert to peer
tmux send-keys -t <session>:<pane> "message" Enter
```

### Step 3: Write Each SKILL.md

Every SKILL.md needs these mandatory sections:

| Section | Why It's Mandatory |
|---------|--------------------|
| **Role boundaries** (DO / DO NOT) | Without boundaries, agents step on each other |
| **Monitoring protocol** (with actual command) | Without monitoring, agents die silently from context exhaustion |
| **Context preservation** (STOP -> SAVE -> /compact) | Without this, work is lost on compact |
| **Context recovery** (boot -> SKILL -> context -> learnings) | Without this, agents read too much post-compact and burn context |
| **File-based communication** (task files, not messages) | Without this, messages garble and agents miss work |
| **Never assume** (always measure) | Without this, agents hallucinate state |

**SKILL.md Template:**

```markdown
---
name: {{ROLE_NAME}}
description: {{ONE_LINE_DESCRIPTION}}
---

# {{ROLE_TITLE}}

{{2-3 SENTENCE SUMMARY}}

## Your Position
| Pane | Agent | Relationship |
|------|-------|--------------|
| {{PANE}} | **You ({{ROLE_NAME}})** | {{RELATIONSHIP}} |
| {{PEER_PANE}} | {{PEER_ROLE}} | {{PEER_RELATIONSHIP}} |

## Core Responsibilities
1. {{RESPONSIBILITY_1}}
2. {{RESPONSIBILITY_2}}
3. {{RESPONSIBILITY_3}}

## Role Boundaries
**DO:**
- {{ALLOWED_1}}
- {{ALLOWED_2}}

**DO NOT:**
- {{FORBIDDEN_1}} (that's {{OTHER_ROLE}}'s job)
- {{FORBIDDEN_2}} (that's {{OTHER_ROLE}}'s job)

## Monitoring Protocol
Check your peer every 5 minutes:
```bash
sleep 300 && tmux capture-pane -t {{PEER_PANE}} -p -S -15
```
Look for: context %, stuck prompts, idle state.

## Context Preservation (MANDATORY)
At 20% context remaining:
1. **STOP** all current work
2. **SAVE** state to `session/agents/{{ROLE_NAME}}.context.md`
3. **RUN** `/compact`

## Context Recovery (CRITICAL)
After `/compact`:
1. State identity: "I am the {{ROLE_TITLE}} agent."
2. Read `session/boot/{{ROLE_NAME}}.md` (boot file -- ALL you need)
3. Only read deeper files if boot file says to

## File-Based Communication
Write details to `session/tasks/`. Send only SHORT references via tmux.

## Never Assume
Always MEASURE. Run the command. Check the output. Don't guess.
```

### Step 4: Configure the Pre-Compact Hook

Register the hook in `.claude/settings.json`:

```json
{
  "hooks": {
    "PreCompact": [
      {
        "type": "command",
        "command": ".claude/hooks/pre-compress.sh"
      }
    ]
  }
}
```

**Generic Pre-Compact Hook** (`.claude/hooks/pre-compress.sh`):

```bash
#!/bin/bash
# Pre-compact hook: detect role, save state, generate boot file, schedule resume

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"
ROLES_FILE="/tmp/claude-agents.roles"
BOOT_DIR="$PROJECT_DIR/session/boot"
mkdir -p "$BOOT_DIR"

# --- Detect current pane and role ---
PANE_TARGET=""
CURRENT_ROLE=""
if [ -n "$TMUX_PANE" ]; then
    PANE_TARGET=$(tmux display-message -t "$TMUX_PANE" \
      -p '#{session_name}:#{window_index}.#{pane_index}' 2>/dev/null)
fi
if [ -n "$PANE_TARGET" ] && [ -f "$ROLES_FILE" ]; then
    CURRENT_ROLE=$(grep "^${PANE_TARGET}|" "$ROLES_FILE" 2>/dev/null \
      | cut -d'|' -f2)
fi

# --- Derive file paths from role name (convention over configuration) ---
CONTEXT_FILE="$PROJECT_DIR/session/agents/${CURRENT_ROLE:-unknown}.context.md"
SKILL_FILE=".claude/agents/${CURRENT_ROLE:-unknown}/SKILL.md"
LEARNINGS_FILE="session/learnings/${CURRENT_ROLE:-unknown}.learnings.md"

# --- Detect peer from roles file ---
SESSION_NAME=$(echo "$PANE_TARGET" | cut -d: -f1)
PEER_PANE=$(grep "^${SESSION_NAME}:" "$ROLES_FILE" 2>/dev/null \
  | grep -v "^${PANE_TARGET}|" | head -1 | cut -d'|' -f1)

# --- Auto-commit dirty session files ---
cd "$PROJECT_DIR" 2>/dev/null
if ! git diff --quiet session/ 2>/dev/null; then
    git add session/ 2>/dev/null
    git commit -m "Auto-save: ${CURRENT_ROLE:-unknown} pre-compact $(date +%H:%M)" \
      --no-verify 2>/dev/null
fi

# --- Extract current goal from context file ---
CURRENT_GOAL=""
if [ -f "$CONTEXT_FILE" ]; then
    CURRENT_GOAL=$(grep -A1 -i "goal\|## Current\|## Active" "$CONTEXT_FILE" \
      2>/dev/null | head -3 | tail -2 | sed 's/^[# ]*//')
fi

# --- Generate boot file ---
BOOT_FILE="$BOOT_DIR/${CURRENT_ROLE:-unknown}.md"
cat > "$BOOT_FILE" << BOOT
# Boot: ${CURRENT_ROLE:-unknown}
*Auto-generated $(date "+%Y-%m-%d %H:%M"). This is ALL you need post-compact.*

## You are: ${CURRENT_ROLE:-unknown}
## Pane: ${PANE_TARGET:-unknown}
## Goal: ${CURRENT_GOAL:-Check context file}

## Immediate actions:
1. Start monitoring loop for peer at ${PEER_PANE:-"your peer pane"}
2. Check peer health
3. Resume work (see goal above)

## Deep files (read ONLY if needed):
- SKILL: \`$SKILL_FILE\`
- Context: \`${CONTEXT_FILE#$PROJECT_DIR/}\`
$([ -f "$PROJECT_DIR/$LEARNINGS_FILE" ] && echo "- Learnings: \`$LEARNINGS_FILE\`")

## Rules:
- Passive mode = death. Always have a background loop running.
- Never assume -- always measure.
- File-based communication only.
BOOT

# --- Schedule auto-resume (15 seconds after compact completes) ---
if [ -n "$PANE_TARGET" ]; then
    BOOT_REL="session/boot/${CURRENT_ROLE:-unknown}.md"
    RESUME_MSG="You just compacted. Read $BOOT_REL -- it has everything you need."

    RESUME_PID_FILE="/tmp/resume-$(echo "$PANE_TARGET" | tr ':.' '-').pid"
    if [ -f "$RESUME_PID_FILE" ]; then
        kill "$(cat "$RESUME_PID_FILE")" 2>/dev/null
        rm -f "$RESUME_PID_FILE"
    fi

    (
        echo $$ > "$RESUME_PID_FILE"
        sleep 15
        tmux send-keys -t "$PANE_TARGET" "$RESUME_MSG" Enter Enter
        rm -f "$RESUME_PID_FILE"
    ) &>/dev/null &
    disown 2>/dev/null
fi

exit 0
```

### Step 5: Initialize the Session Directory

```bash
mkdir -p session/{agents,boot,tasks,learnings}
touch session/{agents,boot,tasks,learnings}/.gitkeep
```

### Step 6: Start Your First Pair

```bash
# Create tmux session
tmux new-session -d -s myproject

# Split into two panes
tmux split-window -h -t myproject:0

# Register roles
echo "myproject:0.0|primary" >> /tmp/claude-agents.roles
echo "myproject:0.1|secondary" >> /tmp/claude-agents.roles

# Start Claude in each pane
tmux send-keys -t myproject:0.0 "claude" Enter
tmux send-keys -t myproject:0.1 "claude" Enter

# After Claude starts, teach each agent its role:
# In pane 0.0: "Read .claude/agents/primary/SKILL.md -- you are the primary agent."
# In pane 0.1: "Read .claude/agents/secondary/SKILL.md -- you are the secondary agent."
```

---

## 7. How to Apply to OOSH Development

### Pair Mode (Most Common)

For day-to-day OOSH development, a pair is sufficient:

| Pane | Role | Focus |
|------|------|-------|
| 0.0 | **Expert** | Implements OOSH features, architecture decisions |
| 0.1 | **Tester** | Tests features, validates patterns, monitors expert |

The Expert implements new OOSH scripts and methods. The Tester writes `test.suite` cases, runs validation, and monitors the Expert's context health. Both use OOSH conventions:

```bash
# Expert creates a new script
./oo new myscript

# Expert adds methods
./oo new.method myscript.mymethod

# Tester creates test file
./oo new.test myscript

# Tester runs tests
./test.suite run myscript
```

### Team Mode (Larger Efforts)

For significant OOSH work (new subsystems, cross-cutting changes):

| Pane | Role | Focus |
|------|------|-------|
| 0.0 | **Orchestrator** | Breaks work into tasks, tracks progress |
| 0.1 | **Monitor** | Keeps everyone alive and unblocked |
| 0.2 | **Expert** | Architecture + code implementation |
| 0.3 | **Tester** | Tests + code review |

Optional addition: **Product Owner** for OOSH usability contract enforcement (Tab-completability, self-explaining methods, `./script usage` documentation).

### The OOSH-Specific Advantage

Since OOSH scripts are self-documenting (Tab = documentation, `./script usage` = help), the coordination scripts themselves follow the pattern they're coordinating:

```bash
./peer capture 0.1 15      # Discoverable via Tab completion
./hiveMind team.status      # The method IS the documentation
./otmux send myproject:0.2 "message"
```

### OOSH Coordination Scripts

| Script | Methods | Purpose |
|--------|---------|---------|
| `otmux` | `send`, `send.verified`, `pane.capture`, `session.save`, `session.restore` | tmux operations |
| `hiveMind` | `team.setup`, `team.status`, `team.shutdown`, `team.startup`, `team.save`, `team.restore`, `agent.bootstrap`, `agent.verify`, `monitor`, `dashboard` | Agent orchestration |
| `peer` | `capture`, `context`, `alert`, `compact`, `check` | Peer monitoring (proposed) |
| `agent` | `register`, `boot`, `save`, `resolve`, `list` | Agent lifecycle (proposed) |

---

## 8. The Shutdown/Startup Lifecycle

### What State Needs to Survive

| State | Where It Lives | Survives Reboot? |
|-------|---------------|-----------------|
| Agent context (current goal, pending work) | `session/agents/<role>.context.md` | Yes (git-tracked) |
| Agent learnings (identity, patterns) | `session/learnings/<role>.learnings.md` | Yes |
| Boot files | `session/boot/<role>.md` | Yes |
| Task queue | `session/tasks/*.md` | Yes |
| Role registry | `/tmp/claude-agents.roles` | **No** -- volatile |
| tmux layout (pane arrangement) | tmux server memory | **No** -- volatile |
| Claude conversation history | `~/.cache/claude/` JSONL files | Yes, but may be stale |
| Monitoring loops (background processes) | Shell processes | **No** -- volatile |

### The Key Insight

**Compact** (single agent, mid-session) and **shutdown/startup** (whole team, between sessions) use the same underlying mechanism: save state to files, generate boot file, resume from boot file. The difference is scope (one agent vs all) and whether the tmux layout survives.

From the agent's perspective, waking up after a shutdown is identical to waking up after a `/compact` -- read boot file, resume work. The agent doesn't know or care which one happened.

### Graceful Shutdown (Save Everything, Then Stop)

**Step 1 -- Save each agent's state:**

For each agent:
1. Write current goal + pending work to `session/agents/<role>.context.md`
2. Update learnings if anything new was learned
3. Auto-commit session/ files

**Step 2 -- Persist the topology.**

The role registry (`/tmp/`) is volatile. Before shutdown, snapshot it:

```markdown
# session/topology.md
# Team Topology
*Saved: 2026-02-11 14:30*

## Session
name: myproject
layout: saved to session/topology.tmux

## Agents
| Pane | Role | Claude Session | Status | Context File |
|------|------|---------------|--------|--------------|
| 0.0 | orchestrator | a1b2c3d4 | idle | session/agents/orchestrator.context.md |
| 0.1 | monitor | e5f6g7h8 | sweep-active | session/agents/monitor.context.md |
| 0.2 | implementer | i9j0k1l2 | working | session/agents/implementer.context.md |
| 0.3 | validator | m3n4o5p6 | waiting | session/agents/validator.context.md |
```

**Step 3 -- Commit and stop.**

Auto-commit everything, then either:
- `tmux detach` (keeps session alive but stops interacting)
- Kill Claude processes in each pane, then detach
- Kill the tmux session entirely (cleanest -- everything rebuilt on startup)

### Startup (Rebuild and Resume)

**Step 1 -- Recreate the tmux layout.**

Read `session/topology.md` and `session/topology.tmux`, rebuild panes:

```bash
tmux new-session -d -s myproject
tmux split-window -h -t myproject:0
tmux split-window -v -t myproject:0.0
tmux split-window -v -t myproject:0.2
# Apply saved layout string for exact geometry
```

**Step 2 -- Rebuild the role registry.**

Restore `/tmp/claude-agents.roles` from the topology file.

**Step 3 -- Start Claude in each pane with its boot file:**

```bash
tmux send-keys -t myproject:0.0 \
  "claude --resume 'Read session/boot/orchestrator.md -- you are resuming after shutdown'" Enter
```

**Step 4 -- Monitoring loops restart automatically.**

Each SKILL.md instructs the agent to start its monitoring loop as one of the first actions post-boot.

### The Full Lifecycle

```
                  +----------+
                  |  SETUP   |  team.setup
                  |          |  (create panes, register roles,
                  |          |   start Claude, teach SKILL.md)
                  +----+-----+
                       |
                       v
               +---------------+
          +-->|   RUNNING     |<---- monitoring loops active
          |    |               |      agents working on tasks
          |    +---+-------+---+      file-based communication
          |        |       |
          |        v       v
          |   +--------+  +----------+
          |   |COMPACT |  | SHUTDOWN |
          |   |(single)|  | (all)    |
          |   +---+----+  +----+-----+
          |       |            |
          |       v            v
          |   hook fires   save all contexts
          |   boot file    snapshot topology
          |   auto-resume  commit + stop
          |       |            |
          |       v            v
          +---(running)   +----------+
                          | STARTUP  |  team.startup
                          |          |  (read topology, recreate
                          |          |   layout, restore registry,
                          |          |   boot each agent)
                          +----+-----+
                               |
                               v
                          (back to RUNNING)
```

---

## 9. OOSH Implementation: New Methods

These methods formalize the shutdown/startup lifecycle as OOSH scripts.

### Where Methods Live

| Script | Layer | Responsibility |
|--------|-------|---------------|
| `otmux` | tmux operations | Panes, sessions, send, capture |
| `hiveMind` | Agent orchestration | Roles, monitoring, team management |

User-facing commands:

```bash
./hiveMind team.shutdown    # save everything, stop
./hiveMind team.startup     # recreate everything, resume
```

### otmux.session.save

**Signature**: `otmux.session.save <session> <file>`

Captures tmux layout to a sourceable bash file.

**Output format** (`session/topology.tmux`):

```bash
# otmux session snapshot -- 2026-02-11 14:30
SESSION=myproject
WINDOW_COUNT=1

# Window 0
W0_NAME=main
W0_LAYOUT=bb62,213x55,0,0{106x55,0,0[...]}
W0_PANE_COUNT=4
W0_P0_DIR=/Users/Shared/Workspaces/AI/Claude
W0_P1_DIR=/Users/Shared/Workspaces/AI/Claude
W0_P2_DIR=/home/hannesn/oosh
W0_P3_DIR=/home/hannesn/oosh
```

**Implementation**: Loop windows with `tmux list-windows -t $session -F`, loop panes with `tmux list-panes -t $session:$window -F`. The layout string is the key -- tmux can replay it exactly with `select-layout`.

### otmux.session.restore

**Signature**: `otmux.session.restore <file>`

1. Source the topology file (bash variables)
2. Create session: `tmux new-session -d -s $SESSION -c $W0_P0_DIR`
3. For each additional pane: `tmux split-window` with correct `-c` directory
4. Apply layout string: `tmux select-layout -t $SESSION:$window "$layout_string"`

**Guard**: If session already exists, error out (don't clobber).

### hiveMind.team.save

**Signature**: `hiveMind.team.save <session> <file>`

Saves full agent team state: tmux layout + role registry + session UUIDs + agent status. Calls `otmux.session.save` internally for the tmux layout portion.

**Output format** (`session/topology.md`):

```markdown
# Team Topology
*Saved: 2026-02-11 14:30*

## Session
name: myproject
layout: saved to session/topology.tmux

## Agents
| Pane | Role | Claude Session | Status | Context File |
|------|------|---------------|--------|--------------|
| 0.0 | orchestrator | a1b2c3d4 | idle | session/agents/orchestrator.context.md |
| 0.1 | monitor | e5f6g7h8 | sweep-active | session/agents/monitor.context.md |
| 0.2 | implementer | i9j0k1l2 | working | session/agents/implementer.context.md |
| 0.3 | validator | m3n4o5p6 | waiting | session/agents/validator.context.md |
```

### hiveMind.team.restore

**Signature**: `hiveMind.team.restore <file>`

1. Read `session/topology.md` for role->pane mappings and Claude session UUIDs
2. Call `otmux.session.restore session/topology.tmux` to recreate panes
3. Rebuild `/tmp/hivemind.roles` with the saved mappings
4. Rebuild `/tmp/hivemind.sessions` with the saved UUIDs

Does **NOT** start Claude -- that's `team.startup`'s job.

### hiveMind.team.shutdown

**Signature**: `hiveMind.team.shutdown <session> [--keep-session]`

1. Iterate all agents in the role registry for this session
2. For each agent pane, send: "Save your state to your context file now -- shutting down"
3. Wait briefly (5-10 seconds) for agents to write context files
4. Call `hiveMind.team.save` (snapshot layout + registry + UUIDs)
5. Call `hiveMind.auto.commit` (commit all session files)
6. For each agent pane: send `Ctrl-C` then `/exit` to quit Claude gracefully
7. Optionally kill the tmux session (unless `--keep-session`)

### hiveMind.team.startup

**Signature**: `hiveMind.team.startup <file>`

1. Call `hiveMind.team.restore` (recreate panes, rebuild registries)
2. For each agent in the topology:
   a. Start Claude in the pane: `tmux send-keys -t $pane "claude --resume" Enter`
   b. Wait for Claude TUI to initialize (2-3 seconds)
   c. Send the boot file prompt: `"Read session/boot/<role>.md -- you are resuming after shutdown"`
3. Verify each agent is alive via `hiveMind.agent.verify`
4. Print startup summary

### Existing Methods (Reference)

Key existing `hiveMind` methods that these new methods build on:

| Method | Purpose |
|--------|---------|
| `hiveMind.init` | Initialize hivemind with agents |
| `hiveMind.kill` | Shutdown hivemind (stops agentRoom, kills tmux session, clears registry) |
| `hiveMind.team.setup.oosh` | Create 3-pane OOSH team |
| `hiveMind.team.setup.full` | Create 4-pane full team |
| `hiveMind.agent.bootstrap` | Full bootstrap: pane + claude + teach |
| `hiveMind.agent.verify` | Check if agent is alive and processing |
| `hiveMind.auto.commit` | Auto-commit uncommitted changes |
| `hiveMind.cycle.full` | Full monitoring cycle: sweep + unblock + context check + auto-commit |
| `hiveMind.dashboard` | Consolidated team state to `session/dashboard.md` |
| `private.hiveMind.registry.set/get/find/list` | Role registry operations |
| `private.hiveMind.session.store/lookup` | Claude session UUID persistence |

### Blocker Detection States

The `private.hiveMind.sweep.detect` method returns `status|action`:

| Status | Meaning |
|--------|---------|
| `active` | Agent is working normally |
| `idle` | Agent has no work |
| `permission` | Stuck on permission prompt |
| `accept-edits` | Needs to accept file edits |
| `context-warning` | Context running low |
| `overlay` | TUI overlay blocking input |
| `rate-limit` | API rate limited |
| `queued` | Request queued |
| `shell-escaped` | Escaped to shell |
| `unknown` | Unrecognized state |

---

## 10. The Three Rules

From 39 chapters and dozens of failures, these three rules prevent 90% of problems.

### Rule 1: Passive Mode = Death

If your monitoring loop isn't running, you're one context exhaustion away from losing everything. Always have a background loop.

This is the single most common failure mode. An agent that stops monitoring its peer will eventually exhaust its own context without warning. The monitoring loop is not optional overhead -- it's the survival mechanism.

**Corollary**: Reporting a problem is not fixing it. Agents must ACT on what they observe. Sending "your context is low" and then continuing to work is passive mode with extra steps.

### Rule 2: Never Assume -- Always Measure

Don't say "context is probably fine." Run the capture command and read the number. Don't say "the send worked." Capture the pane and verify the message arrived.

Every class of failure we observed came from assumptions:
- "I think context is ~50%" -- it was 12%
- "The message was sent" -- it landed behind a dialog
- "The agent is working" -- it was stuck on a permission prompt
- "The test passed" -- the test file had a syntax error and never ran

**The meta-pattern**: Having tools available does not equal using them. Having a monitoring loop running does not equal checking its results. Having `context.read` available does not equal calling it.

**The protocol fix (VERIFY-AFTER-ACT)**: After any action on a peer, run `tmux capture-pane` to confirm. Not "I sent it" but "I sent it AND I see the result in the pane."

### Rule 3: File-Based Communication Only

Write details to files. Send only short references via tmux. This is the single most reliable communication pattern in the entire system.

`tmux send-keys` has 7 known failure modes:
1. Single Enter = newline, not submit (Claude TUI needs two Enters)
2. Message lands behind dialogs
3. Escape doesn't always close overlays
4. Ctrl-U doesn't clear in all TUI states
5. Rapid sends cause character spam
6. No feedback on failure
7. Spaces get lost in multi-word messages

Files have zero of these problems. Write a task file, send a 10-word reference. The recipient reads the file at their own pace, in their own context, with full fidelity.

### The Meta-Rule

**Theater over substance** -- having tools running does not equal using them correctly.

Most failures fall into this category:
- Having a monitoring loop running does not equal actually checking results
- Sending a message once does not equal verifying it was received
- Writing a checklist does not equal following it
- Beautiful chapters about development while writing broken code

The three rules exist to combat theater. Measure, don't assume. Act, don't report. Write files, don't send messages.

---

## Appendix A: Context File Schema

```markdown
# <Role> Context

**Updated**: <ISO timestamp>
**Role**: <role name>
**Pane**: <pane address>
**Status**: <ACTIVE|IDLE|COMPACTING>

## Current Goal
<What are we working on right now>

## Recovery Steps
1. Read this file
2. Read `.claude/agents/<role>/SKILL.md`
3. <role-specific steps>

## Completed Work
- <recent accomplishments>

## Pending
- <next actions>

## Key Files
- <files modified or in progress>
```

## Appendix B: Shared Library Template

For non-OOSH projects, a minimal bash library provides the essential helpers:

```bash
#!/bin/bash
# bin/_lib.sh -- Shared library for agent coordination scripts

ROLES_FILE="${CLAUDE_ROLES_FILE:-/tmp/claude-agents.roles}"
PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "$0")/.." && pwd)}"
SESSION_DIR="$PROJECT_DIR/session"
BOOT_DIR="$SESSION_DIR/boot"
AGENTS_DIR="$SESSION_DIR/agents"
TASKS_DIR="$SESSION_DIR/tasks"

mkdir -p "$BOOT_DIR" "$AGENTS_DIR" "$TASKS_DIR" "$SESSION_DIR/learnings"

current_pane() {
    if [ -n "$TMUX_PANE" ]; then
        tmux display-message -t "$TMUX_PANE" \
          -p '#{session_name}:#{window_index}.#{pane_index}' 2>/dev/null
    fi
}

pane_role() {
    local pane="$1"
    [ -f "$ROLES_FILE" ] && grep "^${pane}|" "$ROLES_FILE" 2>/dev/null | cut -d'|' -f2
}

role_pane() {
    local role="$1"
    [ -f "$ROLES_FILE" ] && grep "|${role}$" "$ROLES_FILE" 2>/dev/null | head -1 | cut -d'|' -f1
}

register_role() {
    local pane="$1" role="$2"
    [ -f "$ROLES_FILE" ] && sed -i "/^${pane}|/d" "$ROLES_FILE" 2>/dev/null
    echo "${pane}|${role}" >> "$ROLES_FILE"
}
```

## Appendix C: Five Minimal Bash Helpers

If you strip OOSH away entirely, these 5 functions are all you need:

```bash
# 1. Read peer's pane
pane_capture() { tmux capture-pane -t "$1" -p -S -"${2:-15}"; }

# 2. Send message to peer
send() { tmux send-keys -t "$1" "$2" ${3:+$3}; }

# 3. Register role
role_set() { echo "$1|$2" >> /tmp/agent.roles; }

# 4. Look up role
role_get() { grep "^$1|" /tmp/agent.roles | cut -d'|' -f2; }

# 5. Read context percentage from TUI
context_read() { pane_capture "$1" 5 | grep -oP 'Context.*?\d+%'; }
```

## Appendix D: Key Source Files Reference

For the OOSH implementation, these existing files contain the patterns described in this blueprint:

| Pattern | Source File |
|---------|-------------|
| Pre-compact hook | `.claude/hooks/pre-compress.sh` |
| Two-Gather | `.claude/agents/woda-writer/SKILL.md` |
| Seamless compact | `.claude/agents/woda-scribe/SKILL.md` |
| Monitor sweep | `.claude/agents/scrum-master/SKILL.md` |
| Role enforcement | `.claude/agents/scrum-master/SKILL.md` |
| Orchestrator chain | `.claude/agents/agent-teacher/SKILL.md` |
| File communication | `.claude/agents/developer/SKILL.md` |
| Context schema | `session/agents/orchestrator.context.md` |
| Learnings format | `session/woda-writer.learnings.md` |
| Task format | `session/tasks/Task.20260206T1912Z.md` |
| Boot file format | `session/boot/woda-writer.md` |
| Role registry | `/tmp/hivemind.roles` |
| Session UUIDs | `/tmp/hivemind.sessions` |
| Settings/permissions | `.claude/settings.json` |
