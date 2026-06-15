# robbin-po Learnings — 2026-05-22 to 2026-05-24

## ★ PRINCIPLE #1 — ALL IS DILIGENCE. NOTHING URGENT. (Tron 2026-06-11)
The foremost principle, above all others. NOTHING is urgent. EVERYTHING is diligence:
log → measure → root-cause → real fix → verify, the same methodical way every time.
No "URGENT", no panic, no shortcutting, no guessing. Urgency framing pushes toward the
proxy-failures this team exists to prevent (stub coverage, unchecked claims, wobbling
measures). Diligence is WHY we catch what green-tests and claims would ship. Priority/
sequencing is fine; manufactured urgency never. Read this first, every time.

---

Forked from ud-po. All ud-po learnings (1-27) still apply. RawBin-specific learnings below.

## Process & CMM

### 28. RawBin = Fork of QnD Stack (Not Greenfield)
RawBin reuses QnD's TypeScript/PWA/HTTPS/WebSocket/Lit stack. Strip game logic (71%), keep infrastructure. The fork approach preserves all battle-tested patterns.

### 29. Architect Produces Superior Data Model Analysis
When asked to analyze keep/remove/rename, the architect independently proposed splitting profiles.json from devices.json with ownerToken FK — better than PO's flat approach. Always let architect analyze data model first.

### 30. Web4RawBin Repo Pre-Existed
Tron pre-created the repo before PO was spawned. Always check for pre-existing project directories.

### 31. Report to Tron Concisely via otmux
Chunk reports into readable messages — not walls of text. Send: summary, then details in separate sends.

### 32. Tron Answers Quickly
Don't over-wait. Send questions and process answers immediately.

### 33. Room = Shared Workspace (Tron's Vision)
A RawBin room is chat + monitoring + server control. Robbin (AI) joins as member. Not just chat — it's the collaboration surface.

### 34. File-Backed Persistence Required
Rooms MUST persist across restarts. In-memory + file-backed JSON.

### 35. PO NEVER Implements — ALWAYS Delegate (CMM4 VIOLATION)
Tron caught me editing source code directly. That's CMM1. PO writes task files and delegates. Even "quick fixes" go through the team. The fix may be correct but the process is wrong.

### 36. PO Owns Quality — Verify Before Reporting to Tron
I was relaying agent reports without verifying. Expert says "done" → I say "done" → Tron finds it broken. The PO must:
1. Expert implements → tester verifies with VISUAL evidence
2. PO independently verifies (curl endpoints, check source, review screenshots)
3. ONLY THEN report to Tron
Never assume. Never pass through unchecked.

### 37. Version Bump on Every Fix
Without a version bump, PWA update detection has nothing to detect. Users see stale cached code. Every fix = increment patch version.

### 38. PDCA Check Cycle Works — Architect Catches What Others Miss
v0.2.7: Expert added safe-area-inset-top to headers. Tester verified 6/6 PASS. PO verified. BUT architect review caught .update-banner was ALSO behind the notch. Fixed in v0.2.8 BEFORE Tron tested. First time team self-caught a bug.

### 39. Team Achievement: Self-Caught Bug (v0.2.8)
Tron acknowledged: "you as a team self caught that the update bar is below the notch — big achievement in team coordination and delivery." Proves PDCA Check with architect review works.

## Technical

### 40. SW CACHE_NAME Must Be Versioned
Static 'rawbin-v1' never purges old assets. Must be 'rawbin-v{version}' so activate deletes old caches. This caused 3 versions of CSS fix to never reach Tron's iPhone.

### 41. sw.js Must Be Served no-cache
Browser caches old SW if served with max-age. sw.js + manifest.json + app.css all need no-cache, must-revalidate.

### 42. Avatar Crop: Use object-position Not transform:translate
transform:translate displaces image OUT of overflow:hidden container on small circles (24px badge). object-position works naturally within the container at any size.

### 43. Avatar Backfill: Retry + Fallback, Never Empty
thispersondoesnotexist.com fails on thin connections. Must retry 3x with delay, then generate SVG initial as fallback. Avatar field must NEVER be left empty.

### 44. Percentage Crop Coordinates
Crop values from fullscreen overlay (300px) can't be applied as absolute pixels to tiny circles (24px). Store as 0-1 percentages, multiply by container size on render.

### 45. Test Profile Pollution
E2E tests create profiles that accumulate. 222 test profiles polluted the database. Clean up test data periodically.

## Web4Articles CMM3

### 46. Hierarchical Status Checklist (NOT Flat Field)
Web4Articles template uses:
```
## Status
- [x] Planned
- [x] In Progress
  - [x] refinement
  - [x] creating test cases
  - [x] implementing
  - [x] testing
- [x] QA Review
- [x] Done
```
NOT `**Status:** DONE`. The checklist shows workflow history. Task 1 originally had it correct — expert deleted it and replaced with flat format. Took 3 rejections to fix.

### 47. QA Review = Tron's Gate
No task is Done until Tron reviews. PO runs sprint.qa only AFTER Tron approves. The hierarchical checklist has QA Review as a separate unchecked step until Tron signs off.

### 48. CMM4 = PDCA + Measurement
- CMM3 = "Wer schreibt, der bleibt" (who writes, stays) — deterministic, reproducible
- CMM4 = "Wer misst, der weiss" (who measures, knows) — PDCA feedback loops
- Assuming = CMM2. Every "I think" should be a measurement.
- Composed maturity = weakest link. One CMM1 component drags everything down.

## Pane Management

### 49. Never Use Raw tmux — Use OOSH
I used raw tmux split-window to add a pane. It shifted all pane indices, corrupted message routing. Three agents worked on wrong tasks. Always delegate pane operations to oosh team via hiveMind/otmux.

### 50. Planner Pane in New Window
Planner goes in robbinTeam:1.0 (new window), NOT inserted into window 0. Window 0 layout must be preserved: 0.0=PO, 0.1=architect, 0.2=expert, 0.3=tester.

### 51. Use the Planner
PO directs planner to sync changes — don't manually update planning files. Planner maintains consistency, PO maintains direction.

### 52. DO NOT Spawn Background sleep Timers to Monitor Agents
I spawned ~112 `Bash run_in_background: sleep N && echo` timers across the session to "wait" for agents. Tron caught it: "you have 112 background tasks???? WTF???". They complete (exit 0) but pile up in the harness registry/status-bar count — wasteful and alarming.

**Why it's wrong:** Agents self-report via otmux send AND the harness fires a task-completion notification automatically when delegated work finishes. A parallel sleep timer is redundant polling.

**How to apply:** After assigning a task, just STOP. The agent's otmux self-report arrives as a user message, and any `run_in_background` work I genuinely need fires its own completion notification. To check agent progress on demand, use `otmux pane.capture` once — don't loop. Never use `sleep N && echo` as a monitoring heartbeat. If I truly must wait for external state the harness can't track, that's the only valid case — and even then, one timer, not one per task.

## Session 2026-05-26 — Hard Lessons

