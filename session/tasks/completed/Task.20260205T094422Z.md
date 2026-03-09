# Task 33 — Automate Sweep as OOSH Methods (hiveMind sweep/unblock/sweep.loop)

**Created**: 2026-02-04T15:15Z
**Status**: Done (commit 593acfe, validated by Tester)
**Priority**: High — reduces permission prompts from 6+ per sweep to 1
**Requested by**: Product Owner (via instructions-team-automate-sweep.md)
**Assigned to**: oosh-expert, oosh-tester
**Depends on**: Task.30 (Enter fix, commit 064c184) — done

## Original Directive (verbatim)

> The SM and Orchestrator repeat the same commands every sweep cycle: `./otmux pane.capture` on every pane, `./otmux send <pane> Enter` to unblock, manual parsing of output to detect stuck prompts. Each raw command triggers a permission prompt. A 6-pane sweep = 6+ permission prompts. This is why the SM gets stuck — it's fighting permissions instead of monitoring.
>
> Wrap repetitive patterns in OOSH methods. One method = one permission = entire sweep done.

## Problem

SM and Orchestrator manually run 6+ commands per sweep cycle. Each triggers a permission prompt. The team spends more time fighting permissions than monitoring. Three new hiveMind methods consolidate this into single OOSH calls.

## Required Methods

### 1. `hiveMind sweep`
Batch-capture all registered agent panes in one call. Returns a summary table.
```bash
./hiveMind sweep
# Output: table of pane | role | status | action-needed
```

### 2. `hiveMind unblock <name|all>`
Detect and resolve common blockers on a pane:
- Permission prompt → send Enter
- Queued message not submitted → send Enter
- `/compact` autocomplete stuck → send Escape then Enter
- Rate limit prompt → send Enter
```bash
./hiveMind unblock all    # Fix all stuck agents in one call
./hiveMind unblock expert # Fix one agent
```

### 3. `hiveMind sweep.loop <seconds>`
Continuous monitoring loop — sweep + unblock every N seconds.
```bash
./hiveMind sweep.loop 30  # Sweep every 30 seconds
```

## Headline Plan

| Step | Agent | Action |
|------|-------|--------|
| 1 | oosh-expert | Implement `hiveMind.sweep` — batch capture all registered panes, return status table (pane, role, status, action-needed) |
| 2 | oosh-expert | Implement `hiveMind.unblock` — detect stuck prompts (permission, queued, autocomplete, rate limit), resolve with appropriate keystrokes. Accept agent name or `all`. |
| 3 | oosh-expert | Implement `hiveMind.sweep.loop` — continuous sweep + unblock every N seconds |
| 4 | oosh-expert | Add Tab completion: `hiveMind.unblock.completion.parameter` (agent names from registry + `all`), `hiveMind.sweep.loop.completion.parameter` (suggested intervals) |
| 5 | oosh-tester | Validate sweep output format matches spec (table with pane, role, status, action-needed) |
| 6 | oosh-tester | Validate unblock detects and resolves each blocker type (permission, queued, autocomplete, rate limit) |
| 7 | oosh-tester | Validate sweep.loop runs continuously at specified interval |
| 8 | oosh-tester | Validate Tab completion for all methods and parameters |

## Acceptance Criteria

- [ ] `./hiveMind sweep` captures all registered panes and returns status table
- [ ] `./hiveMind unblock <name>` detects and resolves stuck prompts for one agent
- [ ] `./hiveMind unblock all` resolves all stuck agents in one call
- [ ] Blocker detection covers: permission prompts, queued messages, autocomplete stuck, rate limits
- [ ] `./hiveMind sweep.loop <seconds>` runs continuous sweep + unblock at interval
- [ ] Tab completion for `unblock` parameter (agent names + `all`)
- [ ] Tab completion for `sweep.loop` parameter (suggested intervals)
- [ ] One OOSH method call = one permission approval (not 6+)
- [ ] All regex/detection logic in `private.` methods
- [ ] Public API follows object.verb OOSH conventions
- [ ] Tests pass
