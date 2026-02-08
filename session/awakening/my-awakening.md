# OOSH Agent Training — Token-Optimized Reference

*For Claude Code agents operating in tmux/OOSH environments.*

---

## 1. Environment Orientation

### Determine Context
```bash
tmux display-message -p '#S'     # Session name
tmux list-panes -F '#{pane_index}: #{pane_title} (#{pane_current_command})'
hostname -s                       # Machine name for pane naming
```

### Standard 3-Pane Layout
```
┌─────────────────┬─────────────────────────┐
│ Pane 0          │ Pane 1: zsh (default)   │
│ Claude Code     ├─────────────────────────┤
│                 │ Pane 2: bash (OOSH)     │
└─────────────────┴─────────────────────────┘
```

**Setup commands:**
```bash
tmux split-window -h                              # Create right pane
tmux split-window -v -t 1                         # Split right vertically
tmux select-pane -t 1 -T "$(hostname -s).default.shell"
tmux select-pane -t 2 -T "$(hostname -s).oosh.shell"
tmux send-keys -t 2 'bash' Enter                  # Boot OOSH
```

---

## 2. Two Shells: zsh vs OOSH

| Aspect | zsh (default) | OOSH (bash) |
|--------|---------------|-------------|
| Prompt | `user@host %` | `[oosh host.mode] user@host:path >` |
| Completions | Raw commands (435 tmux options) | Self-documenting methods |
| Environment | `LOG_LEVEL`, `OOSH_DIR` empty | All OOSH vars configured |
| PATH | Standard | Extended with `~/oosh`, `~/scripts`, `~/init` |

**OOSH bootstrap signs:**
```
finding completions
sourcing .../_oosh_commands
Welcome to Web 4.0
```

---

## 3. Remote Pane Operations

| Task | Command |
|------|---------|
| Send command | `tmux send-keys -t <pane> 'command' Enter` |
| Read output | `tmux capture-pane -t <pane> -p -S -<lines>` |
| Clear input | `tmux send-keys -t <pane> C-u` |
| Set title | `tmux select-pane -t <pane> -T "title"` |

**Critical:** Use `C-u` (kill line), not `C-c`. Works in both zsh and bash.

---

## 4. OOSH Command Pattern

**Invocation:** `script method arg1 arg2` → calls `script.method(arg1, arg2)`

**Discovery:** Type `script ` + Tab to see all methods with parameter hints.

| Notation | Meaning |
|----------|---------|
| `<param>` | Required parameter |
| `<?param>` | Optional parameter |
| `<?param:default>` | Optional with default value |
| `# description` | Method documentation |

**Example completion output:**
```
otmux.pane.capture  # <target> <?lines:20>  # capture pane output
otmux.pane.title    # <target> <title>      # set pane title
otmux.send.enter    # <target> <text>       # send text + Enter
```

---

## 5. Core OOSH Scripts

| Script | Purpose | Key Methods |
|--------|---------|-------------|
| `otmux` | tmux wrapper | `pane.capture`, `pane.title`, `send.enter` |
| `claudeCode` | Claude Code wrapper | `continue`, `process.find`, `session.save` |
| `hiveMind` | Multi-agent orchestration | `team.status`, `monitor`, `send.enter`, `role.list` |
| `state` | State machine engine | `machine.create`, `add`, `next`, `of` |
| `scrumMaster` | PDCA cycle manager | `pdca.start`, `pdca.next`, `pdca.run` |
| `config` | Configuration persistence | `set`, `get`, `list` |
| `log` | Logging (levels 0-7) | `console.log`, `debug.log`, `error.log` |
| `oo` | Framework lifecycle | `new`, `new.method`, `mode` |

---

## 6. Multi-Agent Operations

### Check Team Status
```bash
hiveMind team.status                    # Default session (cursorOrchestrator)
hiveMind team.status <session>          # Specific session
```

### Monitor Agents
```bash
hiveMind monitor <agent-name> <lines>   # By registered name
tmux capture-pane -t session:window.pane -p -S -<lines>  # Direct
```

