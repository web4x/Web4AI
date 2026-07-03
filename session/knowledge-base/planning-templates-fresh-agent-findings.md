# planning-templates.md — fresh-agent purification findings

*By agent-trainer (baseTeam:0.0), 2026-07-03. TRON directed: "train a test agent from zero and see if he can plan." A blank general-purpose agent was trained ONLY on `planning-templates.md` + the sprint-0 example, then asked to plan a real sprint (`otmux pane.title.set` + completion + test). **Result: it planned correctly — 6/6 on the rubric** (structure, zero-pad, machine-readable status, bidirectional traceability, role-prefixed subtasks with tests in the tester subtask, QA workflow). In doing so it surfaced these DOC DEFECTS for ARON/oosh-po to resolve during purification. This is the "pure = actionable on a fresh agent" test working as intended.*

## Defects a from-zero agent hit (fix these in purification)

1. **Numbering contradiction (rules vs example).** §1/§2 mandate zero-pad numeric `task-<NN>` (`task-01`), but the canonical example uses epic-letter `task-a1-…` and its own Naming-Conventions block says `task-<epic><number>`. They conflict, and `a1` doesn't exercise the zero-pad rule. → DECIDE one scheme (Tron/oosh-po) and make rule + example agree.

2. **Sub-task ordering contradiction.** The example orders sub-tasks expert-first / tester-last (`.1 expert … .3 tester`), but §6 QA-workflow says the tester writes cases *before* the expert implements (scenario-first). → Fix the example ordering (architect → tester → expert) or state the exception explicitly.

3. **Dangling reference.** §4 cites `[[traceability-links]]`, but no `traceability-links.md` exists in `session/knowledge-base/` (only `dual-links.md`). → Create `traceability-links.md` (the §4 concept deserves its own dual-linked source) or drop the link.

4. **Scope ambiguity — planning `down`.** §1 says "Traceability (`down` → every task)". Unclear whether `down` lists only top-level parent tasks or every sub-task. The fresh agent read it as parent-only (sub-tasks reachable via the parent's `down`). → State it explicitly.

## What was PERFECT in the docs (keep, don't touch)
Machine-readable status rule (§3) — the fresh agent nailed it (no annotations, commit → Deliverable). Traceability-vs-dual-links distinction (§4) — kept them separate correctly. Role-in-filename + tests-in-tester (§1) — applied cleanly. QA workflow (§6) — reproduced exactly.

## Verdict
The material is **actionable from zero** — a fresh agent trained only on it produced a correct plan. Fixing the 4 defects above closes the gaps a weaker agent would trip on. Test artifacts (not committed): scratchpad `planning-test/` (planning.md + task-01 + 3 role subtasks).
