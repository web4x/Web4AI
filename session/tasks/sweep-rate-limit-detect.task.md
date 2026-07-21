# team.sweep RATE_LIMIT detection + re-nudge (TRON ORDER 2026-07-20)

**Owner:** oosh-po. **Origin:** Tron via SM. **Domain:** ooshTeam owns hiveMind/scrumMaster.
**WHY (proven live):** 3 robbinTeam2 agents (0.3/0.4/0.6) hit `API Error: Server is temporarily limiting requests · Rate limited`, returned to an idle `❯` prompt, and `team.sweep` classified all 3 as plain **IDLE** → SM missed them; they HUNG until Tron caught it. ROOT: `sweep.detect` (hiveMind:8681) prioritizes the bottom-of-pane live area (idle `❯`) over the `Rate limited` line in scrollback → can't tell `idle=done` from `idle=throttle-interrupted-needs-nudge`.

## SCENARIO-FIRST ACCEPTANCE UNITS

### A — DETECT
GIVEN a pane at an idle `❯` prompt whose LAST substantive output (before the prompt) is a rate-limit signature (`Rate limited` / `temporarily limiting requests` / `API Error: Server is temporarily limiting`)
AND there is NO user message / NO new agent activity AFTER that signature (agent bailed to idle, stuck)
WHEN `sweep.detect` runs
THEN it returns a distinct **RATE_LIMIT** state (NOT idle).
**CRITICAL no-false-positive (value-sanity lesson):** a rate-limit line FOLLOWED by resumed activity (agent continued / user nudged / a newer completed response) → NOT RATE_LIMIT (resolved). A rate-limit deep in old scrollback with activity after it → NOT flagged. Only flag a rate-limit that is the last substantive event and is UNRESOLVED.

### B — DISPLAY
WHEN `team.sweep`/`status` runs
THEN a RATE_LIMIT agent shows a DISTINCT marker (e.g. `⚡RATE-LIMIT`, distinct color), clearly different from IDLE, so SM catches it at a glance.

