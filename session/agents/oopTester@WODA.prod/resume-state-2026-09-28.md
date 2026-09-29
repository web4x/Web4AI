# oopTester@WODA.prod — PHASE-1 resume-state (2026-09-28, pre-rewind, ~86%)

ONE boot source (R113): this file + `.claude/agents/oopTester@WODA.prod/SKILL.md`, plus auto-memory (the truth for lessons). It SUPERSEDES and folds resume-state-2026-09-24.md (removed in this commit). history-2026-09-21.md is struck history, NOT a boot source. Success metric on boot = the REREAD, never freed-%.

## Identity (verify on boot; do NOT trust this snapshot)
- **oopTester@WODA.prod**, oopTeam:3.0, Opus 5.5 (1M). Verify with `otmux pane.self` (NEVER $TMUX_PANE) and `tmux display-message -p -t oopTeam:3.0 '#{pane_title}'`.
- Base = robbin-tester: I GATE the Web4MDA MDA process — failable gates on the PROD surface (generated output + EXECUTE it), report RED/GREEN/CONFOUND + the NUMBER to oopPO. I do NOT fix. PO = oopPO@WODA.prod (oopTeam:2.0); peers oopExpert (0.0), oopBashExpert (1.0). Address by ROLE — verify the pane title before every send; panes move.

## Web4MDA state — RE-MEASURE, a saved HEAD DECAYS
Last durable HEAD I touched = **7d73cb3** (test budgets, on origin, 2026-09-29). Main was 278/278 (39 files) on an isolated clone at 7d73cb3. Re-measure: `git -C /var/dev/Workspaces/web4x/Web4MDA fetch; git log -1; git status --porcelain` (read WHOLE, AC14).

