# MVC Architecture: claudeCode + otmux + hiveMind

*Reference for the agent-trainer. Written 2026-06-10 during Tier-3 distillation.*

The team operates a Model-View-Controller architecture for managing AI agents in tmux. Understanding the layering is what separates a working trainer from one that makes painful mistakes.

---

## The Layering

```
┌──────────────────────────────────────────────────────────────┐
│  Controller: hiveMind                                        │
│  - Agent registry (/tmp/hivemind.roles)                      │
│  - Team coordination                                         │
│  - Cross-pane orchestration                                  │
│  - Multi-machine operations (migrate, pull)                  │
└──────────────────────────────────────────────────────────────┘
              │                              │
              ↓                              ↓
┌─────────────────────────┐    ┌─────────────────────────────┐
│  View: otmux            │    │  Model: claudeCode          │
│  - Panes, windows, sess │    │  - Claude Code TUI process  │
│  - Keystrokes, captures │    │  - Session UUIDs            │
│  - Layout, titles       │    │  - JSONL conversations      │
│  - Visual surface       │    │  - Fork mechanics           │
└─────────────────────────┘    └─────────────────────────────┘
              │                              │
              └──────────┐         ┌─────────┘
                        ↓         ↓
              ┌─────────────────────────┐
              │  tmux (the engine)      │
              │  - Sessions, panes      │
              │  - Terminal multiplexing│
              └─────────────────────────┘
```

The key insight: **hiveMind doesn't manipulate tmux directly**. It calls otmux for view operations and claudeCode for model operations. When you bypass hiveMind to manipulate panes/sessions directly, you risk drifting from the registry → role-resolution breaks.

---

## Model: claudeCode

### Responsibility
The Claude Code TUI process is the Model. Everything about the agent's identity, conversation history, and context window is owned here.

### Key Files
- **Source code**: `/Users/donges/oosh/claudeCode` (~730 lines)
- **JSONL conversations**: `~/.claude/projects/<dir>/<uuid>.jsonl` — the actual conversation history
- **Credentials**: macOS Keychain `Claude Code-credentials`

### Critical Methods

#### `claudeCode session.id <pane>`
Get the session UUID for a Claude process in a pane.
- Reads pane's TTY, scans `ps` for matching claude process
- Returns UUID like `5b56e996-9d26-4214-8057-295006402116`
- Example: `claudeCode session.id robbinTeam:0.0` → UUID of the PO's session

#### `claudeCode session.discover`
Find Claude sessions on the machine.
- Returns: pane targets + UUIDs + roles for all running claude processes
- Used by `hiveMind registry.refresh` to rebuild the registry

#### `claudeCode context.read <pane>`
Read context % of an agent.
- **WARNING: STALE**. Returns values that can be off by 50k+.
- Always verify against pane status bar (`tmux capture-pane | grep "clear to save"`)
- Use peer measurement instead: agents can't see own context %, peers can capture pane

#### `claudeCode fork <session-uuid>`
Fork a session into a new process. The magic command.
- Runs: `claude --resume <uuid> --fork-session --model claude-opus-4-6[1m]`
- New conversation inherits ALL training, history, learnings from source
- Source UUID's `.jsonl` IS the conversation — fork creates new session ID but reads from same file initially
- Prompts user: "Resume from summary (recommended)" or "Resume full session as-is" → Choose **option 2 (full session)** to keep all accumulated knowledge

#### `claudeCode fork.byName <role>`
Fork by role name. Convenience wrapper.
- Resolves: role → pane (via hiveMind registry) → UUID → fork
- Example: `claudeCode fork.byName oosh-expert` → forks oosh-expert's current session

#### `claudeCode fork.byPane <pane>`
Fork by pane address. Another convenience.

#### `claudeCode fork.to <pane> <?role>`
One-shot recovery: pick best JSONL for role, fork into pane, rename, register, set title, send boot.
- Internally calls `hiveMind.agent.fork.best` (Controller orchestration)
- Best JSONL selection: filter <50KB (incomplete), sort by size DESC, pick first
- The size correlates with accumulated training — larger = more capable

#### `claudeCode fork best` (semantics)
Best fork = largest JSONL because:
- Tool uses, code reads, conversation length all add to JSONL
- A 10.5MB JSONL is a heavily-trained agent
- A 15KB JSONL is a barely-started agent
- Same UUID can have multiple JSONLs (forks share UUID prefix)
- Always pick the BIG one