### C — RE-NUDGE (auto helper)
WHEN `sweep.loop` (or a new `hiveMind.sweep.renudge`) runs
THEN for each detected-RATE_LIMIT agent it sends `continue` to resume it
AND it is IDLE-GATED (only nudge stuck-post-throttle agents, NEVER a busy/generating one)
AND BOUNDED/BACKOFF (track last-nudge time; re-nudge at most every ~N min — never spam during an active throttle)
AND uses a RELIABLE/verified send (a ghosted nudge won't un-stick — depends on S-9 send reliability at runtime; log each nudge so SM sees what was auto-nudged).

## PO DESIGN CONSTRAINTS
- **False-positive prevention is paramount** — flagging a resolved rate-limit as stuck would cause spurious nudges. Detector must confirm rate-limit = last substantive output + unresolved.
- DRY: extend the existing `sweep.detect` 18-state classifier with RATE_LIMIT; team.sweep display joins it in.
- Re-nudge: idle-gated + bounded + reliable-send + logged. Auto but safe.
- DETECT+DISPLAY are pure read/classify (no S-9 dependency) = immediately valuable; RE-NUDGE's landing depends on S-9.

## OWNERS (design → build → gate → deploy; WIP=1)
- **design (hiveMind-expert):** where/how sweep.detect classifies, the recent-vs-scrollback boundary, the RATE_LIMIT signature + unresolved test, display format, re-nudge helper (idle-gate + backoff + reliable send). PO-review before build.
- **build (expert)** → **HARD GATE (independent):** must include the no-false-positive cases (resolved rate-limit → NOT flagged) + a real throttled-pane → RATE_LIMIT + re-nudge idle-gate/backoff. Value-sanity discipline: verify at the real condition.
- Deploy via git apply (hardlink-safe), guarded, live-verified.

## DESIGN — ACCEPTED (PO-reviewed 2026-07-20)
Design (hiveMind-expert subagent, grounded file:line): root = sweep.detect (8917) reads 20 lines, bottom-5 first; bare ❯ at 8997 returns idle immediately so the scrollback rate-limit check (8085) is never reached for throttled-then-idle. Fix = NEW rate-limit probe branch INSIDE the idle test (8997): bare ❯ → probe recent scrollback → unresolved-throttle ⇒ `rate-limit|wait|blocker|<retry>` (the EXISTING contract, so `paneState` 8201 already renders RATE_LIMIT downstream — DISPLAY nearly free), else idle. No-false-positive core = last-substantive test (signature must be the LAST non-chrome line before ❯) + unresolved test (no completion-marker/new-turn/esc-to-interrupt after) + 20-line-window-only (never deep history). Re-nudge = new `sweep.renudge` (NOT unblock.pane which is wait-only): idle-gated (intrinsic), backoff (min-interval + exponential + max-attempts + reset-on-recovery), reliable send (send.enter → verify-redetect → send.raw Enter poke if queued → give up if persists), logged + dry-run.
**PO RULINGS:** (1) HIVEMIND_RENUDGE_MIN_SEC=120, MAX_ATTEMPTS=5. (2) Wire re-nudge into `pane.sweep.loop` ONLY (NOT the watchdog yet — validate later). (3) Nudge word = `continue` (short, BUG10). (4) RATE_LIMIT color = BOLD_YELLOW (distinct from red SUB_LIMIT). (5) **PHASING (per SM):** ship as TWO patches — **P1 = A+B (detect+display)** deploy first (pure read, no S-9 dep, immediately valuable), **P2 = C (re-nudge)** after P1 proven + SM co-verify on a real throttled pane (auto-send = the risky part).
**GATE:** hard, independent, incl the RESOLVED-rate-limit→IDLE no-false-positive case + a REAL throttled pane (SM co-verifies).

## BUILD + DEPLOY (2026-07-20)
- **P1 (detect+display) — DEPLOYED `d972bd2` + smoke-green** (team.sweep renders the column clean alongside ctx). Builder tests 8+4 green incl all no-false-positive cases (resolved 3-forms→IDLE, deep→IDLE, active→active, code-mention→IDLE). PO-reviewed the probe. Pure-read, low blast. **Real-condition co-verify PENDING** — no live throttle at deploy time; SM confirms on the next real throttle (RATE_LIMIT) + a recovered agent (IDLE, no false-positive).
- **P2 (auto-renudge) — BUILT + tested (19/19: idle-gate, min-interval+exponential backoff, max-attempts bound, reset-on-recovery, verify-after-send + send.raw poke, dry-run) — HELD.** Deploys after P1 co-verifies on a real throttle. `scratchpad/rl/sweep-renudge.patch` (applies on P1).
- **STATUS: P1 live (co-verify pending) · P2 held.**

## UNIT D — AUTO-REFRESH ctx in sweep loop (TRON-relevant, SM 2026-07-20)
**WHY:** the sweep shows the last-RECORDED ctx which AGES (~1h) → planner real 82% shown as stale 71% → BLINDS the 80%-rewind trigger. Staleness IS flagged (⚠) but consumers need FRESH values.
**FIX:** auto-gather ctx in `pane.sweep.loop` for IDLE agents whose recorded reading is STALE (age > `HIVEMIND_CTX_REFRESH_SEC` ~300s) OR high (≥ ~60% near-cliff). BOUNDED per-agent (reuse the P2 renudge backoff/state pattern — no per-tick churn), idle-gated (gather already skips active), fail-loud (ghosted/parse-fail keeps the prior reading, never a false value — the 0-guard holds). Prioritize highest/stalest.
**DEPENDS:** gather works (post-0-guard `17d5a2d`); the /context SEND reliability depends on S-9 (degrades safe without it — stale reading kept, never corrupted).
**GATE:** no per-tick churn (backoff honored); only idle/stale/high agents refreshed; a fresh gather updates the reading + age; never a 0k/false value. Plus SM consumer asks: (1) age surfaced in team.sweep — ALREADY DONE (the `<age>` field, e.g. `1h`, + `⚠` stale flag; auto-refresh shrinks it to `0m`); (2) SM co-verifies on a REAL near-cliff (≥60%) idle pane that it auto-refreshes to a fresh reading. STATUS: design+build in flight.

### CO-VERIFY (2026-07-20, hiveMind-expert subagent, READ-ONLY — never touched the held-safe expert) — 2 REAL ISSUES + fix
Live case: robbin-expert (robbinTeam2:0.1), SM said stale-74%-vs-real-85%.
1. **Numbers:** record = 74% but **5.2h STALE** (`/root/config/hivemind.context.env:6`, leftover from a 14:28 manual gather.all). **REAL = 67%** (671k in live JSONL `27b4d618`). SM's "85%" was a human estimate matching neither; JSONL is source-of-truth = 67%.
2. **Unit-D auto-refresh NEVER RUNS on this host** — no `pane.sweep.loop`/watchdog process alive; the `/root/config/hivemind.ctxrefresh/` mark-dir does NOT exist → the apply path (`hiveMind:10472`) has never executed for any agent. So "unit-D live" = **code-deployed-but-not-driven** (honest correction to my earlier "delivered" claim). The logic itself is sound (would refresh 74→67 if driven).
3. **DESIGN FLAW (loud):** `context.gather` SENDS `/context`+Enter to the pane (`hiveMind:7846-7848`) BEFORE reading the JSONL. Unit-D targets near-cliff (≥60%) agents = the highest-ctx ones → auto-gather would PUSH them up the cliff / WALL a held-safe agent. The JSONL already holds the current reading; the send is unnecessary AND dangerous.

**FIX (subagent diff, NOT applied):** new `hiveMind.context.gather.quiet` = record from JSONL only, ZERO pane send, fail-loud on no-jsonl; unit-D (`hiveMind:10523`) calls `gather.quiet` instead of `gather`. Then auto-refresh is send-free (safe for near-cliff/held-safe AND active agents).
**SAFETY (until fix lands):** do NOT start any sweep.loop/watchdog and do NOT `context.gather` a near-cliff/held-safe agent — it would nudge/wall it.
**GATE PLAN:** hiveMind-tester — RED (gather sends /context to pane) → GREEN (gather.quiet reads JSONL, records correct %, sends NOTHING) + unit-D uses quiet + no-jsonl fail-loud. Then deploy (git apply) + start the driver.
**PRIORITY:** fast-follow behind S-9 (S-9 = Tron's deploy GO pending). The auto-hazard is currently DORMANT (no loop running); manual-gather hazard is controlled by the safety note above.

### DEPLOYED 2026-07-20 — `08504af` (PO-deployed on Tron's "drive everything but S-9")
Gated GREEN (hiveMind-tester, all 4): RED gather sends /context to pane · GREEN gather.quiet = 0 keystrokes + correct JSONL record · fail-loud no-jsonl (prior kept) · no-regression. Committed hiveMind-only (otmux stray comment left untouched), pushed origin/test/mcdonges.latest (eb42502..08504af). **LIVE SMOKE:** `context.gather.quiet oosh-po` → recorded, ZERO keystrokes. WALL-push flaw ELIMINATED — auto-refresh is send-free, safe for near-cliff/held-safe agents. Enables Tron never-freeze (accurate send-free readings replace stale-number freezes).
**NEW FOLLOW-UP (observed at smoke):** JSONL-total OVER-reports a REWOUND agent — gather.quiet read oosh-po 42% (421k) vs `/context` 33% (329k), because the cumulative JSONL still holds rewound-away content. Pre-existing (affects any JSONL read, not unit-D), ERRS SAFE (over-report → early rewind). For EXACT rewind-decision accuracy, exclude rewound content from the JSONL sum (or trust `/context` on a rewound agent). Filed for the context-tracking accuracy pass.
**STILL PENDING:** start a sweep.loop/watchdog driver so unit-D actually runs (now SAFE to, post gather.quiet) — do on a real ≥60% idle pane + SM co-verify.
