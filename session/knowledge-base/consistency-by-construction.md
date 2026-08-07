# Consistency by Construction — who owns pin↔board↔files (doctrine ruling)

**Ruling (ARON, keeper/first-principles counsel, 2026-08-07, TRON via robbin-po; refined 3×).** Concrete case: the CurrentSprint **pin** said Sprint 33 while **files/work** were on Sprint 36 (never advanced through 34/35), and the **board** sat between — pin↔board↔files DRIFTED for 3 sprints, and nobody fixed it until TRON noticed.

## The first-principle answer: the DESIGN owns consistency, not vigilance
Consistency maintained by someone *remembering to check* is **CMM2** and drifts the moment attention lapses. The drift is a **DRY violation**: three hand-maintained copies of one fact (which sprint is current) allowed to disagree. **CMM4 = make disagreement structurally impossible.**

**By design (the real fix — a gap → make it a sprint), and this is the TEAM's job start-to-finish:**
1. **ONE source of truth = the files** — task statuses / scenario units on disk (scenario-first, law #100: the board/pin is a *generated view*, never hand-authored truth).
2. **Pin + board = GENERATED views**, regenerated on every change. A generated view **cannot drift** from its source.
3. **A `validate`/CI guard asserts `pin == board == files`, FAIL-LOUD** — objects self-heal (reflect reality) or refuse to run silently drifted. "No silent broken state."
4. The pin is **computed** = the sprint the work is on.

## ★ THE SPLIT — reflect-reality (TEAM) vs strategic-increment (TRON) (TRON, 2026-08-07)
"TRON owns the increment" is TOO BROAD. Two different acts:
- **Reflect current reality = TEAM bookkeeping, NO TRON.** Counting done-tasks; advancing the pin to point at the sprint the work is *already* on; syncing the board to the files. *"Counting tasks does not require me — be responsible as a team in the roles I gave."* Punting this to TRON is the team being **irresponsible**, not respectful.
- **Strategic increment = TRON.** CREATING a genuinely NEW sprint, jumping the backlog, setting direction. Only this is a decision; only this is surfaced to TRON.

The 3-sprint drift was **NOT** an unsurfaced TRON-decision — the work was already on 36; the team simply **failed to reflect it** (skill-expert/planner bookkeeping). The fix needed no TRON at all.

## Closing a sprint (sprint-unit Planned→Done) = (a) TEAM, with an honesty precondition (2026-08-07)
Closing a sprint whose board is 100% Done is **reflect-current-reality = TEAM bookkeeping.** The sprint-unit status is a **GENERATED view of its task board** (same class as the pin) — a fully-Done board closes its own sprint-unit; the team just does it. **"Tron-close-pending" as a sprint status is a PHANTOM GATE** — a redundant sprint-level TRON sign-off invented on top of already-accepted tasks = the **punt-to-TRON anti-pattern**, and it's what stranded 4 sprints in a dishonest "Planned."

**PRECONDITION — the real acceptance gate lives at the TASK level, NOT the close:** "100% Done" must be HONEST. A task is Done only on its OWN acceptance — including **TRON's QA sign-off + the real deliverable verified to EXIST wherever that task's AC required it** ([[done-requires-tron-qa-and-real-deliverable]]). That gate is already *inside* each task's "Done"; sprint-close adds nothing on top.
- **Every task honestly Done → the sprint DELIVERED by construction → the team closes it (Planned→Done), no TRON.**
- **Any task marked Done without its required TRON-QA (auto-Done / false-green) → the board is NOT honestly 100% Done.** Fix = surface *that specific task's* QA to TRON (task-level detect-and-ASK) — never gate the whole sprint-close on a phantom sprint ceremony.

**The only TRON acts here:** (1) the per-task QA already baked into "Done"; (2) CREATING the *next* sprint / direction (strategic). **Sprint-close itself = (a) TEAM.** So: **audit the S33–36 boards for honest Done (no un-QA'd user-facing task hiding as Done), then the team closes all 4** — that is reflecting reality, the roles TRON gave.

## SURFACE-TO-TRON — for STRATEGIC decisions only; detect-and-ASK, never detect-and-wait
Making TRON the owner of a decision **without the team ASKING him** makes him a **BLIND BOTTLENECK** (a gate the authority never hears about fails exactly like no gate). BUT this applies **only to strategic decisions**, never to reflecting-current-reality (which the team just DOES).
- When a **strategic** trigger appears (a new sprint / direction / backlog-jump is warranted), the SM + PO **proactively ASK TRON** — they do not sit idle "deferring."
- **General principle:** when a human owns a decision, the team's duty is **detect-the-trigger-and-ASK**. Silent deferral is a dropped ball wearing the gate's uniform. AND: never punt *mechanical* work to the human to look busy-deferring — that's the same failure inverted.

## Roles
| Owner | Responsibility |
|-------|----------------|
| **SKILL-EXPERT** | Keeps the **CurrentSprint pin current** — advances it to the sprint the work is on. Pure bookkeeping, no TRON. |
| **PLANNER** | Syncs + **audits** board↔files (counts done-tasks, flips statuses). The drift was this team-bookkeeping miss. |
| **SM** | **Detects** — measures pin vs board vs files every 60s sweep; flags drift for the team to reflect; **surfaces STRATEGIC questions** to TRON. |
| **PO** | **Gates** — not "done/advanced" until `pin == board == files`. Blocks false-Done. |
| **TRON** | **STRATEGIC increment ONLY** — create a new sprint / jump backlog / set direction. NOT the mechanical pin-advance. |
| **objects-self-heal** | Pin/board validates on init (`pin.sprint == files.sprint`) → heals (reflect reality) or fails loud; never runs drifted. |

## One-line for TRON
**Design owns consistency (DRY: files = source, pin+board = generated views, fail-loud guard) — and it's the TEAM's job end-to-end. SPLIT: reflecting current reality (count tasks, advance the pin to the sprint work is on) = team bookkeeping, no TRON; only the STRATEGIC increment (create a NEW sprint / direction) = TRON, surfaced by detect-and-ASK. "Owned by vigilance" = CMM2 drift; "punted to TRON" = team irresponsibility. Be responsible in the roles TRON gave.**
