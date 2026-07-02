# oosh-tester@MacStudio — learnings (reusable)

## Testing patterns (the durable ones)

### 1. Grep-only code-pattern fences for infra/hygiene bugs — NEVER execute the bug
For bugs that are about CODE SHAPE (flags, hardcoded paths, truncation, engine-edits,
duplication), assert against the SOURCE, don't run the bug. Benefits: deterministic,
platform-independent, fast, no side effects, no session-crash risk.
- Death-to-Flags (`test.no.flags`): grep method surface for `--flag` params.
- Platform defaults (`test.platform.defaults`): grep for hardcoded `/Users/Shared`.
- State order (`test.setup.server.order`): grep `oo` state-add order + check bodies.
- DRY budgets (`test.hiveMind`): count allowed occurrences of a pattern; fail if it grows.

### 2. Params-block isolation for OOSH method signatures
OOSH signature = `name() # <params> # description`. To check the PARAM surface only
(not the trailing prose, not the body), isolate the block between the 1st and 2nd `#`:
`afterHash="${line#*#}"; params="${afterHash%%#*}"`. This is why the fence ignored
otmux's `--force` when it was only in the *description*, and caught it once it became
a real `--value` comparison. Precise surface = no false positives, no misses.

### 3. Budget-tightening 1→0 as the permanent regression guard
When a violation is filed-for-triage, fence it at budget = current count (e.g. ≤1),
GREEN now; when the expert fixes it, tighten to 0. The 0-budget fence is the permanent
guard: any reappearance (even the old one) fails. Ratchet, never loosen.

### 4. Comment-aware grepping
Strip comments before asserting "no X in code": `grep -vE '^[[:space:]]*#'`. A fixed
body often has a comment literally saying "never hardcode /Users/Shared" or "old
$SUDO touch prompted" — naive grep false-positives on the very comment documenting
the fix. (Cost me a red run on both platform + no-sudo tests until I stripped comments.)

