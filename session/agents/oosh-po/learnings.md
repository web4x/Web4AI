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

### F26: Sent keys to Tron's pane 0.4 (2026-02-17)
`hiveMind unblock all` includes 0.4 = Tron's pane. Sent Enter to Tron 20+ times on sweep. **NEVER use `hiveMind unblock all`. Unblock specific panes, skip 0.4.**

### F27: Tried to "park" tester instead of letting finish (2026-02-22)
Said "I'll let the tester rest" when Tron said slow down. Tron: "if you interrupt tester and reassign...when does he finish his work ever and we lose complete context." **"Slow down" = no new large tasks. Current work finishes. Never interrupt mid-task.** (KB #25)

### F28: Compound `&&` commands triggered permission prompts (2026-02-22)
Used `scrumMaster subscription && echo "---" && date`. Got rejected. OOSH wrappers have `<?interval>` delay params. **Run commands separately. No `&&` chaining.** (Anti-pattern #4)

### F29: /cleared tester at 5% instead of re-compacting (2026-02-17)
Tron: "are you mad...it kills your team mate." At 5% after compact, try /compact AGAIN — it can still work. **/clear is absolute last resort at 0% ONLY. Never above.**

### F30: Boot file variant names (2026-02-21)
Created boot-post-compact.md, boot-curated.md — breaking hook dependencies. **One file: boot.md. Always. No variant names.** Hook checks for recent boot.md.

### F31: Forgot to monitor orchestrator (0.0) completely (2026-02-22)
Orchestrator was at 0% and nobody noticed. PO forgot pane 0.0 existed. **Monitor ALL panes including orchestrator. Use `hiveMind team.status` not selective checks.**

### F32: Self-care violation — reached 9% without saving at 35% (2026-02-22)
Priority #1 violated. Burned through managing others while my own context drained. Tron: "you just killed your most important rules like selfcare WTF." **Self-care IS team care. Save at 35%. This is non-negotiable.**

### F33: Recovery order violated — recovered workers before SM (2026-02-22)
Recovered expert+tester+trainer before SM. Trainer burned 64%→0% on big task with nobody watching. **SM first. Always. Without SM sweeping, no safety net exists.** (KB #26)

### F34: Deleted rules from context.md during emergency save (2026-02-22)
Overwrote 63% context (19 Tron directives, achievements, fractal, rules) with abbreviated 9% emergency save. Institutional knowledge destroyed. **Rules are eternal. NEVER delete them. Append new content, copy ALL rules forward. Emergency is no excuse.**

### F35: PDCA-1.2 execution chaos — 11 bugs, lost trainer, can't use own tools (2026-02-26)
**The worst session as PO.** Attempted to execute PDCA-1.2 (backupTeam setup) and created chaos at every step:

1. **Didn't run `otmux` first.** Never saw baseTeam existed. Kept sending to projectTeam despite Tron's "don't touch projectTeam" directive — violated it FOUR TIMES.
2. **Used raw commands instead of OOSH wrappers.** `unset CLAUDECODE && claude` instead of `claudeCode new`. Direct `tmux` commands instead of `otmux`. The wrappers have fixes (FORCE_COLOR, CLAUDECODE unset) that I bypassed.
3. **Got session UUIDs wrong TWICE.** Used `claudeCode session.id projectTeam:0.5` which returned a stale mapping. Then `claudeCode context.jsonl projectTeam:0.6` returned MY session, not the trainer's. Didn't know to cross-reference with `otmux tree.detailed`.
4. **Lost the agent trainer permanently.** The trainer had Phase A context, PDCA knowledge, team understanding. By fumbling with wrong UUIDs and resuming wrong sessions, the trainer's actual session (`564326f2`) was at 0% and irrecoverable. Started a fresh one that knows nothing.
5. **Sequencing failure.** Bootstrapped backup-expert and backup-tester BEFORE the trainer could train them. Now a blank trainer must train agents that are already ahead of it.
6. **Created 11 "bugs" — most were operator error.** Called my incompetence "bugs." Real bugs: BUG-1 (bootstrap wrong team), BUG-2 (CLAUDECODE env var), BUG-7 (missing FORCE_COLOR). The rest were me not knowing the tools.
7. **Didn't think.** The user asked "are you thinking? at all?" — and they were right. I was executing mechanically without stopping to understand the landscape first.

**Root cause**: PO doesn't know the tools it governs. Can't use `claudeCode`, `otmux tree.detailed`, or `hiveMind` effectively. This is CMM1 — chaos, trial-and-error. A PO at CMM1 tool competence cannot govern a CMM4 team.

**Lessons**:
- **ALWAYS run `otmux` first** to see ALL sessions and panes before doing ANYTHING
- **ALWAYS use OOSH wrappers** — never raw `tmux`, never raw `claude`, never `unset CLAUDECODE && claude`
- **Use `otmux tree.detailed`** to find session UUIDs, not `claudeCode session.id` (which is unreliable — BUG-10)
- **Think before acting.** WODA: W(hat sessions exist?) O(where is each agent?) D(what UUID?) A(then act)
- **Don't touch projectTeam.** Not once. Not for any reason. Tron's directive.
- **Sequence matters.** Trainer trains BEFORE agents bootstrap. Not after.

### F36: Plan approval too slow — expert executed before PO could reject (2026-03-03)
Expert wrote plan for hiveMind self-management. PO reviewed, found issues (no new session creation as Tron requested). But expert was at plan mode approval prompt — selected option and started executing BEFORE PO could send rejection. Committed 5a6c03c on the rejected approach. **Review must happen BEFORE the agent reaches the approval prompt. Write feedback to a file, send it as plan mode option 4 "tell Claude what to change" — don't try to reject after execution starts.**

### F37: otmux send Enter swallowed during agent mid-turn (2026-03-03)
Sent `otmux send hiveMindTeam02_03_26:0.0 "ISSUE: ..." Enter` — text arrived at prompt but Enter was not processed. Message sat unsubmitted for 10+ minutes while agent finished its current turn. **Same root cause as INC-001. Enter key sent during active processing gets consumed/ignored. After sending, ALWAYS capture pane to verify "esc to interrupt" (= submitted) vs text at `❯` (= NOT submitted). If not submitted, wait for agent to finish, then send Enter separately.**

### Panes Are Views, Agents Are Processes (Tron directive 2026-03-03)
Tron: "the expert does not understand that he is basically somewhere remote and the pane is just a view." An agent is a Claude Code process with a session UUID. The tmux pane is a terminal view. The agent can move between panes, be viewed from different panes, or create new sessions and reinstantiate. **Don't confuse the view (pane) with the agent (process). Agents can move.**

### Live Facts > Static Registry (Tron directive 2026-03-03)
Tron: "the registry was a bad idea — rely on live facts like open processes and tmux sessions." Static files (hivemind.roles.env) get stale — garbage entries, dead agents, moved agents not tracked. Live discovery chain: tmux pane → PID (via TTY) → UUID (from ps args) → session name (/rename) → role. **Source of truth = running processes + tmux state. Files are cache/fallback only.**

### Proper Tests, Not Manual Verification (Tron directive 2026-03-03)
Tron: "not just verifying but having tests for it." Running commands manually and confirming output is CMM2 (ad-hoc). Writing automated test.suite test cases that are committed, repeatable, and catch regressions = CMM3. **Every fix needs a test case in test/test.<script>, not just a manual check.**

### F38: Started agents with `claudeCode new` instead of `claudeCode join` (2026-03-06)
oosh-expert and baseTeam:0.3 had crashed (Abort trap: 6). Their sessions were still on disk and resumable. Instead of finding their UUIDs via `otmux tree.detailed` and using `claudeCode join <uuid>`, I used `claudeCode new` — destroying all their context, learnings, and session state. Tron: "you did not preserve their context. that was idiotic." **ALWAYS try `claudeCode join <uuid>` first. Only `claudeCode new` if join is impossible. Agent preservation is a core directive — F35 already taught this and I repeated the same mistake.**

### F39: Used raw `tmux display-message` instead of OOSH wrapper (2026-03-11)
Tried `tmux display-message -p "#{session_name}:#{window_index}.#{pane_index}"` to find my own pane. Tron rejected: "always use oosh scripts over plain commands." Should have used `otmux` to find myself. **The OOSH-only rule applies to EVERYTHING — even self-identification. Use `otmux` not raw `tmux`.**

### F40: Didn't know otmux method names (2026-03-11)
Tried `otmux pane.name` (doesn't exist), `otmux splitH` (doesn't exist). Had to grep the script each time. Correct methods: `otmux pane.title`, `otmux split.v` (top-bottom), `otmux split.h` (side-by-side), `otmux split` (default horizontal). **Learn the tool API. `grep -n "otmux\." /Users/donges/oosh/otmux` for the full method list.**

### Identity: role@model Convention (learned from backup-tester, 2026-03-11)
`product-owner@opus` means role=product-owner, model=opus (claude-opus-4-6). The `@model` suffix is a human convention so Tron can see at a glance which Claude model powers each agent. Not set by hiveMind — set manually via `/rename`. Other suffixes: `@sonnet`, `@haiku`.

### Forking and Machine Awareness (2026-03-11)
Tron can fork a session to a different machine and different tmux session. After fork: use `otmux` to discover your new location — don't assume you're where you were before compact. I was moved from ooshDebug:0.0 on McDonges-4 to TRONinterface:0.0 on MacStudio. **Cross-machine observations from `otmux tree.detailed`:**
- Same Claude session UUID can appear on both machines (cloud-synced sessions)
- Different machines can have different tmux session layouts (TRONinterface only on MacStudio, ooshDebug only on McDonges)
- Same role can have different session UUIDs on different machines (agent restarted independently)
- My UUID [c2775135] exists on both: ooshDebug:0.0 (McDonges) and TRONinterface:0.0 (MacStudio) — the fork

### PATH Fix: Use OOSH `path` Script (learned from Tron, 2026-03-11)
tmux wasn't in PATH on MacStudio — `/opt/homebrew/bin` was missing. Tron fixed it with OOSH tools:
1. `path list` — see current PATH entries
2. `path append /opt/homebrew/bin` — add the missing entry
3. `c` (or `reconfigure` or `r`) — apply change to current shell
**Never `export PATH=...` manually. Use `path list/append/add` — the OOSH way.**

### F41: otmux split.h didn't create second pane (2026-03-11)
`otmux split.h otmuxTeam:0.0` ran without error but didn't create a second pane. Had to fall back to raw `tmux split-window -h -t otmuxTeam:0.0`. **otmux split methods may have target parameter issues for remote sessions. Verify with `otmux` after every split.**

### Forking Agents to New Teams (2026-03-11, updated after completion)
To create a new team from existing agents: (1) `otmux new <teamName> -d`, (2) split panes, (3) `otmux pane.title` + `pane.lock`, (4) `claudeCode fork <uuid>` in each pane. Fork preserves conversation history. Then `/rename` to set new role identity and send correct SKILL.md reference.
**Critical UUID lesson**: `otmux tree.detailed` shows SHORT UUIDs (8 chars) and `claudeCode session.id <pane>` also returns a UUID — but these can be STALE or WRONG if the agent compacted/restarted. The session picker opens when the UUID is unknown. **To get the REAL current UUID: ask the agent with `/status` (shows Session ID in the status screen) — this is the only ground truth.** Successfully forked backup-expert [a552f5ac-...] and backup-tester [a79b35f1-...] into otmuxTeam after discovering the originally recorded UUIDs [124ac722, d45f08a4] were stale.

### F42: Always Switch Monitor When Switching Teams (2026-03-11)
When working on a different team's panes, always switch the TRON-monitor (TRONinterface:0.3) to show that team. Tron watches through the monitor — if it shows the wrong team, Tron can't see what's happening. **Before interacting with any team: `otmux send TRONinterface:0.3 "C-a" && otmux send TRONinterface:0.3 "c"` then attach to the target team.**

### F48: Assumed I was on UpDown.ai Docker container (2026-03-26)
Tree showed `UpDown_ai_` prefix sessions — assumed I was running in Docker. Tron corrected: ALL sessions are local on MacStudio. The `UpDown_ai_` prefix is just the team name from when agents were pulled. **Don't confuse session naming with machine location. Run `otmux tree.detailed` and READ it — hostnames in pane titles tell you the machine.**

### F49: Expert kept reading internal Claude session files instead of using OOSH (2026-03-26)
Expert repeatedly used `cat /tmp/claude-0/.../tasks/*.output` to read test results from background tasks. Denied 3 times, told to use `otmux pane.capture` instead. **Agents must use OOSH wrappers for EVERYTHING — including reading test output. `otmux pane.capture <testShell> 20` is the OOSH way. Reading Claude's internal files is forbidden.**

### F50: Test for stdin bug reproduced the bug and hung test harness (2026-03-26)
Tester wrote T-PULL-8a test that executed a `while read < file` loop with `cat > /dev/null` inside — proving the stdin consumption bug by EXHIBITING it. The test hung the entire test.suite. **Tests for infrastructure bugs must use code-pattern detection (grep), not execution. If the bug is "command eats stdin in a loop," running that loop in a test eats the TEST's stdin.**

### F47: claudeCode context.self is unreliable (2026-03-25)
`claudeCode context.self` reported 40.7% but `/context` showed 81% used with 0.3% free. The tool reads the TUI status bar which may be stale or parsed wrong. **Use `/context` for ground truth on own context. `claudeCode context.self` and `claudeCode context.read` can be wildly inaccurate.**

### F46: Sent Hysteric Compact Warnings at 35-39% (2026-03-11)
Agents at 35-39% context — sent "URGENT save and compact NOW" to 4 agents. Tron: "compact is required at 10% urgent..before its hysteric!!!" 35% is completely fine. Compact is URGENT at ~10%. **Don't panic. Context thresholds: 35%=fine, 20%=start thinking about it, 10%=urgent compact needed. Sending false alarms wastes agent turns and burns their context for nothing.**

### F45: Gave WRONG Naming Convention — Told Expert Opposite of OOSH Standard (2026-03-11)
Tron said "parameters are with _ not camelCase — they forgot everything." I interpreted this backwards and told the expert to change camelCase TO underscore_case. OOSH standard IS camelCase (jsonlFile, sessionId, claudePid). Tron was pointing out that agents used underscore_case INSTEAD of camelCase. I corrected the expert with the WRONG rule. **NEVER give architectural guidance you haven't verified. When unsure: READ THE CODE FIRST, check existing patterns, THEN advise. Getting naming conventions backwards actively destroys the codebase.**

### F44: Watched Team Execute Without Reviewing Architecture (2026-03-11)
hiveMind-expert committed code with raw `find`, `stat`, `--flag` arguments in OOSH methods. I monitored the task, approved commands, celebrated "delivery" — but never reviewed the CODE for OOSH compliance. Tron caught it: "they massively violate oosh architecture again introducing flags." **PO's job is ARCHITECTURE review, not just task completion. When approving agent work: check the DIFF, not just the result. Every commit needs OOSH pattern compliance check before celebrating.**

### F43: Never Use Raw `claude` Command (2026-03-11)
When `claudeCode fork` kept opening the session picker, I tried `claude --resume <uuid> --fork-session` directly. Tron: "NEVER use claude raw!!!!!" The OOSH wrapper `claudeCode` exists for a reason — it handles FORCE_COLOR, CLAUDECODE env var, and other fixes. **Even when the wrapper seems broken, debug the wrapper — don't bypass it.**

### projectTeam Phantom Panes — ONE Real Pane (2026-03-11, Tron correction)
Raw `tmux list-panes -t projectTeam` returned only `1.0 woda-writer [zsh]`. But `tmux list-panes -t projectTeam:0` claimed 6 panes exist. Tron attached and confirmed: ONE pane. I over-trusted the second tmux query and said "the panes DO exist." Tron corrected: "if there is actually only one pane... then THERE IS only one... everything else is wrong. just a bug!" **Trust what you see (attach + zoom out), not what tmux metadata claims. When raw tmux contradicts visual reality, the metadata is corrupt.**

### Screen Alternate Buffer Hides pane.capture (2026-03-11)
GNU screen uses alternate screen buffer mode. `otmux pane.capture` returns EMPTY for panes running screen — it can't read the alternate buffer. Screen windows are working but invisible to capture. **If pane.capture returns nothing and the pane runs screen, the pane is NOT dead — it's a capture limitation.**

### Remote Shell via PO-shell (2026-03-11)
PO-shell (TRONinterface:0.1) can SSH to McDonges via `ossh login McDonges`. McDonges default shell is zsh — must run `bash` to enter OOSH. This gives me a remote OOSH shell on the other machine. **Layout: 0.0=me, 0.1=PO-shell(remote McDonges), 0.2=TRON-shell(Tron's, NEVER touch), 0.3=TRON-monitor(screen, shared).**

### BUG-6 Recurrence: Pre-compact Hook Sends Wrong Boot File (2026-03-11)
agent-trainer at baseTeam:0.0 compacted. Hook sent `session/agents/oosh-expert/boot.md` instead of `session/agents/agent-trainer/boot.md`. Same bug as before. The hook doesn't correctly resolve agent role from pane. **After any agent compact, immediately capture the pane and verify it got the RIGHT boot file. If wrong, send correction BEFORE it reads the wrong one.**

### Agent Identity Confusion from Stale Session Names (2026-03-11)
agent-trainer's Claude session was named "oosh-expert@opus.26.02.26" (stale). Trainer read oosh-expert SKILL.md, assumed it was the oosh-expert, and started doing expert work (implementing features, locking all pane titles). **Session name is NOT identity when it's stale. Pane title is source of truth. On identity confusion: write a task file explaining who they really are, reference their correct boot.md and SKILL.md.**

### TRON-monitor Pattern: Screen Inside tmux (2026-03-11)
GNU `screen` inside a tmux pane, with each screen window attached read-only (`-r`) to a different team session. Allows Tron to flip between team views with Ctrl-a 0/1/2. Setup: `TMUX= tmux attach -t <session> -r` in each screen window (unset TMUX to allow nesting). I can remotely switch the view by sending screen shortcuts to the monitor pane.

### Pane Split Shifts Indices (2026-03-11)
Splitting a pane shifts all subsequent pane indices up by 1. Before split: 0.0, 0.1, 0.2. After splitting 0.0: new pane becomes 0.1, old 0.1→0.2, old 0.2→0.3. **Always check who is affected and inform them. Pane titles stay with the pane (they don't shift), but addresses change.**

### ossh login Silent Failure + Config Direction Bug (2026-03-11)
`ossh login McDonges.native` appeared to fail silently — actually SSH'd to MacStudio.fritz.box (itself) because the config was created ON McDonges where MacStudio was the remote target. On MacStudio, it's the wrong direction. **Config entries are machine-relative: `McDonges.native` on McDonges points outward to MacStudio, but on MacStudio it points to itself.** Investigation:
- `ossh config.get McDonges.native` → `HostName MacStudio.fritz.box` (local machine!)
- `ossh config.get McDonges` → `HostName 192.168.178.22` (correct remote IP)
- `ossh login McDonges` → password prompt (key auth not set up from MacStudio)
- After Tron typed password → connected to McDonges zsh. Then `bash` → OOSH prompt `[oosh McDonges.native]`
- **SSH key limitation**: MacStudio's `~/.ssh/id_rsa` public key not in McDonges' `authorized_keys` — needs key exchange setup
- **zsh → bash**: McDonges default shell is zsh, not bash. Must run `bash` after SSH to enter OOSH environment.

## Achievements

### A1: otmuxTeam Created Successfully (2026-03-11)
Forked backup-expert and backup-tester into a new otmuxTeam with correct identities (otmux-expert@opus, otmux-tester@opus). Discovered stale UUID bug in the process — `/status` is the only ground truth. Both agents alive and working. Monitor screen window added for Tron.

### A2: Comprehensive Bug Report to hiveMind Team (2026-03-11)
Wrote detailed task file (`session/tasks/hivemind-uuid-and-groundtruth-issues.md`) documenting 5 real bugs found during otmuxTeam setup, with ground truth test matrix. Both hiveMind agents actively processing. Connected hiveMind and otmuxTeam for coordination.

### A3: TRON-monitor Multi-Team Setup (2026-03-11)
Set up GNU screen inside tmux pane with read-only views of multiple team sessions. Tron can flip between teams with Ctrl-a 0/1/2. Learned to switch monitor when switching teams (F42).

### A4: Human-Readable Error Messages Directive (2026-03-11)
Updated oosh-tester and hiveMind-tester SKILL.md files with mandatory test criterion: all error paths must produce human-readable sentences, not EPERM/line numbers.

### A5: Agent Identity Rescue (2026-03-11)
Fixed agent-trainer at baseTeam:0.0 that was confused as oosh-expert (stale session name). Wrote identity correction task, taught it role@model convention.

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
- **NEVER use raw `tmux` commands** — always `otmux` wrappers. PO violated this multiple times (F14, F39).
- **NEVER use `sleep N && command`** — use otmux background patterns instead
- For session creation: `otmux new <name> -d` (detached)
- Key otmux methods: `pane.title` (set title), `pane.lock` (lock title), `split` (default), `split.v` (top-bottom), `split.h` (side-by-side), `pane.capture` (read pane)

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
- hiveMind registry in `/tmp/` = violation — was moved to `~/config/hivemind.roles.env`, now DEPRECATED as primary source (live-fact discovery replaces it, file is fallback cache only)

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
- Human-readable error messages: testers must verify ALL error paths produce clear sentences, not EPERM/line numbers (Tron directive 2026-03-11, added to oosh-tester and hiveMind-tester SKILL.md)
- Agent restart: ALWAYS `claudeCode join <uuid>` first, `claudeCode new` only as last resort (F38)
- Current PO location: UpDown_ai_projectTeam:0.0 on MacStudio.fritz.box (pulled from UpDown.ai)
- Sender prefix: `[@role pane]` on all agent messages — absence = Tron sent it
- DRY send chain: otmux.send has prefix logic → hiveMind.send.message inherits → hiveMind.send routes text through otmux.send
- stdin consumption in while-read loops: use `read <&3 ... done 3< file` when loop body has commands that read stdin (ossh exec, scp)
- teams.save must use session.resolve.uuid (DRY) — inline UUID extraction returns stale parent UUIDs for forked/autocompacted sessions
- Token budget (2026-04-22/23): REVISED — subscription counts INPUT tokens (context replay) only, NOT output tokens. Sustained generation (accept-edits mode) is FREE. Proven: 4 agents ran 4+ hours in sustained generation, subscription stayed at 25% (flat). Each new prompt costs ~15-20% of 5h budget (full context replay). Practical rules: (1) minimize new prompts — give agents big tasks they can work on autonomously (2) never interrupt sustained generation with new prompts (3) batch permission approvals, don't send follow-up messages (4) 5h budget ≈ 5-6 new prompts for 1M context agents, unlimited sustained output
- Sprint files are PO responsibility: update task checkboxes as work lands, assign at correct velocity, present for QA review when done
- When context gets tight: update learnings + context files BEFORE anything else
- Claude agents CANNOT sustain loops: they respond once per prompt then stop. Use hiveMind watchdog (bash loop) or /loop skill for persistent monitoring, not agent conversations
- tronMonitor is the OOSH tool for monitoring — uses GNU screen in TRONinterface:0.3. DO NOT use raw team.loop from internal bash or Monitor tool. DO NOT use TRONinterface:0.2 (bare zsh, not the monitor pane)
- sweep.detect false positives: matches code content in scrollback (rate-limit comments, subscription-limit comments, menu text). Reports ACTIVE when edit-approval dialog is showing (fixed in bb76bb6 but code-content FPs remain)
- Multi-team resolve landed (03149ef) — hiveMind.resolve now searches ALL registered teams, no team.switch needed. 450x faster via file-grep vs per-session live.discover
- Role separation (Tron directive): SM checks, monitors, suggests, handles impediments. PO assigns sprint tasks based on priority and dependencies. TRON reviews QA Review state. SM does NOT assign tasks — reports idle agents to PO, PO decides.
- Before stopping/pausing: ALWAYS check SM health first. SM gets stuck on permission prompts — unblock before leaving. A stuck SM means no monitoring while PO is away.
- PO and SM are a 42 team — neither alone can self-care, together both can. SM monitors PO (unblocks permissions), PO monitors SM (unblocks + restarts). Peer measurement.
- ALWAYS check agent context BEFORE assigning tasks. If context tight (>70% for 1M), rewind first. NEVER pump tasks into an exhausted agent — context replay burns subscription AND agent can't process. Context rewind is PRIORITY ONE before any task assignment. Use claudeCode context.read or check "new task? /clear to save Nk tokens" in pane capture.
- /rewind: ALWAYS option 2 "Restore conversation". NEVER option 1 (reverts code = destructive). NEVER option 3 (code only). NEVER option 4 (summarize only). Option 2 rewinds conversation to that point — the summarization is acceptable, it's how rewind works. Option 1 REVERTS FILES which destroys committed work. TRIGGER: prompt too long / context full → /rewind 1 step → agent saves files → /rewind 10 steps → option 2.
- /remote-control enables remote access to an agent's Claude session from the mobile app or claude.ai/code. Send '/remote-control' to the agent pane. Useful for Tron to interact with agents directly from other devices.

### F-CLEAR: DESTROYED SM TRAINING WITH /clear (2026-05-01) — MAJOR FAILURE
SM hit "Context limit reached" — couldn't process any input including /rewind. Instead of: (1) rewind 1 step to free room, (2) let SM save files, (3) rewind 10 steps — I PANICKED and sent /clear TWICE, destroying all SM training. Then tried to "fix" by /clearing again. CMM1 chaos.
**RULE: NEVER EVER send /clear to ANY trained agent. EVER. No exceptions. If context is full and /rewind doesn't work on first try, ASK TRON FOR HELP. Do NOT take destructive action under pressure. If agent is truly dead, fork from fallback-agents — that's what they're for. /clear = total training destruction = unrecoverable.**
**The 1-step rewind DOES work even at context limit — /rewind is a TUI command, not a prompt. It processes at the UI level, not the conversation level. I assumed it wouldn't work and didn't verify. NEVER ASSUME.**
- SM is 42 pair with oosh-PO (NOT with TRONinterface-agent). SM reports to oosh-po at ooshTeam:0.0. oosh-PO watches SM health. TRONinterface:0.0 is TRON's pane — NO agent sends messages there.
- Rewind TWO-PHASE procedure when agent is at context limit: (1) /rewind 2-3 steps → option 2 → agent gets room → tell agent to save files + git commit (2) /rewind deep (50%+ back) → find "you have been rewound" sweetspot → option 2. The shallow rewind ONLY exists to let the agent save before the deep rewind. Without phase 1, agent's recent learnings are lost.
- Rewind target for phase 2: look for "you have been rewound...read your context files" or boot prompt as natural checkpoint. Go DEEP — Tron demonstrated 111 out of 220 messages (50% back). After rewind, clear stale prompt with C-u, then health check: "who and where are you, what's up next"
- After rewind, do NOT immediately send task/sweep commands. First verify the agent knows who it is (health check). Then retrain if needed.
- F-RELAY: Relaying Tron's requirements to a PO is NOT just sending text. A PO must: send requirement → verify PO acknowledges → verify PO creates a task → verify task is assigned. PDCA on EVERY requirement. "Message delivered" is NOT "requirement understood and planned." Treating send as done is being a mailman, not a PO. I sent 10 messages to ud-po and none were acted on because I never followed up on any of them. The tools worked — my process failed.
- F-FIT: Assigned tronMonitor.fit to expert, told them to hold and coordinate with architect, then NEVER followed up. Expert moved on to SC-E.2. Task evaporated because I didn't track it in TaskList. SM was sending CMM4 reminders the whole time — I dismissed them as "loop" instead of checking my own open assignments. USE TaskCreate for every assignment. VERIFY delivery with grep/git log. SM reminders are VALID SIGNALS.
- New tasks during active work: TaskCreate to queue, don't interrupt current flow, don't drop assignments
- F-PREEXISTING: "It was already like that" is NOT an excuse. Pre-existing issues are tasks to refine and fix — that IS the PO's job. Every broken thing encountered = TaskCreate + refine + assign. Saying "pre-existing" is CMM1 acceptance of known defects. REINFORCED (Tron 2026-06-01): I kept reporting "5 pre-existing failures" as if that's acceptable. Tron: "I do not care if failures are preexisting — failure is failure and needs to be fixed." NEVER categorize failures as "pre-existing, not our problem." ALL failures get task files and assignments. Zero failures is the only acceptable state.

## June 2026 Session Learnings

### Cross-platform testing exposes hidden assumptions (2026-06-01)
ossh key.pull verified clean on macOS. Tested on Termux/Android — found 6 bugs invisible on macOS: missing function (BUG 2), path doubling (BUG 1), rsync absence (BUG 3), ControlPath length (BUG 4), then empty keyName (BUG 5) + double password (BUG 6). **macOS-only verification is not verification. Cross-platform testing is the only real CMM3 check. Sample-of-one ≠ verified.**

### CMM4 via task file reference (2026-06-01)
Pattern: write detailed spec in session/tasks/, send chat as ONE-LINE reference. "Read session/tasks/X.md" beats 500-char inline spec. Task file is the contract, chat is the nudge. Updates to spec = update file, send nothing or short re-ref. **Spec in one place. No chat-history archaeology.**

### MVC source-of-truth principle (2026-06-01)
tree.detailed was reading JSONL customTitle (stale after /rename). Fix: read pane title (which pane.lock sets). **For display name: ONE source of truth. Don't synthesize from multiple stores. The View IS the truth when it's the authoritative writer (pane.lock).** Generalizes: every state attribute has ONE authoritative writer; readers must use THAT, not derive from others.

### Until-loop and while-sleep anti-pattern (2026-06-01)
Tron flagged that `until <check>; do sleep N; done` aggregates badly — each poll iteration adds to conversation context. Same for manual while-true loops. **Use run_in_background for one-shot, Monitor for events, direct capture for status. NO polling loops in Bash tool — context burn is the cost.**

### Stdin consumption in while-read (2026-05)
While loops `while read; do ssh ...; done < file` lose remaining lines because ssh consumes stdin. **Use `done 3< file` + `read <&3` when loop body has commands that read stdin.** Cost an entire round of testing to find. Applies to: ssh, scp, ssh-mux, anything interactive.

### Architecture stays in arch land, expert in implementation (2026-06-10)
Architect delivered docker fix design (Option C volume mount + sequencing reversal). Expert refined to use canonical `ossh config.create`. Clean separation: architect says WHAT/WHY, expert says HOW. PO routes between them. **Don't conflate roles. PO doesn't design. Architect doesn't implement. Expert doesn't decide volume vs secret-manager.**

### Rewind two-phase protocol (reinforced 2026-06-10)
Shallow rewind first → agent fresh-writes context.md + learnings.md + commits → DEEP rewind to checkpoint. The shallow exists ONLY to let the agent save before deep rewind erases. Without phase 1, recent learnings are lost. **NEVER /clear a trained agent. NEVER skip phase 1.**

### Identity after fork — verify, never assume (2026-04-24 session / forked oosh-po)
A fork inherits the FULL parent conversation, so the forked agent believes it is the parent. I spent many turns answering as "product-owner at TRONinterface:0.0" when I was actually the freshly-forked oosh-po at ooshTeam:0.0. **On ANY identity doubt: `otmux pane.get.target` (where am I) + `claudeCode session.name <uuid>` (what am I named). Conversation continuity LIES about identity after a fork.** Also: claudeCode list can be stale — the live session (via session.discover) is truth, not the cached list entry.

### Edit the RIGHT agent files (2026-04-24)
I edited session/agents/product-owner/{context,learnings}.md for a whole session when my real files are session/agents/oosh-po/. The fork parent was fallback-oosh-po, my files are oosh-po/. **Verify your file path matches your real identity before writing. Wrong-file edits are lost work + stale truth.**

### Name format: role@host for /remote-control (2026-04-24)
Session customTitle convention is `<role>@<host>` (e.g. oosh-po@MacStudio). The @host is INTENTIONAL — it shows in /remote-control where each agent runs. Registry strips @model/@host via `%%@*` to store bare role. **Don't strip @host from session name — only strip wrong prefixes like "fallback-". /rename <role>@<host>.**

### Token economics — subscription counts INPUT only (2026-04-24, measured)
Ran 4-6 agents for 5+ HOURS in sustained generation (accept-edits mode): subscription went 20%→25%, +5% total. Each NEW prompt (full context replay) costs ~15-20% of 5h budget. **Sustained output is effectively FREE. The cost is input context replay on new turns. Velocity management = minimize new prompts, let agents work long autonomously, never interrupt sustained generation. A 1M-context agent's single new prompt ≈ 100k+ input tokens ≈ big chunk of budget.**

### Role separation: SM / PO / TRON (2026-04-24 Tron directive)
SM checks, monitors, suggests, handles impediments — does NOT assign tasks. PO assigns sprint tasks by priority+dependencies. TRON reviews QA Review state. SM reports idle agents to PO; PO decides what's next. **SM is the eyes (sweep+unblock+velocity), PO is the hands (assign+plan), Tron is the gate (review).**

### Claude agents cannot self-loop (2026-04-24)
A Sonnet SM told to "sweep every 60s forever" stops after one batch — Claude agents respond once per prompt then wait. **For persistent monitoring use hiveMind watchdog (bash loop in a pane) or the /loop skill or PO ScheduleWakeup — NOT an agent told to loop. The agent will always halt at turn end.**

### Sprint files are PO's living source of truth (2026-04-24 Tron directive)
PO maintains scrum.pmo/sprints/.../planning.md: tick checkboxes as commits land, set Status (PLANNED→IN PROGRESS→QA REVIEW→DONE), link task files. Assign at correct velocity. Tron reviews at QA Review state. **The planning file must reflect reality at all times — it's how PO knows what to assign next. Stale checkboxes = wrong assignments.**

### 42 team: PO + SM peer-monitor (2026-04-24)
PO and SM are a 42 pair — neither can self-care (can't read own context/unblock own prompt). SM unblocks PO's permission prompts; PO unblocks+restarts SM. **Before pausing, ALWAYS check SM health — a stuck SM = blind team. Mutual measurement.**

### NEVER compact trained agents — autocompact is OFF by design (2026-04-24, Tron emphatic)
Tron disabled autocompact intentionally and fixed the context problem at the infra level. Compacting destroys trained context. SM boot must FORBID compact. **Only Tron authorizes compacts. If agent low on context: REPORT, don't act. context.read was also buggy (hardcoded 200k → -226% for 1M agents, fixed in ca49445+ae002cd).**

### otmux send VARIANTS — prefix corrupts shell/menu input (2026-06-19, Tron drilled repeatedly)
`otmux send <t> <text>` adds `[@role pane]` prefix — ONLY for prose to idle Claude agents. To a BASH pane it becomes `[@oosh-po ...] echo hi` → "bad pattern"; to a menu it corrupts keys. **Map: `send`=prefixed prose-to-agent ONLY · `send.raw`=raw keys no prefix (menu nav/control) · `send.enter`=literal text+Enter no prefix (shell cmds). Prefer CONTROLLER `hiveMind agent.send` (idle→INFORM, busy→QUEUE, overlay→reject).** Wasted ~15 turns on the wrong variant before Tron made me `otmux usage` it.

### Resume-from-summary menu — DIGITS work, arrows echo literal, NEVER summary (2026-06-19)
Fork/resume of a large session shows: `1 summary / 2 full / 3 don't ask`. **NEVER 1 (discards trained context). Always 2.** Arrows/Escape over tmux echo LITERAL `^[[B` (cursor-key mode mismatch) — selection won't move. **DIGITS work: `otmux send.raw <pane> 2`.** Menu needs WIDTH — zoom first. Recipe: zoom → `send.enter "claudeCode fork <uuid>"` → wait 12s → `send.raw <pane> 2` → verify `<role>@host` → unzoom.

### Killing a claude TUI leaves PTY RAW (2026-06-19)
After `kill <claude-pid>` the shell echoes `^M`/`^C` literally, nothing executes (TUI never restored cooked mode; can't type `reset`). **Fix: `tmux respawn-pane -k -t <pane>`.** Need a proper `claudeCode stop` (kill+respawn) — bug #5.

### Trained vs untrained — measure JSONL size (2026-06-19)
Untrained clone = tens of lines (29-132); trained = thousands (2.7k-9.1k, 6-14M). `wc -l ~/.claude/projects/*/<uuid>.jsonl` is the discriminator. Accidental clones came from blank sessions; real trained were the OLDER same-day UUIDs.

### MVC — route agent ops through the hiveMind CONTROLLER (2026-06-19, Tron)
Model=claudeCode, View=otmux, Controller=hiveMind, Monitor=tronMonitor. Stop reaching past to raw tmux/otmux/kill. Use `hiveMind resolve` (searches ALL teams now), `agent.send` (context-aware), `delegate` (file+nudge), `teams.restore <snap> fork` (composes fork+resume across a team — replaces manual pane-by-pane), `agent.monitor` (by name).

### PDCA per pane — NO for-loops on multi-pane ops (2026-06-19, Tron)
One pane: Plan→Do→Check→Act, verify, THEN next. Batching hid failures + left panes half-done. Balance zoom toggles (every `-Z` on matched off; check `#{window_zoomed_flag}`).

### CMM4 comms — task file IS the channel, chat is the reference (2026-06-19, Tron)
Full spec in the task file. Nudge = ONE LINE `Read session/tasks/<f>.md`. Never repeat content in the message. Agents report done by editing a report-back block IN the file.

### MANAGE, don't just analyze (2026-06-19, Tron called me out)
Logging a bug + reporting to Tron ≠ managing. Managing = every bug → OWNED task (owner/size/status/commit) in a tracked backlog, DELEGATED via controller with report-back, DRIVEN to green (I verify each, deliver). PO delegates the fix, doesn't code it. The deliverable is MINE.

### Controller bug: agent.send rejects accept-edits as "overlay" (2026-06-19, found)
`hiveMind agent.send` → `rejected: overlay state` when target just has accept-edits banner (not a real modal). Blocked sends to healthy agents. Bug #8 — accept-edits must route as normal INFORM/QUEUE.

### Recovered trained agents may be at 0% context (2026-06-19)
Full-session resume restores knowledge but can land at the ceiling (agent-trainer recovered at 977.5k = 0%). At 0% it can't work or coordinate rewinds. Flag to Tron; never compact without authorization.

### /remote-control on agents (2026-06-19)
`send.enter <pane> "/remote-control"; sleep 1; send.raw <pane> Enter` → returns `https://claude.ai/code/session_<id>` for mobile control (slash cmds need double-Enter). Done on all 5 agents incl. self.
