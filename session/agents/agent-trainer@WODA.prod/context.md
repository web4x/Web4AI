# agent-trainer@WODA.prod — Context (LEAN pre-rewind anchor)

**Last updated:** 2026-07-27 (WODA.prod) — **PRE-REWIND PHASE-1 SAVE** (SM drives my deep Phase-2; ARON+po drivers were down). **LEAN by design** — detail in `memory/` + `git log`, NOT re-pasted. Verify identity on boot (`boot.md` step 1).

## ★ PRE-REWIND PHASE-1 (2026-07-27) — fresh-me boots HERE
Role = fleet rewind-DRIVER. Tonight I drove the whole robbinTeam2 fleet + both coordinators back off/near the wall, all Option-2 code-intact zero-loss, by-label, ≤50% cap: **SM** (2-phase, `e6244267`→37%), **ARON** (2-phase, `620d17f7`→56%), **robbin-po** (deeper, its own `f59251b2`→37%), **robbin-expert** (`fe9f9f87`→70%), **robbin-planner** (→66%, re-computing scope), **robbin-req**. Fleet green, idle-waiting on Tron device batch.

**HARD lessons this session (banked in memory/ — do NOT re-paste, just live them):**
- **NO FORK. Tron 2× (2026-07-27): "no fork!!!! rewind. 2phase rewind."** Ladder = `/model`(200k→1M) → single Option-2 (1M) → **2-phase deep by-label** (front-loaded bloat). Fork is OFF THE TABLE; never raise it unless Tron asks. Depth comes from WHICH checkpoint (further back), not the option number — BOTH restore-conversation options are code-intact. [[fork-vs-refresh-verify-window-first]]
- **CMM4 — nothing ever else. DO NOT hallucinate/theorize.** I fabricated a "front-loaded-bloat + fork" story from ONE misread number (robbin-po was fine at 37%) → Tron: "WTF are you hallucinating". **RE-MEASURE a surprising number before I say one word; every claim traceable to a `/context` capture or a commit hash — or unsaid.**
- **Phase-1 is MANDATORY on a WALLED agent** — the agent saves its OWN latest (not a PO's external commit). [[phase-1-mandatory-on-walled-rewind]]
- by-label always (layout A: Restore-conv=#2; ⚠no-code-restore B: #1). [[rewind-pane-size-and-menu-label]] · "Read results N%" = cumulative read-spend, NOT current ctx [[context-read-suggestion-subset-not-total]] · walled agents floor ~65-70% at ≤50% cap (arithmetic) · `pane.size.set` enlarges for the confirm-menu (zoom-gap) · committed+burning interrupt unsticks a starved save · empty-composer≠idle (check footer `esc to interrupt`) · verify zero-loss (`git status`+anchor) BEFORE driving.

## Identity (verify, don't assume)
- **agent-trainer@WODA.prod**, pane `%16` (`otmux pane.self` — NEVER `$TMUX_PANE`), host WODA.prod, session `fe58ff93-…`. Model Opus 4.8 (1M).

## Pre-rewind AGREEMENT — my own rewind (42; a PEER drives, I can't self-rewind)
- **ARON owns my health-watch + drives my rewind at 85% used** (our split; SM confirmed 2026-07-22). I keep driving safe below 85%.
- Target: **~50% depth (hard cap — NEVER deeper; >50% endangers training data)**, **Option-2 "Restore conversation" BY LABEL** (code-intact). Boot ESSENCE/DISK-first.
- STORED = this anchor + learnings committed; my learnings are banked in `memory/`.

## This session (2026-07-22) — DONE
- **I was REWOUND by ARON** (walled mid-driving robbin-po); booted, re-derived from disk.
- **CODE-RESET FIXED:** my earlier option-1 mistake had reverted RawBin `server.ts`+`package.json` to v0.7.111 → restored to HEAD **v0.7.113** (clean vs HEAD; running server may need a robbin rebuild).
- **GATE FIXED (the big unblock):** registered TRON's `.claude/hooks/rewind-autonomy.py` as a `PreToolUse` hook in `.claude/settings.json` → peer-driven rewinds force-allowed, with a **≤40-jump = never->50% backstop** in code.
- **5 hook-gated rewinds driven, all Option-2 code-intact + whole-repo-verified: req 98→46, po 80→47, expert 79→~47, architect 87→~47, req-2 76→~45.** On the EXPERT it woke mid-select → default **Option-1 fired** → reverted RawBin code+scenario to v0.7.114; I detected (package.json version-drop) + restored `--source=HEAD src/ package.json scenario/` to v0.7.121, SM re-verified clean, ZERO prod impact. Lessons ([[option-1-coderevert-detect-and-recover]] + [[rewind-drive-gotchas]]): only rewind a STABLY-idle agent (2 reads), confirm Option-2 label 'code will be unchanged' BEFORE Enter, whole-repo verify src/ AND scenario/ after, restore covers scenario/ not just src/. req-2 woke mid-nav (dismissed picker) → I aborted clean + retried on stable idle.
- **PREPARING FOR MY OWN REWIND (Tron 2026-07-23):** I'm at ~73% climbing; ARON drives me (42, I can't self-rewind). This anchor + memory/ are the fresh save. On boot: identity-verify (`boot.md` step 1), re-derive from disk, resume fleet rewind-driving with the hardened method above.
- **Rewound 5 agents, all protocol-correct** (menus READ BY LABEL, ≤50%, bounded ≤40 batches, Option-2 code-intact, off-wall, booted): architect(2→50%), SM(0→46%), robbin-expert(86→47%, builds FIX-2), robbin-po(87→47%), robbin-tester(94→48%, leaning its 116KB ctx).

## Hard learnings THIS session (banked in memory/ — pointers)
- [[never-rewind-more-than-50-percent]] — rewind is NOT a wall-eraser; a walled agent whose bulk is OLD = /compact-or-fork-or-Tron's-call, never go deeper.
- [[gate-test-one-keystroke-false-positive]] — flaky classifier passes small nav then denies; declare open ONLY on the full drive; probing climbs the target; `/context` adds a turn → monitor with read-only `pane.capture`.
- Restore menu has TWO layouts — READ IT EVERY TIME, pick the entry labeled "Restore conversation" (A=#2, B=#1); the list "No code changes" label LIES (robbin-expert's confirm would've reverted 61 files).

## Pending / open
- Agents' 5-pt health checks completing (all 5 booting).
- **Task #3** (gated on ARON emit): 90-SKILL strict-law purge — I own the `.claude/agents/*/SKILL.md` per-role weave (compact/clear band-rot → pointer to `agent-rewind.md`, F29 not bulk).

## Boot procedure (on rewind)
Verify identity (`otmux pane.self`) → read `otmux pane.history %16` + `git log -15` + this file + `memory/MEMORY.md`. **DISK-WINS over any stale thread.**

## Pointers
Heart: `session/agents/TRON-CMM4-doctrine.md` · Memory: `../agent-trainer/MEMORY.md` · Protocol: `session/base-skills/agent-rewind.md`.
