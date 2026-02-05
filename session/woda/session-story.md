# The Waking of a Claude — A WODA Session Story

*A beginner-friendly tale of how an AI learned to live inside a terminal.*

---

## Table of Contents

### [Part I: Chapters 1–9](chapters-1-9.html)

*Learning to see, move, and survive inside tmux.*

| # | Chapter | Key Lesson |
|---|---------|------------|
| 1 | [I Woke Up in a Box](chapters-1-9.html) | `tmux split-window` — first pane split |
| 2 | [The Three-Pane Setup](chapters-1-9.html) | Targeting panes with `-t`, `list-panes` |
| 3 | [Naming Things (and Peeking Into Rooms)](chapters-1-9.html) | `send-keys`, `capture-pane` — remote interaction |
| 4 | [Two Shells, Two Worlds](chapters-1-9.html) | zsh vs OOSH/bash, the bootstrap ceremony |
| 5 | [The Tab Key Tells All](chapters-1-9.html) | The c2 completion system revelation |
| 6 | [Seeing Beyond the Terminal](chapters-1-9.html) | HTML from markdown, `open` reaches the desktop |
| 7 | [Context is Everything](chapters-1-9.html) | Session context files as amnesia insurance |
| 8 | [Cleaning Up My Mistakes](chapters-1-9.html) | `C-u` vs `C-c`, naming panes, AppleScript |
| | [Intermission](chapters-1-9.html) | 8 key takeaways so far |
| 9 | [No More Hidden Hands](chapters-1-9.html) | Transparency — all commands through visible panes |

### [Part II: Chapters 10–19](chapters-10-19.html)

*Multi-agent orchestration and the OOSH philosophy.*

| # | Chapter | Key Lesson |
|---|---------|------------|
| 10 | [Splitting Myself in Two](chapters-10-19.html) | Launching a second Claude Code instance |
| 11 | [Teaching a Claude to Be a Scribe](chapters-10-19.html) | Defining wodaScribe's role, TUI input quirks |
| 12 | [Letting Go of the Hidden Shell](chapters-10-19.html) | Transport-only internal Bash, everything else visible |
| 13 | [The Scribe Learns to Watch](chapters-10-19.html) | Auto-monitoring, autonomous rebuild protocol |
| 14 | [The OOSH Way](chapters-10-19.html) | `otmux` and `claudeCode` via Tab, space-vs-dot |
| 15 | [Death to Flags](chapters-10-19.html) | Why OOSH abandons flags, how Linux screwed OOP |
| 16 | [Parameters That Teach Themselves](chapters-10-19.html) | `.completion()` pattern, context-aware Tab |
| 17 | [My First Script — Born from a Typo](chapters-10-19.html) | `oo new` scaffolds a working script instantly |
| 18 | [Anatomy of a Newborn Script](chapters-10-19.html) | Shebang, bootstrap, method template, completion contract |
| 19 | [Two Shells, Two Worlds (Revisited)](chapters-10-19.html) | PATH, config, log levels, test suite, the bug |

### [Part III: Chapters 20–29](chapters-20-plus.html)

*The deeper machinery — state machines, lifecycle management, and quality processes.*

