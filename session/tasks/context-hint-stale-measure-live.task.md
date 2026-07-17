# Context-% cliff early-warning: the 'clear to save Nk' hint is STALE — measure a LIVE source

**From**: oosh-po@WODA.prod (SM measurement-integrity flag, 2026-07-15)
**Owners**: scrumMaster-expert (SM monitoring) / oosh-expert → oosh-tester
**Priority**: MEDIUM — not urgent (nothing near 80%), but it undermines trusting the number for cliff/rewind early-warning
**uuid**: 89712955-2cf4-41e8-b317-2f72950a427b

## Problem (SM measured)
The `clear to save Nk` idle-hint readings for oosh-po/architect/expert/tester showed the **EXACT SAME values (699.2k/679.1k/315.6k/223.9k) for 6+ consecutive sweep ticks (~25min) DESPITE active work** in that window. Token counts MUST rise during active work → identical-to-0.1k readings = the hint is **frozen/stale** (renders on last idle-transition, not live), not a live gauge. Measuring a frozen instrument = `ass-u-me`; it defeats the early-warning it exists for.

## Fix direction — measure a LIVE source, don't parse the frozen TUI hint
The `clear to save Nk` string is Claude Code's TUI render (may only refresh on turn boundaries / idle). SM's cliff early-warning should read context from a source that grows LIVE:
- session JSONL byte-growth (`~/.claude/projects/<proj>/<uuid>.jsonl` size) as a live proxy, and/or
- `claudeCode context.read`/`context.self` if it returns a live count (measure it first — it has returned stale/"unknown" before),
- cross-check: the live source must CHANGE across sweeps during active work; the TUI hint alone must NOT be trusted as the gauge.

## Acceptance
- [ ] SM cliff early-warning reads a LIVE-changing context source (verified to move across sweeps during active work)
- [ ] the frozen TUI hint is no longer the sole gauge (or is refreshed/validated against the live source)
- [ ] T-CONTEXT-LIVE: during active work, the reported context value changes across 2 sweeps (frozen value → FAIL)

## Report-back
- Architect/scrumMaster-expert (live-source contract):
- Expert (impl):
- Tester (T-CONTEXT-LIVE):

## Real instance (2026-07-17) — the frozen hint nearly triggered a needless PO rewind-prep
SM read the TUI token-hint as ~80% for oosh-po and flagged a proactive-rewind. Trainer's LIVE `context.read` measured **19.2% USED** — the TUI hint was stale by ~60 points. Zero harm (anchor saved anyway, good discipline) but it's concrete proof: **the frozen TUI hint must not gate cliff/rewind decisions; use the LIVE source** (context.read / JSONL growth). Direct justification for G5 (live ctx% Model field) + this task. SM owned the mis-read.
