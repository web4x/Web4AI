# WODA Knowledge Base
*Scribe's structured knowledge. Every topic follows W-O-D-A. Continuously maintained.*
*Updated: 2026-02-08 18:00*

---

## 1. otmux send Reliability

**W** — `otmux send` silently fails. No delivery guarantee. 9 known failure modes.

**O** — Core issue: Claude TUI doesn't process remote keystrokes like a terminal. Enter=newline not submit. Escape inserts literal `^[` that poisons buffer permanently. Tab doesn't accept edits. No feedback on failure. **FIX: `otmux send.verified` (805aecc) now available** — captures before/after, confirms delivery.

**D** — Failure modes (documented in `session/oosh-bugs.md`):
1. Single Enter = newline, not submit (need double-Enter)
2. Messages queue behind permission dialogs
3. Tab doesn't accept pending edits
4. Rapid sends cause spam ("2222")
5. No failure feedback
6. C-u/C-a/C-k show as literal chars in TUI
7. **NEVER send Escape** — poisons buffer irreversibly, 12 cycles stuck
8. New agent != restored peer — use `claude --resume` first
9. `otmux send.verified` method: send + verify via pane capture (805aecc)

**A** — Use `otmux send.verified` for ALL sends. Never raw `otmux send`. Never send Escape to TUI. If buffer poisoned, only manual keyboard input fixes it.

---

## 2. Context Measurement

**W** — Need reliable context % to prevent surprise compactions. TUI and JSONL disagree.

**O** — JSONL token counting (Task 58, ea22cb2) replaced broken pane scraping. But JSONL and TUI show different numbers (JSONL 70% while TUI shows 10%). Root cause: different denominators. **NEVER ASSUME — ALWAYS MEASURE.** assume = ass|u|me. Run `claudeCode context.read` before panicking.

**D** — Tools:
- `claudeCode context.read <pane>` — JSONL % (trends)
- `claudeCode context.velocity` — tokens/hr + prediction
- `claudeCode context.dashboard` — all sessions overview
- `hiveMind dashboard` — single source of truth (b13b6df)
- TUI bottom bar — ground truth for auto-compact threshold

**A** — JSONL for trends. TUI for compact decisions. Report BOTH. Never say "healthy" without data. Never panic without measuring first.

---

## 3. Peer Monitoring Pattern

**W** — Neither agent can self-care. Together both can. Background loops watch each other.

**O** — Each agent runs `sleep 300 && otmux pane.capture` on peer. Check peer loop alive via `ps aux | grep`. If dead, nudge. **Between cycles: WORK, don't idle.** Passive loops = "standing by" = death.

**D** — Protocol: 10-step cycle in `woda-scribe.learnings.md`. Writer checks me from 0.0, I check writer from 0.1. Mutual detection within 5 min. `hiveMind cycle.full` automates the full cycle.

**A** — Every cycle: check loop, check context, alert if <25%, act if stuck. Between cycles: maintain KB, curate improvements, update files. Never passive.

---

## 4. CMM Improvements Pipeline

**W** — Systematic improvement of monitoring capabilities. Living pipeline, never "done."

**O** — 9 improvements: #1-6 DONE, #7 OPEN, #8 IN PROGRESS (2/3 KPIs), #9 DONE (4/6 KPIs). Key completions today: #4 auto.commit, #5 cycle.full, #6 dashboard, send.verified. Pull system: writer adds ONLY when scribe completes one.

**D** — Full list: `session/cmm.improvement.md`. Key methods: `hiveMind auto.commit` (dea9b54), `hiveMind cycle.full` (dea9b54), `hiveMind dashboard` (b13b6df), `otmux send.verified` (805aecc), `claudeCode context.velocity` (b2f6892).

**A** — Curate continuously. Update when team completes work. Verify KPIs with real data. Next: close #8 (sustained zero surprise rate limits), advance #7 (delegate to team each cycle).

---

## 5. Permission Prompts

**W** — TUI permission prompts block agents. Wrong option = denied command.

**O** — READ OPTIONS FIRST. Two patterns: "1.Yes/2.No" (send 1) vs "1.Yes/2.Yes,allow from project" (send 2). Use `otmux send.verified` to respond. Permissions reset on /compact (unfixed, Claude Code behavior).

**D** — Fixed by team: sweep.detect Yes/No (Task 41), compound commands (Task 57), overlay detection (Task 46). Open: permission reset on compact.

**A** — Capture pane, read options, send correct number via `send.verified`, verify response.

---

## 6. Compaction & Recovery

**W** — Context shrinks each cycle. Recovery must be deterministic.

**O** — Pre-compact: save context + learnings + KB. Post-compact: read learnings FIRST (WODA format), then context, then check peer. **Restore peer via `claude --resume`, NOT fresh `claude`.** New agent loses history. Auto-resume hook sends prompt after 15s but pending edits may block.

**D** — Recovery files: `woda-scribe.learnings.md` (WODA wisdom), `wodaScribe.context.md` (state), `woda-kb.md` (this file), `cmm.improvement.md` (pipeline). Recovery steps in learnings section A.

**A** — At <25%: alert. At <10%: urgent. Save BEFORE compact. After: follow protocol exactly. For peer recovery: `claude --resume` first, fresh `claude` only as last resort.

---

## 7. Team Delegation

**W** — Orchestrator team implements OOSH fixes. Scribe delegates and tracks.

**O** — Team completed: Tasks 41-58 + send.verified (805aecc) + dashboard (b13b6df). Team: orchestrator (0.0), SM (0.1/0.6), expert (0.2), tester (0.3) at cursorOrchestrator.

**D** — Bug list: `session/oosh-bugs.md`. Coordination: `session/tasks/coordination-*.md`. Communication: file-based preferred (write task file, agent reads it).

**A** — Each cycle: check if team completed anything. Update KB + checklist. Delegate from backlog. Track in bugs file.

---

## 8. Scribe Identity (meta)

**W** — I am the scribe. My job is the knowledge base. Not monitoring loops. Not one-time tasks.

**O** — The KB is my primary output. Monitoring is a duty, not the goal. Tasks are ONGOING, not checklists to finish. "Standing by" between cycles = failure. Passive loops for 2 hours = "standing by" with extra steps.

**D** — Ongoing duties: (1) Maintain KB — update topics, add learnings, prune stale info. (2) Monitor writer — act when stuck, not just report. (3) Curate CMM pipeline — track completions, verify KPIs. (4) Commit regularly — auto.commit or manual.

**A** — Each cycle: monitor (2 min) + KB work (3 min). Never just wait. Read task list. Read KB. Find what's stale. Update it. That's the job.

---

*This KB is never "done." Update continuously. Each topic: W-O-D-A. Prune stale info.*
