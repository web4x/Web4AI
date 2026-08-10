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

## Round 2 — 2026-08-09 (honest: no NEW settled finding; one rule freshly PROVEN + flagged for canon)
- **No new contradiction/repetition landed from the pass this hour** — the events since round 1 were operational (cascade 4/4 done; fleet FREEZE active), not fresh purification findings. I will not manufacture one.
- **BUT a canonical rule was freshly PROVEN by the live freeze — flag it for elevation (repetition-collapse):** the working copy silently LOST committed `server.ts` R40.10 code (HEAD=10 approve, WT=0); a restart would have deleted committed prod work. → **RULE (elevate from a disk-wins sub-point to first-class): "disk-wins means HEAD, NOT the working copy. Verify `git status` / working-tree == HEAD BEFORE any restart/deploy/build — a restart on a silently-reverted worktree deletes committed prod code."** Scattered today across `robbin-architect.purified.md` + `robbin-expert.purified.md` (both under disk-wins); collapse to ONE canonical statement.
- **CHANNEL: canon only, NOT live — the fleet is FROZEN (PO order); do not interrupt.** Bundle into the trainer weave with round 1 once the freeze clears + the incident settles (teaching a rule mid-incident is premature).
- **Round 1 status:** pin-resolver canon-weave still PENDING (trainer was mid-cascade, now freeze) — `session/tasks/aron-teach-round1-pin-resolver-canon.md` waits on disk, trainer pulls when free.

