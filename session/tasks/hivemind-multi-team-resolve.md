# Task: hiveMind multi-team resolve — kill "active team" bottleneck

**Priority**: HIGH
**Assigned**: oosh-expert
**Date**: 2026-04-22

## Problem

With 3+ teams running (TRONinterface, ooshTeam, web4team), every hiveMind command that resolves an agent name only searches the "active team". This forces constant `hiveMind team.switch` before every cross-team operation. That's CMM1.

### Bugs found

1. `hiveMind agent.monitor oosh-tester` → "Cannot resolve in TRONinterface" (wrong team)
2. `hiveMind agent.monitor oosh-tester ooshTeam 15` → same error (no session param on agent.monitor)
3. After `team.switch ooshTeam` → still "Cannot resolve" (registry empty on MacStudio — agents are remote)
4. `hiveMind resolve` hardcoded to search ONE active team only

### The real issue

"Active team" is a single-team concept. When you have 3 teams, ALL are active. The PO should be able to say `hiveMind agent.monitor oosh-expert` and the system finds it in ooshTeam without switching. Or `hiveMind send.message web4-architect "hello"` and it finds it in web4team.

## Design

### 1. `hiveMind resolve` — search ALL teams

Current: searches `active.team` only, fails if agent not there.

Fix: search all registered teams. If agent name is unique across teams, return it. If ambiguous (same name in multiple teams), require `<name> <session>` to disambiguate.

```bash
hiveMind.resolve() {
  local name="$1"
  local session="$2"  # optional — disambiguate
  
  if [ -n "$session" ]; then
    # Explicit session — search only there
    private.hiveMind.registry.find "$name" "$session"
    return
  fi
  
  # Search ALL registered teams
  local matches=""
  while IFS='|' read -r team desc; do
    local match=$(private.hiveMind.registry.find "$name" "$team")
    [ -n "$match" ] && matches="${matches}${match}|${team}\n"
  done < "$HIVEMIND_TEAMS"
  
  local count=$(echo -e "$matches" | grep -c '|')
  if [ "$count" -eq 1 ]; then
    echo -e "$matches" | head -1 | cut -d'|' -f1
  elif [ "$count" -gt 1 ]; then
    error.log "Ambiguous: '$name' found in multiple teams. Specify session."
    echo -e "$matches"
    return 1
  else
    error.log "No agent '$name' in any registered team"
    return 1
  fi
}
```

### 2. Add `<?session>` to ALL agent commands

These methods call `resolve` but don't pass through a session param:

- `hiveMind agent.monitor <name> <?lines>` → `<name> <?session> <?lines>`
- `hiveMind send.message <name> <message>` → already has implicit session, needs to pass to resolve
- `hiveMind send <name> <text>` → same
- `hiveMind agent.unblock <name>` → same
- `hiveMind delegate <name> <desc>` → same

Once `resolve` searches all teams, most of these just work without adding `<?session>`. The session param becomes optional disambiguation only.

### 3. Completion for `<?session>`

Add `hiveMind.resolve.completion.session()` that lists all registered teams. Already exists but isn't wired to the agent commands.

## Acceptance Criteria

- [ ] `hiveMind resolve oosh-expert` finds it in ooshTeam without team.switch
- [ ] `hiveMind resolve web4-architect` finds it in web4team
- [ ] `hiveMind resolve product-owner` finds it in TRONinterface
- [ ] `hiveMind agent.monitor oosh-tester 10` works from any active team
- [ ] `hiveMind send.message web4-expert "hello"` works cross-team
- [ ] Ambiguous names (if any) give clear error with team list
- [ ] `team.switch` still works but is no longer REQUIRED for cross-team ops
- [ ] All existing tests pass (resolve behavior is a superset)

## Do NOT change

- `team.switch` / `team.active` — keep for default context (e.g. `team.status` with no args)
- `team.list` — unchanged
- The concept of a default team for commands that show overviews
