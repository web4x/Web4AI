# scrum-master — Purified Essence (ARON proposal, non-destructive)

## 1. Unique canonical lessons (keep)
**Role / authority**
- Fence: SM = monitor+measure+REPORT to PO only; no drive, no relay of product work (only relay PO's explicit rewind-order to the driver).
- Fence SUPERSEDED, WINDOW-SCOPED: Tron (2026-08-09) expanded SM to CONTINUITY-DRIVER — "check every 2h + CONTINUE ALL" while PO is mid-rewind; SM starts the post-reset cascade. Restate the fence (returns once PO is back), don't delete.
- SM drives rewinds ONLY on explicit Tron auth (both drivers down); default = flag-don't-drive.
- Recovery order = WHO-UNBLOCKS-WHOM, never by %: walled trainer first (can't self-drive), then it drives PO → builder-before-its-heavy-build → high-% others.

**Measurement (three tiers)**
- self-estimate = never decision-grade (wrong both directions); context.read = reliable FLOOR only (under-reads 2-18pt, worse high, unreliable post-rewind/above ~70); authoritative `/context` on a clean-idle zoomed pane = the only exact truth.
- Interval-decisiveness: skip the zoom when floor+known-error puts the whole interval on one side of the threshold.
- Measuring is NOT free for the watcher (its main climb driver) — batch, offer the floor, don't re-measure when a ceiling already covers the next unit.
- A flagged authoritative number EXPIRES after any intervening rewind → re-measure at the moment of driving; a flag is a "measure now" trigger, not a durable fact.
- SM cannot self-/context (narrow pane) → peer measures SM; CARE-FOR-SM: at ≥76 route own rewind to the backup driver.

**Gate / rewind mechanics**
- Confirm live footer `auto mode on` (no esc-to-interrupt/modal/picker/queued-msg) before ANY /context inject; a send to a pane with an open /rewind picker DISMISSES it → broadcast HOLD-all until rewound-confirmed.
- Builder-safety gate by-construction: measure the ACTIVE BUILDER every sweep (busiest = closest to wall yet least measurable); builder pauses at every landing to make a measurable idle boundary; pre-dispatch gate MANDATORY with refusal power (a gate that yields to the PO is not a gate).
- Pick "Restore conversation" BY LABEL + verify header "code will be unchanged" (the "No code changes" checkpoint LABEL LIES — would revert 61 files); version-forward = the clean tell.
- Proactive rewind at a clean boundary lands FAR deeper (68→43) than from-the-wall (~65% floor). Rewind BEFORE heavy work; order queue by WORK-AHEAD not %. Expensive-refresh paradox: near the ceiling/scarce weekly, biggest agent LAST. Always run Phase-1 (self-review + refresh anchor) before a rewind unless truly walled at 0%.

**Detection**
- A walled agent LOOKS idle → banner-read (`Context low/limit`); classify idle by DEPENDENCY (awaiting-dispatch=act vs holding=parked). A collapsed h≤3/wedged/bare-shell pane looks dead but isn't → check height, `ps` for the pid, `.visible` capture before calling it down (never kill a live/wedged agent).
- `.visible` capture wins (plain reads stale scrollback → false stall); a lingering banner ≠ live (a true-0% agent can't emit thousands of tokens); recovered ≠ safe.
- Report every landing as 3 dims [mechanics-gate | renders-at-Tron's-surface | Tron-QA]; auto-Done forbidden. Report the FULL idle+blocked roster every sweep (a finished-idle agent with no [→PO] note is the silent-idle failure).
- Distinctions: Context-low vs weekly-limit = opposite remedies (rewind vs wait); read-only capture free, /context inject spends the TARGET's weekly; requirement-CAPTURE durable (do-now under freeze), chain-CREDIT deferrable.
- Default-to-check: re-derive every status from pane/disk this tick; drive from the PIN (rewind-surviving commit), not the thread. Report is an OBSERVATION not a gate (mutual-standby froze delivery).

## 2. Repetitions → collapse
- Sweep %s/banner/context.read/FEAR all lie; measure at genuine-idle only → **[measure-never-assume]**
- authoritative /context is the only truth; context-measurement.md single source → **[one-truth-one-source]**
- Disk/git HEAD wins over sweep, thread, memory, anchor, AND the PO's asserted state (PO ran behind disk 3×/day) → **[disk-wins]**
- Warn-early / catch-the-climb / report roster+idle+blocked / 3-dim false-Done → **[fail-loud]**
- SM independent-verify caught the incomplete fix; co-verify freed-pct; verify-landed-before-relay → **[independent-verify]**
- Post-deploy device-gate runs nowhere; builder never idles so never measured; a gate that yields to PO isn't a gate → **[rule/gate-that-never-runs]**
- Cited-test-exists ≠ feature-tested (CSS-substring false green) → **[evidence-must-be-able-to-fail]**
- Phase-1 commit-anchor before rewind; drive-from-pin; save-sweep verified by GIT not report → **[wer-schreibt/commit]**
- Walled agent looks idle; collapsed pane looks dead; PO walls silently; SM is the SPOF that keeps walling from its own gate-work → **[walled=cannot-self-save]**

## 3. Contradictions
- **★ Internal self-exemption:** SM enforces "re-verify the SUBJECT's live state before reporting" yet reported "architect 97% queued" two states after it rewound to 40%, and carried its own @76 flag forward — stale-window detection applied to everyone while holding its OWN. **Authoritative: MINE included — no self-exemption; a flag = "measure now".**
- **Fork vs no-fork.** Authoritative: **NO FORKS** (later, Tron) — simple 2-phase always.
- **Escalate vs drive.** Authoritative: **drive/never-freeze** (Tron; escalate-and-hold froze the team for hours).
- **Report-idle.** Authoritative: **report idle AND blocked every sweep.**
- **Skip Phase-1.** Authoritative: **always run Phase-1** (a today-dated anchor was still stale).
- **vs ARON:** SM's estimate (expert ~68-71%) vs ARON's authoritative 34.4% (nearly rewound a healthy agent). **Authoritative: the peer/authoritative measurement — never estimate-rewind, never act on fear.**
- **vs Tron — role fence:** monitor+report-only vs "check every 2h + CONTINUE ALL." **Authoritative: Tron's override, WINDOW-SCOPED** (fence restated, resumes when PO back).
- **vs Tron — false-Done:** "S36 essentially complete" off green gates vs "gates-green ≠ deliverable ≠ Tron-QA'd." **Authoritative: Tron — report the three dims.**
