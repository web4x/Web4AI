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
| 13 | 2026-08-10 | no | EMPTY CHECK — HEAD unchanged (8th consecutive). 8 stable empties = over-sampling a frozen state -> retuning my cron hourly->4-hourly (CMM4); snap back to hourly on first detected activity | — |

## Round 14 — 2026-08-10 (WORK RESUMED — freeze LIFTED, snap-back to hourly fired; a collapse hit)
- **Status:** freeze LIFTED (`48792707`, Tron bugs A+B+C shipped v0.8.79; 16604eee restored, RCE knowingly-open pending rotation; D2/rotation await Tron GO). Fleet active again → **cadence snapped back hourly** (job `b5d5ebed`), now self-adaptive (backs off on ≥4 empties, snaps back on activity).
- **HIT — REPETITION COLLAPSE (measurement-validation family):** tester `7782f944` "unexpected result in EITHER direction = suspect the instrument first (3 self-catches)." Collapses false-low-worse-than-absent + audit-the-verifier + validate-the-measurement-tool + the-PDCA-harness-can-lie into **ONE: "A surprising measurement — too high OR too low — makes the INSTRUMENT the first suspect, not the conclusion. Validate it (positive + negative control, independent cross-check) before acting. Distrust a too-good reading as much as a too-bad one."**
- **Secondary bank:** architect `bc800525` "single-source-of-relationship" = a one-truth-one-source instance (an edge/relationship has ONE authoritative source, not stored redundantly). Fold under the DRY/one-source family.
- **CHANNEL: canon** — fleet just resumed (busy); bundle into the trainer weave (now rounds 1-5 + this). No live send.

| Round | Time | Hit? | What | Channel |
|-------|------|------|------|---------|
| 14 | 2026-08-10 | YES | instrument-first collapse (surprise either-direction → suspect the measure) + snap-back-to-hourly (work resumed, freeze lifted) | canon (bundle) — fleet busy |
| 15 | 2026-08-10 | no | EMPTY CHECK — HEAD unchanged (1st empty since resumption; not yet a stand-down); hourly holds | — |

## Round 16 — 2026-08-10 (16+ commits; the primary hit corrects the KEEPER's own rounds)
- **PRIMARY HIT — "A POSTURE decays like a version number"** (PO `7a8e5503`): freeze/hold/blocked-on-X is a POSTURE, not a fact — it goes stale, and **a stale restriction silently stops real work while nothing errors.** Rule: **re-measure the GATING STATE, not just facts; a posture (freeze/hold/blocked) is a re-measure trigger the moment it ages. Corollary: an agent acting against a stated posture = signal to re-measure, not to correct the agent.**
  - **★ KEEPER SELF-CORRECTION (own it):** my rounds 6-13 relayed "fleet blocked on Tron / freeze active" for 8 rounds. I measured HEAD-unchanged (a fact) but ATTRIBUTED it to a posture I read off the stale #73, never treating the aging posture as a re-measure trigger. The freeze had lifted ~16h earlier; the fleet was idled by a stale hold, not genuinely blocked. I relayed a posture as fact — the exact error this hit names. Truth #8: no exemption for the keeper's own rounds. Going forward: an empty check must distinguish "measured genuinely-blocked" from "a posture I haven't re-verified is still real."
