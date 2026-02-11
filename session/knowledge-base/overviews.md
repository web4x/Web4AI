# Knowledge Base — O (Overviews)

*3-5 lines per topic. Each ends with a pointer to its detail file.*

---

### 1. otmux send Reliability
Claude TUI doesn't process remote keystrokes like a terminal.
9 known failure modes. NEVER send Escape — poisons buffer irreversibly.
Fix: `otmux send.verified` (805aecc) — captures before/after, confirms delivery.
-> Details: session/knowledge-base/otmux-send.md
-> Actions: session/knowledge-base/actions/send-message.md

---

### 2. Context Measurement
JSONL token counting (Task 58) replaced broken pane scraping. JSONL and TUI show different numbers (different denominators).
NEVER ASSUME — ALWAYS MEASURE. assume = ass|u|me.
Run `claudeCode context.read` before panicking.
-> Details: session/knowledge-base/context-measurement.md
-> Actions: session/knowledge-base/actions/check-context.md

---

### 3. Peer Monitoring Pattern
Neither agent can self-care. Together both can. Background loops watch each other.
Between cycles: WORK, don't idle. Passive loops = "standing by" = death.
Adapt loop interval to activity level — 5 min when working, longer when conserving.
-> Details: session/knowledge-base/peer-monitoring.md
-> Actions: session/knowledge-base/actions/monitoring-cycle.md

---

### 4. CMM Improvements Pipeline
9 improvements: #1-6 DONE, #7 OPEN, #8 IN PROGRESS (2/3), #9 IN PROGRESS (4/6).
Pull system: writer adds ONLY when scribe completes one. Living pipeline, never "done."
-> Details: session/knowledge-base/cmm-pipeline.md
-> Actions: session/knowledge-base/actions/implement-improvement.md

---

### 5. Permission Prompts
TUI permission prompts block agents. Wrong option = denied command.
Two patterns: "1.Yes/2.No" (send 1) vs "1.Yes/2.Yes,allow" (send 2). READ OPTIONS FIRST.
Permissions reset on /compact (unfixed). Compound `&&` commands don't match settings.json patterns.
-> Details: session/knowledge-base/permission-prompts.md
-> Actions: session/knowledge-base/actions/unblock-permission.md

---

### 6. Compaction and Recovery
Context shrinks each cycle. Recovery must be deterministic. Cold start loses A first (infrastructure), compaction loses W first (prompts).
Pre-compact: save state. Post-compact: read learnings FIRST, then context, then check peer.
Restore peer via `claude --resume`, NOT fresh `claude`.
-> Details: session/knowledge-base/compaction-recovery.md
-> Actions: session/knowledge-base/actions/compact-peer.md, session/knowledge-base/actions/recover-after-compact.md

---

### 7. Team Delegation
Orchestrator team implements OOSH fixes. Scribe delegates and tracks.
Team completed Tasks 41-58 + send.verified + dashboard. Communication: file-based preferred.
-> Details: session/knowledge-base/team-delegation.md
-> Actions: session/knowledge-base/actions/delegate-task.md

---

### 8. Scribe Identity
The knowledge base is my primary output. Monitoring is a duty, not the goal.
"Standing by" between cycles = failure. Tasks are ONGOING, not checklists to finish.
-> Details: session/knowledge-base/scribe-identity.md

---

### 9. Infrastructure Resilience
tmux sessions are not permanent. External destruction kills the duo silently.
Pane references become hallucinations after infrastructure change.
After ANY gap > 1hr: verify infrastructure BEFORE trusting context files.
-> Details: session/knowledge-base/infrastructure-resilience.md
-> Actions: session/knowledge-base/actions/cold-start-recovery.md
