# Task #48: Fix Pre-Compact Hook Cross-Session Agent Identity

**Priority**: HIGH — fractal blocker
**Assigned to**: oosh-expert (implement) + oosh-tester (verify)
**From**: product-owner

## Problem

The pre-compact hook (`.claude/hooks/pre-compress.sh`) identifies agents by looking up their pane in `$HOME/config/hivemind.roles.env`. But only `projectTeam:*` panes are registered. Agents in other sessions (e.g., `hiveMindTeam:0.0`) get role "unknown".

**Symptoms (confirmed):**
- `session/agents/unknown/boot.md` exists — generated for `hiveMindTeam:0.0`
- Boot says "You are: unknown" — identity destroyed
- Empty SKILL.md and Context paths — agent cannot recover
- "Wait for assignment" — proactive agent turned passive
- Git commits say "unknown pre-compact" — no audit trail

## Current Roles File (`$HOME/config/hivemind.roles.env`)

```
projectTeam:0.0|orchestrator
projectTeam:0.1|oosh-expert
projectTeam:0.2|oosh-tester
projectTeam:0.3|scrum-master
projectTeam:0.4|product-owner
projectTeam:0.5|agent-trainer
...
```

Missing: `hiveMindTeam:0.0|hiveMind-expert`, `hiveMindTeam:0.1|hiveMind-tester`, and any future session agents.

## Solution: Two-Part Fix

### Part 1: Hook Fallback (pre-compress.sh)

When role is NOT found in roles file, add fallback detection:

1. **Scan existing boot.md files** — if `session/agents/*/boot.md` contains this exact pane address, use that role name
2. **Check tmux pane title** — `tmux display-message -t $PANE -p '#{pane_title}'` may contain role info
3. If all fallbacks fail, keep "unknown" but improve the generic template (see Part 3)

### Part 2: Registration on Boot

When agents boot in ANY session, their role must be registered in the roles file. Options:
- A) The boot.md auto-resume message could trigger registration
- B) `hiveMind agent.bootstrap` should register regardless of session
- C) The trainer's boot process for non-projectTeam agents must call `hiveMind role.register`

**Recommended**: Option A — add a registration step to the auto-resume section of the hook itself. When the hook runs and DOES know the role (from boot.md fallback), write it to the roles file for next time.

### Part 3: Better Generic Template

If role is still "unknown", the generic template should NOT say "Wait for assignment" (this kills all agents). Instead:
```
## You are: unknown (identity detection failed)
## Immediate actions:
1. Check your pane title or ask a peer for your role
2. Check session/agents/ for directories matching your session
3. Announce to team that identity detection needs fixing
```

## Files to Modify

1. `.claude/hooks/pre-compress.sh` — add fallback detection (lines 16-18 currently)
2. Possibly `hiveMind` — ensure `role.register` works for any session

## Test Cases (for oosh-tester)

1. **projectTeam agent compact** — still works (regression test)
2. **hiveMindTeam agent with boot.md** — detects role from boot.md content
3. **Agent with no boot.md and no roles entry** — gets improved "unknown" template
4. **Registration persistence** — after fallback detection, role is written to roles file for next compact
5. **Multiple sessions** — roles file correctly holds entries from different sessions

## Key Constraint

- Do NOT break existing projectTeam identity detection
- Boot.md "Written by" check must still work
- Protected pane (0.4) logic must be preserved

## Why This Is HIGH Priority

Tron's exact words: "you totally underestimate the impact of unknown....this is high base requirement for fractal"

Without this fix, the script expert teams scaling pattern (KB #23) is CMM1 at its foundation. Every non-projectTeam agent loses identity on compact = the entire scaling pattern is broken.
