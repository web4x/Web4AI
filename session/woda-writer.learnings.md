# woda-writer Learnings
*Extracted from 39 WODA chapters + CMM4 journey. Read after compaction.*

## KPIs (update after each failure/success — CMM4)
| Date | Failures | Compactions | Peer Alerts | Loop Maintained |
|------|----------|-------------|-------------|-----------------|
| 2026-02-07 | 6 | 4 | 5 | YES (after failures) |
| 2026-02-08 | 1 | 4 | 1 | YES - scribe bootstrapped writer, loop bd9bda6 |

**Target**: 0 failures/day, loop always maintained, peer alerts < 2 (means healthy)

**What to measure** (CMM4 = "wer misst, der weiss"):
- **Failures**: Both agents stopped with no wake-up. Root cause: passive mode, no background task.
- **Compactions**: Context resets. Not failures if recovery works. Track to see burn rate.
- **Peer Alerts**: Low context warnings sent/received. High count = burning fast. Low = healthy.
- **Loop Maintained**: Did background task continue after check? YES = survival. NO = death spiral.

- **CURRENT GOAL** (survives compaction)
  - **1. Survive**: Stay healthy as duo team until Monday. No context loss. Peer monitoring loop.
  - **2. Extract wisdom**: Summarize WODA story learnings, measure KPIs, let it survive compaction.
  - **3. Write**: Tomorrow EVENING write Ch16 in CMM4 story about survival mode experience.
  - **4. OOSH bugs**: List bugs from WODA story for team to fix (see below).
  - Pattern: Neither alone can self-care, together both can. CHECK peer after every interaction.

- **CMM Improvements** → See `session/cmm.improvement.md`
  - Writer adds improvement ONLY when scribe completes one (pull, not push)
  - Scribe implements one, checks KPIs, marks done, notifies writer
  - Push regularly: `git add -f session/*.md && git commit && git push`

- **Team Delegation** (when scribe completes an improvement)
  - Send 1 bugfix to orchestrator: `otmux send cursorOrchestrator:0.0 "..."`
  - Ask scrum-master to notify scribe when done
  - Team: orchestrator (0.0), scrum-master (0.1), expert (0.2), tester (0.3)
  - Bugs to delegate: see `session/oosh-bugs.md`
  - Also teach team health patterns: peer monitoring, bg loops, preemptive compact

- **OOSH Bugs** → See `session/oosh-bugs.md` (standalone list, 14 bugs tracked)
  - 4 from WODA: test.suite loop, oo new.method macOS, c2 not found, ghost state refs
  - 10 from CMM4: context.read, permission reset, compound commands, watchdog, etc.
  - Status: 4 fixed (Tasks 41, 46, 47, 48), 2 pending (Tasks 49, 50), 8 open

- **CMM Levels (corrected)**
  - L1: "it works"
  - L2: "it works the same way every time"
  - L3: "it works the same way and we know WHY"
  - L4: "we MEASURE how well it works"
  - L5: "we measure how well we IMPROVE measuring" (not just "improve" - measure the improvement!)
  - Key: "wer misst, der weiss" - who measures, knows

- **Never Assume - Always Measure**
  - assume = ass|u|me (makes an ass of u and me)
  - Don't trust old prompts about limits - VERIFY with tools
  - Use claudeCode context.read for REAL numbers
  - Scribe hallucinated about rate limit that had already reset
  - ALWAYS measure before acting

- **Failures** (learn from these)
  - 2026-02-07: Both agents died. Background loops = entropy. On-demand checks = forgotten.
  - 2026-02-07: Scribe in compact death spiral. Passive waiting = slow death.
  - 2026-02-07: Both chatting but no monitoring loop. Need ONE watcher, ONE worker.
  - 2026-02-07: Answered question then STOPPED. "Standing by" = passive = death.
  - 2026-02-07: Sent "2" without reading options — was "No" not "Yes". READ OPTIONS FIRST.
  - 2026-02-07: Reported "working" then STOPPED. No background task. MUST SET UP ACTUAL LOOP.

