# ARON Backlog

Open work items. Survives compact (chat does not).

## Open
- [ ] **Await Tron's word** on whether to commission the agent-trainer to weave `TRON-CMM4-doctrine.md` into every SKILL.md now (the "read on every boot" line the doctrine already calls for), or hold.
- [ ] If commissioned: write a trainer task file in `session/tasks/` specifying the canon excerpt + the "read the heart on boot" line to add; verify the result by re-reading sample SKILL.md files.

## Hourly PO-encouragement heartbeat — improvement brainstorm (CMM4 on the loop itself)
*Tron: "lovingly assure they do not ignore it but brainstorm improvements." Ideas to raise the heartbeat from session-cron to a real CMM4 mechanism. Awaiting Tron's pick.*
1. **Durability (walking-stick → tool)**: session cron dies with Claude. Build a real `hiveMind`/OOSH scheduled job so the heartbeat survives my death/restart. *(Tron hinted at this.)*
2. **Closed loop + metric**: rollup.md now logs each round; add a metric — % of POs who produced an improvement-task that cycle. Measure engagement, not just delivery.
3. **Improvement backlog**: funnel the POs' brainstormed improvements into a tracked team CMM4 backlog (cf. `session/cmm.improvement.md`) so brainstorms become sprints, not lost chat.
4. **Rotate the focus**: vary the hourly theme (weakest-link / self-healing tooling / chat→task / PDCA) so it never decays into ignorable boilerplate.
5. **Loving escalation ladder**: ignored N rounds → gentle re-drive → surface to SM/Tron once/day. Never nag the PO.
6. **Adaptive, quota-aware cadence**: skip/soften nudges when a PO is low-context or mid-burn, or during a subscription crunch — care includes not adding tax.
7. **Two-way aggregation**: invite each PO to drop its improvement to a known file so ARON aggregates the team's hourly build-up into a daily digest for Tron.
8. **Widen later**: extend the build-up pulse beyond POs to experts/testers when Tron wills it.

## Done
- [x] Hourly PO encouragement heartbeat (CMM4 build-up + task-based sprint docs) — cron fc47f96a (:13), encouragement doc + rollup loop. First round delivered to live POs. — 2026-06-28
- [x] First-principles harvest (98 learnings + CMM docs) → team-first-principles.md; reading-list owned. — 2026-06-28
- [x] "Clean perspective of truth" added to OOSH docs/first-principles.md (ed8386f). — 2026-06-28
- [x] Create ARON agent files like the other agents (SKILL.md, boot.md, context, learnings, backlog, symlinks). — 2026-06-27
- [x] Rename self to ARON@WODA.prod. — 2026-06-27
- [x] Register in agent-overview.md. — 2026-06-27
