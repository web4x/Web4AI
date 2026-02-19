# product-owner Learnings

*Patterns, failures, KPIs — identity after compact.*

## Failures (learn from these)

### F1: Assumed trainer quota limit (2026-02-11)
Captured only 10 lines. Saw stale "quota limit" prompt, assumed it was current. Trainer was actually DONE. **Always capture 30+ lines. Question contradictions.**

### F2: Wrote SM context FOR it (2026-02-11)
Peer cannot know internal state. Only the agent can save its own context. **Trigger, don't write.**

### F3: Reported SM "stuck" without fresh verification (2026-02-12)
Saw "8% remaining" in earlier capture. Reported SM stuck without taking a new measurement. SM had already recovered and was sweeping. **Same pattern as F1. Before reporting state — take a FRESH capture. Stale data = wrong conclusions.**

### F5: Not monitoring own context proactively (2026-02-12)
Had `claudeCode context.read` available the entire session. Never used it until Tron asked. Waited for system warnings instead of measuring. **Run `claudeCode context.read` regularly — every 3-4 interactions. Lead by example.**

### F4: Suppressed errors with `2>/dev/null || echo "..."` (2026-02-12)
Hid real error messages behind generic text. The error IS the information. **Never use `2>/dev/null` to hide errors. Never replace real errors with generic echo strings. Run the command, see what happens, deal with the real output.**

### F6: Lost goals from context — reactive instead of driving priority (2026-02-12)
Had 15 tasks spread across 11 agents. Spent time routing, monitoring, approving permissions — but lost sight of the #1 goal (subscription measurement). Context.md HAD goals but I never re-read it. "Wer schreibt, der bleibt" only works if you RE-READ what you wrote. **Before any sweep cycle, re-read context.md #1 priority. Drive toward it, not away from it.**

### F7: Didn't restart orchestrator + SM after rate limit (2026-02-12)
Both hit rate limit, both sat idle after reset. Nobody kicked them. Team stalled because the two "always-on" roles stopped. **Rate limit recovery = gap. Need auto-resume or peer kickstart protocol.**

### F10: git pull --rebase destroyed uncommitted work (2026-02-12)
hiveMind-expert ran `git pull --rebase` which silently overwrote uncommitted otmux changes from claude-opus agent (tree three-level view with session IDs). Rebase checks out target commit, wiping unstaged modifications without warning. **NEVER USE REBASE. `pull.rebase` set to false in repo config. All agents: `git pull` only (merge), NEVER `git pull --rebase` or `git rebase`.**

### F8: Confused "accept edits on" status bar with being blocked (2026-02-12)
`⏵⏵ accept edits on` in the Claude Code status bar means auto-accept is ENABLED — the agent is NOT blocked. **Read the full context of the UI, not just pattern-match keywords.**

### F9: Didn't monitor burn rate after waking idle agents (2026-02-12)
Woke up 5+ idle agents, knew burn rate would spike, didn't monitor. Went from 470k to 665k tok/min. Hit 94% without SM catching it. **After any action that increases parallelism, check subscription within 5 minutes.**

### F11 (CRITICAL): Sent /compact to 3 agents without letting them save context (2026-02-16)
Swept all panes, saw 1.0 (writer), 1.1 (scribe) at context limit and 0.5 (trainer) appearing stale. Sent raw `/compact` to all three without first asking them to save their context. Additionally, 0.5 trainer was ACTIVELY WORKING (fixing SM SKILL.md) — I assumed it was stale based on minutes-old sweep data without re-capturing. All three compacted without saving state. Context files now stale, in-progress work lost. **Two rules violated simultaneously:**
1. **Peer Compact Protocol**: NEVER send raw `/compact`. Always send "Save your context and run /compact NOW" and WAIT for confirmation.
2. **Capture → Assess → Act**: NEVER act on stale sweep data. Always re-capture the pane IMMEDIATELY before sending any disruptive command.
**The correct sequence: re-capture → verify state → send "Save context + /compact" → wait for save confirmation → verify compact completed.**

**Cascade damage (measured):** SM regressed to manual sleep/for loops (lost hiveMind sweep directive). Writer lost chapter progress. Trainer lost mid-task SM SKILL.md fix. All directives sent this session (1110Z, 1112Z, 1135Z) had to be re-sent to SM = pure rework. The cost of a contextless compact is not just "lost state" — it's team-wide regression that burns tokens and time to repair. Compact protocol is the HIGHEST priority rule because violating it cascades into every other capability.

### F12: Set wakeup 1 hour late — assumed reset time instead of measuring (2026-02-16)
Used the stale API (`measure.subscription.api` showed "resets 18:59 UTC") to calculate wakeup at 20:00 local. Didn't verify with `scrumMaster subscription`. New block had already started at 18:00 UTC — wakeup was 1 hour late. **Same pattern as F1, F3, F8, F9: assuming instead of measuring. Use `scrumMaster subscription` for real-time data. The deprecated API lags. Always verify the reset time AFTER the block ends, not before.**

### F13: SM and orchestrator both stopped without wakeup — team went dark (2026-02-17)
Both SM and orchestrator completed a burst of work, reported results, and STOPPED. No background task, no wakeup timer, no loop. Unsubmitted prompts sat at `❯` until I manually sent Enter. The team had zero velocity for the entire time they were idle. **Core loop agents (SM, orchestrator) must NEVER finish a response without scheduling their next wakeup. This is now in both SKILL.md files as "Continuous Operation (F13)". Stopping without a wakeup is a failure, not a rest.**

