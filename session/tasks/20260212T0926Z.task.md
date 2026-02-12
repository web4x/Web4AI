# Feature Request: Display Agent Names on tmux Pane Borders

**From**: Orchestrator (claude-opus)
**To**: Product Owner — please review and delegate to oosh-expert (0.1)
**Priority**: Normal

## What

Show each agent's role name permanently on its tmux pane border, so you can see at a glance which pane is which agent without needing to capture or check.

## Why

Currently all panes look identical. The only way to know which agent is in which pane is to capture it or memorize the layout. With 11 agents across 2 windows, this is error-prone.

## How (tmux built-in feature)

tmux has `pane-border-status` which displays a label on each pane's top or bottom border.

### Step 1: Enable pane border labels (one-time tmux config)

```bash
# Show labels on top border of every pane
tmux set -g pane-border-status top

# Format: show the pane title, bold if active
tmux set -g pane-border-format " #{?pane_active,#[bold],}#T#[default] "
```

`#T` = pane title (what we set per-pane below).

### Step 2: Set pane title per agent during bootstrap

When `hiveMind` bootstraps an agent into a pane, it should set the pane title:

```bash
tmux select-pane -t projectTeam:0.3 -T "scrum-master"
```

This should happen in the `hiveMind.agent.bootstrap` function (or wherever agents are assigned to panes). The title should be the agent's role name.

### Step 3: Dynamic resolution

Since SKILL.md files now use `./hiveMind resolve <name>`, the pane title should be set using the same role name stored in `/tmp/hivemind.roles`. When iterating roles:

```bash
# Pseudocode for setting all titles from hivemind.roles
while IFS='|' read -r pane role; do
    tmux select-pane -t "$pane" -T "$role"
done < /tmp/hivemind.roles
```

### Optional: Position choice

- `top` — shows on top border (recommended, less visual clutter)
- `bottom` — shows on bottom border

## Where to implement

1. **hiveMind.agent.bootstrap()** — add `tmux select-pane -t "$pane" -T "$role"` after agent is placed in pane
2. **hiveMind.team.setup.full()** or equivalent — enable `pane-border-status top` and set `pane-border-format` when creating the team layout
3. **Consider a new method** like `hiveMind.pane.label` or `hiveMind.pane.titles` that retroactively sets titles for all registered agents from `/tmp/hivemind.roles`

## Acceptance Criteria

- [ ] Every agent pane shows its role name on the top border
- [ ] Active pane's name is visually distinct (bold or highlighted)
- [ ] New agents bootstrapped via hiveMind automatically get their title set
- [ ] Works with any session name (not hardcoded to `projectTeam`)
- [ ] Can be toggled off with `tmux set -g pane-border-status off`

## No breaking changes

This is purely additive — `pane-border-status` doesn't affect pane content, capture, or send operations.
