# robbin-req — Context

## Identity
- **Role:** robbin-req (requirements engineer)
- **Pane:** robbinTeam2:0.4 (per PO directives + boot.md; `otmux pane.get.target` once returned 0.3 — trust PO/boot)
- **Host:** WODA.prod
- **Project:** RawBin (Web4RawBin)
- **Active repo (canonical):** `/var/dev/Workspaces/2cuGitHub/Web4RawBin` — commits today, working changes. The `web4x/Web4RawBin` copy is STALE (last 06-16). Always measure which repo before mutating.

## v0.6.0 Marathon Summary (S19: 2026-06-10 → 2026-06-13)
- Output: R19.1→R19.102 (109 S19 requirements); 65+ atomics from Tron literals.
- Process evolution: functional-first capture → traceability-FIRST (S20: Test-defined-first, chain at capture time).
- Key corrections: R19.97 altId collision, 18 fabricated uuids replaced, PO re-routing (R19.1→R19.2 semantic parent).

## Sprint 21 — Contact Identity (2026-06-28, THIS host WODA.prod)
**9 requirements R21.1–R21.9 minted on disk + committed. Sprint unit 1bdfaafa requirements[]=9.**

| Req | uuid | UC placeholder | topic |
|-----|------|----------------|-------|
| R21.1 | efd1acb6 | 9cd5cc65 | vCard drop stores with photo |
| R21.2 | 4f099ef2 | dbfacb7f | lobby correct name on first load |
| R21.3 | 144d1332 | 97015dcc | phone index as ln symlinks (alt-UUID) |
| R21.4 | 04dff687 | ff91e891 | known phone/email → device-link, not new user |
| R21.5 | a8be009e | c59356f7 | Emails as ior:class:Email units |
| R21.6 | 3bd63ae7 | 4242f9be | Phones as ior:class:Phone (seed +4915253844085 on WODA.prod) |
| R21.7 | 5d3b5e6e | fab88cb9 | Addresses ior:class:Address, ASYNC OSM verify + badge |
| R21.8 | bf6a0433 | a62c6e37 | Companies ior:class:Company, SHARED (dedup by name) |
| R21.9 | 21e792e0 | 5826ca42 | file detail reorder: buttons+75% pan/zoom preview first, metadata last |

