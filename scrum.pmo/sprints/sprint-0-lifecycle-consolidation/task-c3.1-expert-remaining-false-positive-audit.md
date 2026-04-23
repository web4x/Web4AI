[Back to Task C3](./task-c3-sweep-detect-fixture-tests.md)

# Task C3.1: Expert - Remaining False Positive Audit
[task:uuid:4427defb-a1f1-4f25-b3e3-148c5dd8ae62]

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
  - [Task C3: sweep.detect Fixture Tests](./task-c3-sweep-detect-fixture-tests.md)

## Description
**Role: oosh-expert**

Audit sweep.detect for remaining false-positive patterns not addressed by eca047a and b3a63ae:

1. **Enumerate all 18 states** — document each state name, its detection criteria, and expected pane output patterns
2. **Review prose-scrub logic** — verify the false-positive reduction from eca047a covers all edge cases
3. **Identify remaining risks** — find output patterns that could still trigger misclassification:
   - Agent writing about "stuck" or "error" in conversation (prose, not actual state)
   - Permission prompts that look like idle but agent is waiting for user
   - Compaction output that looks like activity but is automated
4. **Document each false-positive risk** with example output and recommended fix

Key file: `/Users/donges/oosh/hiveMind`

---

*Sprint 0 - Lifecycle Consolidation*
*Epic C: hiveMind Controller Layer*