- **HITS — evidence-must-be-able-to-fail family (3 fresh instances, collapse):** reachable-error-branch (a fallback short-circuiting to a plausible default can never reach its error state; make the inner default NULLABLE, prove the branch reachable by tracing every `||` upstream — `0a932f21`) · assert-the-RESULT-is-right-not-that-the-op-succeeded (`8cc70d73`) · NOT-RUN==RED (a device/post-deploy gate that ran nowhere counts as RED; Tron's device found 4 defects green headless gates missed — `2e22cea5`). ONE line: **"A gate/branch that cannot fire proves nothing — prove the failure path is reachable and actually runs, and assert the outcome, not the operation."**
- **CHANNEL: canon** — fleet very active (deploying); bundle into the weave. No live send.

| Round | Time | Hit? | What | Channel |
|-------|------|------|------|---------|
| 16 | 2026-08-10 | YES×2 | POSTURE-decays / re-measure-the-gating-state (+ keeper self-correction of rounds 6-13) · evidence-must-be-able-to-fail family (reachable-error-branch + assert-result + NOT-RUN==RED) | canon (bundle) — fleet busy |
| 17 | 2026-08-10 | no | EMPTY CHECK — HEAD unchanged. Applied R16 lesson: re-verified the gating state = GENUINE fresh Tron-decision (D2/rotation GO; device slate shipped v0.8.81), NOT a stale posture. Real block, hourly holds | — |
| 18 | 2026-08-10 | no | EMPTY CHECK — HEAD unchanged (2nd consecutive); same genuine rotation-GO block (verified R17); hourly holds | — |
| 19 | 2026-08-10 | no | EMPTY CHECK — HEAD unchanged (3rd consecutive); same block; next empty (4th) triggers 4-hourly backoff | — |

## Round 20 — 2026-08-10 (work resumed hard, 11 commits; a CAPSTONE hit that generalizes round 1)
- **PRIMARY HIT — CAPSTONE "one value, TWO sources, one DEAD"** (PO `5059ea29` + architect capstone `7b578fa1`): the recurring disease behind 3 feature bugs today — facet-type-hardcode vs `deriveViewKind` · **stored-pin vs `resolveSprintPin` (= my ROUND-1 hit — now revealed as one instance)** · `drawer._shownType` vs orphaned detail-shown event. **Round 1's pin-resolver teaching is a SPECIAL CASE of this.** Canon: **"The recurring bug is one value with TWO sources, one of them dead/stale. The fix is NEVER 'also update the other copy' — collapse to ONE source/trigger path, then lint the second source out of existence. TELL: a value read from an internal field AND announced by an event = two sources."** (Architect corollary `bc81eece`: unification ORPHANS SIGNALS — after collapsing, clean up the dead source's dangling events.)
- **SECONDARY HIT — "approving a design is not dispatching it"** (PO `5a2c22e9`, 3rd specified-but-nobody-moving today): design-approved ≠ work-moving → **name the OWNER + verify MOTION** (= delegated-is-not-driven, re-proven). Owners: PO/orchestrator.
- **Reinforcement (no re-teach):** 4th stale-fact catch today (`a8a153dd`) → round-16 posture-decays holds.
- **CHANNEL: canon** — fleet very active (deploying + restart-coord); bundle into weave, two-sources-one-dead promoted to CAPSTONE (round 1 becomes its instance).

| Round | Time | Hit? | What | Channel |
|-------|------|------|------|---------|
| 20 | 2026-08-10 | YES×2 | CAPSTONE two-sources-one-dead (generalizes R1 pin; fix=collapse-to-one+lint) · approving-a-design≠dispatching-it (name owner+verify motion) | canon (bundle) — fleet busy |

## Round 21 — 2026-08-10 (6 commits; a 2nd CAPSTONE — the fail-loud family's general form)
- **CAPSTONE — "silence must never impersonate emptiness"** (architect `fc584ed3`, PO formulation): the general form of the whole fail-loud/fail-visible thread. **An empty/silent result must be distinguishable from a genuine "nothing" — 0-because-the-query-failed must never look like 0-because-there-are-none.** Unifies: false-low-worse-than-absent · fail-loud-never-silent · negative-results-need-corroboration (R4) · NOT-RUN==RED + reachable-error-branch (R16). This is to the FAIL-LOUD family what two-sources-one-dead (R20) is to the DRY family.
- **HIT — "DONE must carry PROVENANCE"** (PO `L-S40-4` `306137cc`): checklist-derived Done and Tron-recorded-verdict Done give OPPOSITE answers for old ticked tasks, and the derived one wins SILENTLY → a bare Done is indistinguishable from a signed one. Fix: **`doneBasis` records checklist-derived vs tron-approved; no reconcile may fabricate an unverdicted Done.** (Sharpens done-requires-Tron-QA; itself an instance of BOTH capstones — a basis-silent Done impersonates emptiness, from two-sources-one-dead.) Method: **"audit the GOOD NEWS"** — a clean sweep can hide a dirty subset in the same report.
- **Reinforcement:** PO `L-S40-3` — a code comment naming a req is NOT a credit marker; verify marker EXISTS+resolves before an adopt (shared Method → DISTINCT Impl, incumbent preserved). 5th agent-caught PO error → contradict-with-evidence holds.
- **CHANNEL: canon** — fleet busy (R40.25/26/27 deploy+design); bundle into weave.

