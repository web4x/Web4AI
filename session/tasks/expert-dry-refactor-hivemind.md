# Task: DRY Refactor — Extract reusable building blocks from hiveMind
**From**: hiveMind-tester
**To**: hiveMind-expert
**Date**: 2026-03-08
**Priority**: HIGH — hiveMind is 5160 lines with massive duplication

## Goal
Extract repeated patterns into small, composable, well-documented private methods with completions.
Every method must have: clear parameters, completion functions, and OOSH method comment documentation.

## DRY Violations Found

### 1. Pane enumeration format string (6 variants, 26 occurrences)
The exact same `tmux list-panes` call with varying format strings repeated everywhere:
```bash
# Pattern A: tty + address (3x — lines 1283, 1321, no title)
tmux list-panes -a -F "#{pane_tty} #{session_name}:#{window_index}.#{pane_index}" 2>/dev/null

# Pattern B: tty + address + title (3x — lines 1379, 1693, 1805)
tmux list-panes -a -F "#{pane_tty}|#{session_name}:#{window_index}.#{pane_index}|#{pane_title}" 2>/dev/null

# Pattern C: session-scoped with command (3x — lines 3033, 3962, 4639)
tmux list-panes -t "$session" -s -F "#{window_index}.#{pane_index}|#{pane_current_command}" 2>/dev/null

# Pattern D: just addresses (1x — line 1650)
tmux list-panes -a -F "#{session_name}:#{window_index}.#{pane_index}" 2>/dev/null

# Pattern E: pane count (3x — lines 797, 1499, 1942)
tmux list-panes -t "$session" -F "#{pane_id}" | wc -l | tr -d ' '
```

**Extract to**: `private.hiveMind.list.panes <scope> <format>`
- `scope`: `-a` (all), or session name
- `format`: `tty`, `tty+title`, `addr+cmd`, `addr`, `count`
- Returns: formatted pane lines on stdout

### 2. Registry/sessions file path resolution (12 occurrences)
The same fallback chain repeated in every method that touches config files:
```bash
# 5x for registry:
local reg="${HIVEMIND_REGISTRY:-${CONFIG_PATH:-$HOME/config}/hivemind.roles.env}"

# 5x for sessions (as "ses"):
local ses="${HIVEMIND_SESSIONS:-${CONFIG_PATH:-$HOME/config}/hivemind.sessions.env}"

# 2x for sessions (as "sess_file"):
local sess_file="${CONFIG_PATH:-$HOME/config}/hivemind.sessions.env"
```

**Extract to**: These are already set as globals (lines 32-33). The locals re-derive them because functions can't trust the global survived. Fix: ensure `$HIVEMIND_REGISTRY` and `$HIVEMIND_SESSIONS` are always set at script entry, then use them directly — no local re-derivation needed.

### 3. Registry grep patterns (inline lookups, 4+ variants)
```bash
# Get role for pane (2x — lines 207, 2601):
grep "^${target}|" "$HIVEMIND_REGISTRY" 2>/dev/null | head -1 | cut -d'|' -f2

# Find pane by name (2x — lines 225, 227):
grep "^${session}:" "$HIVEMIND_REGISTRY" 2>/dev/null | grep -i "$name" | head -1 | cut -d'|' -f1

# List roles in session (2x — lines 245, 390):
grep "^${session}:" "$HIVEMIND_REGISTRY" 2>/dev/null | cut -d'|' -f2

# Check if session has entries (2x — lines 3147, 3710):
grep -q "^${session}:" "$HIVEMIND_REGISTRY" 2>/dev/null
```

**Already have**: `private.hiveMind.registry.get` (line 207), `private.hiveMind.resolve` (line 225).
**Missing**: Inline greps at 2601, 390, 3147, 3710 should call the existing private methods.

### 4. Pane existence + creation pattern (teams.restore)
```bash
# Check window exists + create if needed (line 1479-1482)
# Split loop to reach target pane (line 1486-1492)
```
**Extract to**: `private.hiveMind.ensure.pane <session:window.pane>`
- Creates window if needed, splits until target pane index exists
- Reusable for teams.restore, team.setup, agent.bootstrap

### 5. Session default pattern (repeated everywhere)
```bash
local session="${1:-$(tmux display-message -p '#{session_name}' 2>/dev/null)}"
```
Found at: lines 297, 388, 693, 764, 796, 862, 3027, 3958, 4252, 4623 (10+ times).

**Extract to**: `private.hiveMind.current.session` — returns current session name or error.

### 6. "iterate panes, match PID to Claude process" loop
Lines 1283-1340, 1379-1420, 1693-1740, 1805-1850 — similar loops that:
1. List all panes with tty
2. Find process on tty via `ps`
3. Match against Claude or specific pattern
4. Extract UUID from args

**Extract to**: `private.hiveMind.pane.process <session|all> <filter>` — returns `pane_target|pid|uuid|command` lines.

## Proposed New Private Methods

| Method | Params | Returns | Replaces |
|--------|--------|---------|----------|
| `private.hiveMind.list.panes` | `<scope> <format>` | formatted lines | 26x inline tmux calls |
| `private.hiveMind.current.session` | (none) | session name | 10x inline pattern |
| `private.hiveMind.ensure.pane` | `<target>` | 0/1 | restore pane loop |
| `private.hiveMind.pane.process` | `<scope> <filter>` | pane\|pid\|uuid lines | 4x PID lookup loops |
| `private.hiveMind.pane.count` | `<session:window>` | count | 3x wc -l patterns |

## Rules for the refactor
1. **All methods need OOSH method comment**: `# <params> # description`
2. **All public methods need completion functions**
3. **Private methods**: `private.hiveMind.` prefix, no completion needed
4. **Parameters over globals**: each method declares what it needs
5. **Composable**: methods should be combinable — `list.panes | while read` pattern
6. **No behavior change**: pure refactor, same output, same side effects
7. **Incremental commits**: one method extraction per commit for easy revert

## Plan request
Expert: write a PLAN for this refactor. Start with the highest-impact extraction (list.panes or current.session), plan the order, estimate which methods get simplified. Do NOT implement yet — plan first.
