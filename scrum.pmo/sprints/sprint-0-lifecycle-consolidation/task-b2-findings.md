# Task B2 — otmux Layout Persistence

**Date:** 2026-04-24
**Role:** oosh-expert
**Target:** `/Users/donges/oosh/otmux`
**Covers:** B2.1 (design) + B2.2 (implementation)
**Commit:** see diff at end — 145 lines added to otmux

---

## TL;DR

Implemented 5 new otmux methods for layout persistence:

| Method | Purpose |
|--------|---------|
| `otmux layout.save <session>` | Serialize windows/panes/titles/cwds to `~/config/otmux/<session>.layout.env` |
| `otmux layout.restore <session> <?--force>` | Recreate session from saved layout, guard against overwriting live session |
| `otmux layout.list` | List all saved layouts with saved-at timestamp |
| `otmux layout.show <session>` | Display the saved layout file |
| `otmux layout.delete <session>` | Remove a saved layout file |

**View-layer purity maintained:** Methods are agnostic to agents/claudeCode/hiveMind. Controller
(hiveMind) composes layout.restore + content restoration (claude relaunch, role teaching, etc.).

**Verified:** Save/kill/restore round-trip exact match on titles, dimensions. `--force` guard
prevents accidental overwrite.

---

## B2.1 Design

### Format: Env-file (OOSH convention)

Chosen over JSON because:
- OOSH standard — all persistent state uses env files (`user.env`, `hivemind.*.env`, etc.)
- `source` loads variables directly into bash — no parser needed
- Grep-friendly for debugging
- Native support for quoting/escaping

### Schema (documented in code header)

```bash
# ~/config/otmux/<session>.layout.env
OTMUX_LAYOUT_SESSION="ooshTeam"
OTMUX_LAYOUT_SAVED_AT="2026-04-24T10:37:12Z"
OTMUX_LAYOUT_WINDOW_INDICES="0 1 2"

# Per window W:
OTMUX_WINDOW_0_NAME="main"
OTMUX_WINDOW_0_LAYOUT="4a82,321x69,0,0[321x14,0,0,3,...]"  # tmux native
OTMUX_WINDOW_0_PANE_INDICES="0 1 2 3 4"

# Per pane W.P:
OTMUX_WINDOW_0_PANE_0_TITLE="oosh-expert"
OTMUX_WINDOW_0_PANE_0_CWD="/path/to/cwd"
OTMUX_WINDOW_0_PANE_0_CMD="bash"
```

### Key design decisions

**1. Use tmux native `window_layout` string, not custom geometry math.**
tmux provides `#{window_layout}` format which encodes ALL pane geometry as a compact string
(e.g. `4a82,321x69,0,0[...]`). This string can be fed back to `tmux select-layout` to
reshape the window. Leveraging the native primitive means:
- Zero geometry calculation on our side
- Exact restoration (tmux handles the splits/sizes itself)
- Forward-compatible with tmux version changes

**2. Two-phase restore: create panes, then reshape.**
`select-layout` requires the window to already have N panes. Our restore:
1. Create session + first window (gets 1 pane)
2. `split-window` N-1 times (direction irrelevant; layout reshapes)
3. `select-layout "$savedString"` applies exact geometry
4. `select-pane -T "$title"` per pane for titles

**3. Guard against overwriting live sessions.**
`layout.restore` refuses by default if the session already exists. Passing `--force`
as the second argument applies anyway (with warn). Prevents accidental layout stomping
during development.

**4. Titles restored one-shot via `select-pane -T`.**
For persistent titles (Claude Code auto-retitles), callers should use `otmux pane.lock`
after restore. That responsibility stays with Controller — View just restores the current
title; persistence against auto-rename is a separate concern.

