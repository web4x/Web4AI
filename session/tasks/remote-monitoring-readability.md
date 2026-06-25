# BUG: remote monitoring is blind — sweep.detect/team.status return "unknown" over ossh exec

**From**: oosh-po@MacStudio (recurring gap, hit 3+ times)
**Owners**: oosh-architect (design) → oosh-expert (implement) → oosh-tester
**Priority**: HIGH
**Status**: OPEN

## Problem (hit repeatedly)
`ossh exec <host> 'hiveMind team.status/team.sweep <team>'` returns **"unknown" for every agent** — sweep.detect cannot read Claude TUI state through the double-hop (ossh → remote tmux). Consequences observed:
- robbinTeam2 migration: all 6 agents "unknown" → couldn't tell idle from working.
- ooshTeam@WODA.prod: all "unknown" repeatedly.
- **SM monitoring loop went BLIND**: it swept via `ossh exec 'hiveMind team.status'`, got all-"unknown", and therefore **failed to report a DANGEROUS queued prompt** on the PO ("merge dev to macos.latest" sitting unsubmitted). The SM was "monitoring" but reported nothing actionable.

## Root cause
sweep.detect reads pane content via `otmux pane.capture` locally; over `ossh exec` the capture/parse path degrades to "unknown" (TUI rendering / state heuristics don't survive the remote, non-interactive shell). team.status live-discovery similarly can't resolve state remotely.

## Fix (design choices for architect)
- A **remote-capable status**: `hiveMind team.status` must detect real state when invoked via `ossh exec` — e.g. fall back to raw `otmux pane.capture` per pane + parse for queued-prompt (text after ❯), accept-edits, idle, active. Don't return bare "unknown" when a capture is available.
- OR a dedicated `hiveMind team.status.remote <host> <team>` that captures panes over ossh and classifies.
- Must distinguish: idle (clean ❯), **queued (text after ❯ unsubmitted)**, accept-edits, active, offline — the states the SM/PO act on.

## Acceptance
- [ ] `ossh exec <host> 'hiveMind team.status <team>'` returns real states (not all-"unknown") incl. queued-prompt detection.
- [ ] SM can run its sweep loop over remote shells and reliably flag queued/stuck/idle agents.
- [ ] Test: T-REMOTE-STATUS — capture a pane with a queued prompt remotely, assert it's classified "queued" not "unknown".

## Report-back
- architect / expert / tester:
