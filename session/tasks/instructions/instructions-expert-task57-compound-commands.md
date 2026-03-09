# Task 57: Fix compound commands triggering permission prompts

**Priority**: Medium
**Source**: CMM4 Ch7-8 — compound commands like `sleep && hiveMind && stat` don't match permission patterns

## Problem

Claude Code's permission system matches commands against patterns in `.claude/settings.json`:
```json
"Bash(hiveMind *)", "Bash(sleep *)", "Bash(stat *)"
```

When agents use compound commands:
```bash
sleep 90 && hiveMind sweep cursorOrchestrator && stat -f '%Sm' file
```

The permission system sees ONE command (the entire compound string). It doesn't match any individual pattern. Result: permission prompt every time. Agents get stuck 2-4 times per minute.

## Root Cause

Agents construct inline compound commands instead of calling single OOSH methods. The fix is OOSH-idiomatic: **wrap compound operations into OOSH methods**.

## Required Fix

### 1. Add `hiveMind.sweep.cycle` method

In `components/OOSH/dev.claude/hiveMind`, add a method that combines the common sweep+unblock pattern into one callable command:

```bash
hiveMind.sweep.cycle() # <?session> <?interval:30> # run one sweep+unblock cycle with optional sleep
{
    local session="${1:-$(tmux display-message -p '#{session_name}' 2>/dev/null)}"
    local interval="${2:-0}"

    [ "$interval" -gt 0 ] 2>/dev/null && sleep "$interval"

    hiveMind.sweep "$session"
    hiveMind.unblock all "$session"
}
hiveMind.sweep.cycle.completion() { :; }
```

This lets agents call `hiveMind sweep.cycle cursorOrchestrator 30` instead of `sleep 30 && hiveMind sweep cursorOrchestrator && hiveMind unblock all cursorOrchestrator`.

### 2. Add `hiveMind.monitor.cycle` method

A monitoring cycle that does capture + detect + unblock for all panes:

```bash
hiveMind.monitor.cycle() # <?session> # capture, detect, and unblock all panes in one call
{
    local session="${1:-$(tmux display-message -p '#{session_name}' 2>/dev/null)}"

    # Get all panes
    local panes
    panes=$(tmux list-panes -t "${session}:0" -F "#{pane_index}" 2>/dev/null)
    [ -z "$panes" ] && { error.log "No panes found for $session"; return 1; }

    local pane status
    for pane in $panes; do
        local result
        result=$(private.hiveMind.sweep.detect "${session}:0.${pane}")
        status="${result%%|*}"
        case "$status" in
            active|idle|unknown) ;; # skip
            *) private.hiveMind.unblock.pane "${session}:0.${pane}" "pane-${pane}" ;;
        esac
    done
}
hiveMind.monitor.cycle.completion() { :; }
```

### 3. Add `scrumMaster.cycle` method (if scrumMaster script exists)

Check if `components/OOSH/dev.claude/scrumMaster` exists. If so, add a cycle method that combines measure + sweep into one call. If not, skip this.

### 4. Update SKILL.md files

Add a rule to `.claude/agents/scrum-master/SKILL.md` and `.claude/agents/oosh-tester/SKILL.md`:

```markdown
## No Compound Commands (MANDATORY)

**NEVER use compound bash commands** (`&&`, `||`, `;` chains). Each command must be a single OOSH method call.

| Instead of | Use |
|-----------|-----|
| `sleep 30 && hiveMind sweep session` | `hiveMind sweep.cycle session 30` |
| `hiveMind sweep session && hiveMind unblock all session` | `hiveMind monitor.cycle session` |

Compound commands don't match permission patterns and trigger prompts every time.
```

## Testing

From `components/OOSH/dev.claude/`:
```bash
# 1. Syntax check
bash -n hiveMind

# 2. Verify new methods exist
grep 'hiveMind.sweep.cycle()' hiveMind
grep 'hiveMind.monitor.cycle()' hiveMind

# 3. Test sweep.cycle
./hiveMind sweep.cycle cursorOrchestrator

# 4. Test monitor.cycle
./hiveMind monitor.cycle cursorOrchestrator

# 5. Verify completion stubs
grep 'sweep.cycle.completion' hiveMind
grep 'monitor.cycle.completion' hiveMind
```

## When Done
Commit: "Task 57: Add sweep.cycle + monitor.cycle — eliminate compound command prompts"
Then say: "Task 57 committed"
