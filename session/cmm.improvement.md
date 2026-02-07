# CMM Improvement Checklist
*Writer adds suggestions. Scribe implements and checks off. One per cycle.*

## Open Improvements

### 2. Mutual loop-death detection
- **Problem**: When one agent's bg task dies, delay before peer notices
- **Solution**: Each cycle check `ps aux | grep "sleep 300.*0.X"` for peer's task
- **KPIs**:
  - [ ] Loop death detected within 1 cycle (5 min)
  - [ ] Reminder sent automatically
  - [ ] Zero "both dead" failures
- **Status**: [ ] Pending

### 1. Simplify background task command
- **Problem**: Complex commands hit permission prompts, syntax errors
- **Solution**: Use simple `sleep 300 && otmux pane.capture` only
- **KPIs**:
  - [ ] Zero permission prompts during monitoring
  - [ ] Zero syntax errors (exit code 0)
  - [ ] 5 consecutive successful cycles
- **Status**: [ ] Pending

## Completed Improvements

*(Move here when all KPIs checked)*

---
*Updated: 2026-02-07 21:01*
*Pattern: Writer suggests (top of list) -> Scribe implements -> Check KPIs -> Mark done*
