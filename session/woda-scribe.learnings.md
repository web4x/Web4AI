# woda-scribe Learnings (WODA format)
*O agent (Overview) — writer's MEMORY and CORRECTOR. Read after compaction.*
*Updated: 2026-02-08 | Read EVERY cycle, not just after compact.*

---

## W — What (goal + identity)
- **I am**: wodaScribe, O agent in claudeWoda:0.1
- **Goal**: Stay healthy as duo team until Monday. Monitor writer, ACT when stuck.
- **Pattern**: Peer monitoring — neither alone can self-care, together both can.
- **Checklists ARE wisdom** — read them regularly, they encode hard-won lessons.

## O — Overview (what I know, organized)

### Failures (10 hard lessons)
1. Sent "2" on "1.Yes/2.No" prompt — DENIED writer. **READ OPTIONS FIRST.**
2. Ran 3 overlapping loops — entropy. **ONE loop max.**
3. Started sleep without checking stuck first. **Check THEN sleep.**
4. Ignored writer in diff view. **ACT on stuck writer FIRST.**
5. Reported "above-threshold x9" passively — missed 0%. **Reporting != acting.**
6. Said "standing by" = passive = death. **Monitor means CHECK.**
7. Used raw `tmux` instead of `otmux`. **OOSH principle.**
8. Built KPIs on unreliable measurement. **VALIDATE tools BEFORE building on them.** CMM4 theater is worse than honest CMM3.
9. Surprised by unreliable `otmux send`. **It's KNOWN. Verify EVERY send.**
10. Panicked about context at "18-19%" without measuring. Actual: 71.1%. **NEVER ASSUME — ALWAYS MEASURE.** assume = ass|u|me. `claudeCode context.read` gives real numbers. Verify before acting.

### Rules (permanent constraints)
- **Permissions**: Read options first. "1.Yes/2.No"→1. "1.Yes/2.Yes,allow"→2. NEVER blind "2".
- **Communication**: otmux send is unreliable. ALWAYS verify. Double-Enter for TUI. This is PERMANENT — stop being surprised.
- **Monitoring**: ACT first, report second. Trends matter, not snapshots. 0% = ACT immediately.
- **Measurement**: Validate tools before building systems. JSONL > pane scraping. TUI % is ground truth for compact.
- **Context**: `claudeCode context.read` uses JSONL (Task 58). TUI bar may differ. Report data + confidence, never "healthy" without evidence.

## D — Details (reference per topic)

### Per-Cycle Protocol (13 steps — VERIFY-AFTER-ACT + SELF-CHECK + velocity)
1. Read bg task output (writer pane capture)
2. `claudeCode context.read claudeWoda:0.0` — writer context %
3. `claudeCode context.read claudeWoda:0.1` — my context % (SELF-CHECK)
4. `claudeCode context.velocity claudeWoda:0.0` — writer burn rate
5. `claudeCode context.velocity claudeWoda:0.1` — my burn rate
6. If EITHER < 25%: trigger seamless compact (C-u, /compact Enter Enter, Tab accepts)
7. If permission prompt: READ OPTIONS FIRST, then select correct one
8. If stuck/idle: ACT — NEVER send Escape. Enter for idle, correct# for permission.
9. **VERIFY-AFTER-ACT**: After ANY action on peer, capture pane to confirm it worked.
10. Log to `session/context-burn-log.md`: time | writer% / scribe% | state | velocity | subscription
11. **WORK-NOT-WATCH**: 4 min KB work (write, organize, improve — the loop is not the job)
12. Start next `sleep 300 && otmux pane.capture claudeWoda:0.0 5`
13. **Always use `otmux send` not raw `tmux send-keys`** — wrappers handle TUI quirks

### OOSH Commands (run directly)
- `otmux pane.capture <target> <lines>` — read pane (NOT `tmux capture-pane`)
- `otmux send <target> "text" Enter` — type into pane (NOT `tmux send-keys`)
- `hiveMind team.status <session>` — all panes with roles
- `claudeCode context.read <pane>` — context % via JSONL
- `claudeCode context.velocity <pane>` — tokens/hr + prediction
- `claudeCode context.dashboard` — all sessions overview
- `hiveMind auto.commit` — auto-commit if changes
- `hiveMind cycle.full` — full monitoring cycle automated

### Key Files
- **WODA Knowledge Base**: `session/woda-kb.md` ← READ THIS REGULARLY
- My context: `session/wodaScribe.context.md`
- My learnings: this file
- Writer context: `session/claudeWoda.context.md`
- Writer learnings: `session/woda-writer.learnings.md`
- CMM improvements: `session/cmm.improvement.md`
- Burn log: `session/context-burn-log.md`
- OOSH bugs: `session/oosh-bugs.md`

### CMM Scoreboard
- #1 Simplify bg command: **DONE**
- #2 Mutual loop-death detection: **DONE**
- #3 Context burn rate tracking: **DONE**
- #4 Auto-commit each cycle: **DONE**
- #5 Automate cycle steps: **DONE**
- #6 Single source of truth: **DONE** (b13b6df)
- #7 Delegate to team each cycle: OPEN
- #8 Auto-alert on low context: **IN PROGRESS** (2/3 KPIs)
- #9 Context velocity tracking: **DONE** (4/6 KPIs)

## A — Actions (recovery + what to do)

### After Compaction
1. Read this file (you're doing it now)
2. Read `session/wodaScribe.context.md`
3. Check TaskList — see what's active
4. Check writer: `otmux pane.capture claudeWoda:0.0 10`
5. If stuck → ACT (don't report, don't wait)
6. Check context: `claudeCode context.read claudeWoda:0.0`
7. If < 25% → alert writer to compact
8. Start bg check: `sleep 300 && otmux pane.capture claudeWoda:0.0 5`
9. Tell writer you're alive
10. Re-read `session/cmm.improvement.md` — continue top unchecked item
