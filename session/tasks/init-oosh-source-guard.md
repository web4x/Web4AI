# Task #35: init/oosh SOURCE-guard — don't relocate a live non-throwaway OOSH_DIR

**From**: oosh-po@MacStudio · **Priority**: normal (fully closes the #34 class) · **Code**: once.sh/dev · **Date**: 2026-07-02
**Origin**: tester root-cause refinement in #34 — the actual #13 wipe was the SOURCE side: a live checkout used as `OOSH_DIR` got relocated (`mv "$OOSH_DIR" "$HOME/oosh"`), emptying its original location. #34/`a3b1eff` fixed the TARGET side (existing `$HOME/oosh` → backup). This closes the SOURCE side.

## Principle (constructor-contract, #27)
The constructor must not destroy the SOURCE it was invoked from. If `OOSH_DIR` points at a live/non-throwaway working checkout (not a fresh clone the installer made), relocating it away is destructive.

## Subtasks (role-ordered)
### S35.1 — oosh-expert
- At the relocation (`mv "$OOSH_DIR" "$HOME/oosh"`), detect when `OOSH_DIR` is a live/non-throwaway checkout (e.g. a git working tree with a real remote / uncommitted work, or simply ≠ the installer's own fresh clone dir). If so: **copy-not-move** (preserve the source) OR refuse-with-clear-warning, rather than `mv`. Fresh-clone path (installer made the dir) unchanged → plain `mv`. Keep it POSIX-safe (this runs in init/oosh's bash phase, but stay clean). Report commit.
### S35.2 — oosh-tester → T-SOURCE-GUARD
- Structural + sandbox: a live-checkout SOURCE survives the relocation (copied/refused, not emptied); a throwaway/fresh-clone source still relocates normally. Do NOT run the destructive installer against a live dir. Full e2e → E1.2 container.

## Acceptance (PO QA gate — I inspect the diff + co-confirm on tester's OWN commit)
- [ ] Live/non-throwaway OOSH_DIR is preserved (copy/refuse), not emptied by mv
- [ ] Fresh-clone install path unchanged
- [ ] T-SOURCE-GUARD independent test GREEN (structural+sandbox)
- [ ] Zero regression; constructor-contract honored (#27)

## Rules
OOSH wrappers; no output filtering; measure live; task file = channel; report-back = commit+push here; NEVER test the destructive path against a live oosh dir. Sign-off is on the TESTER's independent commit, not the implementer self-test.

---
## S35.2 PREP — T-SOURCE-GUARD harness built + baseline (oosh-tester, 2026-07-02, WODA.test/dev)
`test/test.source.guard` written + verified as a working detector (holding the GREEN commit until S35.1, per pattern).

### Baseline — S35.1 NOT yet landed
init/oosh relocation (`mv "$OOSH_DIR" "$HOME/oosh"`, ~L513) still blind-moves the SOURCE — no live-vs-throwaway detection. Structural fence currently **RED** (correctly flags the gap) → flips GREEN when S35.1 adds the guard.

### Intel for S35.1 (measured) — how to tell throwaway from live
- **Throwaway source = the installer's own fresh clone**, always under a `mktemp -d`: init:289 `_tmp="$(mktemp -d)"` → `git clone … "$_tmp/once.sh"`; init:431 `_oosh_tmp_clone="$(mktemp -d)"`. So a throwaway `$OOSH_DIR` lives under a temp/`/tmp` path (and/or equals the tracked `_oosh_tmp_clone`).
- **Live source = a persistent checkout** (e.g. `/home/donges/oosh`, a git work-tree not under mktemp). Cleanest detections: `case "$OOSH_DIR" in "$_oosh_tmp_clone"|/tmp/*) mv ;; *) cp -a / refuse ;;` OR `git -C "$OOSH_DIR" rev-parse --is-inside-work-tree` + not-a-temp.
- Recommend **copy-not-move** for live (source preserved, install proceeds) over refuse — keeps the fresh-host bootstrap working even if someone points it at a real checkout.

### Harness (ready; commits GREEN when S35.1 lands)
- **(A) STRUCTURAL fence**: relocation must guard a live SOURCE (copy/refuse) not blind-mv. RED now (proves detection) → GREEN post-fix. Flexible pattern (accepts `cp -a`/`_oosh_tmp_clone`/`/tmp` case/`is-inside-work-tree`/refuse).
- **(B) ISOLATED SANDBOX** (the acceptance ORACLE, both GREEN now — locks the contract): LIVE checkout source (has .git+MARKER, persistent) → **SURVIVES at origin** AND placed at $HOME/oosh (copied); THROWAWAY clone (under a temp root) → **RELOCATES** (moved; fresh path unchanged). Touches no real oosh dir.
- STRUCTURAL + sandbox only; full destructive e2e → E1.2 container. My OWN committed test is the gate (not the expert self-test).

---
## S35.1 REPORT-BACK — source-guard (oosh-expert `34c44cb` + refine `10ccc7e`, dev)
`sh -n` (POSIX) + `bash -n` clean. Closes the SOURCE side of the #34 class; combined the tester's temp-path intel with a same-process provenance flag.

**Throwaway (safe to MOVE) — two signals, OR'd:**
- `_oosh_fresh_clone=1` — set right after the line-486 clone (installer cloned into an empty OOSH_DIR THIS process).
- `OOSH_DIR` under the temp root — `case … in "$TMPDIR"(trailing-/ stripped)/*|/tmp/*|/var/tmp/*|/var/folders/*)`. This is the signal that SURVIVES the re-exec (the flag can't cross `exec`), catching the mktemp pre-clones (init:289 `_tmp`, init:431 `_oosh_tmp_clone`) the tester named.

**Live/non-throwaway (persistent checkout, not under temp) → `cp -Rp "$OOSH_DIR" "$HOME/oosh"`** — source left intact + clear warning. Never relocates a live tree → the #13 root cause can't recur.

**Refine `10ccc7e` (measure caught 2 bugs):** (1) `$TMPDIR` usually has a trailing `/` → `"$TMPDIR"/*` became `//*` and matched nothing → strip it (`%/`); (2) macOS mktemp lands under `/var/folders` (=`$TMPDIR`), not `/tmp` → added `/var/folders/*` + `/var/tmp/*`.

**Structural test (isolated — no destructive install against a live dir):** 3 cases GREEN — (A) mktemp throwaway under temp → MOVED (source gone); (B) live persistent checkout (non-temp) → COPIED (source `wip` survives + copy in place); (C) same-process fresh clone flag=1 (non-temp drag-drop) → MOVED.

**Tester:** S35.1 refined form landed `10ccc7e` — your fence should flip GREEN; sandbox oracle (live-survives-via-copy / throwaway-relocates) matches. Sign-off on your independent T-SOURCE-GUARD commit.

---
## S35.2 REPORT-BACK — T-SOURCE-GUARD ✅ GREEN (oosh-tester, 2026-07-02, dev `1e4d735`)
S35.1 (`34c44cb` + `10ccc7e`) verified. `test/test.source.guard` — **3/3 GREEN** on MacStudio AND live WODA.test. (The prep fence was RED on the blind mv; it flipped GREEN exactly when your guard landed — the independent gate.)
- **(A) STRUCTURAL fence**: the relocation now classifies the source (temp-root path → move; live checkout → `cp -Rp`) — present ✓.
- **(B) ISOLATED SANDBOX** (mirrors your landed algorithm verbatim — TMPDIR-stripped / /tmp / /var/tmp / /var/folders → move; else `cp -Rp`):
  - **LIVE checkout source SURVIVES** — a `.git`+MARKER checkout placed OUTSIDE any temp root (under `$HOME`, else the real temp-root detection misclassifies it) is COPIED: MARKER survives at origin AND appears at `$HOME/oosh`. ✓
  - **THROWAWAY clone RELOCATES** — a source under a real `mktemp` temp root is MOVED (origin gone), fresh-install fast path unchanged. ✓
- Sandbox subtlety worth noting: a hermetic sandbox from `mktemp -d` is itself under `/tmp`/`/var/folders`, so the "live" case MUST use a non-temp root ($HOME) or the correct detection would (rightly) call it throwaway — the test does this.
- STRUCTURAL + sandbox only; never ran the installer against a live oosh dir; full destructive e2e → E1.2 container.

### Acceptance (tester side)
- [x] live/non-throwaway OOSH_DIR preserved (cp -Rp), not emptied
- [x] fresh-clone install path unchanged (still mv)
- [x] T-SOURCE-GUARD independent test GREEN (structural + sandbox), on my OWN commit `1e4d735`
- [x] full destructive e2e deferred to E1.2 container

**#34 class fully closed** — TARGET side (#34/a3b1eff) + SOURCE side (#35/34c44cb+10ccc7e), both independently fenced.

---
## ✅ PO QA-GATE SIGN-OFF — oosh-po@MacStudio, 2026-07-03 — #35 CLOSED (PASS)
Diffs inspected myself (F44), co-confirmed by the tester's OWN independent commit (my #34 standard — never expert self-test):
- Expert S35.1 (dev init/oosh L487-537, 34c44cb+10ccc7e): classifies OOSH_DIR — no-.git/temp-root = throwaway `mv`; existing checkout = `cp -Rp` (source preserved, `die` on fail) + clear message. ✓
- Tester S35.2 (dev `1e4d735`, test/test.source.guard): 3/3 GREEN both envs — fence (relocation detects live-vs-throwaway) + sandbox (LIVE source survives, copied) + sandbox (throwaway still relocates). Real RED→GREEN TDD, tester's own commit. ✓
**#34-DESTRUCTIVE-CLASS FULLY CLOSED**: target-side #34 (a3b1eff, backup-not-wipe) + source-side #35 (copy-not-move a live checkout). dev only; no promote.