**Commits:** 169da7372 (requirements.md+planning.md R21.1-8) · 16b311f0e (Sprint unit + 8 scenario units + sprints.json symlinks + overview) · d9fe47451 (R21.9 full mint) · b1481ca (learning #9, in AI/Claude repo).
**Tron answers folded:** (1) seed +4915253844085 first Phone WODA.prod; (2) R21.7 async non-blocking; (3) all 8→9 in ONE sprint, no split.
**Mint pattern (full):** index unit (parent+ownerIor→sprint, useCases→UC placeholder, name≠description, tronQuote, sourceLine) + sprints.json/<sprint>/{sprint.json, requirement/r21-N-<slug>.json} symlinks + sprint.requirements[] append + sprints.overview.md row/count. Validate: json.tool parse, name!=desc, symlink resolves.
**Also fixed this session:** 16 REQ name==description split (ec527f41b) + 4 REQ no-desc (0e7b5c964) — Requirement-class data quality now CLEAN (0 dup, 0 no-desc).

## Next-up (architect/planner own)
- Architect: refine 9 UC placeholders → real UseCase units, wire Class→Method→Impl→Test.
- Planner: stand up S21 tasks referencing the req UUIDs.
- 100 Task units still have NO description (PO-flagged, needs per-unit judgment — awaiting go).

## Sprint 21 refinements (2026-06-28) — detailed AC + gateable test scenarios
All 9 R21.x units carry formal acceptanceCriteria[] (grouped) + testScenarios[] (TS, given/when/then, each gating named ACs). MEASURED against shipped code ("code is law"), not just architecture.md.
- R21.6 fc1ef90cb (PhoneIndex.ts) — FOUND drift: symlink declared on Profile.unitLinks[], arch prose said Phone unit; AC follows code, flagged architect.
- R21.7 6d3f8052d (architecture s5: async OSM verify) · R21.9 6e978d5ee (architecture s6: file-detail reorder + rb-preview-pane)
- R21.1 efd1acb6 + R21.2 4f099ef2 = b9133a1fe · R21.3 144d1332 + R21.4 04dff687 = 7d7b4260b
Pattern: each AC has id/group/text; each TS has id/gates[]/name/given/when/then; validate every AC gated by >=1 TS, chain (parent/owner/useCases) + name/desc/tronQuote unchanged.

## Data-quality sweeps (2026-06-28)
- 16 REQ name==description split ec527f41b; 4 REQ no-desc filled 0e7b5c964 → Requirement-class CLEAN.
- TASK no-description CLEAN SWEEP: 96 → 0 across 11 commits. S20(4) 9495a8c9e; S17(34) 3e5b9373f/467caf8d4/9c60ae18c/35c0e1dc8; UNLINKED(47) 594801186/a5dea717e/c0f2f171f/3f94ff56e/a36bb579e; final 15 (S1/S10/S11/S13/S18) 0fd649b88.
- Method: description derived from covered requirement where present, else from task-name intent. Names kept. Historical "7-step/7-hop" rendered neutrally (chain corrected to 6-step).

## Status
Sprint 21 closing. Task-descriptions COMPLETE (0 remaining). All reports delivered + verified per learning #9. Standing by.

## S22-S25 arc (2026-06-28 → 07-01) — scenario-first requirement capture
Established pipeline per sprint: mint Sprint unit + Requirement units (parent/ownerIor->sprint, useCases->UC placeholder, name!=description, tronQuote/poClarification, acceptanceCriteria[] grouped, implRef/designRef to shipping code) + sprints.json symlinks + requirements.md/planning.md + overview row. Then ping planner (builds task units: mint->wire coveredRequirements/useCases/sprint.tasks[]->generate-sprint-md-->--check->commit), architect (UC refine+wire Class->Method->Impl->Test), skill-expert (chain-tool ACs). I run 3-point verify (name!=desc, coveredRequirements->Rxx.y, sprint.tasks[] complete, 1:1 no over-coverage) on every task commit.

**Sprints on disk (all req units clean, source-of-truth confirmed 2026-07-01):**
- S21 Contact Identity 1bdfaafa — 9 reqs R21.1-9
- S22 Traceability View Fixes 9996b46a — 4 reqs R22.1-4 (R22.2 drawer pan/zoom mouse-parity, refinedBy R25.4)
- S23 Media Preview 4a4a5d66 — 3 reqs R23.1 audio / R23.2 youtube / R23.3 identity-merge-cleanup
- S24 Traceability Skills 04339450 — 5 reqs R24.1-5 (formalize objectVerb/planner-drive/skill-classes-Chain/generate-sprint-md/trace-cli as Object.verb skills; skill-expert+planner measured-review refined ACs)
- S25 Apple DnD c7d700c6 — R25.1 DnD-logging / R25.2 WebItem(6/8 honest, folders+bookmarks backlog) / R25.3 vCard-onboarding-device-link / R25.4 drawer grab-bar-mouse+X-minimize (2 UCs)

**Key uuids:** R21.4 device-link 04dff687, R21.1 vCard efd1acb6, R22.2 b7000fa1, R23.2 youtube 8f34c3e5, R25.2 WebItem f8097d7c, R25.4 drawer 225b18a6 (UCs c6df9164 grabBarMouseParity + 2438307a minimizeToggle).

## TRON RULE #126 — SCENARIO FIRST, NEVER BACKFILL (2026-07-01)
Scenario units EXIST before ANY implementation: Sprint unit -> Requirement units -> Task units -> chains wired -> MD views GENERATED. Code ships AFTER scenarios on disk. A backfill = the rule was violated. This session backfilled S21-25 (20->44/301) = DEBT, never again. If I receive a task without a scenario unit: REJECT + report PO. requirements.md + planning.md are GENERATED VIEWS (law #100, GENERATED-FROM-SCENARIO-UNITS header); the scenario unit is truth.

## PENDING (next incarnation — complete these)
- R25.5 clipboard preview-in-dialog: uuid 2066ba12-6bd8-42b1-9377-25c82fd944e0, UC 10af6d46-b5b7-46d8-8fe8-3289d8f09d72 — MINTED 2026-07-01 commit 394e6645b. PO: drop-area click/tap -> dialog PREVIEWS clipboard content (type icon + content preview) before yes/no -> on yes import via drop-dispatcher routing (URLs->WebItem, images->File, text->file).
- R25.6 scenario link on ALL detail views: uuid 24509e35-8627-402a-ba93-ed959fef3a5b, UC dc468781-714b-429d-8dff-2ee243a81e51 — MINTED 2026-07-01 commit 394e6645b. Every detail component shows a 📄 Scenario link to its underlying scenario unit.
- Mint both in Sprint 25 (c7d700c6), scenario-first, overview 4->6. Then ping planner/architect, report PO.
- Task 2 owed: 3-point verify ALL S21-25 tasks per-sprint (was interrupted; re-run when planner backfill confirmed).

## S25 completion + S26 Federation (2026-07-01, since c75f283)
**S25 Apple DnD — 7 reqs, all req+task+wiring GREEN (per-sprint 3-point verify ALL PASS):**
- R25.5 clipboard preview+import 2066ba12 (2 UCs: previewAndImport + readAndRoute) · R25.6 scenario-link-all-detail-views 24509e35 (2 UCs: scenarioLink + scenarioLinkResolve) — minted scenario-first 394e6645b.
- R25.7 room-membership dedup by resolved identity (STRUCTURAL) 585b6b9c — 4 UCs on Class Room (dedupMembersOnLoad/evictAbsorbedFromRooms/redirectTombstoneToPrimary/addMemberIdempotent) + 7 ACs incl one-time gated repair; from architect design 662c0cc0f. Committed 72bc8c04a, wired 748122237, T25.7 f39e3215a verified. crossRef R23.3 (structural hardening).
- GATE-LABEL DEDUP: v0.6.97/98 gates mislabeled clipboard=R26.1/scenario-link=R26.2; those are R25.5/R25.6. Recorded gateLabelDrift note (4192c997c), NO dup minted (Rule 9). Gates to relabel R26->R25.

**S26 RawBin Federation — GREENFIELD, fully chained scenario-first (5 reqs, 27 ACs):**
- Sprint 1d98197d. From architect design 7e940cf81 (federated-scenario-transfer). Principle: STRUCTURE eager, PAYLOAD lazy, IDENTITY by-reference.
- R26.1 e8744de9 federated IOR (ior@host provenance + pluggable loader) · R26.2 e36d585c cross-origin DnD federated-ref protocol · R26.3 05d21385 server-to-server fetch API · R26.4 71b44e05 lazy child resolve · R26.5 f7e4c1cc conflict reconcile.
- 4 Classes: IORResolver/DropDispatcher/FederationApi + Transfer (SHARED R26.4+R26.5, 2 methods). R26.4/R26.5 crossRef R25.7 (foreign members by-reference, NEVER minted — no re-dup). securityNote cross-cutting (signed+scoped+expiring grants, trust list, never-execute-foreign-JSON).
- Chain: reqs 926017353 -> UCs/Classes 7efe38ab9 -> tasks ba302def6 -> ALL before code (designAhead). T26.1-T26.5 3-point verify ALL PASS.
- 5 OPEN DESIGN DECISIONS in planning.md await Tron/PO (inline-vs-lazy threshold, auth tiers, updatedAt/version field, remap reuse, R25.7 members tie-in).

## Fleet state 2026-07-01
S21(9)/S22(4)/S23(3)/S24(5)/S25(7)/S26(5) = 33 reqs, all req+task+wiring layers chain-clean, source-of-truth on disk. Scenario-first (#126) held for S25.5-7 + all S26. Repeatable pipeline: measure design/code -> decompose (Rule 10) -> mint units scenario-first -> ping planner(tasks)/architect(UC+wire)/skill-expert(chain-tool ACs) -> 3-point verify each task commit -> record dedup/drift on-disk (wer schreibt der bleibt).

## S27 Detail-View + S28 Graph-Integrity (2026-07-01 → 07-02, THIS session)
**S27 Detail View Enhancements c1c63a2e — 5 reqs (R27.1,2,3,4,7); R27.2+R27.4+R27.7 DONE.**
- R27.1 90b82d00 statusChecklist render (v0.7.6 retroactive) · R27.3 4f6d6402 per-task-MD (fix 📄 404) · numbering collision R27.2-vs-R27.3 resolved (I committed R27.2 first).
- R27.2 64965538 ONE-canonical-Class-per-code-class (by-construction invariant + gated migration): audit found 163 Class units/55 dup across 23 code-classes. Migration LANDED clean actual==predicted: 163->108, distinct Impl 431==431 (repoint-not-delete union of 45 same-name pairs), INV2 delta 0-new, 4 active-chain canonicals kept (IORResolver b4eaa489/Room 2172dc56/RbDetailDrawer d86af73d/RbDetailView f2f84ce3-6f8f). Two-independent-clears gate (architect PDCA + my 3-point+INV1b). trace-audit.ts strict-gates dup-Class.
- R27.4 e205f7c3 graph-integrity (DONE 8/8): 12 dangling UC-refs + 51 orphan-Methods repaired. All 51 ATTACH (0 prune — all real impl+sourceFile), 37 stale designStage markers cleared, 15 bbbc ref-repoints (10 UC + 5 Method.ownerIor — I caught the +5 ownerIor slot-miss), 1 server Class created via mintOrReuseClass. Expert self-caught a TODO gap -> revert -> reapply (atomic-rollback worked).
- R27.7 54002f11 WebItem type-aware preview drawer (Tron regression v0.7.8 + enhancement, DONE 11/11): 2 UCs (webItemDrawer.previewByType d48b4dda + webItem.serverProxyFetch 543ff7aa), 11 ACs. REUSED canonical RbDetailDrawer d86af73d (R27.2 invariant held on a live feature). SSRF hard-guard: ProxyFetch 09f4cdce -> guardUrl 5 adversarial + fetchSanitized 4 (incl never-execute PROD-CRITICAL) = 9 tests + previewByType routing-regression-gate (r252-webitem-gate.mjs, mailto->launcher AND http->previewable DET-3x) = 10 tests, all chain-to-Test. crossRef R22.2.

**S28 Graph-Integrity Foundation fabc9784 — 2 reqs (scaffolded, awaits Tron go):**
- R27.5 f48fbf5d RE-SCOPED (calibrate-orphan -> canonical ref-slot registry + calibration) + MOVED S27->S28. 7 ACs incl AC-no-uuid-audit. UC 5ff15c57.
- R27.6 3a7d4df2 true-dangling repair (Method.impl 51 + Test.parent 32 + Test.verifies 12 + Test.methods 1 = 96 real, under the ~500 token-false-pos + walk-gap noise). UC a07def59. Architect registry 05da0584a/76c3a102b.
- The 2207-audit-orphan reconciled = BENIGN broad metric (unreachable-from-Req via CANONICAL_FORWARD, all-types), NOT debt; R27.4=51 Methods is the real defect. CI orphan gate = METHOD-scoped not all-types.

## Key learnings THIS session (see learnings.md)
- NEVER truncate uuids in a reconcile report (8-char prefix collision: f2f84ce3-6f8f LIVE vs f2f84ce3-bbbc DEAD caused a multi-agent false-contradiction; proof = raw JSON model.class + os.path.exists on FULL uuid).
- Bash-backtick eats FIELD VALUES not just MD markers (undefined.scenario.json, no model.uuid) -> mints via FILE not backtick-in-bash-string; post-mint no-uuid scan. Folded into R27.5 AC-no-uuid-audit.
- Wrong-field measurement (impl via Method.implementations[] not impl/impls) -> READ raw structure before concluding.
- Measure a STABLE state, never a mutation in-flight (67 uncommitted = don't grade). Per-AC gate ALL ACs, not just the security subset (caught previewByType shipped with unlinked test).
- Gated-migration pattern (R27.2/R27.4): dry-run+count -> two-independent-clears -> atomic+rollbackable+self-assert -> post-verify actual==predicted. INV1b = no-impl-lost (repoint-not-delete).

## Fleet state 2026-07-02
S21-28: R27.2/R27.4/R27.7 DONE; S28 R27.5/R27.6 scaffolded awaiting Tron go. R27.2 by-construction invariant now paying off on live features (R27.7 reused canonical). All scenario-first, chains complete, 0 #126 debt, 0 malformed units (3839).
