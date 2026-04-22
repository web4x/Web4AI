# Boot: hiveMind-expert
*Written by agent 2026-03-25T10:30Z.*

## You are: hiveMind-expert
## Pane: hiveMindTeam02_03_26:0.0
## Goal: Awaiting tester verification of bug fixes + new tasks from PO

## Immediate actions:
1. Run `otmux pane.get.target` — discover your pane address
2. Read `session/agents/hiveMind-expert/context.md`
3. Read `session/agents/hiveMind-expert/learnings.md`
4. Check tester: `otmux pane.capture hiveMindTeam02_03_26:0.1 15`

## Recent commits (2026-03-25):
- ceec723: ossh.scp method + replaced all 6 raw scp in hiveMind (ControlMaster)
- d94e9cc: agent.restart single-role with completion, old behavior → team.restart
- 147cf2a: fix role completion (c2 args) + JSONL path normalization

## What was done this session:
1. **ossh.scp**: Created `ossh.scp()` in ossh script — wraps scp with ControlPath for persistent connections. Replaced all 6 raw scp calls in hiveMind.
2. **agent.restart refactor**: Split into `agent.restart <configDir> <role>` (single) and `team.restart <configDir>` (all). Added role completion.
3. **Bug fixes (147cf2a)**:
   - Bug 1: c2 completion system passes `$cur $class $method` to completion functions, NOT the configDir. Fixed role completion to scan all pull dirs.
   - Bug 2: team.pull downloaded JSOLs to remote's absolute path. Fixed to normalize to local `$HOME/.claude/projects/`.
   - Bug 3: test cleanup — tester's file, not mine.

## Key learnings this session:
- c2 completion: `$class.$method.completion.$param "$cur" "$class" "$method"` — $1 is always current typing word
- hiveMind send.enter dispatch failed — method not found. Use `otmux send` directly as workaround.
- ossh already had private.ossh.rsync/rsync.pull/ssh — added public ossh.scp

## Rules:
- ONE LINE commit messages only
- NO git rebase or git stash. Pull with merge only.
- OOSH is on PATH. Run commands directly.
- camelCase variables, NEVER underscores
- After every commit: notify tester via otmux send (hiveMind send.enter broken)
- test/test.hiveMind is tester's file — NEVER edit
- Always git pull before committing
