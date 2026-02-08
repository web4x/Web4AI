# Task 28 — otmux tree overview command

**Created**: 2026-02-04T09:26Z
**Status**: Done (commit b9c2989, Tester validated PASS) — updated by Task Agent 2026-02-04
**Requested by**: Product Owner
**Assigned to**: oosh-expert, oosh-tester

## Original Directive (verbatim)

> Add a tree overview command to otmux that shows all sessions, panes, titles and addresses in a formatted tree. Make it default output when starting otmux or running otmux status. Assigned to: oosh-expert implements, oosh-tester validates.

## Expected Output Format

```
tmux sessions
│
├── cursorOrchestrator (attached, Jan 29)
│   ├── 0.0  orchestrator              [claude 2.1.29]
│   ├── 0.1  product-owner             [claude 2.1.29]
│   ├── 0.2  agent-trainer             [claude 2.1.29]
│   ├── 0.3  task-agent                [claude 2.1.29]
│   ├── 0.4  oosh-expert               [claude 2.1.29]
│   ├── 0.5  oosh-tester               [claude 2.1.25]
│   └── 0.6  scrum-master              [claude 2.1.29]
│
├── claudeWoda (Feb 2)
│   ├── 0.0  OOSH Best Practices       [bash]
│   ├── 0.1  Monitor Design Issues     [claude 2.1.29]
│   ├── 0.2  zsh.commands              [zsh]
│   ├── 0.3  zsh.split                 [zsh]
│   └── 0.4  Claude Code               [bash]
│
├── agent (Feb 3)
│   ├── 0.0  Greeting Bot              [script]
│   ├── 0.1  MacStudio.default.shell   [zsh]
│   └── 0.2  MacStudio.oosh.shell      [bash]
│
└── test_yourself (attached, Jan 30)
    ├── 0.0  MacStudio.fritz.box        [bash]
    └── 0.1  MacStudio.fritz.box        [bash]
```

## Requirements

- Method name: `otmux.tree`
- Shows ALL tmux sessions with creation date
- Marks attached sessions
- Groups panes by window (if multiple windows, show window headers)
- Each pane shows: address (session:window.pane), title, running process in [brackets]
- Tree drawing with proper UTF-8 box characters (├── └── │)
- Aligned columns for readability
- Should be the default output for `otmux status` or bare `otmux`

## Headline Plan

| Step | Agent | Action |
|------|-------|--------|
| 1 | oosh-expert | Implement `otmux.tree` method with proper OOSH patterns, UTF-8 tree drawing, aligned columns per spec above |
| 2 | oosh-expert | Wire `otmux.tree` as default output for `otmux status` and bare `otmux` invocation |
| 3 | oosh-tester | Validate tree output matches spec format: sessions with dates, attached markers, pane addresses, titles, processes |
| 4 | oosh-tester | Verify Tab completion includes `tree` method, `otmux status` and bare `otmux` both show the tree |

## Acceptance Criteria

- [ ] `./otmux tree` shows formatted tree of all sessions with panes, titles, and addresses
- [ ] `./otmux status` outputs the tree
- [ ] Bare `./otmux` (no arguments) outputs the tree as default
- [ ] Sessions show creation date and attached marker
- [ ] Panes show address (window.pane), title, running process in [brackets]
- [ ] Multiple windows grouped with window headers
- [ ] UTF-8 box-drawing characters (├── └── │) used correctly
- [ ] Columns aligned for readability
- [ ] Follows object.verb naming convention (Task.25)
- [ ] Tab completion includes `tree` method
- [ ] Tests pass
