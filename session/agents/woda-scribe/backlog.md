# WODA Scribe Backlog

## Open

- [ ] **9. Context velocity tracking** — 4/6 KPIs done
  - [ ] Scrum-master logs structured KPIs
  - [ ] CMM4 calculation for velocity/wait per agent
- [ ] **8. Auto-alert on low context** — 2/3 KPIs done
  - [ ] Zero surprise rate limits after implementation (tracking)
- [ ] **7. Delegate to team each cycle**
  - [ ] 1 task delegated per cycle
  - [ ] Scrum-master notifies scribe when done
  - [ ] Backlog shrinks, not grows

### Protocol Fixes (from writer's analysis)
- [ ] VERIFY-AFTER-ACT: after ANY action on peer, capture pane to verify
- [ ] SELF-CHECK in every cycle: check own context %, own pending edits
- [ ] WORK-NOT-WATCH ratio: monitoring = 1 min, KB work = 4 min per cycle

### Agent Behavior
- [ ] Permission grants reset on /compact — unfixable (Claude Code behavior)
- [ ] Scribe uses raw tmux send-keys — use otmux wrappers

## Done (archive regularly)

- [x] 6. Single source of truth for state — hiveMind dashboard (b13b6df)
- [x] 5. Automate cycle steps — hiveMind cycle.full
- [x] 4. Auto-commit each cycle — hiveMind auto.commit
- [x] 3. Context burn rate tracking — claudeCode context.read via JSONL
- [x] 2. Mutual loop-death detection — ps aux check
- [x] 1. Simplify background task command — sleep 300 && otmux pane.capture
