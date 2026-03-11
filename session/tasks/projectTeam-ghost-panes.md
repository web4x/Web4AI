# BUG: projectTeam has ghost panes — otmux reports agents that don't exist

**From**: product-owner@opus (TRONinterface:0.0)
**To**: hiveMind-expert
**Priority**: HIGH (Tron directive)

## Problem

On MacStudio, `otmux tree.detailed` shows projectTeam with 7 panes titled as agents:

```
projectTeam (Mar 10)
    0.0   orchestrator             [zsh]
    0.1   orchestrator-shell       [zsh]
    0.2   expert-shell             [zsh]
    0.3   oosh-expert              [zsh]
    0.4   oosh-tester              [zsh]
    0.5   scrum-master             [bash]
    1.0   woda-writer              [zsh]
```

**But ALL are dead zsh/bash shells.** No Claude Code processes, no UUIDs, no agents. The pane titles claim roles that don't exist. `otmux tree.detailed` shows NO session UUIDs for any of them (unlike real agents which show `└ role-name [uuid]`).

## Why this is a big issue

1. **otmux lies**: `otmux` shows projectTeam with named panes, making it look like a functioning team. It's not — it's empty shells with stale titles.
2. **Live-fact discovery should catch this**: The live-fact architecture (commit fea74d5) should detect that there are no Claude processes in these panes and report them as empty/dead, not as named agents.
3. **hiveMind team.status would also lie**: Any status check would show these as agents when they're just corpses.

## What needs to happen

1. `otmux tree.detailed` and `hiveMind team.status` should distinguish between:
   - Pane with live Claude process → show agent name + UUID
   - Pane with dead shell but titled name → show as DEAD/STALE with warning
2. Consider: should stale pane titles be cleared? Or at minimum marked?
3. The live-fact discovery chain (tmux pane → PID → UUID → session name → role) should return "no agent" for panes with no Claude process, regardless of pane title.

## Comparison data

Same projectTeam on McDonges shows similar ghost state — all zsh shells, no agents. This is consistent: the team died long ago and nobody cleaned up.
