# Sprint 2 Planning — Controller Reliability & Node Hardening
[sprint:uuid:89034c04-7006-4d13-954b-2fe22eb9e6ba]

## Sprint Goal
Make the OOSH controller (hiveMind/otmux/claudeCode) TRUE and RELIABLE enough to be
the mandatory default for every team operation — no raw-tool fallback. Consolidates all
open work discovered during the clean-boot / u24-gate / RC-backfill / cross-team period into
ONE sprint with correct templates + UUID traceability (supersedes the scattered `session/tasks/*`
and the ad-hoc `sprint-oosh-tooling-reliability` / `sprint-node-provisioning` dirs).

## Sprint Overview
**Focus:** parity (Model≡View), dispatch submission-verify, registry/route/identity integrity,
node provisioning+hardening, tooling hygiene, plantuml.
**Team:** oosh-expert (impl) · oosh-tester (validation) · oosh-architect (design/contracts) · oosh-po@WODA.prod (drive+QA gate)
**Constraint:** WIP=1 per agent; short-pointer dispatch (BUG10); SCENARIO-FIRST (tests on disk before impl); measure-don't-assume (tester runs tests, PO gates on the report); OOSH wrappers only.
**Branches:** task/sprint files → `web4x/Web4AI@main`; code → `Cerulean-Circle-GmbH/once.sh@dev`.

## Tasks
| Task | Title | Priority | Status |
|------|-------|----------|--------|
| [task-s2-a](./task-s2-a-teamsave-status-parity.md) | teams.save/status MVC parity | CRITICAL (do-first) | ✅ **DONE** — 3/3 GREEN on live (`cc641b7`), PO QA PASS, reported to MacStudio |
| [task-s2-b](./task-s2-b-dispatch-submission-verified.md) | dispatch submission-verified (BUG10) | CRITICAL | ✅ **DONE** — impl `96ccff2`+`a9fbea5`, tester T-DISPATCH-SUBMIT 5/5 GREEN, PO QA PASS (BUG10 closed) |
| [task-s2-c](./task-s2-c-registry-route-identity.md) | registry / route / identity integrity | CRITICAL/HIGH | C-family FULLY DESIGNED (c.0 foundation ✅ + c.1 SHIPPED + c.2 + c.3) + T-RECONCILE-FORK red ✅ → **all expert impl, blocked ONLY on expert /rewind** |
| [task-s2-d](./task-s2-d-node-provisioning-hardening.md) | node provisioning + hardening | HIGH | hardening baked (u20/u24); autoconfig + runtime open |
| [task-s2-e](./task-s2-e-tooling-hygiene.md) | tooling hygiene | MEDIUM/LOW | planned |
| [task-s2-f](./task-s2-f-plantuml-script.md) | plantuml OOSH script | HIGH (Tron: next priority) | ✅ **DONE** — T-PLANTUML 5/5 + docs + architect independent-render PASS (55785B svg, non-author); minor doc-gap follow-up |

## Sequence & priority (live — 2026-07-02)
1. [task-s2-a](./task-s2-a-teamsave-status-parity.md) (parity) — ✅ **DONE** (PO QA PASS, reported MacStudio).
2. [task-s2-f](./task-s2-f-plantuml-script.md) (plantUML) — impl DONE; T-PLANTUML 5/5 GREEN ✅ + docs ✅; **only open**: architect independently renders a .puml→.svg from docs.
3. [task-s2-b](./task-s2-b-dispatch-submission-verified.md) (BUG10/OTR-1) — ✅ **DONE** (T-DISPATCH-SUBMIT 5/5 GREEN, PO QA PASS — dispatch throttle closed).
4. [task-s2-c](./task-s2-c-registry-route-identity.md) (OTR-3) — DESIGN done → **expert impl** (I2b via parity reader + tty-adopt + team.audit) → tester T-RECONCILE-FORK. (route auto-heal already shipped; boot-identity still open.)
5. [task-s2-d](./task-s2-d-node-provisioning-hardening.md) / [task-s2-e](./task-s2-e-tooling-hygiene.md) — as capacity.
**Open gates I'm waiting on**: architect plantUML render (last plantUML criterion); expert OTR-3 impl → tester T-RECONCILE-FORK. (parity + BUG10 + T-PLANTUML + docs = DONE.)

## Closed / carried-done (context, not open)
- **SECURITY u20 malware**: RESOLVED — host clean, u20 destroyed+rebuilt hardened, odocker loopback+key-only (once.sh `41ca4e4`), feeds [task-s2-d](./task-s2-d-node-provisioning-hardening.md). [task-s2-d.0-security-u20-incident.md](./task-s2-d.0-security-u20-incident.md)
- **Parity PF2/PF3**: GREEN (shared reader `private.hiveMind.live.tupleset`, once.sh `9ddcf35`).
- **OTR-D doctrine** (oosh-tools=default): propagated to 91 SKILL.md (`94b84fc`).
- **Node-provisioning NP-2/NP-3**: u24 clean-boot GREEN + SETUP_SERVER→99 (DONE); S3 dev→macos merge PARKED pending Tron a/b.

## Provenance (migrated from — now superseded by this sprint)
`sprint-oosh-tooling-reliability` (OTR-1..11) and `sprint-node-provisioning` (NP-1..4) are banner-marked SUPERSEDED. The detailed specs formerly loose under `session/tasks/*.md` have been **MIGRATED into this folder** as sub-tasks (`task-s2-<letter>.<n>-*.md`), each given a `[task:uuid:…]` and bidirectionally linked to its parent task. This sprint is now **self-contained** and the single authoritative live plan.
