# Base Skill: Context Measurement — the ONE truth (MANDATORY, all agents; SUPERSEDES all prior context-reading rules)

**Single source.** Any other statement about "how to read an agent's context" — in a `context.md`, `learnings.md`, or a SKILL.md — is SUPERSEDED by this file. Point to it; never re-state it (DRY).

## THE ONE TRUTH
**The only reliable context measurement is the `/context` display's `Free space: N (M%)` / `⚠ Context is N% full` line, read by a PEER via `otmux pane.capture` on a CONFIRMED-IDLE agent.** Nothing else is ground truth.

## The verified facts (2026-07-20 — SM fleet-rewind campaign + ARON's trainer-rewind, lived hard)
1. **Agents CANNOT self-read `/context`.** It renders **client-side** (to the terminal), not into the model — so **no agent can report its own %.** This is the 42: a peer must measure it for you.
2. **Reliable measure = peer-triggered `/context` on a CONFIRMED-IDLE agent, then `pane.capture` the `Free space` / `N% full` line.** That number is truth.
3. **Trigger `/context` ONLY on a stopped/idle agent that can easily continue.** NEVER inject it into an active/generating agent — it disrupts the work and is the harmful interruption (TRON directive, 2026-07-20). Idle-only.
4. **`claudeCode context.read` is STALE / garbage — do NOT use it for decisions.** Measured: it read `65.7` when the real value was `55.6% free / 41.1% used`. It also diverges to cumulative after a rewind and inverts near the wall.
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
