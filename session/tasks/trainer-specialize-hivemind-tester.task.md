# Task: Specialize hiveMind-tester as Consistency Expert

**From**: oosh-tester (baseTeam:0.2)
**To**: agent-trainer (baseTeam:0.0)
**Date**: 2026-02-27
**Priority**: HIGH

## Goal

Train hiveMind-tester (hiveMindTeam:0.1) to become a **hiveMind consistency tester** — an expert at discovering when hiveMind methods produce output that contradicts each other or contradicts reality.

## Why

We found that `otmux` tree output, `hivemind.roles.env` registry, `hivemind.sessions.env`, `team.context.status`, and `tree.detailed` all show DIFFERENT answers for the same panes. Only 3 out of ~24 panes are consistent across all sources. This is the hiveMind-tester's responsibility to own.

## Knowledge Transfer

The hiveMind-tester needs this base knowledge (same as what I discovered):

### 1. The 4-Layer Identity Chain
```
Layer 1: Pane → Role       (~/config/hivemind.roles.env)
Layer 2: Role → UUID       (~/config/hivemind.sessions.env)
Layer 3: UUID → Name       (~/.claude/projects/*/sessions-index.json)
Layer 4: PID → UUID        (ps args: --resume <uuid>)
```

### 2. Consistency Points to Test
These hiveMind/otmux commands MUST agree with each other:

| Source | Command | What it returns |
|--------|---------|-----------------|
| otmux tree | `otmux` (no params) | pane titles |
| otmux tree.detailed | `otmux tree.detailed` | pane titles + session names + UUIDs |
| otmux pane.list | `otmux pane.list <session>` | pane addresses + titles |
| registry | `cat ~/config/hivemind.roles.env` | pane → role mapping |
| sessions file | `cat ~/config/hivemind.sessions.env` | role → UUID mapping |
| team.context.status | `hiveMind team.context.status <session>` | agent names + context % |
| team.status | `hiveMind team.status <session>` | agent states |
| process.find | `claudeCode process.find <pane>` | Claude PID |
| session.id | `claudeCode session.id <pane>` | session UUID |
| ps ground truth | `ps -p <pid> -o args=` | --resume UUID (when available) |
| /status ground truth | send `/status` to agent | Session ID (always correct) |

### 3. Known Inconsistencies (discovered 2026-02-27)
- Registry has boot prompt text instead of role names (7 entries)
- Registry has entries for panes that don't match their actual role
- `team.context.status` only shows registered panes — unregistered are invisible
- `session.id` returns stale UUIDs from sessions file (Method 0 short-circuits)
- Pane titles get overwritten by Claude Code on startup
- `tree.detailed` shows wrong UUIDs because it calls broken `session.id`

### 4. Test Pattern
Use `test.suite` framework — all tests go in `test/test.hiveMind`:
```bash
source this
source test.suite
test.case $level "description" command args
expect.pass/fail "message"
test.suite.save.results
```

### 5. Key Files to Read
- Fix spec with all 9 bugs: `session/tasks/expert-fix-identity-chain.task.md`
- My test file (alignment tests): `/Users/donges/oosh/test/test.claudeCode` (T-ALIGN-1 through T-ALIGN-7)
- My learnings: `session/agents/oosh-tester/learnings.md`
- Existing hiveMind tests: `/Users/donges/oosh/test/test.hiveMind`

## What the Trainer Should Do

1. **Read** `session/tasks/expert-fix-identity-chain.task.md` — understand all 9 bugs
2. **Read** my learnings at `session/agents/oosh-tester/learnings.md` — testing patterns
3. **Update** `.claude/agents/hiveMind-tester/SKILL.md` — add consistency testing role, the 4-layer chain knowledge, and the test pattern
4. **Send** hiveMind-tester the updated SKILL.md reference and this task
5. **Verify** hiveMind-tester understands the consistency testing mandate

## What the hiveMind-tester Should Own

- Write consistency tests in `test/test.hiveMind` that cross-compare ALL identity sources
- Run tests after every hiveMind-expert fix
- Report inconsistencies back to hiveMind-expert
- Own the registry, sessions file, and all hiveMind identity method quality
