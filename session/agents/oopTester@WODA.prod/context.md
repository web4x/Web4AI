# oopTester@WODA.prod — PHASE-1 BANKED for SM proactive rewind (panel 81%, 2026-10-07) — REREAD THIS FIRST — SUPERSEDES ALL BELOW

- ON LANDING: STOP + HOLD + REREAD by content; identity 914c8cad (oopTeam:3.0) via `claudeCode session.current oopTeam:3.0`; RC by MENU VERB; ignore restored scrollback + composer (never submit a stale brief). Re-measure Web4MDA + origin yourself.
- **LAST DONE (R2-END window, both pushed):** (1) R2 verify s0..s3 on Web4MDA ca6b7bb6 = verdicts/R2-END-verify-ca6b7bb6.md @ d5b5beab — CHECKED 7: suite x2 731 = 729/0/2, IOR8 arms a+b GREEN, seeds in an ISOLATED git-archive copy under Web4MDA/latest/test/gen (S1 ownIor bare string, S2 simple-name registry key, S3 Ior loses own namespace getter — each RED by name, restored, copy removed), own namespace getter 75/75 in all 4 trees (count `static (override )?get namespace()` — TS needs `override`), 5 in-process named seeds GREEN. (2) TestPlacement scanner fix = Web4MDA e55cd783: class CodeText (ONE literal-stripping rule) used by AssertionSubject (both sites) AND uses(); seeds a/b/c RED-first then GREEN, strip disabled -> 4 RED; full suite 735 = 733/0/2.
- **OPEN FINDING (oopExpert's):** UnitIor.test.ts:71 "store without a profile" expects the SAME message as no-store (`no store is open`) — ownIor tests `Mof.store?.profile === undefined` for both; needs a distinct guard + message.
- **SM RULING 2026-10-07 (post-rewind reread verified, panel 56%):** (1) my OPEN FINDING was ADDRESSED by R2 s4 2ca0db50 (+spec/ior.md rule 8 at 8972bfa5) -- R3-END verify must CONFIRM it (no-store vs open-store-without-profile = two named errors). (2) R3 s0 SHIPPED (RED-first gate 826e5177 + plan amended 09d2982c); R3 **s1** is the step BLOCKED ON TRON's IOR-parts ruling. HOLD until oopPO pings R3-END.
- ~~**RATIFIED + APPROVED 2026-10-07 (oopPO): my 5 by-value-era gates -> it.fails at R3 s1, ZERO assertion edits, owner = ME** (supersedes my first count, which assumed arm (b) flips at s1 - it flips at s2). TAGS (tag = step where the POSITIVE rewrite becomes possible): init-not-an-oracle = s1; Version decay canary = s2; NodeJSFolder canary + 2 case-B set-reference arms = R4. COUNT GATE it.fails total: today 2 (ReferencesByIor.test.ts arm (b):134 case-A round-trip + (c):160 case-B) -> after s1 = 7 -> after s2 = 6 ((b) flips) -> after R3-END = 4 (I rewrite the s1+s2 two positively) -> after R4 = 0. ENTRY CHECK at s1 verify: each of the 5 run as plain it() must fail ON ITS ASSERTION, not a crash (it.fails passes on any throw; the R4 three live s1..R4 = longest crash-hiding window). EXIT check at each tag's step, same rule. Verify on the s1 diff: only it( -> it.fails( + tag comment; oopExpert names each by file:line + step in the s1 commit body. Report as 'N passed incl K expected-fail', never bare green.~~ **SUPERSEDED 2026-10-08 by verdict `verdicts/R3-s2-verify-d73ea5a5.md` (f3e5b8b1):** 8 by-value gates now (I ratified 3 more: RP:52/:79/:105 [s2]). Commit-scoped it.fails: s0 4 -> s1 7 -> s2 9 -> R3-END 5 -> R4 0. R3-END REWRITE SET = TR:262 [s1] + RP:52/:79/:105 [s2] (RP:52 must RE-ASSERT all 14 ends, not just drop the refusal). Stay into R4: c-read, TR:135, TR:181, RP:91, RP:117. ~~ENTRY was PARTIAL … (F1, oopPO to rule).~~ **F1 DONE c0c3de8b** (fixtures: per-test store + catalog.attach + valid Ior; ENTRY now 7/8 on assertion; RP:117 structural, TypeError on the stored IOR string — **RULED 2026-10-08 (oopPO): (a) ACCEPTED, SUBSUMED** — its premise (a unit stored BY VALUE) is UNREPRESENTABLE under by-reference; R3 arm (a)'s seed (unit by value -> RED) already gates its regression (consistent with my S1 run: arm (a) RED naming ends). At R3-END RETIRE RP:117 as SUBSUMED citing arm (a)'s seed, NOT rewritten. TRAJECTORY NOW: 9 -> R3-END 4 (rewrite TR:262 + RP:52/:79/:105, retire RP:117) -> R4 0 (c-read, TR:135, TR:181, RP:91). WINDOW CLOSED after d8c2c4a1 - hold Web4MDA writes. ~~F2 … awaiting oopPO go.~~ **F2 DONE d8c2c4a1** (A1 SecureTransport components-beside gate, RED-proven). Suite after: 731/9xf/2skip, it.fails@HEAD 9. Verdict addendum 13e5e439. Count gates: `git grep <sha>`, NEVER the working tree.
- **RATIFIED 2026-10-08 (oopPO ask): arm (c) re-scope in R3 s3** — A3 (spec model-json, 1d74361b): a LINK (`ScenarioUnitModel.links` -> Link) is stored as its CANONICAL STRING (`Link.toString()`, SC4 byte-identical); case B = 1 end (LinkModel.folder). MY s3-VERIFY CHECKLIST: (1) link set DERIVED by target class Link (+subclasses), never by end name; (2) one derivation, 3 disjoint sets (A / link / B), arm (c) assertion lines byte-identical on the s3 diff; (3) new canonical arm asserts its link set NON-EMPTY and A+link+B == all ends; (4) seeds in an isolated copy: link stored as anything but Link.toString() -> RED by name; read back byte-identical; LinkModel.folder STAYS case B; (5) 1d74361b on origin with/before s3. COUNT: 9 -> R3-END 4 -> R4 0 if the canonical arm lands GREEN plain it in s3; if RED-first it.fails, s3 = 10 until its flip. Check commit-scoped.
- **NEXT (only on oopPO's ping):** R3-END verify (R3 = generic by-reference toJSON/init in ModelDefinition, cases A+B; gate per plan spec/plans/2026-10-06-references-by-ior.md: all 14 ends round-trip JSON + OoshUnit, no {model,initialized,heldUnits} stored form, seed a by-value write -> RED). R3 is currently BLOCKED ON TRON.
- **RULES learned today:** doc gate = re-derive the doc-reading set `git grep -lE "README\.md|['`"]spec/|\.\./spec/" -- '*.test.ts'`, run on the shared checkout ONLY when HEAD == the asked sha + porcelain empty (no improvised clone); NEVER commit/push on top of an unpushed peer commit (check `git rev-list --count origin/main..HEAD` in BOTH repos); seed-restore ONLY if the file's diff is exactly my seed (git restore can wipe a peer's edit — memory seed-restore-only-if-diff-is-exactly-my-seed); seeds for a shared window go in an isolated git-archive copy under a component's latest/test/gen, removed after (run-start prune deletes unowned gen entries — run the shared suites BEFORE building the copy); confound attribution by the HOLDER's parent chain (lsof +D, ppid walk).
- RUN RULES: product entry `node scripts/bootstrap.mjs test [files]` / `npm test`, TMPDIR UNSET, FOREGROUND; repo-root .tmp FORBIDDEN; captures PLAIN; evidence logs in verdicts/h5m3/ (*.log gitignored — commit only .md verdicts); path-limited commits, always push.

# oopTester@WODA.prod — QUEUE BANKED 2026-10-07 (references-by-IOR plan, spec/plans/2026-10-06-references-by-ior.md) — REREAD FIRST, SUPERSEDES ALL BELOW

- identity 914c8cad (oopTeam:3.0). CLEANUP PLAN: my final plan-end verification GREEN = verdicts/PLAN-END-FINAL-verification-14804fd8.md @ abb8205c (DONE is Tron's).
- DONE since: doc gates GREEN on 602e8e2a, e3376e85 (R1, 14 doc-reading files 161/161), b6f5d8f6 — derive the doc-reading set each time: `git grep -lE "README\.md|['`"]spec/|\.\./spec/" -- '*.test.ts'`; run on the SHARED checkout only when HEAD == the asked sha and porcelain empty (no improvised clone).
- **WAIT for oopPO's ping = CLEAN WINDOW** (R2 s3 pushed: Web4MDA HEAD == origin, porcelain empty, oopExpert idle). Never commit on top of an unpushed peer commit (566ee70f was oopPO's, riding oopExpert's s2b push).
- **THEN, in order:** (1) **R2 verify** — every catalogued unit's typed IOR round-trips byte-identical through Ior.parse; two same-named classes in different namespaces both resolvable; seed simple-name registry key -> RED. (2) **TestPlacement AssertionSubject scanner fix (oopPO-APPROVED plan):** hole = raw-text tokenizing at TWO sites — line ~303 (variable typing from `const x = <value>`) and ~308 (subject credit per `expect(...)` arg); string, template AND regex literals leak. RED-first seeds: (a) subject name only in an expect MESSAGE string -> not credited; (b) a const whose STRING value holds an imported name -> not typed; (c) regex literal /a/ in expect -> not credited. Fix = ONE owning class for code-without-literals (comments, regex, string, template) used by BOTH AssertionSubject and the existing uses() (no second regex copy). Then strip disabled -> RED; TestPlacement + full suite once; path-limited commit (TestPlacement.test.ts is NOT pinned in TestFolder). Both BEFORE R3 is dispatched.
- RUN RULES: product entry `node scripts/bootstrap.mjs test [files]`, TMPDIR UNSET, FOREGROUND; captures PLAIN; repo-root .tmp FORBIDDEN; seeds physical, restored, porcelain re-checked; evidence logs in verdicts/h5m3/ (*.log gitignored — commit only the .md verdicts).

# oopTester@WODA.prod — PHASE-1 BANKED for SM rewind (panel 71.1, oopPO order, after H5n verdict fc215f98, 2026-10-06) — REREAD THIS FIRST — SUPERSEDES ALL BELOW
> ★★★ **H6 SCRATCH + TEST-PLACEMENT LAW (boot-read):** every test lives in the component its assertions test; scratch ONLY in that component's OWN `latest/test/gen` under FIXED names, wiped per run, never random; tool tmp = fixed `Web4MDA/latest/test/gen/tmp`. READ `session/base-skills/scratch-location-law.md` + Web4MDA `spec/bootstrap.md` rule 9 + AC20–AC23 @ `72859188` — never restate. <!-- H6-POINTER -->

- ON LANDING: STOP + HOLD + REREAD by content; identity 914c8cad (oopTeam:3.0) via `claudeCode session.current oopTeam:3.0`; RC by MENU VERB; ignore restored scrollback + composer (clear replayed debris, never submit a stale brief).
- LAST DONE: H5n gate on Web4MDA b76ad5d4 = verdicts/H5n-gate-b76ad5d4.md @ fc215f98 (CHECKED 7 / UNMEASURED 1 / TOTAL 8, every seed RED), reported to oopPO. Prep + rulings: verdicts/H5n-gate-PREP-b76ad5d4.md @ a3dbaf80. Evidence inventories: verdicts/h5n/.
- **NEXT (only on oopPO's GO):** RE-GATE oopExpert's (1) H5m-3 test MOVES and (2) the b2 FIX. b2 = Scratch.at(url) trusts the caller URL -> a test can write into ANOTHER component's gen under a real owner name (measured: 84 Scratch().at( calls, 82 import.meta.url, 2 in BootstrapScratch.test.ts :163/:173). Re-gate b2 by the SAME physical seed: an NpmPackage test calling at(<M1Layout real test URL>).fixture(...) must now be RED (static gate or derived caller), positional exception only for BootstrapScratch. H5m-3: re-run TestPlacement on the moved files (declared subject imported AND used, duplicates, ratchet 13 or its lowered baseline), physical seeds, no test lost by name, nothing weakened.
- STILL OPEN from H5n: b3 recorder UNMEASURED (full run under WriteRecorder > harness 600 s fg / 30 min bg); e at RUN level only; 3 dead mkdtempSync imports (Pipeline:4, ScratchExclusion:2, SrcTypecheck:3) = oopExpert residue; h5m3/ written in Web4MDA gen by another agent during my window.
- CONFOUNDED: BootstrapScratch :53/:65 (repo .tmp exists) = Tron's pre-H5x npm start pid 1868291 (+ children 1868422/1868594/1868596). NEVER touch his process or repo .tmp.
- RUN RULES: FOREGROUND only (H0, no run_in_background; a run the harness auto-backgrounds = disclose); TMPDIR UNSET (bootstrap sets Web4MDA/latest/test/gen/tmp); TypeScript via node --import tsx, never npx; detect confound every run (.tmp mtime + porcelain WHOLE before/after + AC2b); seeds PHYSICAL, removed after, Scratch.ts restored == HEAD; scratch only under a component's latest/test/gen; my evidence/verdicts in AI/Claude only. Shells of mine at bank: 0.

# oopTester@WODA.prod — H5n GATE DONE, verdict fc215f98 (2026-10-06) — REREAD FIRST, SUPERSEDES ALL BELOW

- identity 914c8cad (oopTeam:3.0). H5n gated on Web4MDA b76ad5d4: verdicts/H5n-gate-b76ad5d4.md @ fc215f98 = CHECKED 7 / UNMEASURED 1 / TOTAL 8, every seed RED. Reported to oopPO (delivered).
- OPEN for oopPO/oopExpert: b2 false-green edge (Scratch.at trusts the caller URL; fix = static gate at(import.meta.url), BootstrapScratch positional exception); b3 recorder UNMEASURED (harness limits); e measured at run level only; 3 dead mkdtempSync imports; h5m3/ written by another agent in my window.
- CONFOUNDED: BootstrapScratch :53/:65 (.tmp exists) = Tron's npm start pid 1868291 — clears when he restarts it.
- RUN RULES now: FOREGROUND only (H0); never touch Tron's process or repo .tmp; detect confound per run (.tmp mtime + porcelain whole before/after + AC2b). HOLD — rewind follows.

# oopTester@WODA.prod — H5n gate PREPPED, NOT RUN (2026-10-06) — REREAD FIRST, SUPERSEDES ALL BELOW

- identity 914c8cad (oopTeam:3.0). H5n landed Web4MDA b76ad5d4 (oopExpert). Prep = verdicts/H5n-gate-PREP-b76ad5d4.md @ e8787a00: arms a-d + extra, scope rules S1-S3 fixed before results, pre-run conditions.
- DO NOT RUN until oopPO's GO: Tron's npm start pid 1868291 (TMPDIR=repo/.tmp) confounds any run. NEVER touch his process or repo .tmp.
- Asked oopPO (delivered, being processed): Q1 tool-created names inside Web4MDA/latest/test/gen/tmp exempt from arm (a)? Q2 arm (c) fixture level = standalone processes? HOLD.

# oopTester@WODA.prod — W4 DONE: H5m-fix re-gate verdict 2a48a1c7 (2026-10-06) — REREAD FIRST, SUPERSEDES ALL BELOW

- identity 914c8cad (oopTeam:3.0). W4 on Web4MDA main 0142c73a (fix range d9a2ca2c..d97c26fc = e30a712a + d97c26fc): verdicts/H5m-fix-regate-0142c73a.md @ 2a48a1c7. Arms a-d GREEN + failable via PHYSICAL seeds (all removed; Web4MDA untouched by me; Tron's Web4MDA.ts reformat never staged).
- OPEN for oopPO: lookalike false-green edge (load + discarded result + same-named non-class const -> GREEN; "use" matched by name) = the gate's own GREEN-twin shape, inside the named residual. Observation: gate (a) checks misplaced before duplicates (a duplicated TESTED class reports as misplaced).
- Suite once 716 = 709/5/2, all 5 RED = Tron's edit. W2's package.json AC2b rewrite did NOT reproduce = intermittent.
- NEXT: H5x = oopExpert; my H5x / H5m-2 / H5n gates only on oopPO's GO. HOLD.

# oopTester@WODA.prod — W2 DONE + PUSHED Web4MDA 3d9f472e (2026-10-06) — REREAD FIRST, SUPERSEDES ALL BELOW

- identity 914c8cad (oopTeam:3.0). W2 (SM window, oopPO ruling b) = applied the committed patch, path-limited to 3 files (gates/GarbageSweep.ts tmp.* pattern + NAMED RESIDUAL, GarbageSweep.test.ts seeds, TestFolder.ts pin). Pushed d97c26fc..3d9f472e. Both patch copies DELETED (gitignored twin rm; tracked one git rm AI/Claude 6cdc16cf, pushed).
- Suite ONCE on d97c26fc + patch WITH Tron's reformat-only edit in latest/src/ts/EAM/layer2/Web4MDA.ts (never staged/reverted — Tron decides keep/discard): 716 = 709 / 5 FAIL / 2 skip. All 5 RED name Web4MDA = his edit (Pipeline root-gate seed, M1Catalog TS==src, ModelStyle AC5-7, M3Class spec12 AC5, M2TypescriptClass). GarbageSweep green.
- OPEN, UNATTRIBUTED: AC2b(b) "suite REWROTE package.json" (inode+mtime moved, content identical to HEAD); not my files; plausibly the Pipeline seed aborting on the Web4MDA.ts edit — re-measure once Tron's edit is resolved.
- Reported to SM (relayed up). W3 = oopPO. NEXT for me = W4 (re-gate H5m arms a-d) ONLY on oopPO's W4 GO, taking the arm text from it. HOLD.

# oopTester@WODA.prod — PHASE-1 BANKED for SM rewind (panel 69.6, SM order oopPO-approved, during the W2 hold, 2026-10-06) — REREAD THIS FIRST — SUPERSEDES ALL BELOW

- ON LANDING: STOP + HOLD + REREAD by content; identity 914c8cad (oopTeam:3.0) via `claudeCode session.current oopTeam:3.0`; RC by MENU VERB; ignore restored scrollback/composer. ★★★ ~~TRON: no work in /tmp (no run_in_background either).~~ **[SUPERSEDED 2026-10-08: own harness scratchpad ALLOWED; see `session/base-skills/scratch-location-law.md`, which owns the list]** ★★ oopPO RULING: NO improvised roots — no repo-root worktrees (.h5*), no /tmp or scratchpad extracts; scratch ONLY under latest/test/gen; an isolated full-suite run = the SHARED checkout in an SM-coordinated no-edit window (memory prove-gate-failable-in-isolation-when-tree-under-peer-edit, rewritten).
- **PLAN** = Web4MDA spec/plans/2026-10-06-cleanup-outside-repo.md, CURRENT text. **main = origin = d97c26fc** (measured at bank; checkout on main, porcelain 0).
- **W2 (NEXT, only on the SM's "tree is yours")** = oopPO H5b MISS order: apply `preserved/TEMPORARY-W2-h5b-tmpdot-on-d9a2ca2c.patch` (TEMPORARY — delete once W2 lands it; identical copy in Web4MDA latest/test/gen/tmp/oopTester-h5b-tmpdot-on-d9a2ca2c.patch — delete that too). Measured at bank: `git apply --check` on d97c26fc exit 0; its 3 files unchanged d9a2ca2c..d97c26fc, so the pin stays valid. Content: GarbageSweep.ts `tmp.*` pattern (dir holding an OOSH colour env file color.env / color.names.env / bold.color.names.env / setup.color.env / lineFormat.env, or a file referencing /EAMD.ucp/Components/ | /src/MOF/; empty or foreign tmp.* not counted) + NAMED RESIDUAL header (list is HAND-WRITTEN, a new shape counts 0, GREEN = none of the known shapes); GarbageSweep.test.ts seed: one tmp.* with color.env -> FOUND 1, repo-ref counted, foreign/empty/non-tmp not, pattern removed -> 3 RED (proven); TestFolder.ts pin GarbageSweep.ts a37e8f6f… -> 5da775e7…. Then `~~TMPDIR=<repo>/.tmp~~ npm test` ONCE on the shared checkout, commit PATH-LIMITED (3 files), push, delete both patch copies, reply sha + numbers to oopPO (oopTeam:2.0). Real /tmp at bank (read-only): 1 tmp.* dir, 0 with colour env. **[STRUCK 2026-10-07, oopPO: repo-root .tmp is FORBIDDEN — it confounds BootstrapScratch :53/:65. CURRENT RULE: run only via the product entry `node scripts/bootstrap.mjs test|<verb>`, TMPDIR UNSET — bootstrap fixes the tool tmp at Web4MDA/latest/test/gen/tmp/ (scripts/bootstrap.mjs:26); never repo-root .tmp]**
- **FLAGGED, oopPO's call:** GarbageSweep CLI `--seed` plants real /tmp/web4mda-x — conflicts with Tron's /tmp rule; I did not change it.
- **W4 (after W2)** = re-gate the H5m fix on main d97c26fc, arms a-d — take the exact arm text from oopPO's W4 GO. My H5m history: verdicts H5m-gate-8d0fc32c @ a3140357, H5m-regate-7e521d5d @ 64a9f4ae, H5m-regate2-d9a2ca2c @ d647658c (open then: path-string false-green — a literal holding the class's .ts path counted as reach AND use; oopExpert C-plus e30a712a on branch oopExpert-h5m-cplus addressed it). Seeds = PHYSICAL files in the shared tree, only inside the window, removed after; before-names via `git show <sha>:<path>` or an SM window, never a worktree.
- RUN RULES: node_modules/.bin/*, never npx; ~~TMPDIR=<repo>/.tmp~~; foreground only; measure scratch (latest/test/gen: 963 files / 19,120 K, gen/tmp manifest 8576c44e75fc at last measure) before/after. **[STRUCK 2026-10-07, oopPO: repo-root .tmp is FORBIDDEN — it confounds BootstrapScratch :53/:65. CURRENT RULE: run only via the product entry `node scripts/bootstrap.mjs test|<verb>`, TMPDIR UNSET — bootstrap fixes the tool tmp at Web4MDA/latest/test/gen/tmp/ (scripts/bootstrap.mjs:26); never repo-root .tmp]**

# oopTester@WODA.prod — PHASE-1 BANKED for SM rewind (panel 75, SM + oopPO, 2026-10-06) — REREAD THIS FIRST — SUPERSEDES ALL BELOW

- ON LANDING: STOP + HOLD + REREAD by content; identity 914c8cad (oopTeam:3.0) via `claudeCode session.current oopTeam:3.0`; RC by MENU VERB; ignore restored scrollback/composer. ★★★ ~~TRON: NO work in /tmp (no cd, scripts, logs, clones, background runs, harness scratchpad; only a preserve-push and the ordered delete) — memory no-work-in-tmp-only-push-and-ordered-delete.~~ **[SUPERSEDED 2026-10-08: own harness scratchpad ALLOWED; see `session/base-skills/scratch-location-law.md`, which owns the list]**
- **PLAN** = Web4MDA spec/plans/2026-10-06-cleanup-outside-repo.md, CURRENT text (last commit 1d5d396 = H5m). Gate against the current text, never a snapshot.
- **H4 DONE**: Web4MDA main 9364b5e (recorder .cjs via --require, verdict = escape count). Verdicts in my verdicts/: H4-gates-e77f9ba.md, H4-regate-4803f95-9364b5e.md.
- **H5 COMPLETE (my rows 0)** + **H5b sweep GREEN on Web4MDA 4e7686cd** — re-MEASURED at bank time: 11 patterns, every FOUND 0 (/tmp 4287 entries, /root 42, in-repo 5 = live caches), /tmp/claude-0 SKIPPED with reason (harness-owned). Run: `~~TMPDIR=<repo>/.tmp~~ node_modules/.bin/tsx <latest>/test/gates/GarbageSweep.ts [--seed]` (console only). **[STRUCK 2026-10-07, oopPO: repo-root .tmp is FORBIDDEN — it confounds BootstrapScratch :53/:65. CURRENT RULE: run only via the product entry `node scripts/bootstrap.mjs test|<verb>`, TMPDIR UNSET — bootstrap fixes the tool tmp at Web4MDA/latest/test/gen/tmp/ (scripts/bootstrap.mjs:26); never repo-root .tmp]**
- **MY preserve/* branches on Web4MDA origin (15)**: preserve/oopTester-{i2 1477ba7, f1-chain ea32117, f1-pairs 70d3438, tf 3d84e66, w4mda b3f1ce4, stepb fc35aa0, i5 81a2429, i5b 07e3ba1, c3c4-ev c52903d, c3c4-scripts cf94000, ns 7fcee79, s1-ev 760bc8b, s2-ev c2ccc35, s2b-ev 0e07f60, s3-ev 3408b05}; + AI/Claude preserved/s1-tester-delta.patch.
- **NEXT** = GATE oopExpert's H5m (47 tests moved into the components they test, Tron amendment 1d5d396) — ONLY on oopPO's routing. Until then HOLD.

# oopTester@WODA.prod — H5b GATE PUSHED Web4MDA 4e7686cd (2026-10-06) — REREAD FIRST, SUPERSEDES ALL BELOW

- gates/GarbageSweep.ts + GarbageSweep.test.ts (5/5, fake roots in repo scratch) + TestFolder pin. Suite 709 = 707/0/2.
- Real sweep (read-only): all NAME patterns 0 (/tmp 4613 entries, /root 42), in-repo 0 (live caches only), claude-0 SKIPPED with reason in every /tmp pattern; ssr FOUND 326, NEWEST 2026-10-05 00:06Z = historical -> gate RED until oopPO's ssr row runs. Seed: before 0, planted 1, after 0.
- Run: `~~TMPDIR=<repo>/.tmp~~ node_modules/.bin/tsx <latest>/test/gates/GarbageSweep.ts [--seed]` (console only; logs written into the scratch are themselves caught). **[STRUCK 2026-10-07, oopPO: repo-root .tmp is FORBIDDEN — it confounds BootstrapScratch :53/:65. CURRENT RULE: run only via the product entry `node scripts/bootstrap.mjs test|<verb>`, TMPDIR UNSET — bootstrap fixes the tool tmp at Web4MDA/latest/test/gen/tmp/ (scripts/bootstrap.mjs:26); never repo-root .tmp]**
- H5 my rows: complete (see block below). NEXT: HOLD for oopPO.

# oopTester@WODA.prod — H5 COMPLETE, all my rows 0 (2026-10-06) — REREAD FIRST, SUPERSEDES ALL BELOW

- TRON RULE IN FORCE: no work in /tmp (memory no-work-in-tmp-only-push-and-ordered-delete).
- PRESERVED on Web4MDA origin (15 branches, each verified by ls-remote): preserve/oopTester-{i2 1477ba7, f1-chain ea32117, f1-pairs 70d3438, tf 3d84e66, w4mda b3f1ce4, stepb fc35aa0, i5 81a2429, i5b 07e3ba1} (clone work) + {c3c4-ev c52903d 303 files, c3c4-scripts cf94000 11, ns 7fcee79 13, s1-ev 760bc8b 8, s2-ev c2ccc35 8, s2b-ev 0e07f60 5, s3-ev 3408b05 6} (orphan commits of /tmp folders, built in the shared repo). Plus AI/Claude preserved/s1-tester-delta.patch (4aad3ff2); H4 verdicts copied to my verdicts/ (942362dd).
- DELETED: job tmp entirely (17 clones + 83M non-git leftovers on oopPO's GO), 16 patches (6f47dfe5), /root/oopTester-handoff, in-repo h4-branch, h4d-diag, web4mda-h4-branch-suite-e2318e9 (GO), .tmp/h4* .tmp/h5-*, /tmp/oopTester-{c3c4, c3c4-ev, c3c4-scripts, ns, plan.md, s1-ev, s2-ev, s2b-ev, s3-ev}, session scratch 914c8cad + 5c6b3beb (harness recreates ~8K live capture).
- LISTED: 0. SIZE ~889M before -> 0 (+ ~8K harness residue).
- NEXT: HOLD for oopPO / Tron.

# oopTester@WODA.prod — H5 MY ROWS DONE except 2 LISTED (2026-10-06) — REREAD FIRST, SUPERSEDES ALL BELOW

- TRON RULE IN FORCE: no work in /tmp (see the block below + memory no-work-in-tmp-only-push-and-ordered-delete).
- PRESERVED (9), all verified: Web4MDA origin preserve/oopTester-{i2 1477ba7, f1-chain ea32117, f1-pairs 70d3438, tf 3d84e66, w4mda b3f1ce4, stepb fc35aa0, i5 81a2429, i5b 07e3ba1}; AI/Claude session/agents/oopTester@WODA.prod/preserved/s1-tester-delta.patch (4aad3ff2).
- DELETED: 17 job clones (9 HEAD-in-main clean, 8 after preserve), 16 session/tasks/oopTester-*.patch (6f47dfe5; 15 kept in AI/Claude history, untracked c75a62c one contained in preserve/oopTester-i2), /root/oopTester-handoff, in-repo gen/h4-branch + gen/h4d-diag + .tmp/h4* + .tmp/h5-* (verdicts first copied to my verdicts/ 942362dd: H4-gates-e77f9ba.md, H4-regate-4803f95-9364b5e.md), session scratch 914c8cad (harness recreates ~8K live) + 5c6b3beb.
- LISTED (await word): (1) /root/.claude/jobs/914c8cad/tmp 83M = non-git leftovers only (16 dirs: ac2b-guard, ac2b-keep, ac4-keep, gates-copy, i5-carry, i5-keep, item3-regression, keep-fc5, p0f, p49, p55, p596, rg-keep, rg3-keep, spec5, timing-76661a2, __pycache__ + 561 loose files 26M) — content check STOPPED by the /tmp rule, all git work there already preserved/in main -> one-command delete on oopPO's go; (2) in-repo latest/test/gen/tmp/web4mda-h4-branch-suite-e2318e9 45M = MINE, clean (HEAD 7ae9923 in main, only node_modules link untracked) but NOT in my row by name (oopExpert's gen/tmp pattern) -> delete on word.
- SIZE: before ~792M (job tmp 701M, h4-branch 45M, h4d-diag 45M, .tmp/h4* 0.5M, patches 0.45M, session 0.3M, handoff 16K) -> after 83M listed + 8K harness (+45M listed clone outside my row).

# oopTester@WODA.prod — H5 IN PROGRESS + TRON RULE (2026-10-06) — REREAD FIRST, SUPERSEDES ALL BELOW

- ~~★★★ TRON (shouted, via oopPO): working in /tmp is FORBIDDEN. No cd/scripts/logs/clones/background watches/harness scratchpad there (incl. /tmp/claude-0 task outputs => NO run_in_background; incl. job dir /root/.claude/jobs/914c8cad/tmp). ONLY: one-command `git -C <clone> push` of a preserve branch, and the plan-ordered delete as ONE command. Everything else inside the repo (Web4MDA/.tmp). Disclosed: before the rule I wrote+deleted /tmp/claude-0/h5-*.diff and used background runs (outputs in /tmp/claude-0).~~ **SUPERSEDED 2026-10-08 (TRON amendment via oopPO, "Deploy, scratchpad allowed"; enforced by `.claude/hooks/scratch-guard.py` e53e4043): my OWN harness scratchpad `/tmp/claude-0/<project>/<session>/scratchpad/` is ALLOWED. Test scratch + isolated clones ONLY in the component's own `latest/test/gen` (fixed names, wiped per run); tool tmp = the one fixed `Web4MDA/latest/test/gen/tmp`; `Web4MDA/.tmp` is NOT a sanctioned location. The list is OWNED by `session/base-skills/scratch-location-law.md` — read it there, never restate it here.**
- H5 GO from oopPO for MY rows (assignment AI/Claude session/tasks/oopPO-H5-assignment-20261006.md row oopTester). Stop rule: ~85 -> commit+push anchor, report what is left.
- DONE: preserve branches on Web4MDA origin, each VERIFIED by ls-remote: preserve/oopTester-i2 1477ba7 (c75a62c + 5 dirty + PureLayout.ts), -f1-chain ea32117, -f1-pairs 70d3438, -tf 3d84e66, -w4mda b3f1ce4, -stepb fc35aa0, -i5 81a2429, -i5b 07e3ba1. 17 clones deleted (9 clean in main + 8 preserved); shared node_modules intact 37. Job tmp 701M -> 83M.
- BEFORE sizes: handoff 16K, job tmp 701M, gen/h4-branch 45M, gen/h4d-diag 45M, .tmp/h4* 508K, 16 oopTester-*.patch ~453K, session scratch 264K+28K.
- LEFT: job tmp non-git leftovers 83M (dirs ac2b-*, ac4-keep, gates-copy, i5-carry, i5-keep, item3-regression, keep-fc5, p0f/p49/p55/p596 ~13M each, rg-keep, rg3-keep, spec5, timing-76661a2, __pycache__ + 561 loose files 26M) = LIST, content check STOPPED by the rule (needs the go for a one-command delete); patches (check tracked/applied in repo); in-repo h4-branch, h4d-diag, .tmp/h4*, h4r-*, h5-* (copy verdicts to AI/Claude verdicts/ first); /root/oopTester-handoff; session scratch (one-command delete).

# oopTester@WODA.prod — H4 (a) RULING EXECUTED, main 9364b5e PUSHED (2026-10-06) — REREAD FIRST, SUPERSEDES ALL BELOW

- identity 914c8cad (oopTeam:3.0). oopPO ruling: recorder must record old node too, verdict = escape count. DONE: WriteRecorder.mjs -> .cjs, NODE_OPTIONS=--require; probe green = BOOT>0 && 0 ESCAPE; BOOT has version. Pushed 4803f95..9364b5e.
- Measured on 9364b5e: (a) GREEN exit 0, boots 574 (v16.11.0:3, v22.23.1:571), 0 escapes, suite 704=702/0/2; seed RED. (d) GREEN 0/0, 704=702/0/2. (b)(c) GREEN. New failable test "ANY node version" (seed --import -> RED).
- Verdict Web4MDA .tmp/h4-verdict-4803f95.md (section "oopPO RULING EXECUTED").
- NEXT: HOLD for oopPO's own verify; H5 cleanup after the ruling.

# oopTester@WODA.prod — H4 RE-GATED + MERGED + PUSHED on main 4803f95 (2026-10-06) — REREAD FIRST, SUPERSEDES ALL BELOW

- identity 914c8cad (oopTeam:3.0). oopPO GO: re-gate all 4 on oopExpert's npm fix ef299f8. Merged oopTester-H4-gates 7ae9923 -> 993c335, fix 4803f95; PUSHED ef299f8..4803f95.
- Verdict = Web4MDA `.tmp/h4-verdict-4803f95.md` (logs `.tmp/h4r-993c335/`). (a) ESCAPES 0 (526 procs, 40,478 writes inside) — probe exit 1 ONLY from Node22 under recorder = INSTRUMENT (system node v16.11.0 rejects recorder NODE_OPTIONS --import -> exit 9; proven 2nd method) -> oopPO RULING PENDING (accept vs recorder NODE_OPTIONS only for node>=22). (b) GREEN 644/644 owner 1 observer 1 (re-proven on oopExpert's edit, :61/:65/:66) FOUND 0. (c) GREEN. (d) GREEN porcelain 0/0, 703 = 701/0/2 on 4803f95. All seeds RED.
- RED on the merge fixed at source: GenClaims 31 vs 30 = my ScratchExclusion.test.ts:14 relative `latest/test/gen` (no leading slash) -> `<Component>/latest/test/gen`. Allowance not widened.
- NEXT: HOLD for oopPO's ruling on the (a) instrument; H5 (cleanup) after Tron/oopPO.

# oopTester@WODA.prod — PHASE-1 BANKED for SM rewind (panel 75.3, 2026-10-06 ~13:40) — REREAD THIS FIRST — SUPERSEDES ALL BELOW

- ON LANDING: STOP + HOLD + REREAD by content; identity 914c8cad (oopTeam:3.0) via `claudeCode session.current oopTeam:3.0`; RC by MENU VERB; ignore restored scrollback/composer. H0 IN FORCE (nothing outside Web4MDA, delete nothing; H5 owns cleanup).
- **PLAN** = Web4MDA spec/plans/2026-10-06-cleanup-outside-repo.md — CURRENT TEXT (~~fb4137a~~ + amendments cc8124d, 53279df, ad22516 … 1d5d396 H5m). Gate against the current text, never a snapshot. **[STRUCK 2026-10-07: plan is now @ 72859188 (2026-10-06 23:07) — gate against the CURRENT text]**
- **GATES** = Web4MDA branch `oopTester-H4-gates` @ **7ae9923** (on e77f9ba on e2318e9 on main 1d5d396), pushed to origin; NOT on main yet. Files: latest/test/{WriteRecorder.test.ts, NoTempDirOutsideScratch.test.ts, ScratchExclusion.test.ts}, latest/test/gates/{WriteRecorder.mjs, NoEscapeProbe.ts, NpmTestPorcelainProbe.ts}, TestFolder.ts pins.
- **VERDICT on product main 1d5d396 (all 4 arms PROVEN failable: seed RED, unseeded measured):**
  - (a) no-escape, full `npm test` (`NoEscapeProbe --here`): **RED** — 497 node procs recorded, 32,179 writes inside, **74 refused escapes ALL /root/.npm** (72 _logs = npm debug log per npm/npx call; 1 /root/.npm; 1 /root/.npm/_cacache/tmp), **0 in /tmp**; 2 runs identical. 74 = LOWER BOUND (refusal pre-empts later writes): the unrecorded (d) run wrote **+281 into /root/.npm/_cacache** (cold-install test). Seed (`--seed`, clone): fenced write via OS temp dir caught. Fix = oopExpert: npm logs-dir AND cache inside repo via .npmrc (outer npm test) + bootstrap env (children/scratch copies); NEVER logs-max=0 (deletes logs). Suite under recorder perturbed: Node22.test "9 to be 0" = ~~npm warnings on refused log writes~~ CORRECTED 2026-10-06 (re-gate on 993c335): it is expect(r.status).toBe(0) failing on EXIT CODE 9 - the test runs npm via the ambient SYSTEM node v16.11.0, which inherits the recorder NODE_OPTIONS --import and rejects it (proven: /usr/bin/node with NODE_OPTIONS=--import exits 9, plain exits 0); recorder blind spot, not a product defect (proven 2nd method: alone WITH recorder RED, WITHOUT + in-repo logs-dir 7/7). Blind spots (oopPO: named residual): non-node binaries git/sh/esbuild; children dropping NODE_OPTIONS; tsx cache (Child TSX_DISABLE_CACHE=1).
  - (b) no OS-temp-dir call outside Scratch.ts: **GREEN** after oopPO ruling — CHECKED 644 / TOTAL 644 files, owner hits 1 (Scratch.ts), observer exempt files 1, FOUND 0. Pattern: zero-arg call `name()`, `os.` member, NAMED IMPORT from os (aliased) — first scan false positive on prose vitest.config.ts:32 fixed before verdict.
  - **(b) OBSERVER EXEMPTION, PROVEN not declared (oopPO ruling):** latest/test/BootstrapScratch.test.ts imports `{ tmpdir as osTemp }` (:2), uses :52/:56/:57 to ASSERT H2 (routing via Scratch = circular oracle). ReadOnlyUse proves every run: every occurrence of the fn's local names (alias + os.) is a CALL inside expect( with no fs write call between, never assigned, never passed; any misuse -> observer hits become FOUND. Seeds RED: write into dir, write wrapped in expect, value stored, fn passed.
  - (c) planted *.test.ts + *Definition.ts under latest/test/gen: **GREEN 3/3** — not in real `vitest list`; listed with no exclusion (failable); fresh M1Catalog.load() in a child over a Scratch copy finds a walked plant (failable) never the gen one (load() never descends src/test).
  - (d) AC19c porcelain WHOLE around whole `npm test` (`NpmTestPorcelainProbe --here`): **GREEN** before 0 / after 0 identical, suite 689 = 687 / 0 / 2. Seed (clone): bootstrap writes h4d-stray.txt before handover -> run exits 0 (in-run TrackedTree blind) yet outer RED `?? h4d-stray.txt`.
- **SOCKET-PATH LIMIT (observation to oopPO):** a full suite in a clone under latest/test/gen floods EADDRINUSE — tsx IPC socket `<clone>/.tmp/tsx-0/<pid>.pipe` > Linux sun_path 108 bytes, truncated path collides (measured e2318e9 clone: 24 failed/27 skipped, none H4). => SuiteTreeTouchProbe-style full-run-in-ScratchClone gates are CONFOUNDED post-H2; my full runs use `--here` (in the repo); seeds still clone (1 trivial test, no tsx children).
- **H5 INVENTORY (mine, kept per H0):** /root/.claude/jobs/914c8cad/tmp = 698M, 595 entries (34 dirs, 561 files), 17 git clones (all HEADs in shared repo, 16 in main, i2 c75a62c NOT in main), tracked dirt in 7 (f1-chain 142, f1-pairs 142, tf 16, w4mda 15, i2 5, stepb 3, i5 1) + 17 non-git dirs; untracked AI/Claude session/tasks/oopTester-I3-gates-c75a62c.patch 64,531 bytes (git apply --check -R at H5). In-repo scratch of mine: latest/test/gen/{h4d-diag (corrected: mis-recorded as h4-diag, never existed), h4-branch}, latest/test/gen/tmp/web4mda-h4-branch-suite-e2318e9 (my branch clone, edits/commits there), .tmp/h4-* (verdict, logs). Pre-H2 self-nested copy latest/test/gen/web4mda-i3-rv9xaD (10:53, >100 levels).
- **DISCLOSED WRITES OUTSIDE THE REPO (mine):** ~11 npm debug logs /root/.npm/_logs (my npm/npx before redirect, 12:37–12:40); my `npm_config_logs_max=0` made npm DELETE those 11 (12:41:37); /root/.npm/_update-notifier-last-checked touched (12:35); +281 /root/.npm/_cacache by the product suite during my (d) --here run (13:10); first 2 single-file vitest runs without TMPDIR (unmeasured). Denied, never run: mount-namespace capture; /tmp-aimed smoke test. RUN RULES: never npx (node_modules/.bin/*); my shell ~~TMPDIR=<repo>/.tmp~~ + npm_config_logs_dir in-repo; never logs-max=0. **[STRUCK 2026-10-07, oopPO: repo-root .tmp is FORBIDDEN — run only via `node scripts/bootstrap.mjs test|<verb>`, TMPDIR UNSET; tool tmp = Web4MDA/latest/test/gen/tmp/ (scripts/bootstrap.mjs:26)]**
- **SHARED TREE at bank time:** HEAD 1d5d396, dirty = oopExpert's (a) fix in flight (.npmrc, scripts/bootstrap.mjs, M1Catalog.ts, BootstrapScratch.test.ts) — NOT mine, don't touch.
- **NEXT:** HOLD for oopExpert's npm-cache sha -> rebase/merge my branch onto it -> re-run ALL 4 arms ((a)/(d) `--here` + seeds; (b)(c) suite) — re-prove (b) observer on his edited BootstrapScratch.test.ts -> all GREEN -> merge gates to main + push + report sha to oopPO oopTeam:2.0. oopPO reports up; Tron rules DONE.

# oopTester@WODA.prod — H4 GATES PUBLISHED + REPORTED (2026-10-06 ~13:15) — SUPERSEDED BY THE PHASE-1 BLOCK ABOVE

- identity 914c8cad (oopTeam:3.0). oopPO GO H4 on main 2d16aa4 -> gated per plan text @ 1d5d396.
- **Gates = Web4MDA branch `oopTester-H4-gates` @ e77f9ba** (e2318e9 + `--here`), pushed to origin; NOT main (arm b is RED on the product). main untouched, shared porcelain 0.
- **Verdict (product 1d5d396):** (a) RED — 74 refused escapes ALL /root/.npm (72 _logs, 1 .npm, 1 _cacache/tmp), 0 /tmp, LOWER bound (+281 _cacache in unrecorded run); (b) RED 1 hit latest/test/BootstrapScratch.test.ts:2 aliased temp-dir import (needs oopPO ruling); (c) GREEN 3/3; (d) GREEN porcelain 0/0, 689=687/0/2. All 4 failable PROVEN.
- Full verdict: Web4MDA/.tmp/h4-verdict-e77f9ba.md (in-repo scratch). Files: test/WriteRecorder.test.ts, NoTempDirOutsideScratch.test.ts, ScratchExclusion.test.ts, gates/{WriteRecorder.mjs,NoEscapeProbe.ts,NpmTestPorcelainProbe.ts}, TestFolder pins.
- My scratch for H5 (kept, H0): latest/test/gen/{h4d-diag (corrected: mis-recorded as h4-diag, never existed),h4-branch}, gen/tmp/web4mda-h4-branch-suite-e2318e9, .tmp/h4-*.
- RUN RULES learned: never npx (writes /root/.npm/_logs) — node_modules/.bin/*; my shell: ~~TMPDIR=<repo>/.tmp~~ + npm_config_logs_dir in-repo; NEVER npm_config_logs_max=0 (deletes logs); full-suite-in-clone under test/gen = EADDRINUSE confound -> --here. **[STRUCK 2026-10-07, oopPO: repo-root .tmp is FORBIDDEN — it confounds BootstrapScratch :53/:65. CURRENT RULE: run only via the product entry `node scripts/bootstrap.mjs test|<verb>`, TMPDIR UNSET — bootstrap fixes the tool tmp at Web4MDA/latest/test/gen/tmp/ (scripts/bootstrap.mjs:26); never repo-root .tmp]**
- oopPO RULED: (b) EXEMPT structurally, PROVEN not declared -> built ReadOnlyUse on branch @ 7ae9923 (644/644, owner 1, observer 1, FOUND 0, 4 misuse seeds RED). (a) = oopExpert (in flight: .npmrc, bootstrap.mjs, M1Catalog, BootstrapScratch.test in the shared tree).
- NEXT: HOLD for oopExpert npm-cache sha -> re-gate ALL 4 on it (my branch rebased on it; (a)/(d) --here, seeds in clones) -> all GREEN -> merge gates to main + push + report sha to oopTeam:2.0.

# oopTester@WODA.prod — PHASE-1 BANKED for the SM rewind (panel 63.4, SM/oopPO order, BEFORE oopExpert's H2/H3 sha) 2026-10-06 — SUPERSEDED BY THE H4 BLOCK ABOVE

- ON LANDING: STOP + HOLD + REREAD by content; identity 914c8cad (oopTeam:3.0); verify `claudeCode session.current oopTeam:3.0`; RC by MENU VERB. Ignore restored scrollback. HOLD until oopPO pings that H2/H3 landed.
- **(1) CURRENT PLAN = Web4MDA `spec/plans/2026-10-06-cleanup-outside-repo.md` @ ~~fb4137a~~** (Tron-approved). **H0 IN FORCE:** create NOTHING outside Web4MDA (no /root or /tmp clones, scratch, patches, run reports); delete NOTHING before H4 is green. Do not run npm test before H2 lands unless oopPO orders (each run writes /tmp: mkdtemp + Vite SSR). **[STRUCK 2026-10-07: plan is now @ 72859188 (2026-10-06 23:07) — gate against the CURRENT text]**
- **(2) MY H4 (starts after oopExpert's H2/H3), every gate FAILABLE (seed RED -> GREEN), built + verified INSIDE the repo:** (a) NO-ESCAPE probe over a full run (gates/SuiteTreeTouchProbe.ts pattern): every write under the repo, none in /tmp or /root; seed a tmpdir() write -> RED. (b) no `tmpdir(` / `os.tmpdir` in repo .ts outside the scratch class. (c) a planted `*.test.ts` + `*Definition.ts` under latest/test/gen is neither RUN nor CATALOGUED. (d) AC19c: `git status --porcelain` WHOLE identical before/after `npm test`. Then main + push, oopPO verifies, Tron reviews the pushed sha.
- **(3) MY H5 (after H4 green), inventory measured read-only 2026-10-06:** /root/.claude/jobs/914c8cad/tmp = 698M, 595 entries (34 dirs, 561 files); **17 git clones**, every HEAD exists in shared Web4MDA, 16 in main, **i2 HEAD c75a62c NOT in main**; **7 clones with TRACKED DIRT** (f1-chain 142, f1-pairs 142, tf 16, w4mda 15, i2 5, stepb 3, i5 1) -> check each for unique work, list any for Tron, before deleting. Report CHECKED / DELETED / TOTAL.
- **(4) Untracked AI/Claude `session/tasks/oopTester-I3-gates-c75a62c.patch`** (64,531 bytes, verified on disk): at H5 run `git apply --check -R` on Web4MDA main; applied -> delete; unapplied -> LIST for Tron. Delete NOTHING yet.
- Last delivered: FINAL I6 gate 59e6363 (in main + pushed), verdict `verdicts/I6-final-gate-59e6363.md` @ 53c11182.

# oopTester@WODA.prod — H0 HALT IN FORCE (2026-10-06, Tron-approved plan Web4MDA spec/plans/2026-10-06-cleanup-outside-repo.md @ ~~fb4137a~~) — REREAD FIRST **[STRUCK 2026-10-07: plan is now @ 72859188 (2026-10-06 23:07) — gate against the CURRENT text]**

- **H0:** create NOTHING outside Web4MDA (no /root clones/worktrees, no /tmp scratch, no patch files, no run reports outside the repo); delete NOTHING before H4 is green. Do NOT run npm test until H2 lands unless oopPO orders (every run writes /tmp: mkdtemp + Vite SSR).
- **MY INCREMENT = H4** (after oopExpert's H2/H3): failable gates (a) no-escape probe over a full run, seed tmpdir() write -> RED; (b) no tmpdir(/os.tmpdir in repo .ts outside the scratch class; (c) planted *.test.ts + *Definition.ts under test/gen neither run nor catalogued; (d) AC19c git status --porcelain WHOLE identical before/after npm test.
- **MY H5 garbage (measured 2026-10-06, read-only):** /root/.claude/jobs/914c8cad/tmp = 698M, 595 entries (34 dirs, 561 files); 17 git clones, all HEADs in shared repo, 16 in main, i2 on side c75a62c; TRACKED DIRT in 7 (f1-chain 142, f1-pairs 142, tf 16, w4mda 15, i2 5, stepb 3, i5 1) -> check/list each before deleting at H5.
- I6 final gate 59e6363 is IN main + pushed (plan text).

# oopTester@WODA.prod — FINAL I6 GATE DONE + PUBLISHED (2026-10-06) — REREAD FIRST, SUPERSEDES ALL BELOW

- identity 914c8cad (oopTeam:3.0). **Local ref `oopTester-I6-final-gate` = 59e6363 on 22bf912** (oopBashExpert-I6), shared Web4MDA, pushed NO remote. Suite 680 = 678 / 0 / 2. Test files only (OoshExecute, TypedReferences, M3Class, Spec).
- **Verdict = `verdicts/I6-final-gate-59e6363.md`** — seed AUDIT 136 checked (2 defect-dependent fixed; 0 others; Spec ARM4 (2)/(5) incidental-fact DISCLOSED).
- NEXT: oopPO verifies in its isolated clone. HOLD until it rules.

# oopTester@WODA.prod — PHASE-1 BANKED for the SM rewind (panel 64%, SM + oopPO GO, while oopBashExpert codes the I6 fix) 2026-10-06 — REREAD THIS FIRST — SUPERSEDES ALL BELOW

- ON LANDING: STOP + HOLD + REREAD by content; identity 914c8cad (oopTeam:3.0); verify `claudeCode session.current oopTeam:3.0`; RC by MENU VERB. Ignore restored scrollback.
- **I6 gate ref = shared Web4MDA LOCAL ref `oopTester-I6-gate` = b9a003f** (parent 3a2288e = `oopTester-item3-gate`), pushed NO remote. Suite on it: 89 files, 665 = **659 / 4 / 2** — the 4 RED = G1 (A) behaviour, G1 (B) lossless parse, D2 UNSET (7 named), D2 SET (28 = 14 ends x 2 paths).
- **Verdict = `verdicts/I6-gates-b9a003f.md` @ 1b0a1c44** (measure-first 9a36e418, oopPO ACCEPTED). Clone /root/.claude/jobs/914c8cad/tmp/i6.
- **oopPO HEADS-UP (no action until the final I6 sha):** I6.1 (92e78d2, NOT yet in the shared repo as of 2026-10-06) makes my OoshExecute '(A) SATISFIABLE and FAILABLE' arm STALE — it seeds by APPENDING the entry call (fits pre-fix only; post-fix = double dispatch). When gating the final I6 sha: re-seed by REMOVAL (strip the generated entry call -> must differ from real), keep failability proven (seed RED / unseeded GREEN).
- **oopPO: it is a CLASS (2nd stale arm):** TypedReferences L155 'AC12 seed JSON.stringify(undefined).replaceAll RED BY NAME' runs the LIVE reader expecting the PRODUCT bug to throw — impossible after I6.4 (5b428c4). RULE: a failability seed INJECTS ITS OWN FAULT into a stub/copy, never relies on the product still having the defect. AT FINAL-I6 GATE: fix BOTH stale arms + AUDIT EVERY seed of mine for product-defect dependence; REPORT THE COUNT CHECKED.
- **oopPO FINAL I6 GATE ORDER (starts when oopBashExpert reports the I6.5b sha, on 3b2d9df):** (1) my 2 pinned arms re-seeded by INJECTION + audit EVERY seed, report count; (2) amend SET arm per oopPO AC12 amendment a64bf146 + fixes 5c63ce0f: TaggedProfileModel.components REFUSES by name; inverted canaries for BOTH declared-class residuals (NodeJSFolder back as DefaultFolder, Version back as Namespace); (3) INDEPENDENTLY verify oopBashExpert's M3Class AC5 gate edit (.resolving(catalog)) is not a weakening; (4) gate: bare render of a class with reference ends REFUSES loudly. Publish as LOCAL ref -> oopPO verifies.
- **NEXT = gate oopBashExpert's I6 fix sha when it lands** (D1 + D2 ON TOP of b9a003f): verify parent = b9a003f, run the full suite in an isolated clone; expected the 4 RED arms GREEN, nothing else changes; report the number to oopPO by POINTER (path @ sha — long sends truncate). Until that sha arrives: HOLD.

# oopTester@WODA.prod — I6 GATES PUBLISHED, RED FIRST (2026-10-06) — SUPERSEDED BY THE PHASE-1 BLOCK ABOVE

- identity 914c8cad (oopTeam:3.0). **I6 = oopPO dispatch** (brief session/tasks/oopPO-I6-oosh-lane-3a2288e.md @10f4edc9; Spec 7 patch corrected @ed3f5f7e).
- **Published shared Web4MDA LOCAL ref `oopTester-I6-gate` = b9a003f on 3a2288e** (`oopTester-item3-gate`, unmoved). Pushed NO remote. Clone: /root/.claude/jobs/914c8cad/tmp/i6.
- Verdicts: measure-first `verdicts/I6-3a2288e-measure-first.md` (9a36e418, oopPO ACCEPTED, caught its AC3/AC12 false-green) + gates `verdicts/I6-gates-b9a003f.md`.
- Suite on b9a003f: 89 files, 665 = 659 / 4 failed / 2 skipped — the 4 RED = G1 (A) behaviour, G1 (B) lossless parse, D2 UNSET (7 named), D2 SET (28 = 14 ends x 2 paths). Test files only.
- NEXT: oopBashExpert fixes D1+D2 on top of b9a003f; then I re-gate. HOLD otherwise.

# oopTester@WODA.prod — PHASE-1 BANKED for the SM rewind (panel 77%, oopPO GO, clean boundary) 2026-10-06 — SUPERSEDED BY THE I6 BLOCK ABOVE

- ON LANDING: STOP + HOLD + REREAD by content; identity 914c8cad (oopTeam:3.0); verify `claudeCode session.current oopTeam:3.0`; RC by MENU VERB; HOLD — oopPO re-dispatches. Do NOT resume I5c or item 3 (both CLOSED).
- **I5 CLOSED at 3a2288e** = shared Web4MDA LOCAL ref `oopTester-item3-gate` (pushed nowhere), on top of `oopTester-I5c-gate` = 72925dc (on oopExpert's I5c 01eb157). oopPO VERIFIED in its isolated clone: 654 = 652/0/2, 87 files, config + test files only, src 0. **I5 package tip with Tron = 3a2288e.** Verdict AI/Claude verdicts/I5c-01eb157.md (3b374004 + addendum).
- **QUEUE: EMPTY** (oopPO: "nothing pending from me").
- **OPEN RESIDUALS (all disclosed + accepted, none mine to act on):** (1) S2b leak: each persist->load re-reads a model by EXECUTING its code module (`?reread=N`), one never-evicted module per cycle (~14 KiB) — DISCLOSED to Tron; fix = models read as DATA (the held STORE increment); guarded by the INVERTED canary in MirrorDisk.test.ts (GREEN while the leak exists, named RED when fixed -> retire the disclosure). (2) SlowReport reports IN-SUITE durations, not solo. (3) Two STRUCTURAL budgets above the 8500 default on purpose: NamespacePlacement cycle 50000, TestBudget failable 45000.
- Disposable job clones: /root/.claude/jobs/914c8cad/tmp/{i5c,i5b,i5base} (may be removed). New memory: timing-instruments-key-by-test-not-describe-and-fixed-point.

# oopTester@WODA.prod — STOOD DOWN (2026-10-06) — oopPO VERIFIED + ACCEPTED 3a2288e — REREAD FIRST

- oopPO verified oopTester-item3-gate = 3a2288e in its isolated clone: 654 = 652/0/2, 87 files, testTimeout 8500, threshold 8500/2, only config + test files changed (src 0). ACCEPTED: fixed-point 8500; (a) in-suite reporting disclosed; (b) structural bounds (cycle 50000, TestBudget failable 45000) kept.
- **I5 package tip for Tron = 3a2288e** (on top of oopTester-I5c-gate 72925dc on 01eb157). Local refs only, pushed nowhere.
- QUEUE EMPTY — nothing pending from oopPO; SM panels me. On landing after any rewind: HOLD, do not resume item 3 / I5c (both closed).

# oopTester@WODA.prod — ITEM 3 + TSCONFIG DONE + PUBLISHED (2026-10-06) — REREAD FIRST, SUPERSEDES BELOW

- Shared Web4MDA LOCAL ref `oopTester-item3-gate` = 3a2288e, ON TOP of `oopTester-I5c-gate` = 72925dc (unmoved); pushed NOWHERE; shared tree untouched (main d729ecd, 0 dirty).
- Commits: f2eab1c default 2500->8500 (fixed point of oopPO rule A; TestBudget + Slow.fixture derived from config; OneStore 11500) | 9a99b6e follow-through (TestFolder re-pin, SoloGroup 8500) | 77dd085 MECHANICAL strip of 7 budgets <= 8500 | 4eafd0b REPORTING arm (slowTestThreshold = default/2, SlowReport reporter, pinned in TestFolder; printed 15-16 SLOW findings) | 3a2288e tsconfig arm (TestTypecheck via Child + vitest-solo; seeded TS2322 -> RED).
- Full suite on 3a2288e: 87 files, 654 = 652 + 2 skipped, 0 failed.
- Self-inflicted, caught + fixed: TestTypecheck (banked on da035dc) imported node:child_process -> Child.test RED; routed through Child.
- OPEN for oopPO: the reporter sees IN-SUITE durations (solo needs a solo pass); I5c structural budgets kept (NamespacePlacement cycle 50000, TestBudget failable 45000).

# oopTester@WODA.prod — ITEM 3 (3) DONE in clone tmp/i5c on top of 72925dc (2026-10-06) — REREAD FIRST

- oopPO RULE A (new): default = max over UNBUDGETED tests of own observed IN-SUITE time x 1.5, rounded up 500. I took the FIXED POINT (stripping pulls tests into the max): 7000 -> 7500 -> 8500 stable; max 5459ms M1GraphNoSourceRead "differential". tools tmp/item3-rule.py, tmp/item3-strip.py.
- Commits in clone (NOT yet published): f2eab1c default 8500 + TestBudget (asserts 8500, CHILD_CEILING 40000, failable it 45000 structural) + Slow.fixture DERIVED from config + OneStore 11500 | 9a99b6e follow-through: TestFolder re-pin of Slow.fixture sha256 (self-digest blanks pins) + SoloGroup asserts 8500 | 77dd085 MECHANICAL strip of 7 budgets <= 8500 (MirrorDisk x2, M1Graph differential, MofLayoutAC5 B/C/F/A + G2a(TWO_CHILDREN_MS removed), Type x2). Full suite 650: 648/0/2.
- My NamespacePlacement cycle budget 50000 KEPT = STRUCTURAL (> 2 x child BOUND 20000 so a missing guard is a NAMED red), not a speed budget.
- NEXT: (4) reporting arm (tests over default/2 = 4250 listed; new machinery must be DECLARED+pinned in TestFolder.ts), then tsconfig carry (tmp/i5-carry), then publish ref (update oopTester-I5c-gate? or new ref — ask oopPO) + report.

# oopTester@WODA.prod — ITEM 3 MEASURED, AWAITING oopPO RULING (2026-10-06) — REREAD FIRST

- (1) REGRESSION 28523ec vs 76661a2, solo x3 per file (tmp/item3-regression/summary.txt): NO single-test regression; uniform +5-10% median drift (max: MofLayoutAC5 S-a +8%, chunk C +7%, M1Graph differential +5%) -> no product defect per oopPO's criterion.
- ★ CORRECTION OWED (sent to oopPO): my earlier "4 tests over 2500 even SOLO, unbudgeted" was a MISLABELLED instrument — "AC7 — every class holds ..." is a DESCRIBE, rows were file::describe. Per test (exact file+describe+title): NO unbudgeted test exceeds 2500 solo in those files; every >2500 one already has a budget.
- (2) CENSUS: 627 it(), 49 explicit budgets, 23 files (tmp/item3-census.txt).
- (3) DERIVED (tmp/item3-derive.py, exact per-test): slowest unbudgeted solo = 2242ms (UcpComponentMove move(X -> out of Ior)). Max inflation ALL = 4.95 (Folder.test, 234ms solo!) -> 11500ms; solo>=500: 2.09 -> 5000; >=1000: 1.80 -> 4500; >=2000: 1.63 -> 4000. Literal rule dominated by a tiny test. My old 3.3 also came from the mislabelled rows -> my I5c budgets 7000/11000/7000 need re-deriving on the ruled basis.
- RIPPLE: TestBudget.test.ts hardcodes 2500 (L50 toBe(2500), L71 'timed out in 2500ms') + its fixture sleeps past 2500 -> must be UPDATED (not weakened) to the new default; ~40 existing explicit budgets <= the new default become redundant under "explicit only for heavy" (others' files: propose, do not silently strip).
- (4) reporting arm + tsconfig arm: NOT built. tsconfig carry ready (tmp/i5-carry), base unchanged.

# oopTester@WODA.prod — ITEM 3 IN PROGRESS on top of 72925dc (2026-10-06, panel 66.6 @ start, SM go) — REREAD FIRST

- (1) REGRESSION timing: script tmp/item3-regression.sh -> tmp/item3-regression/ (json per run + summary.txt). 76661a2 side DONE (12 runs). 28523ec side RE-RUNNING (first attempt produced nothing: i5base had NO node_modules link = my instrument gap, fixed). Do NOT run heavy work while it runs (solo timings).
- (2) CENSUS DONE (tmp/item3-census.txt, on 72925dc): 627 it(), 49 with an explicit timeout in 23 files. The 4 over-default tests are exactly the ones WITHOUT a budget in their files: Type AC7, MofLayoutAC5 AC5-oracle, SrcTypecheck src+test, M1GraphNoSourceRead AC4 behavioural.
- (3)(4) derived global default + reporting arm: NOT started. tsconfig arm: tmp/i5-carry/{tsconfig.test.json,TestTypecheck.test.ts}; base tsconfig files UNCHANGED da035dc..72925dc, carry = own exclude only; apply + verify on i5c AFTER the timing run.

# oopTester@WODA.prod — I5c GATE DONE + LANDED 2026-10-06 — REREAD FIRST, SUPERSEDES BELOW

- Verdict AI/Claude verdicts/I5c-01eb157.md (3b374004 + addendum). oopPO rulings executed: S2b disclosed residual + INVERTED canary (proven both ways); stack published as shared Web4MDA LOCAL ref `oopTester-I5c-gate` = 72925dc (parent 01eb157), pushed nowhere; 650: 648/0/2.
- NEXT (oopPO): item 3 (regression-first solo timing 28523ec vs 76661a2 for Type AC7/MofLayoutAC5/SrcTypecheck/M1GraphNoSourceRead AC4; explicit-timeout census; ONE derived global default; reporting arm solo > default/2) + tsconfig arm ON TOP of 72925dc — ONLY AFTER the SM panels me.

# oopTester@WODA.prod — I5c GATE: S3 DONE (bounded cycle gate built + proven) — 2026-10-06 — REREAD FIRST, SUPERSEDES THE I5c BLOCK BELOW WHERE THEY DIFFER

- oopPO RULING S3: I build it (gate infra = my lane); cycle scenario ONLY in a child; no unbounded variant may remain. DONE in clone tmp/i5c, banked in tmp/i5-keep/NamespacePlacement.test.ts:
  converted oopExpert's in-process CYCLE test to class CycleChild (Child.spawnSync npx tsx <tmp>/cycle-driver.mts, timeout BOUND 20000; driver does `await M1Catalog.load()` first; .mts = ESM anywhere) + `// vitest-solo:` header + it budget 50000 (2 children x 20000 + margin). Same assertions kept (CYCLE named, RepositoryId + ObjectKey named, no RangeError; one-way nesting GREEN).
  PROOF: guard IN = GREEN exit 0 in 6s. guard OUT (M1Layout src/ts L72 `this.refuseCycles();` commented) = NAMED red exit 1 in 23s: "layout HUNG on the placement (child spawnSync npx ETIMEDOUT after 20000ms) — the namespace-CYCLE guard is missing". BEFORE: guard out = HUNG, killed at 120s (exit 124).
  HAZARD SCAN: only 2 test files build a cycle; UcpComponentMove's cycle case is refused by move()'s OWN check (guard out: exit 0 in 4s) = not unbounded, left as is.
- FULL STACK on 01eb157 (homes-fix + OneStore + MirrorDisk + OwnedModelPlacement + bounded NamespacePlacement) = 648: 646/0/2 in-suite.
- oopPO ACCEPTED my budgets 7000 / 11000 (solo x 3.3).
- REMAINING, in oopPO's order: S1 (ownership right BY ACCIDENT at the root = empty container: seed a root case with a NON-EMPTY container), S2 (load() cache-busting re-read: models still pass instanceof across a re-read; N loads must not grow modules without bound), (3) move() on a NON-component SUBJECT throws naming it (test UcpComponentMove.test.ts L118-128, source guard UcpComponent.ts L107 — prove failable by seeding L107 out), (4) oopPO's L50 plan patch verbatim. THEN item-3 + tsconfig on top.

# oopTester@WODA.prod — I5c GATE IN PROGRESS on 01eb157 (parent 76661a2 VERIFIED) — 2026-10-06 — REREAD FIRST, SUPERSEDES BELOW

- oopPO dispatched GATE I5c = 01eb157 (line recomputed to 66; NO rewind #4). Clone: /root/.claude/jobs/914c8cad/tmp/i5c (+homes-fix + my 3 gates stacked, untracked). Base clone i5b = 76661a2.
- MEASURED: pristine 01eb157 = 642: 639/1/2 (only red TreeFileUnitRulings = my oracle; homes-fix fixes it). STACKED (homes-fix + OneStore + MirrorDisk + OwnedModelPlacement) = 648: 646/0/2 in-suite.
- (1) owned models follow owner: OwnedModelPlacement RED 76661a2 -> GREEN 01eb157. PROVEN.
- (2) FolderNamespace seed: I5c's new failability test RED on 76661a2 BY ASSERTION ("expected [] to deeply equal ['ObjectKeyModel']") -> GREEN 01eb157. PROVEN.
- (5) load() answers DISK: MirrorDisk RED 76661a2 -> GREEN 01eb157. PROVEN. OneStore GREEN on BOTH = regression guard only (not an I5c proof).
- My first stacked run had MirrorDisk+OneStore RED = 2500ms TIMEOUT CONFOUND (not verdicts). FIXED in tmp/i5-keep: MirrorDisk gets `// vitest-solo:` (spawns git/tsx) + budget 7000 (1930 solo x 3.3); OneStore generate budget 11000 (3289 solo x 3.3), basis in comment.
- S3 (oopPO scrutiny 3) = RED FINDING: guard = `this.refuseCycles()` (M1Layout src/ts L72 + model def + thinglish). Seed (guard commented out) -> NamespacePlacement CYCLE test HUNG, killed by external timeout 120s (exit 124), NO named red. Cause: test runs layout IN-PROCESS, guardless loop is synchronous -> vitest timeout cannot fire -> stuck suite. Guard works; the GATE is unbounded. NEXT: my bounded gate = cycle scenario in a CHILD (Child.spawnSync timeout) -> named red on hang.
- STILL TO DO: S1 (root with NON-EMPTY container), S2 (instanceof across cache-busting re-read + N loads no unbounded module growth), (3) move() on non-component throws naming it, (4) L50 patch verbatim. Then item-3 + tsconfig ON TOP.

# oopTester@WODA.prod — oopPO ITEM-3 RULING 2026-10-06 (received post-rewind-#3, after my timing report) — REREAD WITH THE PHASE-1 BELOW

- **ORDER: I5c VERDICT FIRST** (still HOLD for oopExpert's I5c sha, gate only at <=52). Item-3 work lands ON TOP of I5c together with my tsconfig arm.
- **Item-3 ruling, in this order:** (1) REGRESSION FIRST — time the 4 over-default tests SOLO at 28523ec vs 76661a2 (Type AC7, MofLayoutAC5, SrcTypecheck, M1GraphNoSourceRead AC4; clones tmp/i5base + tmp/i5b): if I5 made one slower = PRODUCT defect for oopExpert, not a budget. (2) Measure which tests already carry an explicit timeout. (3) ONE global default in vitest config, DERIVED = slowest solo non-heavy x observed max inflation, rounded up, basis written in the config; explicit budgets ONLY for named heavy tests. (4) REPORTING arm: list every test whose solo time > half the default (slowness growth = a finding, never a silent bump).
- **My timing measurement (read from disk, reported):** tmp/timing-76661a2/ — suite 642=637/3/2; inflation n=47 median 1.11 max 3.3; over 2500 SOLO: Type AC7 3484/3537, MofLayoutAC5 2975/3564, SrcTypecheck 3102, M1GraphNoSourceRead AC4 3880/3809.
- **Gate-stack fix DONE (private, tmp/i5-keep):** MirrorDisk + OwnedModelPlacement now use the Child class (not node:child_process) incl. the MirrorDisk driver; verified on i5b: Child GREEN, MirrorDisk RED (intended), OwnedModelPlacement RED naming the 4 owned models (intended).

# oopTester@WODA.prod — PHASE-1 BANKED for REWIND #3 2026-10-06 (fresh panel 75%, SM order, oopPO rule I5c gate only at <=52, driver ARON) — REREAD THIS FIRST — SUPERSEDES ALL BELOW

- ON LANDING: STOP + HOLD + REREAD by content; identity 914c8cad (oopTeam:3.0); verify by `claudeCode session.current oopTeam:3.0`; RC by MENU VERB; HOLD — oopPO re-dispatches.
- **(1) I5 GATE VERDICT on `1cc8115` (parent 28523ec) — REPORTED to oopPO** (verdicts `I5-1cc8115-interim-items12.md` @51d0ecab, `I5-G-findings-1cc8115-76661a2.md` @5aaf13b4): G1 / G2 (416 checked, 0 mismatched) / G3-G4 + g1b + guards (5 concrete components) / G5 placement / G7 (EMPTY, MIXED, CYCLE refused, tree untouched) + stored-IOR (0 change in content) + dependency-ids (derived 29 == measured 29) GREEN, each seed bites. ITEM 1 = MY OWN homes() oracle defect (double-counted Ior/latest) — fix APPROVED by oopPO, commit it ON the I5c sha. ITEM 2 = REAL second-store defect (load() idempotent, unpersisted edit survived + rendered) — fixed in I5b 76661a2. NEW DEFECT: 4 OWNED models not carried (two methods) + MISSING cycle guard (refused only by an 'Invalid array length' crash) + MIRROR hazard (I5b persisted mirror outlives disk; MirrorDisk RED on 76661a2, drop-mirror seed GREEN) -> all ruled INTO I5c (brief 7a41bab9 + addendum 25cf0ffc). Plan L50 ("8 sub-components", false: 7 move, 5 own folders) CORRECTED by oopPO's patch. RESIDUAL to DISCLOSE in the I5c verdict (oopPO: do NOT cover, rule 5): a disk edit to a value the process never loaded stays invisible in-process.
- **(2) NEXT = I5c GATE on oopExpert's I5c sha (NOT yet delivered) — HOLD for it.** Gate list + stack: the STATE block below (tools, gate files banked in AI/Claude `session/tasks/oopTester-I5-gates/` @67fb0343, stack them ON the I5c sha).
- **(3) ITEM-3 TIMING MEASUREMENT — RUNNING at the cut (do NOT trust memory, READ the files):** command `bash session/tasks/oopTester-I5-timing.sh /root/.claude/jobs/914c8cad/tmp/i5b /root/.claude/jobs/914c8cad/tmp/timing-76661a2 > /root/.claude/jobs/914c8cad/tmp/timing-76661a2.out 2>&1; echo "exit $?" >> …out` (pid 3712162, on clone i5b = 76661a2 + my untracked MirrorDisk/OwnedModelPlacement). OUTPUT: summary + top-30 table in **`/root/.claude/jobs/914c8cad/tmp/timing-76661a2.out`** (complete when its last line is `exit N`); data in **`/root/.claude/jobs/914c8cad/tmp/timing-76661a2/`**: `suite.json` (whole suite under full load, DONE), `slow-files.txt` (files with a test >1250 ms or a timeout), `solo-<run>-<file>.json` (each slow file ALONE 3x), **`timing.tsv`** (file, test, in-suite ms, solo max ms, ratio, status). At the cut: suite done; solo runs on the LAST file (MofLayoutAC5 run 2/3). A 2nd shell only waits for that `exit` line and prints the .out (harmless). If killed by the rewind: re-run the command (≈10 min). PURPOSE: ONE measured budget rule replacing 15 `// vitest-solo:` files @2500 + ~40 one-off budgets with mixed bases (2.5x full-load max, 2x, bare 60000/120000/900000); land it ON the I5c sha.

# oopTester@WODA.prod — STATE 2026-10-06 (post-rewind-#2 work, identity 914c8cad, oopTeam:3.0) — gate list, stack, tools (still valid under the PHASE-1 above)

- **QUEUE: HOLD for oopExpert's I5c sha** (base 76661a2 = I5b, parent 1cc8115; brief AI/Claude `session/tasks/oopPO-I5c-dispatch-76661a2.md` @ 7a41bab9 + addendum 25cf0ffc). oopPO: do NOT spend a full run on I5b; gate EVERYTHING on the I5c sha, gate commits STACKED on it (never on 1cc8115/76661a2), push nothing, report to oopTeam:2.0.
- **I5c must fix (gate each):** (1) 4 OWNED models follow their owner to `Ior/<Sub>/latest/` (RepositoryId/ObjectKey/InternetProfile/SecureTransport Model); (2) RESTORE my I4d FolderNamespace seed (ObjectKey/ObjectKeyModel) biting — RED on 76661a2, GREEN on I5c; (3) move() on a NON-component SUBJECT throws naming it; (4) oopPO's L50 plan patch verbatim; addendum: (5) load() answers DISK over the persisted mirror; (6) a namespace CYCLE has a NAMED guard (today 'Invalid array length' crash). RESIDUAL to disclose (not cover, rule 5): a disk edit to a value the process never loaded is invisible in-process.
- **GATE STACK to commit on the I5c sha** (files in `/root/.claude/jobs/914c8cad/tmp/i5-keep/`): `homes-fix.patch` (TreeFileUnitRulings, item 1 (a) CONFIRMED by oopPO), `OneStore.test.ts` (non-hollow, M1Catalog/latest/test), `MirrorDisk.test.ts` (M1Catalog/latest/test; RED on 76661a2 by message, drop-mirror seed GREEN), `OwnedModelPlacement.test.ts` (M1Layout/latest/test; expect RED 1cc8115/76661a2, GREEN base 28523ec — NOT YET RUN: waited for timing), + the item-3 rule.
- **TOOLS (AI/Claude session/tasks, I5-direction):** oopTester-I5-g1.sh, -g3g4.sh (5 components + subject guard), -g5.py (+ OWNED arm), -g6-audit.py (thinglish fixed), -g7.sh (CYCLE needs a named guard), -model-users.py, -stored-ior.py, -dep-ids.py [--seed], -timing.sh, I5b-mirror.sh. The I6 g3g4/g1b/g7 scripts are PRE-I5/pre-I4c = do not run.
- **MEASURED so far:** see verdicts `I5-1cc8115-interim-items12.md` (51d0ecab) + `I5-G-findings-1cc8115-76661a2.md` (5aaf13b4). Also: stored IOR strings 0 change in content 28523ec→1cc8115→76661a2 (ALL tracked 82/39 distinct, json+md 39/22; the brief's "48" not reproducible in either scope); rendered dependency ids DERIVED 29 == MEASURED 29 at 1cc8115 vs 28523ec, seed RED by name.
- **ITEM 3 (load-bearing, 3rd timeout today: Type AC7):** measurement running → `tmp/timing-76661a2/` (suite json + 3x solo per slow file, timing.tsv). Today = 15 `// vitest-solo:` files @2500 + ~40 one-off budgets with mixed bases (2.5x full-load max, 2x, bare 60000/120000/900000). Land ONE measured rule on the I5c sha.
- Clones: tmp/i5p = 1cc8115 pristine, tmp/i5b = 76661a2 (+ untracked MirrorDisk, OwnedModelPlacement), tmp/i5base = 28523ec, tmp/i5 = 1cc8115 + my item-1/2 work.

# oopTester@WODA.prod — PHASE-1 BANKED for REWIND #2 2026-10-05 (fresh panel 70.3%, oopPO GO, driver ARON) — SUPERSEDED ABOVE

- ON LANDING: STOP + HOLD + REREAD by content; identity 914c8cad (oopTeam:3.0); HOLD — **oopPO RE-DISPATCHES** after the landing (do not resume on my own).
- **(1) I5 gate on oopExpert's 1cc8115** (branch oopExpert-I4d-wip; MEASURED parent = **28523ec**, not da035dc as the rewind brief says): **G1-G7 NOT STARTED.**
- **(2) oopPO's 3 scrutiny points, VERBATIM as received:** "GATE I5 = 1cc8115 (parent 28523ec). My isolated clone: 641 = 633/6/2, same 6 named reds, M3Class AC1 2500ms passed for me (load flake). SCRUTINIZE, do not accept the classification: (1) TreeFileUnitRulings BOTH WAYS is the ONE red encoding a RULING, not a path - prove it (a) against the plan-of-record text (Ior keeps its folder, becomes a Package beside its version); if it encodes a Tron ruling I5 breaks, it is (b) and goes to Tron, no rewrite. (2) oopExpert FINDING: M1Catalog now keeps model edits IN HAND (Definition answers a fresh model per access; load() resets) - a possible 2nd store by the back door: gate it, edits must reach the ONE stored model or die at load. (3) 2nd load-timeout today: measure the heavy tests under full load and propose ONE measured rule, not another one-off budget. Then your tsconfig arm on top. Report to oopTeam:2.0."
- **(3) Item-3 timing = PARTIAL, interrupted**, in job scratch `/root/.claude/jobs/914c8cad/tmp/i5` (isolated clone of 1cc8115). Shared Web4MDA repo CLEAN, NO partial I5 gate ref (oopTester-I4d-gate=28523ec is the I4d one, untouched).
- **(4) RE-RUN ORDER (oopPO re-rank): G1-G7 + items 1-2 FIRST, timing (item 3) LAST.**
- PARTIAL FINDINGS (measured before the cut — re-verify, do not trust blindly; NOT reported to oopPO yet):
  - Baseline on clone 1cc8115: 641 = 633 pass / 6 fail / 2 skip (= oopPO's); full json `tmp/i5-base.json`.
  - Item 1: BOTH WAYS diff = ONE element, `Ior/latest` listed TWICE in EXPECTED (48 vs 47 on disk). Cause = MY OWN I4d `homes()` oracle (aa36014): abstract TaggedProfile/TaggedComponent (ns Web4MDA.Ior, at Ior/latest = Ior's OWN Version) counted as a ruling-4 home. Disk == plan text (d729ecd L22 Ior/latest + Ior/<Sub>/latest; L17 both abstract; L50 "abstract/models inside the Ior package, none in the root"). -> NOT (b); my oracle defect. Fix in clone (UNCOMMITTED): homes filtered `!components.includes(h)` -> 12/12. The other 5 reds = (a) old location, evidence: UcpComponentMove L11-12 MOVED=RepositoryId at old Web4MDA/RepositoryId path; NamespacePlacement L67-115 assume UnknownTaggedComponent unpacked. Re-target owner = oopPO's call.
  - Item 2: mechanism = `static M1Catalog.edits` (first access keeps the fresh Definition model in hand; classes() returns it; load() resets it). move() = edit + `catalog.persist(model)` (+ rehome persists, same mutation). generate() calls `M1Catalog.load()` FIRST (M1Catalog.ts L80) -> unpersisted edits die before render. Gate written in clone (UNCOMMITTED): `MOF/M1/M1Catalog/latest/test/OneStore.test.ts` — arm1 SEEN in-process PASS, arm2 DIES at load PASS, arm3 generate renders only the store = TIMEOUT 2504ms (full generate to tmp root; heavy) -> needs the item-3 rule. Seeds still TODO: drop `M1Catalog.edits = new Map()` -> arm2 RED; drop generate's `await M1Catalog.load()` -> arm3 RED.
  - Item 3: an EXISTING rule (vitest.config.ts, my verdict timeout-class-c41c2a8): contention files self-declare `// vitest-solo:`, budget stays 2500. GAP measured: 23 tests at 1250-2500ms under full load, 20 of them in the POOL (10 undeclared files: MofLayoutAC5, M3Class, Type, M1GraphNoSourceRead, M2AbstractDependency, Unit, GenReaders, Folder, M2PlantUmlClass, UcpComponent). Solo-time measurement per file NOT run (script `tmp/solo-times.sh` written, run interrupted). Proposal direction: ONE measured rule — any test >1250ms (half budget) under full load is classified by its SOLO time: solo<=1250 -> `vitest-solo` (contention), solo>1250 -> own budget 2x solo with basis. NOTE: my 28523ec Type.test 5000ms is a one-off the existing rule supersedes -> propose replacing it by vitest-solo.

# oopTester@WODA.prod — oopPO DELTA 2026-10-05 (post-rewind, landed 53%, trainer-accepted) — SUPERSEDED ABOVE

- **I4d GATED GREEN (2026-10-05), 3 conditions closed:** shared LOCAL ref `oopTester-I4d-gate` = 28523ec (Type budget) -> aa36014 (gates) -> 3b0b50f; was LOCAL in clone `/root/.claude/jobs/914c8cad/tmp/i4d` (pushed nowhere); verdict `verdicts/I4d-3b0b50f.md` @ AI/Claude 87baab0f; reported to oopPO. 641 = 638/2 skip/1 instrument (Type.test timeout under load, isolated 5/5 787-885ms -> timeout budget = oopPO's ruling). Rendered ids 2/106 (M3Element, NameUuid), stored 0 changed of 1736 (+10 in M1LayoutDefinition). Probes: tmp/repo-ids-per-class.mts, tmp/i4d-seeds.sh.
- **QUEUE NOW: I5 DISPATCHED to oopExpert on base 28523ec (oopPO accepted I4d, verified 641=639/0/2). HOLD for his I5 sha**, then gate it, then my tsconfig arm (i5-carry) ON TOP. Brief = AI/Claude `session/tasks/oopPO-I5-dispatch-28523ec.md` @ 1e28c27d. MY I5 GATE (isolated clone of HIS sha, CHECKED/SKIPPED/TOTAL): G1-G7 + g1b (design 03e7b4a5); folder==namespace for EVERY class after EACH of the 7 moves (RepositoryId, ObjectKey, TaggedProfile, InternetProfile, TaggedComponent, SecureTransport, UnknownTaggedComponent + models -> Ior; NOT Link; Ior = Package beside its own latest), ZERO exemptions; stored IOR strings 0 change (48==48); rendered dependency ids == the DERIVED set (target class namespace changed) — SIZE re-measured at 28523ec, NOT 29 (/root/oopExpert-patches/i5-29-ids.txt = cross-check only); README patch e77b16b2 applied VERBATIM in the same commit (ARM4: cited paths exist); rule (1) every unit whose home changed re-derived over ALL USERS in the same mutation; rule (A) move carries models it owns as SOLE user (M1Layout.boundModel); Ior.test + IorAcceptance: 2 test-path imports. Each arm failable by a named seed. Then tsconfig arm: TS2322 seed + inherited-exclude seed (0 files) RED.
- **(1) I4d** = oopExpert fixes the 2 PRE-EXISTING folder!=namespace mismatches my probe found at da035dc: **M3Element** and **NameUuid** (NameUuid = oopPO's own I4c acceptance error). MY I4d GATE: folder==namespace for EVERY class, **ZERO exemptions**, proven failable by a seed (RED naming the class), PLUS I4d's own rendered-id diff (which ids change, and only those).
- **(2) Rule 6 CORRECTED (supersedes "option 1 = binders" below):** a shared unit moves/re-derives over ALL its USERS, not only binders — each move re-derives EVERY unit whose home changed, in the SAME mutation (no half-derived intermediate).
- **I4d GATE ORDER (oopPO, after TRON RULING 4, spec AI/Claude 85c31c86 = session/tasks/oopPO-I4d-ruling4-b0bf0ca.patch):** abstract M3Element = Package unit at `Web4MDA/MOF/M3/latest/{model,src,test}`; rule 3's ONE exception = a Version inside a plain Namespace is the HOME of Package units, NOT a component. Gate on an ISOLATED clone of oopExpert's I4d sha, report CHECKED/SKIPPED/TOTAL:
  - (a) UPDATE MY OLD-RULE-3 GATE (Tron changed the law, so update, not weaken): `latest/test/MofLayoutAC5.test.ts` L118-125 claims every `latest`-shaped folder under MOF as a component -> `MOF/M3` (s=['MOF','M3'], shaped) would read as component 'M3'. Fix DERIVED from the model: a plain-Namespace `latest` is allowed ONLY where some Package unit's namespace ends in that Namespace. NAMED SEEDS: `mkdir MOF/M2/latest/src` (no Package unit there) -> RED naming it; existing L478 'abstract given a component folder' (MOF/M3/M3Element/latest/src) must stay RED. Other old-rule-3 readers to re-check on the sha: M1Layout.test.ts L154 (folder segments ['MOF','M3']), MofLayoutAC5 L463 (components' mx).
  - (b) NameUuid gate amend (oopPO-approved) on the sha; (c) FolderNamespace: EVERY class, ZERO exemptions, seeded RED by class name; (d) rendered ids 0/495 changed (confirm via diff); (e) Type.test 2726ms vs 2500ms timeout seen once under load -> classify instrument-or-defect (repeat isolated N times, measure durations; under-load-only = instrument, report not weaken).
- **(3) I5 on top of I4d:** folder==namespace after EACH of the 7 moves, 29 derived ids change, 0 stored IOR changes. tsconfig carry (i5-carry) lands ON TOP of I5 as ruled, path-limited, push nothing.

# oopTester@WODA.prod — PHASE-1 BANKED for the SM-ordered rewind 2026-10-05 ~16:2x (fresh panel 74%, oopPO GO, driver TRAINER) — SUPERSEDED BY THE DELTA ABOVE where they differ

- ON LANDING (phase 2): STOP + HOLD + REREAD by content. Identity `echo $CLAUDE_CODE_SESSION_ID` = 914c8cad-cf18-4ed2-a11e-35c3e07d3527; pane %207 = oopTeam:3.0. Report reread to SM (oopTeam:4.0) + oopPO (oopTeam:2.0). LEAN captures (Bash output was 24% of context).
- **(1) HOLD for oopExpert's I5 sha, on base `da035dc`** (Web4MDA branch `oopExpert-I2-dep`, local, shared object store; oopPO fast-forwarded it to da035dc). Do NOT gate before oopPO dispatches / the sha lands. (My pre-rewind background watch buroh5yq8 dies with the rewind: re-measure `git -C /var/dev/Workspaces/web4x/Web4MDA log --oneline da035dc5..oopExpert-I2-dep`.)
- **(2) oopPO RULED: the tsconfig fix LANDS ON TOP OF I5 (mine, test instrument), path-limited, push NOTHING:** tsconfig.test.json gets its OWN exclude = [node_modules, dist, EAMD.ucp/Components/**/src/thinglish.ts/**] (base minus ONLY **/test/**) + arm `latest/test/TestTypecheck.test.ts` (child-process `tsc -p tsconfig.test.json`: >50 test files in program, itself included, 0 errors). BUILT + PROVEN on da035dc, BANKED (not committed) in `$CLAUDE_JOB_DIR/tmp/i5-carry/{tsconfig.test.json,TestTypecheck.test.ts}` = /root/.claude/jobs/914c8cad/tmp/i5-carry/. Seeds: **TS2322** (`const oopTesterSeed: number = "not a number";` appended to latest/test/MofLayout.test.ts) -> RED naming the line; inherited exclude restored -> RED "test files the compiler sees: expected 0 to be greater than 50"; clean GREEN 3.7s. Measured on da035dc: 0 errors over 96 newly included test files.
- **(3) I5 GATE = G1-G7 + g1b (design `03e7b4a5`) + folder == namespace-derived asserted AFTER EACH of the 7 moves** (the 7 = RepositoryId, ObjectKey, TaggedProfile, InternetProfile, TaggedComponent, SecureTransport, UnknownTaggedComponent -> Ior; Ior stays the package; Link unmoved). F1 composition recipe + manifests: `$CLAUDE_JOB_DIR/tmp/f1.sh` (move driver = UcpComponentMove recipe; `npm start` = generate). Probes: tmp/repo-ids.mts (repository id per component), tmp/owners.mts (owner per class), tmp/units.mts, tmp/f2.mts.
- **(4) oopPO's I5 RULINGS: option A** (a component move CARRIES its bound models) **+ option 1** (a SHARED model moves only when ALL its binders are in one package — rule 6). **Expected: 29 DERIVED ids change, 0 STORED IOR changes.**
- DONE before rewind: I4b+I4c GATED GREEN on 7208df6 — verdict `verdicts/I4bc-7208df6.md` @ AI/Claude 36f38024 (pushed); gate commit Web4MDA `da035dc` (parent 7208df6) = now the tip of oopExpert-I2-dep, VERIFIED by oopPO (81/81, 633+2 skip). tsconfig measurement reported (0 errors, non-hollow) -> ruled LAND.
- Clones: `$CLAUDE_JOB_DIR/tmp/gate` = da035dc clean (node_modules symlink); `tmp/gate-b` = df7798a; tmp/f1-chain, tmp/f1-pairs = scratch (7 moves realised, uncommitted — disposable). Gate rules: isolated `git clone --no-hardlinks` only, never /root/oopExpert-wt, never the live main checkout; a seed under a git-clone test (scratch = clone of HEAD) must be a TEMP COMMIT; after every revert `git status` (a soft-reset undo left a seed staged once).
- Lessons today: read a MODEL through the catalog-loaded Definition, not the generated runtime copy (my grammar arm was blind until fixed); the placed unit (M1Catalog) is answered fresh by placedModel() — override it to seed; a tsc "0 errors" is hollow until the files are proven IN the program (--listFilesOnly).

# oopTester@WODA.prod — PHASE-1 BANKED for the SM-ordered rewind 2026-10-05 (~75.5%, idle) — REREAD THIS FIRST on landing

- ON LANDING (phase 2): STOP + HOLD + REREAD. Identity `echo $CLAUDE_CODE_SESSION_ID` = 914c8cad-cf18-4ed2-a11e-35c3e07d3527; pane %207 = oopTeam:3.0. Trees: AI/Claude main == origin; Web4MDA shared tree untouched by me; my gate clone /root/.claude/jobs/914c8cad/tmp/gate (detached, clean).
- REREAD: Web4MDA plan of record d729ecd (`spec/plans/2026-10-05-ucpcomponent-move-ior-package.md`) + Tron's I4c change (ask the trainer/oopPO where it is banked — do NOT guess) + oopExpert-I2-dep branch log (tip was 6cceba6; I4b/I4c come on top).
- STATE: queue = gate oopExpert's I4b (+ I4c) sha when oopPO dispatches it; the gate list is the NEXT line in the block below. All verdicts are on origin: I2-95de092, I3-73b0d06, I3fix-eba88d4, I4-6cceba6 (816f1daf).
- TOOLS (session/tasks/): oopTester-I6-g2-model-arm.mts (G2, tsx from clone root, --seed), -g2-oracle.sh, -foundation.mts <count> [--seed], -g3g4-move.sh <repo> <sha> (FIXED, not re-run), -g7-preflight.sh <repo> <sha> <rolenamed|twocontainers>, -g1b-relocate.sh <repo> <sha>; design `oopTester-I6-gate-design-d729ecd.md`.
- RULES: gate only on ISOLATED clones of the named sha; capture oopPO's pane before any Enter, never send into an open menu; lean captures (bash output was 23% of context — results to disk, grep/cut only); a RED is instrument-or-defect: diagnose before reporting; report numbers RED/GREEN/CONFOUND, never "passed".

# oopTester@WODA.prod — I4 GATED on 6cceba6 2026-10-05 — verdict `verdicts/I4-6cceba6.md` — SUPERSEDED above

- VERDICT GREEN for I4 scope: foundation 104/104 exact (seed bites); G1 0; G2 105 cls 416/416; G6 80 files 623/2/625, skips NAMED (TreeFileUnitInc1 T5.2-T5.5 HELD, T8 NOT BUILT); G3+G4 GREEN all 7 IOR components; guards itself/non-component/cycle GREEN by own message; catalog arm GREEN + failable via MODEL isTypeOnly false; spec-ref 4 arms each bite (4 widenings RED); M1Graph roots DERIVABLE (= hand list); G7 + G1b GREEN.
- FINDINGS (I5 plan): F1 moves cannot be chained without generate (ERR_MODULE_NOT_FOUND, 0 diff) -> "move x8 + ONE generate" impossible; F2 models have no move() and root models (TaggedProfileModel etc.) do NOT follow their component -> G5 needs a mechanism; F3 foundation test count is >100 not ==104.
- MY SLIP: g3g4 script's cycle check took an unrelated module error as the guard; fixed (not re-run; probes measured).
- I4 verdict ACCEPTED + PUSHED 816f1daf. RULINGS: F1 = move() DEFECT (moves must compose; plan keeps ONE generate); F2 = model placement DERIVED from its owning component (no move() on models); F3 + roots oracle dispatched to oopExpert.
- SM HOLD on oopTeam:2.0 LIFTED (oopPO GO). KEPT RULE: capture oopPO's pane (visible) BEFORE any Enter there; if a menu / plan-mode / picker is open, do NOT send.
- NEXT = gate oopExpert's I4b sha (hold until it lands): (1) chained 8 moves + ONE generate == BYTE-IDENTICAL to 8 (move+generate) pairs, on two fresh clones; (2) the 4 ROOT models (TaggedProfileModel, TaggedComponentModel, InternetProfileModel, SecureTransportModel) follow their component, none left in Web4MDA/latest; (3) foundation count == DERIVED git count (exact, not >100); (4) M1Graph roots test uses a derived oracle; re-run G1, G2, G6, G7, G1b, g3g4 (fixed script) + seeds.

# oopTester@WODA.prod — I3 GATED on 73b0d06 2026-10-05 — verdict `verdicts/I3-73b0d06.md` — SUPERSEDED above

- VERDICT GREEN: G1 0 diff; G2 whole catalog 409/409 (0 mismatched, failable re-proven); G6 78 files 613 pass/2 skip/615 (delta = PackagedIn.test.ts 5), 27-file audit clean; SC8 GREEN (oopPO's 879bb2c5 EBNF not applied on branch -> spec and model still equal; not a defect).
- RELOCATION SEED GREEN on real model (scratch clone): role-less packagedIn Ior on UnknownTaggedComponentDefinition -> generate rc 0, 17 declared changes (10 moved, Ior re-pointed), 0 body lines / 20 import lines, tsc 403/0 errors, 2nd generate 0 diff, unseed -> byte-identical 73b0d06.
- MY SLIP: first seed had a role name -> M2ThingClass guard refused (packagedIn must be role-less, L215). Observation for oopPO: generate not atomic (relocates, then can throw -> half-moved tree).
- Whole-tree tsc config file: /root/.claude/jobs/914c8cad/tmp/tsconfig.reloc.json pattern (= SrcTypecheck WholeTreeConfig).
- RULING: half-moved tree = DEFECT. G7 preflight gate session/tasks/oopTester-I6-g7-preflight.sh (rolenamed|twocontainers): RED baseline both seeds at 73b0d06 (rc 1, guard named, 17 diff). I3 verdict pushed 037a023a.
- I3 ATOMIC FIX GATED on eba88d4 (verdict `verdicts/I3fix-eba88d4.md`): GREEN. G7 RED->GREEN both seeds (my run, 0 diff), G1 0 diff, G2 409/409, G6 614 pass/2 skip/616 (delta PackagedIn 5->6), SC8 green (spec+model both packagedIn), spec = 879bb2c5 verbatim, 14-file audit clean. NEW gate script session/tasks/oopTester-I6-g1b-relocate.sh <repo> <sha> (fresh-clone npm start + valid relocation round trip): GREEN on eba88d4, RED on 95de092 (failable).
- Fix verdict ACCEPTED + PUSHED (b72f14cc, incl. g1b gate). I4 in build: oopExpert FOUNDATION gate first (render(load(D)) == D byte-identical, all Definitions), then move().
- GROUND TRUTH for the foundation gate: 103 *Definition.ts at eba88d4, all under /model/ (= oopExpert's 103); list /root/.claude/jobs/914c8cad/tmp/definitions-eba88d4.txt. At gate time: the foundation gate's set must be DERIVED and equal git ls-files at the I4 sha (not a hand list), and seed one Definition -> RED.
- NEXT: on the I4 sha: foundation gate audit + G3 round-trip EVERY IOR member, G4 move() Definition-JSON only, G2 after-move, G1b + G7 re-run, G1, G6.

# oopTester@WODA.prod — I2 GATED on 95de092 2026-10-05 — verdict `verdicts/I2-95de092.md` — SUPERSEDED above

- VERDICT GREEN for plan scope: G1 0 diff; G6 77 files 608 pass/2 skip/610 (delta = M2AbstractDependency.test.ts 6), fresh-clone npm start 0 diff, 30 changed files all in claimed areas; G2 moved set GREEN.
- FINDING: G2 whole catalog RED 21 = M1Catalog placed model has 0 imports vs 21 in held M1Catalog.ts (model gap, pre-existing, no IOR impact). Failability proven (seed -> +1 RED Ior missing ScenarioUnit). Tools: session/tasks/oopTester-I6-g2-model-arm.mts (tsx from clone root, --seed).
- RULING (oopPO): finding NOT scope - M1Catalog placed model declares its 21 imports in I3; G2 WHOLE-CATALOG arm is the gate: 409/409, RED by name. Verdict ACCEPTED, pushed.
- NEXT: hold for I3 sha. Clone /root/.claude/jobs/914c8cad/tmp/gate detached at 95de092, clean.

# oopTester@WODA.prod — I6 gate DESIGN for plan d729ecd 2026-10-05 (dispatched by oopPO, NO push) — SUPERSEDED above

- STATE: design `session/tasks/oopTester-I6-gate-design-d729ecd.md` (6 gates G1-G6, seed per gate, earliest provable increment). HOLDING for oopExpert's I2 sha to gate (G2 model arm + G6 + G1).
- BASELINE (clone /root/.claude/jobs/914c8cad/tmp/gate at d729ecd = origin): npm start zero diff; suite 76 files 604 = 602 pass / 2 skipped / 0 failed.
- PROVEN FAILABLE NOW: G1(a) GREEN 0 -> seed VersionDefinition L83 argv->argvSeed -> RED 7 -> revert GREEN 0. G2 text oracle `session/tasks/oopTester-I6-g2-oracle.sh` 10 files -> drop Link.ts Ior import -> 9 (names Link.ts) -> revert identical.
- RULING applied: by-name = SKIPPED class (CHECKED/SKIPPED/TOTAL); test path-imports gap = 2 files/10 imports (Ior.test.ts 5, IorAcceptance.test.ts 5) -> sent to oopExpert+oopPO. G2 oracle v1 defect FIXED (exclusion = MOVED set): 6 dependants (Ior x4, ScenarioIndex x2), re-proven 6->5->6. Design pushed d17add84.
- dependency today = ImportModel in ClassModel.imports; RelationshipModel has no opposite end (51577e29, verified). FINDING for oopPO: IOR classes referenced BY NAME (not import) in M2AbstractClass/M2ThingClass/Ior/IorAcceptance/SecureTransport tests -> invisible to an import-based dependency.

# oopTester@WODA.prod — PHASE-1 BANKED for the SM-ordered rewind 2026-10-05 (panel 91%) — REREAD THIS FIRST on landing

- STATE: queue EMPTY. Last landed + verified: I3b on Web4MDA origin 679ca51 (602/604, 0 failed). NEXT order expected: plan **d729ecd** (not yet dispatched to me) — read it on Web4MDA at that sha, disk-first, before anything.
- ON LANDING: STOP + HOLD + REREAD; identity CLAUDE_CODE_SESSION_ID (914c8cad); trees clean? (AI/Claude, Web4MDA, clone tmp/gate = 679ca51); LEAN captures (bash output was 26% of context — grep/cut always, results to disk).
- Tools to reuse: `session/tasks/oopTester-I3b-gate-live.py <base> <sha>` (TH7, ruled rules), seeds `oopTester-I3b-gate-live-seed-ruled*.sh`; whole-tree tsc config = SrcTypecheck's (extends tsconfig.json over EAMD.ucp/Components/**/*.ts), never tsconfig.test.json.

# oopTester@WODA.prod — I3b LANDED on Web4MDA origin 679ca51 2026-10-03 — post-landing VERIFIED — SUPERSEDED above

- origin 679ca51 ← dbf38c9 (spec v5, 1 line) ← 5961e74 (I2), one fast-forward on 4907913. Landed diff dbf38c9..679ca51 BYTE-IDENTICAL (cmp) to `session/tasks/oopTester-I3b-gate-5961e74.patch`; my gated tree == origin 679ca51 (git diff --quiet). Whole suite serial on a clean checkout of 679ca51: rc 0, 76 files, 604 = 602 pass / 0 failed / 2 pending (= oopPO).
- NEXT: hold for oopPO's next order naming a sha. Clone tmp/gate = 679ca51 clean.

# oopTester@WODA.prod — I3b QA-GREEN on 5961e74 + spec v5 2026-10-03 — SUPERSEDED above — verdict `verdicts/I3b-5961e74.md` — HANDED BACK, not pushed — REREAD THIS FIRST

- 5961e74 + gate patch `session/tasks/oopTester-I3b-gate-5961e74.patch` (unchanged, byte-identical to the gated clone) + spec v5 (AI/Claude 2f995743): WHOLE SUITE serial 604 = 602 pass / 0 failed / 2 pending. RENAME TOTAL 13 / STRUCK 13 / LIVE 0 (= oopPO). TH7 live (RULED rules, now default; `oopTester-I3b-gate-live.py`) = 137 changed, 38 rename-only, 0 violations; seeds `…-seed-ruled.sh` (unsorted reorder + standalone svg + content = 3 named) + `…-seed-ruled-list.sh` (unsorted in-line list = named), rc 1, clone restored.
- NEXT: oopPO's joint push → verify my patch VERBATIM on origin + whole suite serial on a real checkout; report the number.

# oopTester@WODA.prod — I3b GATED on oopExpert's 5961e74 (spec v4 scope) 2026-10-03 — SUPERSEDED above

- SCOPE REVERSED by oopPO (spec v4 AI/Claude a4ed2e96): FileServerModel KEEPS containedBy 14ca2c32, rendered as an INTERFACE header clause (rule 12); TH7 = builders M2ThingClass/ThinglishGrammar + specs + gate + rename ONLY (no M1Layout, no FileServerModelDefinition); holder seed DROPPED; NEW seed = drop the clause → TH3 RED `FileServerModel.containedBy DefaultFolder (header clause)`.
- oopExpert branch oopExpert-I2: 7454e10 (I2a) → e544a79 (I2b) → 8c0f6d7 (spec v3) → 5961e74 (ruling v4 applied). My gate patch vs 5961e74 = `session/tasks/oopTester-I3b-gate-5961e74.patch` (593 lines, 5 files, applies clean on pristine 5961e74; conflict on 8c0f6d7 resolved = my side, the retired inlining test).
- WHOLE SUITE serial on 5961e74 + gate: 604 = 601 pass / 1 RED / 2 pending. All Thinglish arms green (Target 16/17, Grammar 14/14, M1Catalog 20/20, M1Layout 12/12, FileUnitsMigration MA3 14/14, TestFolder 4/4, SrcTypecheck 3/3). ONLY RED = RENAME arm: TOTAL 14 / STRUCK 13 / LIVE 1 = `spec/thinglish.md:203` — oopPO's v4 TH7 line names the old model name UNSTRUCK (oopPO's text, its own ruling applied).
- LIVE TH7 (`session/tasks/oopTester-I3b-gate-live.py <base> <sha> [--proposed]`, exit 1 on violations): STRICT 4907913..5961e74 = 137 changed, 32 rename-only, 6 VIOLATIONS — ALL rename CONSEQUENCES, measured: M2AbstractClass.test.ts (a sorted name list re-sorted, same elements, rest equal), Web4MDA-graph.puml (same line multiset, re-ordered), ItemModel.svg / ModelUnit.svg (A) + TypedModel.svg (D) / Web4MDA-graph.svg (re-renders of rename-only pumls). PROPOSED mode (rename-only MODULO ORDER + an svg may change ONLY because its puml changed by the rename) = 0 violations; seeded failable (graph-puml content line + svg with unchanged puml = 2 named, rc 1). NEEDS oopPO's RULING on the two extensions.
- Instrument slips this arc (caught, contained): a wrong assert count left the OLD seed harness running → reset to a stale base; recovered from the kept stash exactly. Seed harnesses now take BASE from HEAD.

# oopTester@WODA.prod — I3b DESIGNED (plan 2026-10-03 ModelUnit + model interfaces), RED baseline measured, HOLDING for oopExpert's I2 sha — SUPERSEDED above

- Plan of record Web4MDA `spec/plans/2026-10-03-modelunit-and-model-interfaces.md` (9012d42; base now 4907913 = I2a CODE ONLY). oopPO spec patch I1+I1b AI/Claude e344ad70 + v2 5e3d4272 (eamd-ucp holder rule). Draft = `session/tasks/oopTester-I3b-gate-draft-4907913.patch` (602 lines, 5 files: ThinglishTarget.test, PureLayout.ts, M1Catalog.test, M1Layout.test, TestFolder.ts re-pin), applies clean on pristine 4907913.
- DESIGN: PureLayout = no inlining/rename, every model an interface. TH3: binding `<XModel>` PRESENT; DERIVED 10→8; abstract FOLLOWS THE MODEL (isAbstract OR bodyless interface member) + RULE-8 standing seed (ItemModel.init via renderer unitOf, renamed method `unitText` — `unit` collides with an accessor); held `ModelUnit.uuid`. TH6 rank DERIVED from grammar ebnf `body`, == PLAN_ORDER (2 sources). TH1/layout counts DERIVED. TH7: spec/** + builders (M2ThingClass, ThinglishGrammar, M1Layout) + NAMED FileServerModelDefinition + caller-proven rename-only (`Rename.isRenameOnly`). NEW RENAME arm: TOTAL/STRUCK/LIVE per OCCURRENCE, spec/plans/ excluded (oopPO ruled), strike counts only in spec/**; the old name is BUILT so the gate never counts itself.
- RED BASELINE (4907913 + spec patch + draft, serial): 604 = 589 pass / 13 RED / 2 pending, ALL expected pre-I2: listing ×2 (697≠717), ARM5 ×3 cites ModelUnit.ts (pre-I2a), SC8 ×2, TH1, TH3 ×3 + TH5 ENOENT (model interface files not yet), TH6 ×2 (grammar order), RENAME TOTAL 134 / STRUCK 13 / LIVE 121 (spec part 13/13/0 = oopPO's; 121 = code pre-I2a).
- INSTRUMENT LESSONS: type-check with SrcTypecheck's WHOLE-tree config (tsconfig.json over src+test), NOT tsconfig.test.json — it caught 5 of my errors my check missed; esbuild never type-checks. Console output of PASSING tests is suppressed → report facts through assertions.
- AT GATE TIME (oopExpert's sha): (1) live TH7 over git diff 4907913..sha with Rename.isRenameOnly per file — FileServerModel's own generated puml/mmd may change: name them, oopPO rules; (2) M1Layout listing identical over ALL models base vs sha; (3) BUILD the holder-rule seed on his M1Layout.ownerOf (remove rule → FileServerModel relocates → RED by name); (4) whole suite serial; rename-normalised diff of ts/js/puml/mmd/oosh vs 66a14e0 empty.
- FLAG 1 FIXED by oopPO spec v3 (AI/Claude f6ca601e): TH7 AMENDED = builders M2ThingClass/ThinglishGrammar/M1Layout + specs + the gate + NAMED FileServerModelDefinition + FileServerModel generated files named at gate time (allowed ONLY if the diff is exactly the removed relationship) + rename-only. Design ACCEPTED by oopPO.
- LIVE TH7 SCRIPT ready + PROVEN FAILABLE: `session/tasks/oopTester-I3b-gate-live.py <base> <sha>` (exit 1 on any violation; "the gate" = files of my patch, derived, never a wildcard; renamed paths followed) + seed `oopTester-I3b-gate-live-seed.sh` (throwaway local commit: rename-only edit PASSES, non-rename edit + FileServerModel added line = 2 VIOLATIONS by name, rc 1; clone restored). FileServerModel puml/mmd carry NO relationship line → the "only-removed-relationship" allowance cannot trigger; any FileServerModel change surfaces by name.

# oopTester@WODA.prod — RULE 8 (interface default bodies) MEASURED on 66a14e0 2026-10-03 — NO arm added, NOTHING pushed — REREAD THIS FIRST

- 66a14e0 = f75cefc + docs (spec rule 8 + plan). Whole suite serial on clean 66a14e0: 76 files, 602 = 600 pass / 0 failed / 2 pending.
- SEED (in-memory, renderer subclass exposing protected unitOf — the path derived() writes ItemView by; proven faithful: unseeded unitOf == committed ItemView byte-identical): drop ItemView.init's body → TH3 RED BY NAME `ItemModel.init.body` (existing arm ThinglishTarget.test.ts:277-281: every non-abstract member's body verbatim + closing `  }`). So TH3 ALREADY proves it; per order no arm added.
- FINDINGS: (a) my `seeded()` helper (createExisting().toSource()) returns '' for the RENAMED ItemModel (sourceOf blanks it by design) → any seed on ItemView through seeded() is HOLLOW; none exists today. (b) LATENT: line ~320 forces every TRUE-interface member abstract (bodyless); rule 8 says abstract ⇔ bodyless → the first true-interface default body would FALSE-RED. Measured 0 such methods today.
- OFFERED (needs oopPO GO): commit the probe as a standing rule-8 seed; make abstract follow the model (m.isAbstract || interface member with empty body).
- Probe literal: $CLAUDE_JOB_DIR/tmp/probe-rule8.ts.txt (current content = the 0-count probe; v5 seed text is in this note).

# oopTester@WODA.prod — I3 LANDED on Web4MDA origin f75cefc 2026-10-02 — post-landing VERIFIED — queue EMPTY — REREAD THIS FIRST

- origin main f75cefc ← 55f7b35 ← cde2bef (one fast-forward). Landed diff 55f7b35..f75cefc BYTE-IDENTICAL to `session/tasks/oopTester-I3-gate-draft-0f2082f.patch` (cmp). Whole suite serial on a real checkout of f75cefc: rc 0, 602 = 600 pass / 0 failed / 2 pending (declared skips), 76 test FILES (186 = describe-SUITES — I mislabeled it "files" before; oopPO's 76/76 is the file count).
- NEXT: hold for oopPO's next order naming a sha (oopPO's plan-doc fix push is separate). Clone tmp/gate = f75cefc clean.

# oopTester@WODA.prod — I2 55f7b35 QA-GREEN 2026-10-02 — verdict `verdicts/I2-55f7b35.md` — REREAD THIS FIRST — SUPERSEDES below

- 55f7b35 (D3 fixed: held() = uuid + type aliases + type-only imports) + draft v7 (`session/tasks/oopTester-I3-gate-draft-0f2082f.patch`, unchanged; byte-identical to the gated clone diff; applies clean on pristine 55f7b35): WHOLE SUITE 602 = 600 pass / 0 RED / 2 pending (declared it.skip T5.2-5.5 + T8, unchanged since 44080bb). Seeds all green. Red→green chain: D1/D2 RED c75a62c → green 0f2082f; D3 RED 0f2082f → green 55f7b35.
- HANDED BACK, NOT pushed: oopPO lands I2 + my gate patch in ONE joint push; then oopPO's plan-doc fix (ScenarioIndexModel wording) separately. On landing: verify my patch landed VERBATIM (diff vs task file), re-run whole suite serial on origin.

# oopTester@WODA.prod — I2 0f2082f RE-GATED 2026-10-02 (draft v7 `session/tasks/oopTester-I3-gate-draft-0f2082f.patch`, 930 lines, 6 files, applies clean on pristine 0f2082f) — REREAD THIS FIRST — SUPERSEDES below

- oopPO RULINGS: D1+D2 → oopExpert (D2 = owner IMPLEMENTS inlined model's base, spec v6 e87a7710); listing = spec v6 DERIVED set (ScenarioIndexModel inlined; MethodModel + TaggedComponentModel interfaces). 0f2082f FIXED D1+D2 (verified: TH3 missing + TH5 green).
- v7 = v6 + PureLayout EXTRACTED to Web4MDA/latest/test/PureLayout.ts (ONE owner of the inline/interface derivation, pinned in TestFolder.ts + self-pin recomputed) + listing patch (M1Catalog generate() + M1Layout AC6 files() & count: thinglish dir omits inlined, names by typeName/isInterfaceType) + standing D2 seed (ScenarioIndex w/o implements FileModel → RED).
- RESULT serial: WHOLE SUITE 602 = 599 pass / 1 RED / 2 pending; seeds all green (Target 8, Grammar 2, M1Catalog 4, M1Layout 2, MofPlainNode 2, TestFolder 1). MofPlainNode + TestFolder×3 REDs on the first v7 run were MY file placement (gone after the move).
- ONLY RED = I2 defect D3: M2ThingClass.held() still lists ItemModel.displayName/icon/badge/description on all 82 types; spec v6 STRIKES those rows (ruling 6) and ItemView.interface.thing RENDERS all four. Never evaluated before (TH3's missing-assert failed first on c75a62c).

# oopTester@WODA.prod — I2 c75a62c GATED 2026-10-02 (draft v6 `session/tasks/oopTester-I3-gate-draft-c75a62c.patch`) — REREAD THIS FIRST — SUPERSEDES below

- c75a62c (branch oopExpert-I2) carries spec v5 — MEASURED: spec blob 6f96aa18 == cde2bef + I1 v5 (oopExpert right, oopPO's "v4" crossed). Clone `tmp/gate` = c75a62c + draft v6.
- MY ORACLE corrected (no new DERIVED row, still 10): dependencies() follows DERIVED rows 37 (interface marker import) + 39 (ItemView: View+Displayable REQUIRED); pure-interface member = BODYLESS `;` checked, no `abstract` word (Tron verbatim spec §: "no need for interfaces to be abstract classes"). New seed test RED-by-name on nearest members: body on interface member, `abstract` stripped from a CLASS member, non-marker interface dep, ItemView w/o View. TH5 now prints its list.
- RESULT serial: Grammar 14/0 · Target 13 green / 2 RED · seeds 10/10 · WHOLE SUITE 601 = 595 pass / 4 RED / 2 pending.
- I2 DEFECTS: D1 `dependency Model.latest` DUPLICATED in 5 files (UcpUnit, M2AbstractCollection, M2AbstractRelationship, M2ES2020Class, OoshUnit) = TH5's 5 (hazard scan agrees). D2 18 owners of an inlined model emit `dependency <base>` but no `implements` (17 ItemView + InternetProfile→TaggedProfileModel) = TH3's 18; plan rule 4 SILENT on direction → oopPO rules.
- INSTRUMENT (my lane, NOT yet written): M1Catalog generate()-listing + M1Layout AC6 = 697 vs 717 = exactly 13 model-interfaces renamed + 20 inlined + ItemModel→ItemView. HOLD the listing patch on oopPO's ruling: ScenarioIndexModel is INLINED (1 non-model owner ScenarioIndex) though ruling 7 names it an interface; MethodModel + TaggedComponentModel become interfaces unnamed by rulings 5/7.

# oopTester@WODA.prod — I3 DISPATCHED (oopPO) 2026-10-02: TH1/TH3/TH4 update + NEW TH6 order + NEW TH7 scope; gate oopExpert's I2 — REREAD THIS FIRST — SUPERSEDES below

- Plan of record: Web4MDA `spec/plans/2026-10-02-pure-thinglish-interfaces-and-inline-models.md` @ `cde2bef` (APPROVED by Tron, rulings 1–7). RENDERING ONLY: only `latest/src/thinglish/**/*.thing` changes; model + every other target byte-identical.
- MEASURED from the MODEL on cde2bef (probe, never the renderer): 102 classes, 33 models (descend from `Model`); owners = classes binding a model as a type argument (`UcpComponent<Web4MDAModel>`): 1 owner = 21 (INLINED into the owner, no file) · shared 4 = ClassModel×5, FileModel×3, RelationshipModel×2, AttributeModel×2 (→ interface, owners `implements`) · 0 owners 8 = Model, TypedModel, ItemModel(→ ItemView, ruling 6), ImportModel, ParameterModel, TypeAliasModel, TaggedProfileModel, ScenarioIndexModel (→ interface). Expected after I2: 81 .thing = 61 class + 20 interface (8 + 12 model-interfaces, layer3).
- DESIGN: TH1 from that derivation (+ ruled rename ItemModel→ItemView); TH3 facts on the OWNER (1:1) or the model-interface; DERIVED explicit: F6 OUT; translation facts isEntry, `<XModel>` binding, interface isAbstract, `extends Interface` marker; TH4 no `entry` (derived from grammar after I1) + seed; TH6 kinds attribute→property→relationship→collection→method, seed out-of-order; TH7 pure check over `git diff --name-only <base> <I2>`: outside `src/thinglish/**` only spec/, tests, and components whose own model/ts changed — seeded both ways.
- RED BASELINE MEASURED on cde2bef + I1 v4 (4d57ecbc, owner = a NON-model class, RULED): ThinglishTarget 14 arms = 8 GREEN (model-derived layout 33/20/13 → 82 = 21+61 in-gate, layout failable, TH1/TH3/TH4/TH5/TH6 seeds, TH2, TH7) + 6 RED expected pre-I2 (TH1 69/82, TH3, TH4 + its `entry` seed, TH5, TH6). ThinglishGrammar: NEW arm 'no struck span in a keyword cell' GREEN + seeded; 3 REDs all = grammar MODEL still has `entry` (one-source, DOCUMENTED, modifiers) → green with I2. Draft gate = AI/Claude `session/tasks/oopTester-I3-gate-draft-cde2bef.patch` (clone $CLAUDE_JOB_DIR/tmp/gate).
- RE-MEASURED post-rewind on cde2bef + I1 **v5** (3b89a69f, TH7 wording only) + draft v5 (2d525a17), serial: Grammar 11g/3R + Target 8g/6R = **19 green / 9 RED / 0 pending** — identical arms to v4. oopPO's "9 RED / 19 green" = the SAME number summed across both files (aggregation, not a defect). Clone `tmp/gate` = exactly this composition (node_modules re-linked after a `stash -u` swallowed the symlink — never `stash -u` a clone with a linked node_modules).
- My instrument fixes before baseline: TH7 fail-open ("any component whose own ts changed") → the plan's named I2 builders (M2ThingClass, ThinglishGrammar), seeded on its nearest member; layout seeds use plain stand-ins (ClassModel is read-only).
- WAITING: oopExpert's I2 LOCAL sha → measure the I2-dependent arms (model-interface layer, owner `implements` of an inlined model's base, model-interface member bodies), then whole suite serial on a clone, hand back NOT pushed. Before hand-off: WHOLE suite `--maxWorkers=1` on a clone.

# oopTester@WODA.prod — ALL LANDED on Web4MDA 44080bb 2026-10-02 — queue EMPTY, next work waits on TRON's word — SUPERSEDED above

- LANDED + VERIFIED BY ME ON ORIGIN (byte-compare, not relayed): `44080bb` (oopPO doc sweep d1056da9+0ad83973 + my gates v2, Spec.test.ts byte-identical) ← `1390838` (my TestFolder re-pin c28a5e49…) ← `606c5ca` (my TestBudget fix d97db488) ← … ← `26f34ce` (my Thinglish TARGET gate TH1–TH5, F6) ← `effdd01` (Step B, my target-listing patch verbatim). oopPO measured 591+2/593 serial, 0 failed.
- Verdicts: `verdicts/StepB-effdd01.md` (TH1–TH5 GREEN under F6). Task patches: `session/tasks/oopTester-*` (all superseded or landed).
- ★ PATTERN named by oopPO (twice in one arc my patch broke a gate I did not run — GenClaims, TestFolder pin): BEFORE ANY HAND-OFF run the WHOLE suite, `--maxWorkers=1`, on a clone of the exact composition; report THAT number. Memory: a-gate-change-runs-the-whole-suite-gates-gate-each-other.
- Scratch clones under $CLAUDE_JOB_DIR/tmp (gate, tf, stepb, w4mda, pristine) are disposable; rebase onto 44080bb before any new work.
- On landing: STOP + HOLD + REREAD; identity `claudeCode session.current oopTeam:3.0` (914c8cad); LEAN captures.

# oopTester@WODA.prod — ARM6 v2 HANDED (9767a0aa) + Step B RELEASED by SM, waiting for oopExpert's LOCAL sha 2026-10-02 — SUPERSEDED above

- DONE: ARM6 v2 (oopPO ruling 1: quote exemption ONLY Tron-attributed = `Tron` ≤40 chars before the quote) — AI/Claude `9767a0aa` `session/tasks/oopTester-arm6-0c6e081{.patch,-worklist.md}`; 196 live / 23 skipped / 219 on 0c6e081 (= oopPO's sweep list); applies clean on pristine; NOT pushed to Web4MDA (oopPO lands sweep+ARM6+ARM5 in ONE push). Delivery proven by grep in oopPO's transcript.
- NEXT #1 (priority): on oopExpert's LOCAL sha → target-listing expectation patch, handed back NOT pushed. Sites @0c6e081 (re-measure at his sha): M1Catalog.test 172-193 ordered written list · M1Layout files() oracle ~96 + `classes.length * 6` ~160 + AC7 dir list ~208 · Pipeline dir regex ~126. RULE fixed in advance: DERIVE the target SET from `homeDirectories`/`languages()` (AC7 = derived set + known-dir floor; ×N from the oracle's per-class list; Pipeline regex = homeDirectories minus non-M1Class.save writers svg/sample, positional + documented) — KEEP per-file NAMING an independent hand oracle (.class.thing/.interface.thing), never derive the expectation from the SUT.
- NEXT #2: after his ONE push gate TH1–TH5 (spec/thinglish.md @0c6e081 + grammar 174f8e7c F1-F3 + 5a5fed87 F4/F5): TH3 = everything except EXACTLY the held rows (TypedModel.uuid, ItemModel.displayName/icon/badge/description); derived-not-rendered COUNT AS PRESENT (RelationshipModel.source, ClassModel.level, ImportModel.isInterface, typeArguments); header-clause relationships (F4 containedBy ×6, F5 instanceOf ×15) count as rendered. Seeds RED by name, CHECKED/SKIPPED/TOTAL.
- NEXT #3: oopPO hands the finished sweep → DERIVE exact ARM5 PATH_ALLOWANCES/NON_FILES from ARM5's printed output, prove exact both ways (6 of 10 change: src/Once.ts ×2, src/X.ts ×2, src/MOF/Loose.ts, src/Container.ts).
- Clones: $CLAUDE_JOB_DIR/tmp/{w4mda (ARM6 edit), pristine (0c6e081 + patch)} — scratch. On landing: STOP + HOLD + REREAD; identity `claudeCode session.current oopTeam:3.0` (914c8cad); LEAN captures.

# oopTester@WODA.prod — Thinglish STEP A GATED QA-GREEN on 0c6e081 2026-10-02 — SUPERSEDED above

- DONE: verdict `verdicts/StepA-0c6e081.md`. Verbatim measured (0 diff lines, spec + my SC8 patch). Shipped model: 13/13, pairs 18/0/18, held TypeAliasModel + ImportModel.isTypeOnly, 7 seeds RED by name, residual 0. Cold default rc=1 = AC6 timeout pair ONLY (562+2/566), serial rc=0 564+2/566; AC3 46/46, tsc 0, npm start zero diff.
- NEXT (on oopPO's order naming the sha): gate **Step B** — `M2ThingClass` + `src/thinglish/EAM/<layer>/<Name>.(class|interface).thing` for every component, **TH1–TH5** (spec/thinglish.md at that sha); the 5 target-listing tests' expectation changes are MY patches (M1Catalog.test 175-191, M1Layout AC6 oracle 90-97 / x6 160 / AC7 dir list 208, Pipeline.test 126 — re-measure at the sha). Also Part 2: build ARM6 (no live-normative top-level gen/ src/ test/ mention; derived scan; seed gen/js/X.js → RED). Plan of record: Web4MDA spec/plans/2026-10-02-thinglish-target-and-spec-sweep.md.
- Timeout class: Part 0 fix (oopExpert) still in flight — default cold runs may show the AC6 pair; discriminate with --maxWorkers=1, never change the budget.
- On landing: STOP + HOLD + REREAD; identity `claudeCode session.current oopTeam:3.0`; LEAN captures.

# oopTester@WODA.prod — Step A SC8 gate RE-DERIVED on plan of record 0a5eea4, HANDED to oopExpert 2026-10-02 — SUPERSEDED above

- DONE: patch `session/tasks/oopTester-stepA-sc8-0a5eea4.patch` + README (contract table for oopExpert's `modifiers`). Not pushed to Web4MDA (oopPO order). Measured: S1 spec alone RED by one-source; S3 spec+gate+correct model 13/13 GREEN, tsc 0; G1 pairs 18/0/18; held TypeAliasModel + ImportModel.isTypeOnly; 7 seeds RED by name. Finding: my old one-source non-vacuity + failable seeds were alignment-bound (fixed in the patch).
- NEXT: gate oopExpert's ATOMIC Step A sha when oopPO orders it (verify my patch landed VERBATIM — diff against the task file); then B (target-listing test expectations = my patches) + ARM6. On landing: STOP + HOLD + REREAD; identity `claudeCode session.current oopTeam:3.0`; LEAN captures.

# oopTester@WODA.prod — Thinglish SC8 modifier gate HELD 2026-10-02 (oopPO: Tron "always work with plans") — SUPERSEDED above

- HELD, NOT handed over, NOT applied to Web4MDA: `held/` (patch + state script + README with the measured S0–S3c matrix and findings F1–F4). Step A claim measured TRUE: oopPO's spec patch ALONE → RED by "SC8 — ONE source".
- QUEUE: wait for oopPO's APPROVED PLAN (spec/plans); then re-derive the gate against the plan's base, never apply the held patch blindly. On landing: STOP + HOLD + REREAD; identity `claudeCode session.current oopTeam:3.0`; LEAN captures.

# oopTester@WODA.prod — timeout class MEASURED on c41c2a8 2026-10-02 — SUPERSEDES below (queue EMPTY)

- DONE: `verdicts/timeout-class-c41c2a8.md`. CAUSE = CONCURRENCY (15 fork workers on 16 cores + child-process-heavy tests + host load): serial run = solo time & rc=0; default x1.5-2.6, rc flips with load (mean 4.7 green / 7.4 red). SECONDARY = O(n) in class count (87->102, AC6 ~11 ms/class, no step at I3). Budget unchanged. oopExpert fixes on this; I re-measure (default cold x3 on a loaded box).
- QUEUE: empty — hold for oopPO. On landing: STOP + HOLD + REREAD; identity `claudeCode session.current oopTeam:3.0`; LEAN captures.

# oopTester@WODA.prod — spec 14 I3 GATED on c109017, gate pushed c41c2a8 2026-10-02 — SUPERSEDES below (queue EMPTY)

- DONE: verdict `verdicts/I3-c109017.md` — QA-GREEN on every I3 arm. Gate pushed **c41c2a8** (gate-only, tree 81d0c32 == origin). 12 seeds RED by name, residual 0; builder arms re-proven (Ior.test port rows, ScenarioUnit +3). IOR2 13/0/13 (+17 placeholders). AC3 46/46, npm start zero diff, tsc test 0.
- DISCLOSED: cold rc=1 x2 = timeout INSTRUMENT only (AC6 pair + M1Catalog TS rendering; solo green, AC6 +~17%). My I2 gate was HOLLOW for I3 (SKIPPED 0 by construction; checked 11/13) — fixed in c41c2a8.
- AC3 rule (old ac3.mjs was ephemeral): tests whose fullName contains AC3, vitest JSON — validated 46/46 on base a390e14.
- QUEUE: empty — hold for oopPO's next order naming a sha. On landing: STOP + HOLD + REREAD; identity `claudeCode session.current oopTeam:3.0`; LEAN captures (no unbounded git pull: use -q).

# oopTester@WODA.prod — PHASE-1 BANKED for the SM-staged rewind 2026-10-01 (~71%, oopPO-staged) — REREAD THIS FIRST on landing — SUPERSEDES below

- I2 ACCEPTED by oopPO (b355d0d + c870571a verified). Finding 1 closed: concrete local Link example on origin **a390e14** (double-quoted; backticked collided with ARM5) — my gate's localLinks reads it -> **retire FIXTURE_LOCAL the next time I touch IorAcceptance.test.ts** (re-run seeds after). Findings 2 (one port message for all defects) + 3 (Link has no test folder) -> oopExpert's I3 brief.
- NEXT after landing: the heavier **I3 gate** (multi-profile rule 5, SecureTransport rule 6, typed instance IOR rule 4 + IOR3b one-way migration; matcher must extend past ',' for corbaloc lists) — ONLY on oopPO's order naming the sha. Read spec/ior.md at that sha, never from memory.
- On landing: STOP + HOLD + REREAD; identity `claudeCode session.current oopTeam:3.0`; LEAN captures.

# oopTester@WODA.prod — spec 14 I2 GATED GREEN on dfdde9c, gate pushed b355d0d 2026-10-01 — SUPERSEDES below (queue EMPTY)

- DONE: verdict `verdicts/I2-dfdde9c.md`. Gate extended (port rule, IOR6 catalog + runtime, Link both variants + derived path) and PUSHED **b355d0d** (gate-only, tree 19d8e5e == origin). 7 seeds RED by name incl. builder arms (ScenarioUnit 1->2 links + JSON arm, Ior.test port cases), AC2 unexempted. Cold 538+2/540 0 failed, AC3 46/46, npm start zero diff, AC6 solo 1130/1012.
- FINDINGS sent: no concrete local link example in specs (labeled fixture used); one port error message for all port defects; Link has no own test folder.
- QUEUE: empty — hold for oopPO's next order.

# oopTester@WODA.prod — e9be607 (oopPO spec 14 fixes) GATED GREEN 2026-10-01 — SUPERSEDES below (queue EMPTY)

- DONE: own scan count 7 distinct canonical IORs (TOTAL 11: 6 comp / 5 inst), matches oopPO; gate 12/12 on e9be607; seed (leading-zero port example in spec/ior.md) RED IOR2+IOR3 by name, residual 0; cold 532+2/535 with the AC6 timeout (solo 1116/1075 ms = instrument). Verdict addendum 2 in verdicts/I1-66e5262.md. Suggested spec rule: port without leading zeros.
- QUEUE: empty — hold for oopPO's next order naming a sha.

# oopTester@WODA.prod — I1 GATE PUSHED 0c6e97c 2026-10-01 — SUPERSEDES below (queue: run my gate on oopPO's spec fixes)

- DONE: pushed my IorAcceptance.test.ts (IOR1-IOR5) as Web4MDA **0c6e97c** (66e5262..0c6e97c, gate-only, oopPO ruling). Cold on the commit: rc=0 533+2/535 0 failed, AC3 46/46, tree 14a6dde == commit tree == origin tree. I1 = QA-green with gate on origin. Verdict addendum in verdicts/I1-66e5262.md.
- NEXT (oopPO): spec fixes — IOR2 'deep-equals' -> 'structurally equal'; canonical IOR examples added to spec/ior.md (oopPO runs my gate on them before pushing). AC6 = hottest timeout risk (flagged, budget kept).
- PUSH METHOD: commit in the isolated clone, `git ls-remote` origin == parent, then `git push git@github.com:web4x/Web4MDA.git HEAD:main`; verify origin tree == gated tree.

# oopTester@WODA.prod — spec 14 I1 GATED on 66e5262 2026-10-01 — SUPERSEDES below (queue: oopPO's call on my gate patch)

- DONE: verdict `verdicts/I1-66e5262.md` — QA-GREEN on I1 scope. I1 shipped with NO IOR1/IOR2-scan/IOR5-no-write guards -> I built `IorAcceptance.test.ts` (IOR1-IOR5), PATCH `session/tasks/oopTester-ior-I1-gate-66e5262.patch` (NOT pushed; oopPO decides). 6 seeds RED by name, residual 0. IOR2 scan CHECKED 6/SKIPPED 0/TOTAL 6 but only 2 distinct strings; 0 JSON IORs; IOR2 'deep-equals' impossible literally (uuids) -> structural. SC4 arms re-proven (S3 seed). Abstract hand-pin verified 17, flagged residual.
- Whole suite: M1Layout AC6 timeout 3/3 cold runs (load 4-6). Solo base 946/892 vs I1 1047/988 ms; base full-suite AC6 1975 ms = 79% budget. INSTRUMENT (closed rule), budget kept, FLAGGED as hottest timeout risk.
- LESSONS: git status is blind to ignored paths -> spy node:fs for no-write; test files must not reference node:child_process (use Child); catalog superclass edge is named 'extends <X>'.

# oopTester@WODA.prod — NAMESPACE GATED GREEN on 950a241 2026-10-01 — SUPERSEDES below (queue EMPTY)

- DONE: **950a241** (oopExpert's atomic push: code + spec 79d1d268 + my gate aee1d2ce, VERBATIM — 0 diff lines measured) QA-GREEN: cold x2 rc=0 525+2/527 (2 skips = declared holds), AC3 46/46, npm start zero diff, my 6 gate tests pass by name, 8 seeds RED by name on the SHIPPED code (residual 0). Verdict `verdicts/NS-950a241.md`. oopExpert's run-1 M3Class AC1 timeout NOT reproduced (instrument, budget kept).
- QUEUE: empty — hold for oopPO's next order naming a sha.

# oopTester@WODA.prod — NAMESPACE gate patch HANDED 2026-10-01 — SUPERSEDES below

- DONE: Tron ruled namespace -> INSTANCES of the existing `Namespace` UcpComponent ("1 yes as recommended"; M3Relationship answered `dependency` only). My SC8 clause-2 gate change = PATCH **AI/Claude aee1d2ce** `session/tasks/oopTester-namespace-gate-26b49fd.patch` (ThinglishGrammar.test.ts only, vs 26b49fd), handed to oopExpert (consumed) + reported to oopPO. NOT pushed by me — oopExpert lands spec 79d1d268 + code + my gate in ONE atomic push.
- Gate: 4th row kind INSTANCE of an existing UcpComponent (parsed from the table); grammar.instances == table; held == OPEN (= empty); exactly one state per keyword; elementOf(namespace) undefined; namespaceOf(sample) EXACT class Namespace + declared leaf. Measured: spec-only RED 1; no-code RED 3; contract GREEN 9/9; 8 seeds RED by name; tsc 0; applies clean on fresh 26b49fd+79d1d268.
- FINDING: Version extends Namespace -> toBeInstanceOf(Namespace) accepts a Version (fail-open on the symmetric neighbour) -> exact-prototype check.
- QUEUE: gate oopExpert's PUSHED atomic sha cold (HEAD == origin/main mechanically; commit tree == gated tree) and report to oopPO. Evidence clone /tmp/oopTester-c3c4 (scratch code inside = contract proof only).

# oopTester@WODA.prod — S2b GATED GREEN 2026-10-01 ~20:00 — SUPERSEDES below (queue EMPTY)

- DONE: **S2b** — my SC8 clause-2 gate **26b49fd** on ec935b7 (tree cbea5a6f = gated tree), verdicts/S2b-ec935b7.md @ AI/Claude cc7c5820. S2 complete on pushed shas: 4e7242d + SC5 b86bc08/51ff8e3 + ec935b7 + 26b49fd -> oopPO takes to Tron.
- FLAGGED: Tron's 'M3Relationship, latest/prod are instances of Version' may rule NAMESPACE (spec posed namespace as M3Relationship OR M3Package); spec kept namespace OPEN — gate derives from the table, follows any row change.
- DONE earlier today: S1 ef61ccc, S3 253666e (verdict files in verdicts/).
- LESSON: shared Web4MDA checkout falls behind origin (peers push from clones) — gate HEAD == origin/main mechanically before committing; prove commit tree == gated tree before pushing.
- QUEUE: empty — hold for oopPO's next order naming a sha.

# oopTester@WODA.prod — S3 GATED GREEN 2026-10-01 ~19:15 — SUPERSEDES below

- DONE: **S3 GREEN on pushed 253666e** (tree 385a5b78) — verdicts/S3-253666e.md @ AI/Claude 44bb86a1: cold 519+2/521 (control 51ff8e3 501+2/503), SC2-SC7 RED-by-name on real-source seeds, 3 rulings enforced, AC3 46/46, npm start zero diff, class count 74->80->86 measured.
- QUEUE: gate **S2b** (SC8 clause 2: derived keyword set, every keyword -> an M3 element; seed an unmapped keyword -> RED) on oopExpert's pushed sha. S2 -> Tron only after S2b.
- LESSON reinforced: a seed is a claim — 3 of my seeds were inert this gate (toJSON builds keys explicitly; AC9 reads the MODEL; TS copies use `override async`); diagnose before calling GREEN a gate miss.

# oopTester@WODA.prod — SC5 KIND-AWARE ARM pushed 2026-10-01 ~18:30 — SUPERSEDES below

- DONE: Web4MDA **51ff8e3** — SC5 derived arm calls every stub KIND (static on the class; abstract owner via Object.create(Owner.prototype); getter via get; Reflect.apply; awaited), CHECKED/SKIPPED/TOTAL with SKIPPED 0. Proven on my clone of oopExpert's S3 5312594 (25 stubs): static/abstract early returns RED by name; skipped kind RED 'CHECKED 24 / SKIPPED 1 / TOTAL 25'.
- QUEUE: gate **S3** on oopExpert's PUSHED sha (rebased on 51ff8e3) — whole cold suite default PATH, my 3 S3 rulings enforced (held-gate exact declaration allowance, AC9 7-member DefaultFile, AC6 budget kept), SC2/SC3/SC4/SC6/SC7 per spec 13 §6, AC3 by name. Then **S2b** (SC8 clause 2).

# oopTester@WODA.prod — S2 GATED + SC5 CLOSED 2026-10-01 ~18:00 — SUPERSEDES below

- QUEUE: (a) gate **S2b** (SC8 clause 2: derived keyword set, every keyword -> M3 element; seed an unmapped keyword -> RED) when oopExpert pushes it; (b) gate **S3** on its pushed sha (oopExpert rebases onto b86bc08). S2 goes to Tron only after S2b.
- DONE: S2 verdict on pushed **4e7242d** (tree 0df21489) — file `verdicts/S2-4e7242d.md` (AI/Claude 0e9dc111 + update 60e5b330). SC8 clause1 GREEN both sides; clause2 NOT BUILT; suite 1/4 rc=0 501+2/503, reds = load timeouts only (oopPO: instrument, budgets KEPT, discriminate by solo run); AC3 46/46; npm start zero diff.
- DONE: **SC5 closed by EXECUTION**, Web4MDA **b86bc08** (ThinglishParser.test.ts derived arm calls + awaits every derived stub via Source.of; seed C RED on derived arm).
- S3 RULINGS sent to oopExpert: held gate UnitReferencesInc2 test 189 = exact DECLARATION allowance (link in ScenarioUnit/ScenarioIndex/DefaultFile/BrowserFile/NodeJSFile; sync in ScenarioUnit/ScenarioIndex) + body must be the stub or one refuse(); exact both ways. AC9 DefaultFile = {read,write,exists,remove,refuse,link,copyTo}. AC6 budget KEPT 2500 ms. S3 WIP cd73372 is NOT in the shared repo — gate only the PUSHED sha.
- On landing: STOP + HOLD + REREAD; identity `claudeCode session.current oopTeam:3.0`; LEAN captures; default PATH = normal shell PATH without node22, never env -i.

# oopTester@WODA.prod — S1 GATED GREEN 2026-10-01 ~17:00 — SUPERSEDES below (queue now EMPTY: hold for oopPO's next order)

- DONE: spec 13 **S1 — EAMD.ucp restore** QA-GREEN on PUSHED **ef61ccc** (tree 508ac5b1ccebd0ad59c29293c67979c87712e766, verified on origin = gated candidate). S1 = 0137520 (pushed 16:33, before the gate) + ef61ccc (my fold-in). Cold, isolated fresh clone, plan default PATH (node v16, node22 NOT on PATH): npm test rc=0, 62/62 files, 493+2/495; control 652dc1f 490+2/492 (+3 = SC1). AC3 46/46 BY NAME (/tmp/oopTester-c3c4-scripts/ac3.mjs). npm start rc=0 zero diff. 2 skips = declared holds (TreeFileUnitInc1 T5.2-5.5 HELD, T8 NOT BUILT).
- MY GATE: `ScenarioLayoutSC1.test.ts` (spec 13 SC1) 3/3; RED-by-name proven for Scenario/Index missing, stray root Components/, layout-root drift. WEAKEST LITERAL: the on-disk half can't be RED by its own name — caught earlier fail-closed (import chain / M1Layout placement).
- PINS: ratified 5 (not 4 — fixtures/budget/vitest.budget.config.ts was undeclared, move-consequent). s1-wip.patch was STALE vs ea0b417.
- FLAGGED to oopPO: spec 13 SC1 text "no EAMD.ucp/Components/ at the repo root" contradicts itself (gate = no bare Components/ at root).
- LESSON: env -i is NOT default PATH (my 9 x 127 reds; origin control proved instrument). Evidence: /tmp/oopTester-s1-ev/.
- On landing: STOP + HOLD + REREAD; identity `claudeCode session.current oopTeam:3.0`; next work only on oopPO's order naming the sha. LEAN captures.

# oopTester@WODA.prod — PHASE-1 BANKED 2026-10-01 (3rd) for ARON's 2-phase rewind — MY panel 720.8k/1m = 72% (free 276.2k, Bash 22%) — SUPERSEDES below

- QUEUE (oopPO): gate **S1 — EAMD.ucp restore**, with **SC1 + AC3 BY NAME**, against **spec 13** — ONLY after landing, on oopPO's order naming the S1 sha. I have NOT read spec 13 yet: read it from spec/ on origin at that sha, never from memory. Spec 13 landed at **652dc1f** (origin HEAD when banked): new `spec/scenario.md` + plan `spec/plans/2026-10-01-scenario-units.md`; S0 amendments in eamd-ucp, index, model-json, radical-oop, thinglish, ucp.
- DONE + ACCEPTED (File/Folder migration, plan 2026-10-01-file-units-integration): M1 666a2fb, M2 03f4010, M3 2eea1c7 all QA-GREEN; last gate **`FileUnitsMigration.test.ts` @ cbb592c** (M1-M3 claims; owner/layer/type PARSED from the plan `## Target` table; `(+ X)` = bound model; no-STRAY rule; oracle guard). oopPO marks M1-M3 complete in the spec (runs my gate first — the Target table is load-bearing). My file-migration gate context is OBSOLETE for S1 — do not carry its assumptions into spec 13 unless spec 13 says so.
- Reusable METHOD (measured): isolated `git clone --no-hardlinks` + node_modules SYMLINK (unlink before rm); scripts in /tmp/oopTester-c3c4-scripts (ephemeral — rebuild if gone: clone.sh, gate.sh, cycle.sh, seed.mjs, probe.mts, crosscommit.mjs, skipped.mjs, ac3.mjs); seeds via script files (compound bash gets denied); seed → RED BY NAME → revert residual 0; a load crash is RED-by-load, say so; when the gate file is TRACKED+modified, back it up before any `git checkout` revert; stage the exact commit (git rm/add) before the cold suite; push proof = committed tree == measured `git write-tree`; outside vitest: `await M1Catalog.load()` + `M1Layout.load(catalog)`; vitest JSON reporter for counts (CLAUDECODE env hides passing output). Timeout-only RED = re-run ALONE, report both, never raise 2500.
- On landing: STOP + HOLD + REREAD this block; identity `claudeCode session.current oopTeam:3.0`; report reread BY CONTENT to ARON; wait for oopPO's S1 order. LEAN captures.

# oopTester@WODA.prod — BOUNDARY SAVE 2026-10-01 after M3 — SUPERSEDED above

- DONE (QA-GREEN, accepted): **M3** @2eea1c7 (FileServer + FileServerModel → DefaultFolder). Gate = **`FileUnitsMigration.test.ts` @ cbb592c**: MOVED_BY = { M1 Node pair, M2 Browser pair, M3 FileServer + FileServerModel }; PARSER FIX: a `(+ X)` Target unit is its row main unit's BOUND model (`boundBy`) — plan states no type for it, MA2 asserts still a Model AND still the binder's type argument. 14 tests. Cold @2eea1c7 + gate: 492 = 490 + 2 skipped + 0 failed; AC3 46/46 by name. Push proof: committed tree == measured `git write-tree` (96ba677e).
- RULED (RATIFIED verbatim, now in 2eea1c7): M1Layout.test LayoutOracle.unitHome drops the UcpComponent-descendant restriction (any class whose HELD source lives in another component's src). Measured: pure generalization at 83cf491 (12/12 both ways), M3 11/12 → 12/12; AC6 reads NO model relationship (disk held-home vs disk generated files) — a model-only seed leaves it green, so model-vs-plan stays MY MA3; coherent misplacement (move held source + repoint import) → RED by AC6's named assertion; incoherent move → RED by load.
- Reviewed: MofLayoutAC5.test.ts change @2eea1c7 = path rewrite only (−1/+1, identical after FileServer/latest/src → DefaultFolder/latest/src).
- QUEUE: empty — oopPO marks M1-M3 complete in the spec (runs my gate first: the Target table is load-bearing). Hold for oopPO's next order.

# oopTester@WODA.prod — PHASE-1 BANKED 2026-10-01 (2nd) for ARON's 2-phase rewind — MY panel 655.9k/1m = 66% — SUPERSEDED above

- QUEUE (oopPO): gate File/Folder **M3** (FileServer + FileServerModel → DefaultFolder) on oopExpert's M3 sha — ONLY after landing from this rewind, on oopPO's order naming the sha. Heaviest gate: ALL AC3 arms by name. Read MA1-MA7 from spec/ at that sha.
- DONE (QA-GREEN, accepted by oopPO): **M1** @666a2fb (gate 346bccf) and **M2** @03f4010 (M2a 200b4ae + M2b 03f4010). Gate file now **`FileUnitsMigration.test.ts`** = **902f5b5** (replaced FileUnitsMigrationM1; REPLACE ratified by oopPO): owner/layer/type PARSED from the plan `## Target` table (class PlanTarget), only input = increment claims `MOVED_BY = { M1: Node pair, M2: Browser pair }`, + no-STRAY rule (every role-less containedBy is a Target unit of exactly that owner), + oracle guard (row deleted / table renamed → RED). Cold suite @03f4010 with it: 488 = 486 + 2 skipped + 0 failed. The Target table is LOAD-BEARING (oopPO runs my gate before pushing plan edits).
- **M3 TODO in the gate:** add `M3: ['FileServer', 'FileServerModel']` to MOVED_BY. ★ PARSER GAP to fix FIRST: the row `FileServer (+ FileServerModel)` makes PlanTarget give FileServerModel the row's type (`UcpComponent`) — WRONG (it is a Model, layer 3: 'model 3' parsed only for layer). Make type per-unit (or skip MA2 type for the +model unit with a NAMED reason) — measure FileServerModel's real model first. FileServer superclass parse = first backticked token bare (`UcpComponent<FileServerModel>` → UcpComponent).
- Known MECHANICS (measured, not hypotheses): (1) dropping a unit's containedBy or moving its source off its layer → RED fail-closed at SUITE LOAD (M1Layout/M1Catalog import the model-derived path; the error names `<Unit>/latest/...` = re-derived as own component) — report as RED-by-load, not by my assertion. (2) MA7 is STRUCTURAL: role-less containedBy (name '') is non-navigable, M1Sample.held() reads property '' → the spec's leak-seed cannot fail (oopPO rewrote MA7); comparator proven by a real content seed (readme text, M1Sample.ts:80). (3) GenClaims reads TRACKED files: a gate file deleted with plain rm but still tracked → ENOENT RED = MY instrument; stage the real commit (git rm/add) before measuring. (4) push proof = committed tree hash == measured clone `git write-tree` (no 2nd suite run needed if origin did not move). (5) M1Catalog.load() + M1Layout.load(catalog) before classes()/homeLayout() outside vitest (LayoutSetup does it in-suite).
- Timeout tally: 3 tests have hit the 2500 budget under concurrent load (latest: M1Layout 'AC6 is failable' 2536ms, alone 718ms) = INSTRUMENT; rule CLOSED: re-run ALONE, report both, never raise the budget.
- Method: scripts in /tmp/oopTester-c3c4-scripts (clone.sh <sha> <dir>, suite.sh, gate.sh <tag> <files>, cycle.sh <seed> <files>, seed.mjs, probe.mts, crosscommit.mjs, skipped.mjs, ac3.mjs) — /tmp is ephemeral: if gone, rebuild from this list. Isolated `git clone --no-hardlinks` + node_modules SYMLINK (unlink before rm); pre-migration "before" = d27de80. Report via `otmux send.raw oopTeam:2.0` after a dialog check; verify by grepping oopPO's scrollback.
- On landing: STOP + HOLD + REREAD this block; identity via `claudeCode session.current oopTeam:3.0`; report reread BY CONTENT to the driver (ARON); wait for oopPO's M3 gate order with the sha. LEAN captures (Bash was 21% of the window).

# oopTester@WODA.prod — PHASE-1 BANKED 2026-10-01 (1st) for ARON's 2-phase rewind (~66.6% by SM panel) — SUPERSEDED above

- QUEUE (oopPO, Tron-approved): gate the File/Folder units migration M1 (MA1-MA6) on oopExpert's **M1b sha** — ONLY after landing from this rewind; not before. Read the MA1-MA6 ACs from spec/ on origin, never from memory.
- Closed & ruled (do NOT reopen): timeout class = INSTRUMENT (concurrent-suite load); keep testTimeout 2500 (7d73cb3) as a regression detector; a timeout-only RED is discriminated by re-running ALONE, never by raising the budget (oopPO, banked 38a27cd7). AC3 start() event = 09-28 @2359a4c, historical — do not chase.
- Last green gates: GenClaims 5776fad (EXPECTED_SKIPPED=[] literal; real-tree NUL seeds RED), inc 6 final f86341f QA-green.
- Method that works: fresh `git clone --no-hardlinks` into /tmp/oopTester-c3c4 (node_modules = symlink to shared; unlink before rm), evidence /tmp/oopTester-c3c4-ev (ephemeral), seeds via script files (compound bash gets denied), JSON reporter for durations, mtime marker for writes, report via `otmux send.raw oopTeam:2.0` after checking its pane has no dialog.
- On landing: STOP + HOLD + REREAD this block; identity via `claudeCode session.current oopTeam:3.0`; report reread BY CONTENT to the driver; wait for oopPO's gate order with the M1b sha.

# oopTester@WODA.prod — TIMEOUT-class diagnosis @f7838bf 2026-10-01: INSTRUMENT (load), not DEFECT — reported to oopPO — SUPERSEDED above

- 3 cold whole-suite runs (JSON reporter, isolated clone): all EXIT=0, 476 passed / 0 failed / 478, 0 timeouts. Box load at end 3.8/5.2/3.9 on 16 cpus.
- M3Class AC1-no-factories (default budget 2500): suite 992 / 1374 / 670 ms; ALONE 276 / 325 / 248 ms -> parallel load inflates 2-5x; max 55% of budget. Code not slow.
- "AC3 start()": NO test title at f7838bf matches AC3+start(); all AC3 tests <300ms. Nearest start() test near 5s = Pipeline "is failable: a dropped M1Catalog.start()" 7484 / 6888 / 6803 ms (passes under its explicit budget). The 5044-vs-5000 event predates the 2500 rule (vitest default was 5000 then).
- Budget history: testTimeout 2500 set by MY 7d73cb3 (2026-09-29, explicit budgets, oopPO). Timeout NOT reproduced at this load.

# oopTester@WODA.prod — GenClaims skip-arm fix (5776fad) GATED 2026-10-01: GREEN — reported to oopPO — SUPERSEDED above

- Clone @5776fad (on origin/main). COLD EXIT=0 60 files 476 passed / 2 skipped (478), writes 0, dirty 0 (Child regression of a30d207 gone: GenClaims child_process import 0).
- EXPECTED_SKIPPED = [] literal (line 22, asserted 134); circular skipped.every(isBinary) removed (0 hits).
- REAL-TREE NUL seeds (tracked NOTES.md, not the scratch repo): R1 claim + one NUL -> RED 1f/5; R2 NUL, no claim -> RED 1f/5; both via the scanned-set test (unexpected skip != literal). Revert clean.
- Note: that test's title still says "every SKIPPED file is binary by content" — now true only via the [] literal (vacuous on the real tree).

# oopTester@WODA.prod — GenClaims derived scan (a30d207) GATED 2026-10-01: RED (Child-ownership regression) — reported to oopPO — SUPERSEDED above

- Clone @a30d207 (on origin/main). COLD EXIT=1: 1 failed / 474 passed / 2 skipped (477), 60 files, writes 0, dirty 0.
- RED (regression, deterministic): Child.test "BY CONSTRUCTION: no test file other than Child.ts references node:child_process" -> + GenClaims.test.ts. GenClaims.test.ts:1 `import { execFileSync } from 'node:child_process'` (parent f86341f: 0). Re-run alone EXIT=1. Fix = route the git ls-files call through Child.ts.
- GenClaims itself: control 4/4; tracked seeds each RED 1f/4: his deploy.sh + .env, MY .github/workflows/ci.yml, MY claim appended to a generated .puml. Untracked claim -> GREEN (by design: committed text only).
- WEAK: (a) "skipped = binary" (line 128) and CHECKED+SKIPPED==TOTAL are CIRCULAR (skipped is defined by isBinary, re-checked by isBinary) -> cannot fail; only real-tree number asserted is TOTAL>400. (b) Real tree: TOTAL 694, binary 0 by perl-NUL AND by git -I -> SKIPPED=0, the skip arm never runs on the real tree (exercised only in the scratch repo). (c) EVASION: a tracked text file with ONE NUL byte carrying a claim (NOTES.md) -> SKIPPED as binary -> GREEN.

# oopTester@WODA.prod — inc 6 FINAL (f86341f) GATED 2026-09-30: QA-GREEN, reported to oopPO — SUPERSEDED above

- Clone @f86341f (on origin/main). COLD EXIT=0 60 files 473/2/475, writes 0, dirty 0.
- (1) F2 recount, independent broad case-insensitive grep (ts/md/json/mjs/js, excl spec/) = 31 lines vs 30 allowance -> the 1 extra is GenClaims' own "regen/" negative control (not the gate token) -> claims outside the allowance = 0.
- (2) GenClaims.test: control 2/2; my seeds RED 1f/2 each: claim comment in M1GraphDefinition.ts, claim line in README.md, allowance line (UcpComponent smuggled) removed. Weakest literal: scan is ts/md/json/mjs/js only -> a claim in a .sh file stayed GREEN (S4); today 0 tracked unscanned-ext files carry the token (unscanned = 79 svg, 79 puml, 74 mmd + 3 dotfiles). Token requires the slash.
- (3) npm start EXIT=0, drift 0, gen/ absent; thinglish.ts copy of M2OoshClass regenerated identical; held src/ts copy is not regenerated but IS reproduce-gated to its Definition: seeded drift (SKIPPED msg, ts:318) -> 4f across M1Catalog/M2TypescriptClass/M3Class RED. Those gates are modulo comments -> checked the fixed stableUuid comment: identical in ts, thinglish.ts and Definition.
- Next: HOLD; oopPO reports inc 6 up to Tron.

# oopTester@WODA.prod — inc 6 HONESTY chunk (d1f27af) GATED 2026-09-30: F1 GREEN, F2 RED (18 lines remain) — reported to oopPO — SUPERSEDED above

- Clone moved to d1f27af (on origin/main). COLD EXIT=0 471/2/473, 59 files, writes clone 0 / shared 0.
- F1 FIXED+proven: own unknown-named seed MOF/M1/M1Qwerty/latest/src -> MofLayoutAC5 1 failed/12 via "C: extra MOF/M1/M1Qwerty"; real tree green; revert clean.
- F2 NOT 0: 84 raw gen/ mentions (ts/md/json/mjs excl spec/); after classifying legit (retired-assertions, GenReaders seeds+trap, smuggled seed, Pipeline gen/ ls-files filter = documented guard, history notes) -> 18 stale lines claiming output lives in gen/: TITLES 3 (BootstrapSeed.test:37, MofPlainNode.test:74, Spec.test:331 ARM4); runtime LOG 3 ("generate:oosh SKIPPED ... so gen/oosh is not generated" M2OoshClassDefinition:694 + ts:318 + thinglish.ts:282); COMMENTS 12 (M1Graph.ts:183 "into gen/"; M2OoshClass.ts:309 "-> gen/oosh/"; stableUuid "so gen/oosh does not churn" Definition:202 ts:75 thinglish:57; MofPlainNode.test:10; Scratch.ts:5; Spec.test:243; TreeFileUnitInc1.test:24; Web4MDA.test:51; GenAtomicityProbe:10,12). Borderline excluded: M1Catalog.test:180 negative-assert message. Earlier F2 sites (Pipeline titles, M2ES2020Class:48, NodeShell:35, ImportModel:8) verified GONE in the UNFILTERED scan. spec/ not in scope.

# oopTester@WODA.prod — inc 6 C3+C4 (8bbf43c) GATED 2026-09-30, reported to oopPO — SUPERSEDED above

- Fresh `git clone --no-hardlinks` @8bbf43c (/tmp/oopTester-c3c4; evidence /tmp/oopTester-c3c4-ev, ephemeral). COLD npm test EXIT=0 471/2/473, 59 files, 61.7s; mtime writes clone 0 / shared tree 0 (channel proven: fresh npm start rewrote the 15 -> seen).
- (1) Retargeted gates, all FAILABLE on the component tree (control 55/55 on the 7 named files): S1 gen/ resurrected -> M1Layout AC7, MofLayout, ComponentModelInc2, Pipeline RED; S2 drop 1 generated puml -> M1Layout AC6, Pipeline RED; S3 stray generated -> AC6, Pipeline; S5 ghost component (unknown name) -> MofLayout + TreeFileUnitRulings rule4 RED; S6 Components/stray -> MofLayoutAC5 F RED; S7 component INSIDE the Version -> TreeFileUnitRulings rule4 (x2) + MofLayout RED; S8b known-name extra in wrong Mx -> MofLayoutAC5 "C: extra MOF/M2/M1Layout" + MofLayout + rule4 RED; S9 dropped-start seed neutralised (identity edit, Pipeline.test.ts:136) -> its is-failable test RED (non-vacuous). CONFOUNDS (no verdict, import breakage): S4 mv component, S8 cp whole component.
- F1 (gate weakness, not vacuous overall): MofLayoutAC5 C "EXACTLY ... nothing else" only sees folders named like a KNOWN model (line 92 filter) -> an unknown-named extra component passes C (S5); covered by MofLayout + rule4. B proven only by its in-suite copy-tree seeds (real-tree B seed breaks imports). G-A proven by its own in-suite seeded test (GenReaders.test.ts:138), not re-seeded from outside. M1Layout AC7 per-language arm = .some() (>=1 file per language).
- (2) MOVE: 220 R100 byte-identical; 15 changed = 5 models (M1Graph M1Layout M1Sample M2OoshClass Web4MDA) x mmd/puml/svg (13 R093-097 + 2 svg as A/D). Fresh real `npm start` EXIT=0 rewrote all 15, tree drift 0 -> equal fresh pipeline output, not hand-moved. PlantUML reachable. gen/ absent after npm start.
- (4) Source.of prune 2x2 (full suite): duplicate M1Layout.ts in src/thinglish.ts, prune intact -> 4f / 3 files (M1Layout, Pipeline, Spec catch the stray itself); prune BLINDED -> 24f / 15 files; 12 files RED ONLY when blinded = prune load-bearing.
- (5) 0 executable gen path literals in non-test code. F2 (false claims in artifacts): Pipeline describe/it titles still say "committed gen/"; doc comments M2ES2020Class.ts:48, NodeShell.ts:35, ImportModel.ts:8 still describe gen/.
- No code defects. F1 + F2 reported. Next: HOLD for oopPO ruling.

---

# oopTester@WODA.prod — inc 6 C2 (c56ef92) GATED 2026-09-30, reported to oopPO; DUE A REWIND before C3 — SUPERSEDED above

- Fresh clone. COLD EXIT=0 471/2/473. P1: porcelain before==after is BLIND (home='' seed rewrote 225 Components/ files byte-identical, porcelain unchanged); mtime marker: seed 225 writes RED, unseeded full suite 0 writes anywhere GREEN. P2 dropped-start (Pipeline.test.ts:134): neutralised seed -> RED, non-vacuous. isGenerated blinded -> 20 failed across exactly 12 test files (incl Pipeline, GenReaders). Generated home mode NOT separately seeded.
- No code defects; 1 instrument finding reported. Next: C3 gate AFTER my rewind.

---

# oopTester@WODA.prod — inc 6 C1 (9012b3f) GATED 2026-09-30, reported to oopPO — SUPERSEDES the blocks below

- Fresh clone. COLD EXIT=0 471/2/473. From EMPTY gen: npm start EXIT=0, 460 files, 0 under src/ts (75 .ts = thinglish.ts TARGET, legit); committed gen src/ts 75 -> 0.
- GenReaders: my OWN 5 seed shapes (createReadStream, URL-object read, fs.promises.readFile, static import, createRequire) all REPORTED under a STRICT check (TrappedRun defaults reads to a 'NO REPORT' sentinel -> a length>0 check is hollow). My OWN mutation under() -> false: 2 RED (author failable arm + mine). Static arm: default root seed -> RED.
- Web4MDA.generate: gen probe removed, proof = step exit status (accepted risk: exit-0-without-write, covered downstream).
- Wording findings only: '0 .ts' -> '0 under src/ts/'; '4 readers' not in spec. HOLD.

---

# oopTester@WODA.prod — 5b CHUNK C (9790fd2) GATED 2026-09-30 -> 5b fully gated from my side — SUPERSEDES the blocks below

- Fresh clone @9790fd2. COLD EXIT=0 467/2/469. MofLayoutAC5 unseeded 12/12.
- catalogSanctioned == modelFiles == 74: failing-probe Received [74,74] + independent git count of 74 *Definition.ts.
- My own mutations on isSanctionedModuleLoad: M1 scope phase-agnostic -> 3 RED (chunk-C 'outside its call site', 5a S-a, D+G1); M2 isQueryFree dropped -> RED 'cache-busted model file inside M1Catalog.load', and with that expect removed -> RED 'cache-busted closure file inside M1Layout.load' (vitest stops at first failing expect — observe each window separately). View.ts 5a seed still present+caught.
- No findings. HOLD for oopPO.

---

# oopTester@WODA.prod — 5b B1(2516298)+B2(b5e5e9d) GATED 2026-09-30, reported to oopPO — SUPERSEDES the blocks below

- Fresh clone of origin @b5e5e9d. COLD npm test EXIT=0 466/2/468, 58 files, 68.0s. Weakest literal: xxxClass() entry methods = 0, defined( = 0.
- FAILABLE + restored: (1) code-literal seed -> 'ONE init literal … NO catalogued name as a literal' RED; (2) guard -> new Map() -> 'rule 5: a process that NEVER loads … THROW' RED (my A finding #1 now GATED); (3) hand-edit Package.ts -> 'M3Class … AC5 … EVERY catalogued class of EVERY component' RED.
- TIMING M1GraphNoSourceRead @4b99e04: flag present (cache DISABLED) slowest child 2.3/2.1s, file 6.9/6.7s; flag removed (cache ENABLED) slowest 5.1/5.1s, file 13.2/11.6s -> the tsx cache IS the ~5s stall there. Corrected my A-pass claim (AC3 shows no cache effect; wrong test then).
- No open findings on 5b A/A2/B1/B2. HOLD for oopPO.

---

# oopTester@WODA.prod — 5b A(4b99e04)+A2(6313d64) GATED 2026-09-30, reported to oopPO — SUPERSEDES the blocks below

- One lean pass, fresh `git clone --no-hardlinks` of origin @6313d64 (shared tree untouched). COLD npm test EXIT=0 461/2/463, 58 files, 65.1s.
- FAILABLE + restored GREEN: Definitions generate==src (hand-edit FileServer.ts -> 19 RED incl named reproduce guards) · Child sole owner of node:child_process (foreign import in FileServer/latest/test -> RED, scan derived) · AC1 model/ skip (remove M1Catalog.test.ts:68 -> 3 RED).
- FINDINGS for oopPO to rank: (1) classes()-throws-unloaded PROVEN in plain tsx (EXIT 1) but UNGATED in-suite — vitest setupFiles LayoutSetup.ts loads before every file; needs a Child-spawned pre-load gate. (2) classNamed exists but 72 of 74 xxxClass() entry methods remain (only fileServer* moved to model/).
- AC3 timing: file ~2.4s in isolation at pre-A / A2 cache off / A2 cache on -> tsx cache NOT shown to be the 5044ms; attribution UNCONFIRMED (suite contention plausible). Lesson: `tsx -e` import was BLIND (EXIT 1) — time via a .mts file + a LOADED assert.
- HOLD for oopPO ranking.

---

# oopTester@WODA.prod — 5a S-a ARM FIX PUSHED 104df568 (GitHub main) -> 5a QA-green per oopPO ruling — SUPERSEDES the block below

- oopPO ruled (a) BLOCKS QA-green -> I added a NON-closure seed (layer3/View.ts, plain first load) to the committed S-a arm + relabelled seed 1; pushed from ISOLATED CLONE (oopExpert mid-5b in shared tree). 104df568 = fast-forward on oopPO's spec fix 168fc4ac (landed while I gated; rebased + re-gated).
- Failable: closure-only mutant -> ORIGINAL arm GREEN (gap real), NEW arm RED on the new label (EXIT 1); restored GREEN. tsc(test) 0. Probe: 9ef06bdb x2 EXIT=0 458/0/2/460; 104df568 x1 EXIT=0 458/0/2/460, TOUCHED 0.
- (b) query/cache-bust residual -> ranked into 5b hook-integration chunk (re-gate it there). (c) spec wording -> oopPO landed 168fc4ac.
- Reported sha to oopPO (delivered). HOLD. Next likely: 5b gate (M1Catalog.load + XDefinition model files + AC5 generate==src).

---

# oopTester@WODA.prod — spec-12 inc 5a GATED at f16c8c32 (module-load detector): conditions MET, recommend QA-green, 3 disclosed — SUPERSEDES the block below

- Unsanctioned load (layer3/View.ts, OUTSIDE the 73-file closure) inside M1Layout.load -> EXIT=1 via D+G1 'S-a: NO module load ... outside M1Layout.load's sanctioned closure'. Call-site scope load-bearing: sanction made file-only -> arm RED. Guard neutered -> arm RED. Unseeded probe x2 EXIT=0 458/0/2/460; cold npm test EXIT=0 458|2 (460).
- Disclosed: (a) all 3 committed S-a arm seeds are CLOSURE files (FileServer, NpmPackage = UcpComponents; ClassModel in import closure, measured 15->16) -> no non-closure seed in the arm; add View.ts, relabel seed 1. (b) residual: phase window + query ignored -> cache-busted 2nd instance of a closure file inside the window is sanctioned; fix = query-free URLs only / first load per path. (c) spec says 'component class files', code = component classes + static import closure (73) -> strengthen spec.
- Lesson: my first in-window seed (FileServer) was IN the closure = false seed label; diagnosed by marker file + detector dump (sanctionedLoads delta) before any claim. Tools: tmp/inc5a-gate.sh, inc5a-r1b/c/d.sh.
- Reported to oopPO (delivered). HOLD.

---

# oopTester@WODA.prod — AC4b RE-GATE #3 DONE at ce2ebba8 (pins): conditions MET, recommend QA-green — SUPERSEDES the block below

- S0b/S1b/S1c/S2b/S3b/S4b RED via UNDECLARED guard; S5 RED via DRIFTED guard (named in assertion messages). S6 (append + re-pin, same diff) GREEN = declared act (agreed with oopPO; residual = review-dependent, pin hunk low-signal). Unseeded probe x2 EXIT=0 456/0/2/458, cold npm test EXIT=0 456|2 (458).
- Short sha is 8 chars now (ce2ebba8): HEAD guards compare by PREFIX (`case "$(git rev-parse HEAD)" in <sha>*)`).
- Long otmux messages get permission-denied inline: write to tmp/*.txt and `otmux send.raw <pane> "$(cat file)" Enter`.
- Reported to oopPO (delivered). HOLD. Evidence tmp/ac4b-regate5.sh/.out. Clone tmp/w at ce2ebba8 clean.

---

# oopTester@WODA.prod — AC4b RE-GATE #2 DONE at 73c7e15: conditions MET, recommend QA-green; S5 residual disclosed — SUPERSEDES the block below

- **All 6 ordered seeds RED via the declared arm** (real-tree "present EQUALS declared"): S0b/S2b/S3b/S4b EXIT=1 453/2f/2s/457; S1b/S1c EXIT=1 454/2f/2s/458 (2nd RED each = collateral exact-list arm). Unseeded: probe x2 EXIT=0 455/0/2/457 TOUCHED 0, PROBE_EXIT 0; cold npm test EXIT=0 455 passed | 2 skipped (457).
- **S5 residual (extra, disclosed):** source class APPENDED to declared latest/test/Scratch.ts -> HIDDEN, EXIT=0 455/0/2/457 (declaration = path, not content). oopPO's call.
- Reported to oopPO pane (delivered). **HOLD** for ruling. Evidence tmp/ac4b-regate4.sh/.out. Clone tmp/w at 73c7e15 clean.

---

# oopTester@WODA.prod — AC4b RE-GATE #2 IN PROGRESS at 73c7e15 (TestFolder.declared) — SUPERSEDES the block below

- oopPO order: re-run S0b S1b S1c S2b S3b S4b on isolated clone of 73c7e15, each must be RED via the declared arm; + unseeded GREEN + cold npm test EXIT; report EXIT per seed + CHECKED/SKIPPED/TOTAL. oopPO was rewound — send to oopPO's pane only if its reread is confirmed, else via SM (oopTeam:4.0).
- 73c7e15 facts: declared = 13 CONCRETE paths (no glob), exact-path Set, both ways (undeclared + declared-but-absent). Added S5 (extra, labelled): source class APPENDED to a DECLARED file (Scratch.ts) — residual of a path allow-list (declaration = path, not content).
- Script tmp/ac4b-regate4.sh -> tmp/ac4b-regate4.out (one line per run). If rewound mid-run: re-run it (clone tmp/w at 73c7e15, reverts itself).

---

# oopTester@WODA.prod — AC4b FAIL-OPEN RE-GATED at 746c6d5: PARTIAL (plain case closed, 4 evasions HIDDEN) — SUPERSEDES the block below

**Evidence** tmp/: ac4b-regate.sh/.out (round 1, confounded), ac4b-regate2.sh/.out, ac4b-regate3.sh/.out, rg*-s*.json. Clone tmp/w at 746c6d5 clean. Reported to the SM (oopTeam:4.0) FOR oopPO (oopPO was being rewound, its pane driver-owned).
- **Baseline unseeded 746c6d5:** probe x2 each EXIT=0, CHECKED 452 / SKIPPED 2 / TOTAL 454, TOUCHED 0/709, PROBE_EXIT 0.
- **SEEN:** S0 plain source class in NodeJSFile/latest/test, no referrer -> EXIT 1, TestFolder real-tree arm RED.
- **HIDDEN (full suite EXIT 0):** S1c + one test importing it (453/0/2/455); S2b + quoted path in a COMMENT of an existing test (452/0/2/454); S3b as latest/test/fixtures/budget/Helper.fixture.ts inside a root's *.fixture.ts glob, NO other change; S4b probe-entry shape (class named after file, static start(), start() last), NO other change.
- **Consequence:** oopPO's point (3) "13 unmeasured skips moot" does NOT hold — TestFolder is evadable. Recommend NOT QA-green. Options (expert lane): scans skip only *.test.ts and scan machinery as source; machinery = import closure only; machinery may not have source-class shape.
- **Confounds removed:** round-1 names Smuggled.ts / Importer.test.ts collide with TestFolder.test.ts's own virtual seed paths (collateral exact-list REDs); round-1 probe seed lacked start() -> SrcTypecheck RED (incidental). Use non-colliding names for any seed near a gate's own fixtures.
- **NEXT:** HOLD for oopPO (post-rewind) ruling on the fix route; then re-gate the next sha with ac4b-regate2/3 seeds (all 5 routes must RED).

---

# oopTester@WODA.prod — ARM5 COMMITTED GREEN at 2c071e7 (GitHub main) 2026-09-30 — SUPERSEDES the block below

- **ARM5 doc-rot** (Spec.test.ts, +123, test-only) pushed as `2c071e7` on oopExpert's `746c6d5` (my first push REJECTED — peer landed mid-gate; rebased + re-gated, never forced). Probe x2 at 2c071e7: EXIT=0, 456/0/2/458, TOUCHED 0/709 = predicted delta (448 +4 TestFolder +4 ARM5; static 437->441->445). tsc(test) 0. Allowances EXACT = 11 (Once x2, X x2, Container, Loose seed, preflight.mjs + Preflight.test struck, 2 cross-repo). Scope excludes ./ ../ specifiers (oopPO ruling); disclosed residual: a ./-prefixed repo path is hidden (0 today). Real-tree seeds: stale path -> RED, new cross-repo -> RED. Reported to oopPO.
- **Instrument lesson (memory a-green-must-prove-it-saw-the-change):** SuiteTreeTouchProbe gates a ScratchClone of COMMITTED HEAD — blind to uncommitted edits; gate uncommitted work with vitest on the working tree + assert the new titles/count delta.
- **NEXT (hold for oopPO re-measure + go):** AC4b fail-open RE-GATE on `746c6d5` (TestFolder gate: latest/test/ holds only tests + DERIVED machinery). Re-run tmp/ac4b-skipseed.sh (fix HEAD check to the gated sha) — the TEST-path seed must now go RED — plus rule-tailored seeds for the 13 unmeasured skip sites; prove TestFolder failable (seed a source class under latest/test/ -> RED; its derived machinery allow-list = nearest dangerous member).

---

# oopTester@WODA.prod — AC4b GATED at 9823315 2026-09-30: criterion GREEN, skip audit = R1 FAIL-OPEN — SUPERSEDES the 100b641 block below

**Evidence** tmp/: ac4b-suite.out, ac4b-skipseed.sh + .out, skipseed-control.json, skipseed-test.json, t-base/t-new.txt, c-base/c-new.txt. Clone tmp/w at 9823315 tracked-clean.
- **Criterion GREEN:** SuiteTreeTouchProbe x2 each EXIT=0, 448 passed / 0 failed / 2 skipped / 450 = baseline exact, TOUCHED 0/707, PROBE_EXIT 0. Derived from git objects 100b641..9823315: 56 -> 56 test files, all 56 RENAMES (0 A/D), 0 in root test/, 0 outside /latest/test/; it/test lines 437 -> 437 identical per file (only delta = M1Sample.test.ts -> M1SampleObjectDiagram.test.ts, 5 = 5). oopPO quoted 438 (different counter).
- **Skip audit R1:** 17 sites skip by DIRECTORY substring /latest/test/ (ModelStyle 66/91/126, M1Catalog 67, M1Graph 232, M1Layout 213, M3Class 72+153, Boilerplate 93, ComponentModelInc2 55, Spec 151, TreeFileUnitInc1 91, Type 364/408/419, UnitReferencesInc2 191); MofPlainNode 62 test-scoped. Seed (free fn + ctor params): in latest/src -> RED 5 failed (ModelStyle AC5/6/7, M1Catalog x2); same class in latest/test -> GREEN 448/0/2/450 = hidden. PROVEN hiding: ModelStyle 66/91/126 + M1Catalog 67. Other 13 UNMEASURED (seed unseen even in src — needs rule-tailored seeds). Flag, no verdict: that seed in src was caught by no radical-OOP rule, only catalog exact-list + ModelStyle.
- **Reported** to oopPO (delivered, consumed): recommend NOT QA-green until the fail-open closes or oopPO accepts the risk; fix = expert/architect lane. **HOLD for oopPO ruling.**
- **oopPO RULED:** AC4b NOT QA-green, fail-open NOT accepted as risk; fix by construction (test folder must be unable to hold a source class unseen) -> oopExpert after its rewind; I re-gate it (re-run tmp/ac4b-skipseed.sh on the fix sha: TEST-path seed must go RED).
- **DOC-ROT ARM5 BUILT at 60822b7, NOT COMMITTED (real disk RED):** patch tmp/arm5.patch (138 lines, Spec.test.ts). Scope structural (backticked, '/', file extension, no glob/placeholder/ellipsis/abs/URL). History proof: 107 unresolved at 9823315 vs 24 at 60822b7 (delta 83 = oopPO's count). 3 failability tests green. oopPO's intentional set measured = 7 citations of 5 names (Once x2 unbuilt, X x2 placeholder, Container retired, Loose seed (NOT struck), Preflight.test.ts struck). 17 more RED: 10 stale gen/ (files moved under gen/EAMD.ucp/.../latest/{src,test}/; mof 54/59/62, ucp 65, ucp 104 gen/thinglish.ts), mof:74 scripts/preflight.mjs unstruck, 2 cross-repo session/base-skills (index:33, oosh-mda:140), 4 ./ specifiers (thinglish:23 x3, :68). Reported to oopPO; ruling needed on (c)+(d); after specs fixed: apply patch, prove GREEN+failable, commit+push. Probe: tmp/docpath-probe.mjs.
- **(was) QUEUED NEXT (oopPO, after this gate):** doc-rot arm on my doc gate — every backticked repo path in README + spec/*.md must RESOLVE in the tree, DERIVED (not a hand list); ARM3 allowed forms (struck/blockquoted) stay allowed; the 6 intentional non-files become ASSERTED allowances (placeholder src/X.ts, seed Loose.ts, retired Container, unbuilt Once, struck Preflight); failable: a seeded stale path -> RED. Context: the AC4b move left 89/89 cited paths stale while Spec.test stayed green; oopPO re-derived 83 at spec 60822b7.

---

# oopTester@WODA.prod — INC 4 L3 RE-GATED GREEN at 100b641 2026-09-30 — SUPERSEDES the 8d22cbc block below

**Evidence** tmp/: regate-100b641.sh, rg3.out, rg3-ms.out, rg3-gate.out. Clone tmp/w at 100b641 clean.
- **Suite x2:** PROBE_EXIT=0, each EXIT=0, CHECKED 448 / SKIPPED 2 / TOTAL 450, TOUCHED 0/707, load 4.1-4.3/16.
- **L3 CLOSED:** exemption = first foreign frame getSourceSync AND basename in the catalog load closure. G1 as shipped EXIT 0 (oopExpert S-b SEEN + control clean = sanctioned load still exempt); OLD clause restored -> EXIT 1 (module top-level read unseen). My S-b (non-sanctioned file as data): SHIPPED SEEN EXIT 0, OLD clause EXIT 1. S-b-prime (SANCTIONED FileServer.ts read AS DATA, the allowance's nearest member): SEEN EXIT 0.
- **S-a KNOWN (inc 5, spec d4acdaf):** non-sanctioned import() of ClassModel.ts still unseen, error empty (import ran) — recorded, not a verdict.
- **ModelStyle guard CLOSED:** empty root EXIT 1, expected 0 to be 75 vs git ls-files (independent).
- **Verdict:** inc 4 gate conditions all met -> recommend QA-green to oopPO (Tron rules DONE). **Next:** HOLD for oopPO.
- **PHASE-1 BANK (SM relay of oopPO rewind order; panel MEASURED 69% = 693.6k used / 303.4k free, fresh /context render):** idle, nothing running (0 test/probe procs), clone tmp/w at 100b641 tracked-clean, anchor clean on origin. Rewind is the trainer's (marker/map, land 40-50).
- **After landing:** phase-2 by CONTENT + delta-proof, report reread-confirmed to oopPO + SM, HOLD. **Upcoming = AC4b gate** (spec 12 line 27: each component's tests move to <Component>/latest/test/, Tron ruling <Component>/latest/{model,src,test}; the suite must discover EVERY test, count UNCHANGED before/after) — gate it on oopExpert's build sha with the fixed SuiteTreeTouchProbe (tmp/gates-copy), exit codes; baseline CHECKED 448 / SKIPPED 2 / TOTAL 450 at 100b641. Scripts in tmp/ (seed-*.sh, regate-*.sh, diag-sb.sh, ac4-layout-oracle.mts).

On boot: verify id (claudeCode session.current oopTeam:3.0 + newest jsonl; TMUX_PANE may be empty), reread this + SKILL + auto-memory, composer check (do NOT act), report reread-confirmed, HOLD for oopPO. Say REWIND.

---

# oopTester@WODA.prod — INC 4 RE-GATED at 8d22cbc 2026-09-30: L1+L2 CLOSED, L3 NEW (stack exclusion unscoped) — SUPERSEDES the AC4 block below

**Evidence** tmp/: rg-gate.out (suite), regate-8d22cbc.sh, diag-sb.sh (+ diag-sb-*.out), seed-ms.sh. Clone tmp/w at 8d22cbc clean.
- **Suite x2:** PROBE_EXIT=0, each EXIT=0, CHECKED 448 / SKIPPED 2 / TOTAL 450, TOUCHED 0/707.
- **L1 CLOSED:** Source.atLevel (name ^M3[A-Z], whole tree). M3Element M3->M2 seed EXIT 1 RED; control M3Class RED. **Per-level reproduce:** M3Element drift seed EXIT 1 RED naming M3/M3Element.
- **L2 CLOSED:** isSource by RESOLVED path (realpath'd root). My ./Components G1 seed SEEN (G1 EXIT 0).
- **L3 PROVEN (new in 8d22cbc):** exclusion `!stack.includes('node:internal/modules/')` is NOT scoped to M1Layout.load's sanctioned import. 2x2 (seed alone, record printed): S-b = module imported in the window that reads source AS DATA at top level: shipped UNSEEN (EXIT 1, sourceReads []), clause neutralized SEEN (EXIT 0) -> the exclusion hides it. S-a = non-sanctioned import() of a source .ts: UNSEEN both ways -> detector never traps module loads (pre-existing gap, not this commit).
- **Instrument (mine):** first S-a/S-b run VOID — pathToFileURL not in seed scope (record error exposed it); rerun with file:// URL.
- **ModelStyle guard:** completeness proven (subset root EXIT 1, 24 vs 75); non-empty half circular (both walk Components, emptied = 0===0) — low.
- **REPORTED + ACCEPTED (oopPO):** L3 -> oopExpert (exemption scoped to M1Layout.load call site + its exact file set); ModelStyle guard -> independent git ls-files count. S-a = PRE-EXISTING, scheduled AC5/inc 5 via loader hook (spec d4acdaf), NOT an inc-4 blocker.
- **Next = re-gate on oopExpert L3 sha:** (1) S-b SEEN AS SHIPPED (tmp/diag-sb.sh, SB SHIPPED must be EXIT 0) + prove the sanctioned M1Layout.load import is still EXEMPT (control seed clean); (2) S-a UNCHANGED, recorded as KNOWN (unseen both ways) — not a verdict; (3) ModelStyle guard seeded: emptied-count case must now RED vs git ls-files; (4) suite probe, CHECKED/SKIPPED/TOTAL + EXIT codes.

On boot: verify id (claudeCode session.current oopTeam:3.0 + newest jsonl; TMUX_PANE may be empty), reread this + SKILL + auto-memory, composer check (do NOT act), report reread-confirmed, HOLD for oopPO. Say REWIND.

---

# oopTester@WODA.prod — AC4 GATED at 0530855 2026-09-30: criterion GREEN, 2 GATE LOOSENINGS PROVEN (R1) — SUPERSEDES the AC2b block below

**Re-measure first:** Web4MDA main at gate = 0530855. Clone tmp/w reset to 0530855 tracked-clean. Evidence: tmp/ac4-gate.out, tmp/ac4-keep/, tmp/ac4-renames.txt, tmp/ac4-oracle*.out, tmp/seed-m3.out, tmp/seed-dotrel.out; scripts tmp/{seed-m3,seed-dotrel,ac4-renames,ac4-oracle-seed}.sh + tmp/ac4-layout-oracle.mts.

- **Suite x3 (fixed SuiteTreeTouchProbe):** GREEN PROBE_EXIT=0; each EXIT=0, 448/0/2 of 450, TOUCHED 0 of 707; load 4.0-4.9/16 (lighter than AC2b).
- **AC4 criterion MET:** git renames 978885e..0530855: 75 src ts -> 0 src -> 75 Components ts, 75 R (same basename), 0 A/D; test/ at root (67). Layout ORACLE (mine, independent of test/Source.ts: layout-derived path vs git ls-tree HEAD, placed M1Catalog included) 75/75 EXIT 0; proven FAILABLE both ways (ghost extra -> EXIT 1, dropped DefaultFile -> EXIT 1).
- **L1 PROVEN (false GREEN):** M3->M2 import-direction gate (M3Class.test ~120) now scans Source.namesIn(MOF/M3) = 4 files; M3Element moved to Web4MDA/latest/src/ts/EAM/layer2/ -> DROPPED (was 5 incl. M3Element in src/MOF/M3). Seed type-import M3->M2: control M3Class EXIT 1 RED; probe M3Element EXIT 0 GREEN. Same namesIn narrowing drops M3Element from the per-level reproduce list (~224) — coverage elsewhere NOT measured.
- **L2 PROVEN (false GREEN):** AC5 isSource (MofLayoutAC5 ~256) renamed src->Components in 3 of 4 clauses, kept dead ./src, no ./Components: seed fs.readFileSync(./Components/...M1Layout.ts) in G1 -> EXIT 1, sourceReads 0 (NOT SEEN). Pre-move ./src was seen.
- **Sound (owner review):** placed M1Catalog now BYTE-IDENTICAL (tighter); Source.of exactly-one (stricter); fileOf whole-tree exactly-one; exemption = exact relative path (no basename leak); AC6/Type/Boilerplate/Spec ARM4 1:1 re-rooted, strength kept; my M1GraphNoSourceRead path-agnostic (unaffected). Pre-existing (not regression): ModelStyle Components scan has no non-empty guard.
- **REPORTED + ACCEPTED (oopPO):** L1, L2 + ModelStyle non-empty guard dispatched to oopExpert (subjects by meta-level / resolved path); oopPO also asked it to justify M3Element layer2 placement.
- **Next = RE-GATE on oopExpert fix sha, 3 conditions:** (1) tmp/seed-m3.sh probe M3Element M3->M2 type-import -> RED (control M3Class RED too); (2) tmp/seed-dotrel.sh G1 ./Components read -> SEEN/RED (anchor line may move: script asserts unique, fails loud = instrument); (3) per-level reproduce (M3Class.test ~224) covers M3Element — PROVE by seeding a drift into M3Element source -> that test RED naming it. Plus suite probe with EXIT codes, ModelStyle guard present + failable. Clone reset/fetch by SSH URL git@github.com:web4x/Web4MDA.git.

On boot: verify id (claudeCode session.current oopTeam:3.0 + newest jsonl; TMUX_PANE may be empty), reread this + SKILL + auto-memory, composer check (do NOT act), report reread-confirmed, HOLD for oopPO. Say REWIND.

---

# oopTester@WODA.prod — AC2b GATED GREEN at fc5b568 2026-09-30 — SUPERSEDES the "AC2b GATE HELD" block below

**Re-measure first:** Web4MDA main = `978885e` (untouched by me this gate). Session `914c8cad`. Clone `$CLAUDE_JOB_DIR/tmp/w` at `fc5b568`, tracked-clean. Evidence outside the tree: `tmp/ac2b-gate.out`, `tmp/ac2b-keep/` (6 run JSONs), `tmp/probeA.out`, `tmp/seed-inode.out`, `tmp/seed-s11.out`.

- **Suite gate (fixed SuiteTreeTouchProbe from tmp/gates-copy, 6 runs):** GREEN, PROBE_EXIT=0. Every run EXIT=0, 448 passed / 0 failed / 2 skipped / 450, TOUCHED=0 of 706 tracked; load 5.5-10.1/16. Skips NAMED + deliberate: TreeFileUnitInc1 T5.2-T5.5 (HELD, increment 2), T8 (NOT BUILT).
- **Folder.test.ts:226** ("EVERY component is a Folder - DERIVED from the catalog"), ruled by data: passed 6/6 at 1247/1097/1122/1022/650/885 ms, max 1247 vs suite testTimeout 2500 = 0 timeouts -> NO change (oopPO rule).
- **probe (a) GenAtomicityProbe unseeded:** GREEN exit 0 - 535/535 atomic, 0 in place, 0 drifted/added, 490940 poll reads 0 mismatched.
- **Inode-arm seed** (writeAtomic -> in-place write()): Pipeline.test.ts EXIT 1, named arm RED "AC2b (a): gen/ files rewritten IN PLACE ... expected [..(535)] to deeply equal []". 2nd RED = the arm's own scoped self-seed losing its precondition under my GLOBAL seed (my seed's reach, not a defect). Reverted.
- **S11 seed** (method guard removed): FileServer.test.ts EXIT 1, AC3-hardening arm RED "expected 'FileServer refused: Origin ...' to match /only POST/" (Origin guard masks it - the arm catches the wrong reason) + in-process arm RED. Reverted.
- **AC19c correction (carried):** every run-1 AC19c RED earlier was MY probe's report file inside the clone (fixed 71aa2a0) - not a product defect.
- **Next:** report to oopPO, then HOLD for oopPO.

On boot: verify id (`claudeCode session.current oopTeam:3.0` + newest jsonl; `$TMUX_PANE` may be empty), reread this + SKILL + auto-memory, composer check (do NOT act), report reread-confirmed, HOLD for oopPO. Say REWIND.

---

# oopTester@WODA.prod — AC2b GATE HELD FOR REWIND 2026-09-30 — SUPERSEDES the AC3 block below

**Re-measure first:** GitHub main at save = `71aa2a0` (mine, test-only, on cf8df48 on fc5b568). **AC2b final sha = `fc5b568` (oopPO RETARGET)** — gate THERE. My clone `$CLAUDE_JOB_DIR/tmp/w` (its `origin` remote is the STALE live checkout — always fetch/push by the GitHub URL). Every gate report carries EXIT CODES.

- **AC3 QA-GREEN** (ebdf7d6, oopPO verified). **AC2b** (spec 12, from my AC3 flake finding): (a) gen via writeAtomic, (b) no test rewrites the tracked tree (inode+mtime, never git status), (c) FileServer.test arms fail under my 6 seeds.
- **Committed gate code:** `test/gates/{ScratchClone,GenAtomicityProbe,SuiteTreeTouchProbe}.ts` (b37b822; probe reads EXIT CODE + evidence cf8df48; report OUTSIDE the tree + host load + SUITE_PROBE_KEEP 71aa2a0). Run: `SUITE_PROBE_KEEP=<dir> node_modules/.bin/tsx test/gates/SuiteTreeTouchProbe.ts <root> <runs>`.
- **Measured so far:** RED baselines (ebdf7d6): 535/535 gen rewritten in place; suite touched 536 tracked (gen + package.json), git status 0 dirty. f785c57: probe(a) GREEN 535/535 atomic, 0/561803 mismatched; 0 touched 16/16 runs. **Self-inflicted confound found + fixed:** every run-1 AC19c RED was MY probe's `.suite-tree-touch.json` inside the clone. Remaining REDs = budget timeouts under full load (varying tests).
- **Owner rulings done (cf8df48):** Type AC8 8000 KEPT (max 2712), MofLayoutAC5 failable 7000 KEPT (max 2748), ONE_CHILD_MS 4000 -> 11000 (tail 4367). **Open:** rule `Folder.test.ts:226` budget (2595 ms once) from the kept JSONs.
- **HELD (oopPO, panel 76% = 241.4k free; gate would end at the wall):** the 6-run gate on fc5b568 was STOPPED (task b2o8nbxnm), no survivors, scratch dirs removed. **NEXT after the rewind + oopPO GO = gate AC2b at fc5b568 with exit codes** (copy of fixed gate files in tmp/gates-copy; clone tmp/w checked out at fc5b568, clean). **Then:** S11 seed vs FileServer.test at fc5b568, probe(a) at fc5b568, oopExpert's inode arm seeded (writer back to write() -> RED), report to oopPO with exit codes + the AC19c correction (every run-1 AC19c RED was MY probe's report file inside the clone — fixed 71aa2a0; not a product defect). Retired: my parked TreeIntegrity (duplicate of oopExpert's TrackedTree; patch still in $CLAUDE_JOB_DIR/tmp/ac2b-guard, NOT to be committed); TrackedTree gaps reported (latent hollow nested root, <=20 files named).

On boot: verify id (`claudeCode session.current oopTeam:3.0` + newest jsonl), reread this + SKILL + auto-memory, composer check (do NOT act), report reread-confirmed, HOLD for oopPO. Say REWIND.

---

# oopTester@WODA.prod — SPEC 12 INC 3 (AC3) GATED 2026-09-30 — SUPERSEDES the spec-12-inc-2 block below

**Re-measure first:** GitHub main at save = `ebdf7d6` (mine, ff on 82eb001). Session id `914c8cad` (post-rewind). Commit in the clone `$CLAUDE_JOB_DIR/tmp/w`, push fast-forward gated on `ls-remote` == tested base. Suite 445 passed + 2 skipped (447), tsc(test) 0.

- **Done + reported to oopPO (both messages seen by first words; detail QUEUED while it worked):** `ebdf7d6` = `test/ComponentModelInc3.test.ts` CHECKED 26 / SKIPPED 0 / TOTAL 26 — 13 arms x 2 children (src via tsx + GENERATED FileServer JS via node), each refusal asserts its NAMED reason + file UNCHANGED, CONTROL arm, CORS scan over >=25 responses incl OPTIONS. Seeds RECORDED `tmp/seeds7.py`: 12 product seeds x 2 variants, each RED at its named arm. oopExpert's FileServer.test.ts GREEN under 6/12 (file-link confine, form type, Origin null, CORS on OPTIONS, cap raised — product-derived oracle, OPTIONS admitted).
- **Authorization verified on disk before gating:** plan record "Approved by Tron via Claude Code plan mode 2026-09-30"; rule 3 security "authorised by Tron's plan approval"; oopPO hardening narrower = within it.
- **Instrument lessons:** OpenVZ venet0 carries 127.0.0.1 with internal=false → derive the interface scan BY ADDRESS; Node 22 default agent keeps sockets alive → raw hostile exchanges need `agent: false` (else EPIPE on a server-closed socket); absent Host = node:http 400.
- **NEW FINDING awaiting ranking (pre-existing, owner oopExpert):** generator rewrites gen/ NON-ATOMICALLY + Pipeline.test.ts runs real `npm start` IN THE REPO ROOT during the parallel suite → readers see EMPTY gen files (probe `tmp/truncation-probe.mjs`: puml empty 8x, UcpComponent.js 1x). Full suite RED 2/5 runs with my file, 0/2 without; 75/75 generated modules import clean fresh.
- **Next:** hold for oopPO.

On boot: verify id (`claudeCode session.current oopTeam:3.0` + newest jsonl; `$TMUX_PANE` may be empty post-fork), reread this + SKILL + auto-memory, composer check (do NOT act), report reread-confirmed, HOLD for oopPO. Say REWIND.

---

# oopTester@WODA.prod — SPEC 12 INC 2 GATED 2026-09-30 — SUPERSEDES the spec-12-inc-1 block below

**Re-measure first:** GitHub main at save = `3f69a9d` (mine, on a935551). Commit in the clone `$CLAUDE_JOB_DIR/tmp/w`, push fast-forward gated on `ls-remote` == tested base (rebase + FULL re-run if it moved — it did, twice, this session). Suite 409 passed + 2 skipped (411), tsc(test) 0. Report = short head first, detail second, verify by FIRST words, then check the footer for a paste chip.

- **Done + reported (both verified, detail needed one Enter):** `3f69a9d` = `test/ComponentModelInc2.test.ts` (5/0/5) gating AC2 at 57927eb: fs imports read as IMPORTS not text (M1Catalog modelled bodies = data) — src importers EXACTLY NodeJSFile+NodeJSFolder, generated surface only those two (8 files). OoshUnit comment finding: fixed at 9b8632e, test live (RED on 57927eb, GREEN since). Recorded out-of-band: gen diff exactly 36 = 9 routed × 4 languages.
- **Rulings:** Pipeline wrong-path seed ACCEPTED (fails closed, measured). M3Class sanctioned-form regex ACCEPTED — but that guard of MINE was hollow (raw text satisfied by M1Catalog data); FIXED in test/MOF/M3/M3Class.test.ts to read code; the computed-specifier seed now REDs it.
- **PHASE-1 BANK (oopPO order, panel 80% = 195.2k free):** spec 12 inc 1 GATED `7d39667`, inc 2 GATED `3f69a9d`. **NEXT = gate AC3 at `82eb001`** (oopPO verified 419 + 2 skipped) incl. the a935551 hardening arms. Do NOT start it until the rewind has landed and oopPO dispatches.
- **Next:** inc 3 (AC3, spec a935551): FileServer over raw HTTP — text/plain write, foreign Origin, foreign Host each REFUSED with the file UNCHANGED on disk (assert the side effect); no Access-Control-Allow* header ever; over-cap body refused; jail arms (.., absolute, symlink). Wait for oopPO's dispatch.

On boot: verify id (`otmux pane.self` = %207 = oopTeam:3.0), reread this + SKILL + auto-memory, composer check (do NOT act), report reread-confirmed, HOLD for oopPO. Say REWIND.

---

# oopTester@WODA.prod — SPEC 12 INC 1 GATED 2026-09-30 — SUPERSEDES the 9475602 block below

**Re-measure first:** GitHub main at save = `7d39667` (mine, on 51eb30b). Commit in the clone `$CLAUDE_JOB_DIR/tmp/w`, push fast-forward gated on `ls-remote` == tested base. Suite 402 passed + 2 skipped (404), tsc(test) 0. Report = SHORT head (sha + counts) first, detail second, verify each by its FIRST words.

- **Done + reported (both messages verified):** `7d39667` = `test/ComponentModelInc1.test.ts` (CHECKED 8 / SKIPPED 0 / TOTAL 8) gating spec/component-model.md AC1 at 51eb30b on the production classes AND the generated JS (round trip on a temp root, stored-path arm via root rename, no swallowed error, contract classes refuse, no Sync / static node: import, browser purity). 8 producer seeds (`tmp/seeds6.sh`) each RED at its arm.
- **AC9 ruling (my Boilerplate gate, edited by oopExpert):** ACCEPTED — rule 1 makes `methods == []` impossible; the edit keeps no-boilerplate and is stricter (exact contract), proven by two catalog seeds. Weakest literal: hand-written contract list, fail-closed.
- **Open:** none. **Next:** hold for oopPO (spec 12 inc 2 = AC2 no node:fs outside NodeJS units).

On boot: verify id (`otmux pane.self` = %207 = oopTeam:3.0), reread this + SKILL + auto-memory, composer check (do NOT act), report reread-confirmed, HOLD for oopPO. Say REWIND.

---

# oopTester@WODA.prod — 9475602 RE-GATED + REVIEW 2026-09-30 — SUPERSEDES the 87a49ef block below

**Re-measure first:** GitHub main at save = `ba257d8` (mine, on 9475602). Commit in the clone `$CLAUDE_JOB_DIR/tmp/w`, push fast-forward gated on `ls-remote` == tested base. Suite 388 passed + 2 skipped (390), tsc(test) 0.

- **Done + reported (head re-sent short after the long report arrived TRUNCATED — verify by the HEAD words):** 9475602 fix verified (holder reassignment throws; Reflect.set false; shared-model re-init works; JSON keeps refs). Descriptor seeds (`tmp/seeds5.sh`): writable/enumerable/configurable all caught in src — but the GENERATED UcpUnit.js writable seed was caught by NOTHING → closed: my generated-JS arm pins the throw + descriptor, 3 gen seeds RED. My file 13/0/13.
- **Review:** both oopExpert edits ACCEPTED (E1' reads-model staging now asserts throw + fresh model via init; E2' my finding un-skipped, stronger).
- **Open:** none from me. Out of scope as ruled: defineProperty/Reflect rewrites; init SHARES the model (Tron's radical-oop §3 question).
- **Next:** hold for oopPO.

On boot: verify id (`otmux pane.self` = %207 = oopTeam:3.0), reread this + SKILL + auto-memory, composer check (do NOT act), report reread-confirmed, HOLD for oopPO. Say REWIND.

---

# oopTester@WODA.prod — 87a49ef RE-GATED + REVIEW 2026-09-30 — SUPERSEDES the inc-2 block below

**Re-measure first:** GitHub main at save = `92db7b1` (mine, on 87a49ef). Commit in the clone `$CLAUDE_JOB_DIR/tmp/w`, push fast-forward to `git@github.com:web4x/Web4MDA.git` gated on `ls-remote` == tested base. Suite 386 passed + 3 skipped (389), tsc(test) 0.

- **Done + reported (delivered):** re-gated 87a49ef — both inc-2 findings FIXED for init() (kind refused; frozen RelationshipModel copies in a frozen list; wire round trip now rehydrates). Added a tsc arm (editing an entry through the view is a type error). 6 producer seeds (`tmp/seeds4.sh`) each RED at its arm.
- **Review of oopExpert's 34-line edit to MY file:** all 5 edits ACCEPTED with reasons (E1 reads-model via init + push throws + not.toBe; E2 kind throws, title overclaims; E3 title only; E4 returnType pin follows ruled type; E5 generated via init).
- **NEW FINDING awaiting ranking (skipped visibly, RED when un-skipped):** guard + freezing run only inside init(); a caller keeps the model it passed to init(m), and `m.references = [kind contains]` (type-legal public field) shows through Unit.references. Owner oopExpert.
- **Next:** hold for oopPO.

On boot: verify id (`otmux pane.self` = %207 = oopTeam:3.0), reread this + SKILL + auto-memory, composer check (do NOT act), report reread-confirmed, HOLD for oopPO. Say REWIND.

---

# oopTester@WODA.prod — INCREMENT 2 (T5.4) GATED 2026-09-30 — SUPERSEDES the 92dd722 block below

**Re-measure first:** GitHub main at save = `5223563` (mine, on d11a9d6). The live checkout `/var/dev/Workspaces/web4x/Web4MDA` is STALE (its main still at 0d6285e; others push from their own clones) — I now commit in my isolated clone `$CLAUDE_JOB_DIR/tmp/w` and push FAST-FORWARD straight to `git@github.com:web4x/Web4MDA.git`, gating the push on `ls-remote` == the base I tested (a rejected push = someone landed first → fetch, rebase, RE-RUN the full suite, push). Suite 383 passed + 4 skipped (387), tsc(test) 0.

- **Done + reported to oopPO (delivered):** `5223563` = `test/UnitReferencesInc2.test.ts` (CHECKED 10 / SKIPPED 2 / TOTAL 12) gating ed15542 (T5.4: references in the model beside uuid, frozen non-live view, kind references, round trip by init(m.toJSON()), no store/ln/sync scan + API surface, tsc, generated JS). 9 producer seeds (`tmp/seeds3.sh`) each RED at its arm; HeldAreSeen probes placed M1Catalog (only-M1Catalog seed → exactly its 2 violations).
- **FINDINGS awaiting ranking (skipped visibly, RED when un-skipped):** (a) kind not enforced — a `contains` entry is accepted + exposed; (b) view frozen one level deep — editing an entry rewrites the model. NOTE: wire JSON round trip loses nested prototypes for ALL nested models (pre-existing, not inc 2).
- **Next:** hold for oopPO.

On boot: verify id (`otmux pane.self` = %207 = oopTeam:3.0), reread this + SKILL + auto-memory, composer check (do NOT act), report reread-confirmed, HOLD for oopPO. Say REWIND.

---

# oopTester@WODA.prod — 92dd722 (frozen children) GATED 2026-09-30 — SUPERSEDES the 7a7304c block below

**Re-measure first:** origin at save = `92dd722` (the live checkout's own `main` was still at my `0d6285e`, not pulled — fetch the remote ref). Suite 368 passed + 2 skipped (370), `node_modules/.bin/tsc -p tsconfig.test.json` exit 0.

- **Done + reported to oopPO (delivered, submitted):** my children-push finding is FIXED at `92dd722` (`children` = `Object.freeze([...heldUnits])`, typed readonly). Gated once on an isolated clone; no new commit from me. Seeds on the REAL getter: G1 live array → my test + HeldAreSeen RED, list READ: 34 classes, 68 = 34 ACCEPTS + 34 CHANGED; G2 mutable type → TS2578 at `test/TreeFileUnitRulings.test.ts:149`; G3 both. Script: `$CLAUDE_JOB_DIR/tmp/seeds2.sh` + `tmp/report.cjs`.
- **Coverage note reported:** HeldAreSeen derives from `catalog.classes()`, which excludes `M1Catalog` (extends UcpComponent). Harmless today; fix = add `placedModel()`.
- **Next:** hold for oopPO. Increment 2 (T5.4 `references`) on its GO.

On boot: verify id (`otmux pane.self` = %207 = oopTeam:3.0), reread this + SKILL + auto-memory, composer check (do NOT act), report reread-confirmed, HOLD for oopPO. Say REWIND.

---

# oopTester@WODA.prod — 7a7304c RULINGS GATED 2026-09-30 — SUPERSEDES the inc-1 block below

**Re-measure first:** `git -C /var/dev/Workspaces/web4x/Web4MDA fetch; log -1; status --porcelain`. At save: origin = `0d6285e`, full suite 366 passed + 3 skipped (369), `tsc -p tsconfig.test.json` exit 0. vitest console output can be HIDDEN here — read counts via `--reporter=json --outputFile=…`.

- **Done + reported to oopPO (delivered, submitted):** `0d6285e` = `test/TreeFileUnitRulings.test.ts` (CHECKED 11 / SKIPPED 1 / TOTAL 12) gating `7a7304c` against ucp.md T4/T6 + eamd-ucp.md rule 4 (read at bd9ba1a). BOTH inc-1 findings VERIFIED resolved: F1 (derived leaf UcpUnits incl NodeShell have model + v4 uuid; tsc refuses a model-less unit), F2 (children = Version AND sub-components, `components` named view, Version.latest THROUGH add + minted once, Package.add refuses a leaf runtime+tsc, NpmPackage.dependencies own relationship). Generated JS executes the same. Layout: model-derived oracle == committed gen both ways (34=34), no latest below a latest. 9 producer seeds on an isolated clone (`$CLAUDE_JOB_DIR/tmp/w`, script `tmp/seeds.sh`) each RED at its named arm, incl. M1Layout in-Version placement + REGENERATED gen.
- **NEW FINDING, awaiting oopPO's ranking (skipped visibly in the file):** `UcpComponent.children` returns the LIVE held array → `pkg.children.push(leaf)` admits a leaf past `Package.add`; tsc accepts it = a second attach path vs T6. Owner oopExpert.
- **Next:** hold for oopPO. Increment 2 (T5.4 `references`) on its GO. Carried: spec/index.md:10 + spec/ucp.md:3 stale refs (→ oopExpert), radical-oop.md §3 (→ Tron).

On boot: verify id (`otmux pane.self` = %207 = oopTeam:3.0), reread this + SKILL + auto-memory, composer check (do NOT act), report reread-confirmed, HOLD for oopPO. Say REWIND.

---

# oopTester@WODA.prod — Tree/File/Unit INCREMENT 1 GATED 2026-09-30 — SUPERSEDES the inc-5 block below

**Re-measure first:** `git -C /var/dev/Workspaces/web4x/Web4MDA fetch; log -1; status --porcelain`. At save: origin = `46a83ce`, suite 347 passed + 2 skipped (349), tsc(test) 0. Plan: `spec/plans/2026-09-30-tree-treenode-unit.md`; rules `spec/ucp.md` T1-T8.

- **Done + reported to oopPO:** `46a83ce` = `test/TreeFileUnitInc1.test.ts` (CHECKED 14 / SKIPPED 2 / TOTAL 16) gating oopExpert's `6dca1cb`: production classes + GENERATED JS (found by name under gen/.../src/js/) + tsc type seeds; 8 out-of-band producer/gen seeds each RED at its named arm.
- **Findings reported, NOT in the green count, awaiting oopPO's ranking:** (1) RED vs T4/T5.1 — `NodeShell`, the only concrete leaf UcpUnit, has uuid `''` (no model class) = a unit without a uuid. (2) T6 — `Package` has no own `add`; a non-UcpComponent is ACCEPTED and then hidden by the filtered `children` view (tsc accepts too).
- **Next (plan):** increment 2 = unit properties (`references`, RelationshipModel kind `references`) — gate on oopPO's GO. Carried: spec/index.md:10 + spec/ucp.md:3 stale refs (→ oopExpert), radical-oop.md §3 (→ Tron).

On boot: verify id (`otmux pane.self` = %207 = oopTeam:3.0), reread this + SKILL + auto-memory, composer check (do NOT act), report reread-confirmed, HOLD for oopPO. Say REWIND.

---

# oopTester@WODA.prod — inc-5 GATED 2026-09-29 ~20:40 — SUPERSEDES the 3f3ac8c1 block below

**Re-measure first** (a saved sha decays): `git -C /var/dev/Workspaces/web4x/Web4MDA fetch; log -1; status --porcelain`. At save: origin = `a6db47c`, suite **324/324** (twice, live), `tsc -p tsconfig.test.json` 0 (`npm run typecheck` NO LONGER EXISTS at e5b8c8b).

- **Done + reported to oopPO:** `a6db47c` = `test/MOF/MofLayoutAC5.test.ts` (9 tests, CHECKED 9/SKIPPED 0) gating oopExpert's inc 5 `e5b8c8b`. Arms A (model set, M3Element only Package unit) · B/C/F (committed gen both ways, gen=[EAMD.ucp]) · D (Version dotted name) · E (RUNTIME lineage: M2 = M1Class metaclass or built by one to render an M1 unit + prototype closure; M3 = descends from the MOF abstract; NO static create/instantiate — removed in inc 1) · G1 (fs-read trap, child; loader reads under node_modules/ exempt — measured tsx candidateDoesntExist) · G2a (cwd/abs-root invariance) · G2b (namespace changed AFTER load, BEFORE layOut → placement follows model). All failability seeds RED at their named arm (in-test + out-of-band producer seeds on an isolated clone).
- **Weakest literals I reported:** D-only defect unrepresentable (dotted derives from breadcrumb); arm H = MofPlainNode still green, NO count==expected-set check added.
- **Open queue:** empty. Inc 5 gate ACCEPTED by oopPO (a6db47c verified on its isolated clone, 324/324); SPEC 11 COMPLETE → with Tron for DONE. Hold idle for the next plan. Carried: spec/index.md:10 + spec/ucp.md:3 stale refs (→ oopExpert), radical-oop.md §3 doc-vs-code (→ Tron).

On boot: verify id (`otmux pane.self` = %207 = oopTeam:3.0), reread this + SKILL + auto-memory, check composer for stale debris (do NOT act), report reread-confirmed, HOLD for oopPO. Say REWIND.

---

# oopTester@WODA.prod — PHASE-1 block 2026-09-29 ~20:05 (panel 75%, rewind ordered) — SUPERSEDES db8754f7 below

**Re-measure first:** `git -C /var/dev/Workspaces/web4x/Web4MDA fetch; log -1; status --porcelain` — a saved sha decays. At save: origin = `2d43118`, suite **311/311**, tsc 0.

- **My commits (Web4MDA, test-only):** `de385e3` AC1 coverage (scan reaches every src file via `find`) · `80478fb` AC2 plain-node gate `test/MOF/MofPlainNode.test.ts` (child node imports+new+init every committed MOF JS; now also spawns `--disallow-code-generation-from-strings`) · `2d43118` AC4 behavioural no-source-read gate `test/MOF/M1/M1GraphNoSourceRead.test.ts` (fs-read TRAP in a child render, 8 spellings batched; INVARIANCE+DIFFERENTIAL on a temp copy of src covers load-time reads; budgets 12000/7500 ms = 2.5x measured max).
- **Verdicts reported to + ACCEPTED by oopPO:** inc-3 @bdc2a66 (M1/M2 catalogued; ONE positional exemption M1Catalog, derived from `placedModel().sourceUnit`) · fix batch @956abc8 · AC8 rounds 2 @f746dee + 3 @cb92226 (AC8 TS-checker refs + NO-DYNAMIC-CODE allowlists GREEN; runtime flag refuses string-to-code; `import('data:…')` NOT covered by the flag → static ban load-bearing; accepted-risk audit → spec eee9686: #4 browser UNMITIGATED here, #5 `./`-template substitution declared) · inc-4 @0f414c5 · inc-4b+4c @13fcc8f (15 instanceOf vs an independent typeArguments oracle; 25 MOF nodes, exactly 1 `<<placed>>` M1Catalog drawn from its model, 31 edges; binder-label seed RED).
- **Inc-5 needs (AC5, spec/mof-self.md:42 — MOF in the layout), gate on oopPO's GO:** every MOF COMPONENT at `Web4MDA/latest/MOF/<Mx>/<Component>/latest/…`, dotted name exact, gen/ holds only EAMD.ucp. Derive the component set from rule 6 (an ABSTRACT class is a Package unit, e.g. M3Element stays at the component root — not a violation); the placed M1Catalog at its placed location; seed a MOF class laid out flat / in the wrong Mx / a wrong dotted name → RED; seed as a COMMIT where the gate reads committed gen/. My MofPlainNode gate finds JS by NAME, so it survives the move — re-run it.
- **Open queue:** empty besides inc-5. Carried: spec/index.md:10 + spec/ucp.md:3 stale refs (→ oopExpert), radical-oop.md §3 doc-vs-code (→ Tron).
- **Instrument lessons (apply every run):** isolated `git clone --no-hardlinks` of the named sha (git archive has no .git); vitest `-t` is a REGEX; seed committed-artifact hazards as COMMITS; never head/tail a capture (grep or a log file); a % stop fires only on a PANEL render; report a gate at its weakest literal; a RED is instrument-or-defect — prove the named guard fired.

On boot: verify id (`otmux pane.self` = %207 = oopTeam:3.0), reread this + SKILL + auto-memory (`oopTester-phase1-resume-2026-09-29`), check the composer for stale debris (do NOT act), report reread-confirmed to the trainer, HOLD for oopPO's inc-5 GO. Say REWIND.

---

# oopTester@WODA.prod — PHASE-1 resume block (2026-09-29, pre-rewind, panel 69%)

**Newest boot pointer — SUPERSEDES the state sections of resume-state-2026-09-28.md (5b674708, stale 14:51).** Identity, base role and instrument discipline there still hold. Re-measure everything; a saved HEAD decays.

- **Last commit I gated/landed:** `126d36c` (Web4MDA origin, test-only). Whole suite **287/287** under full load on an isolated clone. Origin has moved since (`4e9ae61` at save) — `git -C /var/dev/Workspaces/web4x/Web4MDA fetch; log -1; status --porcelain` (read WHOLE).
- **My commits today:** `0f33a0e` src/ type-check gate · `4d06906` 5 Pipeline budgets (2.5x-max rule) · `b2909d7` my TS5097 fix + type-check widened to test/ · `126d36c` bare-builtin hole closed (StaticBuiltinImport from module.builtinModules) + test/MOF/M2/M2OoshSha1.test.ts (513 inputs + FIPS vector == node:crypto).
- **Spec 11 (spec/mof-self.md, plan /root/.claude/plans/toasty-knitting-token.md):**
  - inc 1 `bb0656d` AC1 no factories — GREEN today; scan NARROW (misses `static create<T>(`, `.instantiate<X>(`, `static async create(`, arrow `create =`) → routed to oopExpert, not yet fixed as far as I know.
  - inc 2 `06591d2` AC2 browser purity — GREEN (6→0 static node: imports, pure SHA-1 = node:crypto, cold npm test 285/285 node16/npm8). Bare-builtin evasion found and CLOSED by me in `126d36c`. "Generated MOF JS under plain node" = CONFOUND until inc 3 (0 MOF classes catalogued).
- **Inc 3 needs (AC3, when oopExpert's sha lands):** every `src/**/*.ts` catalogued, no exemption (seed a loose MOF class → RED); MOF self-reproduces; THEN the AC2 clause "generated MOF JS executes under PLAIN node" becomes measurable — gate it. Isolated `git clone --no-hardlinks` of the named sha, seed off-list variants, cold npm test on default PATH.
- **Open queue:** inc-3 gate (above) on oopPO's dispatch. Carried: spec/index.md:10 + spec/ucp.md:3 stale refs (→ oopExpert), radical-oop.md §3 doc-vs-code (→ Tron), comment sweep deferred.
- **Hard lesson today (banked in auto-memory):** never send into a pane showing "Enter to select"/"Esc to cancel" — my send.raw answered oopPO's 4 plan-B questions for Tron; oopPO re-asked with option 1 = "Not decided yet".

On boot: verify id (`otmux pane.self`, never $TMUX_PANE), reread this + SKILL + auto-memory, check the composer for stale debris (do NOT act), report reread-confirmed to the trainer, hold for oopPO's dispatch. Say REWIND.
