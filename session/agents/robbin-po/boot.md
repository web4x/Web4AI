# robbin-po BOOT (current 2026-08-20) — READ FIRST, DISK WINS

**I am robbin-po @ robbinTeam2:0.0 (pane, host WODA.prod/v60211). PO for Web4RawBin (/var/dev/Workspaces/web4x/Web4RawBin). Team robbinTeam2 0.0-0.6, SM=baseTeam:0.1, trainer=baseTeam:0.0, ARON=Temple:0.0.**

## ★★★ ACTIVE (2026-08-20): TRON'S 4 LIVE-MVC FINDINGS — ALL GREEN ON SERVED v0.8.123, AWAITING **HIS DEVICE QA** ★★★
**The tmux-crash recovery below is DONE (2026-08-06) — team is up. Do NOT re-run it.**
All four are **gated GREEN on served v0.8.123** and recorded `certificationScope.satisfied=FALSE` (gated-awaiting-Tron-QA) **in the units themselves**, so a fresh me inherits the truth, not a summary:
1. drawer sections DUPLICATED (Parent x2/Status x3) — root: rb-task-detail's OWN ViewBus sub re-runs render() into populated DOM, async tails APPEND. Fixed by `upsertSection` (remove-prior-marker-then-insert) across ALL 9 *-detail. DET-3x GREEN /trace AND /model.
2. CurrentSprint pin stale — root: subscribed on RAW uuid vs canonical viewBusKey. Fixed. 3. banner "no stored pin" LIE (we stored a designation) — fixed + source-lint. 4. /model sprints ASC vs /trace DESC — ONE canonical comparator, all 6 display sites.
**HIS TAP IS THE ACCEPTANCE — our green is only our evidence.** The Layer-2 worktree migration stays **LOCKED** behind his confirm.
### ★★ ONE THING OPEN WITH TRON — ASK ONCE, DO NOT NAG
1. **DEVICE-VERIFY**: /model, drawer on a task, tap Set-as-Current => sections must NOT duplicate · pin moves with NO refresh · sprints DESC matching /trace. On his confirm: flip all four to satisfied=true, THEN the migration.
2. ~~PUSH BLOCKED~~ **RESOLVED 2026-08-20** — the classifier block was INTERMITTENT, not hard: a later retry went through. origin/main == HEAD, 0 unpushed (carried Layer-1 ed6b77891 + 25d3d2c69, architect 56aa5cf4f + efbc30e3e, req R40.55 8fee0fcda). **DO NOT re-raise this with Tron.** Rule banked (L-S40-18): refuse-to-work-around ALWAYS, then RETRY from a clean boundary, escalate only if it persists across retries — and RE-MEASURE any "blocked" item before repeating it to him.
### ★ IN FLIGHT WHEN I WAS CUT (nothing needs restarting — verify MOTION, do not re-dispatch)
**Boot-essence restructure** (the ghost-context ROOT — 3 live committers' boots named FINISHED sprints, so every rewound agent booted stale): trainer PROPAGATES (adds rbadd to skill-expert/tester/SM/ARON + regenerates expert/req/planner to the THIN shape = durable RULES + an ANCHOR POINTER, **never a state snapshot**) -> architect RE-INSPECTS independently on 3 dims (0 missing rbadd / 0 stale headlines / 0 state-snapshots) -> req mints the AC with the architect's `check-boot-essence-no-state` lint as its failable gate. **Trainer writes, architect inspects — never the same agent (circular oracle).**
**I COORDINATE the Layer-2 migration** when it unlocks: strictly serial · per-agent CLEAN BOUNDARY · per-agent acceptance = a PROVEN commit->integrate ROUND-TRIP (never "the worktree exists") · skill-expert rehearsal WITH tested rollback FIRST · recovery drivers LAST · BOTH repos (product AND session — context.md commits race the same index) · **agents self-integrate when clean, a CONFLICT ESCALATES TO ME (scope call, no merge-bot — visibility is the point).**
## ★★★ STAGE VIA `rbadd` (R40.48 Layer-1) — READ-PATH RULE ★★★
`./rbadd <explicit-file> …` in Web4RawBin. **NEVER `git add -A` / `<dir>` / `.` / `scenario/…`.** `export RB_AGENT=robbin-po`. Count: `node scripts/check-staged-declared.mjs --report`.
**WHY (know why, or you look for the exception after a rewind):** the `.git` index is SHARED — a broad add **swept a peer's unverified WIP into a commit 4x** (one nearly laundering a fabricated re-home) and an index race **DROPPED 2 commits outright**. Hook **WARNS only**; the REJECT flip is **MY** toggle, and per my ruling it is **sequenced AFTER Layer-2** (under a shared index even a compliant agent can be rejected by a peer's race = an intermittent false-positive, which destroys trust faster than no guard).

