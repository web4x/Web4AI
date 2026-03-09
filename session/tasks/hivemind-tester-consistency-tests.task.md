# Task: Write hiveMind Identity Consistency Tests

**From**: oosh-tester (baseTeam:0.2) — Lead Tester
**To**: hiveMind-tester (hiveMindTeam:0.1)
**Date**: 2026-02-27
**Priority**: HIGH
**Report results to**: oosh-tester (baseTeam:0.2) — I review all test output

---

## Your New Specialization

You are now the **hiveMind consistency tester**. Your job: ensure all hiveMind identity methods produce output that agrees with each other AND with reality.

## Background: Read These First

1. `session/tasks/expert-fix-identity-chain.task.md` — the 9 bugs I found
2. `session/agents/oosh-tester/learnings.md` — my testing patterns (especially live behavioral testing)

## The 4-Layer Identity Chain

Every agent has identity stored in 4 places. They MUST agree.

```
Layer 1: Pane → Role       ~/config/hivemind.roles.env     (registry)
Layer 2: Role → UUID       ~/config/hivemind.sessions.env  (sessions file)
Layer 3: UUID → Name       ~/.claude/projects/*/sessions-index.json
Layer 4: PID → UUID        ps -p <pid> -o args=            (--resume flag)
```

## Commands That Must Be Consistent

These all describe agent identity. Cross-compare their output:

| Command | Returns |
|---------|---------|
| `otmux` (no params) | tree with pane titles |
| `otmux tree.detailed` | tree + session names + UUIDs |
| `otmux pane.list <session>` | pane addresses + titles |
| `hiveMind team.context.status <session>` | agent names + context % |
| `hiveMind team.status <session>` | agent states per pane |
| `cat ~/config/hivemind.roles.env` | pane → role |
| `cat ~/config/hivemind.sessions.env` | role → UUID |
| `claudeCode session.id <pane>` | session UUID |
| `claudeCode process.find <pane>` | PID |

## Tests to Write

Add to `test/test.hiveMind`. Use this pattern:

```bash
source this
source test.suite
log.level $level

test.case $level "description" command args
expect.pass "message"   # or expect.fail
test.suite.save.results # ALWAYS at end
```

### Test Categories to Add

**T-CONSIST-1: team.context.status shows ALL panes**
- Run `otmux pane.list <session>` to get actual pane count
- Run `hiveMind team.context.status <session>` to get reported count
- Every pane in `pane.list` must appear in `team.context.status` output
- Currently FAILS: unregistered panes are invisible

**T-CONSIST-2: team.context.status uses OOSH wrappers**
- grep the `hiveMind` source file for raw `tmux` calls inside `team.context.status`
- Lines 1809, 1840, 1878-1882, 1888 have raw tmux — must be 0 after fix

**T-CONSIST-3: Registry role names are valid**
- Every role in `hivemind.roles.env` must be < 30 chars, no spaces, match a `.claude/agents/<role>/` directory
- Currently FAILS: 7 entries have boot prompt text as role names

**T-CONSIST-4: Registry entries match live panes**
- Every pane in the registry must still exist in tmux
- Every role in the registry should match the pane title OR the Claude session name

**T-CONSIST-5: otmux tree titles vs registry roles**
- Parse `otmux` output for each pane's title
- Compare against registry role for same pane
- They should agree (both set by `pane.identify`)

**T-CONSIST-6: team.status agrees with team.context.status**
- Both commands describe the same panes — agent names must match
- Pane count must match

**T-CONSIST-7: registry.refresh fixes stale entries**
- Run `hiveMind registry.refresh <session>`
- Verify garbage entries are removed
- Verify role names are valid after refresh

## How to Run

```bash
cd /Users/donges/oosh && bash test/test.hiveMind
```

## Reporting

When done, write results to `session/tasks/hivemind-tester-consistency-results.md` and send me:
```
otmux send baseTeam:0.2 "Read session/tasks/hivemind-tester-consistency-results.md" Enter
```

I will review your tests and give feedback.
