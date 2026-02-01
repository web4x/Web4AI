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

Start with these files in `components/OOSH/dev.claude/`:

1. `CLAUDE.md` - Agent workflow, tmux setup, per-prompt checklist
2. `docs/oosh-architecture.md` - Complete technical reference
3. `docs/wiki-index.md` - Documentation index

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

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `OOSH_DIR` | Root oosh directory |
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
| `oosh-expert` | `.claude/agents/oosh-expert/` | Implementation & architecture |
| `oosh-tester` | `.claude/agents/oosh-tester/` | Testing & validation |
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
│ (oosh-expert)         │ (oosh-tester)   │
├───────────────────────┴─────────────────┤
│ Pane 0.1 - SCRUMMASTER                  │
└─────────────────────────────────────────┘
```

### Key hiveMind Commands

```bash
# Team management
./hiveMind role.list                    # List available roles
./hiveMind agent.bootstrap <role>       # Bootstrap new agent
./hiveMind team.setup.full              # Create full 4-agent team
./hiveMind team.status                  # Check all agents

# Delegation
otmux send cursorOrchestrator:0.1 "prompt" Enter

# Capture output
tmux capture-pane -t cursorOrchestrator:0.1 -p -S -20
```

### Before /compress

Always update `session/agent.context.md` with current goals, tasks, and status. A PreCompact hook will remind you.
