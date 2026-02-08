# Task 4: Product Ownership Model & Self-Explaining Scripts

## Problem

The current SKILL.md files describe a single "script-product-owner" template. But each script needs its OWN dedicated product owner — a separate agent instance that owns that script's purpose, usability, and lifecycle. The overall Product Owner doesn't own scripts — it upholds OOSH first principles across all script POs.

## OOSH First Principles (for Product Owner to enforce)

1. **Easy to use**: Every script must be intuitive — no manual reading required
2. **Self-explaining**: `./script usage` shows formatted help; `./script [Tab]` completes all methods
3. **DRY**: No duplication — single source of truth
4. **Specialization**: Each agent/PO owns ONE thing deeply (keeps context small)
5. **Context management**: Small focused roles = agents that don't blow their context windows

## What Needs to Change

### 1. Update `product-owner/SKILL.md`
The overall Product Owner is NOT a script owner. It is the **first principles guardian**:
- Upholds OOSH principles across ALL script product owners
- Reviews that every script has: `usage()`, completion functions, method signatures
- Does NOT own any individual script
- Coaches script-specific POs on quality standards
- Enforces: `./script usage` must work, `./script [Tab]` must complete

### 2. Update `script-product-owner/SKILL.md`
Each script gets its OWN PO. The template must emphasize:
- You own ONE script — your entire context is about that script
- You ensure `./script usage` produces clear, formatted help
- You ensure `./script [Tab]` completes all methods and parameters
- You ensure every method has the signature pattern: `# <required> <?optional:default> # description`
- You ensure completion functions exist for every user-facing parameter
- You are instantiated per-script (e.g., "hiveMind PO", "claudeCode PO", "otmux PO")
- Your context file is `session/agents/po-<scriptname>.context.md`

### 3. Update `agent-teacher/SKILL.md`
Add section on how to instantiate a script PO:
- Copy template, replace {{SCRIPT_NAME}}
- Bootstrap agent in a pane
- Teach it its script
- PO reads its script, checks usability, reports issues

### 4. Update the agent roles table everywhere
- Root CLAUDE.md
- docs/wiki-index.md
- docs/hivemind.md
- session/agent.context.md

## Delegation

| Step | Agent | Task |
|------|-------|------|
| 1 | Expert (0.1) | Update product-owner/SKILL.md — first principles guardian role |
| 2 | Expert (0.1) | Update script-product-owner/SKILL.md — per-script ownership emphasis |
| 3 | Expert (0.1) | Update agent-teacher/SKILL.md — add PO instantiation protocol |
| 4 | Expert (0.1) | Update docs and CLAUDE.md agent tables |
| 5 | Tester (0.2) | Review all SKILL.md files for OOSH compliance and completeness |
| 6 | Tester (0.2) | Verify: pick a script (e.g., hiveMind), check it has usage() and Tab completion |
| — | ScrumMaster | Own task, monitor, approve, enforce roles |

## Acceptance Criteria

- product-owner SKILL.md describes first principles guardian (not script owner)
- script-product-owner SKILL.md describes per-script ownership with {{SCRIPT_NAME}} template
- agent-teacher SKILL.md has PO instantiation protocol
- All doc files updated with correct role descriptions
- Each agent updates their own context file when done
