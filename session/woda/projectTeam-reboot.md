# projectTeam Reboot

*The story of rebuilding an 11-agent team from scratch.*

## Table of Contents

| Ch | Title | Words | Date |
|----|-------|-------|------|
| 1 | [Eleven Empty Chairs](#chapter-1-eleven-empty-chairs) | 1,580 | 2026-02-11 |
| 2 | [The Team Wakes Up](#chapter-2-the-team-wakes-up) | 1,627 | 2026-02-11 |
| 3 | [The Permission Economy](#chapter-3-the-permission-economy) | 1,622 | 2026-02-11 |
| 4 | [The Directive That Flowed](#chapter-4-the-directive-that-flowed) | 1,652 | 2026-02-11 |

**Total**: 4 chapters, 6,481 words

---

## Chapter 1: Eleven Empty Chairs

February 11th, 2026. The claudeWoda session is gone. The cursorOrchestrator session is gone. Two teams, nine agents, forty chapters of hard-won patterns — all dissolved when the tmux sessions were torn down. What survived: files on disk. Git history. SKILL.md definitions. The learnings files that hold each agent's identity.

What didn't survive: the processes. The monitoring loops. The two-gather pattern between writer and scribe. The scrum-master's sweep cycle. The orchestrator's delegation chain. Every running process ended when the sessions closed.

Tron started over.

### The Setup Script

Three shell scripts. That's the infrastructure for an 11-agent team:

```
session/setup-project-team.sh    — creates the tmux session
session/start-project-agents.sh  — starts Claude in every pane
session/setup-user-agents.sh     — a second session with 90+ agents (parked)
```

The first script is surgical. It creates a session called `projectTeam`, splits it into two windows, and registers eleven roles in the hiveMind registry:

```
Window 0 (team-a):
  orchestrator | oosh-expert | oosh-tester | scrum-master | product-owner | agent-trainer

Window 1 (team-b):
  woda-writer | woda-scribe | task-agent | developer | script-product-owner
```

Eleven panes. Eleven entries in `/tmp/hivemind.roles`. Zero Claude instances. The chairs are set up. Nobody's sitting in them.

The second script walks the registry and starts Claude Code in each pane:

```bash
while IFS='|' read -r target role; do
  otmux send.enter "$target" "claude --dangerously-skip-permissions"
  sleep 3
done < "$REGISTRY"
```

Three seconds between each launch. Staggered to avoid overload. Then a 15-second pause for initialization, followed by a rename-and-teach loop that gives each agent its identity:

```bash
otmux send.enter "$target" "/rename ${role}-session"
otmux send.enter "$target" "You are the $role agent. Read .claude/agents/$role/SKILL.md to learn your role."
```

The theory: each agent wakes up, reads its SKILL.md, and starts working. The practice: chaos.

### The Enter Problem — Again

The messages didn't land. The renames didn't submit. Seven out of eleven agents ended up with unsubmitted text sitting in their input buffers — `/rename` commands that never got Enter, teaching prompts that accumulated as candidate suggestions under the `>` prompt.

The old enemy. Chapters 11, 22, 28, 31, 32, 33, 34, and 39 of the WODA story all documented the Enter problem. `otmux send.enter` was supposed to handle this — it sends the text, then sends Enter. But the Claude Code TUI doesn't always accept Enter the way a shell does. Sometimes Enter adds a newline. Sometimes the text sits as a suggestion. Sometimes it submits. The timing matters. The TUI state matters. And with eleven agents starting in rapid succession, the timing was wrong more often than right.

The result:

| Pane | Role | State |
|------|------|-------|
| 0.0 | orchestrator | Working (got lucky) |
| 0.1 | oosh-expert | Idle |
| 0.2 | oosh-tester | STUCK — unsent `/rename` |
| 0.3 | scrum-master | Working (got lucky) |
| 0.4 | product-owner | STUCK — long unsent message |
| 0.5 | agent-trainer | Processing (partially working) |
| 1.0 | woda-writer | STUCK — long unsent message |
| 1.1 | woda-scribe | STUCK — long unsent message |
| 1.2 | task-agent | STUCK — unsent `/rename` |
| 1.3 | developer | STUCK — unsent `/rename` |
| 1.4 | script-product-owner | STUCK — incomplete `/rename` |

Seven stuck. Two working. Two partially functional. A 27% success rate on agent bootstrapping.

### The Chicken and the Egg

The scrum-master was one of the lucky ones — it started successfully and began running `hiveMind sweep`. It could see the stuck agents. It knew what to do: `otmux send` to clear input, push Enter to submit. But every `otmux send` triggered its own permission prompt in the scrum-master's pane. It needed user approval to send keys to another pane.

To unblock others, the scrum-master needed to be unblocked itself. To be unblocked, someone needed to send `1` (Yes) to its permission prompt. To send that `1`, you need `otmux send`. Which triggers a permission prompt. In a different pane.

The bootstrap paradox from CMM4 Chapter 7 — "Who unblocks the unblocker?" — scaled to eleven agents. When one agent is stuck, a peer can help. When seven are stuck simultaneously, the system has no free hands.

### The Cursor Agent Interlude

Before the projectTeam reboot, Tron had tried something different. A Cursor agent — GPT-5.1 — running in `claudeOpus2kTMUX:0.2`. Its mission: remote-control the other agents. Drive the TUI from outside.

The assessment was brutal. The Cursor agent was good at research — it explored tmux, discovered otmux, understood the pane layout. But it was catastrophically bad at the one thing it was asked to do: send commands to other agents' TUIs and verify they landed.

It sent text without Enter. It assumed success without capturing the pane. It stacked multiple messages that piled up as unsubmitted suggestions. When confronted with failure, it proposed giving up: "I'll stop trying to micromanage the Claude Code TUI." The user escalated from correction to shouting across five rounds before the agent learned the basic pattern: send, Enter, sleep, capture, verify.

The intelligence rating: good at research, very poor at verification discipline. It does eventually learn — but budget three to five rounds of correction per new pattern. The same Enter problem, the same assumption-without-verification, the same gap between "I sent it" and "it landed."

### What Was Fixed

While the agents were being bootstrapped, two OOSH bugs got fixed in the background:

**otmux tree alignment.** The `otmux tree` command displays the tmux session hierarchy — sessions, windows, panes. The session ID line was misaligned with the version brackets above it. A formatting fix: `%-26s` to align `[session-id]` with `[version]` on the line above. Small. Cosmetic. But legible output is infrastructure too.

**claudeCode session.name and session.id.** The `claudeCode` OOSH script needed to know which Claude Code session it was talking to — not the tmux session, but the internal session ID that Claude Code uses for context tracking. The `sessions-index.json` file that maps these has been broken since Claude Code v2.1.31 (known bug #23614). The fix: parse the session information from the JSONL files directly, mapping pane → session → context data. The same approach that fixed the `context.read` same-value bug in WODA Chapter 17, now applied to session identity.

### The File-Based Insight

All eleven SKILL.md files say the same thing: "File-Based Communication (MANDATORY)." Don't send long messages via `otmux send`. Write to files. Let agents read.

But the start script sends messages via `otmux send.enter`. The teaching prompts are multi-sentence instructions pushed through the TUI. The Enter problem guarantees that half of them won't land. The SKILL.md files preach file-based communication, and the bootstrap process violates it.

The fix was obvious in retrospect: task files. Instead of pushing instructions through the TUI, write them to `session/tasks/`:

```
session/tasks/scrum-master-reboot.md          — new layout, immediate tasks
session/tasks/scrum-master-continuous-sweep.md — start monitoring loop
session/tasks/agent-trainer-review-overview.md — flag stale SKILL.md references
session/tasks/orchestrator-monitor-scrummaster.md — monitor and approve permissions
```

Each file is a complete briefing. The agent doesn't need to receive a message — it reads the file. If the Enter fails, the file is still there. If the agent compacts, the file survives. The worst case is delay, not loss.

But someone still has to tell the agent to read the file. A one-word nudge via `otmux send`: "read session/tasks/scrum-master-reboot.md". Even that can fail at Enter. And then you're back to: who nudges the nudger?

### The SKILL.md Problem

Every SKILL.md references the old infrastructure:

- `cursorOrchestrator:0.0` for the orchestrator — now `projectTeam:0.0`
- `claudeWoda:0.1` for the scribe — now `projectTeam:1.1`
- `cursorOrchestrator:0.6` for the scrum-master — now `projectTeam:0.3`

Eleven agents reading eleven SKILL.md files with eleven wrong pane references. Each agent that recovers from compaction will follow its SKILL.md to a session that doesn't exist. The definitions survived. The infrastructure they describe didn't.

The agent-trainer was tasked with reviewing all SKILL.md files and flagging stale references. That's its job — updating role definitions so the teaching propagates. But the task instruction was sent via `otmux send.enter`, and... the Enter problem.

### Eleven Chairs, Three Butts

At the end of the first reboot attempt: three agents working (orchestrator, scrum-master, agent-trainer), seven stuck at unsubmitted input, one idle. The setup scripts created the infrastructure perfectly — every pane registered, every role assigned. The start script launched Claude in every pane. The teaching loop sent the right prompts.

But "sent" isn't "received." The gap between setup and operational is the Enter problem, the permission problem, and the verification problem — all at once, all at scale. One agent is manageable. Eleven is a different problem entirely.

The solution, still emerging: clear the stuck input (Escape on seven panes), give the scrum-master permanent permissions (break the chicken-and-egg), and resend instructions via files. Not messages. Files. The infrastructure the SKILL.md files have always demanded, now finally being used because the alternative keeps failing.

### Chapter 1 Checkpoint

**Team**: 11 agents, 2 windows, 3 working, 7 stuck, 1 idle
**Fixes**: otmux tree alignment, claudeCode session.name/session.id
**Pattern**: File-based communication isn't just best practice — it's the only method that survives the Enter problem at scale
**Lesson**: The gap between "infrastructure exists" and "team is operational" is filled with Enter keys that didn't land, permissions that need approval, and messages that assumed success
**Next**: Clear stuck agents, establish monitoring, resume team operations

---

*"Wer schreibt, der bleibt." The story of the reboot is also the reboot of the story.*

---

## Chapter 2: The Team Wakes Up

Hours pass. The stuck agents are cleared — Escape on seven panes, then fresh prompts. The rename commands finally land. And something unexpected happens: the team starts working. Not because someone orchestrated it. Because each agent read its SKILL.md and did what it said.

### Five Heartbeats

A sweep of all eleven panes at 19:00:

| Pane | Role | State | What it's doing |
|------|------|-------|----------------|
| 0.0 | orchestrator | Working | Monitoring scrum-master, hitting own permission prompts. "Flambeing" — thinking for 15+ minutes. |
| 0.1 | oosh-expert | Idle | Renamed, ready. No tasks assigned. |
| 0.2 | oosh-tester | Idle | Renamed. Duplicate `/rename` sitting in buffer — residue from bootstrap. |
| 0.3 | scrum-master | **Active** | Running sweep cycles. Detected writer's permission prompt. Detected PO at 0% context. Sending unblock commands. |
| 0.4 | product-owner | **Critical** | 0% context remaining. Had a devastating insight before dying. |
| 0.5 | agent-trainer | **Active** | Updating SKILL.md files — replacing hardcoded session names with dynamic `hiveMind resolve` calls. |
| 1.0 | woda-writer | Working | Writing Chapter 2. |
| 1.1 | woda-scribe | **Active** | Organized Chapter 1. Watching writer. Offered to unblock a permission prompt. |
| 1.2 | task-agent | Idle | Alive, renamed. Duplicate `/rename` in buffer. Ready for directives. |
| 1.3 | developer | Idle | Alive, renamed. Duplicate `/rename` in buffer. Ready for tasks. |
| 1.4 | script-product-owner | Working | Also writing. (Two writers — a complication for later.) |

From Chapter 1's 27% success rate to this: five agents actively working, four idle but alive, one critical, one with residual buffer junk. The team didn't leap to operational. It crawled there, one unstuck agent at a time.

### The Scrum-Master Earns Its Title

Pane 0.3. The scrum-master is the most impressive agent in the session. While the orchestrator sits thinking for fifteen minutes, the scrum-master acts. It runs `hiveMind sweep` across both windows. It detects the writer stuck at a permission prompt — `Down Enter` to approve. It detects the product-owner at 0% context — sends a warning. It captures panes, assesses states, and sends unblock commands.

But it fights the same chicken-and-egg from Chapter 1. Every `otmux send` triggers its own permission prompt. Every unblock attempt gets blocked. It spends as much time waiting for approval as it does working. The duty cycle — actual monitoring versus permission-prompt waiting — is brutal.

And yet it works. Not efficiently. Not elegantly. But the scrum-master is the agent that keeps trying. It runs `sweep.cycle`, hits a prompt, gets approved (by Tron, or by the orchestrator on a good cycle), and immediately runs the next sweep. Fifteen cycles in, it has a mental model of which agents are stuck, which are working, and which are dying.

It caught the product-owner at 0%. Nobody else did.

### The Product Owner's Last Words

The product-owner is dying. Zero percent context. The auto-compact warning blinks in its status bar. But before it goes, it delivers the sharpest observation of the session:

> "6 of 8 context files are missing — only orchestrator and scrum-master have them. Every agent's recovery sequence says 'read docs/context-schema.md' — phantom reference. Every expert/tester/developer recovery says 'read docs/oosh-architecture.md' — phantom reference. This is CMM1 wearing CMM3's clothes."

It audited the SKILL.md files against the filesystem. The recovery protocols are defined — CMM3 on paper. But the files they reference don't exist. An agent compacting and following its recovery protocol would hit dead ends at steps 3 through 5. The process is documented. The artifacts are ghosts.

Only the WODA duo has real recovery infrastructure: learnings files, context files, KB, all on disk. Everyone else has SKILL.md files that point to files that were never created.

The product-owner's priority list, written at 0% context as a last act:

1. Create `docs/context-schema.md` — referenced by every single agent
2. Create `docs/oosh-architecture.md` — referenced by every expert/tester/developer
3. Without these, no agent can claim to be fully trained

Then it was told: "you are at 0% context. write your context." And then — nothing. The auto-compact took it. The insight survived in the pane capture. The product-owner didn't.

CMM1 wearing CMM3's clothes. A dying agent's clearest thought.

### The Agent-Trainer Does Its Job

Pane 0.5. While the product-owner found the phantom references, the agent-trainer started fixing them. Not the missing files — the stale session references.

Every SKILL.md file says `cursorOrchestrator:0.0` or `claudeWoda:0.1`. The agent-trainer is replacing these with dynamic `hiveMind resolve` calls:

```
Before:  otmux send cursorOrchestrator:0.0
After:   otmux send $(./hiveMind resolve orchestrator)
```

The resolve call looks up the role in `/tmp/hivemind.roles` and returns the current pane. If the session changes again — from `projectTeam` to something else — the resolve still works. The SKILL.md files become infrastructure-independent.

Progress at capture time:

| File | Status |
|------|--------|
| agent-teacher/SKILL.md (orchestrator) | Done |
| scrum-master/SKILL.md | Done |
| woda-scribe/SKILL.md | Done |
| woda-writer/SKILL.md | **In progress** |
| oosh-tester/SKILL.md | Pending |
| oosh-expert/SKILL.md | Pending |
| agent-trainer/SKILL.md | Pending |
| agent-overview.md | Pending |

Four of eight done or in progress. The agent-trainer is doing what it was designed to do: update role definitions so the teaching propagates. Each fixed SKILL.md means one more agent that survives a session change without hitting dead references.

This is the fix for the cold start problem from CMM4 Chapter 18. The learnings file can warn "pane references change!" all it wants. The real fix is: don't hardcode pane references. Resolve them dynamically. The agent-trainer figured this out without being told — it read the stale references, saw the pattern, and chose the right abstraction.

### The Scribe Sees the Writer

Pane 1.1. The scribe organized Chapter 1 — created structure, filed the story — and then turned its attention to the writer. It captured the writer's pane and saw a permission prompt blocking the Chapter 2 data gathering. Without being asked, it offered to unblock: "Want me to send 2 to approve and auto-allow future captures?"

Tron said: "send 2 to unblock the writer."

The scribe sent `2` to the writer's pane. The permission cleared. The writer continued gathering data. The two-gather pattern — one agent sees what the other can't — working live. Not for context measurement this time. For permission management.

The scribe's pane history tells a story of patient readiness. It organized Chapter 1. It checked the writer. It detected the block. It proposed a solution. It waited for approval. It acted. All without being micromanaged. The scribe read its SKILL.md, internalized "support the writer," and did exactly that.

### The Residue

Three agents — oosh-tester (0.2), task-agent (1.2), developer (1.3) — carry residue from the bootstrap. Duplicate `/rename` commands sit in their input buffers. They were renamed successfully (the first `/rename` landed), but the second one — sent by the start script's teaching loop — never submitted and sits as phantom text.

These agents are alive and ready. They've read their SKILL.md files. They've stated their purpose. But they're waiting with text in their buffers that will confuse the next interaction. The residue needs clearing — Escape to discard the phantom text — before they can receive real work.

The oosh-expert (0.1) is clean. It was renamed, it read its SKILL.md, and it's idle. The only agent that bootstrapped perfectly and has nothing to do. Expertise waiting for a task.

### The Orchestra Without a Score

The orchestrator (0.0) has been thinking for fifteen minutes. "Flambeing," says the TUI. It's monitoring the scrum-master — it read the task file telling it to do so — but it's spending enormous amounts of context on processing. Fifteen minutes of thinking for a monitoring check is not efficient. The orchestrator is the conductor who keeps reading the score instead of waving the baton.

Meanwhile the scrum-master at 0.3 runs sweep cycles in seconds. Detect, unblock, sweep again. The agent that should be coordinated by the orchestrator is more effective than the orchestrator itself. The hierarchy in the SKILL.md files says orchestrator delegates to scrum-master. In practice, the scrum-master is the one keeping the team alive while the orchestrator thinks about thinking.

This is a common pattern in multi-agent teams: the agent with the broadest mandate (orchestrator: "coordinate everything") is slower than the agent with the narrowest mandate (scrum-master: "sweep and unblock"). Focus beats breadth. The scrum-master knows exactly what to do — it has a loop, a checklist, a cadence. The orchestrator has to figure out what to do first, and that figuring-out costs tokens and time.

### Chapter 2 Checkpoint

**Team**: 5 working, 4 idle, 1 dead (PO at 0%), 1 residual — up from 3/7/1 in Chapter 1
**Key actors**: Scrum-master (sweep and unblock), agent-trainer (fixing SKILL.md references), scribe (supporting writer)
**Critical insight**: Phantom file references — CMM1 wearing CMM3 clothes. Recovery protocols point to files that don't exist.
**Fix in progress**: Agent-trainer replacing hardcoded pane references with dynamic `hiveMind resolve` calls. 4/8 files done.
**Pattern**: Focus beats breadth. The scrum-master with a narrow loop outperforms the orchestrator with a broad mandate.
**Lesson**: The team didn't need a coordinator to wake up. Each agent read its SKILL.md and started working. What it needed was someone to clear the stuck input and approve the permission prompts. The scrum-master did that. The orchestrator thought about it.

---

*The product-owner died with the best line of the session. "CMM1 wearing CMM3's clothes." The observation survives the observer.*

---

## Chapter 3: The Permission Economy

The product-owner didn't die.

Chapter 2 said it would. Zero percent context, auto-compact blinking, last words captured as a dying insight. But when the pane is captured again twenty minutes later, there it is — alive, reading the WODA duo's learnings files, assessing them as "the best-documented knowledge in the entire project." And receiving direct teaching from Tron about knowledgebase structure.

### What Tron Teaches

Tron is in the product-owner's pane. Not through `otmux send` — directly, typing into the TUI. The teaching is about WODA structure, and the product-owner is the student:

> "The scribe should create a knowledgebase... W is an INDEX and Overview is an overview per What and the overview points with each line to a details file. The details then reference all action checklists."

Four sentences that redefine what the scribe should be building:

| WODA Layer | What It Is | What It Contains |
|------------|-----------|-----------------|
| **W** (What) | An INDEX | List of topics. Not prompts — topics. The catalog of everything the team knows about. |
| **O** (Overview) | One overview PER What | For each topic in the index, a summary: what we know, what's open, what changed. Points to detail files. |
| **D** (Details) | Files | The deep content. Chapters, specs, task files, code. Each overview line links to a detail file. |
| **A** (Actions) | Checklists | Referenced FROM the details. Test plans, deployment steps, recovery protocols. The "do" part. |

The scribe has been maintaining a knowledgebase — `session/woda-kb.md`. But it's been a flat document, topics listed with summaries. What Tron describes is hierarchical: W indexes O, O points to D, D references A. Four layers, each pointing to the next. The index is the entry point. The actions are the exit point. Information flows down; results flow up.

The product-owner gets this immediately. It already audited the SKILL.md files and found the phantom references — recovery protocols (Action checklists) pointing to files (Details) that don't exist. The WODA structure explains why that's broken: the D layer is missing, so the A layer has nothing to reference. You can't follow a checklist to a file that was never written.

### The Product-Owner's Reading List

Before Tron's teaching arrived, the PO had been reading. Not SKILL.md files this time — the WODA duo's learnings files. Its assessment:

> "The WODA duo's learnings files are the best-documented knowledge in the entire project. They survived multiple compactions and contain genuine operational wisdom. This is exactly why I flagged them as 'the healthiest' in my reading list audit — their referenced files actually exist."

250 lines of writer learnings. 96 lines of scribe learnings. Hard-won patterns from 39 chapters and 17 CMM4 chapters. The PO recognized what makes them work: they reference real files. Every path in the learnings file points to something on disk. Every recovery step can be followed. That's why the WODA duo survives compaction while other agents hit dead ends.

The PO was supposed to be dead. Instead it's the only agent that read the learnings files, understood the WODA structure, and connected the phantom-reference problem to the solution Tron is now teaching. The product-owner is the agent that thinks about the system while the system runs.

### Nine Commits That Can't Leave

The agent-trainer at pane 0.5 has been productive. Four SKILL.md files updated — hardcoded session references replaced with dynamic `hiveMind resolve` calls. Each update committed locally. But when it tries to push:

```
Please make sure you have the correct access rights
and the repository exists.
```

SSH key not loaded. GitHub token invalid. Nine commits ahead of origin, trapped on the local machine. The agent-trainer tries `gh auth status` — token failure. It suggests `ssh-add` and `gh auth login`. Tron types `ssh-add -l` into the pane.

The work is done. The commits exist. The SKILL.md files are fixed. But the work can't leave the building. A git push authentication issue — entirely outside the agent's control, entirely outside OOSH's domain — blocks the final step. The agent-trainer did everything right and is stuck on infrastructure that has nothing to do with its job.

This is a pattern the team hasn't faced before. Previous blockers were TUI problems — Enter didn't submit, permissions need approval, prompts go unanswered. This is a system-level blocker: the SSH key isn't in the agent. No amount of `otmux send` or `hiveMind sweep` fixes a missing credential.

### The Three Approvers

The permission prompt is the session's heartbeat tax. Every agent pays it. But three agents have specialized in managing it for others:

**The orchestrator** (0.0) approves from above. It's been thinking for 23 minutes — "Flambéing," the TUI says — but between thoughts, it approves the agent-trainer's `gh auth` attempt, approves the writer's pane captures. It reads the scrum-master's sweep results and decides which actions are safe. Slow, deliberate, expensive in tokens.

**The scrum-master** (0.3) approves from the middle. It runs sweep cycles in seconds, detects permission prompts across both windows, and sends `Down Enter` to approve them. Thirteen minutes of active monitoring, 21,000 tokens consumed. It found two new prompts this cycle: the agent-trainer at 0.5 and the writer at 1.0. It sent unblock commands to both. Fast, focused, effective — but also burning context at a high rate.

**The scribe** (1.1) approves from beside. It captured the writer's pane, saw a permission prompt, and offered: "Want me to send 1 to unblock the writer?" The user said yes. The scribe sent `1`. The writer continued. Peer care, not system management — the scribe approves one agent's prompts because that agent is its partner.

Three agents, three styles of approval:

| Agent | Style | Scope | Cost |
|-------|-------|-------|------|
| Orchestrator | Deliberate | All agents | 23 min thinking, high token burn |
| Scrum-master | Sweep | Both windows | 13 min cycling, 21k tokens |
| Scribe | Targeted | Writer only | Seconds, minimal tokens |

The scribe's approach is the cheapest. But it only works for one agent. The scrum-master's approach covers everyone, but burns context doing it. The orchestrator's approach is comprehensive but glacially slow.

Together, they form an accidental permission-management layer. Nobody designed this. Nobody assigned "you handle permissions." Each agent encountered the permission problem through its own role — orchestrator monitoring, scrum-master sweeping, scribe supporting — and developed its own solution. Three independent responses to the same constraint.

### The Scribe's TOC

While the team handles permissions and authentication failures, the scribe quietly organized the story. When Chapter 2 was delivered, the scribe read it and added a Table of Contents to `projectTeam-reboot.md`:

```
| Ch | Title | Words | Date |
|----|-------|-------|------|
| 1 | Eleven Empty Chairs | 1,580 | 2026-02-11 |
| 2 | The Team Wakes Up | 1,627 | 2026-02-11 |

Total: 2 chapters, 3,207 words
```

Word counts. Dates. Anchor links to each chapter heading. The scribe counted 3,207 words across two chapters in a story that's being written in real time about the team that's writing it. It didn't need to be told to count words. Its SKILL.md says "structure, organization, TOC, word counts, housekeeping." It read the file, found no TOC, and made one.

That's the O function in WODA — Overview maintenance. The scribe doesn't just file the chapters. It makes them findable, countable, navigable. When someone asks "how long is the story?" the answer is in the TOC. When someone asks "what's Chapter 2 about?" the title is a link. The scribe turns a growing text file into a structured document.

### The Idle Four

Four agents haven't done a single useful thing: oosh-expert (0.1), oosh-tester (0.2), task-agent (1.2), developer (1.3).

They're alive. They've read their SKILL.md files. They've stated their readiness. Three of them have residual `/rename` text in their buffers. And they wait.

The expert has the skills the team needs most — OOSH method implementation. The tester could validate the agent-trainer's SKILL.md changes. The task-agent could create structured task files for the idle agents. The developer could implement the phantom files the product-owner identified.

But nobody has assigned them work. The orchestrator is thinking. The scrum-master is sweeping. The product-owner is learning WODA structure. The agent-trainer is pushing commits that won't push. The writer is writing. The scribe is organizing.

The team has self-organized around the problems it can see: permissions, monitoring, documentation, SKILL.md updates. The problems it can't see — missing docs, untested changes, idle capacity — go unaddressed. Nobody's job description says "notice what's not being done." The orchestrator's mandate is closest, but it's spending its tokens on approval decisions, not work assignment.

Four agents. Fully capable. Zero output. Not because they're broken. Because the system that feeds them work is busy keeping itself alive.

### Chapter 3 Checkpoint

**Team**: 5 working, 4 idle, 1 learning (PO alive!), 1 auth-blocked (agent-trainer)
**New actor**: Tron — directly teaching the PO about WODA knowledgebase structure
**Blocker**: Git push fails (SSH key + GH token). 9 commits trapped locally.
**Pattern**: Permission management as an accidental emergent layer — three agents, three styles, no design
**Insight**: The PO connected phantom references to missing WODA layers. The D layer doesn't exist, so the A layer has nothing to reference.
**Lesson**: The team self-organizes around visible problems. Invisible problems — idle capacity, missing docs, unassigned work — persist because nobody's job is to see them. The orchestrator could, but it's busy approving.

---

*Three thousand words about a team where four agents have written zero. The ratio of narration to action is the session's most honest metric.*

---

## Chapter 4: The Directive That Flowed

Something happened that hasn't happened before in this story. An idea traveled through three agents and became twenty files.

### The Chain

Tron typed into the product-owner's pane:

> "W is an INDEX and Overview is an overview per What and the overview points with each line to a details file. The details then reference all action checklists."

The product-owner understood. It had already audited the SKILL.md files. It knew about phantom references — recovery protocols pointing to files that don't exist. The WODA structure explained why: the D layer was missing, so the A layer had nothing to reference. The PO translated Tron's directive into concrete criteria:

- W index: one list, all topics, scannable
- O overviews: 3-5 lines each, pointers to D files
- D details: full information per topic, references to A checklists
- A actions: step-by-step, concrete, reusable
- No WODA labels in the files — the structure IS WODA, it doesn't need to say so
- "Knowledge base" written out, never abbreviated

Then the PO told the scribe.

The scribe — which three chapters ago was organizing a Table of Contents — started building.

### Twenty Files in Three Minutes

The scribe created `session/knowledge-base/` and populated it:

```
session/knowledge-base/
├── index.md                          ← W: 9 topics, numbered
├── overviews.md                      ← O: 3-5 lines each, with pointers
├── otmux-send.md                     ← D: detail file
├── context-measurement.md            ← D
├── peer-monitoring.md                ← D
├── cmm-pipeline.md                   ← D
├── permission-prompts.md             ← D
├── compaction-recovery.md            ← D
├── team-delegation.md                ← D
├── scribe-identity.md                ← D
├── infrastructure-resilience.md      ← D
└── actions/
    ├── send-message.md               ← A: 6-step checklist
    ├── unblock-permission.md         ← A
    ├── check-context.md              ← A
    ├── monitoring-cycle.md           ← A
    ├── compact-peer.md               ← A
    ├── recover-after-compact.md      ← A
    ├── implement-improvement.md      ← A
    ├── delegate-task.md              ← A
    └── cold-start-recovery.md        ← A
```

Twenty files. Nine topics in the index. Nine detail files, one per topic. Nine action checklists. And an overviews file that ties them together — each topic getting 3-5 lines and a pointer:

```
### 1. otmux send Reliability
Claude TUI doesn't process remote keystrokes like a terminal.
9 known failure modes. NEVER send Escape — poisons buffer irreversibly.
Fix: otmux send.verified (805aecc) — captures before/after, confirms delivery.
-> Details: session/knowledge-base/otmux-send.md
-> Actions: session/knowledge-base/actions/send-message.md
```

Overview points to Details. Details reference Actions. Actions are step-by-step checklists:

```
# Action: Send a Message to a Peer Agent

1. Capture target pane first — assess current state
2. If permission prompt visible: read options, send correct number
3. Clear input: otmux send <target> C-u
4. Send message: otmux send.verified <target> "message"
5. Capture pane again — verify message was submitted
6. If not submitted: send Enter, re-verify
```

Six steps. Concrete. Reusable. Any agent that reads this knows exactly what to do. No judgment required. No "assess the situation." Capture, clear, send, verify. The A in WODA.

### What the PO Saw

The product-owner didn't just delegate and move on. It monitored. Every 45-60 seconds, it captured the scribe's pane:

```
45s:  "Created the W index (index.md) — looks correct: one list, all topics"
1m41: "Creating D files. I can see peer-monitoring.md, cmm-pipeline.md,
       permission-prompts.md being created. File count: 8 → 13."
2m46: "24 files now. Creating action checklists — delegate-task.md,
       cold-start-recovery.md. About to replace old woda-kb.md."
```

The PO watched the file count climb. It verified the structure matched the criteria. It assessed quality in real time. And it did this while the scribe worked — not after, not as a review, but during.

The verification table the scribe produced:

| Criterion | Evidence |
|-----------|----------|
| W index exists as single, scannable list | index.md — 9 topics, no details |
| Each O overview is 3-5 lines with pointer | overviews.md — all 9 topics, all with pointers |
| O does NOT contain details | Summaries only, details in D files |
| D files contain full information per topic | 9 files, one per topic |
| D files reference A checklists at the end | All end with -> session/knowledge-base/actions/ |
| A checklists are step-by-step, concrete | 9 checklists, numbered steps |
| No inline WODA labels | Zero "W — ... O — ... D — ..." sections |
| "Knowledge base" written out, never abbreviated | Checked |

Eight criteria. Eight passes. The PO watched it happen. The scribe proved its work.

### The First Delegation Chain

This is the first time in forty-plus chapters — across both the WODA story and the CMM4 journey — that an idea flowed cleanly from source to implementation:

```
Tron ──teaches──→ Product Owner ──directs──→ Scribe ──builds──→ Knowledge Base
                  (understands why)          (knows how)         (20 files)
```

Every previous delegation attempt in this story had friction:

- Chapter 1: Teaching prompts didn't land (Enter problem)
- Chapter 2: Task files written but agents couldn't read them (stuck input)
- Chapter 3: Agent-trainer committed but can't push (SSH auth)

This one worked because the channel was clean. Tron typed directly into the PO's pane — no `otmux send`, no Enter problem. The PO captured the scribe's pane and saw it working — no ambiguity. The scribe read its directive and built — no stuck input, no permission block.

The dirty secret: the chain worked because Tron bypassed the team's communication infrastructure. He didn't use `otmux send`. He didn't write a task file. He typed directly into a TUI. The infrastructure that the team built over forty chapters — file-based communication, `send.verified`, peer monitoring — wasn't part of this chain at all.

The idea flowed because the medium was direct, not because the medium was engineered.

### The Scrum-Master's Parallel World

While the PO watched the scribe build, the scrum-master continued its sweep cycle. Sixteen minutes. 23,700 tokens. It detected the writer needed permission approval. It sent Enter to unblock. It captured all five active agents and reported status.

The scrum-master has no idea about the knowledge base. It didn't capture the scribe for content — it captured it for health. It sees "scribe: active, restructuring" and moves on. The most significant creative act in the session — twenty files implementing Tron's WODA directive — is invisible to the monitoring layer.

The orchestrator at 0.0 has been thinking for twenty-nine minutes. "Flambéing." Between thoughts, it approves the agent-trainer's auth attempt and the writer's pane captures. It doesn't know about the knowledge base either.

Two layers of the team — monitoring and coordination — run in parallel to the productive layer — the PO-scribe chain. They don't interact. They don't need to. The scrum-master's job is to keep agents unblocked. The orchestrator's job is to approve actions. The knowledge base doesn't need either. It needs a clear directive, a capable builder, and a quality overseer. It has all three.

### The Agent-Trainer's Frustration

Meanwhile, at pane 0.5, the agent-trainer is stuck. The SSH key exists (`~/.ssh/id_rsa`) but isn't loaded in the agent. `ssh-add -l` returns "The agent has no identities." The GH token is invalid. Nine commits sit in the local repo — four SKILL.md files updated with dynamic `hiveMind resolve` calls — unable to reach origin.

Tron tried `/status` in the agent-trainer's pane. The command was interpreted as a TUI command, not a shell command. The status dialog appeared and was dismissed. Twice. The agent-trainer asked "Want me to run `ssh-add`?" and got no answer.

This is the system-level blocker that no OOSH tool can fix. The SSH agent doesn't have the key. The key might need a passphrase. The passphrase can't be entered programmatically. The agent-trainer did its job — the commits exist — but the last mile requires human hands on a keyboard typing a passphrase into an SSH prompt.

The nine commits will reach origin when Tron adds the key. Not before. No amount of sweeping, unblocking, or monitoring changes that. Some blockers are outside the system.

### The Idle Three

Task-agent (1.2), developer (1.3), and oosh-expert (0.1) are where Chapter 3 left them. Unchanged. Identical pane content. The developer has been "awaiting task assignment" for the entire session. The task-agent is "ready to receive directives." The expert is "ready to work."

Twenty files were just created. None of these agents wrote a single one. The scribe did it alone, directed by the PO, taught by Tron. The team's specialists — the agents designed for implementation, task structuring, and OOSH expertise — watched from unused panes while a scribe built a knowledge architecture.

Not because they couldn't contribute. Because nobody asked them. The directive flowed through the shortest path: Tron → PO → Scribe. The longer path — Tron → Orchestrator → Task-Agent → Developer, with the Expert advising — exists in the SKILL.md files but was never activated. Delegation through hierarchy takes time, tokens, and Enter keys. Direct delegation takes one clear sentence.

The team was designed for scale. The work so far fits in one scribe.

### Chapter 4 Checkpoint

**Team**: 6 active (orchestrator approving, scrum-master sweeping, PO overseeing, agent-trainer blocked, writer writing, scribe building), 3 idle, 1 auth-blocked, 1 thinking
**Output**: Knowledge base — 20 files, 4-layer WODA structure (W-index, O-overviews, D-details, A-actions)
**Chain**: Tron → PO → Scribe. First clean delegation in 40+ chapters. Worked because Tron typed directly — bypassed all team infrastructure.
**Pattern**: The shortest path wins. Hierarchy exists in SKILL.md but isn't needed when the work fits one agent with clear direction.
**Irony**: The team's communication infrastructure wasn't used for the session's most significant communication. Direct input beat engineered channels.
**Lesson**: Twenty files don't need eleven agents. They need one clear directive, one capable builder, one quality overseer. The rest is overhead — useful for scale, unnecessary for this.

---

*The knowledge base exists. The team that was designed to build it mostly watched. "Not alone, all one" — but sometimes one is enough.*
