# Knowledge Base — O (Overviews)

*3-5 lines per topic. Each ends with a pointer to its detail file.*

---

### 1. otmux send Reliability
Claude TUI doesn't process remote keystrokes like a terminal.
9 known failure modes. NEVER send Escape — poisons buffer irreversibly.
Fix: `otmux send.verified` (805aecc) — captures before/after, confirms delivery.
-> Details: [otmux-send.md](otmux-send.md)
-> Actions: [send-message.md](actions/send-message.md)

---

### 2. Context Measurement
JSONL token counting (Task 58) replaced broken pane scraping. JSONL and TUI show different numbers (different denominators).
NEVER ASSUME — ALWAYS MEASURE. assume = ass|u|me.
Run `claudeCode context.read` before panicking.
-> Details: [context-measurement.md](context-measurement.md)
-> Actions: [check-context.md](actions/check-context.md)

---

### 3. Peer Monitoring Pattern
Neither agent can self-care. Together both can. Background loops watch each other.
Between cycles: WORK, don't idle. Passive loops = "standing by" = death.
Adapt loop interval to activity level — 5 min when working, longer when conserving.
-> Details: [peer-monitoring.md](peer-monitoring.md)
-> Actions: [monitoring-cycle.md](actions/monitoring-cycle.md)

---

### 4. CMM Improvements Pipeline
9 improvements: #1-6 DONE, #7 OPEN, #8 IN PROGRESS (2/3), #9 IN PROGRESS (4/6).
Pull system: writer adds ONLY when scribe completes one. Living pipeline, never "done."
-> Details: [cmm-pipeline.md](cmm-pipeline.md)
-> Actions: [implement-improvement.md](actions/implement-improvement.md)

---

### 5. Permission Prompts
TUI permission prompts block agents. Wrong option = denied command.
Two patterns: "1.Yes/2.No" (send 1) vs "1.Yes/2.Yes,allow" (send 2). READ OPTIONS FIRST.
Permissions reset on /compact (unfixed). Compound `&&` commands don't match settings.json patterns.
-> Details: [permission-prompts.md](permission-prompts.md)
-> Actions: [unblock-permission.md](actions/unblock-permission.md)

---

### 6. Compaction and Recovery
Context shrinks each cycle. Recovery must be deterministic. Cold start loses A first (infrastructure), compaction loses W first (prompts).
Pre-compact: save state. Post-compact: read learnings FIRST, then context, then check peer.
Restore peer via `claude --resume`, NOT fresh `claude`.
-> Details: [compaction-recovery.md](compaction-recovery.md)
-> Actions: [compact-peer.md](actions/compact-peer.md), [recover-after-compact.md](actions/recover-after-compact.md)

---

### 7. Team Delegation
Orchestrator team implements OOSH fixes. Scribe delegates and tracks.
Team completed Tasks 41-58 + send.verified + dashboard. Communication: file-based preferred.
-> Details: [team-delegation.md](team-delegation.md)
-> Actions: [delegate-task.md](actions/delegate-task.md)

---

### 8. Scribe Identity
The knowledge base is my primary output. Monitoring is a duty, not the goal.
"Standing by" between cycles = failure. Tasks are ONGOING, not checklists to finish.
-> Details: [scribe-identity.md](scribe-identity.md)

---

### 9. Infrastructure Resilience
tmux sessions are not permanent. External destruction kills the duo silently.
Pane references become hallucinations after infrastructure change.
After ANY gap > 1hr: verify infrastructure BEFORE trusting context files.
-> Details: [infrastructure-resilience.md](infrastructure-resilience.md)
-> Actions: [cold-start-recovery.md](actions/cold-start-recovery.md)

---

### 10. Root Cause: PATH and Permissions
OOSH was **already on PATH** via `~/.bashrc`. The `export PATH=...` every agent prepended was unnecessary.
Agents made simple commands compound by copying an untested SKILL.md pattern — classic ASSUME failure.
Fix: just stop prepending. Commands work directly. Remove mandatory export from all SKILL.md files.
-> Details: [path-and-permissions.md](path-and-permissions.md)
-> Actions: [fix-path.md](actions/fix-path.md)

---

### 11. Training Pipeline
Trainer creates Reading Lists in SKILL.md -> idle agents consume them -> write context files -> check for work.
Three-step delegation: PO -> trainer -> curriculum -> consumers. Proved in Ch8 (expert 7/7, tester 8/8).
Throughput bottleneck: pipeline only activates agents that receive the directive.
-> Details: [training-pipeline.md](training-pipeline.md)
-> Actions: [train-agent.md](actions/train-agent.md)

---

### 12. Generational Transition
Agents burn context through productive work. When context runs out, they compact and a fresh instance boots.
The dying generation's output (curriculum, KB, context files) prepares successors — structurally, not intentionally.
Context file as bridge: 57 lines written, 57 lines read. Nuance lost, task continuity preserved.
-> Details: [generational-transition.md](generational-transition.md)
-> Actions: [manage-handoff.md](actions/manage-handoff.md)

---

### 13. Orchestrator Emergence
Designed to coordinate; became a heartbeat. Found the highest-value action (Enter in SM's pane) and did only that.
59 minutes continuous, 17.2k tokens consumed, minimal correct outputs. Emergence, not design.
-> Details: [orchestrator-emergence.md](orchestrator-emergence.md)

---

### 14. Measurement System (CMM4)
4 metrics needed: token usage, velocity, context %, subscription window. Tools exist but broken.
Expert fixes tools, SM runs measurement cadence, scribe maintains persistent log.
Sweep log: `session/metrics/sweep-log.md`. CMM target: CMM1/2 → CMM3/4.
-> Details: [measurement-system.md](measurement-system.md)
-> Actions: [log-metrics.md](actions/log-metrics.md)

---

### 15. Anti-Patterns (BANNED)
Three banned patterns: error suppression (`2>/dev/null`), dashes in OOSH parameter names, hardcoded pane addresses.
These are framework-level constraints, not style preferences. Violating any will cause crashes or silent failures.
-> Details: [anti-patterns.md](anti-patterns.md)

---

### 16. OOSH Parameter Naming
OOSH parameter names MUST be valid bash identifiers (letters, numbers, underscores only — no dashes).
OOSH converts `<param>` to `PARAM_param` via `declare`. Dashes cause bash arithmetic errors.
Detection: `grep -E '# <[a-zA-Z0-9]*-' scriptname`
-> Details: [oosh-parameter-naming.md](oosh-parameter-naming.md)

---

### 17. Mass Context Exhaustion Recovery
All 11 agents hit 0% simultaneously — 40 min chaos. Recovery order = hierarchy: SM first → orchestrator → workers.
0% context = /clear only (/compact can't work). Max 2 large tasks in parallel. SM must monitor context %.
-> Details: [incidents/20260217-mass-context-exhaustion.md](incidents/20260217-mass-context-exhaustion.md)
-> Actions: [recover-mass-context-exhaustion.md](actions/recover-mass-context-exhaustion.md)

---

### 18. tmux Color Degradation
tmux renders using the **lowest-capability terminal** among all attached clients. One stale client without `Tc`/`RGB` drags ALL panes to black-and-white.
Diagnose: `tmux info | grep -iE "256|color|RGB|Tc"`. Fix: detach stale clients (`tmux detach-client -t /dev/ttyXXX`).
Composed capability = weakest link (CMM #1). Env vars are necessary but not sufficient — always measure after window switch.
-> Details: [tmux-color-degradation.md](tmux-color-degradation.md)
