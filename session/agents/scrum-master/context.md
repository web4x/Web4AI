# Scrum Master Context — 2026-06-09 (REPLACEMENT HANDOFF)

## Identity
- **Role:** scrum-master at TRONinterface:0.1, Opus (1M context)
- **Reports to:** TRON (TRONinterface:0.0)
- **Teams:** robbinTeam (primary), ooshTeam, baseTeam (agent-trainer)
- **Triangle:** SM (monitor+unblock) ↔ POs (priorities) ↔ agent-trainer (rewind execution)

## LOOP DISCIPLINE (corrected this session — important)
- Use a SINGLE `ScheduleWakeup` heartbeat per tick. **NO shell poll-loops, NO `sleep && echo`, NO per-task sleep monitors.**
- The old `session/agents/scrum-master/how-i-worked.md` says "use sleep && echo, never ScheduleWakeup" — that is OUTDATED (2026-05-14). TRON's recent feedback overrides it: `feedback_no_until_loops.md` + commit #82 "ZERO wait-loops ever, trust the count". Boot manual (newer) also prescribes ScheduleWakeup.
- ScheduleWakeup fired reliably this session at 60–92s. It works.

## Current State at Handoff (as of TICK 3/4, ~20:14 UTC 2026-06-09)

### robbinTeam (Web4RawBin)
| Pane | Agent | State | Notes |
|------|-------|-------|-------|
| 0.0 | robbin-po | ACTIVE, **CONTEXT 1% remaining** | 🔴 CRITICAL. Save order sent TICK 3. REWIND PENDING — verify commit landed, then rewind FIRST via agent-trainer. |
| 0.1 | robbin-architect | RATE_LIMIT (server-side, transient) | Leave to auto-recover. |
| 0.2 | robbin-expert | ACTIVE, recovered | Re-triggered its context.md save TICK 2, churned 1m7s, idle. Verify commit. |
| 0.3 | robbin-tester | COMPLETED (idle) | Was ~63% earlier. Watch. |
| 1.0 | robbin-planner | **CONTEXT 481.8k tokens** | 🟠 Save order sent TICK 3. REWIND PENDING. Window-1 pane: use `tmux capture-pane -t robbinTeam:1.0 -p` (monitor unreliable). |
| 1.1 | robbin-req | RATE_LIMIT (server-side, transient) | Window-1. Leave to auto-recover. |
| 2.0 | robbin-skill-expert | COMPLETED (idle) | Healthy. |

### ooshTeam (OOSH framework)
| Pane | Agent | State | Notes |
|------|-------|-------|-------|
| 0.0 | oosh-po | ACTIVE, **CONTEXT 803.3k tokens** | 🟠 Save order sent TICK 3. REWIND PENDING. |
| 0.1 | oosh-architect | ACTIVE | Healthy. |
| 0.2 | oosh-expert | ACTIVE | Healthy. |
| 0.3 | oosh-tester | RATE_LIMIT (server-side, transient) | Leave to auto-recover. |

### baseTeam
| Pane | Agent | State | Notes |
|------|-------|-------|-------|
| 0.0 | agent-trainer | RECOVERED from throttle | Pane clean+idle at TICK 3 (sweep showed stale RATE_LIMIT from scrollback). AVAILABLE as rewind executor. Confirm clean before dispatching. |

### Subscription (TICK 1 check)
- **11.0% 5h | 50.0% 7d | resets in ~4h47m | safe**
- The `scrumMaster subscription` EPERM error line is a harmless return-code quirk; the numbers print correctly above it.

## IMMEDIATE PENDING ACTIONS (do these first)
1. **robbin-po (0.0)** — verify its TICK-3 save committed (`git log`/pane), then dispatch rewind to agent-trainer FIRST. At 1% it may not have completed the save — best-effort.
2. **oosh-po (0.0)** — verify save commit, then rewind.
3. **robbin-planner (1.0)** — verify save commit, then rewind.
4. Rewind dispatch: `hiveMind send.message agent-trainer "SM: rewind <agent> at <pane> — save committed at <commit>"`. After trainer reports done, VERIFY pane shows NO "clear to save"/"context low" before declaring recovered + notifying PO (Rule 6).
5. Rate-limit cluster will clear itself (transient server-side, subscription safe). Don't spam retries.

## What I Learned This Session (see learnings.md for detail)
- Server-side rate limit ("Server is temporarily limiting requests — not your usage limit") is NOT budget exhaustion. Always `scrumMaster subscription` to confirm before reacting. Nudges fail while throttle is active — don't spam the whole cluster.
- `team.sweep` reports RATE_LIMIT from scrollback text; the actual pane may already be idle/clean. Verify with pane capture before acting.
- Targeted re-trigger (reference the specific task, Rule 10) recovered robbin-expert; bare cluster-wide "try again" did not.
- Two POs (robbin-po 1%, oosh-po 803k) drifted to critical SIMULTANEOUSLY while sweep showed them merely ACTIVE — proves the every-3rd-tick all-pane context check is essential; ACTIVE ≠ healthy context.

## Key recovery anchors (prior session)
- 834a5fb, 1c1c956 (SM saves); b2a4953/8a5613a (robbin-po prior save); df066fc (TRON); 7ed46b9/a765203 (robbin-tester).
