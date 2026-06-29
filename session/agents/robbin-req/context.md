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

## Status
S21 captured + committed + reported (verified delivery per learning #9). Standing by for next directive.
