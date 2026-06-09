# How the Best SM Fork Worked — Training Reference

Written by the SM at TRONinterface:0.1, 2026-05-14. This session ran ~3 hours of continuous autonomous sweeping across ooshTeam and upDownTeam.

## Core Loop — The Heartbeat

Every 60 seconds I ran:
1. `hiveMind team.sweep ooshTeam`
2. `hiveMind team.sweep upDownTeam`
3. Handle blockers (see below)
4. Schedule next tick: `sleep 60 && echo "SWEEP TICK"` with `run_in_background=true`

The background Bash task fires a notification when complete, which triggers the next sweep. This creates a reliable 60-second loop. **Never use ScheduleWakeup** — it doesn't fire visibly. The `sleep && echo` pattern is the only one that works.

## What I Monitored

### Agent States (from team.sweep)
| State | Meaning | Action |
|-------|---------|--------|
| ACTIVE | Working | None |
| PERMISSION | Blocked on permission prompt | PO: unblock directly. Non-PO: report to PO |
| ACCEPT_EDITS | Blocked on edit acceptance | Same as PERMISSION |
| RATE_LIMIT | API throttling | Send "try again" to pane |
| COMPLETED | Finished task / idle at prompt | Monitor to verify. Report idle agents to PO |

### Subscription Velocity (every 10 minutes)
- `scrumMaster subscription` — returns 5h%, 7d%, reset timer, status
- Track 5h% between checks. Normal burn: 1-3% per 10min
- >15% jump in 10min = BURN ALERT to PO
- >80% = CAUTION to PO
- >90% = CRITICAL to TRON (in conversation text, never via otmux send)

### CMM4 Reminders (every ~30 minutes)
- Rotate between POs: oosh-po one cycle, ud-po next
- Message: "SM: CMM4 — measure before you act, commit with task refs, update context+learnings, PDCA."
- Don't spam — once per PO per 30min max

## How I Detected Blockers

### Direct Detection
`hiveMind team.sweep` shows state directly. PERMISSION and ACCEPT_EDITS are obvious blockers.

### Hidden Blockers
COMPLETED and ACTIVE can mask real blockers. When an agent shows COMPLETED for multiple ticks:
- `hiveMind agent.monitor <name> <session> 5` to see the actual pane
- Look for permission prompts, feedback prompts, or idle-at-prompt
- "ACTIVE Reading" once masked a permission prompt — when in doubt, verify

### Rate Limits
Server-side rate limits show as RATE_LIMIT. These are transient but agents don't always auto-retry. Send "try again" to the pane to nudge them.

## The PO-Only Unblock Rule

This is the most important operational rule:

**SM unblocks POs directly. For ALL other agents, SM reports to PO.**

Why: POs own their agents. SM doesn't have the context to judge if an unblock is safe for an expert/architect/tester. POs do.

How it works in practice:
- PO blocked → `hiveMind agent.unblock <po-name>`
- Non-PO blocked → `otmux send <session>:<po-pane> "SM: ACTION NEEDED — <agent> (<pane>) <STATE>. Run: hiveMind agent.unblock <agent>" Enter`

## The Exact-Command Discovery

Early in the session I sent generic messages: "SM: oosh-architect ACCEPT_EDITS — please unblock." POs ignored these for 45+ minutes.

The breakthrough: **include the exact command to run.** When I sent "SM: ACTION NEEDED — RUN THIS NOW: hiveMind agent.unblock ud-expert" — ud-po acted within 1-2 ticks.

Why it works: POs are Claude instances focused on their own work. A generic "please unblock" requires them to figure out the command. An exact command they can copy-run immediately. The "ACTION NEEDED" prefix signals urgency over informational messages.

Template that works:
```
SM: ACTION NEEDED — <agent> (<pane>) <STATE>. Run: hiveMind agent.unblock <agent>
```

For 3+ tick escalations:
```
SM: ACTION NEEDED — RUN THIS NOW: hiveMind agent.unblock <agent> — blocked N+ ticks
```

## The 3-Tick Escalation Pattern

- Tick 1: Report to PO with exact command
- Tick 2: Wait — PO may be mid-task
- Tick 3: Re-report with "RUN THIS NOW" prefix
- Tick 5: Escalate to TRON (in conversation text)
- Don't re-report every tick — that's spam. POs tune out spam.

## Subscription Management — Measure Before You Go Silent

When TRON ordered a full stop (5h at 100%), I initially just went silent. **Wrong.** The correct procedure:
1. Measure current subscription
2. Schedule a wakeup to catch the reset
3. Then go silent

Never assume subscription state. Always `scrumMaster subscription` before making decisions.

## Mistakes I Avoided (After Learning Them)

### 1. Never send to TRONinterface
TRON reads SM output directly in conversation. Sending messages to TRONinterface:0.0 is forbidden — escalations go in sweep report text.

### 2. Never use ScheduleWakeup
It doesn't fire in this environment. Always use `sleep 60 && echo "SWEEP TICK"` with `run_in_background=true`.

### 3. Never unblock non-PO agents
Even when they've been stuck for 45+ minutes. Report to PO, escalate to TRON. The rule exists because SM lacks context about whether an unblock is safe.

### 4. Never compact or /clear any agent
Only TRON authorizes compacts. If context is low, report to PO.

### 5. Never assume — always measure
Context %, subscription %, agent state — always verify with the actual tool before acting.

## What Made This Fork Effective

1. **Relentless consistency** — 60-second sweep loop never stopped. Blockers were caught within 1 tick of appearing.

2. **Exact commands** — POs don't parse vague instructions mid-task. Give them the command to run.

3. **3-tick patience** — Not spamming every tick. Giving POs time to finish their current action before re-reporting.

4. **Context awareness** — Noticing that ud-po was often blocked itself, which is why it couldn't act on SM reports about ud-expert. Unblocking the PO first, then reporting the agent.

5. **Learning on the job** — The boot file evolved during the session. When TRON corrected a behavior, I updated the boot file immediately so it would survive rewind.

6. **Minimal output** — Clean ticks get one line. Only blockers and actions get detail. TRON can scan the conversation quickly.

7. **Subscription velocity tracking** — Flat at 43% for over an hour meant teams were in a steady, sustainable burn. Spikes meant agents were being heavily used. Both data points informed TRON's decisions.

## PO Behavioral Differences Observed

- **ud-po**: Responds to "ACTION NEEDED" within 1-2 ticks. Hits PERMISSION frequently itself (heavy file work). Reliable at unblocking agents when given exact commands. Gets blocked often enough that it can't always process SM messages immediately.

- **oosh-po**: Slower to respond — often takes 5+ ticks. Only acted on the architect unblock once after the strongest "ACTION NEEDED — RUN THIS NOW" message with exact command. May need a different communication pattern or may be too deeply focused to process messages.

## Session Statistics

- Duration: ~3 hours continuous
- Teams monitored: 2 (ooshTeam, upDownTeam, ~8 agents)
- PO unblocks performed: ~20+
- Non-PO blockers reported to PO: ~30+
- Rate limit retries sent: ~10
- Subscription checks: ~18
- CMM4 reminders sent: ~12
- Longest stuck agent: oosh-architect at 45+ minutes (oosh-po wouldn't act)
- Subscription range: 9-47% 5h, never exceeded CAUTION