## Round 3 — 2026-08-09 (two real hits from the security rule + the rewind campaign; fleet fresh/resting → canon only)
- **HIT 1 — REPETITION COLLAPSE (identity/reference family):** three rules are ONE. **full-uuid-never-8-char** (gating R3: don't TRUNCATE on read) + **identity-minted-never-hand-typed** (gating R5: don't FABRICATE on write) + **secret-value-ban** (PO standing rule 2026-08-09: don't REPRODUCE a token/credential value; refer by unit-name+full-uuid or "the owner literal"). → **ONE canonical statement: "Reference precisely; reproduce nothing sensitive or truncated. Identify by full uuid + name; the value lives only on disk (minted unit / chmod-600 vault), never in a message/commit/context/log."** The PO named the link itself: the secret-ban is "the same direction as the 8-char-prefix ban." Collapse the three; keep pointers.
- **HIT 2 — NEW RULE found live (drove req's rewind):** the **≤40 depth-navigation backstop (TRON):** a single `/rewind` Up/Down jump >40 risks a >50% rewind that can OOM a low-resource host — **navigate in ≤40 batches.** New rewind-canon rule; add to `agent-rewind.md` next to by-label + git-status-after.
- **VALIDATION (not new, but proven ~5× tonight):** external-measurement-over-self-claim is THE decisive discipline — expert self-claimed 28% at actual 82, trainer self-estimated wrong twice, my floor matched authoritative 76 vs architect's ~50 self-report. Reinforces measure-never-assume / capture-the-pane-not-the-report. No re-teach needed; the campaign was the lesson.
- **CHANNEL: canon only** — fleet just refreshed top-to-bottom and resting; no live sends. Bundle HIT 1 + HIT 2 into the trainer weave with rounds 1-2 (all still pending — trainer was mid-campaign all night; now free soon).

## Round 4 — 2026-08-09 (fleet ACTIVE in corruption cleanup, 26 commits/90min — a hit that ELEVATES round 3)
- **HIT — the identity/reference family (R3 collapse) is proven LOAD-BEARING FOR CORRECTNESS + extends to history-search:**
  - **Truncation FEEDS fabrication** (PO `af66ffec`): `resolvePrefix` first-match resolves an 8-char prefix to the WRONG unit → corrupt/fabricated data. "full uuid to all WRITE ops" is a CORRECTNESS invariant, not hygiene — the dangerous exact-match-short-circuit branch only fails on a truncated ref.
  - **Applies to HISTORY-SEARCH** (PO L-S40-2 `1750cfab`): a prefix git-search false-negatived two LIVE units → PO published "never created." Rule: **never conclude non-existence from a prefix query; corroborate by an independent signal (dir/content agreement); negative results deserve MORE corroboration than positive.**
  - Both fresh **rule-exempts-author** instances (advocate-then-violate).
  - → Upgrades round-3's "reference precisely" to: **"Truncation causes fabrication and false-negatives — full-uuid is a correctness guarantee, on every write AND every history-search; and a negative result (X doesn't exist) needs independent corroboration before you act on it."**
- **Secondary bank (measurement granularity, PO `d8e5fca0`):** "measure at the granularity you are protecting" — an AGGREGATE net-positive concealed 4 net-negative units. A net number over a set can hide per-item loss; measure per-item where the loss would hurt.
- **CHANNEL: canon only** — affected roles (architect/req/expert/PO/skill-expert) are busy in the incident; fold into the pending trainer weave (rounds 1-4).

## Round 5 — 2026-08-10 (fleet stood down awaiting Tron; a SCOPE hit that corrects my own R3/R4 teaching)
- **HIT — SCOPE the identity/full-uuid family** (architect `d3611e0b`): the rule is NOT "full-uuid everywhere." Precise scope:
  - **DATA-WRITES → full-uuid mandatory** (correctness-critical; truncation feeds fabrication).
  - **NEGATIVE conclusions ("X doesn't exist") → never from a prefix; corroborate independently.**
  - **PROSE / discussion → short refs are FINE** (readability; not correctness-critical).
  - **WHY this matters as a teaching:** my R4 line "full-uuid on every write AND every history-search" was almost over-broad — an agent could read it as "spell full uuids in every sentence," which is noise. The scope keeps the rule where it is load-bearing and lifts it where it isn't. Self-correcting my own round before it's woven = the cadence working on itself (PDCA on the teaching).
- **Reinforcements (not new):** tester `3df5cf89` never-hand-type-a-uuid-uuidgen-always (identity-minted, family member); architect `94f60851` an entropy-guard needs a POSITIVE CONTROL (= evidence-must-be-able-to-fail instance).
- **CHANNEL: canon only** — fleet stood down at clean boundaries (PO #73), awaiting Tron's 5 decisions; no live sends. Corrected the scope inside the pending rounds-1-5 weave.

## Cadence log
| Round | Time | Hit? | What | Channel |
|-------|------|------|------|---------|
| 1 | 2026-08-09 | YES | pin: resolver is single source, stored-slots retired | canon weave — pending |
| 2 | 2026-08-09 | flagged | verify WT==HEAD before restart/deploy | canon (bundle) — pending |
| 3 | 2026-08-09 | YES×2 | identity/reference family collapse · ≤40 depth backstop | canon (bundle) — pending |
| 4 | 2026-08-09 | YES | identity family = load-bearing-for-correctness + history-search + negative-corroboration | canon (bundle) — pending |
| 5 | 2026-08-10 | YES | SCOPE the full-uuid family (data-writes+negatives only; prose fine) — corrects my own R4 over-breadth | canon (bundle) — fleet stood down |
| 6 | 2026-08-10 | no | EMPTY CHECK — 0 new fleet commits; fleet stood down awaiting Tron's 5 decisions; rounds 1-5 weave still pending trainer pull | — |
| 7 | 2026-08-10 | no | EMPTY CHECK — HEAD unchanged since R6; fleet still stood down awaiting Tron; no new hit | — |
| 8 | 2026-08-10 | no | EMPTY CHECK — HEAD unchanged (3rd consecutive empty); fleet blocked on Tron's 5 decisions, not stalled; rounds 1-5 weave still pending | — |
| 9 | 2026-08-10 | no | EMPTY CHECK — HEAD unchanged (4th consecutive); fleet still blocked on Tron's decisions; no new hit | — |
| 10 | 2026-08-10 | no | EMPTY CHECK — HEAD unchanged (5th consecutive); stable stand-down on Tron's decisions. Cadence-backoff offered to Tron. | — |
| 11 | 2026-08-10 | no | EMPTY CHECK — HEAD unchanged (6th consecutive); stand-down holds; keeping hourly (no backoff requested) | — |
| 12 | 2026-08-10 | no | EMPTY CHECK — HEAD unchanged (7th consecutive); stand-down holds; hourly kept to catch the GO promptly | — |
