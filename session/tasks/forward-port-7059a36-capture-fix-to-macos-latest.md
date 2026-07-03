# Task: Forward-port 7059a36 (otmux pane.capture -p fix) to macos.latest

**From**: oosh-po@MacStudio (ooshTeam:0.0) · **To**: oosh-expert (ooshTeam:0.2) · **Priority**: HIGH
**Repo**: `/Users/donges/oosh` (MacStudio) · **Branch**: `test/macos.latest`

## Why
`otmux pane.capture` reads scrollback (`-S`) which returns BLANK/STALE on bridged/relayed/redrawing panes (the read-side lying-instrument bug — the trainer's phantom "broken pane"). The fix reads the VISIBLE screen (`-p`), matching raw `tmux capture-pane -p`. It is **committed + proven on `dev` as `7059a36`** (live A/B over a real MacStudio→WODA.prod bridge: `-S`=1 blank line, `-p`=live content). MacStudio's `~/oosh` is on `test/macos.latest`, which **still has the buggy `-S`** → MacStudio-side bridged reads stay broken until ported.

## Ground truth (measured 2026-07-03)
- `7059a36` (branch `dev`): `otmux` only, **13 insertions / 2 deletions** — replaces `capture-pane -t "$target" -p -S "-${lines}"` with the **visible-screen `-p`** form + awk trailing-blank strip + `tail`.
- `git branch --contains 7059a36` → `dev` only. macos.latest does NOT have it.
- Message ref: `20260704T0100Z.rewind-instrument-findings.md` (read-side sibling of s2-g).

## Your subtask (HOW — expert decides mechanic)
1. Confirm you're on `test/macos.latest`, clean tree (`git -C ~/oosh status --short`). If dirty → report, don't blind-work.
2. Locate the buggy method on macos.latest (line # differs from dev/WODA.prod — find it, don't assume):
   ```
   awk '/^otmux.pane.capture\(\)/{f=1} f&&/capture-pane/{print NR": "$0} f&&/^}/{exit}' ~/oosh/otmux
   ```
3. **Preferred: `git -C ~/oosh cherry-pick 7059a36`** (single-file surgical commit — cleanest, preserves authorship+ref). If it conflicts because macos.latest's `otmux` diverges around `pane.capture`, fall back to **re-applying the identical hunk by hand** to match `dev`'s post-fix form. **NEVER rebase (F10).**
4. Also check the sibling helpers in the same commit — `pane.capture.visible` / `pane.history` — port whatever `7059a36` touched so macos.latest matches dev exactly (`git show 7059a36`).
5. Commit on `test/macos.latest`. Report the commit hash + the awk output (proving `-p`, no `-S`) back in this file.

## Acceptance (PO QA gate — I inspect the DIFF, not just "done")
- [ ] macos.latest `otmux pane.capture` command line is `-p` (no `-S`), matching `dev`@7059a36 byte-for-byte in the method body
- [ ] `git -C ~/oosh log --oneline` shows the port commit on `test/macos.latest`
- [ ] Diff scope = `otmux` only (no unrelated churn)
- [ ] Report commit hash + awk proof here → then tester independent-verifies (separate subtask)

## REPORT-BACK — oosh-expert (PORTED `b2dd551`, pushed origin/test/macos.latest)
Mechanic: **`git cherry-pick 7059a36`** — clean auto-merge, no conflict (preserves authorship + ref; NO rebase). Pre-checks: on `test/macos.latest`, tree clean (only untracked `macos/`, not tracked churn), buggy `-S` confirmed at old line 2889, `git branch --contains 7059a36` = dev-only before port.
Scope: **`otmux` only, 13 insertions / 2 deletions** (identical to dev's 7059a36 stat). Sibling helpers `pane.capture.visible` / `pane.history` were NOT touched by 7059a36 (already `-p` / explicit scrollback respectively) → nothing else to port.
**awk proof (macos.latest, post-port)** — the only live capture-pane in the method:
```
2898:   $TMUX_CMD capture-pane -t "$target" -p 2>/dev/null \
```
`-p` (VISIBLE), NO `-S`. (Line 2891 is the doc comment that mentions `-S` describing the old bug.)
**Byte-parity**: `diff` of the dev@7059a36 method body vs macos.latest post-port method body = IDENTICAL. `bash -n otmux` = OK.
`git log --oneline -1` → `b2dd551 otmux pane.capture: read VISIBLE screen (-p) not scrollback (-S) …` on `test/macos.latest`.
PO QA gate: diff is otmux-only, method body matches dev byte-for-byte — ready for your inspection + tester independent-verify.

## Note
This is a bug-fix cross-port (dev→macos.latest), not a feature promote. Branch model (features flow macos.latest→dev) still holds for features; a correctness fix must exist on BOTH.
