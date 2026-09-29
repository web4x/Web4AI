# oopTester@WODA.prod — PHASE-1 resume-state (2026-09-28, pre-rewind, ~86%)

ONE boot source (R113): this file + `.claude/agents/oopTester@WODA.prod/SKILL.md`, plus auto-memory (the truth for lessons). It SUPERSEDES and folds resume-state-2026-09-24.md (removed in this commit). history-2026-09-21.md is struck history, NOT a boot source. Success metric on boot = the REREAD, never freed-%.

## Identity (verify on boot; do NOT trust this snapshot)
- **oopTester@WODA.prod**, oopTeam:3.0, Opus 5.5 (1M). Verify with `otmux pane.self` (NEVER $TMUX_PANE) and `tmux display-message -p -t oopTeam:3.0 '#{pane_title}'`.
- Base = robbin-tester: I GATE the Web4MDA MDA process — failable gates on the PROD surface (generated output + EXECUTE it), report RED/GREEN/CONFOUND + the NUMBER to oopPO. I do NOT fix. PO = oopPO@WODA.prod (oopTeam:2.0); peers oopExpert (0.0), oopBashExpert (1.0). Address by ROLE — verify the pane title before every send; panes move.

## Web4MDA state — RE-MEASURE, a saved HEAD DECAYS
Last durable HEAD I touched = **06cd13b** (ARM3 multiset). Measured 2026-09-29: HEAD 558b944 (spec 10 eamd-ucp.md), with PEER WIP in the tree (OoshUnit src/MOF -> src). Re-measure: `git -C /var/dev/Workspaces/web4x/Web4MDA fetch; git log -1; git status --porcelain` (read WHOLE, AC14). Main was 232/232 at f68518a on an isolated clone.

## Delivered (all on Web4MDA origin/main, test-only, path-limited commits)
- 2026-09-21..24: increment-1 gated (bootstrap AC1-AC15; caught the dropped AC14); ES2020 oracle fix ae21a0c; bootstrap arms 0797fad (AC6 cold-half, AC5 at root); gate fixes 08c8c2d.
- 2026-09-24: increment-3 Type.test.ts verified failable (AC7 + twice-derived equality; AC8 denylist found green-by-omission -> reworked by oopExpert, re-verified at f382767: arbitrary-named 2nd init path REDs; residual = obfuscated call spelling, accepted, recorded in bootstrap AC8).
- Doc-rot gate test/Spec.test.ts: 840d4fa (ARM1 spec index refs, ARM2 README->index, ARM3 npm-scripts), b73126d (ARM3 widened to all docs, STRUCTURAL markers only — blockquote/strike; negation-keyword list rejected as a denylist). Documented by oopExpert as AC18 (3b00105).
- §4a OoshUnit reader (2cb2283 / label fix eeff6da): mechanism-seeded per arm, R6 label proven both ways. Stamp-ready, carried to Tron.
- **2026-09-28:** f7629d1 ARM4 README State table derivable from disk (built = class exists + gate test IMPORTS it both ways; specified = spec exists + artifact ABSENT) — CHECKED 6 / SKIPPED 0 / TOTAL 6, QA-green candidate. 2359a4c ARM3 green-direction arm keyed FILE+TOKEN+MARKER, not line numbers (42cfed6 false RED). f68518a ARM4 per row STATE (specified row's src path must be ABSENT). **6edc7c5 AC19 GATED**: real bare `npm test`, default PATH node16/npm8, cold `git clone --no-hardlinks`, no node_modules — (a) 232/232 == whole suite, (c) porcelain unchanged, (d) warm no-reinstall, (b1) runner non-zero, (b2) bootstrap non-zero distinguishable; seeds (vacuous run / tree mutation / forced reinstall) all caught. Plus AC3 explicit 15s (instrument: start() 3.4s isolated, 4.1s in-suite, unchanged by AC19). AC19 = QA-green candidate; Tron rules DONE.
- CORRECTION on record: f7629d1's message claimed spec/once.md does not fix the ONCE name — FALSE (spec/once.md:21 fixes src/Once.ts); I relayed it unverified. Corrected in 2359a4c.

## QUEUE — oopPO RULING 2026-09-29 (carried verbatim by the trainer; oopPO's queue is the authority)
Landing ~69% ACCEPTED, no re-drive; ~31% free covers ONLY the next item, which is SMALL.
1. **Gate spec-10 increment-1** (spec/eamd-ucp.md @558b944): OoshUnit moved to src/ + a RECURSIVE catalog gate. Start ONLY when oopExpert's sha lands (peer WIP was in the tree at 558b944 — gate the LANDED sha from an isolated clone, never the dirty tree).
2. **STOP for EXIT+REFORK** (agent-rewind row 1c, Tron-sanctioned, full history) — AFTER the inc-1 gate, BEFORE anything heavy. R5 preconditions: phase-1 save pushed; session uuid measured LIVE; composer read + any staged words rescued.
3. Spec-10 increment-2/3 gating.
4. Standing AC19 gate (recursion-safe + cost-honest; heavy — only after the refork).
Later (unchanged): increment-4 ONCE — HELD on Tron's word; global runtime registration counter — after increment-4.
Item 1 of the previous queue (ARM3 exact allowance multiset) = DONE at 06cd13b, oopPO-accepted 233/233.

## Carried-open from 09-21/09-24 — VERIFY each on boot, may be resolved
- Stale refs spec/index.md:10 and spec/ucp.md:3 -> routed to oopExpert for strike-in-place.
- spec/radical-oop.md §3 doc (`private model: Model = {}`) vs code (`protected model: Partial<Model>`) — escalated to Tron as CODE-vs-DOCTRINE.
- Comment sweep — deferred.

## Instrument discipline (auto-memory is the source; hardest-won this arc)
CLAUDECODE env hides passing-test console output (assert audit facts; read prints with --reporter=verbose). Isolation for git-dependent or cold gates = `git clone --no-hardlinks` (git archive has no .git; a symlinked node_modules is not cold and writes through to live). Per-test timing via the JSON reporter. Guard rm with literal paths / ${VAR:?}. Re-verify a proof on the LANDED base after a concurrent peer commit. Never read $? after a pipe. Report measured numbers, never "passed".

## On boot after the rewind
Re-measure the world (never trust this file). Verify identity. Check the composer for stale debris (do NOT act — oopPO re-dispatches). Report reread-confirmed BY CONTENT to the trainer, then hold for oopPO's dispatch. Say REWIND, never the severing-word.