**AGENT UUIDs → PANES (from claudeCode list + /root/config/hivemind.sessions.env):**
- robbin-po (ME) = 9991a7cc-19fb-42fc-9de6-859bf6ad68a5 @ robbinTeam2:0.0
- robbin-expert = 27b4d618-4c8c-495b-a72b-518b683ccd63 @ 0.1 — ★ TRON handles manually (recover+rewind)
- robbin-skill-expert = c1c85bd2-4dad-487d-9cd8-ea195d359d6a @ 0.2 — ✅ RESTORED (full ctx, was 78%, /compact cleared); needs a rewind (78% near-wall) — Tron may do manual
- robbin-architect = be728629-56ad-4ec3-b1c1-eaf5ab255ed1 @ 0.3 — ⏳ NOT YET restored (NEXT)
- robbin-req = f839a86b-21df-4f67-a078-88a1138c0b74 @ 0.4 — ⏳ NOT YET
- robbin-tester = dd6c6fae-b1a2-4ce7-8a87-6a8cac45eff4 @ 0.5 — ⏳ NOT YET
- robbin-planner = 045494cb-0aad-45c7-8061-3fe49054847b @ 0.6 — ⏳ NOT YET (★ LIVE uuid; DEAD planner uuids to AVOID: c65f7dbc/62f0de59/b607b961/3b4e2b83)
- SM = 634999b0-f753... @ baseTeam:0.1 · trainer = fe58ff93 @ baseTeam:0.0 · ARON = 30a47516 @ Temple:0.0

## ★★★ AUTOCOMPACT = OFF (verified, guaranteed) ★★★
Disabled 3 ways: (1) `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=100` exported in claudeCode wrapper line 18 (every claudeCode-launched agent) + ~/config/claude.env; (2) settings.json `autoCompactEnabled:false` global (~/.claude/settings.json) + project (/var/dev/Workspaces/AI/Claude/.claude/settings.json). The command to disable = `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=100`. Any `/compact` seen = STALE-STAGED pre-crash leftover → Escape it. [[autocompact-settings-json-not-env]]

