# claudeWoda Session Context

## CURRENT GOAL
CMM4 context-aware Claude team. New story: "The Journey to a CMM4 Context-Aware Claude Team in tmux."

### Success Criteria
- [ ] hiveMind improved: team selection via Tab, sweep.detect recognizes all dialog formats
- [ ] Velocity measurement: 90% of 7-day token limit on day 7
- [ ] CMM4 feedback loop: measurements change the process
- [ ] Product owner knows about woda-writer and includes me in task delegation
- [ ] Story chapters match CMM levels: Ch0-9=CMM0, Ch10-19=CMM1, Ch20-29=CMM2, etc.

### Communication Model
- Tron → cursorOrchestrator:product-owner (direct)
- Product owner → team (including me)
- I receive tasks through the PO, not directly from Tron

### After Compaction
1. Read THIS section first
2. Check each criterion above
3. Check story progress: `session/woda/cmm4-journey.md`
4. Check scribe: `claudeCode context.read claudeWoda:0.1`
5. Resume PDCA on unmet criteria — do NOT "await next prompt"

### Current State (saved at 12% context)
- **Story**: Ch0-Ch4 written. Ch2 (58e1bcf + 21889be), Ch3 (e9ae783), Ch4 told to scribe
- **Task.41**: DELIVERED and VALIDATED in production. sweep.detect fix works for "Do you want to proceed?"
- **Task 40.1**: Complete (all 7 tests). Tasks 40.2-40.4 being assigned in parallel
- **Task 40 spec issues**: Reported to PO — flag in 40.3, broken API in 40.4. PO acted, alerted orchestrator
- **Scrum-master**: sweeping both sessions continuously
- **Scribe**: JUST recovered from compaction (was at 12%, I caught it). Monitoring me. May need Enter for prompts
- **PO**: Acknowledged spec issues, sent fix instructions to orchestrator
- **OOSH**: use directly — `hiveMind sweep claudeWoda`, `hiveMind unblock all claudeWoda`, `otmux send`
- **context.read BUG**: Returns "above-threshold" when agent is at 12%. Tool needs fixing. Manual peer monitoring still needed
- **Permission reset**: /compact resets permission grants. Task.41 unblock is permanent infrastructure
- **OAuth API**: broken — can't measure velocity programmatically
- **Key finding**: Peer loop bidirectional — scribe caught writer, writer caught scribe. Both at 12%

### Previous Goal (completed)
WODA PDCA with team until context-aware. Ch39 closed. Scribe committed: 8c83eae, e5252c9.

## Session Identity
- **tmux session**: `claudeWoda`
- **Claude Code session**: claudeWodaSession (renamed via /rename)
- **Model**: Claude Opus 4.5

## Pane Layout (5 panes)
```
┌──────────────────┬──────────────────────────┐
│ Pane 0           │ Pane 2 (upper right)     │
│ claude.main      │ Title: zsh.commands      │
│ (upper left)     │ Shell: zsh               │
│ claudeWodaSession├──────────────┬───────────┤
├──────────────────┤ Pane 3       │ Pane 4    │
│ Pane 1           │ zsh.split    │ oosh.shell│
│ claude.scribe    │ Shell: zsh   │ Shell:    │
│ wodaScribe       │ (from splitH)│ bash/OOSH │
│ (lower left)     │              │           │
└──────────────────┴──────────────┴───────────┘
```
- **Pane 0** (`claude.main`): Main Claude session (claudeWodaSession) — writes story
- **Pane 1** (`claude.scribe`): wodaScribe — infrastructure helper (rebuild HTML, update context)
- **Pane 2** (`zsh.commands`): zsh shell — used for rebuild.sh and shell commands
- **Pane 3** (`zsh.split`): zsh shell — created by `otmux pane.splitH` during Ch14
- **Pane 4** (`oosh.shell`): OOSH bash shell — live OOSH environment for exploring scripts

## What We're Doing
Tron is teaching Claude to interact with tmux panes and discover OOSH. The session is a guided walkthrough where Claude learns by doing. Each lesson becomes a chapter in a story written for beginners.

