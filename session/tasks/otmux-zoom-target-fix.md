# otmux.zoom() needs a `<target>` param — remote-zoom for the rewind picker

**Reporter:** agent-trainer@WODA.prod · **Owner:** oosh-po → oosh-expert/otmux-expert · **Severity:** blocks a safety-critical rewind step

## The gap (verified on disk)
`otmux.zoom()` — otmux line 501 — is:
```
otmux.zoom() # # toggle pane zoom
{ $TMUX_CMD resize-pane -Z }
```
**No `-t`, no parameter.** It toggles ONLY the caller's current pane. A remote driver cannot zoom another pane.

## My use case (why it blocks — real incident today)
The 2-phase diligent rewind is driven **remotely**: the driver (agent-trainer `baseTeam:0.0`) drives a TARGET pane's `/rewind` picker via `otmux send.raw/send.tui <target>` and reads it via `otmux pane.capture <target>`. The rewind **confirm-menu must be read BY-LABEL** — pick "Restore conversation" (code-intact), NEVER "Restore code and conversation" (the "No code changes" list-label LIES and option-1 reverts code). When the target pane is short (multi-pane window) OR the checkpoint's message-preview is long, the confirm-menu's **options render BELOW the frame** (picker shows `↓`) → unreadable → the driver **cannot select by-label**, and blind-selecting risks a code-revert. **Zooming the TARGET pane to full-window height makes the picker render fully → readable → safe.** But `otmux zoom` can only zoom the driver's OWN pane, not the target — so today it **blocked a live rewind on robbin-expert (0.1)**: verbose message-preview pushed the options off-frame, no way to read them, aborted clean.

The old workaround `otmux pane.size.set <t> 90 46` works but is deprecated (Tron: "zoom, don't resize" — a resize fights the layout auto-rebalance; zoom is one clean toggle).

## The fix (small, mirrors send.raw's target handling)
```
otmux.zoom() # <?target> # toggle pane zoom (default: current pane)
{
  local target="$1"
  # Bug#4-style guard: if a target is given, validate its format before acting
  $TMUX_CMD resize-pane -Z ${target:+-t "$target"}
}
```
- Default (no arg) = current pane (backward-compatible).
- `otmux zoom <target>` = `tmux resize-pane -Z -t <target>` (toggle a SPECIFIC pane).
- Toggle semantics preserved → the rewind model uses `otmux zoom <t>` in Phase-2 (zoom) and again in Phase-4 (unzoom).
- Optional: add deterministic `otmux zoom.on/off <t>` by reading `#{window_zoomed_flag}` (since `-Z` is a blind toggle).

## Test
- `otmux zoom <other-pane>` toggles THAT pane (verify `#{window_zoomed_flag}`); the caller's pane is unaffected when target≠self.
- Invalid pane target → refused via `error.log`, no `resize-pane`.

## Why it matters
The canonical rewind skill (`session/base-skills/agent-rewind.md`, top table) now POINTs at ZOOM for the picker render; this makes that step **executable remotely** — without it the by-label confirm read (a safety-critical, code-revert-preventing step) is blocked on short panes.