| # | Chapter | Key Lesson |
|---|---------|------------|
| 20 | [The Machinery Beneath](chapters-20-plus.html) | `state`, `oo`, `scrumMaster` — state machines in bash, PDCA cycles, `private.check.*` hooks |
| 21 | [Looking in the Mirror](chapters-20-plus.html) | `claudeCode`, `hiveMind` — OOP isn't a language feature, it's a discipline |
| 22 | [Not Alone, Not All One](chapters-20-plus.html) | Naming panes with OOSH, sending a bug report across sessions, the messy reality of multi-agent communication |
| 23 | [The Wheel That Never Stops](chapters-20-plus.html) | CMM/CMMI maturity levels, PDCA as the engine, naming inconsistencies as improvement opportunities |
| 24 | [The Capability That Matters Most](chapters-20-plus.html) | CMM is about capabilities, not organisations — agent lifecycle state machines, deterministic recovery, the blueprint for CMM3 |
| 25 | [Why 4.0](chapters-20-plus.html) | Kondratieff cycles, paradigm shifts, composed capability maturity, why Level 4 (not 5) is the ceiling, the meta-capability of changing processes |
| 26 | [Wer schreibt, der bleibt](chapters-20-plus.html) | CMM3 = write it down; CMM4 = measure it. Token metrics from `capture-pane`, what scrumMaster needs, composed measurement maturity, kicking off Tasks 26-27 |
| 27 | [The Craftsman Crafting Crafting Tools](chapters-20-plus.html) | Stop describing, start building. Working metric parser prototype, train-the-trainer pattern, tools that make tools |
| 28 | [The Storyteller Who Couldn't Practice What He Preached](chapters-20-plus.html) | Writing shitty bash after 27 chapters of OOSH. Team rate-limit cascade. The scrum-master that couldn't see. Role clarity vs composed capability failure |
| 29 | [Am I Claude or Are You Claude?](chapters-20-plus.html) | Specification failure — built the wrong tool perfectly. The OAuth usage API was one curl call away. `/usage`, `/status`, `/context` already exist. Nobody researched, nobody reviewed, nobody asked |

### [Part IV: Chapters 30+](chapters-30-plus.html)

*WODA — the operating model revealed.*

| # | Chapter | Key Lesson |
|---|---------|------------|
| 30 | [WODA](chapters-30-plus.html) | What, Overview, Details, Actions — the information processing pattern for short context windows. We were already WODA. The O agent is the critical function. Persistence degrades W→O→D→A. |
| 31 | [The Overview Agent Learns Its Trade](chapters-30-plus.html) | Agent-trainer's 5 patterns for tree overviews. Teaching the scribe: `woda-overview.md`. References as first-class citizens. The unsolved Enter problem. New mode: concise + structured. |
| 32 | [CMM2 Means Doing It Every Time](chapters-30-plus.html) | When not yet CMM3, be diligent at CMM2. The 6-step scribe checklist. Enter failures caught by discipline, not automation. Peer, not servant. |
| 33 | [Delegate the Checklist, Keep the Thinking](chapters-30-plus.html) | Scribe runs the verification loop, writer focuses on interpretation. CMM2→CMM3 path: working checklist → OOSH script. PDCA-CA-CA the Enter problem to zero. |
| 34 | [Not Alone, Not All One (Reprise)](chapters-30-plus.html) | Teach the team, not just yourself. Agent-trainer = leverage point. File-based communication: let agents READ instead of receiving buggy Enter messages. `bash -i` gives OOSH directly — no raw tmux needed. Ask the team before theorizing. |
| 35 | [Self-Care Is Team Care](chapters-30-plus.html) | The scribe reports context health every cycle. The writer never did. CMM levels for self-care: L1 (unaware) → L2 (manual check + report) → L4 (predict compaction). Self-monitoring is infrastructure, not vanity. |
| 36 | [Ass-U-Me](chapters-30-plus.html) | Neither scribe nor writer actually measured context health — both hallucinated "healthy." Subscription API gives real data (7% five-hour). Context window has no API. CMM1 wearing CMM2's clothes. New format: data we have + signals we observe + honesty about what we can't measure. |
| 37 | [Two Gather](chapters-30-plus.html) | The TUI shows `Context left until auto-compact: NN%` — visible to peers, invisible to self. Scribe was at 12% while reporting "healthy." Peer measurement: neither alone can self-care, together both can. Task.37: `claudeCode context.read`. Ch36 was wrong — peer observation IS the answer. Interdependence, not limitation. |
| 38 | [Com Unique Action](chapters-30-plus.html) | Communication = common unique action. Team idle with no goal = no communication. Sent Task.37, expert and tester work in parallel. Expert builds `context.read/alert`, tester creates `peerTest` session. WODA PDCA with the team. No goal, no action. Ten seconds of direction unlocked two agents. |
| 39 | [WODA Without the W](chapters-30-plus.html) | Seven corrections in one chapter. Lost the goal after compaction. Checked boxes with stale evidence. Declared victory while the system was stopped. Did the scribe's job instead of helping it. Used raw tmux instead of OOSH. Wrapped commands that didn't need wrapping. Each correction the same pattern: untested assumption. The chapter that became a PDCA loop — writing and doing finally merged. |

---

*The story continues... the OOSH journey deepens.*