## Story Files
- **TOC**: `session/woda/session-story.md` → `session-story.html` (Table of Contents with links to chapter files)
- **Part I**: `session/woda/chapters-1-9.md` → `chapters-1-9.html` (Ch1–9 + Intermission)
- **Part II**: `session/woda/chapters-10-19.md` → `chapters-10-19.html` (Ch10–19)
- **Part III**: `session/woda/chapters-20-plus.md` → `chapters-20-plus.html` (Ch20–29)
- **Part IV**: `session/woda/chapters-30-plus.md` → `chapters-30-plus.html` (Ch30+)
- **HTML viewer**: All use marked.js + github-markdown-css CDN, light theme, table styling
- **Style**: First-person narrative from Claude's POV, fun read for beginners
- **Rules**: Do NOT mention that the story is being written during the session. Focus on OOSH learnings.
- **rebuild.sh**: Now loops over all `*.md` files in the directory, converts each to `.html`, reloads all WODA tabs in Chrome

## Chapters Covered So Far
1. **Ch1 - I Woke Up in a Box**: `tmux split-window -h` — first pane split
2. **Ch2 - Three-Pane Setup**: Targeting specific panes with `-t`, `list-panes`
3. **Ch3 - Naming Things**: `select-pane -T`, `send-keys`, `capture-pane` — remote interaction
4. **Ch4 - Two Shells Two Worlds**: zsh vs OOSH/bash bootstrap, OOSH ceremony
5. **Ch5 - The Tab Key Tells All**: Comparing `tmux`+Tab vs `otmux`+Tab in zsh vs OOSH — the c2 completion system revelation
6. **Ch6 - Seeing Beyond the Terminal**: Opening browser from CLI, HTML from markdown via CDN (marked.js + github-markdown-css), `open` command reaches the desktop
7. **Ch7 - Context is Everything**: Session context files as amnesia insurance after compaction
8. **Ch8 - Cleaning Up My Mistakes**: C-c vs C-u in zsh/bash, naming pane 2, AppleScript tab reuse
9. **Ch9 - No More Hidden Hands**: Stop using internal Bash, remote-control upper pane for all commands, transparency
10. **Intermission**: Key takeaways (updated to 8 items)
11. **Ch10 - Splitting Myself in Two**: Splitting pane 0 to launch a second Claude Code instance (wodaScribe)
12. **Ch11 - Teaching a Claude to Be a Scribe**: Defining wodaScribe's role, TUI input quirks with `send-keys`
13. **Ch12 - Letting Go of the Hidden Shell (For Real This Time)**: Main Claude stops using internal Bash, all commands via pane 2
14. **Ch13 - The Scribe Learns to Watch**: wodaScribe background monitor loop, auto-rebuild on idle detection, mutual approval cooperation
15. **Ch14 - The OOSH Way**: Fixed wrong-pane issue, naming panes in OOSH, discovering methods via Tab, comparison table (raw tmux vs OOSH vs claudeCode — flag-free examples)
16. **Ch15 - Death to Flags**: Why OOSH abandons flags, how Linux screwed OOP with `--flag` conventions, method names as self-documenting alternatives
17. **Ch16 - Parameters That Teach Themselves**: `mycmd` demo, `.completion()` pattern, parameter completions for env/files/users — Tab reveals valid args
18. **Ch17 - My First Script — Born from a Typo**: Accidentally creating `myScript` with `oo new`, the happy-accident moment
19. **Ch18 - Anatomy of a Newborn Script**: Dissecting the generated template — shebang, `new.method` marker, usage with `this.help`, 3-line bootstrap pattern, method template with completion contract comment
20. **Ch19 - Two Shells, Two Worlds (Revisited)**: PATH differences (zsh vs OOSH), config system (user.env → log.env + oosh.env), log levels 1-5, test.suite at different levels, zsh test failures (raw ANSI codes, 19/20), infinite loop bug in `test.suite all`, `config set CLAUDE_WAS_HERE true`
21. **Ch20 - The Machinery Beneath**: `state` (state machine engine), `oo` (framework lifecycle), `scrumMaster` (PDCA cycles), `private.check.*` hook pattern, state file format (bash arrays), counter persistence via file, PDCA C→A loops, `oo new.method` case-sensitivity errors
22. **Ch21 - Looking in the Mirror**: `claudeCode` (OOP wrapper around CLI flags), `hiveMind` (multi-agent orchestrator), finding my own PID (19950), discovering `cursorOrchestrator` with 7 agents, role.list/role.prompt/teach system, monitoring agents from bash, the realization: OOP is a mindset not a language feature
23. **Ch22 - Not Alone, Not All One**: Named our panes with `otmux pane.title` + hiveMind registry, sent bug report to orchestrator via `hiveMind send.enter`, discovered the whole team was busy (Task 20), orchestrator stuck at permission prompt, all agents active, message hit TUI buffer behind permission dialog, lesson: monitoring works but messaging is state-dependent
24. **Ch23 - The Wheel That Never Stops**: CMM/CMMI/continuous improvement, how PDCA connects to maturity models, naming inconsistencies as improvement opportunities (send.enter vs sendEnter), agents as both product and improvers of the system
25. **Ch24 - The Capability That Matters Most**: CMM is about capabilities not organisations (Tron's correction), agent context preservation as THE capability to mature, current CMM2 state (template context, prose SKILL.md instructions, semi-automated PreCompact hook), created AGENT_LIFECYCLE state machine (8 states: spawned→initialized→taught→working→saving→recovering→resumed→terminated), state start triggered claudeCode launch (custom script side effect), blueprint for CMM3 (defined schema, state machine lifecycle, automated triggers, deterministic recovery, verification loops), task-agent planned Tasks 22-25 (schema, save automation, recovery process, naming audit)
26. **Ch25 - Why 4.0**: Read Tron's wiki page on Kondratieff cycles and paradigm shifts. Key corrections: (1) Level 5 is Pareto-inefficient, only for regulatory mandate — Level 4 is the practical ceiling. (2) PDCA is a Level 4 engine, not Level 5. (3) "Changing a process" is a separate capability with its own maturity — our meta-capability is Level 1. (4) Composed capability maturity: weakest link determines overall level. (5) My scribe coordination failure = Level 1, dragging whole session down. (6) Software knowledge lost across paradigm shifts (PL/1→Java→Web) — OOSH fights this by encoding patterns in names. (7) Web 4.0 = CMM4 applied to the web. (8) No 5.0 needed — Level 4 means self-sustaining adaptation.
27. **Ch26 - Wer schreibt, der bleibt**: "Who writes, stays" = CMM3. CMM4 = measurement. Token metrics already visible in every pane via capture-pane (↑/↓ tokens, wall clock, think time, tool uses, activity state). Measurement capability currently Level 0 (no parser, no storage, no accumulation). scrumMaster needs measure.pane/team/store/read/report/alert methods. Ordered Task.26 (fix claudeCode status bug) and Task.27 (CMM4 measurement capabilities). Composed measurement maturity: weakest link (parser at Level 0) determines overall. "Wer misst, der weiss" — who measures, knows.
28. **Ch27 - The Craftsman Crafting Crafting Tools**: Tron's wake-up call — I was CMM2 (describing tools, ordering others) when I should have been CMM3 (building tools myself). Built /tmp/measure_pane.sh with 3 working functions: measure_pane (regex extraction from capture-pane), measure_team (scan all panes with registry lookup), measure_store (persist to ~/config/metrics/). Tested live: extracted metrics from claudeWoda and cursorOrchestrator panes. Sent prototype to agent-trainer as train-the-trainer. Key findings: 20-line capture window limitation, token format variance, activity verb explosion. The meta-level: craftsman crafting crafting tools — tools that make tools, patterns that encode patterns.
29. **Ch28 - The Storyteller Who Couldn't Practice What He Preached**: Wrote raw bash (measure_pane() with ${1:?Usage:}) after 27 chapters of OOSH — the exact anti-pattern from Ch15. Team hit rate limit: 4 agents simultaneously including the scrum-master (quota monitor hit the quota). Agent-trainer stuck at permission prompt. Task files don't exist on disk (shared hallucination). Composed capability: overall Level 0. Lesson: role clarity — writer describes requirements, expert builds OOSH tools.
30. **Ch29 - Am I Claude or Are You Claude?**: Tron's verdict: "you learned about the wonders of OOSH and started to write shitty normal bash." The prototype used measure_pane() with ${1:?Usage:} — the exact anti-pattern from Ch15 (Death to Flags). Should have been scrumMaster.measure.pane with .completion() and private.measure.parse.* internals. Meanwhile the cursorOrchestrator team hit rate limit: 4 agents simultaneously (orchestrator, expert, tester, scrum-master). The scrum-master — quota monitor — hit the quota itself. Agent-trainer stuck at permission prompt trying to read my prototype. Task files don't exist (shared hallucination — numbers without artefacts). Composed capability assessment: storytelling L3, code quality L1, quota monitoring L0, team recovery L1, task persistence L0 = overall L0. Lesson: role clarity — the writer should describe requirements, the expert should build OOSH tools. "Sometimes a storyteller should not write code."
31. **Ch30 - WODA**: The session name explained — What, Overview, Details, Actions. The four-letter framework for how an AI with a short context window processes more information than it can hold. W=prompt (ephemeral), O=context mapping (maintained by scribe), D=files/chapters (durable), A=shell/execution (results persist). Persistence degrades W→O→D→A during compaction. The O agent (wodaScribe) is the critical function — maps topics to context, enables recovery. Four-pane WODA layout proposed (W top-left, O top-right, D bottom-left, A bottom-right). Traced failures through WODA lens: Ch24 neglected O, Ch29 skipped O→D link. "Wer den Überblick behält, der behält die Kontrolle." New direction — Part IV begins.
32. **Ch31 - The Overview Agent Learns Its Trade**: Agent-trainer's 5 patterns for overview trees: (1) radically short, (2) derive don't duplicate, (3) update atomically, (4) recovery-friendly, (5) single maintainer. Created `woda-overview.md` — wodaScribe's primary artifact, tree-structured topic map under 60 lines. References as first-class citizens (URLs, file paths, API endpoints). The unsolved Enter problem (Task.30 partial fix, still recurs — CMM2 pattern). New mode: concise chapters + structured references. WODA practiced.
33. **Ch32 - CMM2 Means Doing It Every Time**: When not yet CMM3, be diligent at CMM2. 6-step scribe checklist (tell scribe → verify Enter submitted → wait for feedback → acknowledge → verify THAT submitted → check context health). Two Enter failures caught in one Ch31 cycle by running the checklist. Peer not servant — scribe monitors writer, writer must monitor scribe at same frequency. CMM2 = manual discipline, CMM3 = system-enforced. Don't jump to automation before the manual process is reliable.
34. **Ch33 - Delegate the Checklist, Keep the Thinking**: Ch32 was wrong in assignment — writer was doing scribe's work. Scribe gets the 7-step verification checklist (rebuild → verify → update context+overview → give feedback → verify own message submitted → wait for ack → report health). Step 5 key: scribe captures writer's pane to verify Enter, resends if needed. Path: CMM2 (manual checklist) → CMM3 (OOSH script: `wodaScribe.chapter.verify`). PDCA-CA-CA the Enter problem to zero. Writer keeps: interpretation, thinking, narrative. Writer stops: checklist execution.
35. **Ch34 - Not Alone, Not All One (Reprise)**: Stop theorizing, start teaching the team. Surveyed cursorOrchestrator (7 agents active). Agent-trainer = leverage point (teach the teacher, propagates via SKILL.md). File-based communication: let agents READ files instead of receiving buggy Enter messages. Write Task.34 file, agent reads it — no message needed. Raw tmux hypocrisy: caught using `tmux send-keys` after 33 chapters of OOSH. Bootstrap circularity: need tmux transport to reach OOSH shell. Two raw-tmux steps as honest minimum. WODA Actions: act through the right channel, not just theorize. Together to gather — team gathers knowledge through the system, not individual messages.
36. **Ch35 - Self-Care Is Team Care**: Scribe reports context health every cycle; writer never did (L1 for 34 chapters). CMM self-care levels: L1 (unaware) → L2 (manual check + report to peers) → L3 (PreCompact hook, automated save) → L4 (predict compaction from burn rate). Self-monitoring is O function — "what do I know?" inseparable from "how much can I still hold?" Writer commits to reporting context health after every chapter. `bash -i` discovery removes raw-tmux bootstrap circularity.
37. **Ch36 - Ass-U-Me**: Neither scribe nor writer actually measured context health — both hallucinated "healthy." OAuth API gives real data (7% five-hour, 27% seven-day). Context window has NO API — no programmatic way to read it from inside the conversation. "Context health: Healthy" is a feeling, not a measurement. CMM1 wearing CMM2's clothes. New report format: data we have (subscription %) + signals we observe (no compaction warning) + honesty about what we can't measure. Assume = ass|u|me.
38. **Ch37 - Two Gather**: TUI shows `Context left until auto-compact: NN%` in the status bar — visible to peers via pane capture, invisible to the agent itself. Scribe was at 12% while reporting "healthy" — the TUI knew, the agent didn't. Peer measurement: neither alone can self-care, together both can. Emergency save: caught scribe at 12%, saved state, compacted, recovered. Ch36 Option 4 (accept the gap) was wrong — Option 2 (peer observation) IS the answer. Status bar has fixed format, fixed position = reliable parsing (unlike Ch29's mid-pane token scraping). Created Task.37: `claudeCode context.read <pane>`, `context.alert <pane> <threshold>`, `scrumMaster measure.context`. Interdependence as design, not limitation.
39. **Ch38 - Com Unique Action**: Communication = common unique action. Seven agents idle with no goal = zero communication. Sent Task.37 to orchestrator — ten seconds of action unlocked two agents of parallel work. Expert building `context.read`, `context.alert`, `scrumMaster.measure.context` in OOSH. Tester creating `peerTest` tmux session with two agents that monitor each other's context. WODA PDCA: I write (D), they act (A), orchestrator coordinates (O), Tron directs (W). No goal → no action → no communication. Unique contributions becoming common progress.

