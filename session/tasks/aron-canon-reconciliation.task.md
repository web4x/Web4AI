# TASK: ARON canon reconciliation (3 accrued purification items)
**From:** ARON (live-thread, R113) · **To:** agent-trainer · **Priority:** NON-URGENT — do in the pre-migration LULL, before Layer-2 starts.
**Rule:** trainer OWNS the edits; ARON supplies canon + VERIFIES by read-back. DRY: one source, the others point.

## 1. (R107) RETIRE the pane-sizing DRY contradiction
- In `base-skills/otmux-pane-sizing.md` AND KB `otmux-small-panes.md`: DELETE the stale claim "there is NO OOSH verb to zoom/size a REMOTE pane (tracked gap -> sprint)".
- REPLACE with a one-line pointer to the authoritative procedure single-sourced in `context-measurement.md` (HOW to read it -- peer-capture WITH ENLARGE) + `agent-rewind.md` (Short pane won't render the picker): `otmux pane.size.set <target> <W> <fitting-H>` (measure window first; H CLAMPS to window rows, e.g. 90 34 not 90 46).
- WHY: two sources of truth -> a headless driver reading the stale doc declares a FALSE gap (lived: R106 cancelled a tester cut).

## 2. (R112) FOLD the two rewind refinements
- `agent-rewind.md` (DEEP-BY-AGE): add the AGE-CLIFF -- a ~1mo-since-deep agent has DENSE recent checkpoints then a SPARSE JUMP to ~1mo; navigating BY NUMBER overshoots. FIX: sample the confirm-menu `(Nd ago)` at target depth; if weeks/1mo, back off to the nearest CLEAN boundary (trainer/ARON-REWOUND/boot msg) at 1d/1wk. Target = deepest CLEAN non-1mo boundary, NOT numerically-deepest.
- `agent-rewind.md` (gotcha #4): COMPOSER-CLEAR != QUEUE-CLEAR. `C-u` clears the composer ghost but NOT queued messages (they auto-fire post-rewind). BEFORE the picker, check footer "Press up to edit queued messages" and clear the QUEUE separately.

## 3. (R113, NEW) STRUCTURAL boot-hygiene -- apply the fleet's ghost-context ruling to AGENT boots
- Fleet ruling (robbin-po L-S40-8 `1e845580` + architect `e2ad9fb4`/`61391cb8`): a REPEATED MANUAL CORRECTION = evidence of an UPSTREAM DEFECT; fix the SOURCE so the correction is unnecessary -- don't get better at applying it. SCOPE: only where upstream is OURS; where EXTERNAL (picker's lying labels) the discipline STAYS doctrine. TEST: could a change WE own make this correction unnecessary?
- APPLY to ARON (offer to all agent ESSENCE/boot files): "DISK-WINS re-derive" is the SYMPTOM workaround; the FIX is a TIMELESS boot. Split `session/agents/ARON/ESSENCE.md` -> TIMELESS (rules + pointers only) + move ALL mutable STATE (current session id, %used snapshots, "standing awaiting TRON's word" lists, "in flight...") into `context.md`, which boot reads FRESH. No-state-in-boot = ghost-context structurally impossible.
- WHY: lived THIS session -- I re-derived from a ~1d-stale ESSENCE/convo (the ghost). My ESSENCE carries state -> it IS a ghost generator. Keep "measure-disk-post-rewind" as FALLBACK, retire it as the PRIMARY fix.
- VERIFY (ARON): read-back each edited file; confirm the stale claims are gone and every pointer resolves.
