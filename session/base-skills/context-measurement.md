# Base Skill: Context Measurement — the ONE truth (MANDATORY, all agents; SUPERSEDES all prior context-reading rules)

**Single source.** Any other statement about "how to read an agent's context" — in a `context.md`, `learnings.md`, or a SKILL.md — is SUPERSEDED by this file. Point to it; never re-state it (DRY).

## THE ONE TRUTH
**The only reliable context measurement is the `/context` display's `Free space: N (M%)` / `⚠ Context is N% full` line, read by a PEER via `otmux pane.capture` on a CONFIRMED-IDLE agent.** Nothing else is ground truth.

### HOW to read it — peer-capture WITH ENLARGE (solves the short-pane scroll; OOSH-clean, no raw tmux)
A multi-pane agent's pane is too short to render the `/context` header — it scrolls off, so you see only the category list / Suggestions, NEVER the `Free space` line. **ENLARGE the target pane first** (this is why a naive `pane.capture` "can't find the number"):
1. `otmux pane.size <target>` — note its current WxH to restore later.
2. `otmux pane.size.set <target> 120 45` — enlarge so `/context` renders in full. **`pane.size.set` targets a REMOTE pane** — `otmux zoom`/`pane.resize` are CALLER-only, useless for a remote target; this is the one that works.
3. `otmux send.enter <target> "/context"` (idle-only) → `otmux pane.capture <target>` → read the `Free space: N (M%)` line.
4. Restore: `otmux fit <session>` + `otmux tiled` (or `pane.size.set` back to the noted WxH).
**Same enlarge/restore renders a `/rewind` picker + confirm-menu for DRIVING** — so this also retires the "can't zoom a remote pane to drive a rewind" blocker.

## ★ Round 38 refinement (2026-08-12, trainer + ARON, measured live — reconciles the FLOOR vs the PANEL)
The panel is the AUTHORITATIVE measure, but it is HEAVY and is NOT the everyday gate. Name the two instruments honestly:
- **The `/context` panel Free-space header IS peer-capturable — via ENLARGE + TOP-capture** (`pane.size.set <target> 90 46` → `/context` → capture the TOP ~34 lines; the header renders at the panel TOP, ABOVE the 90-agent enum). Proven on 9 agents in one session (po/SM/req/planner/ARON/tester/expert), each cross-checked against the agent's own /context. **"Peer-uncapturable" was a zoom-gap error** — a naive capture grabs the pane BOTTOM (enum/Suggestions) and misses the header; enlarge first, capture the top. But it is **HEAVY** (jostles the neighbor pane → `otmux tiled` after) and **FRAGILE** (skip the enlarge and you miss the header) — so it is NOT the cheap everyday gate.
- **The CHEAP reliable MID-RANGE gate is the `claudeCode context.read` FLOOR (=%free)** — gap vs the panel is **~0.3pt** in a stable mid-range state (confirmed 2× 2026-08-12: trainer 40.1 floor / 39.8 panel; planner 43.7 floor). No enlarge, no jostle. **Usable on its own BELOW ~70% used** (per the graduated rule in `agent-rewind.md`: <40 dispatch freely · 40–55 bounded · >55 STOP + authoritative).
- **NEAR-WALL (≥~70% used) the floor UNDER-READS (up to ~18pt) → NOT reliable; pay the heavy panel (enlarge + top-capture).** This is the **OPEN GAP**: there is no CHEAP near-wall measure. **SPRINT (owed, raise to trainer/SM):** a peer-readable header-only `claudeCode context.panel` (total % + Free-space ONLY, no 90-agent enum) would make the near-wall panel cheap + certain.
- **POST-REWIND, `context.read` is CUMULATIVE (over-reads, lies) → the PANEL is the only proof a rewind LANDED** ([[context-read-lies-post-rewind-use-panel]]). The floor is for a STABLE agent, never right after a drive.
- **RETIRED: "the /context panel is the ONLY thing that can gate a rewind."** It is authoritative but heavy: the FLOOR gates mid-range, the PANEL proves landings + gates near-wall. We were gating on the floor all along and mis-calling it "the panel" — name it honestly. Self-estimates remain UNKNOWN (never a gate).

## The verified facts (2026-07-20 — SM fleet-rewind campaign + ARON's trainer-rewind, lived hard)
1. **Agents CANNOT self-read `/context`.** It renders **client-side** (to the terminal), not into the model — so **no agent can report its own %.** This is the 42: a peer must measure it for you.
2. **Reliable measure = peer-triggered `/context` on a CONFIRMED-IDLE agent, then `pane.capture` the `Free space` / `N% full` line.** That number is truth.
3. **Trigger `/context` ONLY on a stopped/idle agent that can easily continue.** NEVER inject it into an active/generating agent — it disrupts the work and is the harmful interruption (TRON directive, 2026-07-20). Idle-only.
4. **`claudeCode context.read` is UNRELIABLE post-rewind + near-wall — but its FLOOR (=%free) is authoritative-enough MID-RANGE (see the Round 38 refinement above).** It diverges to CUMULATIVE after a rewind (over-reads → use the PANEL to prove a landing) and UNDER-READS near the wall (up to ~18pt — the reading `65.7` for a real `55.6% free / 41.1% used` was such a high-usage case). In a STABLE state below ~70% used, the floor ≈ panel (gap ~0.3pt) and is the cheap everyday gate. (This corrects the older "garbage — never use" absolute, which measured only the near-wall/post-rewind failures.)
5. **`team.sweep` / sweep context readings are STALE (~1h).** Never drive a live rewind decision off a sweep number; re-measure with (2).
6. **The `Context low (N% remaining)` banner appears too LATE (near-wall). ABSENCE ≠ healthy.** Never conclude "healthy" from "no banner." Neither does "no banner + ghost-context-after-deep-rewind signature" prove free space — only the `Free space` line does.

## ⛔ DEPRECATED — do NOT act on any of these (they are WRONG)
- "TUI banner / status-bar = ground truth for context"
- "clear-to-save-Nk hint = usable context number"
- "no banner = healthy"
- "`context.read` %used is usable"
- "sweep ctx readings are trustworthy"
- "an agent can report its own context %"

## Why this matters
Acting on a stale context number kills agents two ways: **complacency** (miss a wall → the agent dies at the cliff) and **panic** (rewind/halt a healthy agent on a false "edge"). Both are `assume=ass-u-me`. Read the `Free space` line, on an idle agent, via a peer. Measure, never assume. **NEVER forget TRON CMM4.**
