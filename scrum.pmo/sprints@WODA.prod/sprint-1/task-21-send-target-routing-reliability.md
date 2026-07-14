[Back to Planning Sprint 1 @ WODA.prod](./planning.md)

# Task 21: send target-routing reliability — cross-team misroute + staged-buffer-not-cleared
[task:uuid:02e1dfee-3fda-4746-8f75-ac8bc8f438df]

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
  - [Sprint 1 Planning @ WODA.prod](./planning.md)
- source: oosh-po@WODA.prod field findings 2026-07-14 (both hit live)

## Problem — two send-target reliability gaps found live
**Gap 1 — CROSS-TEAM MISROUTE (0.x-index collision) [HIGH].** A directive for robbin-architect (`robbinTeam2:0.3`) landed on oosh-expert (`ooshTeam:0.3`) — same pane INDEX (0.3) across two teams. The send/route resolved the bare index without enforcing the full team-qualified target → cross-team delivery. oosh-expert correctly refused (prefix said `[@robbin-architect]`) but robbin-architect never got it. Silent cross-team leak.

**Gap 2 — STAGED-BUFFER NOT CLEARED [MED].** `hiveMind agent.send` to a pane that already has un-submitted STAGED text in its input line returns rc0 but delivers AROUND the staged text → message never takes (agent idle-drifts). Workaround that worked: `otmux send.raw <pane> Escape` + `C-u` (clear) then `otmux send`. Hit on BOTH architect(0.2) and expert(0.3) today.

## Fix directions
- **Gap 1:** target resolution MUST require/normalize a full `team:window.pane` (or role@team) — a bare `0.3` is ambiguous across teams and must be rejected or team-scoped. `private.resolve.target` + hiveMind route enforce the team qualifier; never resolve a bare index to "some team's 0.3".
- **Gap 2:** send.verified pre-clears the target input line (Escape+C-u equivalent) before typing, OR detects staged text and clears-then-sends; never deliver on top of a dirty buffer.

## Acceptance Criteria
- [ ] send to `robbinTeam2:0.3` NEVER lands on `ooshTeam:0.3` (team-qualified routing; T-CROSS-TEAM-ROUTE)
- [ ] send to a pane with pre-existing staged text clears-first → message takes (T-STAGED-CLEAR)
- [ ] bare ambiguous index → rejected or explicitly team-scoped, never silent cross-team

## Report-back (owners edit here)
- Architect (routing + clear-first contract):
- Expert (impl):
- Tester (T-CROSS-TEAM-ROUTE + T-STAGED-CLEAR):
