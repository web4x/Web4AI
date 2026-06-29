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
- S1 tester (suite results): **GATE NOT MET — 4/7 suites RED, 83 fails. S3 STAYS BLOCKED.** Run on dev from ooshShells:0.0 (live tmux). Per-suite: `config` 56/55/1🔴 · `c2` 25/26/2🔴 · `otmux` 149/131/25🔴 · `hiveMind` 456/404/55🔴 · `prefix-idempotent` 4/4/0🟢 · `current-target` 5/5/0🟢 (live case-5 fired) · `no-tmuxpane` 6/6/0🟢. **The 3 NEW clean-boot guards are GREEN** — sprint's BUG7/9/A/B/C-ext/FEAT8 deliverables verified. The 4 legacy reds are filed in detail at `session/tasks/s1-suite-failures.md` with real-vs-environment triage: hiveMind 55=REAL (0 env errors — missing completions, role prompts, doc drift, raw-tmux×2, JSONL×35, fork-UUID×3, consistency.audit rc=30); otmux 25=MOSTLY REAL (copy-pipe binding, tree session-filter, send delegation/isClaudeCode) + live-host lock sensitivity + 1 is MY OWN bad T-UNLOCK-KILLS assumption (hook-based locking, test needs fixing); c2 2=REAL (functions.get found 0, both contexts); config 1=ENV-SENSITIVE (T-NOLOSS-1 config.save var-harvest — passed non-tmux, BUG3 inert-save likely changed semantics — needs config-expert confirm intended-vs-regression). **Caveat**: legacy suites were NOT in expert's "all green" scope (expert ran new guards only) — most look PRE-EXISTING debt surfaced by full-suite run, not sprint regressions. Expert/PO must triage which (if any) are sprint-introduced before S3. NOT marking green.
- S2 architect (doctrine reconcile + hash): **DONE `6540254` (dev, once.sh)**. Reconciled `docs/first-principles.md` in 2 places that both listed `source xyz.env` as permitted-in-env-files. NEW wording: (1) *Pure-state persistence* — "Config/env files hold STATE ONLY — `export`/`declare`, comments, blanks. No logic, and **no `source` lines: an env file never sources another env file.** The bootstrap (`this`) owns the source chain — it sources `user.env` and the env files that belong to the chain (`oosh.env`, `log.env`) in order. … a stray `source` in an env file is the exact pollution `config.validate` rejects." (2) *Only env files are sourced; scripts are invoked* — narrowed parenthetical to "(`export`/`declare` only, no logic, no `source` lines)" + documented the ONE bootstrap exception (`.bashrc → this` sources the env chain, never another script). Kept the `9e4915c` no-source-of-scripts rule intact. Conflict closed: env files = pure exports only; `this` owns the chain.
- S3 expert (macos.latest parity + hash): **PLAN PREPARED — HOLDING for S1 green (gate).** Direction: `git merge origin/dev` → `test/macos.latest` (merge, not cherry-pick). Merge-base `d45031a`; dev ahead 893, macos.latest ahead 4. **Conflict scan** (`git merge-tree` in-memory, 3-way): claudeCode/hiveMind/otmux are "changed in both" but **0 actual conflict markers** → clean auto-merge predicted (disjoint regions). **macos.latest-only commits preserved (auto-merge in):** `04b54a5` send Escape-before-Enter (SSH TUI), `9971ad7` parameter.completion.client, `3249104` team.sweep monitor.switch, `2cca6f8` MVC adoption. **Propagating from dev:** BUG1-9, A, B, C-ext, FEAT8 — key hashes 4bdd948(BUG1) 37e16f7(BUG2) af3a3f7(BUG3) d40a005(BUG5) 3fd419b(BUG6) [6480f78,350e3e7,d74e354,a20d0d7,a5f709d](BUG7) 4c52e24(BUG9) 9937799(A) c82fa31(B) 9ff5343(C-ext) 615918c+76bb8ef(FEAT8/D) + sweep/model/log fixes. **On S1 green:** merge → push → verify method-surface + MVC ref counts identical on both branches → run guards (no-tmuxpane 6/6, prefix-idempotent, current-target) on macos.latest → record merge hash + parity here. Will NOT push before tester declares dev GREEN.
