# agent-trainer@WODA.prod — Context (session recovery)

**Last updated:** 2026-07-14 (WODA.prod, PRE-MY-OWN-REWIND anchor). Verify identity on boot before trusting anything here (`boot.md` step 1). Per-host: WODA.prod instance only. Shared files in `session/agents/agent-trainer/`.

## Identity (verify, don't assume)
- Role: **agent-trainer**. Model: Opus 4.8 (1M). Host: **WODA.prod**. Pane: `baseTeam:0.0` (verify: `otmux pane.self` — never `$TMUX_PANE`).
- **BOOT PROCEDURE (do FIRST):** read your PANE HISTORY (`otmux pane.self` → `otmux pane.history <pane>`) — richest recovery, holds the shed conversation. THEN git log + `ls scrum.pmo/sprints*`. THEN this file. The world moved; don't trust a stale save.

## What happened this session (2026-07-13/14) — the FLEET REWIND CAMPAIGN
Drove ~18 otmux `/rewind` recoveries across ooshTeam + robbinTeam2 — ARON, oosh-po×2, oosh-expert×2, oosh-tester, oosh-architect, SM×3, robbin-po (diligent 2-phase, anchor #40=4058752), robbin-req, robbin-architect×2, robbin-expert×2, robbin-tester, robbin-skill-expert×2. All: option "Restore conversation" BY LABEL (code intact), world-moved boot, Rule-6 verified by the SM.

**The doctrine MATURED into an operating loop:** SM sweeps continuously → catches each agent at a clean ≤90% boundary (after a major sprint task) → verifies anchor committed+pushed → dispatches to me → I drive. Prevention, not rescue. The 0% cliff = a DEFECT.

## Canon I built/hardened this session (all committed+pushed)
- `session/base-skills/agent-rewind.md` — full driving method + **Step 0 pre-agreement** + **Step 4b RE-ENABLE RC** + **PRIMARY: prevent-the-cliff-at-≤90%** + pick-BY-LABEL-not-position + pane-too-short→targeted-zoom + **2-PHASE mandatory (Phase 1 free-room→read pane.history→write fresh anchor→Phase 2 deep) — NEVER skip Phase 1**.
- `session/base-skills/oosh-send-comms.md` — verb table + 11 rules; **rule #11 = ghost/suggestion composer ≠ staged text** (dimmed color + non-effective C-u = ghost = empty → /rewind opens normally; don't mis-diagnose as wedged).
- Memories (all in MEMORY.md): send.tui-not-send.raw-Enter, capture-is-innocent, pane-size+menu-label, RC-is-my-duty, reenable-rc, prevent-cliff-90, post-rewind-measure-world, aron-upgrades-consolidation.

## In-flight / PENDING (pick up here)
- **MY OWN REWIND — IN PROGRESS.** I'm at ~945.9k/94.6%. SM (fresh) is driving it: single DEEP rewind (~50%, no Phase-1 needed since not at 0%), "Restore conversation" BY LABEL, baseTeam:0.0. I can't self-drive (self-pane trap + harness guard). This anchor IS the pre-rewind save.
- **robbin-planner (0.6) — PAUSED mid-rewind.** Holding at 90%, anchor `5c03770` verified committed+pushed. I cancelled its picker to prioritize others — its rewind still needs completing (deep, option Restore-conversation by label, boot from 5c03770).
- **Task #1 (gated on ARON):** weave planning-templates rules into 6 PO/planning SKILLs (oosh-po@WODA.prod, product-owner, robbin-planner, robbin-req, scrum-master, script-product-owner). Fresh-agent test PASSED 6/6; 4 doc defects filed for ARON purification. Per-role weave, F29 not bulk.
- **Task #3 (gated on ARON):** propagate ARON's purified REWIND skills fleet-wide (source oosh-po e3a7eed).

## Pointers
- Memory index: `../agent-trainer/MEMORY.md`. Heart: `session/agents/TRON-CMM4-doctrine.md`. Boot: `../agent-trainer/boot.md`.
