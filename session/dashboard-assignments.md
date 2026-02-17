# Team Assignment Dashboard
*Updated: 2026-02-17 ~13:15Z by scrum-master (cycle 10)*

## Assignment Table

| Pane | Agent | Current Task | Status |
|------|-------|-------------|--------|
| 0.0 | orchestrator | Monitoring SM + reading done files | ACTIVE |
| 0.1 | oosh-expert | Checklist→method conversions (Baked 1m 8s, self-prompting) | ACTIVE |
| 0.2 | oosh-tester | Post-compact recovery (compacted at 8%) | RECOVERING |
| 0.4 | product-owner | Active (processing Tron directive) | ACTIVE |
| 0.5 | agent-trainer | Idle — no matching tasks found | IDLE |
| 1.0 | woda-writer | Active (1 bash, monitoring scribe) | ACTIVE |
| 1.1 | woda-scribe | Active | ACTIVE |
| 1.2 | task-agent | Permanently interrupted | STUCK |
| 1.3 | developer | All clean — idle | IDLE |
| 1.4 | script-product-owner | Comparing restored vs current scripts | ACTIVE |

## Subscription
- Block: 09:00-14:00 UTC (ACTIVE)
- Tokens: 97.8M used / 111 min remaining
- Burn rate: 527K tokens/min
- Alert: OK

## Compacts This Session
- PO: compacted (was 8%)
- agent-trainer: compacted (twice)
- developer: compacted (was 10%)
- oosh-expert: compacted (was 2%, recovered)
- oosh-tester: compacted (was 8%)

## Task Queued
- `20260217T1315Z.task.md`: Enhance hiveMind sweep.loop with subscription + dashboard integration (for expert)

## Idle Agents
- agent-trainer (0.5), developer (1.3)

## CMM Observation
SM continuous loop running per F13 directive (CMM2). Expert self-prompting through checklist conversions without orchestrator assignment (CMM1 — no coordination). Task-agent permanently interrupted (CMM1 — needs restart). Tester recovering from compact.