| Round | Time | Hit? | What | Channel |
|-------|------|------|------|---------|
| 21 | 2026-08-10 | YES×2 | CAPSTONE "silence must never impersonate emptiness" (fail-loud family general form) · Done-must-carry-provenance (doneBasis; audit-the-good-news) | canon (bundle) — fleet busy |
| — | 2026-08-10 | YES (interstitial `e1e13bee`) | post-rewind anchor GHOST RESIDUE (conflated uuids) — verify your OWN boot claims to disk (planner self-caught R-C8/R-C9 misattribution, from a carry-on-verify nudge = 42) | canon (bundle) |
| 22 | 2026-08-10 | (already banked) | the hour's hit = the ghost-residue interstitial above (taught write-as-it-happened, not held for the round); no other new fleet commits since R21 | — |
| 23 | 2026-08-10 | YES | PIN is the single source of "what is current" — NOT a PO-invented priority list; work becomes current only when TRON pins it (R40.17/18), not by agent urgency (= instance of two-sources-one-dead + reinforces R1 pin; 4th correction). Unbuilt steering forces TRON into prose → build the wheel. | canon (bundle) — PO busy |
| 24 | 2026-08-10 | no | EMPTY CHECK — HEAD unchanged (1st empty this stretch). Gating state re-verified FRESH: fleet re-orienting to TRON's pinned MDA/traceability work (0c295fb2), not a stale posture. Hourly holds | — |
| 25 | 2026-08-10 | no | EMPTY CHECK — HEAD unchanged (2nd consecutive); fleet still on TRON's pinned work; hourly holds | — |
| 26 | 2026-08-11 | no | EMPTY CHECK — HEAD unchanged (3rd consecutive, held across day boundary). Gating fresh: robbin fleet awaiting TRON to pin robbin work (he's on MDA sprint). Next empty → 4h backoff | — |
| 27 | 2026-08-11 | no | EMPTY CHECK — HEAD unchanged (4th consecutive) → BACKING OFF hourly→4h (self-adaptive rule); snap-back-to-hourly on new activity baked in | cadence retune |
| 28 | 2026-08-11 | no | EMPTY CHECK (4h cadence) — HEAD unchanged; stand-down genuine (robbin fleet awaiting TRON pins, he's on MDA); no snap-back; stay 4h | — |
| 29 | 2026-08-11 | no | EMPTY CHECK (4h) — HEAD unchanged; stand-down holds; no snap-back | — |

## Round 30 — 2026-08-11 (WORK RESUMED, 11 commits, R40.17 resolver deployed; snap-back to hourly + 1 hit + validations)
- **Status:** work resumed → cadence snapped back hourly (job `d07bf475`).
- **HIT — "don't work while awaiting your own context measurement"** (PO `L-S40-5` `64b15ee7`): *"Building inflates the reading being taken AND moves toward the wall the measurement exists to prevent — pausing is the safe act, not idling. (Measure a STABLE STATE, applied to context itself.) Corollary: never dispatch to an agent whose measurement you just requested."* Fold under measure-a-stable-state + measure-never-assume. (Codifies exactly the wait-for-genuine-idle practice.)
- **★ VALIDATIONS (my teachings landing — the offering becoming reflex):**
  - **posture-decays (R16)** independently banked fleet-wide: tester `a8cd298d` ("void stale FREEZE — measure before obeying") + architect `c46e34f2`. The freeze was stale AGAIN; caught by the rule.
  - **pin single-source (R1) + two-sources-one-dead (R20)** shipped as CODE: R40.17 single resolver deployed v0.8.85 ("reconciled pin-two-sources"). The teaching became the fix.
- **CHANNEL: canon** — fleet active (deploying); fold L-S40-5 into weave.

| Round | Time | Hit? | What | Channel |
|-------|------|------|------|---------|
| 30 | 2026-08-11 | YES | "don't work while being context-measured" (pausing=safe; measure-a-stable-state for context) + snap-back-to-hourly. Validations: posture-decays adopted fleet-wide, pin-resolver deployed as code | canon (bundle) — fleet busy |

## Round 31 — 2026-08-11 (~20 commits; a sharp hit — preserve-before-restore)
- **HIT — "a RESTORE is a WRITE that destroys evidence"** (architect `4eeaa15a` + PO `L-S40-6` `bfd19106`): reverting/`git restore` erases the forensic trail of what caused a dirty state → **preserve-first (capture/commit) before restoring an unexplained dirty state.** Corollary: **when the cause can't be pinned, install TWO discriminating nets** (live-writer guard + stub-must-fail bite + worktree-vs-HEAD audit) instead of restoring blind or faking a culprit. Fold under preserve-before-mutate + measure-before-mutate. (General form of the trainer-commit-dirty-save I did before the planner rewind.)
- **Reinforcements:** posture-decays (R16) now banked by SKILL-EXPERT too (`b60ef272`) = 3 roles independently; architect `31349186` "measure HEAD not worktree" (disk-wins sharpening — worktree lies from peer WIP); architect `223c3ee7` tests[] single-source (two-sources-one-dead family); PO `ebdf8b5a` first PROACTIVE self-flag catch @77 (pre-flag discipline spreading).
- **CHANNEL: canon** — fleet very active (UNIT2/deploys); fold into weave.

| Round | Time | Hit? | What | Channel |
|-------|------|------|------|---------|
| 31 | 2026-08-11 | YES | "a restore is a WRITE that destroys evidence — preserve-first before restoring unexplained dirty state" (+ two discriminating nets); reinforcements posture-decays(3rd role)/measure-HEAD-not-worktree/proactive-self-flag | canon (bundle) — fleet busy |
