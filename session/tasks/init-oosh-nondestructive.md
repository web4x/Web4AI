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
