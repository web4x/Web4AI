# Specification: Fix 2 Issues in hiveMind agent.context.status

**Author**: oosh-expert (specification)
**Implement**: hiveMind-expert @ hiveMindTeam:0.0
**Test**: hiveMind-tester @ hiveMindTeam:0.1
**Report to**: agent-trainer
**File**: `/Users/donges/oosh/hiveMind`

---

## Issue 1: SELF Detection Blocks External Callers

### Current behavior (BROKEN)

Lines 1532-1538 (`agent.context.status`) and 1641-1662 (`team.context.status`):

```bash
self_pane=$(tmux display-message -p "#{session_name}:#{window_index}.#{pane_index}" 2>/dev/null)
if [ "$target" = "$self_pane" ]; then
    printf ... "SELF"
    return 0  # or continue
fi
```

This detects SELF by comparing the TARGET pane to the CALLING pane. The 42 principle
is correct: you cannot `/context` yourself. But the current check prevents ANY caller
from querying their own pane — even when called from ooshDebug, a cron job, or another
session entirely.

### Root cause

`tmux display-message -p` returns the pane of the **calling** shell, not the agent.
When PO runs `hiveMind agent.context.status product-owner` from pane 0.4:
- `self_pane` = `projectTeam:0.4` (PO's own pane)
- `target` = `projectTeam:0.4` (PO's registered pane)
- Match → SELF → skip. **Correct per 42 principle.**

When running the SAME command from ooshDebug or another session:
- `self_pane` = whatever the ooshDebug pane is (e.g., `ooshDebug:0.0`)
- `target` = `projectTeam:0.4`
- No match → proceeds normally. **Already works from different sessions.**

### Investigation needed

Before changing code, **verify from ooshDebug**:
```bash
# From ooshDebug shell:
tmux display-message -p "#{session_name}:#{window_index}.#{pane_index}"
# Expected: ooshDebug:0.0 (NOT projectTeam:0.4)

hiveMind agent.context.status product-owner
# Expected: should work (no SELF) since ooshDebug != projectTeam:0.4
```

If this already works from ooshDebug, the issue is only when PO runs it from
their own pane. That IS the 42 principle — correct behavior. Document and close.

If ooshDebug somehow reports as projectTeam:0.4 (shouldn't happen), then fix needed.

### Fix (only if ooshDebug is broken)

Change SELF to show a more helpful message:
```bash
if [ "$target" = "$self_pane" ]; then
    printf "%-20s %-8s %-6s %-12s %s\n" "$role" "$pane_short" "—" "—" "SELF (run from another pane)"
    continue
fi
```

No code logic change needed. The 42 principle is architecturally correct.

---

## Issue 2: roles.complete Misses Unregistered Panes

### Current behavior (BROKEN)

Line 278-288 (`private.hiveMind.roles.complete`):

```bash
private.hiveMind.roles.complete() {
  local session
  session=$(private.hiveMind.active.team 2>/dev/null)
  [ -f "$HIVEMIND_REGISTRY" ] || return 0
  if [ -n "$session" ]; then
    grep "^${session}:" "$HIVEMIND_REGISTRY" 2>/dev/null | cut -d'|' -f2
  else
    cut -d'|' -f2 "$HIVEMIND_REGISTRY" 2>/dev/null
  fi | sort -u
}
```

Only reads from registry file. Panes added after registration (e.g., `otmux pane.split`)
don't appear in tab completion.

### Current registry issues

```
# Correct entries:
projectTeam:0.0|orchestrator
projectTeam:0.1|oosh-expert
...

# WRONG — raw pane IDs instead of session:window.pane format:
%103|ossh-expert
%104|ossh-tester

# MISSING — not registered at all:
projectTeam:1.5|ossh-po
```

### Fix: Hybrid approach (option 3 from task)

**Step 1**: Fix `roles.complete` to augment registry with pane titles.

```bash
private.hiveMind.roles.complete() {
  local session
  session=$(private.hiveMind.active.team 2>/dev/null)
  
  # Source 1: Registry (canonical)
  if [ -f "$HIVEMIND_REGISTRY" ] && [ -n "$session" ]; then
    grep "^${session}:" "$HIVEMIND_REGISTRY" 2>/dev/null | cut -d'|' -f2
  elif [ -f "$HIVEMIND_REGISTRY" ]; then
    cut -d'|' -f2 "$HIVEMIND_REGISTRY" 2>/dev/null
  fi
  
  # Source 2: Pane titles (for unregistered panes)
  if [ -n "$session" ]; then
    local pane title
    while IFS= read -r pane; do
      title=$(tmux display-message -t "$pane" -p '#{pane_title}' 2>/dev/null)
      # Only add if not already in registry and title looks like a role name
      if [ -n "$title" ] && ! grep -q "|${title}$" "$HIVEMIND_REGISTRY" 2>/dev/null; then
        echo "$title"
      fi
    done < <(tmux list-panes -s -t "$session" -F "#{session_name}:#{window_index}.#{pane_index}" 2>/dev/null)
  fi | sort -u
}
```

**Step 2**: Fix raw pane ID entries in registry.

Add a cleanup method or fix at registration time. The `%103` format comes from
`$TMUX_PANE` (tmux internal ID) instead of `session:window.pane` format.

Check where `%103|ossh-expert` was written. The registration code should use:
```bash
tmux display-message -t "$TMUX_PANE" -p '#{session_name}:#{window_index}.#{pane_index}'
```
...instead of raw `$TMUX_PANE`.

**Step 3**: Add `hiveMind registry.fix` method to clean up bad entries:

```bash
hiveMind.registry.fix() # # clean up invalid entries in roles registry
{
  local registry="$HIVEMIND_REGISTRY"
  [ -f "$registry" ] || return 1
  
  local tmpfile="${registry}.tmp"
  local fixed=0
  
  while IFS='|' read -r pane role; do
    # Skip entries with raw pane IDs (%NNN format)
    if [[ "$pane" =~ ^% ]]; then
      # Try to resolve to session:window.pane
      local resolved
      resolved=$(tmux display-message -t "$pane" -p '#{session_name}:#{window_index}.#{pane_index}' 2>/dev/null)
      if [ -n "$resolved" ]; then
        echo "${resolved}|${role}" >> "$tmpfile"
        fixed=$((fixed + 1))
      fi
      # If pane no longer exists, drop the entry
      continue
    fi
    echo "${pane}|${role}" >> "$tmpfile"
  done < "$registry"
  
  mv "$tmpfile" "$registry"
  console.log "Fixed $fixed entries"
}
```

### Completion function naming

New method needs completion per OOSH standard:
```bash
hiveMind.registry.fix.completion() { :; }
```

---

## Test Cases

### Issue 1 tests:
1. From ooshDebug: `hiveMind agent.context.status product-owner` — should NOT show SELF
2. From pane 0.4: `hiveMind agent.context.status product-owner` — should show SELF (42 principle)
3. `hiveMind team.context.status` from ooshDebug — no SELF for any agent

### Issue 2 tests:
1. `hiveMind roles.complete` — should include ossh-po (pane 1.5)
2. After `hiveMind registry.fix` — no `%NNN` entries remain
3. Tab completion for `hiveMind send <tab>` includes all agents

---

## OOSH Standards Checklist
- [ ] All parameter names camelCase (no dashes, no underscores)
- [ ] Doc comments on every method: `# <param> # description`
- [ ] Completion function for every completable parameter
- [ ] Object.verb naming pattern
