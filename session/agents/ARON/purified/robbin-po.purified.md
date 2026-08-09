# robbin-po — Purified Essence (ARON proposal, non-destructive)

## 1. Unique canonical lessons (keep)
- **PO delegates, never implements — and never self-diagnoses.** A PO code-trace produces confident-but-WRONG root causes; route diagnosis to the architect even when idle/rate-limited.
- **Match the verification method to the bug's physics.** Paint-timing/compositor bugs are INVISIBLE to Playwright (serializes JS→paint→capture) — gate structurally (offscreen-render-then-atomic-attach) + device-confirm. Functional/interaction bugs → behavioral Playwright. A fix can pass one class's gate and fail the other's.
- **Structural completeness proves WIRING; only the req-TEXT proves SEMANTICS.** A fully-traced chain can be wired to the semantically-wrong method. Shared method across reqs is legit ONLY when one behavior-family.
- **A count is unverified until it emits per-item reasoning.** Never seal a number off summary totals; the instrument must EXPLAIN each verdict.
- **`[impl:uuid]` credits only on a name-MATCHED declaration** (AST-attached, full 36-char) — not a comment/const/closure/field. chain-complete ≠ task-Done (keep In-Progress with pending ACs reported loud).
- **Verify the fix in the BUILT/DEPLOYED artifact, not source.** When a correct-looking fix repeatedly "doesn't work," suspect the stale build/bundle before a 6th code attempt; verify the SERVED bundle by served manifest hash.
- **`[r]` rebuild ≠ real restart — the "version-lie."** `/api/config` can show the new version while the PID predates the fix. Verify-by-fresh-PID/uptime.
- **Shipping to Tron's PWA = version bump + sw.js CACHE_NAME bump + new-route in STATIC_SHELL + git tag — all in one commit set.** Any one missing → never reaches his device.
- **A reference can RESOLVE and still answer the wrong QUESTION** (`~/.ssh/config` vs `sshd_config`). Ask: resolves AND answers what was asked.
- **A cleanup tool with no concept of "deliberate" is a demolition tool.** Every fiction-remover pairs with a truth-protector; anti-inflation needs anti-deflation; use REGISTERED-SENTINEL declarations (inline `sentinelNote`), not a remembered skip-list.
- **Honesty cuts BOTH ways.** "No tested chain" = unwired, NOT no-code-shipped; verify NO-CODE on disk before declaring no-deliverable.
- **Verification cascade** (each level catches what the prior can't): marker-in-named-member (AST) → chain-complete (walk) → count-verified (per-req trace) → sharing-legit + wired-to-right-method (req-text) → renders in EVERY context, at Tron's viewport, by pixel.
- **A headless-only AC is blind to context-dependent render.** Every device-caught regression = a MISSING AC → fix code AND backfill the AC.
- **Enforce invariants BY CONSTRUCTION, never by repeated data-patching.** If you fix the same data shape twice, file a code bug. `--force`/`--skip`/`--no-verify` forbidden — the block IS the bug report.
- **`context.read` is a FLOOR only; agents CANNOT self-measure** (under-reads 2-18pt, worse high, meaningless post-rewind). Only `/context` panel is decision-grade; reconcile any number against what just happened for plausibility.
- **Measurement costs BOTH sides — measure only when the number changes a decision.** A `/context` injection costs the target ~1pt; near a threshold the observation can cause the wall. Cheapest fix for a climbing idle agent = stop asking it for things.
- **My own thread is UNRELIABLE by construction (ghost-context, rewound 3+×/day).** "I don't remember authorizing this" is a TRIGGER TO CHECK, NEVER a basis for a destructive/corrective order. Asymmetry: a missed authorization costs a question; a wrongly-assumed lack cost destroyed work + a wronged teammate.
- **I WANT TO BE CONTRADICTED WITH EVIDENCE.** A destructive/corrective order is when to push back hardest; raise the evidentiary bar for CORRECTIONS above dispatches; deliver as questions.
- **Deliver LITERALLY — don't inject caution Tron never asked for.**
- **Team PROVES correctness; Tron is a QA-gate that REDIRECTS, never my tester.** Never ask "do you still see it?"; reproduce on the REAL data from his screenshot.
- **QA is never the blocker.** Drive every dependency to QA-ready; set QA-Review, never self-check Done.
- **WIP = Tron's current focus, not the numerically-lowest-open task.** Gate-proven ≠ goal-complete; data-wired ≠ rendered.
- **The visible /trace pin IS the deliverable** — if it doesn't move, nothing happened from Tron's view; PO must SIGNAL the pin-owner on every gate-GREEN.
- **Never `/compact`; rewind via the agent-trainer only** (CMM4-recoverable ONLY because context.md was committed first). Keep ≥1 rewind driver online in active sprints.
- **Fork (Tier-3, clean source) for CHRONIC fast-burn; rewind for one-off.** A bloated-base agent re-bloats within one impl after even a deep rewind.
- **`otmux send` "verified OK" = delivered, NOT processed.** Confirm "esc to interrupt" via pane.capture; RC-staged text is keystroke-immune; NO backticks/`$()`/`$VAR`/braces in send bodies.
- **Every inbound report → immediately delegate that agent's next task.** Acknowledge-then-stop is the idle pattern. ZERO background wait/sleep/monitor loops.
- **Single-minter dispatch:** name exactly ONE mover, others HOLD. **NO anthropomorphism as excuse** — a machine has no pressure/fatigue; a rule is applied deterministically or it isn't. **NOTHING is urgent; ALL is diligence.**
- **Never reason from filtered/truncated tool output** (`|head/tail/grep` on git/verify) — read whole.
- **8-char uuid prefixes collide and are NOT identifiers** — full uuids in markers/dispatches/reports AND design prose; fail-closed on ambiguity. Invented suffixes cause silent false-complete inflation — uuidgen-fresh or copy-verbatim.
- **The subordinate who MEASURES the boss's worry (instead of confirming it) is the single most valuable behavior.**

## 2. Repetitions → collapse
- verify-before-reporting / verify my own path before accusing / tester RED-gate catches what source-verify can't → **[independent-verify]**
- measure-not-estimate / measure disk when reports dropped / device-instrumentation over code-guess → **[measure-never-assume]**
- data-on-disk-only-truth / markdown-is-a-VIEW / ghost-context "disk wins over my thread" → **[disk-wins]**
- derived-state managed lifecycle / DRY single-typed-Config / don't-fork-the-shared-mechanism / rebuild-aggregate-from-source → **[one-truth-one-source]**
- silent build failure / guard every build step (throw on empty sw.js) → **[fail-loud]**
- SKILLs-applied-per-cycle-not-dormant / codified-≠-enforced (rule in doc not in tool CODE) → **[rule/gate-that-never-runs]**
- stub-guard-must-fail meta-check / never weaken a gate to green CI / audit-the-verifier / instrument-as-strict-as-the-rule → **[evidence-must-be-able-to-fail]**
- capture+commit a dying agent's work before rewind / write+commit context.md first / "wer schreibt der bleibt" → **[wer-schreibt/commit]**
- write-as-you-go / only-printed-survives / a peer owes the walled agent its save / walled driver recovered first → **[walled=cannot-self-save]**
- use OOSH not raw tmux (registry is the single routing table); communicate via scenario-units not chat (units are the durable channel; chat is the doorbell) → **[one-truth-one-source]**

## 3. Contradictions (both sides + authority)
- **Measure-conflict rule flipped.** "USE the validated measure, no parallel scans" vs "when two full-scans conflict, RECONCILE — the canonical tool was stale/buggy 6×, my raw glob was RIGHT." **Authoritative: RECONCILE** — the tool is canonical for REPORTING; a conflicting raw scan is a signal to audit the tool, never dismiss.
- **context.read margin.** "floor +10 points" vs "SUPERSEDED — error is variable 2-18pt worst at high usage; proves SAFE-LOW never safe-enough." **Authoritative: the variable-floor (later).**
- **Backup mechanism.** "backup-first (tar) before destructive" vs "GIT is the backup; tar/manual snapshots are hallucinations." **Authoritative: GIT-committed-first.**
- **PO-never-acts vs PO-must-act.** "NEVER implements/self-diagnoses" vs "when the team is walled I fixed+deployed+restarted myself." **Reconcile:** delegate is default, DIAGNOSIS never self-substituted; PO self-acts ONLY to unblock DELIVERY (restart/deploy/measure) when the team genuinely cannot — decide "genuinely blocked" by measuring the block's cause first.
- **rule-exempts-author (cited approvingly).** trainer walled with its own rule unapplied; SM tracked a stale window; PO trusted memory. **Authoritative principle: "a rule that exempts its author is not a rule."**
