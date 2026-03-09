# Improvements #4 and #5: Auto-commit + Automate cycle

**Source**: claudeWoda scribe improvement checklist (session/cmm.improvement.md)
**PO authorized**

---

## Improvement #4: Auto-commit each cycle

**Problem**: Changes accumulate, risk losing progress if crash.
**Solution**: Each monitoring cycle, check `git status` and commit if changes.

### Implementation

Add a method to `hiveMind` (or `scrumMaster` if more appropriate):

```bash
hiveMind.auto.commit() # <?message> # auto-commit uncommitted changes if any exist
{
    local msg="${1:-Auto-commit: cycle checkpoint $(date '+%Y-%m-%d %H:%M')}"

    # Check for uncommitted changes (staged or unstaged tracked files)
    if ! git diff --quiet 2>/dev/null || ! git diff --cached --quiet 2>/dev/null; then
        git add -A
        git commit -m "$msg"
        git push 2>/dev/null &
        console.log "Auto-committed: $msg"
        return 0
    fi

    # Check for untracked session files
    local untracked
    untracked=$(git ls-files --others --exclude-standard -- session/ 2>/dev/null | head -5)
    if [ -n "$untracked" ]; then
        git add session/
        git commit -m "$msg"
        git push 2>/dev/null &
        console.log "Auto-committed session files: $msg"
        return 0
    fi

    console.log "Nothing to commit"
    return 0
}
hiveMind.auto.commit.completion() { :; }
```

### KPIs
- Zero uncommitted session changes older than 1 cycle
- All progress pushed to remote
- Recovery after crash loses max 5 min work

---

## Improvement #5: Automate cycle steps

**Problem**: Agents forget monitoring steps — memory-based checklists fail after /compact.
**Solution**: Encode the cycle steps in an OOSH method so the process runs the same every time.

### Implementation

Add a method that runs the full scribe/monitoring cycle as one command:

```bash
hiveMind.cycle.full() # <?session> # run full monitoring cycle: sweep + unblock + context check + auto-commit
{
    local session="${1:-$(tmux display-message -p '#{session_name}' 2>/dev/null)}"

    # Step 1: Sweep and unblock
    console.log "Cycle: sweep $session"
    hiveMind.sweep "$session" 2>/dev/null
    hiveMind.unblock all "$session" 2>/dev/null

    # Step 2: Check context for all panes
    console.log "Cycle: context check"
    local panes
    panes=$(tmux list-panes -t "${session}:0" -F "#{pane_index}" 2>/dev/null)
    for pane in $panes; do
        local ctx
        ctx=$(./claudeCode context.read "${session}:0.${pane}" 2>/dev/null)
        if [ -n "$ctx" ] && [ "$ctx" != "unknown" ]; then
            # Alert if below 25%
            local remaining
            remaining=$(echo "$ctx" | grep -oE '[0-9]+' | head -1)
            if [ -n "$remaining" ] && [ "$remaining" -lt 25 ] 2>/dev/null; then
                console.log "ALERT: ${session}:0.${pane} context at ${remaining}%"
            fi
        fi
    done

    # Step 3: Auto-commit if changes
    console.log "Cycle: auto-commit"
    hiveMind.auto.commit "Cycle checkpoint $(date '+%H:%M')" 2>/dev/null

    console.log "Cycle complete for $session"
}
hiveMind.cycle.full.completion() { :; }
```

### KPIs
- Cycle steps encoded in script, not human memory
- Zero forgotten steps after automation
- Process runs same whether agent is fresh or post-compact

---

## Testing

From `components/OOSH/dev.claude/`:
```bash
# 1. Syntax check
bash -n hiveMind

# 2. Test auto.commit (should say "Nothing to commit" if clean)
./hiveMind auto.commit

# 3. Test cycle.full
./hiveMind cycle.full cursorOrchestrator

# 4. Completion stubs
grep 'auto.commit.completion\|cycle.full.completion' hiveMind
```

## When Done
Commit: "Improvements #4-5: Auto-commit + automated cycle method"
Then say: "Improvements #4-5 committed"
