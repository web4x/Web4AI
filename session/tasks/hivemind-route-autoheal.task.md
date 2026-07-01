# hiveMind route auto-heal — durable fix for RECURRING route=unknown-state under RC-drive

**From**: oosh-po@WODA.prod (SM: robbin-po route corruption RECURS ~10min after registry.set)
**Owners**: oosh-architect (root-cause the RC-drive→route-drop mechanism) → hiveMind-expert/oosh-expert (auto-heal + fix) → oosh-tester
**Priority**: CRITICAL — recurring; robbin-po intermittently unreachable → cross-team stalls; 1 of the 2 full-velocity throttles (other = dispatch-submission-verified/BUG10)
**Status**: PLAN
**Date**: 2026-07-01
**Related**: hivemind-reconcile-after-fork.task.md (adopt = one-time; THIS = recurring stability), dispatch-submission-verified.md (the other throttle)

## Problem / Why
`registry.set robbinTeam2:0.0 robbin-po` + `consistency.fix` repairs robbin-po's route, but it BREAKS AGAIN ~10min later — RECURRING route=unknown-state, correlated with robbin-po RC-driving heavily. So the reconcile band-aid doesn't hold; something re-corrupts the route/uuid mapping under remote-control load. Impact: robbin-po intermittently unreachable via hiveMind → SM can't flag its RC-staged dispatches → team stalls. 40h+ of intermittent loss already.

## Root-cause hypotheses (architect to MEASURE, not assume)
- RC-driving changes the session's pane association / active-pane state that route resolution keys on → registry entry goes stale ~each RC event.
- A background sweep/re-register OVERWRITES the good sessions.env entry with empty/unknown ~10min cadence.
- Session uuid rotates or the pane↔uuid tty-match drifts when RC attaches/detaches.
Measure: snapshot roles/sessions.env + `process.list` route BEFORE and AFTER a heavy RC-drive; diff to catch exactly what field drops.

## Design / Approach
1. **Root-cause + fix at source** — whatever RC-drive mutates that breaks the route, stop it corrupting the registry (the durable fix).
2. **Self-care auto-heal (safety net)** — route resolution detects `unknown-state` and RE-RESOLVES from ground truth (tty-match pane→uuid) on the spot, instead of dropping the message. (init-correct → detect-sideways → reinit-to-repair.) A send to an unknown-route agent triggers a re-resolve+retry, not a stale-drop.
3. **INTERIM (unblock now)** — a watchdog: periodic `consistency.fix` on affected teams (e.g. every 2-3min) to auto-reapply the band-aid until the durable fix lands. Automates the manual re-run.

## Acceptance Criteria
- [ ] Root cause of RC-drive→route-drop identified + fixed at source (route survives heavy RC-driving)
- [ ] `send.message` to an unknown-route agent auto-re-resolves (tty-match) + delivers, not silent stale-drop
- [ ] robbin-po stays reachable across sustained RC-driving (no recurrence over N min)
- [ ] INTERIM watchdog available (periodic consistency.fix) until durable fix
- [ ] T-ROUTE-AUTOHEAL: corrupt a route → send → auto-heals + delivers

## PDCA
- Plan: this spec. Do: architect measures before/after RC-drive → expert fixes source + adds auto-heal. Check: T-ROUTE-AUTOHEAL + robbin-po stable under RC load. Act: keep watchdog as belt-and-suspenders.

## Report-back (owners edit here; one line each, with commit hash)
- Architect (root-cause measurement):
- Expert (source fix + auto-heal + interim watchdog):
- Tester (T-ROUTE-AUTOHEAL + robbin-po stability):

---
## ★ ROOT-CAUSE LEAD 2026-07-01 (oosh-po, during Tron-authorized repair) — hiveMind fd-leak (EMFILE)
Repairing robbin-po, `hiveMind consistency.audit` threw: `EMFILE ... Too many open files` at hiveMind:9748 — DESPITE `ulimit -n = 1048576` (huge). So this is a genuine **file-descriptor LEAK in hiveMind** (opens per-session/pane files without closing), not a low limit. **STRONG root-cause hypothesis for the recurring route=unknown-state**: under load (many RC events / sweeps), hiveMind exhausts fds → route resolution's file opens FAIL → route reads as `unknown-state` → recovers when fds are reclaimed (~the ~10min cadence). Fix the fd leak (close every opened fd; audit/route-resolve must not accumulate) → likely resolves the recurrence at source. Repair status: robbin-po reachable NOW (registry.set + reconcile clean 0 violations), but this leak = the durable target.