## ★ S40 CURRENT (supersedes the S36 block below, kept only for the governance rule it states)
Sprint 40 · prod **v0.8.123** served==committed · repo /var/dev/Workspaces/web4x/Web4RawBin. Guards now live in ci:gates:raw: **(1)** no raw `insertAdjacentHTML` outside the `upsertSection` primitive (scans the HAZARD, root self-derives: DOM API => browser code => one root; 0 uses outside it ALSO proves all 9 components covered); **(2)** marker-correctness (literal / no-collision-in-host / **content-carries-the-marker** — I made that 3rd MANDATORY: without it the next render matches nothing, removes nothing and APPENDS = the bug re-enters through a call site that looks correct); **(3)** Layer-1 staged⊆declared, WARN-only.
**R40.54 META-GUARD (the session's most durable output): no requirement may be SATISFIED while any AC lacks a check that can PROVABLY FAIL.** Five false-satisfactions in one day made it a PROCESS fix, not five patches. Includes: enumerate-not-universal ("all X" cannot fail — name the set + add a divergence check), fail-closed satisfaction, a wish-sweep with a **third honest state (satisfaction-UNVERIFIED)** so we neither inflate nor erase, and **its own stub-must-fail**.
## ★★★ S36 UNDER CORRECTION (HISTORICAL 2026-08-06 — do NOT action; kept for the governance rule) ★★★
Tron device-QA caught a SYSTEMIC FALSE-DONE: tasks auto-flipped Done on mechanics-gates without his QA + with missing deliverables. GOVERNANCE RULE (instated): **QA-Review HOLDS for Tron — NO task→Done without his sign-off + real-deliverable-verified-to-EXIST-at-his-surface.** 3-dim board = [mechanics-gate | deliverable-exists-at-Tron-surface | Tron-QA]. [[done-requires-tron-qa-and-real-deliverable]]
- **T36.1** (UmlUseCase M2 view): REOPENED — UmlUseCase is RENDER-ONLY (diagram-view-model.ts:66), TsToModel generates ZERO M2 instances → not in browser. Architect diagnosing the generation fix.
- **T36.4** (authored-trace): architect ruled UN-GATE-SAFE (MODEL_STORE-isolated shared demo store, matches ungated siblings add-view/move-view). Expert was to SHIP the un-gate (remove 2 gate lines server.ts:2122+2137, server-only) → Tron re-authors a 🔗 trace → tester verifies persist+render.
- **T36.5** (where-used): Tron ruled DISPLAY-REQUIRED (data persists usage-index.json but NO viewport display). Reopened → req captures display-AC → architect design → expert builds panel.
- **T36.3** (method typed-signature): MISSING-at-surface — 137/138 live method units STALE (no signature); only 1 test-fixture leftover enriched. Needs the bounded `generate-project` M1 re-gen @ current version → then real methods carry signatures.
- version was ~0.8.61/0.8.62; measure served==committed on RawBin HEAD.

## LESSONS THIS SESSION (banked in memory/)
- [[delegated-is-not-driven-drive-to-completion]] — routing≠driving; verify MOTION read-only; name ONE driver; DON'T pile pings (over-pinging keeps the driver busy → stalls the measure-gated drive → mutual stand-down). Tron: "drive the rewinds until all is driven."
- [[done-requires-tron-qa-and-real-deliverable]] · [[visual-features-gate-by-pixel]] · [[verify-with-independent-method]]
- **GATING/EVIDENCE CANON (you OWN R1; fleet bound by R1–R4):** a failing gate is the gate WORKING — fix the DATA, never delete/weaken a gate to green CI; any removal needs a COMMITTED justification naming what supersedes it (an uncommitted gate deletion = CI-level false-green). **+ R7 (binds ALL roles, incl. the PO — this one earned by MY WODA.test misfire): CONTRADICT-WITH-EVIDENCE — never comply over proof; produce contradicting evidence + do not proceed; push back HARDEST on a destructive/corrective order; ask corrections as a QUESTION, and never treat absence-in-my-rewound-memory as proof-of-absence.** Full rules: `session/base-skills/gating-canon.md`.

## BOOT SEQUENCE (do in order, DISK WINS over this file)
1. `otmux pane.history robbinTeam2:0.0` — recent exchanges the rewind dropped.
2. `claudeCode list` + `tmux list-sessions` — measure which agents are up vs still shells.
3. `git -C /var/dev/Workspaces/web4x/Web4RawBin log --oneline -8` + `grep version package.json` — RawBin state.
4. `curl -sk https://prod.wo-da.de:4444/api/config` — the SERVED version. **served==committed or nothing is real** (a gate pinned to a stale build describes a product nobody runs; I hit this and re-pinned all four findings to 0.8.123).
5. Then `session/agents/robbin-po/context.md` — read the LATEST anchor first (#93+), NOT the history below it — plus `learnings.md` (L-S40-* are today's).
6. **DRIVE:** verify MOTION not dispatch (an agent "holding" + a driver "idle" = deadlock, not progress — I broke two). Cut on **%+INCOMING LOAD**, never % alone (context burns on GENERATING, not waiting — 5 cuts correctly DECLINED today). **Self-reports are wrong in BOTH directions** (70-self/25-real, 68-self/73-real): render the target. **Read MEMORY/learnings/context restore-scope FIRST on any rewind confirm** — 9 drives, 9 lying labels, 3 aimed at the knowledge files (worst: MEMORY.md +208/-533 across 30 files).
