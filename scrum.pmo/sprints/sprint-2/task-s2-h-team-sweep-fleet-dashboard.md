[Back to Sprint 2 Planning](./planning.md)

# Task S2-H: team.sweep → fleet dashboard (all active teams + bg-shells + context-warning)
[task:uuid:a9b08ad5-963d-4b67-8f9d-d87abf4d6cfa]

## Status
- [x] Planned
- [ ] In Progress
- [ ] QA Review
- [ ] Done

## Traceability
- up
  - [Sprint 2 Planning](./planning.md)
- related: [task-s2-c.0 live-reader](./task-s2-c.0-live-reader.md) (DRY source), [task-s2-a parity](./task-s2-a-teamsave-status-parity.md)

## Description
**From Tron (2026-07-02):** `hiveMind team.sweep` with **NO param → sweep ALL active teams** (not just one). AND each pane line must ALSO show: **(1) accumulated background-shell count**, **(2) the context warning** (context %/remaining) **if available**.
**Role**: architect (design) → expert (impl) → tester (T-SWEEP-ALL).

## Requirements
- **No-arg = all active teams**: enumerate active teams (teams with live agents) and sweep each. DRY: PROJECT off the c.0 canonical live-reader (`host|session|address|tty|role|uuid|kind|title|cwd`) grouped by session/team — do NOT roll a separate enumeration (the PF3 lesson). With a `<session>` arg = current single-team behavior.
- **Background-shell count** per pane (the "N shells" SM tracks manually — e.g. expert=4). Source from the pane/process (the running-shells indicator).
- **Context warning** per pane if available: parse the TUI "Context left until auto-compact: NN%" (cf. claudeCode:1424/1432) → show remaining% / a cliff flag (e.g. ⚠ at low remaining). Blank if not a claude pane / not available.
- One-line-per-pane, grouped by team; object.verb/no-flag; non-invasive.

## Why
This is THE SM fleet-monitoring dashboard — idle/active + shell-accumulation + context-cliff in ONE command, so SM's proactive notify (idle/stopped/shell-growth/near-cliff) reads straight off it instead of hand-assembling.

## Definition of Done
- `hiveMind team.sweep` (no arg) sweeps ALL active teams; `<session>` scopes to one
- each line shows state + bg-shell-count + context-warning(if avail)
- projects off c.0 live-reader (no separate enumeration)
- T-SWEEP-ALL: multi-team sweep lists every active team; shell-count + context% present where applicable

## Report-back
- Architect (design):
- Expert (impl + commit):
- Tester (T-SWEEP-ALL):
