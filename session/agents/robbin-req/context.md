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
