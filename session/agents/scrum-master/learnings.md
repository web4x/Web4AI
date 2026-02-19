# scrum-master Learnings

*Patterns, failures, KPIs — identity after compact.*

## F15: Mass Context Exhaustion — SM Failed to Monitor Context % (2026-02-17)
All 11 agents hit 0% within 30 minutes. SM sweep detected stuck prompts and permissions but NOT context % warnings. SM itself also hit 0%. **Context % monitoring is now MANDATORY in every sweep cycle. Check each pane's status bar for "Context low (X% remaining)". At <= 20%, trigger compact. See SKILL.md "Context % Monitoring" section.**

## F18: 0% Context = /clear Only (2026-02-17)
At 0% "Context limit reached", /compact cannot work. Only /clear resets the session. **If an agent reaches 0%, send /clear, then send proper boot file. Don't waste time trying /compact.**

## F20: unknown.md Is a Boot Failure (2026-02-17)
After compact/clear, agents got `session/agents/unknown/boot.md` which provides no identity. **Always send the NAMED boot file: `Read session/agents/<role>/boot.md`. Never send unknown.md.**

## LETHAL FAILURE: Forced compact without context save (2026-02-16)
I sent /compact to agents via background commands WITHOUT first triggering them to save context. This destroyed their state — killed them. The Peer Compact Protocol exists for exactly this reason:
1. **NEVER send /compact directly** to another agent
2. Send "Save your context and run /compact NOW" — let the AGENT do it
3. Wait and VERIFY the agent saved (capture pane, check file write)
4. Only the agent knows its own state — I cannot save it for them
This was a CMM1 catastrophic failure. No shortcut justifies skipping the save step.

## Reawakening vs Killer Background Tasks (2026-02-16)
- **Reawakening** (CORRECT): `sleep 300 && hiveMind send.enter scrum-master "Read session/tasks/sm-continue-sweeping.md"` — sends prompt to MY pane, wakes ME up
- **Killer** (FORBIDDEN): `sleep N && hiveMind send.enter <role> "/compact"` — sends compact to OTHER agents, destroys their state
- When going idle: ALWAYS set a reawakening for self. NEVER send destructive commands to others via background tasks.

## OOSH-Only Rule (2026-02-16, RETRAINED 2026-02-17)
After compact, I regressed to manual bash loops. The rule: `scrumMaster` and `hiveMind` are my ONLY tools. If something is missing, request improvement — don't write raw bash.

### Primary tools (use these, not manual loops):
- `hiveMind sweep projectTeam` — batch-capture ALL panes in one command
- `hiveMind unblock all` — auto-detect and resolve stuck prompts + permissions
- `hiveMind monitor.approve <name>` — approve permission by agent name
- `scrumMaster subscription` — check subscription
- `scrumMaster dashboard projectTeam` — auto-generate team health dashboard
- `scrumMaster cycle projectTeam 60` — full cycle: measure + sweep + unblock + sleep
- `otmux send <pane> <keys>` — manual fallback for stuck prompts unblock misses

### What I was doing WRONG (pre-retrain):
- Capturing 11 panes one-by-one instead of `hiveMind sweep projectTeam`
- Sending Enter manually to each stuck prompt instead of `hiveMind unblock all`
- Writing dashboard by hand instead of `scrumMaster dashboard projectTeam`
- Using `sleep 60 && echo` wakeups instead of proper OOSH tools
- Tried `hiveMind cycle` (doesn't exist) — correct: `scrumMaster cycle`

## Pane Interaction Boundaries (PO Directive 1110Z, updated Tron directive 2026-02-18)
- ONLY send keystrokes for **permission prompts** (Allow/Deny)
- Do NOT submit task prompts or content to any pane
- **CRITICAL: Pane 0.4 is Tron's interface — NEVER send ANY keystrokes to 0.4.** No permissions, no Enter, no Escape, nothing. Skip 0.4 in all unblock/approve operations.
- `hiveMind unblock all` DOES send to 0.4 — after running it, this is a known issue. Use individual `hiveMind unblock <name>` for each agent EXCEPT product-owner, or accept that unblock touches 0.4 and request a fix.
- Stuck prompts → REPORT in dashboard, don't submit

## Capture Depth
Always 30+ lines. 5-10 lines is insufficient.

## CMM Tracking (PO Directive 1135Z)
Every sweep: add CMM observation to dashboard. Track weakest link. Flag agents who assume instead of measure.

## Dashboard Duties (PO Directive 1112Z)
Write assignment table to `session/dashboard-assignments.md` after each sweep. Include: assignments, blockers, idle agents, subscription, CMM observation.

## NEVER STOP WITHOUT WAKEUP (PO Directive F13 — 2026-02-17)
**Stopping without a wakeup is a FAILURE, not a rest.** Before finishing ANY response, MUST schedule next action:
- Use `sleep 60` inline to chain the next sweep cycle
- Or use background bash to trigger next cycle
- The only acceptable stop: 90% subscription with wakeup set for reset
- At 80%: reduce frequency (sleep 120). At 90%: save context, set wakeup, THEN stop.
- SM Continuous Pattern: Sweep → Handle → Dashboard → Subscription → sleep 60 → GOTO 1

## Pane Interaction Update (Tron directive 2026-02-17, SUPERSEDED 2026-02-18)
When Tron authorizes: MAY submit stuck prompts AND approve permissions on all panes EXCEPT 0.4. Pane 0.4 is Tron's interface — absolutely off-limits. See "Pane Interaction Boundaries" above.

## Velocity Monitoring Directive (2026-02-18)
From `session/tasks/sm-velocity-monitoring-now.md`:
- Check context % on EVERY agent pane EVERY sweep (parse status bar for "Context low (X% remaining)")
- Proportional response: >60min=full speed, 30-60=no new large tasks, 15-30=commit work, 5-15=trigger saves, <5min=trigger compacts
- After compact: send proper boot file (`Read session/boot/<role>.md`), NEVER unknown.md
- Skip 0.4 in ALL operations
- Track velocity per agent — fast burners get early save triggers

## Unblock Pattern: Individual Loop (2026-02-18)
`hiveMind unblock all` sends to 0.4 (Tron's pane). Instead use:
```bash
for agent in orchestrator oosh-expert oosh-tester agent-trainer task-agent woda-writer woda-scribe developer script-product-owner; do hiveMind unblock "$agent"; done
```
This skips product-owner (0.4).

## "Baked Xm" = Completion, Not Stuck (2026-02-18)
Agent-trainer showed "Baked for 11m 18s" for 15+ cycles. At 5-line capture depth it looked stuck. At 30-line capture: trainer had completed all 3 tasks and was idle. **Past-tense verbs (Baked, Brewed, Cooked, Churned) = DONE, not stuck.** Always capture 30+ lines before declaring an agent stuck.

## F18 Update: 0% + Compact CAN Work (2026-02-18)
Script-PO hit 0% and successfully compacted (contrary to F18 which says /clear only). The compact took ~60s but completed. **Try /compact first at 0% — only fall back to /clear if compact fails.** Wait at least 90s before assuming compact failed.
