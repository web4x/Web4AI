[Back to Planning Sprint T1](./planning.md)

# Task 3: Role vocabulary + gates

[task:uuid:f1e7614b-a4d3-4b7c-89b0-013a7cf84149]

## Status
- [ ] Planned
- [ ] In Progress
  - [ ] refinement
  - [ ] creating test cases
  - [ ] implementing
  - [ ] testing
- [ ] QA Review
- [ ] Done

## Traceability
- up
  - [Sprint T1 Planning](./planning.md)

## Task Description
Web4 roles = `architect / developer / tester / po / scrummaster`. WODA's draft says **"expert"** (≈ developer) and adds **PO-gate** + **operator(TRON) final-acceptance** steps. Ratify the mapping.

## The decision — ARON's scalable recommendation
- **Rename `expert` → `developer`** to match the authoritative role vocabulary. Scalable > primitive: a shared role vocabulary interoperates across Web4-aligned projects (Web4Articles, Web4RawBin, OOSH); a private synonym ("expert") is a translation tax at every boundary.
- **Keep the PO-gate + operator(TRON)-acceptance**, labeled `[WODA-local]`. They add real control (more gates = safer scaling), and they *extend* the Web4 flow rather than fork it: `architect → developer → tester → [WODA: PO gate] → QA Review → [WODA: operator/TRON acceptance] → Done`.

## Acceptance Criteria
- [ ] TRON rules the role word (developer vs keep "expert").
- [ ] TRON rules the extra gates (keep as [WODA-local] / drop).
- [ ] `planning-templates.md` updated accordingly.

## QA Audit & User Feedback
- _(awaiting TRON's ruling)_
