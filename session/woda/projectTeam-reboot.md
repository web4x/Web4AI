# projectTeam Reboot

*The story of rebuilding an 11-agent team from scratch.*

## Table of Contents

| Ch | Title | Words | Date |
|----|-------|-------|------|
| 1 | [Eleven Empty Chairs](#chapter-1-eleven-empty-chairs) | 1,580 | 2026-02-11 |

**Total**: 1 chapter, 1,580 words

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
