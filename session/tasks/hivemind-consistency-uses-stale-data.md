# BUG: consistency.audit and consistency.fix use stale saved data instead of live truth

**From**: product-owner@opus (TRONinterface:0.0)
**To**: hiveMind-expert, hiveMind-tester
**Priority**: CRITICAL — this is actively corrupting pane titles
**Date**: 2026-03-17

## What happened

projectTeam was recovered with 4 agents. Pane titles were set correctly:
- 0.0 = oosh-expert
- 0.1 = oosh-tester (but an extra empty pane shifted indices)
- 0.2 = scrum-master
- 0.3 = woda-writer

After consistency.audit/fix ran, the pane titles got WRONG:
- 0.3 titled "oosh-expert" but session is actually `scrum-master@sonnet` (UUID 0f0755a8)
- 0.4 titled "oosh-tester" but session is actually woda-writer's UUID (d177f466)

The consistency tools RENAMED panes based on OLD registry/saved data instead of the LIVE session identity.

## Root cause

`consistency.audit` and `consistency.fix` compare pane titles against some stored registry data (hivemind.roles.env or snapshot). When they find a mismatch, they "fix" it by renaming the pane to match the STORED name — but the stored data is STALE. The live session `/rename` identity is the ground truth, not the registry.

This is the same pattern as the stale UUID bug (Issue 1 in the earlier task). The tools trust saved state over live state.

## The rule (Tron directive from 2026-03-03)

"Live Facts > Static Registry" — the registry was a bad idea. Rely on live facts like open processes and tmux sessions. Live discovery chain: tmux pane → PID → UUID → session name → role. Source of truth = running processes, NOT files.

## What needs to happen

### hiveMind-expert:
1. `consistency.audit` must get identity from LIVE session (the `/rename` name or session name from the Claude process), NOT from registry files
2. `consistency.fix` must NEVER rename a pane to match stale registry data. If live identity and registry disagree, the REGISTRY is wrong — update the registry, don't rename the pane
3. The fix direction must always be: live truth → update registry. NEVER: registry → rename pane

### hiveMind-tester:
1. Write test: set a pane title to "X", set registry to "Y", run consistency.fix — it should update registry to "X", NOT rename pane to "Y"
2. Write test: after compact (new UUID), run consistency.audit — it should detect the new UUID, not report "mismatch" against the old one
3. Write test: verify consistency.fix never calls otmux pane.title to overwrite a live agent's identity

## Evidence from tree.detailed

```
projectTeam:0.3   oosh-expert    [2.1.77]    ← pane title says oosh-expert
      └ scrum-master@sonnet [0f0755a8]       ← but live session IS scrum-master!
projectTeam:0.4   oosh-tester    [2.1.77]    ← pane title says oosh-tester
      └ oosh-tester@opus [d177f466]          ← UUID is woda-writer's!
```

The pane titles were overwritten by stale data. The live sessions know who they are. The tool got it backwards.
