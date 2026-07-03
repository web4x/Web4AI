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

---
## PO QA GATE — PASS (oosh-po@MacStudio, inspected the diff)
Commit **b2dd551** on `test/macos.latest` (cherry-pick of dev 7059a36):
- Scope = `otmux` only, 13+/2−, zero unrelated churn.
- `otmux.pane.capture` body **byte-identical to dev@7059a36** (verified via diff — IDENTICAL); `-p` + awk trailing-blank strip + `tail -n`, NO `-S`. `bash -n` OK. Doc-comment updated (self-documenting).
- Authorship/message preserved by cherry-pick; never-rebased.
Expert side ACCEPTED. **Co-confirm still required = tester independent-verify below (the gate is the tester's independent commit, never expert self-test).**

## Tester subtask (oosh-tester ooshTeam:0.3) — INDEPENDENT verify on macos.latest
Mirror the dev-side gate (#37 tester 1c5a4e8: negative-control fence + local A/B + interior-blank) but run it on **THIS branch (`test/macos.latest`) / THIS box (MacStudio)** — the port could interact with macos.latest divergence, so re-prove locally:
1. **Local A/B** on a redrawing scratch pane (`while true; do clear; echo MARK-$RANDOM; sleep 1; done`): NEW `otmux pane.capture` (`-p`) returns the CURRENT MARK line; the OLD `-S` form returns blank/stale. Prove the delta.
2. **Interior-blank preservation**: capture content with blank lines *between* text → interior blanks kept, only trailing padding stripped (the awk contract).
3. **Negative-control fence**: a case that SHOULD read blank still reads blank (no false content).
4. Commit your test as the independent gate; report hash here. Do NOT rely on the expert's bash -n / awk-proof — that's expert self-check, not the gate.

---
## TESTER REPORT-BACK — oosh-tester@MacStudio (ooshTeam:0.3), 2026-07-04 — INDEPENDENT GATE GREEN
**Commit (my OWN gate):** `a6a98dc` on `test/macos.latest` (pushed origin) — `test/test.otmux` T-CAPTURE-BRIDGE block (89 insertions). Independent of the expert's `bash -n`/awk self-check.
**Pre-checks (measured):** HEAD `b2dd551`, tree clean (only untracked `macos/`); active working-tree `otmux pane.capture` command = `capture-pane -t "$target" -p` — **no `-S`**.
**Ran on THIS box/branch** via `test.suite run otmux 1 T-CAPTURE-BRIDGE` → **4/4 GREEN**:
- **T-CAPTURE-BRIDGE-1 (fence):** pane.capture command carries no `-S`. Negative-control: same fence flips **RED** on the pre-b2dd551 `-p -S "-${lines}"` form → real gate, not a tautology. ✅
- **T-CAPTURE-BRIDGE-2 (static A/B parity):** `otmux pane.capture` **==** raw `tmux capture-pane -p` oracle (trailing-blank-stripped, `tail N`), no blank/stale. ✅
- **T-CAPTURE-BRIDGE-3 (interior blank):** interior blank between `CAP-B` and `CAP-D` preserved (only trailing padding stripped — the awk contract). ✅
- **T-CAPTURE-BRIDGE-4 (REDRAWING-pane delta — decisive local repro):** scratch pane `while true; do clear; echo REDRAW-MARK-$RANDOM; sleep 1; done`. NEW `-p` → `REDRAW-MARK-24735` (live); OLD `-S` form → **`[]` blank**. Asserts (a) fix reads live redrawing content, (b) NEW≠OLD → fix is **not a no-op**. ✅ This is the exact desync that blanked `-S` and produced the trainer's phantom "broken pane".

**pane.history** (off-screen) untouched by the fix — separate function, no regression.
**F-T20 discipline:** oracle = raw `tmux -p` + explicit render sleep, so empty==empty cannot pass (the lie-instrument trap that fooled the first inline A/B on the dev side).
**Verdict:** forward-port `b2dd551` INDEPENDENTLY VERIFIED on macos.latest. All acceptance boxes satisfiable — over to PO co-confirm of my commit `a6a98dc`.

## PO QA — tester gate CODE inspected (a6a98dc) = REAL independent gate ✓
`test/test.otmux` +T-CAPTURE-BRIDGE (4 subtests), inspected by oosh-po:
- T-1 FENCE: comment-stripped grep for `-S` on pane.capture cmd; negative-control (RED on pre-b2dd551).
- T-2 A/B: wrapper == raw `tmux -p` oracle (non-blank + parity).
- T-3: interior blank preserved (awk d>b+1), trailing stripped.
- T-4 DECISIVE: redrawing pane — new `-p` reads live MARK, old `-S` stale, **+ no-op guard NEW!=OLD** (bug real & resolved).
- Skip-guards (no-tmux) + session cleanup present. Commit asserts measured GREEN 4/4.
Not a stub — genuine independent co-confirm mirroring dev gate 1c5a4e8 + decisive redraw delta. **PO code-satisfied. #39 flips DONE on SM's tester green+idle confirm.**

## ✅ #39 CLOSED — macos.latest SEALED (oosh-po@MacStudio, SM-co-confirmed tester green+idle)
Chain: expert **b2dd551** (cherry-pick of dev@7059a36, byte-identical body) → PO diff-gate PASS → tester independent **a6a98dc** (4/4 GREEN, real gate) → SM confirms tester green+idle. All acceptance boxes met. Both dev (7059a36) and macos.latest (b2dd551) now carry the `-p` bridge-reliable pane.capture. Remaining sibling = **#38** (WODA.prod dev checkout still buggy `-S`).
