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
| [task-s2-c](./task-s2-c-registry-route-identity.md) | registry / route / identity integrity | CRITICAL/HIGH | c.0 landed (45951ad+0d9d162); g.4 kind-classify ✅ DONE (tester 5/5). NEXT: C.2+C.3 impl (designed+coherence-verified+red-tested, consume c.0). g.9 pane.get stray-newline root-fix filed (MEDIUM, DRY). |
| [task-s2-d](./task-s2-d-node-provisioning-hardening.md) | node provisioning + hardening | HIGH | hardening baked (u20/u24); autoconfig + runtime open |
| [task-s2-e](./task-s2-e-tooling-hygiene.md) | tooling hygiene | MEDIUM/LOW | planned |
| [task-s2-f](./task-s2-f-plantuml-script.md) | plantuml OOSH script | HIGH (Tron: next priority) | ✅ **DONE** — T-PLANTUML 5/5 + docs + architect independent-render PASS (55785B svg, non-author); minor doc-gap follow-up |
| [task-s2-h](./task-s2-h-team-sweep-fleet-dashboard.md) | team.sweep fleet dashboard (all teams + bg-shells + context-warn) | HIGH (Tron) | ✅ **DONE + PO QA PASS — T-SWEEP-ALL 5/5 (ddfcf51). Shell-count + context-cliff LIVE.** |
| [task-s2-i](./task-s2-i-shell-reaper.md) | shell.reap — reap accumulated bg shells (fd-leak/persist-thru-rewind) | HIGH (Tron/SM) | ✅ **DONE + PO QA PASS — T-SHELL-REAP 4/4. Safe reaper (leak-reaped/active-survives/fg-never). Auto-trigger unblocked → wire into task-s2-j rewind.** |
| [task-s2-g](./task-s2-g-otmux-send-reliability.md) | otmux send reliability + c2 parity + dev↔macos.latest | HIGH (Tron: otmux send "broken") | **★ SEND = ABSOLUTE HIGHEST (Tron: CRITICAL INFRA).** g.1 ✅ DONE (verified) · g.2 c2=DEV ✅ · g.3 DEV-leads-all ✅ · **g.4 OPEN (real agents→shell path) = fix NOW via c.0 kind** · g.5 T-SEND-MATRIX 11grp/50cell COMPLETE (2a6e3fa, superset=zero-regress) → tester (D3+E5 first = live-dup guards) · dup✓(fccdad8+d4e3ae0 drain, tester 5/5 — awaiting TRON live) · g.1✓ · C.2✓ · **g.4✓(6213ad6 pane.get-newline root)** · g.4✓ · **g.6✓(bcd8f84: root=log.init.colors echo-to-stdout, fix : >>)** · g.5 T-SEND-MATRIX in progress · **★ SEND FIXED + PO QA PASS (2fdce8e, tester 5/5 test.send-selfheal): commits reliably + exactly-1-delivery + no-interrupt; dup structurally impossible. Ultimate gate = Tron live inbox** |

## Sequence & priority (live — 2026-07-02)
1. [task-s2-a](./task-s2-a-teamsave-status-parity.md) (parity) — ✅ **DONE**.
2. [task-s2-f](./task-s2-f-plantuml-script.md) (plantUML) — ✅ **DONE** (T-PLANTUML 5/5 + docs + architect render PASS; minor doc-gap follow-up).
3. [task-s2-b](./task-s2-b-dispatch-submission-verified.md) (BUG10/OTR-1) — ✅ **DONE** (dispatch throttle closed).
4. **[task-s2-g.1](./task-s2-g.1-otmux-send-session-regression.md) — NEW PRIORITY (Tron): otmux send "doesn't complete session" — likely OTR-1's send.smart regressing non-dispatch/session sends (dev-only, macos.latest has old send). Architect diagnose vs macos.latest → expert fix → tester T-SEND-SESSION.** (+ g.2 c2 parity, g.3 branch newer/reliable.)
5. [task-s2-c](./task-s2-c-registry-route-identity.md) (OTR-3 + C-family) — DESIGN complete + coherence-verified → **expert impl** (blocked on expert /rewind).
6. [task-s2-d](./task-s2-d-node-provisioning-hardening.md) / [task-s2-e](./task-s2-e-tooling-hygiene.md) — as capacity.
**Open gates**: task-s2-g.1 (architect diagnose — the broken otmux send, blocks ARON rewind + Tron's send); expert /rewind → C-family impl. (parity + BUG10 + plantUML = DONE.)

## Closed / carried-done (context, not open)
- **SECURITY u20 malware**: RESOLVED — host clean, u20 destroyed+rebuilt hardened, odocker loopback+key-only (once.sh `41ca4e4`), feeds [task-s2-d](./task-s2-d-node-provisioning-hardening.md). [task-s2-d.0-security-u20-incident.md](./task-s2-d.0-security-u20-incident.md)
- **Parity PF2/PF3**: GREEN (shared reader `private.hiveMind.live.tupleset`, once.sh `9ddcf35`).
- **OTR-D doctrine** (oosh-tools=default): propagated to 91 SKILL.md (`94b84fc`).
- **Node-provisioning NP-2/NP-3**: u24 clean-boot GREEN + SETUP_SERVER→99 (DONE); S3 dev→macos merge PARKED pending Tron a/b.

## Provenance (migrated from — now superseded by this sprint)
`sprint-oosh-tooling-reliability` (OTR-1..11) and `sprint-node-provisioning` (NP-1..4) are banner-marked SUPERSEDED. The detailed specs formerly loose under `session/tasks/*.md` have been **MIGRATED into this folder** as sub-tasks (`task-s2-<letter>.<n>-*.md`), each given a `[task:uuid:…]` and bidirectionally linked to its parent task. This sprint is now **self-contained** and the single authoritative live plan.
