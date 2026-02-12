# Task: Implement Pane Border Titles for Agent Names

## PO-Approved Feature

Read `session/tasks/po-approve-pane-titles.md` for the full spec from the orchestrator.

## PO Conditions

1. **Wrap in OOSH** — create `otmux pane.title <target> <name>` method. NO raw `tmux select-pane -T` in hiveMind or bootstrap scripts.
2. **Create `hiveMind pane.titles`** — reads `/tmp/hivemind.roles`, calls `otmux pane.title` for each entry. One command to label all panes.
3. **Integrate into `hiveMind agent.bootstrap`** — after placing agent in pane, set title automatically.
4. **Enable border in `hiveMind team.setup.full`** — add `tmux set -g pane-border-status top` and format string.
5. **Session-agnostic** — no hardcoded session names.

## Acceptance Criteria

- [ ] `otmux pane.title projectTeam:0.3 scrum-master` sets the pane border label
- [ ] `hiveMind pane.titles` labels all registered agents from hivemind.roles
- [ ] New agents bootstrapped via hiveMind get titles automatically
- [ ] Active pane visually distinct (bold)
- [ ] Can toggle off: `tmux set -g pane-border-status off`
