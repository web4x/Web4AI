# SC-G — Sprint 1 documentation (state-stores + invariants + architecture)

**Sprint**: 1 (state correctness) · **Epic**: SC-G docs
**Final epic for Sprint 1 — closes the wave.**
**Dependencies**: SC-A, SC-B, SC-C, SC-D, SC-E, SC-F all landed (this session)

## Scope

Three expert subtasks bundled in one commit (architect handles SC-G.3 PUMLs separately):
- **SC-G.1**: `docs/state-stores.md` — S1–S10 with owner/writer/format
- **SC-G.2**: `docs/invariants.md` — I1–I10 with severity/detector/fix
- **SC-G.4**: `docs/oosh-architecture.md` — add "State Correctness" section linking to both

## Approach

Source from landed reality (per SC-G "comes LAST so docs reflect landed reality, not aspirational design"):
- S1–S10 extracted from `sprint-1-design.md` table + verified against current file layout
- I1–I10 extracted from `private.hiveMind.reconcile.check.iN` functions in hiveMind
- Fix recipes extracted from `private.hiveMind.reconcile.apply` dispatch table
- Quick-map + commands-at-a-glance synthesized for the architecture-doc section

## Acceptance

- Two new docs created at `~/oosh/docs/{state-stores,invariants}.md`
- `oosh-architecture.md` "State Correctness (Sprint 1)" section added before See Also block
- All cross-links resolve (verified via path inspection)
- Files reflect landed code (predicate names, helper signatures, fix dispatch arms all match current source)

## Commit

`docs: SC-G — state-stores.md + invariants.md + architecture.md State Correctness section (ref: sprint-1-sc-g-docs.md)`