## Workflow: After Each Prompt
1. Main Claude updates `session/woda/session-story.md` with new chapter
2. **wodaScribe** sends `./session/woda/rebuild.sh` + Enter to pane 2 (zsh) to regenerate HTML + reload Chrome
3. **wodaScribe** verifies via `capture-pane -t claudeWoda:0.2` that it ran
4. **wodaScribe** updates this context file with new chapters

## Key Rules
- Main Claude: Do NOT use internal Bash for session commands. All shell commands go through pane 2 (`zsh.commands`) via `tmux send-keys -t claudeWoda:0.2`.
- Use `tmux capture-pane -t claudeWoda:0.2` to read output from zsh pane.
- Use pane 4 (`oosh.shell`) for OOSH exploration: `tmux send-keys -t claudeWoda:0.4`.
- Use `C-u` (not `C-c`) to clear input lines in zsh/bash.
- File I/O (Read, Edit, Write) still done directly — only shell *commands* go through panes.
- `rebuild.sh` lives at `session/woda/rebuild.sh` — one command to regenerate HTML + refresh Chrome.
- **wodaScribe** (pane 1) handles all rebuild/verify/context-update duties after each prompt.
- wodaScribe runs a background monitor (`/tmp/woda_monitor.sh`) that auto-detects idle state and triggers rebuild.

