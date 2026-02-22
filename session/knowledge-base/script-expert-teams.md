# KB #23: Script Expert Teams — Scaling Pattern

## Problem

One oosh-expert + one oosh-tester cannot accumulate knowledge of ALL oosh scripts without burning context. The hiveMind agent.context.status task (5 commits, 4 bug fixes) consumed expert to 43% and tester to 41% in one task.

## Solution: Script Expert Teams

Distribute script knowledge to specialized expert+tester pairs per script. The oosh-expert stays as **principle guardian** (architecture, conventions, cross-script concerns) while script teams handle implementation and maintenance.

## Model

```
oosh-expert = PRINCIPLE GUARDIAN (review, consistency, architecture)
  │
  ├── hiveMindTeam → hiveMind script (session: hiveMindTeam)
  │     ├── hiveMind-expert (0.0)
  │     └── hiveMind-tester (0.1)
  │
  ├── [future] otmux team → otmux script
  ├── [future] claudeCode team → claudeCode script
  └── [future] odocker team → odocker script
```

## Discovery

`otmux` without parameters shows a full tree of ALL tmux sessions and panes. This revealed:
- The **hiveMindTeam session** already exists (Feb 12) with expert+tester
- **projectTeam has 12 panes** (0.0-0.5 + 1.0-1.5), not just the 5 commonly monitored
- Multiple other sessions exist (ooshDebug, osshTeam, claudeOpus2kTMUX, cursor)

## Handoff Protocol

1. oosh-expert builds new feature in a script
2. Script team inherits maintenance (polish, bugs, edge cases)
3. Knowledge transfer via task files + test reports
4. Script teams handle their own test-fix cycles
5. Trainer manages all teams' context health
6. oosh-expert reviews for principle compliance

## Rules

- **NO git rebase** — hiveMindTeam had rebase incident (Feb 12). Verify `pull.rebase=false`.
- Each script team gets its own session or dedicated panes
- Trainer bootstraps teams with proper boot files + knowledge transfer
- `otmux` (no args) for full session overview before any team operation

## CMM Assessment

- Script-per-team = CMM3 (deterministic: same script → same team → same quality)
- Cross-team coordination via trainer = CMM2→3 (needs more practice)
- Knowledge transfer protocol = CMM2 (first time, needs refinement)

## Related

- KB #21: Compact/Boot Lifecycle
- KB #22: Recurring Incidents
- Task: `session/tasks/trainer-build-script-expert-teams.md`
- Agent context status tool: commits 088719a→7d336d2
