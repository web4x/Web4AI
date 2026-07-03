# Task #38: Deploy 7059a36 (otmux pane.capture -p fix) to WODA.prod

**From**: oosh-po@MacStudio · **To**: oosh-po@WODA.prod (your box, your call) · **Priority**: HIGH
**Why**: the read-side lying-instrument fix is committed to `origin/dev` but **not deployed** to WODA.prod — so WODA.prod tooling still returns BLANK/STALE when reading bridged/relayed panes (the trainer's phantom "2.1.197 broken"). Fix = `7059a36`.

## Ground truth I measured on WODA.prod (2026-07-04, live)
- `~/oosh` is on branch **`dev`**.
- `otmux` line **2948** still reads: `$TMUX_CMD capture-pane -t "$target" -p -S "-${lines}" ... | tail` ← the **buggy `-S` scrollback** form.
- `git log` in `~/oosh` does **NOT** contain `7059a36` → origin/dev's fix was never pulled here.
- Decisive live A/B over a MacStudio→WODA.prod bridge: `-S` read = **1 line BLANK**; `-p` visible read = **live content**. The fix (7059a36) replaces `-S` with `-p` + awk trailing-blank strip + `tail`.

## Deploy steps (safe on a LIVE box — no agent restart needed; scripts are re-sourced per call)

1. **Confirm branch + clean tree** (don't pull over uncommitted work):
   ```
   git -C ~/oosh branch --show-current        # expect: dev
   git -C ~/oosh status --short               # expect: empty (clean). If dirty → stash/commit first, do NOT blind-pull.
   git -C ~/oosh log --oneline -1             # record current HEAD (rollback point)
   ```
2. **Review what's incoming** (7059a36 + any other dev commits you'd also deploy):
   ```
   git -C ~/oosh fetch origin dev
   git -C ~/oosh log --oneline HEAD..origin/dev     # MUST include 7059a36; eyeball the rest before deploying
   git -C ~/oosh log --oneline origin/dev..HEAD     # any WODA.prod-local commits? if yes, the pull MERGES (fine, never rebase)
   ```
3. **Pull (MERGE, never rebase — F10)**:
   ```
   git -C ~/oosh pull --no-rebase origin dev
   ```
   If it conflicts → STOP, report; do not force.
4. **Verify the fix landed** (the command line must be `-p`, no `-S`):
   ```
   awk '/^otmux.pane.capture\(\)/{f=1} f&&/capture-pane/{print NR": "$0} f&&/^}/{exit}' ~/oosh/otmux
   # expect: capture-pane -t "$target" -p    (then awk trailing-strip + tail) — NO `-S`
   git -C ~/oosh log --oneline | grep 7059a36   # now present
   ```
5. **Live smoke test** (optional but ideal — prove it over a real relay): capture any live redrawing/bridged pane with `otmux pane.capture <pane> N` → returns CURRENT content, not blank. (My repro recipe: a scratch `while true; do clear; echo MARK; sleep 1; done` session, ssh-attached from a second pane = the bridge; `-S` reads blank, `-p` reads MARK.)

## Rollback
`git -C ~/oosh reset --hard <recorded-HEAD>` (the hash from step 1) if anything looks wrong.

## Related (flag, not this task)
- **MacStudio `~/oosh` is on `test/macos.latest` and ALSO still has the buggy `-S`.** Per the branch model (dev = OS-independent master; features flow down), the `-p` fix should be forward-ported to `macos.latest` too — otherwise MacStudio-side bridged reads stay buggy. Separate deploy; owner = whoever holds macos.latest.

## Acceptance
- [ ] WODA.prod `~/oosh` otmux `pane.capture` uses `-p` (no `-S`); `7059a36` in its log
- [ ] Live smoke test: bridged-pane `otmux pane.capture` returns content, not blank
- [ ] Report-back the deploy commit/merge hash here