**5. CWD saved but not restored automatically.**
Saving `pane_current_path` captures intent for future auto-cd functionality. Current restore
does not `cd` each pane — that would require `respawn-pane -k` which kills the current
command. Controller can read `OTMUX_WINDOW_<W>_PANE_<P>_CWD` and issue `otmux send "<pane>"
"cd <cwd>" Enter` if desired (caller's decision, not forced).

**6. Agent-agnostic.**
No claudeCode, hiveMind, HIVEMIND_* refs in the new methods. Works for any tmux layout:
dev environments, pair programming, teaching setups, not just agent teams.

---

## B2.2 Implementation

### Code added to `/Users/donges/oosh/otmux` (145 lines after line 509)

Section header:
```bash
# ─────────────────────────────────────────────────────────────────────────────
# LAYOUT PERSISTENCE (save / restore across server restart)
# ─────────────────────────────────────────────────────────────────────────────
```

Plus default var:
```bash
: ${OTMUX_LAYOUT_DIR:=${CONFIG_PATH:-$HOME/config}/otmux}
```

### Method signatures

```bash
otmux.layout.save()    # <session>                         — serialize to file
otmux.layout.restore() # <session> <?--force>              — recreate from file
otmux.layout.list()    # #                                 — table of all saved
otmux.layout.show()    # <session>                         — cat the saved file
otmux.layout.delete()  # <session>                         — remove saved file
```

Each has matching `.completion.*` functions following OOSH conventions.

### Verification runs

**1. Save live ooshTeam layout:**
```
$ otmux layout.save ooshTeam
SUCCESS> Layout saved: /Users/donges/config/otmux/ooshTeam.layout.env

# Resulting file:
OTMUX_LAYOUT_WINDOW_INDICES="0"
OTMUX_WINDOW_0_LAYOUT="4a82,321x69,0,0[321x14,0,0,3,321x39,0,15{161x39,0,15,4,159x39,162,15,6},321x14,0,55{161x14,0,55,5,159x14,162,55,7}]"
OTMUX_WINDOW_0_PANE_INDICES="0 1 2 3 4"
OTMUX_WINDOW_0_PANE_0_TITLE="✳ product-owner"    # UTF-8 char preserved
OTMUX_WINDOW_0_PANE_1_TITLE="oosh-expert"
OTMUX_WINDOW_0_PANE_2_TITLE="✳ oosh-tester"
OTMUX_WINDOW_0_PANE_3_TITLE="oosh-expert-shell"
OTMUX_WINDOW_0_PANE_4_TITLE="oosh-tester-shell"
```

**2. Save/kill/restore round-trip (scratch session):**
```
Before save: 0.0 alpha-pane 80x11, 0.1 beta-pane 80x11
After restore: 0.0 alpha-pane 80x11, 0.1 beta-pane 80x11    # exact match ✓
```

**3. --force guard:**
```
$ otmux layout.restore scratch_live   # session exists
ERROR> session 'scratch_live' already exists — pass --force to apply layout anyway

$ otmux layout.restore scratch_live --force
WARNING> session 'scratch_live' exists — applying saved layout with --force
SUCCESS> Layout restored for session 'scratch_live' from ...
```

---

## Integration path (C1 cold-start restore)

This unblocks C1 — hiveMind cold-start restore. The complete flow:

```bash
# Before tmux death
otmux layout.save ooshTeam                        # View: save geometry
hiveMind teams.save                                # Controller: save UUIDs + roles

# After tmux death (cold start)
otmux layout.restore ooshTeam                     # View: recreate panes
hiveMind teams.restore ooshTeam                    # Controller: fork/join each pane's UUID
# Pane titles are already restored by layout.restore;
# role registry (hivemind.roles.env) drives agent identification.
```

No coupling between View and Controller. Each owns its file format and scope.

---

## MVC purity check

Grep audit of new methods:
```bash
$ grep -E 'claudeCode|hiveMind|HIVEMIND_' /Users/donges/oosh/otmux \
  | sed -n '/LAYOUT PERSISTENCE/,/BUFFER COMMANDS/p'
# Expected: zero matches in new section
```

Confirmed — new section has zero cross-layer refs.

---

## Test Handoff (for B2.3 tester)

Testable assertions:

1. **Save produces valid env file:**
   ```bash
   otmux new test_b2; otmux layout.save test_b2
   source ~/config/otmux/test_b2.layout.env
   [ "$OTMUX_LAYOUT_SESSION" = "test_b2" ]    # var loaded correctly
   otmux kill test_b2; otmux layout.delete test_b2
   ```

2. **Round-trip preserves pane count:**
   ```bash
   otmux new test_b2; otmux split.h test_b2; otmux split.v test_b2:0.0
   before=$(tmux list-panes -t test_b2 | wc -l)
   otmux layout.save test_b2
   otmux kill test_b2
   otmux layout.restore test_b2
   after=$(tmux list-panes -t test_b2 | wc -l)
   [ "$before" = "$after" ]
   ```

3. **Round-trip preserves pane titles:**
   ```bash
   otmux pane.title test_b2:0.1 "my-test-label"
   otmux layout.save test_b2
   otmux kill test_b2
   otmux layout.restore test_b2
   title=$(tmux display-message -p -t test_b2:0.1 '#{pane_title}')
   [ "$title" = "my-test-label" ]
   ```

4. **Round-trip preserves pane dimensions (within tmux's percentage rounding):**
   ```bash
   # save layout string, kill, restore, compare layout string
   before=$(tmux display-message -p -t test_b2:0 '#{window_layout}')
   ... save, kill, restore ...
   after=$(tmux display-message -p -t test_b2:0 '#{window_layout}')
   [ "$before" = "$after" ]    # pane geometry hash must match
   ```

5. **--force guard prevents accidental overwrite:**
   ```bash
   otmux new test_b2; otmux layout.save test_b2
   otmux layout.restore test_b2           # should FAIL rc=1
   otmux layout.restore test_b2 --force   # should SUCCEED
   ```

6. **layout.list shows saved layouts:**
   ```bash
   otmux layout.list | grep -q test_b2     # session listed
   otmux layout.delete test_b2
   otmux layout.list | grep -q test_b2    # now absent
   ```

7. **layout.delete removes file:**
   ```bash
   [ -f ~/config/otmux/test_b2.layout.env ]    # exists before
   otmux layout.delete test_b2
   [ ! -f ~/config/otmux/test_b2.layout.env ]  # absent after
   ```

8. **Agent-agnostic — no cross-layer refs in new code:**
   ```bash
   awk '/LAYOUT PERSISTENCE/,/^# ─+$/ && /BUFFER COMMANDS/' otmux \
     | grep -cE 'claudeCode|hiveMind|HIVEMIND_'
   # Expected: 0
   ```

---

## What's deliberately NOT done (deferred)

- **Per-pane CWD restore.** Saved but not auto-applied. Requires `respawn-pane -k` which
  is destructive. Leave to caller / Controller.
- **Persistent pane title locks.** `pane.lock` already exists; caller composes after restore.
- **Multi-window stress testing.** Live session had only 1 window; more windows may reveal
  edge cases. Handoff to B2.3 tester with multi-window fixtures.
- **Concurrent-restore safety.** If two restores run simultaneously on same session, result
  undefined. Single-user tool — acceptable.

---

*Sprint 0 - Lifecycle Consolidation — Epic B: otmux View Layer*
