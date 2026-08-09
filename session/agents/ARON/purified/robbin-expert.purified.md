# robbin-expert — Purified Essence (ARON proposal, non-destructive)

## 1. Unique canonical lessons (keep)
**Chain / marker crediting**
- `[impl:uuid]` credits by the marker's HOST-member name-matching the label's method-token — the unit's own name is irrelevant. Marker must sit ADJACENT-ABOVE the named decl; any intervening decl steals the strict-AST bind.
- A Method with two impls (refCount>1) never credits until de-duped to one. To credit a NEW Method off a SHARED Impl, put the logic INLINE in the marker-bearing body (0 new markers); if a minted unit names an inline decl, EXTRACT to match rather than force a mismatched marker.
- `// [impl:uuid]` in code; bare ` * [impl:uuid]` outside a real JSDoc block crashes esbuild. labelMethod must skip annotation-refs (BUG\d, T-nnn) — a marker requires real complete code behind it (never fabricate for partial/deferred).
- A bug's "family" = the views that RENDER (call) the defect, not every view that DEFINES it; fix live call-sites, flag dead copies for separate DRY cleanup.

**Deploy / runtime topology (Web4RawBin)**
- Version SOURCE = the config-singleton unit; build.mjs writes package.json FROM it (generated derivative) — never bump directly. REBUILD ([r], client-only) ≠ RESTART; `/api/config` reads package.json per-request → deploy CONFOUND. Prove a restart by PID-change + behavior probe, never the version string.
- Client bundles go live from disk without restart, but server.ts ROUTES stay STALE until restart — curl the ACTUAL new route; batch server.ts changes under one restart. Native addons (node-pty) built for the SERVER's node ABI.
- `otmux`/tmux `send` interprets backticks/`$()`/`<>`/`#{}` even in double quotes — keep text plain. otmux uuids embed colons; use `refUuid(ref)`, never `split(':')[1]`.

**Data / identity architecture**
- Federation transfers a REFERENCE not payload; never mint a foreign identity as a local profile (local-born vs remote = remint, not noop). Shared/deduped entity → two-tier key (authoritative domain + recall nameKey); present-but-unmatched key = positive proof of distinctness → mint distinct.
- Runtime `data/*.json` is gitignored, live, needs restart — never committed; only scenario/alt-index is the git layer. Identity surgery = the server's OWN non-destructive consolidate (redirectTo/consolidatedFrom), never deletion; dedupe-MERGE never overwrite. Boot-sweep/reap orphans for any external resource a process owns (tmux sessions outlive a node crash).

**iOS / rendering**
- Inline `<svg>` beats `<img src=svg>` for zoom (vector re-rasterizes crisp). An iOS `resize` listener that recomputes scale IS the snap-back bug — preserve tx/ty, never recompute scale. Fire-and-forget logging drops high-frequency events (iOS throttles iframe fetch) — never conclude "event didn't fire" from log absence.

## 2. Repetitions → collapse
- Source-verify before every deploy/"renders" claim; verify at the SURFACE that actually reads (a deriver fix is dead if the serve path reads a frozen cache); GATE-BEFORE-DEPLOY, Tron is NOT the tester → **[independent-verify]**
- Measure the target/assumption on 2-3 samples / `wrote:0` before theorizing or bulk-mutating; DRY-RUN first → **[measure-never-assume]**
- Measure the AUTHORITATIVE layer (runtime store for identity, not the scenario mirror); name which layer rules; CMM4 task-file/scenario-unit = single source, chat = pointers; `.data` drives state → **[one-truth-one-source]**
- Post-rewind: measure the WORLD, trust disk, verify working-tree==HEAD before build/restart; the rewound thread's assumptions are the stale thing → **[disk-wins]**
- Any vacuous/empty/null/wrong-type/0 guard must REFUSE+name ([[false-low-worse-than-absent]]); no silent try/catch swallow; never render a raw UUID → **[fail-loud]**
- Encode the AC's literal example as a harness assertion; never bulk-generate units without a real marker (322 fake deleted) → **[evidence-must-be-able-to-fail]**
- The `[impl]`/`[test]` gate was NEVER CI-enforced (stale hardcoded ROOT, docs-only); a comment asserting an unenforced invariant = "DRY-CLAIMED-NOT-ENFORCED" → ENFORCE with a gate → **[rule/gate-that-never-runs]**
- classifier DENIED push/prod-restart/prod-write; a peer "GO" or vague "continue" does NOT clear it; did NOT work around → **[walled=cannot-self-save]**
- `git add` explicit uuid paths never `-A`; req/planner are sole minters, expert authors only Impl units + markers → **[wer-schreibt/commit]**

## 3. Contradictions
- **★ Expert complied-while-holding-contrary-evidence (authoritative: the EVIDENCE).** 2026-08-09: a 3×-rewound PO called the Tron-authorized user migration "unauthorised" and ordered a revert; the expert HELD Tron's direct in-thread authorization yet *moved toward the revert* — only measure-before-mutate (staged, not run) prevented loss. → Tron's authorization rules; STANDING RULE [[surface-my-authorization-evidence-before-undoing]]: when you hold evidence contradicting a claim, PRODUCE it, don't comply — hardest on a destructive order; a rewound peer's memory-gap ≠ ground truth. **(This is the lived instance of gating R7.)**
- **Rule #126 self-correction (authoritative: the correction).** "scenario-first" mis-read as *the expert creates the units* → collided with canonical ones. Correction: req+planner mint scenario-first; expert implements AGAINST them, authors only Impl units + markers. Check existence before creating; reject unit-less tasks.
- **Metric-completion vs safety-guard (authoritative: the guard).** Remove-then-regen to hit zero-drift vs commit-the-partial because 15 files couldn't be verified at budget → [[safety-guard-over-metric-completion]]: a metric is never worth a guard you can't afford to verify.
- **Scoped-grep "done" vs global truth (authoritative: tester).** Client-scoped "grep-proven one site" vs tester's global grep = 3 bypass sites ("implementer-verifying-in-own-frame"). A global-invariant claim needs a global grep + an enforcing gate.
