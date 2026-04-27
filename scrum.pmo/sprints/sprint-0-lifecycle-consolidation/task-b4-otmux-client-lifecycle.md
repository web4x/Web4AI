[Back to Planning Sprint 0](./planning.md)

# Task B4: otmux client lifecycle -- attach -r read-only + window-size largest
[task:uuid:010fdb7d-3c9c-4920-b70f-6625db7fe162]

## Naming Conventions
- Tasks: `task-<epic><number>-<short-description>.md`
- Subtasks: `task-<epic><number>.<subnumber>-<role>-<short-description>.md`
- Subtasks must always indicate the affected role in the filename.
- Subtasks must be ordered to avoid blocking dependencies.

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement
  - [x] implementing (B4.1 expert — attach readonly) — commit fa75c22
  - [x] implementing (B4.2 expert — window-size largest) — commit fa75c22
  - [ ] testing (B4.3 tester — client lifecycle tests)
- [x] QA Review (expert work delivered + live verified)
- [ ] Done (pending B4.3 tester pass)

## Traceability
- Source: Sprint 0 - Lifecycle Consolidation, Epic B (View Layer)

  - up
    - [Sprint 0 Planning - Lifecycle Consolidation](./planning.md)

  - down
    - [Task B4.1: Expert - attach readonly](./task-b4.1-expert-attach-readonly.md)
    - [Task B4.2: Expert - window-size largest](./task-b4.2-expert-window-size-largest.md)
    - [Task B4.3: Tester - client lifecycle tests](./task-b4.3-tester-client-lifecycle-tests.md)

## Task Description
Add proper client lifecycle support to otmux: monitoring clients (tronMonitor, scrumMaster) that attach to team sessions must use read-only attach (`-r`) to prevent accidental input, and sessions must use `window-size largest` to prevent pane resize when multiple clients are attached.

## Context
tronMonitor and scrumMaster attach to team sessions for monitoring. Without `-r`, a monitoring client can accidentally send keystrokes to agent panes. Without `window-size largest`, attaching a second client (e.g., from a smaller terminal) shrinks all panes to the smallest client's dimensions, disrupting agent work.

These are View-layer concerns: otmux controls how tmux sessions are created and attached, so the defaults belong here.

Key file: `/Users/donges/oosh/otmux`

## Intention

### Why This Task Exists:
1. **Safe Monitoring:** Monitoring clients must not interfere with agent panes
2. **Stable Layout:** Multi-client attach must not resize panes
3. **tronMonitor Dependency:** tronMonitor needs these otmux capabilities to function safely

### Problems This Task Solves:
- **Accidental input:** Monitoring client can send keystrokes to agent panes
- **Pane resize on attach:** Second client shrinks all panes to smallest terminal
- **No read-only API:** No otmux method for read-only attach

### How This Task Solves These Problems:
- **B4.1:** Add `otmux.attach.readonly` method or `<?readonly>` param to default to `-r`
- **B4.2:** Set `window-size largest` in `otmux.setup.default` for all sessions
- **B4.3:** Test that attach -r doesn't allow input and window-size largest prevents resize

---

*Sprint 0 - Lifecycle Consolidation*
*Epic B: otmux View Layer*
*Priority: 2 (HIGH - tronMonitor dependency)*
