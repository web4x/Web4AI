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
- **`otmux zoom` / `pane.zoom` have NO target** — they toggle the *caller's* pane. There is no OOSH verb to zoom a *remote* pane; do not fall back to raw `tmux resize-pane -Z -t` (OOSH-only discipline). The window-level resize almost always suffices.

## Systemic fix (SPRINT — the durable CMM4 cure; gap → sprint)
The recovery above is a manual workaround. The real fix is in `otmux` (owner: oosh-expert, via oosh-po):
1. **`otmux fit` automatically on attach** + set a sane default window size on the last detach, so a small client never silently pins a driven session.
2. **Add a targeted zoom verb** — `otmux pane.zoom <target>` / `otmux zoom <target>` — closing the remote-zoom gap so a rewind driver can enlarge a specific pane the OOSH way.
3. **`otmux client.cleanup` in the rewind pre-flight** so a picker never opens into a pinned-small window.
Until shipped, the base skill is the CMM3 procedure every agent follows.

## Cross-refs
- `session/base-skills/otmux-pane-sizing.md` ([[otmux-pane-sizing]]) — the procedure.
- `session/base-skills/agent-rewind.md` — "PICKER RENDERS ONLY ITS HEADER" (this is why).
