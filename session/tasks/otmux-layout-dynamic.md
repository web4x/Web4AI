# otmux layout.dynamic — switch current window panes from fixed/locked to dynamic sizing

**Reporter**: Tron via PO (ooshTeam:0.0)
**Priority**: TBD (queued after bug-otmux-send-window-gt-0)
**Assignee**: oosh-expert
**Status**: SPEC DRAFT — implementation queued

## Request

New otmux method that converts all panes in the **current tmux window** from locked/fixed sizes back to auto/dynamic sizing — i.e. clears any pinned-size state so panes resize naturally with the terminal.

Background: `otmux size.lock` (or related) sets per-session size constraints stored in S9 (`otmux.size.locks.env`). When operator wants panes to "breathe" with terminal resizes again, today there's no single command — they must manually unlock and re-apply tiled.

## Behavior contract (proposed — confirm with architect)

```
otmux layout.dynamic
```

For the current tmux window:
1. Clear any `window-size` constraint at session level (`set -u window-size`) so it falls back to default `latest`
2. Clear any per-pane resize lock (if such state exists — investigate)
3. Re-apply a tmux layout that respects current terminal size (e.g. `tiled` or `even-horizontal`/`even-vertical` based on pane count)
4. Re-sync clients (`tmux refresh-client -S`)

No argument: operates on current window (via `$TMUX_PANE` → session). Optional explicit `<?session>` for scripting.

Companion: existing `otmux size.unlock <?session>` removes the S9 entry but doesn't actively trigger a re-layout — `layout.dynamic` adds the re-layout step.

## Investigation needed before implementation

1. Read otmux source for `size.lock` / `size.unlock` / `size.floor.apply` to find all knobs that pin size
2. Check `window-size` option states (`largest` / `smallest` / `latest`) and which is set today
3. Confirm whether the user wants "tiled" or "even" as the re-layout choice (or just no-op layout and let user pick)
4. Identify if there's interaction with `tronMonitor.fit` (Sprint 1 D4) — fit is event-driven sizing; dynamic is the inverse

## Open questions for architect

- Should `layout.dynamic` unlock S9 entries automatically, or only act on tmux-level state and require operator to run `size.unlock` separately? Both signal "go back to natural sizing" — bundling is simpler but couples concerns.
- Default re-layout: `tiled`, `even-horizontal`, `even-vertical`, or skip and let tmux pick?
- Scope: current window only (as requested) or full session?

## Acceptance (draft)

- `otmux layout.dynamic` defined; bash -n clean
- Default invocation acts on current tmux window only
- All panes resize with terminal after invocation (verify by shrinking terminal width)
- Existing `size.lock` state on the session is either cleared or surfaced via warning (TBD)
- Tester verifies: lock a session, observe stuck size on terminal resize, run `layout.dynamic`, observe panes resize fluidly

## Commit

`otmux: layout.dynamic method (ref: otmux-layout-dynamic.md)`

## Status

**SPEC ONLY — implementation queued.** Awaiting architect input on the 3 open questions before coding. PO confirmed this is post-bug-otmux-send-window-gt-0.