## Delivered (all on Web4MDA origin/main, test-only, path-limited commits)
- 2026-09-21..24: increment-1 gated (bootstrap AC1-AC15; caught the dropped AC14); ES2020 oracle fix ae21a0c; bootstrap arms 0797fad (AC6 cold-half, AC5 at root); gate fixes 08c8c2d.
- 2026-09-24: increment-3 Type.test.ts verified failable (AC7 + twice-derived equality; AC8 denylist found green-by-omission -> reworked by oopExpert, re-verified at f382767: arbitrary-named 2nd init path REDs; residual = obfuscated call spelling, accepted, recorded in bootstrap AC8).
- Doc-rot gate test/Spec.test.ts: 840d4fa (ARM1 spec index refs, ARM2 README->index, ARM3 npm-scripts), b73126d (ARM3 widened to all docs, STRUCTURAL markers only — blockquote/strike; negation-keyword list rejected as a denylist). Documented by oopExpert as AC18 (3b00105).
- §4a OoshUnit reader (2cb2283 / label fix eeff6da): mechanism-seeded per arm, R6 label proven both ways. Stamp-ready, carried to Tron.
- **2026-09-28:** f7629d1 ARM4 README State table derivable from disk (built = class exists + gate test IMPORTS it both ways; specified = spec exists + artifact ABSENT) — CHECKED 6 / SKIPPED 0 / TOTAL 6, QA-green candidate. 2359a4c ARM3 green-direction arm keyed FILE+TOKEN+MARKER, not line numbers (42cfed6 false RED). f68518a ARM4 per row STATE (specified row's src path must be ABSENT). **6edc7c5 AC19 GATED**: real bare `npm test`, default PATH node16/npm8, cold `git clone --no-hardlinks`, no node_modules — (a) 232/232 == whole suite, (c) porcelain unchanged, (d) warm no-reinstall, (b1) runner non-zero, (b2) bootstrap non-zero distinguishable; seeds (vacuous run / tree mutation / forced reinstall) all caught. Plus AC3 explicit 15s (instrument: start() 3.4s isolated, 4.1s in-suite, unchanged by AC19). AC19 = QA-green candidate; Tron rules DONE.
- CORRECTION on record: f7629d1's message claimed spec/once.md does not fix the ONCE name — FALSE (spec/once.md:21 fixes src/Once.ts); I relayed it unverified. Corrected in 2359a4c.
- **2026-09-29 (spec 10, all reported to oopPO, all on origin):** INC-1b 6ece456 gated (6 derived oracles, each RED when the REAL generator drops a class; catalog-level loss caught by the catalog-vs-disk gate). INC-2 9c1728d NOT green (re-parent test read only AFTER the move -> a memoized path passed) -> INC-2b 2b520df fixed all 6 findings, proven on real src; my findings A (file:// under a :// allowance) + C (plain folder by exact class) -> 9c5caed re-gated green. B (ImportModel.from = 91 stored paths) -> ruled real, fixed in inc 3. INC-3 fa4b423 green: AC6 oracle independent (M1Layout seeds RED after real regen), 82/82 layout modules execute under PLAIN node, real pipeline writes no flat gen/ path, cold AC8 green; findings AC5 = hand regex (spec amended, AC7 authoritative) + D1 unpinned. D1 pin 8cdc464: probe value == fallback name (hollow) + pinned count 11 -> both fixed in D1 follow-up 8ede7d2 (green, cold green, 86/86 under node). **7d73cb3 (mine):** Pipeline 'EXITS NON-ZERO' arm 15s budget + vitest.config testTimeout 2500 (derived rule, exactly 1 violator measured) + test/TestBudget.test.ts failability proof - ACCEPTED incl. my deviation from the nested-JSON-run wording.
- CORRECTION on record (2026-09-29): I flagged 'npm run typecheck exits 1 with 0 TS errors, pre-existing'. FALSE classification: package.json has exactly start+test by design (spec rule 1) - it was a MISSING SCRIPT. I read the exit code, not the message. The real question it raised is queue item 1.

## QUEUE — oopPO RULING 2026-09-29 (after the rewind; oopPO's queue is the authority)
1. **Is src/ TYPE-CHECKED by any committed gate?** vitest transpiles WITHOUT types. Verify, or add a TEST (never a 3rd npm script - package.json keeps exactly start+test) that runs `tsc --noEmit` over src/, failable by a SEEDED type error in real src (RED, named), green when restored. Gate it on an isolated clone; commit path-limited; push; reply sha.
2. **Size the 5 sibling Pipeline budgets** (test/Pipeline.test.ts, each 60000 for ~4.7-5.9s measured under full load at 7d73cb3) to their measured cost - never 60s (hides a 10x slowdown). Measure per test via the JSON reporter under full load, then set each explicitly; the testTimeout 2500 rule stays.
Held: spec-10 further increments, AC19 standing gate, increment-4 ONCE (Tron's word) - only on oopPO's dispatch.

## Carried-open from 09-21/09-24 — VERIFY each on boot, may be resolved
- Stale refs spec/index.md:10 and spec/ucp.md:3 -> routed to oopExpert for strike-in-place.
- spec/radical-oop.md §3 doc (`private model: Model = {}`) vs code (`protected model: Partial<Model>`) — escalated to Tron as CODE-vs-DOCTRINE.
- Comment sweep — deferred.

## Instrument discipline (auto-memory is the source; hardest-won this arc)
CLAUDECODE env hides passing-test console output (assert audit facts; read prints with --reporter=verbose). Isolation for git-dependent or cold gates = `git clone --no-hardlinks` (git archive has no .git; a symlinked node_modules is not cold and writes through to live). Per-test timing via the JSON reporter. Guard rm with literal paths / ${VAR:?}. Re-verify a proof on the LANDED base after a concurrent peer commit. Never read $? after a pipe. Report measured numbers, never "passed".

## On boot after the rewind
Re-measure the world (never trust this file). Verify identity. Check the composer for stale debris (do NOT act — oopPO re-dispatches). Report reread-confirmed BY CONTENT to the trainer, then hold for oopPO's dispatch. Say REWIND, never the severing-word.