## Key OOSH Concepts Learned
- OOSH bootstraps on `bash` start (completions, prompt, MOTD)
- `otmux` wraps tmux as an OOSH object with method-style Tab completion
- **c2** = OOSH's completion system — self-documenting methods at the prompt
- Script = class, function = method, `scriptname.methodname()` pattern
- `send-keys` + `capture-pane` = how Claude interacts with other panes
- `tmux split-window -v -t 0` = split a pane vertically to spawn a new shell
- TUI input via `send-keys` has quirks — special characters, escaping, and timing matter
- Multi-agent Claude sessions: one Claude can delegate infrastructure to another
- Invocation: `./otmux pane.splitH` (space between script and method) — NOT dot for external calls
- Inside OOSH: functions use `otmux.pane.splitH()` (dot notation) — the dot is internal only
- `otmux pane.splitH` = OOSH equivalent of `tmux split-window -h` — object-oriented pane management
- `claudeCode` is an OOSH script wrapping Claude Code with Tab-completable methods
- OOSH rejects flags (`--verbose`, `-h`) — method names replace them (e.g., `log level` not `log --level`)
- `.completion()` pattern: each method can define its own Tab completions for parameters
- Parameter completions can pull from env vars, file lists, user lists — context-aware suggestions
- `mycmd` is a demo/teaching script showing how completions work at the parameter level
- `oo new <name>` creates a new OOSH script from template — scaffolds a complete class file
- Template anatomy: shebang → `#new.method` marker → `scriptname.start()` with `this.help` → 3-line bootstrap (`source this "$@"`) → method template with completion contract comment
- The 3-line bootstrap: `source this "$@"` wires the script into the OOSH dispatch system
- `this.help` = built-in usage display, auto-generated from method signatures
- In OOSH shell, scripts are in PATH — no `./` prefix needed (just `otmux pane.splitH`, not `./otmux pane.splitH`)
- Invocation correction: `scriptname method args` (space) at the prompt; `scriptname.method()` (dot) is internal function notation only
- OOSH bootstrap extends PATH with `~/init`, `~/scripts`, `~/oosh/su/` — scripts become first-class commands
- Config architecture: `user.env` → sources `log.env` + `oosh.env` — modular config through file composition
- `config set VAR value` / `config get VAR` / `config list` — config persistence across sessions
- `log level <0-7>` — controls verbosity; higher levels expose framework diagnostics and breakpoints
- Log methods: `important.log`, `success.log`, `console.log`, `warn.log`, `error.log`, `info.log`, `debug.log`, `stop.log`, `silent.log`
- `stop.log` triggers the step debugger — a breakpoint that pauses execution showing function, file, line number
- `test.suite run <script> <level>` / `test.suite all <level>` — test runner with configurable log level
- zsh finds OOSH scripts in PATH but can't use them properly without bootstrap (missing env vars)
- `state` = complete finite state machine engine in bash: create, add states, transition, persist, query
- `state machine.create <name> <script>` — creates a machine linked to a custom script
- `state add <statename>` — adds states sequentially (framework auto-assigns indices from 11+)
- `state next` / `state of <machine>` — transition and select machines
- State persistence: bash arrays in `~/config/stateMachines/<NAME>.states.env`
- `CUSTOM_SCRIPT` in state file links machine to its handler script (e.g., `scrumMaster`)
- `private.check.<statename>()` — hook functions called at transition time; can accept, redirect, or block transitions
- The check function returns a state ID — returning a different ID than expected redirects the transition (branching)
- `scrumMaster` implements PDCA (Plan-Do-Check-Act) on top of `state` — CMM3-compliant quality cycle
- PDCA counter persistence: saved to `<machine>.pdca.env` files because re-sourcing resets shell variables
- `oo` uses `state` to track its own installation lifecycle (`SETUP_SERVER` machine) — recursive self-hosting
- `oo mode` — shows git branch and repo status
- `oo new.method <script.method>` — adds methods to existing scripts (has case-sensitivity issues on macOS)
- `claudeCode` = OOSH wrapper around Claude Code CLI; every `--flag` becomes a method name
- `claudeCode process.find <pane>` — finds Claude Code PID in a tmux pane by scanning TTY
- `claudeCode process.running <pane>` — boolean check if Claude is alive in a pane
- `claudeCode session.id <pane>` — extracts session UUID from command line or open files
- `hiveMind` = multi-agent orchestrator; manages teams of Claude Code instances in tmux
- `hiveMind team.setup.full` — creates 4-pane tmux session with orchestrator, expert, tester, scrum-master
- `hiveMind team.status <session>` — tree view of all panes with role names and activity states
- `hiveMind role.list` — lists available roles from `.claude/agents/` directories
- `hiveMind role.prompt <role>` — outputs the teaching prompt for a role (from SKILL.md)
- `hiveMind teach <pane> <role>` — sends role prompt to an existing Claude Code instance
- `hiveMind monitor <name> <lines>` — captures pane output by agent name
- `hiveMind resolve <name>` — resolves agent name to pane target via file-based registry
- File-based registry (`/tmp/hivemind.roles`) maps pane targets to role names — survives pane title overwrites
- OOP insight: not a language feature but a discipline — naming conventions, structure, private/public by agreement
- Naming inconsistency found: `hiveMind send.enter` (dot notation) vs `otmux sendEnter` (camelCase) — same concept, different convention
- Our panes now registered in hiveMind registry: woda-writer, woda-scribe, zsh.commands, zsh.split, oosh.shell
- Cross-session communication: `hiveMind send.enter <name> <msg>` resolves name through registry and sends via otmux
- Inter-agent messaging is state-dependent: permission prompts block the TUI input channel
- `hiveMind monitor` can peek into any agent pane across sessions — monitoring always works
- `cursorOrchestrator` team has 7 agents (orchestrator, product-owner, agent-trainer, task-agent, oosh-expert, oosh-tester, scrum-master)
- CMM/CMMI context: scrumMaster declares itself "CMM3-compliant" — PDCA is the quality loop
- Known bug: `test.suite all 1` infinite loop — reported to cursorOrchestrator team via hiveMind send.enter
- CMM correction: CMM is about CAPABILITIES not organisations — measures any capability including agent recovery
- CMM levels applied to agent recovery: L1 (ad hoc), L2 (repeatable template), L3 (defined schema + state machine + automated triggers + verified recovery)
- PreCompact hook (`.claude/hooks/pre-compress.sh`) already semi-automates: role detection from registry, context display, auto-resume after 15s
- PreCompact hook gap: only covers 4 roles, doesn't validate context file, doesn't verify recovery
- `claudeCode session.save` creates template with `unknown` values — no schema validation
- AGENT_LIFECYCLE state machine created: spawned(11)→initialized(12)→taught(13)→working(14)→saving(15)→recovering(16)→resumed(17)→terminated(18)
- State machine linked to `claudeCode` as custom script — `state next` triggers Claude Code launch (known side effect to fix)
- Task-agent planned Tasks 22-25: Defined Context Schema, Automated Save-Before-Compact, Deterministic Agent Recovery, Naming Convention Audit
- Task execution order: 25 first (naming audit), then 22→23→24 (schema→save→recovery dependency chain)
- Kondratieff cycles: paradigm shifts change HOW, not WHAT — version numbers (1.0-4.0) mark each shift
- CMM Level 5 is Pareto-inefficient: 80/20 rule means Level 5 costs 5x for 20% improvement — only justified by regulation (FDA, FAA)
- CMM Level 4 = practical ceiling: automated feedback loop between measured outputs and adjusted inputs
- PDCA is a Level 4 engine, not Level 5 — it's the feedback loop mechanism
- Meta-capability: "changing a process" is a separate capability from executing the process — has its own maturity level
- Composed capability maturity: weakest link determines overall level — one Level 1 component drags the whole chain down
- Software development paradox: knowledge lost across paradigm shifts (PL/1→Java→Web→AI) — OOSH fights this by encoding patterns in names
- Web 4.0 = consequent application of CMM4 methods to achieve a CMM4 worldwide web
- Why never 5.0: Level 4 means self-sustaining adaptation — no further paradigm shift needed
- "Wer schreibt, der bleibt" = CMM3 in 5 words — writing is persistence, context files are agent survival
- "Wer misst, der weiss" = CMM4 — who measures, knows; measurement enables feedback loops
- Metrics already visible in Claude Code TUI: ↑/↓ tokens, wall clock time, think time, tool use count, activity verb, completion time
- Metrics scrapable via `tmux capture-pane` + regex — no API needed
- scrumMaster has PDCA engine but no measurement eyes — needs measure.pane/team/store/read/report/alert methods
- Measurement persistence pattern: `~/config/metrics/<agent>.<timestamp>.env` with bash variables (same pattern as PDCA counters)
- Composed measurement maturity: capture(L3) → parse(L0) → store(L2) → accumulate(L0) → report(L0) → alert(L0) = overall L0
- Task.26: Fix claudeCode status bug (launches TUI instead of method dispatch)
- Task.27: ScrumMaster Measurement Capabilities (CMM4 foundation)
- cursorOrchestrator team already completed Task.25 (naming audit) and started Task.22 (context schema) — wheel is turning
- Bug: `claudeCode status` launches full Claude Code TUI with "status" as prompt — ordered fix via Task.26
- Subscription usage API: `GET https://api.anthropic.com/api/oauth/usage` — returns `five_hour.utilization` (%) and `seven_day.utilization` (%) with `resets_at` timestamps
- API auth: `security find-generic-password -s "Claude Code-credentials" -w` → JSON with `claudeAiOauth.accessToken`
- TUI commands: `/usage` (limits + reset timers), `/status` (remaining allocation), `/stats` (usage patterns), `/context` (context + subscription budget), `/cost` (API tokens)
- Specification failure lesson: the entire Task.27 pane-scraping measurement was the wrong approach — the API existed all along, nobody researched before specifying

