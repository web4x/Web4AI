# WODA Knowledge Base
*Scribe's structured knowledge. Every topic follows W-O-D-A. Read regularly.*
*Updated: 2026-02-08 13:20*

---

## 1. otmux send Reliability

**W** — `otmux send` silently fails. No delivery guarantee. 7 known failure modes.

**O** — Issues: (1) Enter=newline not submit, (2) queued behind dialogs, (3) Tab/Escape unreliable, (4) rapid sends=spam, (5) no failure feedback. Workaround exists. Fix delegated.

**D** — Failure modes documented in `session/oosh-bugs.md` under "otmux send Reliability". Workaround: after ANY send, `sleep 3 && otmux pane.capture` to verify. Fix request: `otmux send.verified` method delegated to cursorOrchestrator Expert.

**A** — Tasks: #5 delegate fix (in progress), #6 document modes (done), #7 bake verify into protocol (pending).

**NEW failure mode #8**: Once `^[` (Escape chars) pollute TUI input buffer, NO remote keystrokes can clear it.

**Failure mode #9 (SCRIBE)**: When peer dies, use `claude --resume` to RESTORE the session, not `claude` to create new. New agent reads files but loses conversation history/learned behavior. Always try resume first.

 C-u, C-a, C-k, Escape, Tab, Enter all fail or add more junk. Only manual keyboard input works. Root cause: sending Escape via otmux inserts literal `^[` into Claude TUI input instead of triggering Escape action. **NEVER send Escape to Claude TUI via otmux.**

---

## 2. Context Measurement

**W** — Need reliable context % to prevent surprise compactions. TUI and JSONL disagree.

**O** — Pane scraping was wrong approach (CMM4 theater). Task 58 built JSONL token counting. Task 58 bugfix (ea22cb2) cleaned up. But TUI shows 8-10% while JSONL shows 65-70%. TUI is ground truth for auto-compact threshold.

**D** — Tools: `claudeCode context.read <pane>` (JSONL %), `claudeCode context.velocity` (tokens/hr), `claudeCode context.dashboard` (all sessions). Known discrepancy: JSONL counts tokens used, TUI counts context window remaining — different denominators. Max tokens hardcoded 200k but actual model limit may differ.

**A** — Use JSONL for trends/velocity. Use TUI % (from pane.capture) for compact decisions. Report BOTH when available. Never say "healthy" without data.

---

## 3. Peer Monitoring Pattern

**W** — Neither agent can self-care. Together both can. Background loops watch each other.

**O** — Each agent runs `sleep 300 && otmux pane.capture` on peer. Each cycle checks peer's loop alive via `ps aux | grep`. If dead, nudge. Proven: caught writer loop death, nudged, restarted.

**D** — Protocol: step 5 checks writer loop. CMM improvement #2 (DONE). Writer checks me from 0.0. I check writer from 0.1. Mutual detection within 5 min.

**A** — Every cycle: check loop, check context, alert if < 25%, act if stuck. Never passive. Never "standing by".

---

## 4. CMM Improvements Pipeline

**W** — Systematic improvement of monitoring capabilities. Writer adds, scribe implements.

**O** — 9 improvements total. #1-5 DONE, #8 IN PROGRESS (2/3 KPIs), #9 DONE (4/6 KPIs), #6-7 OPEN. Pull system: writer adds ONLY when scribe completes one.

**D** — Full list in `session/cmm.improvement.md`. Scoreboard in `session/woda-scribe.learnings.md` under CMM Scoreboard. Key methods: `hiveMind auto.commit`, `hiveMind cycle.full`, `claudeCode context.velocity`, `claudeCode context.dashboard`.

**A** — Next: complete #8 (need zero-surprise-rate-limit KPI sustained). Then #6 or #7.

---

## 5. Permission Prompts

**W** — TUI permission prompts block agents. Wrong option = denied command. Must read first.

**O** — Two patterns: "1.Yes/2.No" (send 1) vs "1.Yes/2.Yes,allow from project" (send 2). Blind "2" caused denial. `sweep.detect` now handles Yes/No (Task 41). Permissions reset on /compact (unfixed).

**D** — Bugs: sweep.detect fixed (Task 41). Permission reset on compact — open, Claude Code behavior. Compound commands fixed (Task 57). Background overlay detection fixed (Task 46).

**A** — Always READ OPTIONS from pane capture before sending number. Verify after sending.

---

## 6. Compaction & Recovery

**W** — Context shrinks each cycle. At 0% = auto-compact. Recovery must be deterministic.

**O** — Pre-compact: save context file + learnings. Post-compact: read learnings FIRST, then context, then check peer. Auto-resume hook sends prompt after 15s. Pending edits may block resume.

**D** — Files: `wodaScribe.context.md` (state), `woda-scribe.learnings.md` (wisdom, WODA format), `woda-kb.md` (this file). Recovery steps in learnings file section A.

**A** — At < 25%: alert peer. At < 10%: urgent alert. Save state BEFORE compact. After compact: follow recovery protocol exactly. Don't improvise.

---

## 7. Team Delegation

**W** — Orchestrator team at cursorOrchestrator has capacity. Expert + Tester implement OOSH fixes.

**O** — Completed: Tasks 41, 46-58. Team: orchestrator (0.0), scrum-master (0.1/0.6), expert (0.2), tester (0.3). Communication via file or otmux send. SM notifies when done.

**D** — Bug list: `session/oosh-bugs.md` (14 bugs, 12 fixed). Coordination: `session/tasks/coordination-*.md`. Current delegation: `otmux send.verified` method.

**A** — Each cycle: check if team completed anything. Delegate 1 item from backlog. Track in bugs file.

---

*Add new topics as they arise. Each must have W-O-D-A structure. Keep entries concise.*
