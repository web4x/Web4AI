> **⚠ STRICT LAW (TRON 2026-07-18): the recovery mechanism referenced below (`/compact` / `/clear` band-recovery) is now FORBIDDEN. This incident is preserved as HISTORY / diagnosis only. Current recovery = the 2-phase rewind → `session/base-skills/agent-rewind.md`.**

# Incident Report: Mass Context Exhaustion — 2026-02-17

## What Happened

Tron delegated 4 tasks simultaneously to expert, tester, trainer, and scribe. All 11 agents hit 0% context within ~30 minutes. Every agent received the useless `unknown.md` boot prompt. The Tron interface (pane 0.4) nearly compacted itself. Recovery took 45+ minutes of chaotic manual intervention.

## Timeline

- **~16:00Z** — 4 tasks delegated in parallel (expert: param naming fix, tester: completion tests, trainer: naming rules + SKILL migration, scribe: KB index links)
- **~16:15Z** — Agents burning context on large tasks. SM sweeping but not detecting context warnings.
- **~16:30Z** — First agents hit 0%. SM also at 0%. Orchestrator at 0%. Cascade: no monitor left to catch the others.
- **~16:35Z** — Tron notices. Asks interface to recover agents.
- **~16:35-17:15Z** — 40 minutes of failed recovery attempts:
  - Blind batch loops sending /compact to all 12 panes (including self at 0.4)
  - Escape sent to accept-edits panes (interrupts agent instead of accepting)
  - /compact eaten by accept-edits UI — never executed
  - Garbled text injected into agent prompts from failed commands
  - Recompacting already-compacted agents
  - No tracking of which agents were handled vs not
- **~17:15Z** — Interface finally adopts CMM4 approach: classify → batch → verify
- **~17:20Z** — Discovers it's running in pane 0.4 (nearly compacted itself)
- **~17:25Z** — Switches to one-by-one recovery by communication hierarchy: SM → orchestrator → expert → tester → trainer
- **~17:40Z** — Core team (5 agents) recovered with proper boot files. Non-core (6 agents) left dormant.

## What Should Have Happened

### Before Delegating 4 Tasks

1. **Check subscription**: `scrumMaster subscription` — is there headroom for 4 parallel tasks?
2. **Check agent context levels**: sweep all panes, note which are already low
3. **Verify SM is monitoring context %**: not just activity/stuck detection
4. **Stagger tasks**: delegate 2, let SM confirm they're stable, then delegate 2 more

### When Agents Approach 20% Context

1. **SM detects** context warning in pane status bar ("Context low (X% remaining)")
2. **SM triggers** compact: sends "Save your context and run /compact NOW"
3. **SM verifies** compact succeeded within 30 seconds
4. **SM sends** proper boot file: `Read session/agents/<role>/boot.md`
5. **Never** let agents reach 0% — that's the "Context limit reached" death zone where /compact fails

### During Recovery

1. **Know your own pane** — run `tmux display-message -p "#{session_name}:#{window_index}.#{pane_index}"` FIRST
2. **Classify before acting** — one capture pass, sort into groups, then handle each group appropriately
3. **One at a time by hierarchy** — SM first (unblocks everyone), then orchestrator (coordinates), then workers
4. **Track state** — use TaskCreate per agent, mark completed when verified
5. **Accept-edits is non-blocking** — the `❯` prompt accepts /clear and /compact even with accept-edits showing. Don't Escape (that interrupts). Just type at the prompt.
6. **0% + "Context limit reached"** = /compact won't work. Only /clear. Accept that context is lost.
7. **After /clear** — immediately send proper boot file, NOT unknown.md

## Root Causes

### 1. SM Not Monitoring Context Levels
The SM sweep detects stuck prompts, permissions, and activity — but does NOT check the status bar for "Context low (X% remaining)". This is the #1 gap. The sweep needs to parse context % from each pane's status bar and trigger compacts at 20%.

### 2. No Circuit Breaker on Parallel Delegation
Delegating 4 large tasks to 4 agents simultaneously with no throttling. Each task consumed massive context (reading SKILL.md files, scanning 81 files, running tests). No mechanism to pause delegation when burn rate is high.

