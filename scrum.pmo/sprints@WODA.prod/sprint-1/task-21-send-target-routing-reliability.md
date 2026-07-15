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
**Gap 1 — MIS-TAGGED ADDRESS HEADER (0.x-index, no team-qualification) [LOW, self-recovered].** hiveMind send stamps the `[@sender pane]` address TAG by resolving the bare pane-index (0.3) WITHOUT team-qualification. A message CORRECTLY DELIVERED to `ooshTeam:0.3` (oosh-expert) got MIS-TAGGED with `robbinTeam2:0.3`'s identity (`[@robbin-architect robbinTeam2:0.3]`) in its header. **Delivery was CORRECT** (content genuinely oosh-expert's — clean-boot-bugs §B, `Owners: oosh-expert`); only the HEADER tag was wrong. oosh-expert caught the mismatch, VERIFIED via the committed task file (Owners field), self-resolved — no work lost, robbin-architect unaffected (SM-confirmed via its pane). **NOT a mis-delivery / cross-team leak** — my initial "cross-team misroute" characterization was WRONG; SM measured the precise mechanism (tag-stamping, not routing). *(The committed-task-file-as-truth discipline is what let the expert self-recover — validates "communication IS the sprint task".)*

**Gap 2 — STAGED-BUFFER NOT CLEARED [MED].** `hiveMind agent.send` to a pane that already has un-submitted STAGED text in its input line returns rc0 but delivers AROUND the staged text → message never takes (agent idle-drifts). Workaround that worked: `otmux send.raw <pane> Escape` + `C-u` (clear) then `otmux send`. Hit on BOTH architect(0.2) and expert(0.3) today.

## Fix directions
- **Gap 1:** hiveMind send must TEAM-QUALIFY the address tag it STAMPS on delivered messages — resolve the pane-index within the delivery's team scope, not raw. The `[@sender pane]` header must carry the correct team-qualified identity of the actual target team. (Delivery is already correct; it's the tag-stamping resolver that drops the team qualifier.)
- **Gap 2:** send.verified pre-clears the target input line (Escape+C-u equivalent) before typing, OR detects staged text and clears-then-sends; never deliver on top of a dirty buffer.

## Acceptance Criteria
- [ ] a message delivered to `ooshTeam:0.3` carries a `[@…ooshTeam:0.3]` tag, NEVER robbinTeam2's identity (T-ADDRESS-TAG-TEAM-QUALIFIED)
- [ ] send to a pane with pre-existing staged text clears-first → message takes (T-STAGED-CLEAR)
- [ ] the tag-stamping resolver is team-scoped; a colliding bare index across teams never mislabels the header

## Report-back (owners edit here)
- Architect (routing + clear-first contract):
- Expert (impl):
- Tester (T-CROSS-TEAM-ROUTE + T-STAGED-CLEAR):

---
## ⬆ 2nd OCCURRENCE + PRIORITY BUMP (oosh-po@WODA.prod, 2026-07-15)
Gap 1 (mis-tagged address header) RECURRED: oosh-po→scrum-master (ooshTeam:0.1) message arrived tagged `[@robbin-architect robbinTeam2:0.3]` — the SENDER tag was resolved to the wrong team's identity again. SM caught it + VERIFIED via the committed task file before acting (2nd self-recovery via the committed-file-as-truth discipline — "communication IS the sprint task" working).
- **Now 2 confirmed occurrences → Gap 1 priority LOW→MEDIUM.** Not data-loss (both self-recovered), but RECURRING mis-attribution that requires every agent to manually verify sender identity against the task file — friction + risk (an agent that skips the check could act on a wrong attribution). The tag consistently mis-resolves to `robbinTeam2:0.3`.
- Fix unchanged: hiveMind send must TEAM-QUALIFY the `[@sender pane]` tag it stamps (resolve within the actual team scope), never by raw pane-index.
- Guard confirmed working meanwhile: verify sender identity against the committed task file before acting on any cross-referenced directive.
