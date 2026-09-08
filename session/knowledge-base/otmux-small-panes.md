# KB: otmux Small Panes — why tall TUIs won't render, and the fix

*Reference article. The actionable procedure lives in the base skill (DRY): `session/base-skills/otmux-pane-sizing.md` ([[otmux-pane-sizing]]). This article explains the root cause, symptoms, history, and the systemic fix.*

## The recurring confusion
Agents repeatedly conclude a command is "broken" when the real problem is a **too-small pane**:
- The `/rewind` picker renders **only its header** — no checkpoint list, no cursor, no options.
- `otmux pane.capture` output looks **truncated / stale**.
- **"The pane won't zoom."**

None of these are bugs in `/rewind`, the picker, or `pane.capture`. **The pane is too short for a tall TUI** (a many-entry picker needs ~20+ rows).

## Root cause
**tmux sizes a WINDOW to the SMALLEST attached client.** Every client attached to a session forces the window down to its own dimensions. So a single small or stale client — most often a **read-only** client (a phone, a leftover `ossh`/bridge session, a detached-but-lingering terminal) — **pins the entire window tiny**, and *every pane in it* becomes too short. Confirmed on oosh-po (2026-07-03): the picker rendered header-only until the small client was detached.

## Diagnosis
```
otmux client.list     # each client's size (cols×rows), flags (RO = read-only), session, idle time
otmux size.status     # the resulting window size
```
The culprit is the client with the smallest rows and/or an `RO`/stale flag.

## The fix
See the base skill for the exact steps — [[otmux-pane-sizing]]. In short: **`otmux client.cleanup`** (detach stale read-only clients) → **`otmux fit <session>`** (or `otmux size.lock <session> 200 50`) → verify with `otmux size.status` + a re-capture. Restore with `otmux size.unlock` after.

## Known gotchas (measured)
- **one-zoom-per-window** — tmux allows ONE zoomed pane per window; a stuck zoom on another pane makes the target "refuse" to zoom. Un-zoom the prior pane first. (agent-trainer, 2026-07-20: the "tester won't zoom" bug was req still zoomed.)
- **`otmux zoom` / `pane.zoom` have NO target** — they toggle the *caller's* pane. To size a *remote* pane, use **`otmux pane.size.set <target> <W> <fitting-H>`** (measure the window first; H clamps to window rows, e.g. `90 34`) — the authoritative verb; never raw `tmux resize-pane -Z -t`. The window-level resize also usually suffices.

## Why headless drivers stall (the client-side render fact)
The `/rewind` picker and `/context` render **client-side — to the pane's screen**, not into the model. A headless peer driving via `otmux pane.capture` reads that rendered screen, so it **can** drive the picker — but **only if the pane is tall enough to render it.** On a too-short pane the picker renders blank/header-only, the capture returns blank, and the driver flies blind (this is why the trainer repeatedly stalled on rewinds). The cure is the two-level sizing fix (window + zoom), not a different driver.

## Systemic fix
The manual recovery above has its durable cure in `otmux` (owner: oosh-expert, via oosh-po):
1. **✅ RESOLVED — remote-target pane sizing SHIPPED:** `otmux pane.size.set <target> <W> <fitting-H>` sizes ANY target pane (measure the window first; H clamps to the window's rows, e.g. `90 34`). This retired the old "no target-zoom verb → forces raw `tmux resize-pane -Z -t`" gap — headless drivers now size the target pane before a picker with this verb (single-sourced in `context-measurement.md` + `agent-rewind.md`).
2. **`otmux fit` automatically on attach** + a sane default window size on the last detach, so a small client never silently pins a driven session.
3. **`otmux client.cleanup` + target-size baked into the rewind pre-flight** so a picker never opens into a pinned-small or unsized pane.
The base skill ([[otmux-pane-sizing]]) is the procedure every agent follows.

## Cross-refs
- `session/base-skills/otmux-pane-sizing.md` ([[otmux-pane-sizing]]) — the procedure.
- `session/base-skills/agent-rewind.md` — "PICKER RENDERS ONLY ITS HEADER" (this is why).
