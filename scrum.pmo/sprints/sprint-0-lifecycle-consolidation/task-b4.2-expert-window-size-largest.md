[Back to Task B4](./task-b4-otmux-client-lifecycle.md)

# Task B4.2: Expert - otmux window-size largest
[task:uuid:b7ced7aa-a17d-4a69-9980-dd5fb9342446]

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement
  - [x] creating test cases (handed off to B4.3 tester)
  - [x] implementing — commit fa75c22 (on prod, bundled with B4.1)
  - [x] testing (live: tmux show-option -g window-size = largest; setw aggressive-resize = on)
- [x] QA Review
- [x] Done

## Deliverable

**Commit:** `fa75c22` (branch: prod, pushed)

**Changes to `otmux.setup.default`:**
```bash
$TMUX_CMD set -g window-size largest 2>/dev/null
$TMUX_CMD setw -g aggressive-resize on 2>/dev/null
```
- `window-size largest` — server-wide; tmux 2.9+ honors it; old versions silently skip (`2>/dev/null`)
- `aggressive-resize on` — window-level safety net; helps in edge cases where
  multiple clients attach with different geometries

**New runtime adjustment method:**
- `otmux.window.size <?value:largest>` — accepts `largest|smallest|latest|manual`
- Tab completion suggests all 4 values
- Useful for testing or recovering from tmux config drift

**Live verification:**
```
$ otmux setup.default
SUCCESS> defaults applied to running server (incl. window-size=largest)
$ tmux show-option -g window-size       → window-size largest
$ tmux show-option -gw aggressive-resize → aggressive-resize on
```

**tmux version note:** `window-size` was added in tmux 2.9 (March 2019). Older
tmux silently ignores the option (no error). Modern macOS Homebrew & Linux distros
ship 3.x.

## Traceability
- up
  - [Task B4: otmux client lifecycle](./task-b4-otmux-client-lifecycle.md)

## Description
**Role: oosh-expert**

`otmux.setup.default` must set `window-size largest` on all sessions to prevent pane resize when multiple clients attach. When a second tmux client attaches (e.g., tronMonitor monitoring an agent team session), tmux defaults to sizing windows to the smallest client. This shrinks all panes and disrupts agent work.

Implementation:
1. Add `tmux set-option -g window-size largest` to `otmux.setup.default` (or per-session equivalent)
2. Verify it applies to new sessions created after the setting
3. Verify it applies retroactively to existing sessions if possible
4. Document any tmux version requirements (window-size option added in tmux 2.9)

Key file: `/Users/donges/oosh/otmux`

---

*Sprint 0 - Lifecycle Consolidation*
*Epic B: otmux View Layer*
