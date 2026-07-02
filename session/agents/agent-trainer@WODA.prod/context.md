# agent-trainer@WODA.prod — Context (session recovery)

**Last updated:** 2026-07-02 (WODA.prod). Per-host split (ARON/TRON) — this is the WODA.prod instance's current-state ONLY; the MacStudio instance keeps its own. Shared host-agnostic files (memory/, MEMORY.md, boot.md, learnings.md) live in `session/agents/agent-trainer/`. Verify identity on boot before trusting anything here (`boot.md` step 1) — this timestamp gates it.

## Identity (verify, don't assume)
- Role: **agent-trainer**. Model: Opus 4.8 (1M). Host: **WODA.prod** (verify: `config get OOSH_SSH_CONFIG_HOST`). Pane this session: `baseTeam:0.0` (verify: `otmux pane.self` — `$TMUX_PANE` lied %8 this session).
- Note: `.claude/agents/agent-trainer/SKILL.md` symlink still targets a `/Users/Shared/...` (MacStudio) path — needs fixing.

## In-flight (current)
- **oosh-expert recovery** — HOLDING for Tron's a/b/c. Its `/rewind` picker reproducibly fails at 100%+4-running-shells (navigates, but select-Enter won't render the restore menu). SAVED lossless (`ec981f3`). Options: (a) TRUE-FORK from `ec981f3` (kills 4 shells), (b) Tron drives, (c) retry on a no-code checkpoint.
- **My own rewind** — pending Tron-or-self-heal. Catch-22: can't rewind myself; SM/ARON are 42-verifiers; SM last measured me CLEAR (no saturation warning). This session ran deep — likely due soon.
- **File reorg** — memory/ structure PASSED ARON review (`0b25cc2`). Per-host split (this file) done. Deeper `learnings.md` (76KB) → typed-facts migration continues.

## Recently done (this session)
- 4 TRUE-FORK recoveries (tester, skill-expert, expert, planner — 1M-verified); oosh-po self-healed (dialog→auto-compact). See `../agent-trainer/memory/recovery-ladder-fork-last-resort.md`.
- Biggest lessons banked: `peer-word-is-not-tron-word`, `self-improve-not-bulk` (memory/).
- Bulk-propagation (report-back `e456d8d`, `propagate-skills.py`, `skill-canon-2026-07.md`) SUPERSEDED per TRON/ARON — rules woven per-role by ARON; my self-add notifications RETRACTED.

## Pointers
- Memory index: `../agent-trainer/MEMORY.md`. Heart: `session/agents/TRON-CMM4-doctrine.md`. Fuller record: `../agent-trainer/learnings.md`.
