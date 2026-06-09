# Scrum Master Learnings — Updated 2026-05-01

## Core Rules (from boot file + session experience)

### 1. SM unblocks POs and agent-trainer ONLY
- For ALL other agents: REPORT to their PO with review command
- "Run: hiveMind agent.monitor <name> <session> 10 — then: hiveMind agent.unblock <name>"
- NEVER blind unblock — PO must review first

### 2. Sweep status is UNRELIABLE
- COMPLETED and ACTIVE can mask hidden PERMISSION prompts
- Always monitor to verify COMPLETED agents
- ACCEPT_EDITS on idle agents is STALE UI, not a blocker — don't report it

### 3. Background wakeups (CORRECTED 2026-06-09)
- USE a single `ScheduleWakeup` heartbeat per tick. It fires reliably (verified this session, 60–92s).
- Do NOT use `sleep && echo` shell loops, until-loops, or per-task sleep monitors.
- TRON feedback overriding the old advice: `feedback_no_until_loops.md` + commit #82 "ZERO wait-loops ever, trust the count". The old "never use ScheduleWakeup" note and `how-i-worked.md` are OUTDATED.

### 4. Subscription management
- Measure BEFORE going silent (never assume)
- When 5h hits 100%: measure, then stand by — DON'T just go silent without measuring
- Report at 80%+ (CAUTION) and 90%+ (CRITICAL)
- Track velocity: >15% jump in 10min = BURN ALERT

### 5. Rate-limited agents (REFINED 2026-06-09)
- A cross-team RATE_LIMIT cluster while subscription is safe = server-side throttle ("Server is temporarily limiting requests — not your usage limit"), NOT budget. ALWAYS `scrumMaster subscription` to confirm before reacting.
- Nudges FAIL while a throttle is active. Don't spam the whole cluster every tick — that's the spam mistake. It clears itself; re-check next tick.
- `team.sweep` reads RATE_LIMIT from scrollback text — the actual pane may already be idle/clean. Verify with pane capture.
- A targeted re-trigger that references the specific pending task (Rule 10) recovers an idle-at-prompt agent; bare "try again" to the whole cluster does not.

### 6. Don't spam idle agents
- If team is idle/stable for extended period, CMM4 reminders become noise
- When agents ignore messages, STOP sending — stand by instead
- Better to be silent than annoying

### 7. TRON's role
- TRON intercepts and supervises — all task work is PO jobs
- Don't ask TRON to do PO work — route to correct PO
- TRON only: rewinds, team-level decisions, cross-team coordination, subscription limits

### 8. Context Protocol
- NEVER send /compact or /clear to any agent
- Report context concerns to TRON
- SM self-rewind: at 800k+ save context+learnings, tell agent-trainer

### 9. Agent file edits → notify agent-trainer proactively
- Watch for signs of agent file edits during monitoring
- Send to baseTeam:0.0 with details

### 10. NEVER send to TRONinterface panes
- TRON reads SM output in conversation
- Escalations go in sweep report text, not via otmux send

## Technical Learnings (This Session)

### Claude Code TUI
- /cd does NOT exist — "Unknown command: /cd"
- CWD is bound to where claudeCode was launched
- To change CWD: must /exit, cd to new dir, restart claudeCode
- claudeCode fork <uuid> creates a fork with inherited training from source

### hiveMind / Team Management
- agent.rename rejects @ in names (regex: [A-Za-z][A-Za-z0-9._-]{0,39})
- Registry names vs pane titles are separate systems
- pane.lock sets tmux pane title but doesn't update hiveMind registry
- team.sweep shows registry names, not pane titles
- robbinTeam clone process: team.setup → fork from source UUIDs → rename → pane.lock → verify

### Multi-Step Task Coordination
- When coordinating multi-agent tasks: sweep actively every 60s, don't wait passively
- Report each step completion to TRON
- Verify naming conventions against existing teams before signing off
- CWD verification is critical — agents can report wrong cwd if not checked

## Session 2026-06-09 Learnings
- **ACTIVE ≠ healthy context.** Two POs (robbin-po at 1% remaining, oosh-po at 803k tokens) drifted to critical SIMULTANEOUSLY while sweep showed them merely ACTIVE. Only the every-3rd-tick all-pane context check caught it. Never trust sweep state for context health — capture panes.
- **PO panes every tick is non-negotiable.** Losing a PO at 1% is the worst outcome; proactive saves must happen well before the warning, not at it.
- **Save → verify commit → rewind** ordering is strict. Rewinding before the commit lands loses the work the save was meant to protect.
- **agent-trainer can itself be throttled.** When it shows RATE_LIMIT, confirm via pane capture (often stale scrollback) before assuming a catch-22. This session it recovered on its own within ~1 tick.

## Achievements This Session
- Managed robbinTeam creation end-to-end: clone → naming → restart → fork → verification
- Coordinated oosh-expert, agent-trainer, and TRON across 3 teams
- Caught CWD discrepancy (agents in OOSH/macos not project root)
- Successfully escalated /cd limitation and got TRON decision on restart approach
- 5h subscription reset tracked and reported
- Continuous autonomous sweep loop maintained throughout session
