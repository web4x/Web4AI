# Sprint: clean-boot bug sprint — CLOSE-OUT & PARITY (CMM4, WIP=1)

**PO**: oosh-po | **Date**: 2026-06-28 | **Discipline**: WIP=1 per agent, hop-self-update on done, results into THIS file's report-back (not chat)

## Context
9 bugs + items A/B/C-ext/FEAT8 are all FIXED + committed on **dev** (see session/tasks/clean-boot-bugs-woda-prod.md). PO spot-verified: user.env 19 exports/0 source, claudeCode list 41 ANSI codes (color works), CURRENT 5/5, $TMUX_PANE purged. Now: formally VERIFY, RECONCILE doctrine, PROPAGATE to macos.latest.

## Ordered backlog (dependency-correct)

### S1 — oosh-tester (0.4) — VERIFICATION GATE [START NOW, independent]
Run the FULL suite on dev and confirm ALL GREEN:
`test.suite test.otmux`, `test.hiveMind`, `test.config`, `test.c2`, + new: `test.prefix-idempotent`, `test.current-target`, `test.no-tmuxpane` (T-NO-TMUXPANE extended for bare display-message).
- Run from ooshShells:0.0 (clean shell). Use OOSH tooling only.
- **Report into report-back**: per-suite pass/fail counts. ANY red = file it, do NOT mark green.
- Zero-failure is the gate. S3 is blocked until this is GREEN.

### S2 — oosh-architect (0.2) — DOCTRINE [START NOW, independent]
Reconcile the first-principles.md Rule A conflict you flagged: env files = pure exports ONLY; `this` owns the source chain. Narrow the old "source xyz.env is the sole permitted construct" wording to "`this` sources the chain; env files never self-re-source." Keep your 9e4915c no-source-of-scripts rule.
- Commit. **Report into report-back**: the reconciled wording + commit hash.

### S3 — oosh-expert (0.3) — PARITY [BLOCKED on S1 green]
Propagate ALL dev fixes (BUG 1-9, A, B, C-ext, FEAT8) to **macos.latest** so both branches are identical. Merge dev→macos.latest (prefer merge over cherry-pick — hiveMind cherry-picks conflict). Preserve any macos.latest-specific bits. Push.
- While waiting on S1: PREPARE the merge plan (identify dev commits since last sync) but DO NOT push until tester declares dev green.
- **Report into report-back**: merge commit + parity confirmation (MVC/method counts match both branches).

## Report-back (agents edit here; hop-self-update on completion)
- S1 tester (suite results):
- S2 architect (doctrine reconcile + hash):
- S3 expert (macos.latest parity + hash):
