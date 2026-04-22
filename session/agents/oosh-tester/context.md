# OOSH Tester Agent — Session Context

**Updated**: 2026-04-22
**Role**: oosh-tester
**Pane**: ooshTeam:0.2
**Test Shell**: ooshTeam:0.4 (oosh-tester-shell)
**Expert**: ooshTeam:0.1 (oosh-expert)
**Expert Shell**: ooshTeam:0.3 (oosh-expert-shell)
**Machine**: MacStudio.native

## Recovery Steps
1. Read this file
2. Read `.claude/agents/oosh-tester/SKILL.md`
3. Read `session/agents/oosh-tester/learnings.md`
4. Check `session/tasks/` for pending work
5. Check with PO (TRONinterface:0.0) for priorities

## Current Task: UUID Tracking Refactor Tests

Expert commits: 6ddeb14, cbcea82, 9b90851 on test/macos.latest

### New methods to test:
- `claudeCode session.discover` — non-invasive UUID+state+title discovery
- `claudeCode session.current` — print UUID for pane
- `claudeCode session.state` — print state: live/stable/stale/broken/unknown
- `hiveMind registry.refresh` — rewrite using session.discover, writes forks.env
- `hiveMind` bare (no args) — shows persisted teams when tmux empty

### Key Rules
- NEVER use raw tmux — always otmux wrappers
- NEVER filter output (no 2>/dev/null, | head, | tail, | grep)
- Use oosh-tester-shell (ooshTeam:0.4) for running commands
- Tests must be self-contained
- TDD: write tests BEFORE when possible
