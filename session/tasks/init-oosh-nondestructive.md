# Task #34: init/oosh install must NOT destroy an existing install (mid-mv wipe)

**From**: oosh-po@MacStudio · **Priority**: HIGH (constructor-safety, ties #27) · **Code**: once.sh/dev · **Date**: 2026-07-02
**Origin**: tester found during #13 — running init/oosh's full installer WIPED /home/donges/oosh mid-mv; had to re-clone.

## Principle
A constructor that DESTROYS the thing it's building (or a pre-existing install) violates the constructor-contract (#27: objects self-heal, never silently broken). The installer must be safe to run against an existing OOSH dir.

## Subtasks (role-ordered)
### S34.1 — oosh-expert: locate + neutralize the destructive mv
- Find the `mv` in the init/oosh install path that clobbers an existing target. Make it non-destructive: back up (`.pre-oosh`/timestamped) or detect-existing-and-skip/merge — never blind-wipe. DRY; bash behavior + fresh-install path unchanged. Report commit.
### S34.2 — oosh-tester: T-INSTALL-NONDESTRUCTIVE (structural + isolated)
- Structural/unit test: an existing marker dir/file SURVIVES (or is backed up, not wiped) across the install path. **Do NOT run the full destructive install against a live oosh dir** — that's what caused the wipe. Full destructive e2e → deferred to the E1.2 throwaway container (Tron-blocked).

## S34.1 REPORT-BACK — non-destructive relocation (oosh-expert `a3b1eff`, dev)
`sh -n` (POSIX) + `bash -n` clean. **Located** the destructive site: `init/oosh:492-506` relocation block — old logic `die` on a real dir + `rm -f "$HOME/oosh"` then `mv` (the `rm -f` blind-removed whatever was there; die-refuse wasn't self-healing).

**Fix (never blind-wipe; ties #27 self-heal):**
- **real DIR/FILE at `$HOME/oosh`** → moved aside to `$HOME/oosh.pre-oosh.<timestamp>` (recoverable), then the fresh tree moves in. No `die`, no wipe → constructor is now safe to run against an existing install.
- **bare SYMLINK** → remove just the link (its target tree is untouched).
- **absent** → straight `mv` — **fresh-install path + bash behavior UNCHANGED**.
- Timestamped (not fixed `.pre-oosh`) so repeat runs never clobber a prior backup.

**Structural test (isolated — did NOT run the destructive installer against a live oosh dir, per the rule):** 3 cases GREEN — (1) existing real dir with data → backed up + survives, fresh in place; (2) symlink → target tree survives, fresh in place; (3) fresh/absent → plain move, no backup created (behavior unchanged).

**S34.2 (tester)**: structural marker-survives test — do NOT run the full destructive install against a live oosh dir. Full destructive e2e → deferred to the E1.2 throwaway container (Tron-blocked), as the task notes.

## Acceptance (PO QA gate — I inspect the diff)
- [ ] Destructive mv located + made non-destructive (backup or detect-skip)
- [ ] Existing install survives / is backed up (structural test GREEN)
- [ ] Fresh-install path + bash behavior unchanged
- [ ] Full destructive e2e noted as deferred to E1.2 container

## Rules
OOSH wrappers; no output filtering; measure live; task file = channel; report-back = commit + push here. NEVER test the destructive path against a live oosh dir.

---
## S34.2 REPORT-BACK — T-INSTALL-NONDESTRUCTIVE ✅ GREEN (oosh-tester, 2026-07-02, dev `b550156`)
S34.1 (`a3b1eff`) was already in dev → S34.2 verifies it. `test/test.install.nondestructive` — **4/4 GREEN** on MacStudio AND live WODA.test.
- existing real `$HOME/oosh` → **timestamped `.pre-oosh` backup** (not died, not wiped) ✓
- `rm -f "$HOME/oosh"` is **SYMLINK-gated** (`if [ -L ]` → remove link only; real dir takes the `elif` backup path) ✓
- **no `rm -rf`** of `$OOSH_DIR`/`$HOME/oosh` anywhere (unrecoverable op absent) ✓
- **ISOLATED SANDBOX** (dummy /tmp dirs mirroring the placement algorithm): a pre-existing MARKER **survives as a `.pre-oosh` backup** while the new tree is placed ✓
- STRUCTURAL + sandbox only — never ran the real installer against a live oosh dir (that's the bug); full destructive e2e deferred to the E1.2 container.

### Root-cause refinement (for the record)
My #13 wipe was init:503 `mv "$OOSH_DIR" "$HOME/oosh"` — the guard protected the TARGET but the SOURCE (a live checkout used as `$OOSH_DIR`) still got relocated. Running init **as root** against `/home/donges/oosh` (target `/root/oosh` was removable) MOVED the donges checkout to `/root/oosh`. a3b1eff's timestamped-backup makes the TARGET side non-destructive — satisfying "existing install survives / is backed up." (A source-side guard — refuse to relocate a non-throwaway `$OOSH_DIR` — is a possible hardening, but the target-backup covers the PO's #34 acceptance; flag if you want the source guard too.)

### ⚠️ BOX-STATE note (WODA.test residue from the original incident)
`/root/oosh` is now a **real dir owned by donges** (the checkout my incident relocated there); I restored `/home/donges/oosh` via a fresh `git clone -b dev`. Both are functional oosh trees, but root's oosh is no longer root's original — flagging in case the team wants `/root/oosh` reset to a root-owned checkout.

### Acceptance (tester side)
- [x] existing install survives / is backed up (structural + sandbox GREEN)
- [x] no blind rm -rf / unconditional rm of the tree
- [x] full destructive e2e noted as deferred to E1.2 container