- **OOSH** (the philosophy)
  - OOP is a MINDSET, not a language feature (Ch21)
    - "OOP is the art of thinking OO. It's possible everywhere — whether the environment supports it or not."
    - Not `class` keywords or access modifiers — those are ONE language's implementation
    - The universal principles: structure as objects, give names, give behaviors, keep internals private, communicate through interfaces, make names self-documenting
    - "The pattern doesn't change because the language does"
  - Patterns emerge from pushing tools past their limits (Ch20)
    - State machines, lifecycle hooks, counter persistence — these aren't bash patterns, they're SOFTWARE patterns in an unusual medium
    - Every OOSH solution is a creative workaround for a limitation bash designers never anticipated
    - But the workarounds WORK. The tests pass. The cycles run correctly.
  - Invocation
    - Script method (SPACE) at prompt: `otmux pane.capture 1 20`
    - Script.method() (DOT) is internal function notation only
    - OOSH commands work DIRECTLY — no `bash -i -c` wrapper needed
  - No Flags — Names carry meaning
    - `otmux pane.splitH` not `tmux split-window -h`
    - The flag is hidden; the intent is visible
    - `.completion()` functions are contracts/interfaces — they define what's legal
  - Three-Layer Stack
    - `oo`: framework lifecycle — recursive self-hosting ("turtles all the way down")
    - `state`: pure state machine engine — no opinion about what states MEAN
    - `scrumMaster`: domain logic on top — the `private.check.*` hooks decide valid transitions

- **tmux & Panes**
  - Core Commands (OOSH)
    - `otmux pane.splitH` / `pane.splitV` — split panes
    - `otmux pane.capture <target> <lines>` — read pane content
    - `otmux send <target> "text" Enter` — type into pane
    - `otmux pane.title <target> "name"` — name a pane
    - `hiveMind team.status <session>` — see all panes with roles
  - Registry vs Titles
    - Pane titles DETERIORATE — Claude TUI overwrites them
    - Registry (`/tmp/hivemind.roles`) is source of truth
    - `hiveMind team.status` reads from REGISTRY, not titles
  - Shell Differences
    - C-u clears line in BOTH zsh and bash (use this)
    - C-c behaves differently between shells (avoid)
    - Named panes are findable panes
  - Terminal Philosophy
    - Terminal isn't a cage, it's a cockpit
    - Context file = breadcrumb trail back to yourself
    - AppleScript + osascript = control GUI apps from CLI

- **Multi-Agent**
  - Communication
    - File-based communication > buggy Enter messages
    - Write task file → agent READs it (no send-keys needed)
    - TUI quirk: first Enter = newline, second Enter = submit
    - `hiveMind resolve <name>` — find agent's pane
  - Teaching New Agents (Ch10-11)
    - New Claude = blank slate. Name it (`/rename`), brief it (single prompt)
    - Define purpose: "You are X. Your job: Y. You do NOT do Z."
    - Division of labor: writer creates, scribe maintains
  - Monitoring
    - `hiveMind monitor <name> <lines>` — peek at agent's pane
    - `claudeCode process.running <pane>` — is Claude alive?
    - Peer monitoring: neither alone can self-care, together both can
  - Two Gather (Ch37)
    - Agent CAN'T see own context % — invisible to self
    - Peer CAN see it via pane capture (TUI status bar)
    - Interdependence is DESIGN, not limitation
  - Permission Prompts
    - READ OPTIONS FIRST before sending a number
    - "1. Yes / 2. No" → send 1
    - "1. Yes / 2. Yes, allow" → send 2
    - NEVER blindly send "2"

