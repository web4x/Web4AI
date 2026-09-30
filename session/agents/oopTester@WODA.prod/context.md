# oopTester@WODA.prod — INC 4 RE-GATED at 8d22cbc 2026-09-30: L1+L2 CLOSED, L3 NEW (stack exclusion unscoped) — SUPERSEDES the AC4 block below

**Evidence** tmp/: rg-gate.out (suite), regate-8d22cbc.sh, diag-sb.sh (+ diag-sb-*.out), seed-ms.sh. Clone tmp/w at 8d22cbc clean.
- **Suite x2:** PROBE_EXIT=0, each EXIT=0, CHECKED 448 / SKIPPED 2 / TOTAL 450, TOUCHED 0/707.
- **L1 CLOSED:** Source.atLevel (name ^M3[A-Z], whole tree). M3Element M3->M2 seed EXIT 1 RED; control M3Class RED. **Per-level reproduce:** M3Element drift seed EXIT 1 RED naming M3/M3Element.
- **L2 CLOSED:** isSource by RESOLVED path (realpath'd root). My ./Components G1 seed SEEN (G1 EXIT 0).
- **L3 PROVEN (new in 8d22cbc):** exclusion `!stack.includes('node:internal/modules/')` is NOT scoped to M1Layout.load's sanctioned import. 2x2 (seed alone, record printed): S-b = module imported in the window that reads source AS DATA at top level: shipped UNSEEN (EXIT 1, sourceReads []), clause neutralized SEEN (EXIT 0) -> the exclusion hides it. S-a = non-sanctioned import() of a source .ts: UNSEEN both ways -> detector never traps module loads (pre-existing gap, not this commit).
- **Instrument (mine):** first S-a/S-b run VOID — pathToFileURL not in seed scope (record error exposed it); rerun with file:// URL.
- **ModelStyle guard:** completeness proven (subset root EXIT 1, 24 vs 75); non-empty half circular (both walk Components, emptied = 0===0) — low.
- **Next:** report to oopPO; re-gate the L3 fix (S-b must be SEEN as shipped; S-a per oopPO ruling).

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
