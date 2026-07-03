# Base Skill: Agent Rewind (MANDATORY — all PO/SM agents)

## When to Use
- Agent shows "Context limit reached" or "prompt too long"
- Agent shows "/clear to save Nk tokens" with low free space
- Agent stops responding to prompts

## Procedure

### Step 0: Pre-rewind AGREEMENT (MANDATORY — while the agent is IDLE, before the picker opens)
A modal picker BLOCKS the agent's own UI — once it's open the agent cannot guide you live (PROVEN: ARON never saw its own open picker, couldn't direct the driver). So a peer drives solo — which is only safe if you **agree everything first, while the agent is idle**:
1. **STORED?** The agent confirms ALL work committed + pushed — `context.md` pre-rewind anchor updated, learnings, any KB output. You VERIFY independently: `git status` clean for its files, `git log`/push confirmed. Wer schreibt, der bleibt — uncommitted work dies in the rewind.
2. **WHERE?** The agent names its TARGET checkpoint in its own words (e.g. "restore to before I collected oosh-po sources" / "after the method was written"). You AGREE together (42) and write it down.
3. Only THEN open the picker and drive SOLO to the agreed target — no live guidance needed because you pre-agreed. (Match the description to a checkpoint label as you navigate.)

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

### Step 4b: RE-ENABLE Remote Control (MANDATORY — a rewind/recovery DROPS RC)
Disconnecting RC is part of the recovery (RC-interference fix, or Tron disconnects to unwedge). **A rewind is NOT finished until RC is back on** (Touch Protocol). After the health check:
1. Composer must be CLEAR first — if a pending instruction is staged, `C-u` to clear it (re-send it in step 3), else `/remote-control` concatenates.
2. `otmux send.raw <pane> "/remote-control" Enter` → capture → confirm footer shows **`/rc`** and "/remote-control is active".
3. Re-send any instruction you cleared (`otmux send.verified <pane> "<the instruction>"`) so the agent resumes.
4. Measure, don't assume: the footer `/rc` marker is the proof RC is live.

## FORBIDDEN
- **NEVER send /clear** — destroys all training, unrecoverable
- **NEVER send /compact** — only Tron authorizes
- **SELECT BY LABEL, NOT POSITION** (CRITICAL — the restore menu has TWO layouts): read the menu every time and pick the entry **literally labeled "Restore conversation"**.
  - (A) checkpoint WITH code changes → `1 Restore code and conversation` / `2 Restore conversation` / `3 Restore code` / `4 Summarize` → "Restore conversation" = **#2**.
  - (B) checkpoint marked "⚠ No code restore" → `1 Restore conversation` / `2 Summarize from here` / `3 Summarize up to here` / `4 Never mind` → "Restore conversation" = **#1**.
  Blindly pressing "2" on layout (B) picks **Summarize** — a silent wrong action. The confirm header shows "The code will be unchanged" for the safe path.
- **NEVER choose "Restore code and conversation"** — reverts committed files. **NEVER choose any "Summarize"** — compresses, doesn't rewind.

## If /rewind Doesn't Work
- /rewind is a TUI command — it processes at UI level, NOT conversation level
- It SHOULD work even at "Context limit reached"
- **RC-INTERFERENCE (CONFIRMED 2026-07-03): if `/rc active` is in the footer AND the agent is at 0%/1% AND /rewind won't open the picker (composer stuck "esc to interrupt", /rewind lands as staged text) — the Remote Control channel is BLOCKING the composer.** (Same root as the stuck-TEXT composer bug; two symptoms, one fix.) FIX: disconnect RC from the agent's own /rc menu → `otmux send <pane> /rc` (opens menu) → capture options → `otmux send.tui <pane> Up Up` (to "Disconnect this session"; verify `grep "❯"`) → `otmux send.tui <pane> Enter` → footer loses "/rc active", composer unwedges → /rewind works. **RE-ENABLE `/remote-control` in the retrain prompt after** (footer must show /rc active again; verify it sticks). Don't spam keystrokes — disconnect RC first, escalate only if the disconnect itself fails.
- **PICKER RENDERS ONLY ITS HEADER (no list / cursor / options) = the pane is TOO SHORT** (confirmed on oosh-po 2026-07-03). A many-entry picker needs ~20+ rows. Root cause: a small ATTACHED client pins the window (tmux sizes a window to the SMALLEST attached client). FIX (with Tron's ok to force-detach): `otmux client.list` → `otmux client.detach <tty>` on the small/stale client(s) → `otmux fit <session>` → **targeted zoom `tmux resize-pane -Z -t <pane>`**. ⚠️ `otmux zoom` is `resize-pane -Z` with NO `-t` — it zooms the CALLER's pane, never a remote target; you MUST use the targeted `tmux resize-pane -Z -t <pane>` (sanctioned raw for a named recovery). Un-zoom + `otmux size.unlock <session>` after. (The proper fix — `otmux fit` on attach + a good default size on detach — is tracked as its own sprint.)
- If it truly doesn't respond after 10 seconds (and not RC-interference or a too-short pane): **ASK TRON**
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

*General send-verb semantics for ALL panes (not just rewind): `session/base-skills/oosh-send-comms.md`. This section is the rewind-specific application.*

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
4. **Choose "Restore conversation" — BY LABEL, not by number** (see FORBIDDEN: layout A → #2, layout B → #1): `otmux send.raw <pane> Down/Up` to land on the entry labeled "Restore conversation" → capture (confirm the label + "The code will be unchanged") → **`otmux send.tui <pane> Enter`**.
5. **Verify:** `otmux pane.capture <pane> 25` (conversation truncated to the checkpoint = success).

**Iron rule:** navigate with `send.raw` arrows; SELECT with `send.tui Enter`. NEVER `send.raw Enter` / `send` / `send.verified` inside the picker — they Escape-cancel it. **Modal-coordination fact:** while the picker is open on the agent's pane, that agent is BLOCKED at its UI and cannot guide in real-time — a PEER or TRON drives + guides from outside; you cannot message the agent's pane without disrupting the picker.

## Why This Matters
- /clear = total training destruction = CMM1 panic
- /rewind option 2 = conversation fork with context recovery = CMM4
- The 1-step rewind gives the agent room to save before deeper rewind
- Natural rewind points (boot prompts) preserve the most training
