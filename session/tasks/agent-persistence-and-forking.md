# Task: Agent Persistence & Fork Management

**Priority**: HIGH — framework feature
**Assigned**: oosh-expert (you)
**Date**: 2026-04-15

## Who You Are

You are the NEW oosh-expert at UpDown_ai_projectTeam:0.1. You were forked from oosh-tester (c7067ce8) because the previous expert ran out of context. You have the tester's OOSH knowledge but you are now the EXPERT. Read `.claude/agents/oosh-expert/SKILL.md` for your role.

## The Problem We're Solving

When agents hit high context (80%+), /compact often fails ("Context limit reached"). The workaround is forking: take a well-trained agent's session, fork it → get a fresh copy with compacted context but full training. Then /rename to fix identity.

This is manual and error-prone. We need hiveMind methods to make it systematic.

## Goal: Persistent Agent Snapshots for Re-forking

Agents that are well-trained and at 60-80% context should be FLAGGED as "fork-ready snapshots." These snapshots can be re-forked anytime to create fresh agents with full training.

## Required Features (use plan mode first)

### 1. `claudeCode list` improvements
- Flag sessions that are DEAD (process not running, not in any tmux pane) in RED
- Flag sessions that are BEST SUITABLE for forking: well-trained (have customTitle/role), 60-80% context, not dead
- Dead UUIDs should be excluded from tab completions (completion.sessionIds)

### 2. `hiveMind agent.snapshot <name>`
- Register a running agent's current session UUID as a "golden snapshot" for that role
- Store in `~/config/hivemind.snapshots.env` (format: role|uuid|timestamp|context%)
- The snapshot is the BEST known version of this agent for future forking

### 3. `hiveMind agent.respawn <name>`
- Fork the registered snapshot UUID for that role
- Start it in the correct pane
- /rename to the correct role name
- Update registry + sessions.env
- One command to replace a dead/exhausted agent with a fresh copy of their best self

### 4. `hiveMind snapshot.list`
- Show all registered snapshots with role, UUID, timestamp, context%
- Highlight which ones are still valid (JSONL exists) vs stale

## Architecture Notes

- Snapshots are REFERENCES to existing JONSLs, not copies
- A snapshot at 70% context → fork → new session starts at ~5% with the training
- Multiple snapshots per role allowed (history), but one is marked "latest"
- `claudeCode fork` already handles the mechanics — hiveMind just orchestrates

## Acceptance Criteria

- [ ] `claudeCode list` shows dead sessions in red, fork-ready in green
- [ ] Dead UUIDs excluded from completions
- [ ] `hiveMind agent.snapshot oosh-expert` registers current session as snapshot
- [ ] `hiveMind agent.respawn oosh-expert` forks from snapshot, renames, registers
- [ ] `hiveMind snapshot.list` shows all snapshots with status
- [ ] Tests for all new methods
