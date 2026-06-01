# T146 Pre-Work: Short Name Drafts for Long-Title Requirements

**Author:** robbin-req
**Status:** DRAFT — no commits, pre-work for T146 stand-up
**Audit basis:** 16 entries with titles >8 words across S11, S13, S17

---

## S11 (1 entry)

| Current title | Proposed 3-5 word name |
|--------------|----------------------|
| R11.1: Every test must declare which AC/requirement it verifies | **R11.1: Test traceability declarations** |

## S13 (7 entries — worst sprint, all titles are sentences)

| Current title | Proposed 3-5 word name |
|--------------|----------------------|
| R-A1: Avatar must persist across sessions — must not revert to default | **R-A1: Avatar session persistence** |
| R-A2: Avatar upload must work without exposing key errors to user | **R-A2: Avatar upload error UX** |
| R-R1: All user rooms load from disk on connect and appear in lobby | **R-R1: Multi-room lobby loading** |
| R-V1: Version update bar must appear on new version | **R-V1: PWA update banner** |
| R-T1: E2E tests must never pollute prod data — isolated DATA_DIR | **R-T1: Test data isolation** |
| R-TC1: E2E tests must not flood data/ with orphan users or rooms | **R-TC1: Test cleanup hygiene** |
| R-ED1: Markdown preview must render hierarchical lists (nested checkboxes) correctly | **R-ED1: Nested list rendering** |

## S17 (8 entries)

| Current title | Proposed 3-5 word name |
|--------------|----------------------|
| R17.1: Scenario JSON unit — every instance is uuid.scenario.json | **R17.1: Scenario JSON unit** |
| R17.3: Class-based instances — typed classes with uniform wrapper | **R17.3: Typed class instances** |
| R17.5: Speaking-name tree (json) — symlink tree with human names | **R17.5: JSON symlink tree** |
| R17.6: Speaking-name tree (md) — generated md views with same names | **R17.6: MD view tree** |
| R17.15: Collaborative planning — architect + req + planner | **R17.15: Collaborative sprint planning** |
| R17.24: UC/Class/Method unit carries exact source location + git anchor | **R17.24: Source-location IOR** |
| R17.25: Generated MD views show chain-link icon → symlink JSON source | **R17.25: Chain-link icon** |

Note: R17.4 (7 words: "Index by UUID prefix") was borderline at 7 words — already acceptable per "3-5 word" target with tolerance.

---

## Summary

| Sprint | Entries to fix | Action |
|--------|---------------|--------|
| S11 | 1 | Shorten title |
| S13 | 7 | Shorten all 7 titles |
| S17 | 8 | Shorten 7 titles (R17.4 acceptable) |
| **Total** | **16** | |

## Format reminder (B7/Tron directive)

Each entry after retro-clean:
```
- [ ] **R-A1: Avatar session persistence**
  [requirement:uuid:a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d]
  > TRON DIRECTIVE: "my avatar picture disappeared. its back to default."
  → [T91](./task-91-avatar-persist.md)
```

No description paragraph restating the quote — the quote IS the description.
