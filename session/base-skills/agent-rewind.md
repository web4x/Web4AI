# Base Skill: Agent Rewind (MANDATORY — ALL agents; everyone rewinds)

## When to Use

### PRIMARY: PREVENT the cliff — order the rewind PROACTIVELY (TRON 2026-07-03, the main learning)
**The reactive triggers below are FAILURES of prevention, not the intended cue.** Every hard case in this skill — RC-interference, the wedged composer, no-room-to-save, the picker at 0% — happens ONLY because the agent already hit the wall. **Order the rewind at ≤90% used (≥10% free), never wait for the cliff.** At 10% free the composer is clean, there's room to save the anchor, and the rewind is a calm 3-minute operation instead of a rescue.

This is a **CMM4 controlled feedback loop**, and it's HARD (owed as its own sprint — SM/scrumMaster domain):
- **Truth over MULTIPLE sources** — an agent CANNOT read its own context (the 42 principle). Predict/measure it externally: pane footer (`Context low`/`N% remaining`), `claudeCode context.read`, transcript token count, message-count trend. Cross-check ≥2 (one instrument lies).
- **Continuous monitoring** — the SM sweeps every agent every cycle, tracks each one's context %, and *predicts the trajectory* (growth rate → time-to-90%).
- **Controlled loop** — when a projection crosses the threshold, the SM orders the save + rewind *before* 90% used. Proportional: faster-growing agents get ordered earlier. Adjust the model from measured outcomes.
- Goal: **no agent ever reaches "Context limit reached" again.** The cliff is a defect to be designed out, not a state to rescue from.

### REACTIVE (already too late — you're now in rescue mode, expect the hard cases):
- Agent shows "Context limit reached" or "prompt too long"
- Agent shows "/clear to save Nk tokens" with low free space
- Agent stops responding to prompts

## Procedure

