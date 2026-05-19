# claudeCode-tester Agent Context

## Identity
- **Role**: claudeCode-tester@opus
- **Host**: MacStudio.fritz.box
- **Pane**: claudeCodeTeam:0.1
- **Session ID**: a79b35f1-2d40-4be0-bdfc-b6b3ceb60256
- **Expert pane**: claudeCodeTeam:0.0

## Current State (2026-03-11)
- Forked from backup-tester session (backup work complete: 38/38 tests)
- Read SKILL.md, claudeCode script (public methods), existing test/test.claudeCode
- Ran existing tests: 70 passes, 50 failures
- Have NOT started implementing yet — context save triggered first

## Mission (from Tron)
Make claudeCode simple, reusable, consistent, DRY, following ALL OOSH architecture guidelines.
Write meaningful behavioral ground-truth tests. Work with expert to fix issues found.

## Test Analysis — Current Failures (50)
### Category 1: Function existence tests T2-T9 (8 fails)
- Tests use `bash -c 'source this; source claudeCode; type -t ...'` — sourcing in subshell broken
- Fix: rewrite to call methods directly via `claudeCode method` (OOSH executable pattern)

### Category 2: Registry ORPHAN (16 fails)
- Stale roles in hivemind.roles.env for dead panes (bash-shell, test-agent-*, etc.)
- Not claudeCode's job to fix — but test reveals registry hygiene issue

### Category 3: Phantom UUIDs (22 fails)
- hivemind.sessions.env has UUIDs not in sessions-index.json
- Stale entries never cleaned up

### Category 4: Staleness/Duplicates (4 fails)
- Method 0 vs Method 1 UUID conflicts, duplicate UUIDs across panes

## claudeCode Public Methods
sessions, list, list.named, list.json, join, join.byID, join.byName, join.byPane,
fork, continue, c, new, print, p, dangerously, yolo, verbose, model, model.list,
model.set, model.get, opus, sonnet, haiku, chat, help, version, v, config, doctor,
process.find, session.save, session.recover, session.name, session.id,
context.check, context.read, context.jsonl, context.self, context.velocity.*,
agent.start, agent.bootstrap

## NEXT STEPS after boot
1. Read SKILL.md + this context
2. Self-awareness: `otmux pane.get.target`, `hostname`, `claudeCode session.id claudeCodeTeam:0.1`
3. Fix T2-T9: rewrite function existence tests to use OOSH executable pattern
4. Write NEW behavioral ground-truth tests for core methods
5. Coordinate with expert (claudeCodeTeam:0.0) for fixes
6. Goal: test WHAT methods DO, not that functions exist