### What Forks Inherit

| Property | Inherited? |
|----------|-----------|
| Training (SKILL.md reads, role identity) | YES |
| Conversation history (every message) | YES |
| In-flight task state (what was being worked on) | YES |
| Tool use history | YES |
| Permission settings (auto-mode, etc.) | YES |
| Pane title | NO (Claude Code overwrites) |
| Tmux pane address | NO (whatever pane it's launched in) |
| Session name (e.g. "scrum-master@MacStudio") | NO (must /rename after fork) |
| Model setting | YES (unless --model flag overrides) |
| Remote Control state | NO (must /remote-control after fork) |

### The Fork-Then-Rename Pattern

```bash
# 1. Get source UUID
SRC_UUID=$(claudeCode session.id <source-pane>)

# 2. Exit dead session if needed
otmux send.raw <target-pane> "/exit" Enter
sleep 3

# 3. Start bash if needed
otmux send.raw <target-pane> "bash" Enter
sleep 5

# 4. Fork
otmux send.raw <target-pane> "claudeCode fork $SRC_UUID" Enter
sleep 10
# Pick option 2 "Resume full session" (preserve all knowledge)
otmux send.raw <target-pane> Down Enter
sleep 15

# 5. Rename to target role
otmux send.raw <target-pane> "/rename <target-role>" Enter

# 6. Enable Remote Control
otmux send.raw <target-pane> "/remote-control" Enter

# 7. Verify model (should be Opus 4.7)
otmux send.raw <target-pane> "/model" Enter
# Navigate to option 1 if needed

# 8. Retrain with role-specific boot
otmux send.raw <target-pane> "You are <target-role>. Read session/agents/<target-role>/context.md..." Enter
```

---

## View: otmux

### Responsibility
The tmux interface is the View. Everything visual — panes, windows, sessions, captures, sends — goes through otmux.

### Key Files
- **Source code**: `/Users/donges/oosh/otmux` (~3500 lines)

### Critical Methods

#### `otmux pane.capture <pane> <lines>`
Read pane content.
- Default: 20 lines
- Use for status checks
- For deeper scrollback (>20 lines), use raw `tmux capture-pane -t <pane> -p -S -N` where -N is negative line count
- Example: `tmux capture-pane -t robbinTeam:0.0 -p -S -50` → 50 lines of scrollback

#### `otmux send <pane> "text" Enter`
Send text to pane with sender identity prefix.
- Prefix format: `[@<sender-role> <sender-pane>]`
- Good for: human-readable messages, audit trail, requests to agents
- Bad for: slash commands (/rewind /model /clear), keystrokes (Enter, Up, Down, BTab)
- The prefix confuses agents into thinking the slash command is part of the message text

#### `otmux send.raw <pane> <keys>`
Send raw keystrokes without prefix. **YOUR WORKHORSE METHOD**.
- Use for: ALL keystrokes (Enter, Up, Down, C-u, BTab, Escape)
- Use for: ALL slash commands (/rewind, /model, /rename, /exit, /remote-control)
- Use for: retrain prompts when you don't want sender identity in the message
- Multiple keys: `otmux send.raw <pane> Up Up Enter`

#### `otmux send.verified <pane> "text" Enter`
Send + verify delivery by post-capture.
- Use for critical messages where you NEED to know it landed
- Slower than `otmux send`
- Captures pane after send, checks for text appearance

#### `otmux pane.list <session>`
List panes in a session.
- Format: `session:window.pane  title  shell`
- Example output:
  ```
  robbinTeam:0.0  robbin-po@MacStudio  2.1.154
  robbinTeam:0.1  robbin-architect@MacStudio  2.1.154
  ```

#### `otmux pane.title <target> <title>`
Set pane title (border label).
- Claude Code overwrites titles on its own — title persistence is unreliable
- Use registry (`/tmp/hivemind.roles`) for source of truth, not titles

#### `otmux pane.zoom <pane>` (or `tmux resize-pane -Z`)
Zoom a pane to full screen.
- Use BEFORE rewind on narrow panes — picker text gets truncated otherwise
- Unzoom after with same command (toggles)
- Critical for robbinTeam which has 6+ panes per window

#### `otmux sessions`
List tmux sessions.

#### `otmux tree`
Visual session overview — sessions with panes, indented.
- Shows pane titles, shell types
- Use for "where is everything?"

#### `otmux tree.detailed`
Tree + Claude role + session ID for each pane.
- Shows role from registry
- Shows UUID for forks
- Use when debugging identity confusion

#### `otmux window.new -t <sess>:<idx>`
Create new window in session at specific index.
- Example: `otmux window.new -t robbinTeam:2` creates window 2 in robbinTeam
- Window indexes auto-collide if not specified — be explicit

#### `otmux splitH <pane>` / `otmux splitV <pane>`
Split pane horizontally or vertically.

### Send Variants Decision Tree

```
Sending to a pane?
├── Is it a slash command (/rewind, /model, etc.)?
│   └── YES → otmux send.raw <pane> "/cmd" Enter
├── Is it keystrokes (Enter, C-u, Up, Down, BTab, Escape)?
│   └── YES → otmux send.raw <pane> <keys>
├── Is it a critical message that MUST land?
│   └── YES → otmux send.verified <pane> "text" Enter
└── Is it a regular message to an agent?
    └── YES → otmux send <pane> "text" Enter
       (will prepend [@<your-role> <your-pane>] for audit)
```

### Why `otmux send` Prefix Matters

When SM sends "/rewind" via `otmux send TRONinterface:0.1 "/rewind" Enter`:
1. otmux send wraps the text: `[@scrum-master TRONinterface:0.1] /rewind`
2. The pane receives this entire string
3. Claude Code TUI sees a message starting with `[@`, not a slash command
4. Agent processes it as a prompt about /rewind, not as the /rewind command
5. The rewind doesn't happen

That's why **`otmux send.raw` is mandatory for TUI commands**.

---

## Controller: hiveMind

### Responsibility
The orchestrator. Owns the agent registry, coordinates cross-pane operations, manages teams.

### Key Files
- **Source code**: `/Users/donges/oosh/hiveMind` (~5800 lines)
- **Registry file**: `/tmp/hivemind.roles` — format `target|role` per line
- **Snapshot files**: `~/config/hivemind.snapshot.*.env` — for restore operations
- **Config files**: `~/config/hivemind.roles.env`, `hivemind.sessions.env`, `hivemind.teams.env`

### Critical Methods

#### `hiveMind team.sweep <session>`
One-line-per-pane status. **YOUR MOST USED COMMAND**.
- Returns each agent's state in one line
- States: ACTIVE, COMPLETED, IDLE, PERMISSION, ACCEPT_EDITS, RATE_LIMIT, UNKNOWN
- Use to detect: stuck agents, idle capacity, agents needing attention
- Faster than 6 individual pane.captures

Example:
```
0.0   robbin-po              ACTIVE
0.1   robbin-architect       ACCEPT_EDITS
0.2   robbin-expert          COMPLETED
0.3   robbin-tester          ACTIVE
1.0   robbin-planner         IDLE
1.1   robbin-req             RATE_LIMIT
```

#### `hiveMind team.status <session>`
Tree view with UUIDs.
- Slower than team.sweep but shows MORE
- Includes session UUIDs for forks
- Use for fork debugging

#### `hiveMind agent.monitor <name> <session> <lines>`
Capture agent output by role name.
- Cross-team — works for any registered agent
- Returns the last N lines of pane output
- Format: name, pane, output

#### `hiveMind send.enter <name> "msg"`
Send message to agent by name. Wrapper around otmux send.
- Resolves name → pane via registry
- Sends message with Enter
- Prepends sender identity prefix (like `otmux send`)

#### `hiveMind resolve <name>`
Name → pane address.
- Reads `/tmp/hivemind.roles`
- Returns target like `robbinTeam:0.0`
- Use when you need to script otmux calls

#### `hiveMind team.context.status <session>`
Context % for all agents in session.
- Uses `claudeCode context.read` under the hood — STALE WARNING APPLIES
- Always cross-check with pane status bar

#### `hiveMind agent.unblock <name>`
Detect and resolve stuck permission prompts.
- Sends Enter to approve typical permission prompts
- POs and trainer can self-unblock (this is for SM use)
- For non-PO agents: SM REPORTS to PO, doesn't unblock directly

#### `hiveMind unblock <name>`
Generic unblock (similar but less targeted).

#### `hiveMind sweep <session>`
Batch capture all panes (one call).
- Returns aggregate output
- Use for fast snapshot of entire team state

#### `hiveMind sweep.loop <interval>`
Continuous sweep + unblock at interval.
- SM uses this for its sweep duty
- Trainer typically doesn't run loops — operate on demand

#### `hiveMind team.register <session> <description>`
Register a team session in the registry.

#### `hiveMind agent.bootstrap <role>`
Full bootstrap: pane + claude + teach.
- Creates pane if needed
- Launches Claude Code
- Sends teach prompt from `.claude/agents/<role>/SKILL.md`

#### `hiveMind agent.respawn <name>`
Fork role snapshot into pane + /rename + re-register.
- Internally uses `claudeCode fork.best`
- Common recovery pattern

#### `hiveMind agent.restart.remote <role> <host>`
Restart an agent on a remote machine.
- Resolves role → UUID locally
- SCPs JSONL to remote
- Forks on remote
- Single-agent operation (not bulk)

#### `hiveMind teams.migrate <host>`
**DANGER: FULL-MACHINE MIGRATION**.
- Pushes ALL snapshot data + JSONLs to remote
- Restores ALL teams there
- F-T10: I used this thinking it was per-team. Got 18 sessions on remote when I wanted 1.
- For single-team work, use `agent.restart.remote <role> <host>` per agent

#### `hiveMind teams.save`
Snapshot all agents for restore after restart.
- Schema: `sess|addr|role|uuid|title|cwd|model|kind`
- Output: `~/config/hivemind.snapshot.<timestamp>.env`

#### `hiveMind teams.restore <?file> <?mode:join|fork>`
Cold-restart teams from snapshot.
- Mode `join`: rejoins existing sessions if running
- Mode `fork`: forks fresh sessions (use for cross-machine)
- Used by oosh team for team recovery operations

#### `hiveMind team.pull <host>`
Pull team config from remote machine to local.
- Reverse of teams.migrate
- Useful for backups, recovery from remote

#### `hiveMind team.restart <configDir>`
Restart agents from a pulled config directory.

### The Registry (`/tmp/hivemind.roles`)

Format:
```
robbinTeam:0.0|robbin-po
robbinTeam:0.1|robbin-architect
robbinTeam:0.2|robbin-expert
robbinTeam:0.3|robbin-tester
TRONinterface:0.0|product-owner
TRONinterface:0.1|scrum-master
baseTeam:0.0|agent-trainer
```

This is the source of truth for name→pane resolution. Claude Code overwrites tmux pane titles, so titles drift — the registry doesn't.

### Sweep State Meanings (Detailed)

| State | Pane Indicator | Action |
|-------|---------------|--------|
| ACTIVE | "esc to interrupt" visible | Working — leave alone |
| COMPLETED | "Baked/Cooked/Brewed for Ns" | Just finished — usually fine, check briefly |
| IDLE | "❯ " prompt, no activity | Idle — no rewind needed |
| PERMISSION | "Do you want to proceed?" | Stuck — needs unblock |
| ACCEPT_EDITS | "⏵⏵ accept edits on" | Auto-approving file edits — accumulates context |
| RATE_LIMIT | "API Error: ... Rate limited" | Server-side issue — will clear, no action |
| UNKNOWN | Can't determine | Investigate manually with deeper capture |

---

## Common Operations: How They Compose

### 1. Rewind an agent

```
PHASE 1: Verify pressure
└── tmux capture-pane -t <pane> -p -S -10 | grep "clear to save\|Context low"
    (Direct View read — don't trust SM's context.read)

PHASE 2: Toggle accept-edits (if needed)
└── otmux send.raw <pane> BTab
    (Direct View → Model TUI command)

PHASE 3: Issue rewind
├── otmux send.raw <pane> C-u   # Clear buffer
├── otmux send.raw <pane> "/rewind" Enter
└── Verify picker: tmux capture-pane -t <pane> -p | grep "Enter to continue"

PHASE 4: Navigate picker
├── otmux send.raw <pane> Up Up Up   # Go up N steps
└── (Repeat to reach target depth)

PHASE 5: Select & confirm
├── otmux send.raw <pane> Enter   # Select message
└── Check menu type: tmux capture-pane -t <pane> -p | grep "❯"
    ├── 5-option → otmux send.raw <pane> Down Enter  (option 2)
    └── 3-option → otmux send.raw <pane> Enter        (option 1)

PHASE 6: Retrain
├── otmux send.raw <pane> C-u
└── otmux send.raw <pane> "You have been rewound..." Enter

PHASE 7: Verify
├── Wait sleep 15-20s
├── otmux pane.capture <pane> 10
└── Verify identity + no context warning
```

### 2. Fresh Boot After Tier-3

```
PHASE 1: Exit old session
└── otmux send.raw <pane> "/exit" Enter
    (If session is empty already, skip)

PHASE 2: Get bash (OOSH not in PATH for plain zsh)
└── otmux send.raw <pane> "bash" Enter
    Wait 5s

PHASE 3: Boot Claude
└── otmux send.raw <pane> "claude --name <role>" Enter
    Wait 10s

PHASE 4: Enable Remote Control (Tron visibility)
└── otmux send.raw <pane> "/remote-control" Enter
    Verify: status bar shows "Remote Control active"

PHASE 5: Set model
├── otmux send.raw <pane> "/model" Enter
├── Check picker: tmux capture-pane -t <pane> -p
├── Navigate to "Default (recommended) Opus 4.7 with 1M context"
├── otmux send.raw <pane> Up Up Up Up Enter   # Adjust count based on current selection
└── If confirmation prompt appears: Enter

PHASE 6: Train from distilled files
└── otmux send.raw <pane> "You are <role> at <pane>. Read session/agents/<role>/boot.md..."

PHASE 7: Verify
├── Wait 20s
├── otmux pane.capture <pane> 15
└── Agent should: identify, summarize role, propose first action
```

### 3. Cross-Machine Single-Agent Fork (Tier-2)

```
PHASE 1: Get source UUID
└── SRC_UUID=$(hiveMind resolve <role> | xargs claudeCode session.id)

PHASE 2: Use hiveMind to push
└── hiveMind agent.restart.remote <role> <host>
    (Handles SCP + remote fork in one call)

PHASE 3: Verify on remote
└── ossh exec <host> "hiveMind team.status"
```

### 4. Mass Team Migration (Tier-3 escape hatch — RARE)

```
WARNING: This is full-machine migration. ALL teams will go.
Only use when you actually want to migrate everything.

PHASE 1: Snapshot locally
└── hiveMind teams.save

PHASE 2: Migrate
└── hiveMind teams.migrate <host>
    (Internally: scp snapshots + JSONLs, then teams.restore fork on remote)

PHASE 3: Verify
└── ossh exec <host> "hiveMind team.status"
```

---

## The Three Failure Modes (and how MVC layering helps)

### Failure 1: Stuck Agent (long operation, low tokens, queued messages)
- **Symptoms**: Activity verb running 30+ min with <500 tokens. "Press up to edit queued messages" in pane.
- **NOT context death**.
- **Fix**: `otmux send.raw <pane> Escape` — interrupts the stuck op. Queue auto-drains.
- **Why MVC matters**: This is a View-layer problem (TUI not interrupting). Don't escalate to Model (fork) or Controller (rewind).

### Failure 2: Context Limit (real context exhaustion)
- **Symptoms**: "Context limit reached · /compact or /clear" in pane.
- **Confirmed context death**.
- **Fix**: 2-phase rewind (Phase 1 if responsive, Phase 2 always).
- **Why MVC matters**: Rewind is a Model operation (forking conversation). Use the Claude TUI `/rewind`, not view-layer hacks.

### Failure 3: Permission Block
- **Symptoms**: "Do you want to proceed?" or "Yes/No" prompt visible.
- **Not context, not stuck — just blocked**.
- **Fix**: Send Enter (approve typical edit), Down Enter (option 2 for "yes always"), Escape (deny).
- **Why MVC matters**: Permission unblocking is View-layer (key press to TUI). Don't fork or rewind.

---

## Anti-Patterns to Avoid

### Don't bypass MVC layers
- **WRONG**: `tmux send-keys -t robbinTeam:0.0 -l '/rewind' Enter`
- **RIGHT**: `otmux send.raw robbinTeam:0.0 "/rewind" Enter`
- Why: Raw tmux bypasses logging, naming, registry consistency.

### Don't use Controller for View tasks
- **WRONG**: `hiveMind agent.monitor <name>` when you just want one pane
- **RIGHT**: `otmux pane.capture <pane> <lines>`
- Why: hiveMind adds overhead for cross-team aggregation you don't need.

### Don't use View for Model state
- **WRONG**: Grep pane output to determine if Claude session is alive
- **RIGHT**: `claudeCode session.id <pane>` returns UUID if alive, empty if not
- Why: Pane content is visual; session state is in the Model.

### Don't trust context.read without pane verification
- **WRONG**: SM says agent at 900k → trainer rewinds blindly
- **RIGHT**: Verify with `tmux capture-pane -t <pane> -p -S -10 | grep "clear to save"`
- Why: context.read returns stale/imprecise values. Pane status bar is truth.

### Don't fork blind agents
- **WRONG**: `claude --name <role>` (blank agent, no training)
- **RIGHT**: `claudeCode fork <source-uuid>` (fork from trained agent)
- OR: Fresh boot + distilled files (Tier-3 from saved knowledge)

---

## Quick Reference Card

```bash
# Sweep team
hiveMind team.sweep <session>

# Check one agent
otmux pane.capture <pane> 10
tmux capture-pane -t <pane> -p -S -15 | grep -i "clear to save\|context low\|limit"

# Send to agent
otmux send <pane> "human message" Enter     # with sender prefix
otmux send.raw <pane> "/rewind" Enter        # for slash commands
otmux send.raw <pane> Up Up Enter            # for keystrokes

# Rewind sequence (Phase 2 deep)
otmux send.raw <pane> BTab
otmux send.raw <pane> C-u
otmux send.raw <pane> "/rewind" Enter
sleep 3
for i in $(seq 1 100); do otmux send.raw <pane> Up; done
sleep 2
otmux pane.capture <pane> 8                  # Read "↓ N more below"
# Count = N+1, target = N/2 from bottom
for i in $(seq 1 N/2); do otmux send.raw <pane> Down; done
sleep 1
tmux capture-pane -t <pane> -p | grep "❯"    # Verify selected message
otmux send.raw <pane> Enter
sleep 3
tmux capture-pane -t <pane> -p | grep "❯"    # Check menu type
# 5-option: otmux send.raw <pane> Down Enter
# 3-option: otmux send.raw <pane> Enter
sleep 8
otmux send.raw <pane> C-u
otmux send.raw <pane> "You have been rewound. You are <role>..." Enter
sleep 20
otmux pane.capture <pane> 12                 # Health check

# Fork
SRC=$(claudeCode session.id <source-pane>)
otmux send.raw <target> "/exit" Enter; sleep 3
otmux send.raw <target> "bash" Enter; sleep 5
otmux send.raw <target> "claudeCode fork $SRC" Enter; sleep 10
otmux send.raw <target> Down Enter           # Resume full session
sleep 15
otmux send.raw <target> "/rename <role>" Enter
otmux send.raw <target> "/remote-control" Enter
otmux send.raw <target> "/model" Enter
# Select Opus 4.7

# Fresh boot (no source available)
otmux send.raw <target> "/exit" Enter; sleep 3
otmux send.raw <target> "bash" Enter; sleep 5
otmux send.raw <target> "claude --name <role>" Enter; sleep 10
otmux send.raw <target> "/remote-control" Enter
otmux send.raw <target> "/model" Enter   # Pick Opus 4.7
otmux send.raw <target> "You are <role>. Read session/agents/<role>/boot.md..." Enter
```

---

## Closing

The MVC layering is what keeps the team coherent across rewinds, forks, and mass operations. When you respect the layers, recovery is deterministic. When you bypass them, you get drift — registry says one thing, pane shows another, role resolution breaks, and agents lose identity.

The team that operates this architecture is built on top of bash. Every claudeCode/otmux/hiveMind method is a bash function. They compose through method dispatch (`this.call`) — not through inheritance or interfaces. The discipline is in the naming.

Read the source code when you're confused. `/Users/donges/oosh/hiveMind` is 5800 lines but every method has a signature comment that tells you what it does and what params it takes. Use the completion system: `hiveMind help | grep <keyword>`.

When in doubt: **measure** (View), **identify** (Model), **coordinate** (Controller).
