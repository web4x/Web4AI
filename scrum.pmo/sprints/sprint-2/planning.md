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
| [task-s2-b](./task-s2-b-dispatch-submission-verified.md) | dispatch submission-verified (BUG10) | CRITICAL | ✅ **impl DONE** (`96ccff2`+`a9fbea5`) — region-verify + drain-gate; self-proven (rc2 caught) → tester T-DISPATCH-SUBMIT gate |
| [task-s2-c](./task-s2-c-registry-route-identity.md) | registry / route / identity integrity | CRITICAL/HIGH | route auto-heal shipped; **OTR-3 reconcile-after-fork DESIGN done** (I2b crux) → expert impl; boot-id open |
| [task-s2-d](./task-s2-d-node-provisioning-hardening.md) | node provisioning + hardening | HIGH | hardening baked (u20/u24); autoconfig + runtime open |
| [task-s2-e](./task-s2-e-tooling-hygiene.md) | tooling hygiene | MEDIUM/LOW | planned |
| [task-s2-f](./task-s2-f-plantuml-script.md) | plantuml OOSH script | HIGH (Tron: next priority) | impl DONE (`1cb40ee`+`0638344`) → tester T-PLANTUML gate |

## Sequence & priority
1. [task-s2-a](./task-s2-a-teamsave-status-parity.md) (parity) — do-first CRITICAL infra; PF4 gated on architect fail-loud-vs-resolver ruling → tester re-run → PO gate → report MacStudio PO. **(architect+tester lane — does NOT need the expert.)**
2. **[task-s2-f](./task-s2-f-plantuml-script.md) (plantUML) — NEXT PRIORITY (Tron directive 2026-07-02).** Spec signed off → expert implements now (2 odocker primitives + plantuml script). Runs in parallel with the parity architect/tester lane.
3. [task-s2-b](./task-s2-b-dispatch-submission-verified.md) (BUG10) — the fleet dispatch throttle; contract ready, expert impl after plantUML.
4. [task-s2-c](./task-s2-c-registry-route-identity.md) — route auto-heal shipped (watch post-malware); reconcile-after-fork + team.audit + boot-identity next.
5. [task-s2-d](./task-s2-d-node-provisioning-hardening.md) / [task-s2-e](./task-s2-e-tooling-hygiene.md) — as capacity.

## Closed / carried-done (context, not open)
- **SECURITY u20 malware**: RESOLVED — host clean, u20 destroyed+rebuilt hardened, odocker loopback+key-only (once.sh `41ca4e4`), feeds [task-s2-d](./task-s2-d-node-provisioning-hardening.md). [task-s2-d.0-security-u20-incident.md](./task-s2-d.0-security-u20-incident.md)
- **Parity PF2/PF3**: GREEN (shared reader `private.hiveMind.live.tupleset`, once.sh `9ddcf35`).
- **OTR-D doctrine** (oosh-tools=default): propagated to 91 SKILL.md (`94b84fc`).
- **Node-provisioning NP-2/NP-3**: u24 clean-boot GREEN + SETUP_SERVER→99 (DONE); S3 dev→macos merge PARKED pending Tron a/b.

## Provenance (migrated from — now superseded by this sprint)
`sprint-oosh-tooling-reliability` (OTR-1..11) and `sprint-node-provisioning` (NP-1..4) are banner-marked SUPERSEDED. The detailed specs formerly loose under `session/tasks/*.md` have been **MIGRATED into this folder** as sub-tasks (`task-s2-<letter>.<n>-*.md`), each given a `[task:uuid:…]` and bidirectionally linked to its parent task. This sprint is now **self-contained** and the single authoritative live plan.
