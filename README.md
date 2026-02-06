# Web4AI
The Web4 Multiagent Workplace

A workspace for orchestrating AI agent teams using tmux, OOSH, and the WODA information processing pattern.

## Core Concepts

| Concept | Purpose |
|---------|---------|
| **WODA** | What→Overview→Details→Actions: processing petabytes with short context windows |
| **OOSH** | Object-Oriented Shell: death to flags, Tab = documentation |
| **CMM** | Capability Maturity Model: L1 (ad-hoc) → L5 (optimizing) |
| **Peer Monitoring** | Agents can't read their own TUI; peers read each other |

## Workspace Structure

```
.claude/agents/       # Agent role definitions (SKILL.md files)
components/OOSH/      # OOSH framework variants (dev, prod, platform-specific)
session/              # Active session state, tasks, context files
session/woda/         # WODA session story and chapters
```

## Quick Start

```bash
# OOSH commands (no flags, Tab discovers everything)
./oo new myscript              # Create new script
./config list                  # Show configuration
./log level 5                  # Set debug verbosity

# Multi-agent via tmux
otmux pane.split               # Split pane
hiveMind team.status           # Check all agents
claudeCode context.read <pane> # Measure peer's context health
```

## Stories

| Story | Description | Chapters |
|-------|-------------|----------|
| [WODA Session Story](session/woda/session-story.md) | Learning tmux, OOSH, and multi-agent orchestration | 39 chapters |
| [CMM4 Journey](session/cmm4/cmm4-story.md) | Building a CMM4 context-aware Claude team | 15 chapters |

## Key Files

- `CLAUDE.md` — Agent workflow, tmux setup, per-prompt checklist
- `components/OOSH/dev.claude/docs/` — OOSH architecture docs

## Philosophy

> Before you assume, **test**. Before you wrap, **try without the wrapper**. Before you declare, **verify**.

Neither agent alone can self-care. Together, both can. That's interdependence by design.