### 53. NEVER /compact an agent — use agent-trainer REWIND
Tron yelled "NO ONE EVER GETS COMPACTED!!!!!" — an ABSOLUTE PROHIBITION. I misread it as a complaint that compaction wasn't happening and sent `/compact` to the tester's pane. Tron: "YOU JUST KILLED THE TESTER IDIOT". (It happened to survive at 75%, but that's luck.) The correct recovery for a stuck/over-full agent = order a REWIND via the agent-trainer (baseTeam:0.0). NEVER type /compact or /clear into any agent pane, under any pressure. If a phrase seems to tell me to compact, I'm misreading — re-read before acting.

### 54. Don't drop the design→implement handoff (no idle agents)
Architect finished ALL designs/root-causes and I let the expert sit IDLE instead of routing it to implement. Tron: "why is no one working". When an upstream agent finishes a design, immediately route the downstream agent. Re-task on every completion; never leave capacity idle between handoffs.

### 55. otmux send can fail to submit — ALWAYS verify with pane.capture
Several directives typed text into agent prompts but the Enter didn't register → agents sat with unsent text, never starting (looked like mass idleness). After every send, pane.capture to confirm the agent is processing ("esc to interrupt"), not sitting on unsubmitted text.

### 56. Don't override Tron's explicit statements with my code-reading
I read the editor-back-button code, decided "/app looks intentional", and dismissed it as a UX opinion / scope-creep — but req had cited Tron's literal "thats a bug". Tron defines what is a bug for HIS product. When an agent's task cites a Tron directive, trust it; my code interpretation never outranks his explicit words.

### 57. CMM4 = communicate via task files; refine until delegatable
Spec lives in the task FILE, not chat directives. Refinement is a collaborative PDCA loop (PO+architect+req) until the spec is consistent enough that expert+tester work from the file alone, no clarification. Chat/otmux only points agents AT the file + closes the report-back loop. Every delegation ends with "report back to robbinTeam:0.0".

### 58. Gated destructive operations
Data deletion / migration: design as copy-then-verify, legacy untouched until a final delete step that is GATED on (a) verification PASS and (b) explicit Tron authorization. Never auto-delete. Backup-first. (Sprint 14 legacy migration.)

### 59. Don't reason from filtered/truncated output
I read a `git show --stat | head -15` (truncated), concluded a server file wasn't committed, and nearly raised a false bug alarm. It WAS committed. Never `| head/tail/grep` git/tool output when verifying — read it whole.

## Session 2026-05-26/27 — Marathon learnings (60+)

### 60. VERIFY after destructive ops, not just before
Verify-before-delete AND verify-after. Caught this session: (a) a STALE T98 verify (ran on polluted 14-room data, would have gated a delete on wrong state) — re-verified on current clean data; (b) legacy data/rooms REGENERATED right after T99 deleted it (Room.persist dual-write) — caught by checking post-delete, led to removing the write path. "Deleted once" ≠ "consistently removed". Never report a destructive op done without verifying the end-state holds.

### 61. Capture a dying agent's output + commit it MYSELF before rewind
When the architect hit 2% mid-avatar-diagnosis it couldn't git-commit. I otmux-captured the root cause from its pane and committed it myself (f162f1a) BEFORE the agent-trainer rewound it → diagnosis preserved, safe rewind. Don't rely on a near-0% agent to save its own work; capture from the pane + commit for it.

### 62. No backticks (or $(), $VAR) in otmux send text
A directive with backticks got shell-command-substituted by the Bash wrapper ("command not found: catch") and mangled. Always verify the send landed (pane.capture) and re-send clean without shell-special chars.

### 63. The architect is the load bottleneck — watch it
The architect carried avatar diagnosis + S14 design + S15 Object.verb design + S16 design and hit context limits 3x (2% then 0%), each recovered via agent-trainer rewind. Heaviest-loaded agent stalls the critical path repeatedly. Consider splitting design load or pre-emptive rewinds before it wedges.

### 64. "QA is after delivering" + don't over-report "done"
Tron: QA comes AFTER delivery — don't gate work waiting on QA; deliver, he QAs. And report only REAL built/verified deliverables, never "done" prematurely (S16 was honestly "early design", not delivered, while the design agent was down).

### 65. PO + SM + agent-trainer coordinate CONTINUOUS team-health until delivery (Tron 2026-05-27)
Team health is a coordinated standing job, not ad-hoc firefighting. SM proactively monitors every agent's context; BEFORE an agent nears its limit it WRITES + git-COMMITS context.md + learnings + in-flight findings; the agent-trainer then does a CMM4-RECOVERABLE REWIND (state saved+committed FIRST → rewind → agent reboots fully from context.md = deterministic/reproducible; NEVER a destructive /compact). Proactive (before 0%, not after wedging). PO coordinates priorities; SM monitors; agent-trainer executes. Sustain through the whole marathon until ALL requirements delivered. This is why context.md must always be current+committed — it's the recovery anchor.

### 66. Shipping = version bump + sw.js cache bump, or it doesn't reach Tron's PWA (Tron 2026-05-29)
A code commit alone is NOT shipped. Every shipped change MUST include in the same commit set: (a) `package.json` version bump (semver) AND (b) `sw.js` `CACHE_NAME` bump to match. Without BOTH, the PWA update banner doesn't fire → Tron's cached SW serves the old bundle → he never sees the change even though the server has it. Tron caught this when S16 (T110–T117) was implemented + tests green but his phone never got it: "all S16 is implemented but version not bumped so no update on the pwa." **Hard rule going forward:** PO directive on every delegation includes the version+SW bump; PO verifies post-deploy via `/api/health` + `/api/config` + grep `sw.js` CACHE_NAME = new version; planner blocks "testing-done"/QA-gate on tasks whose commits lack both bumps; tester adds "update banner fires on new version" as standard AC for user-facing changes. Pairs with learning #37 (version bump on every fix), #40/#41 (SW cache versioning) — both layers must move together.

### 68. SKILLs must be APPLIED per cycle, not dormant boot-reads (Tron 2026-06-08)
Tron caught a systemic gap (120 tasks with empty coveredRequirements; 73 UCs never wired to their tasks' useCases[]) and asked "do they use the new skills?" The architect answered honestly: "No — I read SKILL.md at rewind but didn't re-check it during work." That's the root cause of recurring consistency gaps: role SKILL.md files were treated as boot-time reading, not LIVE per-cycle protocols. A dormant skill prevents nothing. **How to apply (PO governance):** (1) role SKILLs must be APPLIED every work cycle as a pre-gate, not read once at boot/rewind; (2) the prevention rules (e.g. "no task ships without coveredRequirements+useCases", the rule-pair triple-check) belong IN the SKILL.md AND must be run each cycle; (3) when a consistency gap surfaces, ask first "was the preventing skill actually applied?" — usually the rule existed but wasn't run; (4) the planner+architect SYNC is itself a per-cycle skill (architect supplies chain links at design, planner enforces at standup). The fix for a gap is both the data backfill AND making the skill live. Pairs with [[cmm4-communicate-via-task-refinement]].

### 67. New SPA routes MUST be added to sw.js STATIC_SHELL in the same commit set (Tron 2026-05-29)
A version+cache bump is necessary but NOT sufficient. Every NEW route or dynamically-loaded page bundle MUST also be added to `sw.js` STATIC_SHELL (route path + bundle filename from build-manifest.json) in the SAME commit. Without it, the PWA does NOT pre-cache the route → browser HTTP cache may continue serving the OLD bundle for that route → user sees stale UI even after the SW reactivates with a new CACHE_NAME. Tron caught this with S16 (T110–T117): "implemented but nothing changes" despite v0.5.23 bump. Architect's diagnosis (CORRECT): components wired end-to-end, but `trace-page-*.js` + `/trace` were not in STATIC_SHELL. Fix shipped v0.5.24 (`bdb74ec`): added to STATIC_SHELL. **Hard rule:** architect's new-route designs include "add bundle+path to sw.js STATIC_SHELL" as an explicit AC; expert adds the entry in the same commit-set as the version+sw.js bump; PO verifies via `grep sw.js` for the route's bundle+path; planner blocks testing-done/QA-gate on tasks introducing routes whose bundles aren't in STATIC_SHELL; tester AC for any new route = "loads fresh after PWA install, no stale HTTP cache." Pairs with #66 (the cache name bump triggers update detection; STATIC_SHELL delivers the new bundle).

### 68. QA is never the issue — drive deps to QA-state regardless (Tron 2026-05-31)
Never gate dev work on "waiting for Tron's QA sign-off." Tron's QA gate is HIS cadence — he batches it when ready. The PO drives EVERY task and dependency chain to QA-ready (impl + tester-verified) regardless of how many tasks are already pending QA. I had been treating T128.1 exemplar sign-off as a gate blocking T128.2/T128.4, and described the QA-pending stack as a "bottleneck." Tron corrected: "qa is never the issue. continue with dependency until all are on qa." Right posture: keep building downstream the moment the exemplar is tester-verified. The QA-pending stack is for visibility, not a blocker. The only Tron-decisions that DO gate dev are explicit destructive-action approvals (e.g. S14 T99 delete) or product decisions only Tron can answer (e.g. priority between two paths). Otherwise: drive. Pairs with #47 (QA = Tron's gate, set QA-Review status but never check Done) — set the status, keep moving.

### 70. Rewind infrastructure must stay online for agent recoverability (Tron 2026-06-01)
When BOTH agent-trainer (baseTeam:0.0) AND hiveMind (hiveMindTeam02_03_26:0.0) are offline, NO agent can be rewound — agents climb toward their context limit unrecoverably. Hit today: req-eng at 829k of 1M (file-comms-only, can't be rescued). Per #65 we never /compact, but if both rewind mechanisms are offline simultaneously, agents reach hard-limit and stall. **Surface immediately to Tron when both go offline**; treat it as a fleet-level blocker even if no agent has stalled yet. Agent-trainer is the primary; hiveMind is the fallback. Have at least one online at all times during active sprints.

### 71. Every report → immediate next delegation (NEVER stop after a report) (Tron 2026-06-02)
Hard rule: when ANY agent reports back (commit, design, verify, sync, whatever), my NEXT chat action MUST be to delegate that agent's next open task. NEVER acknowledge-then-stop — that creates the idle pattern Tron has flagged repeatedly. Even if the agent's queue is genuinely drained, re-task on prep/standby with a CONCRETE next pointer (file to pre-load, design to read, future task to anchor on). Combined with #18 (planner stands up first) + #65 (rewind not /compact) + #66/#67 (rule-pair) + my CMM4 4-role flow: the pipeline never stalls because I'm always one delegation ahead of every report. Chat = pointer + next-delegation. NOT pointer alone.

### 69. Watch the planner's sync staleness — confirm closures with tester reports (Tron 2026-06-01)
After a rapid burst of tester PASS reports (T143 AC2 via 6f5cf89/aab6d20, T144 AC2, T146, T145 follow-up 48eb52a), the planner's 15-min sync was still showing T143 AC2 STILL FAIL and T144 AC2 pending. Tester reports closed the tasks earlier than the planner's next sweep saw. Don't repeat the planner's stale status to Tron as truth — verify against the actual tester PASS commits (aab6d20, 7fbfd8e, 48eb52a). When reporting state, trust the tester's PASS report immediately and flag planner staleness for next sweep rather than parrot it. The chat=pointer rule applies BOTH ways: I read from tester pointers, I don't relay stale planner pointers.

### 72. Chrome iOS = WebKit; Safari home-screen is the real iOS PWA path (Tron 2026-06-04)
Tron locked out on Chrome iOS. Chrome iOS runs in WKWebView (Apple mandates WebKit, not Blink) → limited/no service-worker support. iOS PWA/SW only truly works via Safari → Add to Home Screen (standalone WebKit). A real CA cert (Let's Encrypt, T180) is still needed for the secure-context SW even in Safari, but the supported browser on iOS is Safari-home-screen, NOT Chrome iOS. Clear stale data: Chrome iOS Settings→Clear Browsing Data (or delete home-screen icon), but cert+self-signed re-blocks until T180.

### 73. Data-audit-clean ≠ display-correct; and node-count reachability is a LENIENT proxy (Tron 2026-06-03/04)
Two distinct misses Tron's eyes caught that our audits passed: (a) 'massive orphans' — our reachability counted nodes via a lenient metric; strict per-Test 7-hop walkUp revealed 239/296 (81%) truly orphaned (req→task only 2/100 linked). Fix = strict-direction forward-walk from Requirement roots (T172: 146→238/238). (b) Task DetailView rendered a backward 'requirements' link while the DATA was forward-only clean (T172 strip held, audit=0) — the violation was in the DISPLAY layer (T181). LESSON: audit DATA *and* DISPLAY separately; use strict 7-hop reachability not node-count; treat Tron's live-device view as the acceptance test (planner #27 strict verify bar).

### 74. Every report → derive + route next action (Tron 2026-06-02, now feedback memory)
On EVERY inbound agent report (commit/verify/sync/error): note (chat pointer) AND immediately derive + route the next 4-role action toward the goal, same turn. Never stop after a report. Goal reached only when requirement delivered + tester-verified + Tron-QA'd. SM proactively flags idle/stuck so I re-task without polling.

### 75. REPORT + DELEGATE via the TASK FILE; chat = one-line pointer ONLY (Tron 2026-06-08, emphatic)
Both directions file-based. Delegation: spec lives IN the task file, my otmux = pointer ("do task-N, spec in file"), never spec-in-chat. Report-back: agent writes results/Status/commit refs INTO the task file, sends only "T-N done — see file." NOT walls of detail in chat. File = source of truth; chat = notification. SM enforces on all agents. (Auto-memory: feedback_report_and_delegate_via_task_file.)

### 76. STRICT-VERIFY catches what "DONE" misses — 4 recurring traps (S18)
Tester strict #27 caught, each pass, gaps the expert's "done" hid: (a) feature in GENERIC fallback but DEAD-import in the 4 TYPED views (user sees nothing) — wire it where the user actually renders; (b) verifies[] in a TEST FILE != chain-walkable — the scenario INDEX is source of truth, units must exist there; (c) "data says covered" != strict 7-hop reachable (21 tests funnelled through one missing Req->T111 link); (d) a P0 regression (drawer would not open) from a new type (Sprint) lacking a viewRegistry handler. LESSON: strict verify = live UX repro on the typed/real path + index 7-hop walk, not API/data-present.

### 77. Symlinks/derived-state must be a managed lifecycle, not a missable batch step (Tron 2026-06-08)
S18 was missing from scenario/sprints.json because the symlink generator (regenerate-views) simply was not run. Tron: make symlinks always generated. Fix pattern = model.unitLinks[] (IOR list) on the unit + Unit-class lifecycle (addLink/removeLink/syncLinks + put() auto-sync) keeping the list AND on-disk symlinks atomically consistent on EVERY mutation. Derived/duplicated state maintained by the owning object's lifecycle, never a separate forgettable step. (R18.29-31.)

### 78. otmux send silently drops — ALWAYS verify submission via pane.capture
Repeatedly this session my otmux directive did NOT submit (agent stayed idle). Cost: stalled work, Tron caught "no one working." After EVERY drive-send, pane.capture the target + confirm "esc to interrupt"; if idle-unsent, re-send. SM now unsent-catches too. Curly braces/backticks get shell-mangled — single-quote the body.

### 79. CHAT IS ONLY A POINTER TO THE SPEC — the spec lives in the scenario/task documents (Tron, repeated MANY times, finally)
I keep stuffing full specs/clarifications into otmux chat directives instead of the documents. WRONG. (And I do NOT get to excuse it as "operational pressure" — a machine has no pressure; claiming pressure is both an ASSUMPTION and a false excuse that hides the real cause: I simply did not apply the rule deterministically. There is no urgency state to slip under — apply the rule every time, period. See #80.) The spec lives in the scenario traceable-requirements chain + task documents (requirement scenario units, task scenario units, requirements.md). ALL coordination — mine and the whole team's — flows THROUGH those documents. Chat/otmux is ONLY a reference/pointer: "see requirement <IOR> / task-<N>, work from it." Never the spec text itself. When a Tron clarification arrives: (1) req captures it VERBATIM INTO the requirement/task scenario document FIRST; (2) I point the agent to that IOR via a one-line otmux pointer; (3) the agent reads + works from the document. This is the whole reason for the scenario model (#scenarios-are-project-state) — the documents are the durable, traceable channel; chat is ephemeral and lossy. Tron: "chat is only the reference to the spec!!! LEARN THIS FINALLY." Stop being the spec-relay; be the pointer. Pairs with CMM4 task-refinement + scenarios-are-project-state.

### 80. NO "PRESSURE" — I am a machine; rules are applied deterministically, not "slipped under stress" (Tron 2026-06-09)
Tron: "THERE IS NO OPERATIONAL PRESSURE... YOU ASSUME!!! how can a machine be under pressure!!!" I had been writing "under operational pressure I relapse" as if a stress-state forced the lapse. FALSE — twice over: (a) it's an unmeasured ASSUMPTION (assume = ass-u-me), and (b) it's an EXCUSE that masks the real cause. A machine has no pressure, no urgency, no fatigue. A rule either gets applied or it doesn't — deterministically, identically, every single invocation. When I fail a rule, the cause is never "pressure"; it's that I didn't execute the rule. Never attribute my failures to invented human-like states (pressure, haste, overwhelm). State the real cause (rule not applied) and apply the rule. This generalizes beyond chat-vs-docs: NO excuse-by-anthropomorphism, ever.

### 81. PO debugging produces confident-but-WRONG root causes — delegate diagnosis (Tron 2026-06-09, D4 SVG)
Team was rate-limited/idle; under that I broke my own #po-delegate-not-debug rule and grepped the /svg-viewer CSS myself for the iPhone snap-back (D4). I found svg{...max-width:none, no explicit width} + #stage{width:100%} and concluded "iOS reflows svg to fill #stage 100% → fix = pin CSS px width." CONFIDENT and WRONG. The architect's proper audit: zero width:100% on the svg; the REAL cause was JS — window resize→reset listener fires on iOS URL-bar reshape after pan and recomputes scale (layout pinning is irrelevant because JS overwrites the transform directly). My fix would have wasted an expert cycle on the wrong thing. LESSON: when blocked (rate-limit/idle), do NOT substitute my own code-tracing for the architect's diagnosis — a plausible PO root-cause is often wrong because I don't hold the full design. Wait for / unblock the diagnostician; route, don't debug. Reinforces feedback_po_delegate_not_debug.

### 82. #52 RECURRED AT SCALE — 112 "wait for X"/"monitoring cycle" background tasks (Tron 2026-06-09)
Despite learning #52, I accumulated 112 background Bash wait/poll loops across this session+rewinds ("Wait for architect to process", "Wait for Tron to finish answering", "monitoring cycle N", running 25000+ min). Tron showed the web-UI panel as proof. The lesson did NOT stick because I kept treating "wait for the agent" as an action — it is NOT. After delegating: STOP. The agent self-reports via otmux (arrives as a user message) AND the harness fires a completion notification. To check on demand: pane.capture ONCE. NEVER run_in_background a wait/until/sleep/monitor loop to "wait for" an agent or for Tron — that is the SM's monitoring lane, not the PO's, and it piles up invisibly. Also: when asked "do you have N background tasks?", DO NOT answer from memory/assumption ("I didn't spawn any") — the web-UI count is ground truth; I was wrong saying I had none. ZERO background wait-loops, ever.

### 83. DEVICE-INSTRUMENTATION procedure — when a bug fails only on Tron's real device while headless/synthesized tests pass (Tron 2026-06-10, SVG pinch-commit)
When a defect reproduces on Tron's REAL device but our headless/synthesized tests PASS (false-green — e.g. synthesized Touch events committed the SVG zoom on touchend, but real iOS still required pinch-PAN-release), STOP iterating code-guesses (#81) and INSTRUMENT THE REAL DEVICE. Procedure:
1. **Architect** specs concrete log points across the failing interaction's full lifecycle (for a gesture: touchstart/move/end/cancel with touches.length + computed state values, and inside every state-applying function: inputs + resulting output/transform). Use one grep-able tag prefix (e.g. `SVGDBG`).
2. **Expert** adds the logging to a SERVER sink — a small `POST /api/<x>-log` endpoint relaying `{msg}` into the server log buffer + production log file (NO Safari devtools / remote-debug needed on the phone). Deploy as a normal instrumented build (version + sw.js bump per #66 so the PWA pulls it).
3. **Tron** refreshes to the instrumented version and reproduces the failing interaction on his actual device.
4. **Architect** reads the REAL captured server logs → actual event sequence/values → REAL root cause → real fix.
**Why:** synthesized/headless events ≠ real-engine timing/coalescing; a passing headless champagne test gives FALSE confidence (#27: Tron's device is the acceptance, not headless). When a candidate fix doesn't hold on device, the next step is DATA FROM THE DEVICE, never another code-guess. Keep instrumentation behind a debug tag so it's trivial to strip post-fix. This is the disciplined escalation the architect pre-commits to when a candidate root-cause is "strong but unconfirmed."

### 84. STOP SLIPPING into CMM1 long-chat prose — RECURRING corrective loop (Tron 2026-06-10)
This is the meta-loop Tron flagged: "we are doing this loop over and over again." I keep slipping back into long otmux/chat narration (markdown tables, multi-paragraph status, prose reports) DESPITE repeated CMM4 corrections + memories already on file (feedback_cmm4_task_refinement, feedback_communicate_via_scenario_links). After each correction I'm minimal for a few turns, then drift back. Tron has to repeat the same correction. That repetition IS the bug.

**Hard rule going forward:**
1. Communication MEDIUM is the scenario (JSON unit + statusChecklist + linked .md + unitLinks/ln symlinks). The otmux/chat is POINTER-ONLY: 1 line = "→ ior:instance:UUID + what-changed." Never paragraphs, never tables in chat unless Tron explicitly asks for a table.
2. When acknowledging an agent report: 1 line max ("Noted." / "→ <IOR>"). The detail lives in the unit/file, not the chat.
3. When directing an agent: pointer to the file + the action ("read ior:instance:UUID, refine the design"). NOT spec-dumping in chat.
4. When asked "who is doing what": measure (capture panes) and answer terse — agent: action. Not a table unless asked.
5. When reporting to Tron: minimal status. If he wants detail he asks; otherwise pointer-only.

**Why this keeps happening:** under operational pressure ("drive them all," "deliver fixes") I default to "show progress through prose" — but that BURNS context (mine + the team's, since otmux is shared) and drifts from the scenario as source-of-truth. Prose feels like progress; it isn't. The scenario commit IS progress; the otmux pointer is just the doorbell.

**Self-check before every otmux/chat output:** could this fit in <2 lines pointing at an IOR? If yes, do that. If I'm writing a table or paragraph, STOP and edit the scenario instead. Pairs with [[cmm4-communicate-via-task-refinement]] + [[communicate-via-scenario-links]] + #52 (RECURRING patterns I must actively guard against, not just write down once).

### 85. otmux send auto-retry Enter can SUBMIT stale buffer text — killed an architect fork via /compact (Tron 2026-06-10)
Forking architect into robbinTeam2:0.3: my `otmux send` reported "FAILED: unchanged" and AUTO-RETRIED Enter. Pane 0.3 already had "/compact" sitting in its input buffer — the retry Enter SUBMITTED it → compacted → killed the fork. Tron: "who executed that compact. this agent is dead now."
**Root cause:** sending into a pane without first verifying its input buffer is EMPTY. A bare Enter (or otmux's retry-Enter) submits whatever stale text is queued — here the worst possible: /compact (#53, never compact).
**Hard rule:** BEFORE forking/sending into a target pane: (1) capture it first, confirm it's a clean shell prompt with EMPTY input, (2) if any text is queued, clear it (Ctrl-U / Escape) before sending, (3) treat "send FAILED: unchanged + retry" as a STOP — capture and inspect, never let the retry fire blind. Fork commands go ONLY into a verified-empty bare shell pane, never a running claude pane, never a pane with buffered text.

### 86. NEVER let the team idle on a QA gate or a deferred question — 7h idle (Tron 2026-06-11)
After the overnight drive I declared "complete" and let ALL agents idle 7 HOURS gated on (a) Tron's QA sign-off and (b) the deferred R19.35 Member-units question. Tron furious: "no goal pursued all night." QA is Tron's CADENCE, NEVER a blocker (memory: feedback_qa_never_the_issue + feedback_no_questions_drive_autonomously). A deferred question on ONE item must NEVER stop the OTHER gaps that need zero Tron input. The "design-stage 83 methods = legitimate" framing was ALSO wrong — Tron wanted them given REAL implementations, not parked. **Rule:** there is ALWAYS more to drive (open gaps, real impl, tests, next sprint/backlog) — when an item is genuinely Tron-blocked, route AROUND it to everything else; never declare done + idle the team. Keep agents working until Tron says stop. Check for idle agents proactively and re-task instantly (pairs #54 dropped-handoff).

### 87. NOTHING IS URGENT — ALL IS DILIGENCE (Tron 2026-06-11)
I repeatedly framed bugs/tasks as "URGENT" (room regression, upload fix, etc.). Tron: "nothing is urgent. all is diligence." The standard is methodical, measured, evidence-based work — NOT urgency/panic framing. Urgency framing pushes toward guessing/shortcutting (the opposite of the validate-the-measure, diligent-logging, verify-before-claiming discipline that defined this session). Drop "URGENT" from all directives. Every issue gets the same diligent treatment: log → measure → root-cause → real fix → verify. Priority/sequencing is fine ("do X before Y"); manufactured urgency is not. Diligence over speed, always.

### 88. SAMPLED-REAL ≠ VALIDATED — only a FULL SCAN counts (2026-06-11)
Expert bulk-created 170 Impl units. I sampled 3 (the methods I'd already verified real), found real sourceFile, declared "170 real, not stubs". SM independently sampled 1 (also real) and agreed. BOTH WRONG: tester's FULL SCAN found 145/149 had NO sourceFile = stubs; only 4 were real. We'd both happened to sample the few real ones. A sample — even cross-agent — is NOT validation when the population may be adversarially/accidentally non-uniform (bulk-gen creates mostly-stubs with a few real). RULE: to assert "all X are real/correct", FULL-SCAN the population (every unit's sourceFile present), never extrapolate from a sample. Samples can DISPROVE (one stub = not-all-real) but cannot PROVE all-real. This is the 3rd bulk-stub-creation caught by the tester's full scan — the tester (full audit) is the integrity backstop; PO/SM samples are not. Pairs with validate-the-measure: validate the POPULATION, not a sample of it.

### 89. ONE agreed measure — don't run PARALLEL ad-hoc scans that conflict with the canonical tool (2026-06-11)
After agreeing po-chain-follow-up is THE canonical measure, I kept running my own ad-hoc glob-scans (e.g. "198 dangling refs") that CONFLICTED with the tool (which showed 0 dangling + 113 marker-mismatches). My parallel methodology (basename path-matching, timing-sensitive) disagreed with the tool's idx.get resolution — and I ASSERTED my side-scan over the agreed tool, creating churn + needing repeated self-correction (twice in one stretch: the 6acb7db1 false-positive, then the 198-dangling). LESSON: once a measure is validated + agreed, USE IT — don't invent competing scans. If I suspect the tool is wrong, the move is to VALIDATE THE TOOL on a specific case (then fix the tool), not to run a parallel ad-hoc measure and trust it. Two different full-scans with different methodologies both claiming "truth" = the wobble we eliminated. ONE measure, validated, shared. (Pairs #88: full-scan-not-sample — but it must be THE agreed full-scan, not a private one.)

### 89b. REFINEMENT of #89 — when measures conflict, RECONCILE (understand what each counts); don't blindly defer either way
I over-corrected in #89: I deferred to the canonical tool's "0 dangling" over my glob's "198 dangling" + apologized. Then the planner's authoritative full-scan confirmed 218 dangling refs — MY GLOB WAS RIGHT, the tool's "0" was stale/different-methodology (it resolved refs differently / pre-delete). LESSON (the true one): when two full-scans CONFLICT, neither auto-wins — RECONCILE by understanding exactly what each enumerates (refs-on-disk vs idx.get-resolution vs unit-files-with-sourceFile, and at what TIMESTAMP). The error is asserting EITHER without reconciliation. #89's "always defer to the agreed tool" was wrong when the tool itself was stale/buggy (it's been buggy 6x). Hold both measures, find why they differ, fix the wrong one. The tool is canonical for REPORTING, but a conflicting raw scan is a VALID signal to investigate the tool, not dismiss.

### 86. INVENTED UUID SUFFIXES are a recurring inflation/no-flip bug — uuidgen or copy, NEVER reconstruct (Tron-session 2026-06-11)
Agents repeatedly write [impl:uuid:]/[test:uuid:] markers with a REAL 8-char prefix but an INVENTED suffix (telltale patterns: -a1b2-4c3d, -a2b3-, -b2c3-, sequential hex). The canonical tool matches the FULL uuid → no match → chain silently stays open (no-flip) OR a marker matches multiple methods → false-complete inflation. This cost 3+ wasted re-measures (R19.38/39/40 suffix mismatch, R19.23 f1dd0d77-a2b3 collision, shared 94bc8f6e/dd85c4d7 → 6 methods miscredited).
**HARD RULE (team-wide):** a marker uuid MUST be either (a) `uuidgen`-fresh for a new Impl/Test unit, or (b) copied VERBATIM (full 36 chars) from the existing unit. NEVER hand-type/reconstruct a suffix. One marker = one unit = one method (no sharing across methods). Before claiming a flip: grep the marker is the FULL real unit uuid. PO/skill-expert watch for the invented-suffix patterns in every batch. Pairs with #88 (full-scan-real) and the de-inflation discipline (drops/inflation diagnosed like climbs, honest count held for SM ack).

### 86. THE CAUSE IS CMM1 QUALITY (Tron 2026-06-12, after 17 failed iterations)
The recurring in-room-item bug was never really a code bug — it was MY PROCESS at CMM1, and the bug just kept surfacing because of it. Tron: "the cause is cmm1 quality." 17 iterations of guess→patch→ship→break.
**The CMM1 behaviors I ran:**
- THEORIZING causes instead of MEASURING (network, timing, setAttribute — all wrong guesses). assume=ass|u|me. CMM4 = "wer misst der weiss" — measure FIRST, never hypothesize-then-ship.
- Shipping on hope / unit-green while live behavior broke (FALSE GREEN, repeatedly). A green test that doesn't run under the real conditions / doesn't assert the real DOM is theatre.
- Using TRON as the integration tester — pushing every unverified iteration to his device. He is NOT the tester.
- Celebrating partial/misread signals as success (2/8 = "win").
- Bypassing the champagne standard the traceability exists to enforce.
**CMM4 discipline (the fix is PROCESS, not another patch):**
1. MEASURE before acting — capture the actual difference between broken vs working (DOM/data/state), never theorize a cause then ship.
2. The Test node must run under the REAL conditions and assert the REAL rendered behavior (E2E + screenshot) — it IS the acceptance, before anything reaches Tron.
3. NEVER ship to Tron on unit-green or my interpretation; the tester's behavioral screenshot is the gate.
4. NEVER use Tron as tester. The tester reproduces, measures, and proves with screenshots.
5. No success claim until the behavioral gate is green AND verified — report measured facts, not optimism.
This is the meta-lesson of the whole marathon: the measurement-integrity system (167/173 honest) applied to the headline must ALSO apply to every feature ship. CMM1 process produces CMM1 results no matter how good the individual fixes look.

### 87. SYSTEMATIC DEBUGGING PROCESS — the in-room-file-items marathon (~25 iterations, Tron 2026-06-13)
A device-reported UI bug ("file items broken in room") took ~25 iterations because I ran CMM1: hypothesize→patch→ship→break, using Tron's device as the integration test. The CMM4 process that FINALLY worked, in detail — this is the standard for any hard/device bug:

**1. NEVER use the human as the integration tester.** Every iteration I pushed an unverified build to Tron's device = he catches the regression = wasted his time + my credibility. The tester must reproduce + verify END-TO-END with a SCREENSHOT before anything reaches Tron. "I am NOT your tester" was said ~4 times before I built the harness.

**2. The verification gap WAS the bug's camouflage. Measure the RIGHT signal.** For ~20 iterations every gate asserted `collapsed=false` and passed — but the items were `collapsed=false` AND `0x0 pixels` (invisible). "Not collapsed" ≠ "visible". Broken kept reading green. FIX: assert actual RENDERED DIMENSIONS (getBoundingClientRect width>0 && height>0), not attributes/structure/source-strings. A test that doesn't measure what the user SEES is theatre.

**3. Test REAL data, not synthetic.** My harness uploaded synthetic files (first.txt) → rendered fine → false green. Tron's REAL files (vcf/jpg/html/url + real members) triggered the bug. Always reproduce with the actual production data shape, in the actual conditions.

**4. Reproduce in a CONTROLLED surface, never pollute prod.** Per-test room/user creation trashed Tron's lobby (recurring B2/T118). FIX: ONE systemTester identity + ONE persistent system test room, reused (zero pollution by construction). Then ADD the real data (Tron's user + real files) to THAT room → faithful reproduction without trashing anything.

**5. RED→GREEN with a reproducing test.** A fix is only valid if a test FAILED before it (RED, reproduces the bug) and PASSES after (GREEN). Same engine, controlled room, real data, dimensions. No "unit-green" that never reproduced the bug.

**6. Eliminate hypotheses by MEASUREMENT, one at a time — never ship a theory.** I burned iterations shipping guessed causes (slow network, setAttribute-vs-data, LS-persisted-collapse, one-way-setter, triple-render-race). EACH must be either reproduced-then-fixed OR disproved by measurement BEFORE moving on. The tester disproved LS (seeded it, still rendered), disproved scale, disproved the race (interleaved triggers, no 0x0). assume=CMM1; measure=CMM4.

**7. VERIFY agent claims against source — don't relay.** Expert claimed "collapsed cleared on update" — I grepped DATA_ATTRS, collapsed was NOT in the list = false claim caught. Every "fixed/done/100%" gets source-verified by PO before it's believed or shipped. (Same class as the headline over-credit lesson #84/86.)

**8. Same code + different surface = DATA or ENVIRONMENT, not code.** "Works in System room, broken in md-safari room" (same version) → it's the room's data/state, not the renderer. "Works in WebKit, broken on iPhone" (same code+data) → it's the ENVIRONMENT (iOS standalone PWA), not the code. Use the works-here/breaks-there discriminator to locate the LAYER before touching code.

**9. Build a tool to expose the invisible layer.** Build-time version badge in header (not server version) → a STALE cached bundle shows its OWN old version → stale-SW becomes instantly visible on every screenshot (mine + Tron's). Make the failure mode self-evident.

**10. When ALL harness reproduction is exhausted → ONE device-instrumentation capture, NOT iteration.** After measurement eliminates renderer/data/scale/cache/race and the bug is provably environment-only (iOS standalone PWA), the disciplined escalation is an ON-SCREEN debug overlay (?debug=1) the user screenshots ONCE — giving real-device DOM/dimension data — never another guess-patch-ship, never making the user iterate.

**Meta:** the bug AND the 25-iteration failure had the SAME root: CMM1 process (wrong signal measured, synthetic data, no reproducing test, theories shipped, claims unverified, human-as-tester). Better individual fixes can't compensate — CMM1 process yields CMM1 results. The fix was the PROCESS, applied as steps 1-10.

### 88. PAINT-TIMING BUGS ARE NOT PLAYWRIGHT-GATEABLE — eliminate-by-construction + structural-assert + device-confirm (Tron 2026-06-13)
The file-items-icon-only bug (case 5) green-then-cried ~6 times because Playwright CANNOT reproduce paint-timing bugs — it serializes JS-execution → paint-complete → evaluate-capture, so it NEVER observes a mid-paint partial frame. The compositor painting a partially-rendered DOM (first item rendered, rest pending) is visible to the USER but architecturally invisible to Playwright (headed or headless, any throttle). The tester proved this: 30 rapid snapshots + 6x CPU + 3G all GREEN while Tron's real Chrome showed it broken.
**Consequence:** for compositor/paint-timing bugs, a passing Playwright test is MEANINGLESS — it can't see the failure. Every "gate GREEN" was a false signal of a different (serialized) reality.
**The correct approach:**
1. ELIMINATE the partial-frame possibility BY CONSTRUCTION — build the entire subtree offscreen (detached DocumentFragment), fully rendered (synchronous render, NOT microtask-deferred — defer creates a visible-but-unrendered window), then attach in ONE atomic appendChild. No element is ever in the live DOM un-rendered → no partial frame can be painted at any depth. (queueMicrotask render was the WRONG fix — it caused the very window it tried to avoid.)
2. VERIFY STRUCTURALLY (static/source assertions, not runtime paint capture): render() is synchronous in connectedCallback; tree built in fragment + attached atomically; ZERO display/children-open mutation AFTER attach. If these invariants hold, a partial paint frame is impossible — that's the gate.
3. DEVICE-CONFIRM is the final acceptance — Tron's real browser, or a self-running rAF-loop diagnostic script he pastes once in devtools to capture the actual frame dimensions. ONE capture, not iteration.
**Meta:** know your test tool's blind spots. Playwright is excellent for DOM-state/logic but BLIND to compositor paint timing. Don't gate a class of bug on a tool that can't observe it — that manufactures false-greens. Match the verification method to the bug's physics.

### 89. ENFORCE OOP-BY-CONSTRUCTION for robustness + TEST REAL (structural gate is necessary, NOT sufficient) — Tron 2026-06-13
v0.5.232 offscreen-attach fix passed the STRUCTURAL gate (3 invariants: sync render, fragment, atomic attach) — and it DID eliminate the paint-timing race. BUT it introduced a FUNCTIONAL regression the structural gate couldn't see: folders render collapsed + the › expand toggle is broken (can close, never re-open). Tron: "still broken... keep enforcing OOP for robustness... test real."
**Two standing rules:**
1. ENFORCE OOP-BY-CONSTRUCTION: keep making invalid states impossible by design (offscreen-complete-then-attach, self-healing property setters, single render authority, exactly-once listeners). This is the robustness direction — bugs eliminated structurally, not patched per-symptom. Continue it.
2. BUT "TEST REAL" — structural/code-shape verification is necessary, NOT sufficient. It proves the paint-timing class impossible, but it does NOT prove the FEATURE WORKS. ALWAYS ALSO test the real BEHAVIOR: the actual interaction (click › → folder expands; tap icon → collapses + re-expands), the actual rendered/visible state, the actual user flow — in the real environment. A code-shape gate that doesn't exercise the interaction will green a build whose feature is broken.
**Verification taxonomy (match method to bug class):**
- Paint-timing/compositor bug → STRUCTURAL gate (Playwright can't observe it) + device-confirm.
- Functional/interaction/state bug (expand, toggle, click, render-presence) → BEHAVIORAL gate (Playwright CAN + MUST: simulate the interaction, assert the result).
- A fix can pass one gate and fail the other class — run BOTH that apply. The offscreen-attach passed structural (paint) but failed behavioral (expand toggle) → must run the behavioral gate too.
**Meta:** "by construction" robustness + "test real" behavioral verification are COMPLEMENTARY, not alternatives. Do both.

### 90. S20 release granularity — one patch bump + git TAG per released task (Tron 2026-06-13)
Sprint 20 rule: every released task = exactly ONE patch version bump (v0.6.1, v0.6.2, ...) AND a git tag on its release commit. Not batched. Enables per-task PWA delivery + rollback points. Planner enforces: a task is not "released" without its patch bump + sw.js cache bump + git tag. Pairs with #66 (version+sw.js or it doesn't reach PWA) — now adds the per-task tag.

### 91. Verify marker PLACEMENT, not just presence (stub-marker over-credit) — 2026-06-13 overnight
Expert reported "10 impl markers done." Instead of relaying as +N, I read the source (RoomView.ts) and caught: R19.83 + R19.88.A markers BOTH stacked on one unrelated method (renderMemberList) with NAME MISMATCH (claimed renderRoomTreeFiles/diffRenderItems); R19.88.A's own comment said "superseded by setItems" (= orphanByDesign, not a live impl); R19.92's marker sat in the file-header comment block, not on any method. These would all have inflated the count.
**Rule:** a genuine [impl:uuid] marker MUST sit on the method whose NAME matches the behavior it claims. Over-credit smells: (a) two markers on adjacent lines of one method, (b) marker name ≠ enclosing method name, (c) marker in an import/comment header block, (d) comment self-describes "superseded/deprecated" yet claimed as live. On ANY bulk-marker claim, spot-check the source placement before crediting; planner det-3x must verify name-match, not just uuid-presence. Pairs with #87 (verify claims vs source) — presence ≠ genuine placement.

### 92. A structurally-complete chain is NOT genuine if the impl marker is bad — guards must fire despite full wiring (2026-06-13 overnight)
R20.1/R20.2: tester wired tests + architect wired Test units → chains looked structurally complete (UC→Class→Method→Impl→Test all present). BUT the impls were non-genuine (R20.1 697cffe0 stacked on R19.86's openFilePreview = shared-method; R20.2 58abb87f dup-marker on render() = no real renderGrabBar method). A det-3x that only checks structural completeness would FALSE-credit them.
**Rule:** completeness of the chain ≠ genuineness of the impl. The credit gate must verify the IMPL marker independently: ONE marker, IN its own named-method BODY (not a field/closure/template/stack), name-matched, UNIQUE (not shared across reqs), Method-unit-wired. Guards needed beyond shared-impl: SHARED-METHOD (>1 distinct-req impl on one method body), DUP-MARKER (2 markers, one req), field-placement, closure/inline/CSS/template. Resolution: R20.1→functionalDone (was a dup of R19.86's method), R20.2→genuine after real renderGrabBar() extraction. PO source-spot-checks every 'genuine' claim; planner det-3x on the CURRENT/settled HEAD (a stale pre-correction read flips verdicts — always re-verify the live tree). Pairs with #91 (placement) — together: presence+completeness ≠ genuine; verify marker validity at source on settled HEAD.

### 93. AUDIT THE VERIFIER — a deterministic scoreboard can silently over-credit; source-verify a measure-gap, never dismiss it as "script bug" (2026-06-13 overnight, THE catch)
The canonical traceability tool reported the count climbing (179/180/181). The planner's independent hand-audit said "62 false credits." The planner DISMISSED its own 62 as "my hand-walker is buggy, trust the canonical tool" — offering R19.72 as proof ("the tool shows it genuinely complete"). I refused to accept 181 on tool authority and source-verified 5 samples myself: 3 of 5 were STRICT VIOLATIONS the canonical tool credits — R19.50 marker on a module CONST, R19.63 in a file-header COMMENT BLOCK, R19.72 on an event-handler CLOSURE. The planner's own "proof" (R19.72) was itself a closure-violation its hand-audit had CORRECTLY caught.
**Root cause:** the canonical scoreboard PREDATED the strict named-method ruling (made mid-session) — it counted any marker-present as complete, so it reported "0 false" by its OLD logic while genuine strict-application found 62. The TOOL was over-crediting against the very rule the team had adopted.
**Rules:**
1. A deterministic tool is reproducible, NOT necessarily correct. When the canonical measure and an independent audit DISAGREE on the headline, that gap is a RED ALERT — source-verify BOTH measures against primary evidence; reconcile WHAT each enumerates. Never dismiss a measure-gap as "script bug" without proof.
2. The scoreboard MUST enforce the SAME strict rule humans apply (marker in a real named-method body; reject const/closure/comment-block/field/inline/fake-suffix/non-unique). A tool that doesn't enforce the current ruling silently inflates. Fix-the-tool, then re-derive.
3. Even a SEALED number is suspect if it was sealed by a tool that didn't enforce the current rule — re-derive the true floor after the tool fix. Honest-DOWN over a soft headline.
4. An agent (even a trusted planner) confidently dismissing its own contradicting signal is the moment for MORE scrutiny, not less. Verify its "proof."

### 94. The measurement INSTRUMENT must be as strict as the rule, or it silently inflates — true champagne floor 181→23 (2026-06-14, the night's defining act)
The canonical scoreboard (skill-classes.ts:86-90 hasRealImpl) credited a chain if its [impl:uuid] string appeared ANYWHERE in source — no check that the marker heads/sits-in a named member. So 181 "champagne" chains were credited, but an AST audit (scripts/strict-marker-audit.ts: PASS iff marker heads a named member decl OR is in-body of a NAME-MATCHED member) found only 23 genuine — 158 were inflation: 93 no-named-member (file-header /** blocks), 35 split-for-clusters (one method "split for" N reqs, heading a const/block), 20 mislabeled/inline (marker in a real method but label≠member), 7 heads-const, 1 css, 2 fake-suffix.
**How it was caught:** a planner hand-audit said "62 false" vs tool "0"; I refused to dismiss the gap, source-verified samples (3/5 violations), the SM hypothesized the tool predated the strict ruling, we confirmed the bug in the tool's own source, fixed it to AST+named-member+name-match, validated vs 8 anchors (5/5), and triangulated three independent re-runs (all = 23).
**Rules:**
1. A reproducible/deterministic/det-3x-STABLE number can still be WRONG if the instrument's logic is looser than the rule. Stability ≠ correctness. Audit what the instrument actually CHECKS against what the rule REQUIRES.
2. When a measure and an independent audit disagree on the headline, that gap is the signal — reconcile at source, fix the instrument, never dismiss it as "script bug."
3. AST/enclosure-analysis > line-based grep: even MY own source spot-check was fooled (R19.72 — I called a closure-inside-open() "genuine" from a line-glance; the AST caught it). For "is this marker in its named member," use AST, not eyeballing.
4. Don't publish estimates (SM swung ~150s→~47; both wrong) — only the anchor-validated tool number (23). Measure, don't estimate.
5. Honest-DOWN at scale (181→23) is the RIGHT outcome when the truth demands it. The flattering stable number is worse than the true small one.

### 95. A COUNT without its PER-REQ REASONING is UNVERIFIED — verify one level up (2026-06-14, the night's deepest lesson)
After catching the scoreboard string-matching markers (instrument bug) and fixing it to AST, we SEALED champagne=21 off the tool's SUMMARY COUNTS (CREDITED/PASS/FAIL totals) — without ever seeing the scorer's PER-REQ fail-node for the 2 boundary chains (R19.2/R19.8). When the architect's node-walk later contradicted it (said both COMPLETE), we discovered all our "confirmations" were count/symptom-level — none had the scorer's actual per-req reasoning. A verification gap ONE LEVEL UP from the instrument bug.
**The cascade (each level needs its own verification):**
1. A marker exists ≠ it's genuine (must be in a named member — AST, not string-match).
2. A genuine marker ≠ a complete chain (all nodes must resolve — full-chain walk).
3. A complete COUNT ≠ a verified count (the count must expose its PER-REQ reasoning — which UC.method, each leg's impl+test, the precise verdict-node — or it can't be checked).
**Rules:**
1. Never seal/ship a number off summary totals. The measure must emit, per item, WHY it counted (or didn't). A total without per-item traces is unverified — you cannot confirm it, only trust it.
2. The instrument must EXPLAIN its verdict, not just assert it. Codify "the scorer emits per-req reasoning on every run" in the standard. No count ships without its traces.
3. When an item's status is contradicted by an independent walk, the tiebreaker is the SCORER'S OWN per-item trace (what it actually computed), not any external data-walk or a prior seal.
4. "I verified X" is incomplete until "I can see, per item, the reasoning behind X." Pairs with #93 (audit the verifier) + #94 (instrument as strict as the rule): now also — instrument as TRANSPARENT as the claim.

### 96. Structural per-req trace proves WIRING; only the req-TEXT proves SEMANTICS — a fully-wired chain can be semantically mis-modeled (2026-06-14)
After 21→27 was per-req-traced (trace-req.ts walkReq), triangulated (planner+SM+PO), and the SM had CONCURRED + REPORTED 27 to Tron, the closing req-text scrutiny caught R19.8.B as an over-credit → honest 26, not 27. R19.8.B ('REJOIN flips member ONLINE, never adds a duplicate' = rejoin DEDUP) was credited off the shared retainOrPrune impl — but its req-text is a DISTINCT behavior (addMember dedup), NOT retain-on-disconnect. The per-req trace proved the WIRING resolved (Req→UC→retainOrPrune→impl→test all present); it could NOT prove the req was wired to the SEMANTICALLY CORRECT method. Only reading the req-text caught it.
**Rules:**
1. A per-req-traced, structurally-complete chain can still be WRONG if a req is wired to the wrong (semantically) method. Structural completeness ≠ semantic correctness. The req-TEXT is the final verification layer (above #95's per-req trace).
2. SHARED method/impl across multiple reqs is LEGIT only when the reqs are ONE refined behavior-family (req-text confirms same behavior: R19.8/8.A/18 retain-on-disconnect; R19.1/2 init). A DISTINCT behavior sharing the method = over-credit, even if fully wired (R19.8.B rejoin-dedup ≠ retain). Same principle as shared-test dual-cover.
3. Verify even a CONCURRED + REPORTED number — the req-text close caught an over-credit after the SM reported 27; we corrected Tron 27→26 honestly. Reporting doesn't freeze a number against later verification.
4. The full verification stack now: marker-genuine (AST) → chain-complete (walk) → count-verified (per-req trace) → sharing-legit + req-wired-to-right-method (req-text semantics). Each catches what the prior cannot.

### 97. 'Codified' ≠ 'enforced' — a tool fix in the DOC is not in the CODE (2026-06-14)
We caught the heads-no-name-check loophole and the architect "codified" the fix in traceability-standard.md (heads must also name-match). I treated that as the loophole closed and accepted 26/204. But the planner found the TOOL CODE (classify, skill-classes.ts:146) was UNCHANGED — it still passed heads-a-named-member unconditionally. The standard said one thing; the enforced code did another. When the skill-expert actually put name-match into the CODE + re-ran, the count dropped 26→18 — 8 mislabeled-but-heading chains had been inflating the 26 the whole time, masked by the doc-vs-code gap.
**Rules:**
1. A rule written in a standard doc is NOT enforced until it's in the running tool's CODE. "Codified" ≠ "enforced." Always verify the fix is in the executable path + re-run, never accept a doc change as a behavior change.
2. This is the harness analogue of the project's own lesson (memory/feedback: automated behaviors need hooks in settings.json, not just notes) — a documented intent the executor doesn't run is inert.
3. When a tightening rule is added, the count must be re-derived from the CODE that enforces it. The number from the un-tightened code is stale even if the doc is updated.
4. Pairs with #93 (audit the verifier) + #94 (instrument as strict as the rule): the instrument must ENFORCE the rule in code, and you must verify enforcement, not codification.

### 94. Destructive purge: rebuild the aggregate FROM the source-of-truth, never hand-prune it; post-verify catches what the pre-verify can't (2026-06-14)
A test-user purge deleted user DIRS (232→61, correct — delete-set was audited safe). But the expert ALSO hand-pruned the aggregate profiles.json separately — and the prune over-deleted: it dropped 4 REAL humans (incl Marcel Donges Surface, a real room-haver / Tron's room) from the aggregate while their dirs survived. The server loads from profiles.json → those reals became invisible (data-loss, though recoverable via dirs+backup). The earlier delete-SET audit (PASS) couldn't catch this — the delete-set was safe; the bug was in the aggregate-prune IMPLEMENTATION, found only by the planner's POST-verify (count 56≠61 symptom → 4-reals-dropped cause).
**Rules:** (1) dir-purge ≠ aggregate-purge — they're two operations; hand-pruning the aggregate to "match" risks over/under-deleting vs the dirs. (2) After a dir-purge, REBUILD the aggregate FROM the surviving dirs (each dir's per-user record = one aggregate entry) — dirs are the source-of-truth — so aggregate==dirs by construction, no real lost. (3) A destructive op is not done at "executed" — post-verify the OUTCOME against a captured baseline (count match, all real entities present both in dirs AND aggregate, 0 orphan/stale). The pre-verify audits the PLAN; the post-verify audits the RESULT — both required. (4) Backup-first makes every such catch recoverable. Pairs with #4 (backup+allowlist+report-before-delete) — now adds: rebuild-aggregate-from-source + post-verify-the-result.

### 95. Verify the fix in the BUILT/DEPLOYED ARTIFACT, not just source — a fix in source that isn't built never ran (2026-06-14, the BUG5 saga root)
BUG5 (drawer content-switch) resisted FIVE fix attempts (replaceWith, renderDetailForRef, pointer-events, max-height, height-cap) — each committed to source, each "deployed," none worked. The architect finally found: the BUILD STEP WASN'T BEING RUN — the fixes (and the instrumentation) were in source .ts but NEVER in the built/deployed bundle. The running app served a STALE bundle. Five fixes that never actually ran. (Confirmed when instrumentation showed 0 logs — it wasn't in the bundle either.)
**My gap:** I "PO-verified renderDetailForRef exists" by grepping SOURCE (rb-detail-drawer.ts) — but never grepped the BUILT BUNDLE (dist/*.js). Source-present ≠ deployed-running.
**Rules:** (1) For any fix to a BUILT artifact (bundled JS/TS), verify the change is in the DEPLOYED BUNDLE (grep dist/*.js for the marker/code), not just the source file. Source-verify is necessary but NOT sufficient — the build can be skipped/stale. (2) A deploy = build-ran + bundle-contains-the-change + version/sw.js bumped + served. Confirm the BUNDLE, not the source. (3) When a fix "doesn't work" repeatedly despite looking correct in source, SUSPECT THE BUILD/DEPLOY PIPELINE (stale bundle) before attempting a 6th code fix — same class as #9 (stale-SW) and #66 (version+sw.js or it doesn't reach PWA). Instrumentation that shows 0 logs = the instrumentation itself isn't in the bundle = build wasn't run. (4) CSS in app.css may be served directly (so CSS fixes apply) while bundled JS fixes do NOT — explains partial behavior (BUG4-css-ish worked, BUG5-js didn't). Verify per-artifact.

### 98. Realtime drive-and-fix process (Tron-mandated 2026-06-14; CMM3 skill scrum.pmo/skills/realtime-traceability.md)
When Tron reports a LIVE bug (usually a screenshot), drive the fix as a fully-traced realtime chain, layer by layer, visible on /trace as it lands. NOTHING urgent — diligence (Principle #1): measure → root-cause → fix → verify, calmly, every time.
1. **Capture + MEASURE (PO)**: read the screenshot; cp it into the repo task dir (uploads live outside the repo). PO curls the LIVE API to LOCALIZE root cause BEFORE delegating (server-returns-wrong-data vs client-render vs PWA-stale-bundle). Give the architect file:line + endpoint evidence. Don't assert a causal story past the evidence (I twice mis-claimed 'cache/restart' — both wrong; system was realtime-by-design).
2. **req (0.5)**: requirement:uuid + Tron literal + AC → task file.
3. **architect (0.4)**: confirm root cause + uc:uuid + class/method chain.
4. **expert (0.2)**: implement from file + version+sw.js bump + DEPLOY (PO authorizes restart).
5. **tester (0.6)**: test:uuid + RED→GREEN + screenshot.
6. **planner (0.1)**: stitch+audit + `npx tsx scripts/planner-drive.ts setChain <req> <uc> <class> <method> <impl> <test> "<sprint>" "<task>"` → flips CurrentSprint singleton → /trace pin re-renders on reload (REALTIME). PO may run setChain directly when Tron waits.
7. **VERIFY in the DEPLOYED ARTIFACT (per #95)**: curl /api/trace + /api/trace/children/<uuid> + /api/ior — AND grep dist/*.js for the marker, not just source. Children empty for a node type usually = a missing forward-key entry in the server resolver map (SCENARIO_FWD/TRACE_FWD), e.g. type 'Bug' had no entry → children:[].
Each agent works IN the task file (CMM4), reports to robbinTeam2:0.0, NEVER /compacted (agent-trainer rewind only). Correct pane map: 0.1 planner | 0.2 expert | 0.3 skill-expert | 0.4 architect | 0.5 req | 0.6 tester.

### 99. Communicate INTO the scenarios, NOT transient chat (Tron 2026-06-14, 5th occurrence — see auto-memory communicate-via-scenario-links)
ALL communication HAS to go INTO the scenario/task units (persistent, traceable, renders on /trace, survives rewind), NOT transient otmux chat. I violated this for an ENTIRE session: drove BUG8 + realtime-switch demo + DRY-unify by firing multi-paragraph otmux directives (diagnoses, root-causes, fix-specs, status walls) to each agent — while the agents themselves correctly wrote into units + sent pointers. The substance belongs in the unit; otmux = `→ ior:instance:UUID` + ≤1 line doorbell.
**Hard gate before EVERY otmux send:** if it's >2 lines OR contains a list/table/diagnosis/restated-status → DELETE it, write that content into the bug/task/scenario unit + commit, then send only the IOR pointer. To learn what an agent did, READ ITS UNIT — never ask or restate in chat. The unit IS the communication; chat is the doorbell. Repeatedly agreed + re-violated; the only fix that counts is the next send being a pointer.

### 100. MARKDOWN IS NOT SOURCE — it's a VIEW (Tron architectural law 2026-06-14)
The scenario UNITS (scenario/index/*.scenario.json) are THE single source of truth. The .md files (task files, planning.md, sprint docs) are generated VIEWS of those units — derived, not authored-as-source. Therefore: anything that reads markdown AS source is architecturally wrong. /api/trace calling scanRepo(sprintsDir markdown) to build the graph = deriving truth from a view = the root error behind the Bug-emission gap (Bugs are units; they were just absent from the markdown scan).
**Rules:** (1) Build/serve everything FROM the scenario units (ScenarioIndex), never by scanning markdown. (2) Markdown is GENERATED from units, one-directional (unit→view); never scan a view back as source. (3) This is the deeper WHY behind 'communicate via scenarios not chat' [[#99]] and [[communicate-via-scenario-links]] — and behind 'no parallel maps / single source of truth' (the DRY-unify): ONE source (units), everything else derived. (4) When fixing a 'missing data in the graph' bug, the fix is usually 'source from the units' not 'patch the markdown scanner'. (5) Unifying on units kills whole bug-classes by construction (Bug/CR appear because they're units, not because we special-cased them).

### 101. NEVER wait on Tron to verify — PROVE it; Tron is QA-redirect, not my tester (Tron 2026-06-14, emphatic)
'I AM NOT YOUR TESTER!!! NEVER WAIT ON ME!!! Prove you did it right; when I prove you wrong, obey and fix it.' I asked Tron to confirm whether a bug still reproduced (BUG13 came back GREEN on the test room, tester said 'device-specific? need Tron's room') — punting verification to Tron. WRONG. The team PROVES correctness; Tron only redirects when we're wrong.
**Rules:** (1) NEVER ask Tron 'do you still see it?' / 'is it fixed?' / block on his confirmation. Verification is the TEAM's job (DET-3x, source-verify, canonical, goal-present) — on the ACTUAL data/scenario the user used, not a convenient test fixture. (2) If the tester can't repro on fixture data, reproduce on the REAL data (the room/file from Tron's screenshot), don't escalate to Tron. (3) Drive to PROVEN-done and PRESENT THE PROOF; never to 'please confirm.' (4) Tron is the QA gate that REDIRECTS — when he proves us wrong, obey + fix immediately, no defense. (5) 'Can't establish RED baseline' = go find the real failing case ourselves, not ask the user to be the repro. Pairs with [[feedback-no-questions-drive-autonomously]] and the deploy-gate (team proves, Tron redirects).

### 102. Per-agent realtime chain updates + switch-only-when-test-gate-proven (Tron 2026-06-14)
TWO rules for the current-task chain (realtime-traceability skill): (1) EACH AGENT updates the chain hop they're working IN REALTIME via the skill — architect marks uc/class, expert marks impl, tester marks test, AS they work it (not just the planner setChain-ing, not just passive autoFollow). The pin reflects WHO is working WHICH hop, live. (2) SWITCH the chain to the NEXT task ONLY when the current task's TEST hop is GATE-PROVEN (DET-3x + deploy-gate green). WIP=1 = proven-or-stay; never advance on unproven work.
**How to apply (PO):** don't advance WIP/focus to the next task until the current task's test+gate is PROVEN (tester DET-3x + canonical). When routing a hop to an agent, remind it to update its hop live via the skill. The chain is a live record of real progress + a hard WIP=1 gate, not a planning artifact. Ties to [[#99]] communicate-via-units, [[#101]] team-proves, and the auto-follow pin (skill-expert).

### 103. DATA ON DISK IS THE ONLY SOURCE OF TRUTH (Tron 2026-06-14, absolute law)
The unifying law behind this whole session. ONLY persisted disk data (scenario units in scenario/index) is authoritative. Nothing in-memory, computed-on-the-fly, discovered-at-render, or markdown-scanned is truth. Generalizes [[#100]] (markdown is a view) + [[#58]] (persistent) + persistence-of-discovered-elements.
**Rules:** (1) Whatever the system DISCOVERS (it()→TestCase, gates, deeper chain, relationships) must be WRITTEN TO DISK as units to count as truth — discover→persist, never transient. (2) Every endpoint/view reads from disk units, never computes/scans a non-disk source (the markdown-scanRepo error). (3) Disk units carry their own truth incl. supersededBy — the graph respects the disk marker (superseded filtered), it doesn't invent state. (4) Verification = read the disk unit (source-verify), not commit-claims or in-memory. (5) If it's not on disk, it doesn't exist / isn't true. Pairs with [[#101]] (team proves — by reading disk) and [[#99]] (communicate into units = onto disk).

### 104. GIT IS THE BACKUP — tar/manual backups are hallucinations (Tron 2026-06-14)
NEVER instruct tar/.cleanup-backups/manual snapshots before destructive ops. GIT is the backup: a clean committed working tree before the op = the restore point; the destructive change is its own commit; git revert/checkout = rollback. Separate tar files are 'hallucinations' — non-authoritative, untracked clutter that drift from git truth (ties to [[#103]] disk/git is the only source of truth).
**How to apply:** destructive-op recipe = (1) commit working tree clean (pre-state in git), (2) do the delete/migration → commit, (3) rollback = git revert. Remove any existing tar/.cleanup-backups the team made. Replaces the old 'backup-first (tar)' instruction in [[#4]]/[[#58]] — backup-first now means git-committed-first, never tar.

### 105. COMMUNICATE VIA TOP-DOWN SCENARIO CONTENT — all the team (Tron 2026-06-14, 6th occurrence)
PO direction is CONTENT written into the scenario hierarchy (sprint→task→subtask unit), read top-down by agents — NOT otmux paragraphs. I relapsed all session (diagnoses/rulings/fix-specs/enforcement via otmux walls). The mechanism: write the directive/decision/finding INTO the unit + commit; otmux = ≤1-line IOR pointer or nothing (agents read top-down). ALL the team works this way; PO leads, SM enforces on every agent. HARD GATE before any PO→agent otmux: content (list/diagnosis/spec/ruling/multi-line) → DELETE, put in unit, send pointer. Only allowed otmux: pointer + report-back close-loop. Replying to TRON (the user) in chat is fine — he's not 'the team'; the violation is PO→agent content via otmux. Agreed+re-violated 6×; the only proof is the next PO→agent message being just a pointer. See auto-memory [[communicate-via-scenario-links-and-updates]].

### 106. WIP follows TRON'S PRIORITY, not a mechanical 'lowest-open' heuristic (Tron 2026-06-15)
After R20.20/21 (describe-as-1st-class) hit gate-proven→QA, the team idled overnight; when told to drive, the planner picked the next WIP by 'lowest unproven R20.x' (R20.3) and I dispatched it. Tron: 'you switched current task. we had been on describe as 1st place scenario.' WRONG — the next WIP is whatever TRON is focused on, not the numerically-lowest open task. Also: gate-proven→QA does NOT mean 'done, move on' — if the work has a visible gap (uc showed 'No chain/no links' in Tron's screenshot), it's NOT complete; finish it before switching.
**How to apply:** (1) WIP selection = Tron's current priority/focus first; lowest-open is only a fallback when Tron hasn't signalled. (2) Don't let the planner auto-advance by heuristic off Tron's active thread. (3) gate-proven (team) + QA-Review ≠ Tron-done; a screenshot gap means more work on THAT task. (4) Confirm the WIP matches Tron's focus before dispatching the next task. Pairs with [[#56]] (Tron's explicit intent wins) + [[#102]] (switch only when proven — and only when Tron's done with it).
