# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Workspace Overview

This is a multi-platform OOSH (Object-Oriented Shell) development workspace containing variants for different environments:

| Directory | Target Platform |
|-----------|-----------------|
| `components/OOSH/dev.claude` | Development branch with Claude integration |
| `components/OOSH/dev` | Development branch |
| `components/OOSH/prod` | Production/stable branch |
| `components/OOSH/macos` | macOS (symlink to ~/oosh/) |
| `components/OOSH/termux` | Android Termux |
| `components/OOSH/ish` | iOS iSH |
| `components/OOSH/windows` | Windows |

**Primary development happens in `components/OOSH/dev.claude/`** - this variant has the most complete documentation.

## OOSH Framework Essentials

OOSH is a pseudo-OOP Bash framework. Key concepts:

| Concept | Implementation |
|---------|----------------|
| Class | Script file (e.g., `config`, `log`) |
| Methods | Functions: `scriptname.methodname()` |
| Constructor | `scriptname.start()` |
| Private | `private.` prefix |

**Invocation**: `./scriptname method arg1 arg2` resolves to `scriptname.method(arg1, arg2)`

## Common Commands

```bash
# Create new scripts
./oo new myscript                 # New script from template
./oo new.method myscript.mymethod # Add method
./oo new.test myscript            # Create test file

# Run tests
./test.suite run <scriptname> [log-level]  # Test specific script
./test.suite all                           # Run all tests

# Configuration
./config set VAR value            # Persist config variable
./config list                     # Show all config

# Logging (levels 0-7, default 3)
./log level 5                     # Set to debug
```

## Key Documentation

| Document | Purpose |
|----------|---------|
| `CLAUDE.md` | This file — workspace rules, agent coordination |
| `docs/multi-agent-blueprint.md` | Complete multi-agent methodology reference |
| `docs/implementation-plan.md` | Implementation status and remaining work |
| `.claude/agents/_template/SKILL.md` | Template for creating new agent roles |
| `components/OOSH/dev.claude/CLAUDE.md` | OOSH dev branch agent workflow and per-prompt checklist |

## Core Scripts

| Script | Purpose |
|--------|---------|
| `this` | OOSH kernel - bootstrap and method dispatch |
| `oo` | Framework lifecycle, script creation |
| `config` | Configuration persistence to `~/config/user.env` |
| `log` | Logging (levels 0-7): `console.log`, `error.log`, `debug.log` |
| `debug` | Step debugger, stack traces |
| `state` | State machines for multi-step workflows |
| `test.suite` | Test framework |

## OOSH PATH Setup (MANDATORY for all agents)

OOSH commands are on PATH via `~/.bashrc`. To use them from Claude Code's internal Bash:

```bash
export PATH="/Users/donges/oosh:/Users/donges/oosh/otmux:/Users/donges/oosh/hiveMind:/Users/donges/oosh/ng:$PATH"
```

After this, run OOSH commands directly — **no `cd`, no `./` prefix**:

```bash
# CORRECT — simple atomic commands
otmux pane.capture projectTeam:0.3 10
otmux send projectTeam:0.1 "message" Enter
hiveMind team.status projectTeam

# WRONG — compound commands that trigger permission prompts
cd /Users/donges/oosh && ./otmux send projectTeam:0.1 "message" Enter
```

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `OOSH_DIR` | Root oosh directory (`/Users/donges/oosh`) |
| `CONFIG` | Path to `~/config/user.env` |
| `LOG_LEVEL` | Logging verbosity (0-7, default 3) |

## Test Pattern

```bash
source test.suite $*
test.case - "description" scriptname.method args
expect 0 "success" "full description"
```

## Result Communication

Functions return via variables:
- `RETURN_VALUE` - Numeric exit code
- `RESULT` - String result

## Agent Team (tmux)

This workspace supports multi-agent orchestration via tmux. Agent role definitions live in `.claude/agents/` (symlinked to `.cursor/skills/` for Cursor).

### Agent Roles

| Role | Location | Purpose |
|------|----------|---------|
| `agent-teacher` | `.claude/agents/agent-teacher/` | Train agents, delegate, improve tools |
| `expert` | `.claude/agents/expert/` | Implementation & architecture |
| `tester` | `.claude/agents/tester/` | Testing & validation |
| `scrum-master` | `.claude/agents/scrum-master/` | Monitoring, approval, role enforcement |
| `product-owner` | `.claude/agents/product-owner/` | OOSH quality guardian |
| `script-product-owner` | `.claude/agents/script-product-owner/` | Per-script lifecycle (template) |
| `developer` | `.claude/agents/developer/` | Implementation capacity (template) |

### Full Team Layout (`hiveMind team.setup.full`)

```
┌─────────────────────────────────────────┐
│ Pane 0.0 - AGENT TEACHER                │
├───────────────────────┬─────────────────┤
│ Pane 0.2 - EXPERT     │ Pane 0.3 - TEST │
│ (expert)         │ (tester)   │
├───────────────────────┴─────────────────┤
│ Pane 0.1 - SCRUMMASTER                  │
└─────────────────────────────────────────┘
```

### Key hiveMind Commands

```bash
# Team management (no ./ prefix — OOSH is on PATH)
hiveMind role.list                    # List available roles
hiveMind agent.bootstrap <role>       # Bootstrap new agent
hiveMind team.setup.full              # Create full 4-agent team
hiveMind team.status                  # Check all agents

# Delegation
otmux send projectTeam:0.1 "prompt" Enter

# Capture output
otmux pane.capture projectTeam:0.1 20
```

## Multi-Agent Coordination

### Universal Rules (ALL agents)

| Rule | Description |
|------|-------------|
| **Named sessions** | Every tmux session has a name matching the project |
| **File-based communication** | Write details to `session/tasks/`, send short references only |
| **STOP-SAVE-COMPACT** | At 20% context: stop work, save state, then `/compact` |
| **Never assume** | Always measure state before acting on it |
| **Boot file recovery** | After compact: read `session/boot/<role>.md` ONLY |
| **OOSH wrappers only** | Use `otmux`/`hiveMind`, never raw tmux commands |

### Context Preservation Protocol

At 20% context remaining:
1. **STOP** all current work immediately
2. **SAVE** state to `session/agents/<role>.context.md`
3. **UPDATE** `session/learnings/<role>.learnings.md` with any new patterns
4. **COMMIT**: `git add -f session/ && git commit -m "Pre-compact: <role> state"`
5. **RUN** `/compact`

The pre-compact hook (`.claude/hooks/pre-compress.sh`) auto-detects your role, commits session files, generates a boot file, and sends a resume prompt 15 seconds later.

### Peer Monitoring Commands

```bash
# Read peer's pane content (last N lines)
otmux pane.capture <session>:<pane> <lines>

# Send short alert to peer
otmux send <session>:<pane> "message" Enter

# Check team status
hiveMind team.status
```

### File Conventions (Convention Over Configuration)

All paths are derived from the role name — no hardcoded mappings:

| File | Path |
|------|------|
| Role definition | `.claude/agents/<role>/SKILL.md` |
| Context snapshot | `session/agents/<role>.context.md` |
| Learnings (identity) | `session/learnings/<role>.learnings.md` |
| Boot file (auto-generated) | `session/boot/<role>.md` |
| Task queue | `session/tasks/` |
| Role registry | `/tmp/hivemind.roles` |
