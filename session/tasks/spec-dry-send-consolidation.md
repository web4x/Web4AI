# Specification: DRY Send Consolidation

**Author**: oosh-expert (architectural decision)
**Implement**: hiveMind-expert @ hiveMindTeam:0.0
**Test**: hiveMind-tester @ hiveMindTeam:0.1
**Report to**: agent-trainer
**Files**: `/Users/donges/oosh/otmux`, `/Users/donges/oosh/hiveMind`

---

## Architecture Decision: Option C + Alias Cleanup

Preserves layer separation. Fixes the default. Removes dead weight.

---

## Part 1: Fix hiveMind.send() — THE critical change

### Current (BROKEN)

`hiveMind.send()` (line 770) calls `otmux send` (raw keys, no Enter).
Every agent uses `hiveMind send <role> "msg"` — and it never submits.
The INC-001 fix (`private.otmux.sendEnter()`) exists but `hiveMind.send()` doesn't use it.

### Fix

Replace the send logic in `hiveMind.send()` (lines 786-805) to ALWAYS append Enter.
The current code has complex key-detection logic (lines 789-805) that checks if the
last argument is a tmux key name (Enter, Escape, Tab, etc.).

**New behavior**: `hiveMind.send()` sends literal text + Enter. Always.

Replace lines 770-807:

```bash
hiveMind.send() # <name> <message> # send message to agent by name (appends Enter)
{
  local name="$1"
  shift

  if [ -z "$name" ] || [ -z "$*" ]; then
    error.log "Usage: hiveMind send <name> <message>"
    return 1
  fi

  local target
  target=$(hiveMind.resolve "$name")
  if [ $? -ne 0 ]; then
    return 1
  fi

  otmux send.enter "$target" "$*"
  info.log "Sent to $name ($target): $*"
  return 0
}
```

**What this changes**:
- Doc comment: "(no Enter appended)" → "(appends Enter)"
- Removes key-detection logic (lines 789-805) — `hiveMind send` is for MESSAGE delivery, not raw key sequences
- Calls `otmux send.enter` instead of `otmux send` — uses the INC-001-fixed `private.otmux.sendEnter()`
- Raw key sending (Escape, C-u, Down, Enter alone) → use `otmux send` directly

**Completion function**: keep `hiveMind.send.completion.name()` unchanged.

---

## Part 2: Delete hiveMind.send.enter()

After Part 1, `hiveMind.send()` already appends Enter. `hiveMind.send.enter()` is now
identical in behavior → delete it.

**Delete lines 813-836** (the entire `hiveMind.send.enter()` function + completion).

**Backward compatibility**: Any agent using `hiveMind send.enter` will get a "method not found" error. This is intentional — trainer will update all SKILL.md files.

---

## Part 3: Delete otmux.send.keys()

Line 2028-2031. Pure alias for `otmux.send()`. Zero added value.

```bash
otmux.send.keys() # <target> <keys> # send keys to pane; ...
{
  otmux.send "$@"
}
```

**Delete these 4 lines.**

---

## Part 4: Delete otmux.send.* aliases

Lines 2050-2073. These are misleading "send" namespace aliases that just delegate to
non-send methods. They violate DRY and pollute the `send` namespace:

| Alias | Delegates to | Why delete |
|-------|-------------|------------|
| `otmux.send.run()` (L2050) | `otmux.run()` | Not a "send" operation |
| `otmux.send.display()` (L2055) | `otmux.display()` | Not a "send" operation |
| `otmux.send.confirm()` (L2060) | `otmux.confirm()` | Not a "send" operation |
| `otmux.send.prompt()` (L2065) | `otmux.prompt()` | Not a "send" operation |
| `otmux.send.menu()` (L2070) | `otmux.menu()` | Not a "send" operation |

**Delete lines 2050-2073** (all 5 aliases).

**Before deleting**: Verify no callers. Run:
```bash
grep -rn 'otmux.send.run\|otmux.send.display\|otmux.send.confirm\|otmux.send.prompt\|otmux.send.menu\|otmux send.run\|otmux send.display\|otmux send.confirm\|otmux send.prompt\|otmux send.menu' /Users/donges/oosh/
```
If any callers exist, update them to use the real method names (`otmux.run`, `otmux.display`, etc.).

---

## Summary: Before → After

### otmux send methods (before: 8, after: 4)

| Keep | Purpose |
|------|---------|
| `otmux.send()` | Raw key send (low-level) |
| `otmux.send.enter()` | Text + Enter (uses `private.otmux.sendEnter`, INC-001 fixed) |
| `otmux.send.verified()` | Text + Enter + verification |
| `otmux.send.tui()` | Per-key delays for TUI apps |

| Delete | Reason |
|--------|--------|
| `otmux.send.keys()` | Pure alias for `otmux.send()` |
| `otmux.send.run()` | Alias for `otmux.run()` — not a "send" |
| `otmux.send.display()` | Alias for `otmux.display()` — not a "send" |
| `otmux.send.confirm()` | Alias for `otmux.confirm()` — not a "send" |
| `otmux.send.prompt()` | Alias for `otmux.prompt()` — not a "send" |
| `otmux.send.menu()` | Alias for `otmux.menu()` — not a "send" |

### hiveMind send methods (before: 3, after: 2)

| Keep | Purpose |
|------|---------|
| `hiveMind.send()` | Role resolve + text + Enter (DEFAULT for all agents) |
| `hiveMind.send.message()` | Safe send: pre-check + blocker clear + verification |

| Delete | Reason |
|--------|--------|
| `hiveMind.send.enter()` | Now redundant — `hiveMind.send()` already appends Enter |

---

## Call Chain (after fix)

```
Agent usage:
  hiveMind send <role> "message"
    → hiveMind.send() → hiveMind.resolve() → otmux send.enter → private.otmux.sendEnter() → tmux send-keys -l + Enter

Safe send (SM/orchestrator):
  hiveMind send.message <role> "message"
    → hiveMind.send.message() → sweep.detect + unblock + otmux send.verified → private.otmux.sendEnter() + verify

Raw keys (direct pane access):
  otmux send <pane> Down Enter
    → otmux.send() → tmux send-keys
```

---

## Test Cases

1. `hiveMind send orchestrator "test message"` — should appear AND submit (Enter sent)
2. `hiveMind send.message orchestrator "test message"` — should work with verification
3. `hiveMind send.enter orchestrator "test"` — should error (method deleted)
4. `otmux send.keys projectTeam:0.0 "test"` — should error (method deleted)
5. `otmux send projectTeam:0.0 "raw text"` — should NOT submit (no Enter — this is raw)
6. `otmux send.enter projectTeam:0.0 "test"` — should submit (Enter appended)
7. Verify no callers of deleted aliases exist

---

## OOSH Standards Checklist
- [x] Doc comment updated on hiveMind.send()
- [x] Completion functions preserved for remaining methods
- [x] Object.verb naming pattern maintained
- [x] Layer separation: otmux=pane, hiveMind=role
- [x] INC-001 fix path used (private.otmux.sendEnter)
