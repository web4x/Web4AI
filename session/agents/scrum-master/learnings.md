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

## Session 2026-06-10 Learnings
- **Visible heartbeat:** TRON wants the wait visible — use ONE `sleep N && echo "<tick>"` run_in_background (1 shell), NOT invisible ScheduleWakeup. A single one-shot wait is compliant (ban is on poll-loops + per-task swarms). Relaunch exactly ONE each tick → stays at "1 shell".
- **EARLIER-REWIND threshold:** save+rewind at ~800k "/clear to save", NOT at 1-2% "Context low". At 1% the /rewind keystrokes get consumed as prompt input (burns 1%→0% before the picker opens). agent-trainer confirmed this near-miss on robbin-expert.
- **agent.unblock pitfall:** it sends "Down+Enter (option 2)". Correct for 3-option edit prompts (option2=allow-all) but WRONG for 2-option "1.Yes/2.No" proceed prompts (option2=No → REJECTS the action). For Yes/No prompts send "1" Enter directly. For 3-option read/edit allow prompts send "2".
- **SM cannot bypass classifier:** harness denies SM-flush / directing-another-agent's-/permissions / laundering scripts as "Auto-Mode Bypass ... user authorization cannot clear." Hard safety boundary. When all writers are classifier-gated: agents' own retry loops + (optionally) a TRON settings allowlist are the only paths. NEVER attempt bypass.
- **Classifier recovery is per-instance staggered** — one agent's Bash success does NOT mean another's gate lifted. Don't relay "retry, classifier recovered" based on a different agent's success.
- **#82/S19 commits land in the PRODUCT repo** (/Users/Shared/Workspaces/2cuGitHub/Web4RawBin), NOT the AI/Claude repo — my git log here only shows agent context-saves. Check the product repo for sprint deliverables.
- **Sonnet 4.6 here = 200k context (NOT 1M)** — only Opus 4.8 has the [1m] variant. Never switch a large-context pane (this SM ~900k) to Sonnet; it'd be 464% over the 200k window.
- **Utilization metric (CMM4):** sample all agents every tick → TSV (ts/pane/agent/state/reason); proved 5/7 at 0% active during the classifier cascade — converts "felt" idle to measured.
- **Team can be recreated:** robbinTeam killed → robbinTeam2 with a NEW pane map (all window 0). Use `otmux tree` to relearn layout on any "team recreated" signal.

## Session 2026-06-11 Learnings
- **Remote-Control panes block my keystrokes (with one exception).** When a pane shows "Remote Control active" AND already has text staged in its input, my otmux keystrokes (Enter, C-u, Esc, BSpace) do NOT submit/clear it — the connected claude.ai/code (mobile/web) session owns the keyboard. Tried repeatedly on oosh-architect, agent-trainer, oosh-expert: staged text persisted/reappeared. STAND DOWN and escalate to TRON; do not fight it (you'll spam and collide). **EXCEPTION:** keystrokes DO land on an RC pane when its input is EMPTY — oosh-po accepted my save-order on an empty prompt. So: empty-input RC pane = drivable; staged-input RC pane = TRON-only.
- **Confirmed by TRON:** "Remote Control has priority. Do not clear, do not fight." It is not a bug to fix; it's a priority handoff. Report state-changes only.
- **idle downstream ≠ unsent dispatch.** Before firing UNSENT-CATCH because req/architect are idle, VERIFY the work isn't simply DONE — check commits / task-status / ask the PO for evidence. I flagged "Room member IORs unsent" because 0.4/0.5 were idle; robbin-po proved R19.35 was already shipped+tester-verified (v0.5.156, Room.ts:282, 876/876) and correctly REFUSED to re-dispatch (would duplicate). Idle can mean COMPLETED, not pending.
- **Verify burn via TOKEN-COUNT delta, never sweep state.** team.sweep flickers high-context idle agents to ACTIVE (oosh-po showed ACTIVE at 945k but the "/clear to save 945.6k" number never moved = no burn). Idle agents don't burn context. Only a DROPPING token number is real burn warranting emergency action. Stable-at-945k-idle is safe to leave for a planned rewind.
- **Reconcile TRON-vs-PO contradictions; don't pick a side.** TRON said model "lacking member IORs"; robbin-po had commit-backed evidence it shipped. Right move: surface the contradiction back to TRON WITH the PO's evidence, hold the PO from acting, let TRON decide (resolved vs specific-gap). Prevents both duplicate work and missing a real gap.
- **Multi-rewind catch-22 under RC:** when the rewinder (agent-trainer) is itself RC-blocked AND TRON is away, queued rewinds CANNOT be executed by SM. But saved+idle agents stay SAFE indefinitely (no burn). Do NOT attempt a risky manual PO rewind (multi-step picker on an RC pane risks option-1 code-revert). Contained-and-waiting beats forced-and-broken. Escalate thoroughly once, don't re-ping.
- **Deep-check catches what sweeps miss:** the every-~10-tick "capture status bars of always-same agents" check is what caught oosh-po@945k + oosh-expert@816k — both had shown only steady ACCEPT_EDITS/ACTIVE in sweeps for many ticks. Schedule it even during long quiet stretches.
