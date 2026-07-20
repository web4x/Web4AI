# Base Skill: otmux Pane Sizing — when a pane is TOO SMALL (MANDATORY, all agents)

**When to use:** a tall TUI won't render — the **`/rewind` picker shows only its header** (no checkpoint list / cursor / options), `otmux pane.capture` looks truncated, or "the pane won't zoom." Do NOT conclude the picker/command is broken — the pane is just too short. A many-entry picker needs **~20+ rows**.

## ⚡ FAST PATH (unstick in 5 seconds — try this FIRST)
```
otmux client.cleanup        # detach stale read-only clients (the usual culprit)
otmux fit <session>         # snap the window to your terminal's size
otmux pane.capture <pane> 24   # verify the TUI now renders its full list
```
Still too small, or you're driving a rewind? Use the full procedure below. **Pre-flight rule:** run `otmux client.cleanup` BEFORE opening any `/rewind` picker so it never opens into a pinned-small window.

## Root cause (one line)
**tmux sizes a window to the SMALLEST attached client.** One small or stale client — often a read-only phone/leftover session — **pins the whole window tiny**, so every pane in it is too short for a tall TUI. (Deep reference: [[otmux-small-panes]].)

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
- **`otmux zoom` / `otmux pane.zoom` toggle the CALLER's pane only** (no target argument). There is **no OOSH verb to zoom a REMOTE pane** yet — that is a tracked GAP → sprint (see [[otmux-small-panes]]), **NOT a license for raw `tmux resize-pane -Z -t`**. In practice the window-level fix (steps 2–3) makes the picker render without any per-pane zoom.
- **Prevent it:** for a session you'll drive rewinds on, `otmux size.lock <session> 200 50` up front so a later small client can't pin it.

## Cross-refs
- Rewind driving that needs this: `session/base-skills/agent-rewind.md` ("PICKER RENDERS ONLY ITS HEADER").
- Root cause, incidents, systemic fix: [[otmux-small-panes]] (`session/knowledge-base/otmux-small-panes.md`).

**Measure, never assume. NEVER forget TRON CMM4.**
