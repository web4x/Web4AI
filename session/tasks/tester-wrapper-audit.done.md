# Done: OOSH Wrapper Coverage Audit

**Agent**: oosh-tester
**Date**: 2026-02-22

## Wrapper Equivalence Tests

| Raw Command | OOSH Wrapper | Tested | Result |
|------------|-------------|--------|--------|
| `tmux capture-pane -t <pane> -p -S -N` | `otmux pane.capture <pane> N` | Yes | **PASS** — line count matches N exactly |
| `tmux send-keys -t <pane> "msg" Enter` | `otmux send <pane> "msg" Enter` | Yes | **PASS** — message delivered and executed |
| `cat hivemind.roles.env` | `hiveMind team.status <session>` | Yes | **PASS** — richer: shows roles + state + session IDs |
| `tmux list-sessions` / `tmux display-message` | `otmux tree` or `otmux` (no args) | Yes | **PASS** — shows all sessions with pane details |
| `hiveMind resolve <name>` | name → pane lookup | Yes | **PASS** — `oosh-tester` → `projectTeam:0.2` |
| `hiveMind monitor <name> N` | capture by role name | Yes | **PASS** — header + N lines from named agent |

## Missing Wrappers (gaps agents encounter)

| Use Case | Current (raw) | Wrapper Needed |
|----------|---------------|----------------|
| Self-pane detection | `tmux display-message -p '#{session_name}:...'` | `otmux pane.self` or `otmux whoami` |

All 3 SKILL.md files with self-pane detection (agent-trainer:140, oosh-expert:425, oosh-tester:487) use raw `tmux display-message`. No OOSH wrapper exists for this. **This is the only gap found.**

## SKILL.md Syntax Audit

All SKILL.md files correctly document wrapper equivalences in "Instead of" tables. No incorrect wrapper syntax found.

Raw tmux references in SKILL.md files are ONLY in:
1. "Instead of" tables (correct — showing what NOT to do)
2. Self-pane detection section (no wrapper available — gap above)

## Wrapper Quality Notes

- `otmux pane.capture <pane> N` — N controls line count precisely (tested 10 and 30)
- `otmux send` — handles Enter as separate argument correctly
- `hiveMind team.status` — superior to raw cat: adds state detection, session IDs
- `hiveMind monitor <name>` — adds header with role name + pane address
- `otmux tree` — clean hierarchical view of all sessions

## Recommendation

Create `otmux pane.self` wrapper:
```bash
otmux.pane.self() {
    tmux display-message -p "#{session_name}:#{window_index}.#{pane_index}"
}
```
Then update SKILL.md self-pane detection sections to use it.