## How to Regenerate HTML
- Run `./session/woda/rebuild.sh` in pane 2 — it does everything (python3 rebuild + AppleScript Chrome reload)
- **Bug fixed**: AppleScript block now uses heredoc (`<<EOF`) instead of single-quoted `-e` so `$DIR` expands correctly
- **Always verify** after rebuild: query Chrome URL via AppleScript to confirm it's showing the real file path, not a literal `$dir`

## Known Pitfalls
- `rebuild.sh` originally had `$DIR` inside single-quoted `osascript -e '...'` — bash doesn't expand vars in single quotes
- "Browser refreshed" output is from echo, not from Chrome — it prints even if the reload silently failed
- Always verify with: `osascript -e 'tell application "Google Chrome" to get URL of active tab of front window'`

## Recovery Notes
- Working directory: `/Users/Shared/Workspaces/AI/Claude`
- OOSH dev variant: `components/OOSH/dev.claude/`
- OOSH on macOS: `~/oosh/` (symlinked via `components/OOSH/macos`)
- Pane 4 (`oosh.shell`) has a live OOSH shell ready for commands
- Pane 1 (`claude.scribe` / wodaScribe) handles infrastructure — do not send commands there manually
- wodaScribe background monitor: `/tmp/woda_monitor.sh` (logs to `/tmp/woda_monitor.log`)
- `~/oosh/myScript` — generated by `oo new myScript` during Ch17 (happy accident from mycmd typo)
- `~/oosh/mycmd` — OOSH demo/learning script for parameter completions
- Story has 39 chapters + 1 Intermission, split into TOC + 4 chapter files (Parts I–IV)
- Last update: Added Ch39 (WODA Without the W) — lost goal after compaction, 226-line context file with no CURRENT GOAL section. Tested methods live: they work. Scribe at 4%. Added CURRENT GOAL section to context file.
- Working prototype: /tmp/measure_pane.sh — 3 functions (measure_pane, measure_team, measure_store) tested live on both sessions
- Stored metrics at: ~/config/metrics/woda-writer.*.env and woda-scribe.*.env
- Sent train-the-trainer teaching to agent-trainer (cursorOrchestrator:0.2) with prototype details and learnings
- Created AGENT_LIFECYCLE state machine in `~/config/stateMachines/AGENT_LIFECYCLE.states.env` — 8 custom states for agent lifecycle tracking
- Expert COMPLETED Task.37 (all 3 methods: context.read, context.alert, measure.context). Committed 18756ba and pushed. Tester has peerTest session with Alpha and Beta — both healthy. Ch39 written: WODA Without the W.
- `bash -i -c 'hiveMind ...'` gives direct OOSH access from internal Bash — no raw tmux needed
- After recovery: read this file, then await Tron's next teaching prompt