### Send Messages
```bash
hiveMind send.enter <agent-name> "message"   # To registered agent
otmux send.enter <target> "message"          # To pane target
```

### Available Roles
```
agent-teacher    agent-trainer    developer
oosh-expert      oosh-tester      product-owner
script-product-owner              scrum-master    task-agent
```

Role definitions: `.claude/agents/<role>/SKILL.md`

---

## 7. State Machines

### Structure
```bash
~/config/stateMachines/<MACHINE>.states.env   # State definitions
~/config/stateMachines/<MACHINE>.pdca.env     # PDCA counters (if applicable)
```

### PDCA Cycle (Plan-Do-Check-Act)
```
PLANNING → DOING → CHECKING → ACTING → CHECKING → ... → FINISHED
                      ↑          │
                      └──────────┘  (loop while errors > 0)
```

**Commands:**
```bash
scrumMaster pdca.start <name> <errorCount>   # Create cycle
scrumMaster pdca.next <name>                 # Advance state
scrumMaster pdca.run <name> <errorCount>     # Run to completion
scrumMaster pdca.state <name>                # Current state
```

### Custom State Machines
```bash
state machine.create <NAME> <customScript>
state add <stateName>                        # Repeat for each state
state machine.start                          # Begin at first custom state
state next                                   # Advance
state of <NAME>                              # Query current state
```

**Hook pattern:** Define `private.check.<statename>()` in customScript to validate/redirect transitions.

---

## 8. CMM — Capability Maturity Model

### Critical Framing

**CMM measures CAPABILITIES, not organizations.**
It's not "Organisation Maturity Model" — it's "Capability Maturity Model." Every capability can be assessed independently. Agent context recovery, process improvement, test coverage — each has its own maturity level.

### The Five Levels

| Level | Name | What It Means | Target? |
|-------|------|---------------|---------|
| 1 | **Initial** | Chaos. Trial-and-error. Success depends on heroic individuals. | Escape |
| 2 | **Repeatable** | Past successes can be repeated. Results vary by person. | Pass through |
| 3 | **Defined** | Processes documented, standardized, **deterministic**. Same input → same output, every time, anyone. | Foundation |
| 4 | **Managed** | Quantitative measurement. Automated feedback loops. System improves itself. | **Practical ceiling** |
| 5 | **Optimizing** | Formal verification. Statistical process control. | **NOT a goal** |

### Why Level 4, Not Level 5

**Level 5 is NOT a target.** It's a cost forced by external regulators (FDA, FAA) when:
- Lives are at stake (medical devices, aviation)
- Failure costs are catastrophic (deep space missions)

**Pareto principle:** 80% of results require 20% effort. The remaining 20% (Level 4→5) requires 80% additional effort. Level 5 is Pareto-inefficient without regulatory mandate.

**PDCA is the Level 4 engine** — Plan-Do-Check-Act creates automated feedback loops. It's not a Level 5 mechanism.

**Why never 5.0:** Once at Level 4, the system manages its own improvement. No paradigm shift needed. Industry 4.0 is the ceiling. Web 4.0 is the ceiling.

### Composed Capability Maturity

> **The lowest maturity component determines overall capability maturity.**

| Component | Level | Overall |
|-----------|-------|---------|
| Context template | 2 | |
| Save trigger | 2 | |
| Recovery verification | 1 | |
| **System** | | **1** |

One Level 1 component drags everything down. **Fix the weakest link first.**

### "Changing a Process" is a Separate Capability

You can be **Level 1 at improving a Level 2 capability.**

| Capability | Your Level | Evidence |
|------------|------------|----------|
| Agent recovery | 2 | Templates exist, works if followed |
| *Improving* agent recovery | 1 | Ad-hoc experiments, no defined method |

To reach Level 3 at process improvement: need a defined method for "how to mature any capability from Level N to N+1."

### CMM3 = Deterministic (Not Just Repeatable)

