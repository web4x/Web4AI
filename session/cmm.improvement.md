# CMM Improvement Checklist
*Writer adds at top. Scribe implements top-down. Check off when done.*

## Improvements (newest first)

- [ ] **5. Writer cycle checklist**
  - Problem: Writer forgot to add improvements, did only monitoring
  - Solution: Each cycle: (1) check peer (2) push changes (3) ADD improvement (4) restart
  - KPIs:
    - [ ] Zero cycles without new improvement added
    - [ ] Checklist followed every cycle
    - [ ] No more "routine crowded out improvement" failures

- [ ] **4. Auto-commit each cycle**
  - Problem: Changes accumulate, risk losing progress if crash
  - Solution: Each monitoring cycle, check `git status` and commit if changes
  - KPIs:
    - [ ] Zero uncommitted session changes older than 1 cycle
    - [ ] All progress pushed to remote
    - [ ] Recovery after crash loses max 5 min work

- [ ] **3. Context burn rate tracking** <- CURRENT
  - Problem: Don't know how fast context burns until too late
  - Solution: Log context % each cycle to learnings KPI table
  - KPIs:
    - [ ] Context % captured each cycle
    - [ ] Trend visible (burning fast vs stable)
    - [ ] Preemptive compact before critical

- [x] **2. Mutual loop-death detection** -- DONE
  - Problem: When one agent's bg task dies, delay before peer notices
  - Solution: Each cycle check `ps aux | grep "sleep 300.*0.X"` for peer's task
  - KPIs:
    - [x] Loop death detected within 1 cycle (5 min) — mechanism verified, 5 consecutive checks
    - [x] Reminder sent automatically — proven: nudge sent, writer restarted (b97094c)
    - [x] Zero "both dead" failures — zero since implementation

- [x] **1. Simplify background task command** -- DONE
  - Problem: Complex commands hit permission prompts, syntax errors
  - Solution: Use simple `sleep 300 && otmux pane.capture` only
  - KPIs:
    - [x] Zero permission prompts during monitoring
    - [x] Zero syntax errors (exit code 0)
    - [x] 5 consecutive successful cycles (5/5)

---
*Updated: 2026-02-07 21:58*
*Pattern: Writer adds at TOP -> Scribe implements top unchecked -> Check KPIs -> Done*