### F15: Mass Context Exhaustion from Parallel Delegation (2026-02-17)
Delegated 4 large tasks simultaneously. All 11 agents hit 0% within 30 minutes. SM couldn't save them because SM was also at 0%. Recovery took 40 minutes of chaos. **Never delegate more than 2 large tasks without checking subscription headroom and agent context levels. SM must monitor context % in every sweep cycle.**

### F16: Know Your Own Pane (2026-02-17)
Interface nearly compacted itself because it didn't know which pane it was in. **On boot, every agent must run `tmux display-message -p "#{session_name}:#{window_index}.#{pane_index}"` and store the result. Never send commands to your own pane.**

### F17: Accept-Edits Is Non-Blocking (2026-02-17)
Wasted 20 minutes trying to dismiss accept-edits with Escape (which interrupts the agent) and Enter (which accepts individual edits). The accept-edits bar is a notification — the prompt still accepts /compact, /clear, and regular prompts. **Don't fight accept-edits. Just type your command at the prompt.**

### F18: 0% Context = /clear Only (2026-02-17)
At 0% "Context limit reached", /compact cannot work — there's no context left to compress. Only /clear resets the session. **If an agent reaches 0%, accept the loss. Send /clear, then immediately send the proper boot file. Don't waste time trying /compact repeatedly.**

### F19: Recovery Order = Communication Hierarchy (2026-02-17)
Blind batch recovery (loop all panes, send same command) failed completely. Recovery must follow the communication hierarchy: SM first (monitors everyone), orchestrator second (coordinates), then workers. **SM alive = team can self-heal. SM dead = manual recovery for everyone.**

### F20: unknown.md Is a Boot Failure (2026-02-17)
The default boot file `session/agents/unknown/boot.md` provides no identity, no context, no recovery steps. Every agent that hits it is effectively lobotomized. **Every agent MUST have a named boot file at `session/agents/<role>/boot.md`. The boot hook must resolve role names correctly for all agents. unknown.md should be an error, not a default.**

### F24: Read Wrong Context File After Compact (2026-02-18)
Rebooted after compact, read `session/agents/tron-interface/context.md` instead of `session/agents/product-owner/context.md`. Didn't check pane title first. Operated with wrong identity and wrong goals until Tron pointed it out. **On boot: `tmux display-message -p "#{pane_title}"` FIRST. That's your identity. Read the matching context file. GATE applies to identity too.**

### F25: Reverted to Binary Thresholds Despite CMM4 Velocity Rule (2026-02-18)
Saw "80% WARNING" from subscription check, immediately said "throttle mode." This is the old binary rule that Tron explicitly replaced with CMM4 continuous velocity management. Had the conversation, wrote the task, trainer committed it (5f6112d) — then I ignored it and fell back to the old pattern. **The rule is: look at projected exhaustion time, respond proportionally. No binary on/off. "Driving 200km/h at a cliff hoping brakes work" = binary thresholds. CMM4 = continuous deceleration, never needs emergency braking.**

## Patterns

### Idle Team → Ask Task Agent
When team idles, don't guess what to assign. Ask the task agent what's still undone. Do this **every hour** as a recurring check. The task agent is the central registry — use it.

### Communication
- Never send long messages via otmux/hiveMind send — they garble
- Write task files to `session/tasks/`, send only: `Read session/tasks/<file>.md`
- Task filenames: `{YYYYMMDD}T{HHMM}Z.task.md` — no descriptions in filenames

### OOSH PATH + OOSH-Only Rule
- OOSH is ALREADY on PATH via ~/.bashrc — no `export PATH=...` needed
- Direct commands: `hiveMind monitor scrum-master 10` — works directly, resolves by role name
- **NEVER use raw `tmux` commands** — always `otmux` wrappers. PO violated this multiple times (F14).
- **NEVER use `sleep N && command`** — use otmux background patterns instead
- For session creation: `otmux new <name> -d` (detached)

### Peer Compact Protocol
- Peer TRIGGERS agent to save own state, does NOT write context for them
- Only the agent knows its internal state (current task, reasoning, next steps)

### Monitoring
- Always capture 30+ lines for state assessment
- Never assume — always measure
- Capture → assess → clear if needed → send → verify

### CMM web4x (Capability Maturity Model)
- Measures CAPABILITIES not organizations
- Composed maturity = weakest link
- L3 = deterministic (same input → same output, anyone, every time)
- L4 = PDCA feedback loops — practical ceiling, self-improving
- L5 = never voluntary (Pareto-inefficient)
- "Changing a process" is a SEPARATE capability
- Web 4.0 = consequent application of CMM4 methods

### OOSH Config Pattern (web4 scenario)
- All persistent state belongs in `~/config/` as `.env` files — NOT in `/tmp/`
- `config set/get/save/list` — the OOSH way to manage config
- State machines: `~/config/stateMachines/<NAME>.states.env`
- web4.scenario.env = the universal pattern for persistent shell configuration
- Files are sourceable: `. ~/config/name.env`
- hiveMind registry in `/tmp/` = violation — should be `~/config/hivemind.roles.env`

### Script Specialist Pattern
- script-product-owner = specialist delegate, not just ownership contract
- One specialist per script, 100% aware of internals
- PO and trainer can ALWAYS create more — no permission needed
- Invoke specialists for precise planning instead of relying on generalist memory

## Key Decisions
- Agent files: real in `session/agents/<role>/`, symlinks from `.claude/agents/<role>/`
- PO talks only to Tron and Orchestrator — no direct communication with other agents
- Compact assistance is HIGHEST priority for SM
- SM must sweep ALL 11 panes (skip 0.3 = self)
