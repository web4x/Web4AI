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
- **RC-INTERFERENCE (CONFIRMED 2026-07-03): if `/rc active` is in the footer AND the agent is at 0%/1% AND /rewind won't open the picker (composer stuck "esc to interrupt", /rewind lands as staged text) — the Remote Control channel is BLOCKING the composer.** (Same root as the stuck-TEXT composer bug; two symptoms, one fix.) FIX: disconnect RC from the agent's own /rc menu → `otmux send <pane> /rc` (opens menu) → capture options → `otmux send.tui <pane> Up Up` (to "Disconnect this session"; verify `grep "❯"`) → `otmux send.tui <pane> Enter` → footer loses "/rc active", composer unwedges → /rewind works. **RE-ENABLE `/remote-control` in the retrain prompt after** (footer must show /rc active again; verify it sticks). Don't spam keystrokes — disconnect RC first, escalate only if the disconnect itself fails.
- If it truly doesn't respond after 10 seconds (and not RC-interference): **ASK TRON**
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

## Driving It via otmux (CORRECTED 2026-07-03 — measured on ARON, supersedes the old "render bug" theory)

The picker is a LIVE MODAL TUI. **`otmux pane.capture` is your eyes and is READ-ONLY** — it is `tmux capture-pane -p`, it sends NOTHING to the pane and can NEVER close the picker. (An OLD version used `-S` scrollback → returned stale frames = the "composer won't clear / menu won't render" LIE; that is fixed. Don't blame the capture.)

**THE REAL PICKER-KILLER: the SEND verb.** Inside a Claude pane, several otmux send verbs inject an `Escape` before `Enter` (to dismiss slash/@-autocomplete). Inside the picker that `Escape` = "Esc to cancel" → **it CLOSES the picker.** This masqueraded as "select-Enter won't render the restore menu" for an entire session — it was NEVER a render bug; every select-Enter was an Escape-cancel.

| otmux verb (Claude pane) | what it ACTUALLY sends | use for |
|--------------------------|------------------------|---------|
| `send.raw <pane> Up` / `Down` | bare arrow, no Escape | ✓ NAVIGATE the picker |
| `send.raw <pane> "/rewind" Enter` | text → Escape (dismiss AC) → Enter | ✓ OPEN the picker (Escape harmless — picker not open yet) |
| `send.raw <pane> Enter` (bare) | **Escape + Enter** | ✗ NEVER inside the picker — Escape cancels it |
| `send` / `send.verified <pane> "/rewind"` | Escape+Enter poke loop ×3 | ✗ NEVER to open a TUI command — pokes 2-3 Escape-close the picker |
| **`send.tui <pane> Enter`** | **bare Enter, NO Escape** | ✓ SELECT inside the picker (checkpoint AND option) |
| `pane.capture <pane> N` | `tmux capture-pane -p` (read-only) | ✓ your eyes — closes nothing |

Sequence:
1. **Open:** `otmux send.raw <pane> "/rewind" Enter` → `otmux pane.capture <pane> 24` (the checkpoint list appears; use the `↑N / ↓N` counter as a precise depth gauge).
2. **Navigate DEEP:** `otmux send.raw <pane> Up` (batches of 20-40 land exactly) → capture → repeat until the highlight sits on the target checkpoint. Picker restores to the point BEFORE the highlighted message.
3. **Select checkpoint:** **`otmux send.tui <pane> Enter`** (bare — NOT `send.raw`) → capture (the Restore-options menu appears; it does NOT close).
4. **Option 2 "Restore conversation":** `otmux send.raw <pane> Down` to highlight → capture (confirm it's on option 2, never 1/4) → **`otmux send.tui <pane> Enter`**.
5. **Verify:** `otmux pane.capture <pane> 25` (conversation truncated to the checkpoint = success).

**Iron rule:** navigate with `send.raw` arrows; SELECT with `send.tui Enter`. NEVER `send.raw Enter` / `send` / `send.verified` inside the picker — they Escape-cancel it. **Modal-coordination fact:** while the picker is open on the agent's pane, that agent is BLOCKED at its UI and cannot guide in real-time — a PEER or TRON drives + guides from outside; you cannot message the agent's pane without disrupting the picker.

## Why This Matters
- /clear = total training destruction = CMM1 panic
- /rewind option 2 = conversation fork with context recovery = CMM4
- The 1-step rewind gives the agent room to save before deeper rewind
- Natural rewind points (boot prompts) preserve the most training
