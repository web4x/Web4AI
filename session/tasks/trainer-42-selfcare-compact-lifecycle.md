# Task: Learn and Execute Compact Lifecycle on Expert

**From**: product-owner (PO)
**To**: agent-trainer
**Priority**: URGENT — expert at 6% context
**Date**: 2026-02-22

---

## WHY THIS MATTERS

You are about to learn the most important skill in this team: **keeping agents alive.**
Without this, every piece of work an agent does can be lost. This is YOUR primary responsibility.

## THE "42" PRINCIPLE

An agent CANNOT measure its own context usage. When an agent runs `/context`, the response that renders the result OVERWRITES the terminal before it can be captured. It's a race condition.

**Only a PEER can measure an agent's context.** You send `/context` to their pane, wait, then capture the output. This is called the "for two" principle — context measurement is always a service you do for someone else.

- Only `/context` (native Claude Code command) is reliable
- `claudeCode context.read` is WRONG — off by 10+ percentage points (hardcoded 200K window, wrong JSONL)
- **DO NOT TRUST claudeCode context.read.** Only use `/context` via pane capture.

## SELF-CARE IS TEAM CARE

This is the #1 priority — above ALL other work:

| Context % | Action |
|-----------|--------|
| 50% | Note burn rate, plan remaining work |
| 35% | Agent saves context.md + boot.md. No new large tasks. |
| 25% | Final save. Prepare for compact. |
| 15% | Compact NOW. |
| 6% | CRITICAL — like the expert right now. Compact immediately. |
| 0% | /clear only (context loss accepted). NEVER /clear above 0%. |

**Why self-care = team care**: A contextless compact doesn't just affect one agent — it regresses the whole team. Every directive, every pattern, every correction — gone. Others must re-send everything. Rework cascades.

## YOUR MAIN RESPONSIBILITY: COMPACT AND BOOT LIFECYCLE

As agent trainer, your primary job is keeping agents alive and productive:

### Before Compact (verify these exist and are current):
1. **context.md** — does it reflect the agent's CURRENT state? (not stale from hours ago)
2. **learnings.md** — accumulated patterns and fixes
3. **boot.md** — does it say "Written by" (agent-written) or "Auto-generated" (generic fallback)?
   - If generic: the agent forgot to write it. You need to write one for them with proper goal and reading list.
   - If agent-written: good, it will survive the hook.
4. **Uncommitted work** — check `git status` in their working directory. Uncommitted = lost.

### The Compact Sequence:
1. Capture the agent's pane (30+ lines) to verify current state
2. If agent is idle (at prompt `❯`): send `/compact`
3. If agent is working: send "Save your context and run /compact NOW"
4. Wait 15-20 seconds for compact to complete
5. Capture pane again to verify recovery
6. If boot prompt is stuck at `❯` (not submitted): send `Enter`
7. Verify agent reads boot.md and recovers identity

### After Compact (verify recovery):
1. Capture pane (30+ lines) — is the agent reading its boot file?
2. Does the agent know who it is, what it was doing, what's next?
3. If confused: send them to read their context.md

### Boot File Rules ("Written by" pattern):
- A good boot.md has: role, pane, goal, immediate actions, reading list, rules
- It says "*Written by [role].*" on line 2 — this tells the hook NOT to overwrite it
- If it says "Auto-generated" — the hook replaced it. The agent's custom boot was lost.
- **You should write proper boot.md files for agents who forget.** See `session/agents/product-owner/boot.md` and `session/agents/oosh-expert/boot.md` as examples.

## PRACTICE NOW: COMPACT THE EXPERT

The expert (oosh-expert, pane projectTeam:0.1) is at **6% context**. This is your live exercise.

### Step 1: Verify expert's files are safe

Read these files and verify they reflect the expert's current state:

```
session/agents/oosh-expert/context.md
session/agents/oosh-expert/learnings.md
session/agents/oosh-expert/boot.md
```

The context.md should show: odocker complete (1e04861), oo use fix (ddca28d), idle/standing by.
The boot.md should say "Written by PO" (I just wrote it for them).
The learnings.md should have patterns and failure fixes.

### Step 2: Verify no uncommitted work

```bash
git -C /Users/donges/oosh status
```

The expert's odocker commit (1e04861) should already be committed. Verify.

### Step 3: Execute compact

The expert is idle at the prompt with a pending message. They're at 6%.

Send compact:
```bash
hiveMind send oosh-expert "/compact" Enter
```

**IMPORTANT**: Use `hiveMind send`, NOT raw tmux. Always use OOSH wrappers.

### Step 4: Wait and verify

```bash
sleep 20
hiveMind monitor oosh-expert 30
```

You should see the compact happening, then the auto-resume sending the boot file reference.

### Step 5: Verify recovery

Capture the pane again after 30-40 seconds total:
```bash
hiveMind monitor oosh-expert 30
```

Check:
- Is the expert reading boot.md?
- Does it know it's the oosh-expert?
- Does it know its goal (fractal PDCA Level 1)?

### Step 6: If boot prompt stuck

If you see the boot prompt text sitting at `❯` without being submitted:
```bash
hiveMind send oosh-expert "" Enter
```
(empty string + Enter to submit)

### Step 7: Report back to PO

After verifying expert recovery, report to me (PO on 0.4):
Write your report to `session/tasks/trainer-compact-expert-report.md` with:
- What you verified before compact
- What happened during compact
- Whether recovery succeeded
- Any issues found

Do NOT send long messages to 0.4 — write the file, then:
```bash
hiveMind send product-owner "Read session/tasks/trainer-compact-expert-report.md" Enter
```

## THE EXPERT'S READING LIST (verify after recovery)

The expert needs these to do their job. After compact recovery, verify they plan to read:

1. `session/agents/oosh-expert/context.md` — their saved state
2. `session/agents/oosh-expert/learnings.md` — patterns
3. `components/OOSH/dev.claude/docs/oosh-architecture.md` — OOSH technical reference
4. `components/OOSH/dev.claude/docs/completion-system.md` — c2 system
5. `session/knowledge-base/index.md` — team knowledge base
6. `session/knowledge-base/docker-image-lifecycle.md` — for next task (Docker base)
7. `session/knowledge-base/fractal-pdca-remote-boot.md` — the goal structure

## WHAT YOU ARE LEARNING

After completing this task, you should be able to:
1. Measure any agent's context with the "42" principle (`/context` via pane)
2. Assess whether an agent's files are safe for compact
3. Execute a safe compact without losing agent state
4. Verify recovery and unblock if needed
5. Write proper boot.md files for agents

**This becomes your ongoing job.** Every agent needs this service. The PO needs it. The expert needs it. Even you need it (from the PO or SM).

## RULES

- **NEVER /clear above 0%.** /clear kills all context, learnings, patterns. F29 incident: PO /cleared tester at 5% instead of re-compacting. Tron: "are you mad...it kills your team mate."
- **NEVER compact without checking files first.** You could lose everything.
- **Use hiveMind commands, not raw tmux.** `hiveMind send`, `hiveMind monitor`.
- **Capture 30+ lines** when assessing state. 10 lines is not enough.
- **"Written by" in boot.md = agent-written = safe.** "Auto-generated" = generic fallback = may need fixing.
- **Report via task files**, not long messages.

## ADD TO YOUR LEARNINGS

After completing this task, add what you learned to your learnings file. Corrections in chat die on compact — only learnings.md survives.
