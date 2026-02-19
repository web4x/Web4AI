# Team Assignment Dashboard
*Updated: 2026-02-19 13:36Z by scrum-master (sweep 4 — standby enforced)*

## Assignment Table

| Pane | Agent | Current Task | Goal | Status |
|------|-------|-------------|------|--------|
| 0.0 | orchestrator | Standing down (PO orders only) | G3 | Idle |
| 0.1 | oosh-expert | Idle, awaiting assignment (accept-edits barrier) | G5 | Standby |
| 0.2 | oosh-tester | Saved + stopped | G5 | Standby |
| 0.3 | scrum-master | Standby enforcement + monitoring | G3/G4 | Active |
| 0.4 | product-owner | **TRON'S PANE — NEVER TOUCH** | — | SKIPPED |
| 0.5 | agent-trainer | Done: SM SKILL.md 919→203 (09e923d). Deferred orch SKILL.md | G1 | Standby |
| 1.0 | woda-writer | Standby (accept-edits barrier, "write ch82" queued) | G2 | Standby |
| 1.1 | woda-scribe | Stopped | G1 | Standby |
| 1.2 | task-agent | Done (Baked) | G3 | Standby |
| 1.3 | developer | Saved + committed (25cdf48) + stopped | G5 | Standby |
| 1.4 | script-PO | Done | — | Standby |

## Subscription
- **~90% used** (TUI reading, tool shows 72%), resets 18:00 Berlin
- Alert: STANDBY ENFORCED — only SM monitoring active
- Tool unreliable — TUI is source of truth

## Deliveries This Session
- SM SKILL.md reduced 919→203 lines (agent-trainer, commit 09e923d)
- Expert/trainer compacted and rebooted successfully

## CMM Observation
- Standby enforcement: L3 (deterministic — all agents stopped, accept-edits barriers held)
- Weakest link: subscription tool accuracy (tool says 72%, TUI says 90%)

## Goals Reference
- G1: CMM4 team
- G2: Restore lost functionality
- G3: Team self-management
- G4: Subscription monitoring
- G5: Software delivery