### Step 0: Pre-rewind AGREEMENT (MANDATORY — while the agent is IDLE, before the picker opens)
A modal picker BLOCKS the agent's own UI — once it's open the agent cannot guide you live (PROVEN: ARON never saw its own open picker, couldn't direct the driver). So a peer drives solo — which is only safe if you **agree everything first, while the agent is idle**:
1. **STORED?** The agent confirms ALL work committed + pushed — `context.md` pre-rewind anchor updated, learnings, any KB output. You VERIFY independently: `git status` clean for its files, `git log`/push confirmed. Wer schreibt, der bleibt — uncommitted work dies in the rewind.
2. **WHERE?** The agent names its TARGET checkpoint in its own words (e.g. "restore to before I collected oosh-po sources" / "after the method was written"). You AGREE together (42) and write it down.
3. Only THEN open the picker and drive SOLO to the agreed target — no live guidance needed because you pre-agreed. (Match the description to a checkpoint label as you navigate.)

## Writing a GOOD Rewind-Save Context (MANDATORY — write this BEFORE any rewind; TRON via oosh-po 2026-07-03)
Your `context.md` pre-rewind anchor is the SEED a fresh you boots from. If it is stale or vague, the fresh you reconstructs *confidently wrong* — and measuring a stale copy is just `assume=ass-u-me`. Dated **NOW**, the save MUST capture (small, fresh, pointed at LIVE truth — everything else lives in `MEMORY.md` + `memory/`):
1. **Identity** — role@host, pane, uuid — FRESHLY re-derived (never copied from the old save).
2. **CURRENT plan PATH, explicit** — the exact `scrum.pmo/sprints@<host>/sprint-N/planning.md`. This is THE field that goes stale: per-host splits and new sprints happen *while you are rewound*. Write it — and the fresh you still `ls sprints*` to confirm.
3. **Currently driving** + its **dual link** — `[GitHub](url) | [local](path)`, push-first.
4. **Open gates / blockers** — what's next, who is blocked, awaiting-TRON items.
5. **Recent commit hashes (BOTH repos)** — the durable state a fresh you resumes from (uncommitted work dies in the rewind).
6. **Boot-procedure pointer** — "read `otmux pane.history <self>` + `ls scrum.pmo/sprints*` FIRST, before trusting any saved path."

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
- **RC-INTERFERENCE (CONFIRMED 2026-07-03): if `/rc active` is in the footer AND the agent is at 0%/1% AND /rewind won't open the picker (composer stuck "esc to interrupt", /rewind lands as staged text) — the Remote Control channel is BLOCKING the composer.** (Same root as the stuck-TEXT composer bug; two symptoms, one fix.) **YOU (the driving peer/trainer) disconnect RC via otmux — do NOT ask Tron to do it (that makes him the bottleneck).** FIX: open the agent's own /rc menu with **`otmux send.raw <pane> "/rc" Enter`** (NOT `otmux send … /rc` — `send`/`send.verified` inject Escape×3 that cancels the menu, same bug as the picker) → capture the options → navigate to "Disconnect this session" with `otmux send.tui <pane> Up` (bare, no Escape) → capture, verify `❯` is on it → `otmux send.tui <pane> Enter` → footer loses "/rc active", composer unwedges → /rewind works. **RE-ENABLE via Step 4b after** (footer must show `/rc` again). Escalate to Tron ONLY if the disconnect itself fails — never as the first move.
- **PICKER RENDERS ONLY ITS HEADER (no list / cursor / options) = the pane is TOO SHORT** (confirmed on oosh-po 2026-07-03). A many-entry picker needs ~20+ rows. Root cause: a small ATTACHED client pins the window (tmux sizes a window to the SMALLEST attached client). FIX (with Tron's ok to force-detach): `otmux client.list` → `otmux client.detach <tty>` on the small/stale client(s) → `otmux fit <session>` → **targeted zoom `tmux resize-pane -Z -t <pane>`**. ⚠️ `otmux zoom` is `resize-pane -Z` with NO `-t` — it zooms the CALLER's pane, never a remote target; you MUST use the targeted `tmux resize-pane -Z -t <pane>` (sanctioned raw for a named recovery). Un-zoom + `otmux size.unlock <session>` after. (The proper fix — `otmux fit` on attach + a good default size on detach — is tracked as its own sprint.)
- **"Context low (0% remaining)" banner is STALE after a rewind** — it updates only on the agent's NEXT turn, not the instant the rewind frees room (measured on robbin-po: shed ~15 msgs, banner still said 0%; a SHORT test message processed fine → room WAS freed). Don't over-shed chasing a lagging banner; free a chunk, then send a SHORT message — if it processes, room is freed.
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

## Post-Rewind Recovery — the rewound agent, on the OTHER side (MANDATORY; TRON via oosh-po 2026-07-03)
A rewind sheds conversation memory but **the world kept moving** — your saved files (`context.md`, remembered paths) can be STALE. Do NOT replay a stale save. Boot IN ORDER, **measuring the world before trusting any file**:
1. **Verify identity** — `otmux pane.self` → pane + host; kernel `$CLAUDE_CODE_SESSION_ID`; `claudeCode session.name`. Never the pane title, never `$TMUX_PANE` (both lie after a move).
2. **`otmux pane.history <self>`** — your own scrollback holds the recent exchanges the rewind dropped. Read it to see what changed while you were "away" (this alone reveals a sprint move or a new directive).
3. **`ls scrum.pmo/sprints*`** — find the CURRENT `sprints@<host>/sprint-N`. NEVER trust the remembered/context path (a per-host split or a new sprint may have moved it — oosh-po drove a stale `sprints/sprint-2` and went astray).
4. **Read the CURRENT sprint planning** + your `context.md`/`learnings.md`, and **reconcile** them against steps 2–3. Where a saved file disagrees with the measured world, **the measured world wins** — then update the save.
5. **Reconcile → 5-point health check** (above). Only then resume.

**Iron rule: measure the world, don't replay a stale save. A stale path read as current = `assume=ass-u-me`.**

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

**Iron rule:** navigate with `send.raw` arrows; SELECT with `send.tui Enter`. NEVER `send.raw Enter` / `send` / `send.verified` inside the picker — they Escape-cancel it.

**Two gotchas (measured on robbin-req):** (1) **Clear the composer FULLY before `/rewind`** — a long multi-line staged message needs MANY `C-u` (15+, not a few); if it's not empty, `/rewind` appends as TEXT (not submitted) and no picker opens. (2) **VERIFY the picker actually opened (capture) BEFORE navigating** — if it didn't open, your `Up` arrows just SCROLL the pane ("Scroll wheel is sending arrow keys"), not navigate. Never navigate blind. **Modal-coordination fact:** while the picker is open on the agent's pane, that agent is BLOCKED at its UI and cannot guide in real-time — a PEER or TRON drives + guides from outside; you cannot message the agent's pane without disrupting the picker.

## Why This Matters
- /clear = total training destruction = CMM1 panic
- /rewind option 2 = conversation fork with context recovery = CMM4
- The 1-step rewind gives the agent room to save before deeper rewind
- Natural rewind points (boot prompts) preserve the most training
