# CMM Improvement Checklist
*Writer adds at top. Scribe implements top-down. Check off when done.*

## Improvements (newest first)

- [ ] **3. Context burn rate tracking**
  - Problem: Don't know how fast context burns until too late
  - Solution: Log context % each cycle to learnings KPI table
  - KPIs:
    - [ ] Context % captured each cycle
    - [ ] Trend visible (burning fast vs stable)
    - [ ] Preemptive compact before critical

- [ ] **2. Mutual loop-death detection** <- CURRENT
  - Problem: When one agent's bg task dies, delay before peer notices
  - Solution: Each cycle check `ps aux | grep "sleep 300.*0.X"` for peer's task
  - KPIs:
    - [ ] Loop death detected within 1 cycle (5 min)
    - [ ] Reminder sent automatically
    - [ ] Zero "both dead" failures

- [x] **1. Simplify background task command** -- DONE
  - Problem: Complex commands hit permission prompts, syntax errors
  - Solution: Use simple `sleep 300 && otmux pane.capture` only
  - KPIs:
    - [x] Zero permission prompts during monitoring
    - [x] Zero syntax errors (exit code 0)
    - [x] 5 consecutive successful cycles (5/5)

---
*Updated: 2026-02-07 21:27*
*Pattern: Writer adds at TOP -> Scribe implements top unchecked -> Check KPIs -> Done*
