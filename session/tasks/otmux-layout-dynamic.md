# otmux layout.dynamic — switch current window panes from fixed/locked to dynamic sizing

**Reporter**: Tron via PO (ooshTeam:0.0)
**Priority**: TBD (queued after bug-otmux-send-window-gt-0)
**Assignee**: oosh-expert
**Status**: IN PROGRESS — architect questions resolved via codebase investigation 2026-05-26

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

## Open questions for architect — RESOLVED via investigation

**Q1 — Unlock S9 automatically?** YES. Existing `otmux.size.unlock` already does both: reverts tmux state AND removes S9 entry via `private.otmux.size.lock.remove`. `layout.dynamic` mirrors that pattern at window granularity. Mismatch between S9 and tmux state would be worse than coupling.

**Q2 — Default re-layout?** `tiled`. Works for any pane count, well-tested across the codebase (see tronMonitor.fit, hiveMind team.setup). Operators can re-pick via existing `otmux layout <type>` after.

**Q3 — Scope?** Current window only — PO explicit. Session-scope already covered by `otmux size.unlock <session>`. New method fills the per-window gap.

## Design

```bash
otmux.layout.dynamic() # <?window:current> # restore current-window panes to dynamic sizing + tiled layout
```

Steps:
1. Resolve target window: arg or `${session}:${window_index}` via `display-message`
2. Set session's `window-size=largest` (per-window largest = dynamic mode)
3. Set per-window `aggressive-resize on`
4. Remove S9 entry for `session:window` key via existing `private.otmux.size.lock.remove`
5. Apply `select-layout -t <window> tiled` to redistribute panes immediately
6. `refresh-client -S` to sync survivors

Relies on existing private helpers (`private.otmux.size.lock.remove`, `private.otmux.size.currentSession`). No new state, no new files.

## Acceptance (draft)

- `otmux layout.dynamic` defined; bash -n clean
- Default invocation acts on current tmux window only
- All panes resize with terminal after invocation (verify by shrinking terminal width)
- Existing `size.lock` state on the session is either cleared or surfaced via warning (TBD)
- Tester verifies: lock a session, observe stuck size on terminal resize, run `layout.dynamic`, observe panes resize fluidly

## Commit

`otmux: layout.dynamic method (ref: otmux-layout-dynamic.md)`

## Status (closure)

- **Investigation**: 3 architect questions self-resolved via existing pattern study (size.unlock + size.lock.remove).
- **Implementation**: oosh commit `da48c11` — single method `otmux.layout.dynamic <?window>` at line ~1314 + completion function. 47+/0-.
- **Live verification**:
  - `bash -n otmux` clean
  - Default invocation (no arg) resolves current window via TMUX_PANE — ooshTeam:0 transitioned `window-size=manual → largest`
  - Explicit invocation `otmux layout.dynamic ooshTeam:0` — same result, idempotent
  - S9 cleared via private.otmux.size.lock.remove (existing helper)
  - Interactive Tab completion: `otmux layout.dynamic ` + Tab shows window targets (e.g. `ooshTeam:0`, `TRONinterface:0`)
- **Handoff to tester**: verify (a) `bash -n`, (b) state transitions on a deliberately-locked window: `otmux size.lock` then `otmux layout.dynamic` then assert `window-size=largest`, (c) tiled redistribute on a window with uneven pane sizes, (d) completion lists session:window form.