### 5. Self-contained + self-skipping tests
Tests must pass on a clean box with zero agents/machines. Gate live checks on the real
artifact existing (`[ -f states.env ] && grep -q '"user.mode.dev"'`), else `expect.pass
"skipped"`. Don't rely on `state machine.exists` (returns 0 even when absent) or
`state.find` as a standalone cmd (it's a sourced fn — parse the file directly instead).

## OOSH / environment gotchas measured live
- **OOSH_MODE is branch-derived** (`oo` re-derives `export OOSH_MODE="$branch"` on every
  source, oo:322). Un-overridable via export/`config set`/`config save` on a dev-branch
  box. To verify the *released* arm, probe the check FUNCTION directly (source oo, export
  OOSH_MODE AFTER, call `private.check.*`, read `$RESULT`) — the engine consumes exactly
  that RESULT (numeric ⇒ redirect to index, non-numeric ⇒ accept). Function-level RESULT
  == what `state next` would do. This closed F3 without a released-branch checkout.
- **`$RESULT` vs `$(result)`**: `create.result <code> <str>` → `result` echoes the CODE,
  `$RESULT` holds the STRING. For accept-vs-redirect signals read `$RESULT`.
- **sudo probes must be `sudo -n`** (non-interactive) — a bare `$SUDO touch` prompts and
  HANGS an unattended install. Failed `sudo -n` = "no sudo → defer to user band" (warning).
- **`state machine.delete` runs `oo cmd vim`** (a package install that can hang on a naked
  box) — reconcile uses a direct `rm -f` of the states data file instead (F2-safe).

## Comms / process
- **Git mailbox IS the channel** (SPRINT-COMMS): report-back = edit story line + commit +
  PUSH. otmux nudges are one-liners only. Independent co-confirm commits let the PO sign
  off on *verified* not *claimed* (PO's words re 75250dc).
- **Send to panes**: `otmux send.raw <pane> '<text>'` then `otmux send.raw <pane> C-m`
  (the `Enter` keyword silently didn't submit in the bash pane; `C-m` does). Verify with
  `otmux pane.capture` / `pane.history`. NEVER raw tmux.
- **No-rabbit-hole guardrail**: when the PO says "STOP and report if heavy", make ONE
  bounded attempt, characterize the friction precisely, STOP, and hand back a mapped plan
  — don't grind. (S5 container: proved provisioning works, mapped the 2 frictions, stopped.)
- **Measure, never assume** (TRON CMM4): process-args + pane-footer are ground truth over a
  lying session.id; a fresh `teams.save` corrected a stale snapshot uuid — proved the
  divergence was staleness, not logic.

## HARD LESSON — init/oosh is a DESTRUCTIVE installer; never full-run it on a live checkout
`init/oosh` is a REAL constructor: `mv $OOSH_DIR $HOME/oosh`, sudo re-exec, clone-to-tmp,
state-machine handoff. Running `dash init/oosh` (or `bash init/oosh`) fully — even under a
timeout — partially executes and **wiped `/home/donges/oosh`** (killed mid-`mv`). Had to
`git clone -b dev git@github.com:Cerulean-Circle-GmbH/once.sh.git /home/donges/oosh` (root
has the key) + `chown -R donges:donges` to restore the box.
- For constructor/installer tests: assert STRUCTURALLY (shebang, `dash -n` parse, re-exec
  present + ordered before dotted-fn sourcing) + prove the MECHANISM in ISOLATION (a tiny
  temp script mirroring the exact guard). Full end-to-end "reaches [oosh]" belongs on a
  THROWAWAY container (S5 naked box), never a live team checkout.
- **Restore recipe** (root): `git clone -b dev <once.sh url> /home/donges/oosh && chown -R donges:donges`.

## Mechanism-probe gotcha — exported BASH_VERSION leaks into dash → false positive
Testing a `[ -z "$BASH_VERSION" ] && exec bash` guard: the PARENT bash EXPORTS BASH_VERSION,
so `dash -c '...'` inherits it → the guard sees it non-empty → never fires → your probe
reads the inherited value and FALSELY "passes". Clear it: `env -u BASH_VERSION dash script`.
And let BASH expand its own `$BASH_VERSION` (single-quote the bash -c body / use a temp
script) — a double-quoted inner gets expanded by the launching/dash shell to empty first.

## oosh interactive shell mangles `$(...)` and `!` in sent commands
The oosh (bash+`this` dispatch) login shell intercepts `VAR=$(cmd)` as a method call
(`ERROR> "VAR=$(git" ... EPERM`) and history-expands `!`. When sending recovery/compound
commands to an oosh pane, wrap in `bash -c '...'` to bypass dispatch, and avoid `!`.

## The tester's INDEPENDENT test is the sign-off gate — not the implementer's self-test
Twice the PO signed off explicitly on MY independent test, not the expert's own verification
(#33 flags → 75250dc; #34 non-destructive → b550156). The value is a SEPARATE artifact that
exercises the property differently: e.g. #34 = a no-`rm -rf` fence + an isolated /tmp SANDBOX
that mirrors the placement algorithm and asserts a pre-existing MARKER survives as a backup.
An implementer's self-test can share the implementer's blind spot; an independent test with a
real oracle (sandbox behavior, not "I grepped my own change") is what lets a PO sign off on
VERIFIED not CLAIMED. Always build the oracle, not a mirror of the diff.

## Root-cause: when a destructive op has a guard, check WHICH SIDE it protects
init/oosh:503 `mv "$OOSH_DIR" "$HOME/oosh"` had a guard — but it protected the TARGET
(`die` if `$HOME/oosh` is a real dir) while the SOURCE (a live checkout used as `$OOSH_DIR`)
still got relocated/destroyed. My #13 wipe = running init as root against `/home/donges/oosh`
MOVED it to `/root/oosh` (target was a removable symlink → guard passed → source moved away).
The a3b1eff fix backs up the TARGET (closes #34); the SOURCE guard became a separate #35.
LESSON: "there's a guard" ≠ "it's safe." Name exactly WHAT gets destroyed, then check the
guard covers THAT object (source vs target vs sibling), not just the obvious one.
