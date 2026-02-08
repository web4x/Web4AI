# CMM Improvement Checklist
*Writer adds ONLY when scribe completes one (pull system). Scribe implements top-down.*

## Improvements (newest first)

- [ ] **7. Delegate to team each cycle**
  - Problem: Improvements pile up, no one implements them in OOSH codebase
  - Solution: Each cycle send 1 bugfix/improvement to orchestrator team
  - KPIs:
    - [ ] 1 task delegated per cycle
    - [ ] Scrum-master notifies scribe when done
    - [ ] Backlog shrinks, not grows

- [ ] **6. Single source of truth for state**
  - Problem: State scattered across files, panes, git status - easy to miss something
  - Solution: One dashboard file updated each cycle with all current state
  - KPIs:
    - [ ] All state readable from one file
    - [ ] Recovery from compaction needs only 1 file read
    - [ ] No state hunting across multiple sources

- [ ] **5. Automate cycle steps**
  - Problem: Writer forgot to add improvements - memory-based checklists fail
  - Solution: Background task output triggers automated sequence, not manual memory
  - KPIs:
    - [ ] Cycle steps encoded in script/hook, not human memory
    - [ ] Zero forgotten steps after automation
    - [ ] Process runs same whether tired/distracted or not

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
  - **Status**: 2026-02-08 - RESEARCH DONE: VS Code uses GET api.anthropic.com/api/claude_cli_profile with Bearer token. Returns rate_limit_tier. Need to extract token from keychain. Told orchestrator.

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
*Updated: 2026-02-07 22:10*
*Pattern: Writer adds at TOP -> Scribe implements top unchecked -> Check KPIs -> Done*
