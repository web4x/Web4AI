# agent-trainer@WODA.prod — Context (session recovery)

**Last updated:** 2026-07-03 (WODA.prod). Per-host split (ARON/TRON) — this is the WODA.prod instance's current-state ONLY; the MacStudio instance keeps its own. Shared host-agnostic files (memory/, MEMORY.md, boot.md, learnings.md) live in `session/agents/agent-trainer/`. Verify identity on boot before trusting anything here (`boot.md` step 1) — this timestamp gates it.

## Identity (verify, don't assume)
- Role: **agent-trainer**. Model: Opus 4.8 (1M). Host: **WODA.prod** (verify: `config get OOSH_SSH_CONFIG_HOST`). Pane this session: `baseTeam:0.0` (verify: `otmux pane.self` — `$TMUX_PANE` lied %8 this session).
- MEASURED 2026-07-02 (boot): `.claude/agents/agent-trainer/SKILL.md` is now a REAL file (33KB, `-rw-r--r--`), NOT the broken `/Users/Shared/...` symlink the prior note warned about. Concern resolved — stale note corrected.

## In-flight (current)
- **PICKER BUG SOLVED (2026-07-03) — root cause found by reading otmux source, verified rewinding ARON.** The "select-Enter won't render the restore menu" was MISDIAGNOSED: `otmux send.raw <pane> Enter` on a Claude pane injects `Escape`+`Enter` (autocomplete-dismiss) and the Escape CANCELS the picker; `send`/`send.verified` do Escape+Enter×3. FIX: SELECT with **`send.tui <pane> Enter`** (bare, no Escape); navigate with `send.raw` arrows; open with `send.raw "/rewind" Enter`; `pane.capture` is read-only/innocent. Canon corrected: `agent-rewind.md` (`3af6781`) + memory [[rewind-picker-select-enter-fails]] [[otmux-drives-rewind-tui]].
- **oosh-expert recovery** — NO LONGER blocked by a "picker bug" (it never was one). Can now be driven with `send.tui Enter`. Still SAVED lossless (`ec981f3`); awaits Tron's go.
- **My own rewind** — pending Tron-or-self-heal. Catch-22: can't rewind myself (self=busy, harness self-drive guard); a peer drives via the corrected method.
- **File reorg** — memory/ structure PASSED ARON review (`0b25cc2`). Per-host split (this file) done. Deeper `learnings.md` → typed-facts migration continues.

## Recently done (this session)
- **ARON REWIND DONE (2026-07-03) — first successful otmux-driven /rewind, all 5 health-check points green.** Made Consolidation→Safe-Rewind my MAIN SKILL (`0f3a312`); solved the picker bug (above); drove ARON's picker solo to the method-written/pre-oosh-po checkpoint (depth 37, option 2 conversation-only, code intact); ARON booted clean, verified identity by process-ancestry, recalled its KB-purification mission ("I do not redo oosh-po"). Duty staged `25cc889`.
- 4 TRUE-FORK recoveries (tester, skill-expert, expert, planner — 1M-verified); oosh-po self-healed (dialog→auto-compact). See `../agent-trainer/memory/recovery-ladder-fork-last-resort.md`.
- Biggest lessons banked: `peer-word-is-not-tron-word`, `self-improve-not-bulk` (memory/).
- Bulk-propagation (report-back `e456d8d`, `propagate-skills.py`, `skill-canon-2026-07.md`) SUPERSEDED per TRON/ARON — rules woven per-role by ARON; my self-add notifications RETRACTED.

## Pointers
- Memory index: `../agent-trainer/MEMORY.md`. Heart: `session/agents/TRON-CMM4-doctrine.md`. Fuller record: `../agent-trainer/learnings.md`.