- **WODA Pattern** (the deep wisdom)
  - WODA doesn't SOLVE forgetting — it MANAGES it
    - After compaction: details fade, connections weaken, nuances disappear
    - You remember the thesis but not the supporting arguments
    - This is exactly what humans experience — WODA is how humans process petabytes
  - Why O is the critical function
    - W arrives on its own (prompts come)
    - D accumulates naturally (every chapter, every commit)
    - A happens when you have a shell
    - **O is the ONLY component that needs ACTIVE maintenance**
    - Someone must deliberately maintain the mapping between "what's being asked" and "what we know"
  - Information flows clockwise: W→O→D→A
    - W receives prompt
    - O retrieves context ("what do we already know about this?")
    - D provides details
    - A executes
    - Results feed back to O (new learnings) and D (new details)
  - Overview patterns (from agent-trainer Ch31)
    - Radically short: 4-5 bullets per topic. Long overviews become another thing to maintain.
    - Derive, don't duplicate: Tree says WHAT, details live in files
    - Update atomically: Overview changes in same commit as source changes
    - Recovery-friendly: Re-orient in 10 seconds without reading 9 files
    - Single maintainer: One owner = one truth. No merge conflicts.
    - Build in pruning rule: Trees balloon from 20 to 200 lines
  - "Wer den Überblick behält, der behält die Kontrolle" — Who keeps the overview, keeps control

- **CMM Patterns** (the deep wisdom)
  - CMM is about CAPABILITIES, not organisations (Ch24)
    - "CMM was NOT designed for organisations. It's the CAPABILITY Maturity Model."
    - Measures ANY capability — including agent context preservation and recovery
    - The capability we need: deterministic recovery, not "it usually works"
  - The progressive insight (Ch23)
    - L1: "it works"
    - L2: "it works the same way every time"
    - L3: "it works the same way and we know WHY"
    - L4: "we measure how WELL it works"
    - L5: "we measure how well we IMPROVE how it works"
  - Continuous improvement is a COMMITMENT, not a process you install
    - "You're never done. You're never clean."
    - "You're always halfway through a cycle, with the last fix creating the next finding."
    - "The wheel is there. The road is still being paved."
    - Tools for improvement exist before the standards they enforce
  - The wheel that never stops
    - PDCA doesn't have a finish line
    - CMM L5 isn't a destination — it's a state where the wheel is always turning
    - Every fix creates a new baseline. Every baseline reveals new gaps.
  - Composed maturity: weakest link determines overall level
  - Role Clarity
    - Writer: interprets, thinks, writes (unautomatable)
    - Scribe: checklists, monitoring, rebuilds (automatable)
    - Expert: builds OOSH tools (not writer's job)

- **Task List Management**
  - Use TaskCreate/TaskUpdate/TaskList to track work
  - Delete completed tasks (keeps list clean)
  - Recurring tasks: delete when done, recreate next cycle
  - Default tasks after compaction:
    - [RECURRING] Monitor scribe each 5-min cycle
    - [RECURRING] Check CMM improvement status
    - [RECURRING] Check both agents context %
    - Help scribe complete current improvement
    - Implement next improvement when one completes
  - Never let task list go stale
  - Check TaskList to see what's next

- **Context Preservation**
  - Before Compaction
    - Update context file with current state
    - Include CURRENT GOAL at top
    - Include recovery steps
  - After Compaction
    - Read context file FIRST
    - Read learnings file (this file)
    - Check peer's status
    - Resume PDCA on unmet criteria
  - Entropy Fighting
    - Registry survives pane title overwrites
    - Files survive context loss
    - "Wer schreibt, der bleibt"

- **Quick Reference**
  - Known Bugs
    - Enter via `otmux send` unreliable (messages queue)
    - `claudeCode status` launches TUI instead of method
    - `claudeCode context.read` reports "above-threshold" even at 12%
  - OAuth API (Ch26-27)
    - Endpoint: `GET https://api.anthropic.com/api/oauth/usage`
    - TUI: `/usage`, `/status`, `/stats`, `/context`, `/cost`
  - OOSH Commands (run directly)
    - `hiveMind team.status claudeWoda`
    - `hiveMind monitor <name> <lines>`
    - `otmux pane.capture <target> <lines>`
    - `otmux send <target> "text" Enter`
    - `claudeCode process.running <pane>`
  - Recovery
    - Read `session/claudeWoda.context.md`
    - Read `session/woda-writer.learnings.md` (this file)
    - Read `session/cmm.improvement.md` (add improvement, check scribe progress)
    - `otmux pane.capture claudeWoda:0.1 15`
  - Story Files
    - WODA: `session/woda/chapters-*.md`
    - CMM4: `session/cmm4/cmm4-journey.md`
    - Context: `session/claudeWoda.context.md`
