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
