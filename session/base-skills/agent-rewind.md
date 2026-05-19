# Base Skill: Agent Rewind (MANDATORY — all PO/SM agents)

## When to Use
- Agent shows "Context limit reached" or "prompt too long"
- Agent shows "/clear to save Nk tokens" with low free space
- Agent stops responding to prompts

## Procedure

### Step 1: Rewind 1 step (free room for save)
1. Send `/rewind` to the agent pane
2. Arrow Up 1 step
3. Enter to select
4. **Option 2 "Restore conversation"** — ALWAYS option 2
5. Wait for rewind to complete

### Step 2: Agent saves files
1. Tell agent: "Update your context and learnings files NOW. Git commit."
2. Wait for commit confirmation
3. Verify with pane capture

### Step 3: Rewind to training checkpoint
1. Send `/rewind` again
2. Arrow Up — look for a message like:
   - "you have been rewound...read your context files"
   - "Read session/agents/<role>/context.md"
   - "Read session/tasks/<role>-boot.md"
   - Any boot/retrain prompt = natural good rewind point
3. If no obvious checkpoint found: go DEEP — 50-100+ steps. A proper rewind is often 50% of the conversation (e.g. 111 out of 220 messages). Shallow rewinds (3-10 steps) barely free any context and waste the rewind.
4. Enter to select
5. **Option 2 "Restore conversation"** — ALWAYS

### Step 4: Retrain
1. Send boot file reference: "Read session/tasks/<role>-boot.md"
2. Verify agent responds with role identity

## FORBIDDEN
- **NEVER send /clear** — destroys all training, unrecoverable
- **NEVER send /compact** — only Tron authorizes
- **NEVER choose option 1** "Restore code and conversation" — reverts committed files
- **NEVER choose option 4** "Summarize from here" — just compresses, doesn't rewind

## If /rewind Doesn't Work
- /rewind is a TUI command — it processes at UI level, NOT conversation level
- It SHOULD work even at "Context limit reached"
- If it truly doesn't respond after 10 seconds: **ASK TRON**
- Last resort: fork from fallback-agents session (preserves training from fork point)

## Step 5: Health Check (MANDATORY after every rewind)
Ask the rewound agent: "Who and where are you? What's up next?"
Agent must report:
1. Identity + pane
2. Team layout
3. Pending work from context.md
4. Context % health
5. Stray files

All 5 correct = rewind success. Any wrong = retrain needed.

## Why This Matters
- /clear = total training destruction = CMM1 panic
- /rewind option 2 = conversation fork with context recovery = CMM4
- The 1-step rewind gives the agent room to save before deeper rewind
- Natural rewind points (boot prompts) preserve the most training
