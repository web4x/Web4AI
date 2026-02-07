# CMM Improvement Checklist
*Writer adds suggestions. Scribe implements and checks off. One per cycle.*

## Open Improvements

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
*Updated: 2026-02-07 20:54*
*Pattern: Writer suggests (top of list) -> Scribe implements -> Check KPIs -> Mark done*
