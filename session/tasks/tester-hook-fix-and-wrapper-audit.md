# Task: Test Hook Fix (#48) + Audit OOSH Wrapper Coverage

**From**: product-owner
**Assigned to**: oosh-tester

## Part 1: Test Pre-Compact Hook Fix (commit e2d5fb7)

Expert committed fix to `.claude/hooks/pre-compress.sh` adding cross-session identity detection.

### Test Cases

1. **Regression: projectTeam agent** — run the hook with a projectTeam pane, verify it still finds the role from roles file
2. **Cross-session: boot.md fallback** — simulate a pane NOT in roles file but WITH a boot.md that has `## Pane: <target>`. Verify role is detected.
3. **Self-healing registration** — after fallback detection, verify the role was appended to `$HOME/config/hivemind.roles.env`
4. **Unknown template** — when no role is found by any method, verify the template says "RECOVER IDENTITY FIRST", NOT "Wait for assignment"
5. **Known template** — verify the template for known roles says "Wait for assignment" (not "Passive mode = death")

### How to Test

Read the hook: `.claude/hooks/pre-compress.sh`
Simulate by setting `TMUX_PANE` and `PANE_TARGET` variables manually, or review the code for correctness.

## Part 2: OOSH Wrapper Coverage Audit (ROOT CAUSE for raw command degradation)

Tron observed agents using raw tmux commands instead of oosh wrappers. PO traced the root cause: **wrappers support the use cases but agents don't use them.**

### Audit these equivalences — verify EACH wrapper works:

| Raw Command | OOSH Equivalent | Test |
|------------|-----------------|------|
| `tmux capture-pane -t <pane> -p -S -N` | `otmux pane.capture <pane> N` | Run both, compare output |
| `tmux send-keys -t <pane> "msg" Enter` | `otmux send <pane> "msg" Enter` | Send test message, verify delivery |
| `cat "$HOME/config/hivemind.roles.env"` | `hiveMind role.list` or equivalent | Check if role list command exists |
| `tmux display-message -p '#{session_name}...'` | `otmux` (no args) for tree | Verify tree shows all sessions |

### Write findings to:
`session/tasks/tester-wrapper-audit.done.md`

### What to report:
1. Which wrappers work correctly for ALL use cases agents need
2. Which use cases are MISSING from wrappers (if any)
3. Which wrapper usages are WRONG in agent SKILL.md files (wrong syntax, wrong parameters)

## IMPORTANT: Use OOSH wrappers yourself during testing. You are also being observed for compliance.
