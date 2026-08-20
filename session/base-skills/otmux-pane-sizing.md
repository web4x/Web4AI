# Base Skill: otmux Pane Sizing — when a pane is TOO SMALL (MANDATORY, all agents)

**When to use:** a tall TUI won't render — the **`/rewind` picker shows only its header** (no checkpoint list / cursor / options), `otmux pane.capture` looks truncated, or "the pane won't zoom." Do NOT conclude the picker/command is broken — the pane is just too short. A many-entry picker needs **~20+ rows**.

## ⚡ FAST PATH (unstick in 5 seconds — try this FIRST)
```
otmux client.cleanup        # detach stale read-only clients (the usual culprit)
otmux fit <session>         # snap the window to your terminal's size
otmux pane.capture <pane> 24   # verify the TUI now renders its full list
```
Still too small, or you're driving a rewind? Use the full procedure below. **Pre-flight rule:** run `otmux client.cleanup` BEFORE opening any `/rewind` picker so it never opens into a pinned-small window.

## Root cause — TWO levels (both must be tall enough)
1. **Window level: tmux sizes a window to the SMALLEST attached client.** One small/stale client — often a read-only phone or leftover bridge — **pins the whole window tiny** (measured: a 57×34 window). Fix: detach it (`client.cleanup`) + `fit`/`size.lock`.
2. **Pane level: a split window divides that height.** Even a big 252×63 window, split 7 ways, gives **~19–20-row panes** — still too short for a picker (needs ~20+). Fix: **zoom the target pane** (fills the window) before the TUI op.

**Why it matters for headless drivers (the trainer-stall root cause):** the `/rewind` picker and `/context` render **CLIENT-SIDE — to the pane's screen**, not into the model. A headless peer driving via `otmux pane.capture` reads that rendered screen — so it **can** see and drive the picker, **but ONLY if the pane is tall enough to render it.** On a too-short pane the picker renders blank/header-only → `pane.capture` returns blank → the driver flies blind and stalls. That is not a broken picker; it is an unzoomed/pinned pane. (Deep reference: [[otmux-small-panes]].)

## STANDING PRE-OP — before ANY `/rewind` or `/context` on a split-window pane
**Zoom the target pane so it fills the window (tall enough to render), then un-zoom after.**
- To make a REMOTE target pane tall enough, use **`otmux pane.size.set <target> <W> <fitting-H>`** — the authoritative remote-pane-sizing verb (single-sourced in `context-measurement.md` + `agent-rewind.md`). **Measure the window first; H CLAMPS to the window's rows** (e.g. `90 34`, not `90 46` — an over-tall H just clamps). `otmux zoom` / `pane.zoom` toggle only the CALLER's pane (no target arg); for a remote target size it with `pane.size.set`, never raw tmux.
- **one-zoom-per-window:** un-zoom any prior zoomed pane first (a stuck zoom is the "won't zoom" bug).
- Pre-flight `otmux client.cleanup` too, so the window itself isn't pinned small.

## Headless-safe rewind driving IS possible (not human-only)
A headless peer (SM/ARON/trainer) CAN drive a rewind — the picker is capturable once the pane renders. Requirements: (a) window not pinned (`client.cleanup`), (b) **target pane zoomed tall**, (c) **`pane.capture` between EVERY keystroke** (never blind-send by assumed geometry — that overshoots the ceiling and dismisses the picker). An attached human isn't required; a *rendered, captured* pane is.

## The deterministic fix (OOSH-only — never raw tmux)
```
# 1. MEASURE — who is attached and how small?
otmux client.list          # clients with size/flags/session/idle; find the small or read-only one
otmux size.status          # current window size

# 2. DETACH the pinner (the small/stale client pinning the window)
otmux client.cleanup       # detaches stale READ-ONLY clients + refreshes layout (the common fix)
#   or, for one specific client:  otmux client.detach <tty>

# 3. RESIZE the window
otmux fit <session>        # snap the window to YOUR terminal's cols×rows
#   or force a floor:       otmux size.lock <session> 200 50   (min 200×50, survives a small client)

# 4. VERIFY (measure, never assume)
otmux size.status
otmux pane.capture <pane> 24   # the picker/TUI now renders its full list

# 5. RESTORE after the recovery
otmux size.unlock <session>    # only if you used size.lock
```

## Rules
- **one-zoom-per-window** — tmux allows only ONE zoomed pane per window. **Un-zoom the prior pane before zooming another** (the classic "the pane won't zoom" bug = a different pane is still zoomed).
- **`otmux zoom` / `otmux pane.zoom` toggle the CALLER's pane only** (no target argument). To size a REMOTE target pane, use **`otmux pane.size.set <target> <W> <fitting-H>`** — the authoritative verb (measure the window first; H clamps to window rows; see `context-measurement.md` + `agent-rewind.md`). In practice the window-level fix (steps 2–3) also makes the picker render without any per-pane sizing.
- **Prevent it:** for a session you'll drive rewinds on, `otmux size.lock <session> 200 50` up front so a later small client can't pin it.

## Cross-refs
- Rewind driving that needs this: `session/base-skills/agent-rewind.md` ("PICKER RENDERS ONLY ITS HEADER").
- Root cause, incidents, systemic fix: [[otmux-small-panes]] (`session/knowledge-base/otmux-small-panes.md`).

**Measure, never assume. NEVER forget TRON CMM4.**