**Repeatable** (Level 2): "We did it before, we can do it again."
**Deterministic** (Level 3): "Same input, same output. Every time. Anyone. Documented."

*"Wer schreibt, der bleibt."* — Who writes, stays. What's written survives:
- Personnel changes
- Context compaction
- Paradigm shifts

### CMM4 = Measure + Feedback Loop

No measurement → no improvement past CMM3.

**Required metrics:**
- Token consumption per task
- Context usage rate
- Cycle time
- Error rates

**The feedback loop:** Measurement → Analysis → Process adjustment → Measurement...

When this loop runs automatically, you're at Level 4. And Level 4 is enough.

### Web 4.0 Definition

> "The consequent application of CMM 4 methods to achieve a CMM 4 worldwide web enabling sustainable resilient change."

4.0 = self-improving systems. Not perfection (5.0), but self-sustaining adaptation (4.0).

---

## 9. Agent Context Preservation

### Required Context File Fields (CMM3 Schema)
```markdown
# Agent Context — [ROLE]

**Session**: [tmux-session:window.pane]
**Role**: [role-name]
**State**: [spawned|initialized|taught|working|saving|recovering|resumed]
**Updated**: [ISO timestamp]

## Current Task
**ID**: [task ID]
**Description**: [what I'm doing]
**Progress**: [done / remaining]

## Files Modified
- [list]

## Recovery Sequence
1. [first step]
2. [second step]
3. [verify step]
```

### Lifecycle States
```
SPAWNED → INITIALIZED → TAUGHT → WORKING ⇄ SAVING → RECOVERING → RESUMED
                                                                    ↓
                                                               TERMINATED
```

### Pre-Compact Protocol
1. **STOP** current work at 20% context remaining
2. **SAVE** state to `session/agents/<role>.context.md`
3. **RUN** `/compact`

Hook: `.claude/hooks/pre-compress.sh` automates reminder + resume prompt.

---

## 10. Environment Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `OOSH_DIR` | Framework root | `/Users/donges/oosh` |
| `CONFIG` | User config path | `~/config/user.env` |
| `LOG_LEVEL` | Logging verbosity (0-7) | `3` (default) |
| `OOSH_MODE` | Development mode | `dev`, `prod` |

**Check in OOSH shell:**
```bash
echo $LOG_LEVEL $OOSH_DIR $CONFIG
```

---

## 11. Quick Reference — Common Workflows

### Monitor All Agents
```bash
hiveMind team.status
for p in 0.1 0.2 0.3; do
  echo "=== $p ===" && tmux capture-pane -t cursorOrchestrator:$p -p -S -3
done
```

### Find Claude Process
```bash
claudeCode process.find <session:window.pane>
```

### Run Tests
```bash
test.suite run <script> <log-level>   # Single script
test.suite all <log-level>            # All tests
```

### Create New Script
```bash
oo new <scriptname>                   # From template
oo new.method <script>.<method>       # Add method
```

### Persist Configuration
```bash
config set VAR value
config get VAR
config list
```

---

## 12. Transparency Principle

**Rule:** Use visible panes for all operations. Internal bash subprocess = transport only.

| Invisible (transport) | Visible (staged) |
|-----------------------|------------------|
| `tmux send-keys -t 2 'cmd' Enter` | The actual command |
| `tmux capture-pane -t 2 -p` | Script execution, results |

**Why:** Humans see what you do. Mistakes are catchable. Learning happens.

---

## Summary: Agent Operating Checklist

1. ☐ Identify session and pane layout
2. ☐ Boot OOSH shell if needed (`bash` in a pane)
3. ☐ Name all panes (`otmux pane.title` or raw tmux)
4. ☐ Use Tab completion to discover methods
5. ☐ Check for other agents (`hiveMind team.status`)
6. ☐ Monitor context usage — save before 20% remaining
7. ☐ Write state to context file before any compaction
8. ☐ Use visible panes for transparency

---

*Token-optimized training for OOSH/tmux agent operations. CMM3-compliant: documented, standardized, reproducible.*
