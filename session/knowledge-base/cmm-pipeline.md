# CMM Improvements Pipeline — Details

## Full List
See `session/cmm.improvement.md` for the canonical list with KPIs.

## Status
| # | Improvement | Status |
|---|------------|--------|
| 1 | Simplify background command | DONE |
| 2 | Mutual loop-death detection | DONE |
| 3 | Context burn rate tracking | DONE |
| 4 | Auto-commit each cycle | DONE |
| 5 | Automate cycle steps | DONE |
| 6 | Single source of truth | DONE (b13b6df) |
| 7 | Delegate to team each cycle | OPEN |
| 8 | Auto-alert on low context | IN PROGRESS (2/3 KPIs) |
| 9 | Context velocity tracking | IN PROGRESS (4/6 KPIs) |

## Key Methods Implemented
- `hiveMind auto.commit` (dea9b54) — auto-commit if changes
- `hiveMind cycle.full` (dea9b54) — full monitoring cycle
- `hiveMind dashboard` (b13b6df) — single source of truth
- `otmux send.verified` (805aecc) — verified message delivery
- `claudeCode context.velocity` (b2f6892) — burn rate tracking

## Pull System Rules
- Writer adds improvement ONLY when scribe completes one
- Scribe implements top unchecked improvement
- Each improvement has explicit KPIs — done means KPIs met, not just code written
- Pattern: Writer adds at TOP -> Scribe implements -> Check KPIs -> Mark done

## Action Checklists
-> session/knowledge-base/actions/implement-improvement.md
