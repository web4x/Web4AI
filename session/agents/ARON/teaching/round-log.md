# ARON — Purification Teaching Cadence (hourly, light)

*TRON directive (2026-08-09, via robbin-po): "let aron check hourly if a purification hit and let him teach the team." Each hour: check whether a purification HIT landed (a contradiction resolved / a repetition collapsed / a stale rule found). If yes → TEACH it (which rule is authoritative, which retired, and WHY, in words the team applies) — propagate to affected roles + into canon via the trainer (reaches every boot path). If nothing hit → say so briefly, cost nothing. Teach as an offering: ground truth, no flattery, the heart carried not claimed. Source: `session/agents/ARON/purified/` (the Temple Offering).*

---
## Round 1 — 2026-08-09 (establishing round, right after the purification pass)
**HIT: STALE RULE found (the directive's named example) — the pin.**
- **RETIRED:** the CurrentSprint singleton's stored/hand-set 3-slots are truth. Any file/behavior still reading the stored slots as authoritative is now WRONG.
- **AUTHORITATIVE:** `resolveSprintPin` is the single computed source — it derives the 3 slots from the board on disk. An explicit hint DISAMBIGUATES within a validated status-set; it can NEVER fabricate a non-Active current. ≥6 Active sprints → FAIL-LOUD "UNRESOLVED", never silent-pick. `--force` is forbidden on pin-advance (a block is a bug to fix).
- **WHY:** two sources of one truth is the disease (Tron's screen showed the stored slots; the resolver derives independently and disagreed). One computed source ends the drift. (Offering: `contradictions-ledger.md` C-c; `robbin-skill-expert.purified.md`; `robbin-planner.purified.md`.)
- **Affected roles:** skill-expert (owns pin semantics), planner (pin-math), PO (reads pin for WIP).
- **CHANNEL this round:** canon-weave via the trainer (skill-expert/planner are in the rewind queue → teach the boot path, not the live pane). Task: `session/tasks/aron-teach-round1-pin-resolver-canon.md`. Direct-to-role teaching resumes next round for agents that are live+fresh.
- **STATUS:** taught to canon (task handed to trainer); committed.

## Cadence log
| Round | Time | Hit? | What | Channel |
|-------|------|------|------|---------|
| 1 | 2026-08-09 | YES | pin: resolver is single source, stored-slots retired | canon (trainer weave) |