### 3. unknown.md Boot File
The pre-compact hook and post-compact boot sequence defaults to `session/agents/unknown/boot.md` when it can't detect the agent role. This file is useless — it tells the agent nothing about who they are or what they should do. Every agent that compacted or cleared got this garbage.

**Root cause of unknown.md**: The boot hook uses role detection that doesn't match all agent names. The trainer was actively fixing this when the disaster hit.

### 4. Interface Didn't Know Its Own Pane
The Tron interface (me) didn't know it was running in pane 0.4. Nearly sent /compact to itself. Basic self-awareness failure.

### 5. No Recovery Playbook
The recovery was ad-hoc — blind loops, wrong keystrokes (Escape instead of accepting edits), no state tracking. A documented recovery procedure would have cut the 40-minute chaos to 10 minutes.

## Learnings

### F15: Mass Context Exhaustion from Parallel Delegation (2026-02-17)
Delegated 4 large tasks simultaneously. All 11 agents hit 0% within 30 minutes. SM couldn't save them because SM was also at 0%. Recovery took 40 minutes of chaos. **Never delegate more than 2 large tasks without checking subscription headroom and agent context levels. SM must monitor context % in every sweep cycle.**

### F16: Know Your Own Pane (2026-02-17)
Interface nearly compacted itself because it didn't know which pane it was in. **On boot, every agent must run `tmux display-message -p "#{session_name}:#{window_index}.#{pane_index}"` and store the result. Never send commands to your own pane.**

### F17: Accept-Edits Is Non-Blocking (2026-02-17)
Wasted 20 minutes trying to dismiss accept-edits with Escape (which interrupts the agent) and Enter (which accepts individual edits). The accept-edits bar is a notification — the `❯` prompt still accepts /compact, /clear, and regular prompts. **Don't fight accept-edits. Just type your command at the prompt.**

### F18: 0% Context = /clear Only (2026-02-17)
At 0% "Context limit reached", /compact cannot work — there's no context left to compress. Only /clear resets the session. **If an agent reaches 0%, accept the loss. Send /clear, then immediately send the proper boot file. Don't waste time trying /compact repeatedly.**

### F19: Recovery Order = Communication Hierarchy (2026-02-17)
Blind batch recovery (loop all panes, send same command) failed completely. Recovery must follow the communication hierarchy: SM first (monitors everyone), orchestrator second (coordinates), then workers. **SM alive = team can self-heal. SM dead = manual recovery for everyone.**

### F20: unknown.md Is a Boot Failure (2026-02-17)
The default boot file `session/agents/unknown/boot.md` provides no identity, no context, no recovery steps. Every agent that hits it is effectively lobotomized. **Every agent MUST have a named boot file at `session/agents/<role>/boot.md`. The boot hook must resolve role names correctly for all agents. unknown.md should be an error, not a default.**

## Action Items

| # | Action | Assigned To | Priority |
|---|--------|------------|----------|
| 1 | Add context % detection to SM sweep cycle | oosh-expert | CRITICAL |
| 2 | Fix boot hook role detection for all agent names | agent-trainer | HIGH |
| 3 | Create boot files for ALL agents (not just core) | agent-trainer | HIGH |
| 4 | Add self-pane detection to all SKILL.md Context Recovery sections | agent-trainer | MEDIUM |
| 5 | Write cold-start recovery playbook in knowledge-base/actions/ | agent-trainer | MEDIUM |
| 6 | Add delegation throttle: max 2 parallel large tasks, check context first | orchestrator SKILL.md | MEDIUM |
| 7 | SM sweep must send proper boot file after triggering compact | scrum-master SKILL.md | HIGH |

## CMM Assessment

| Capability | Before | After | Gap |
|-----------|--------|-------|-----|
| Context monitoring | L1 (not checked) | L2 (known, not yet automated) | SM needs automated context % parsing |
| Recovery procedure | L1 (ad-hoc chaos) | L2 (documented, not yet tested) | Need playbook in actions/ |
| Boot file coverage | L1 (unknown.md default) | L2 (core agents have boot files) | All agents need boot files |
| Delegation throttling | L1 (fire and forget) | L2 (known risk) | Need automated circuit breaker |
| Self-awareness (own pane) | L0 (didn't exist) | L1 (known) | Add to SKILL.md recovery steps |
