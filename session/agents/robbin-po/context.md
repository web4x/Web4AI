# robbin-po Context — clean snapshot 2026-06-08 (save #5, pre-rewind)

**Role:** PO | **Pane:** robbinTeam:0.0 | **Project:** RawBin | **Repo:** /Users/Shared/Workspaces/2cuGitHub/Web4RawBin/
**Server:** https://home.donges.it:4444 — **v0.5.106 LIVE** (iphone:0.1) — going higher as R18.29-31 deploys.
**Tron:** iphone:0.0 | SM TRONinterface:0.1 (actively helping: idle-catch + unsent-catch + report-discipline) | agent-trainer baseTeam:0.0
**Team:** 0.1 architect | 0.2 expert | 0.3 tester | 1.0 planner | 1.1 req | **2.0 robbin-skill-expert** (Tron's skill agent; T189 done)

## DONE + STRICTLY VERIFIED
- **S17** Scenario Units / IOR / Traceability Browser — complete.
- **S18** chain method-scope + detail-view + dogfood:
  - R18.1-8 chain narrowing (UC.method singular, /trace vs /scenario, Sprint→Task→coveredReq nav-root, 3-concern model Chain/Dependency/Navigation)
  - R18.9-R18.13 detail-view: all-children (incl Sprint→tasks), 5-level Parent chain (ownerIor), Browse-File→Monaco#L{line} (only real .ts/.puml), source.file+line on 353 units — VERIFIED v0.5.106
  - R18.19 sprint zero-pad "Sprint 01-18" + dedup (9 dup units deleted, 94 refs repointed) + S2-S9 Sprint units (tasks[] empty by-design, deferred — re-openable)
  - **CHAMPAGNE strict 44/44** — every test 7-hop reachable from Req root (single fix R15.6→T111). Canonical metric /44 tests (T183 gate). Orphan-by-design allowlisted (f221d25b).
  - S18 dogfood COMPLETE: sprint authored as scenario.json units → planning.md + 11 task MDs generated. S18 sprints.json symlink tree built (8ce33c87).
  - req canonicalization: zero inferred-marker quotes (ccdffd64); heading-artifact reqs orphaned.
  - T189: 19 Skill scenario units + scrum.pmo/skills/ .md (cdb65607).
  - DOC: scrum.pmo/standards/scenario-data-pipeline.md (storage/views/scripts/serving + flow) — README-linked.

## IN FLIGHT (the ONE active impl)
- **R18.29-31 unitLinks[] + Unit lifecycle** — expert IMPLEMENTING now: model.unitLinks[] (IOR list) + addLink/removeLink/syncLinks + put() auto-sync → keeps unitLinks[] AND on-disk scenario/sprints.json symlinks atomically consistent (makes the S18 symlink-gap structurally impossible). Architect design cd3b2730 + r18-29-31-unit-links-atomic-symlinks.md; req formalized 6cf7b901. Tester verifies symlink-consistency after add/remove on deploy.

## 2 STANDING TRON ITEMS (both Tron)
1. **HTTPS cert** — needs Tron DNS API access for ACME (clears device lockout). Expert pre-staged auto-detect+self-signed-fallback = instant pickup.
2. **Tron QA batch** — scrum.pmo/tron-qa-batch-*.md (planner making it spot-check-3 + batch-approve ready). Closes S17/S18 gates.

## HARD RULES (durable)
- #65 NEVER /compact (kills agents) — rewind via agent-trainer (save+commit FIRST); verify reset <30% before re-tasking.
- #66 ship = package.json + sw.js CACHE_NAME bump (a+b); #67 new route/bundle → sw.js STATIC_SHELL (c).
- CMM4: req (atomic+literal capture) → planner (v4-uuid stand-up) → architect (design) → expert (impl) → tester (strict verify). compound-requirement-source*.md = Tron verbatim FIRST.
- REPORT + DELEGATE VIA TASK FILE; chat = one-line pointer ONLY (Tron, repeatedly).
- Route EVERY Tron literal to req. #17 real v4 uuids only. #27 STRICT verify = per-Test 7-hop + LIVE UX repro.
- #71 every report → route next; never idle. otmux send is unreliable → VERIFY via pane.capture (sends silently drop).
- SM actively helps: idle-catch / unsent-catch / report-discipline — drive on its flags.

## HARNESS TRACKER: #29-74 done. #75 R18.29-31 in flight. #58 cert + QA batch = Tron-gated. #37/#61 S17/S18 parents close on Tron QA.

## ON RESUME
Verify TRUE state via git/health (this snapshot lags live). Re-task instant Tron runs cert / signs QA / gives a literal (→req). 5+ agents idle = re-task or confirm legitimate (only standby if ALL impl+tested). SM monitors; rewind via trainer near limit.
