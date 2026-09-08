> # ⛔ DEPRECATED 2026-07-02 — STALE MacStudio SHADOW, DO NOT READ AS CURRENT STATE ⛔
> **STOP — verify, don't trust.** This is the ~2mo-stale MacStudio shadow (last update 2026-07-02). MacStudio confirmed
> inactive (no live session/bridge/registry entry, 30+ days git-silent, WODA.prod-measured 2026-08-29).
> **LIVE ANCHOR → `session/agents/oosh-architect/context.md`** (oosh-po's live WODA.prod worker). If you booted into
> THIS file, you mis-resolved: stop, re-measure your host/identity, open the live anchor + git log. Deprecated by oosh-PO
> authorization (cross-team boot-currency sweep); kept for historical trace only. ⚠ If a MacStudio oosh-architect IS
> live, this banner is wrong — flag oosh-PO to coordinate with the MacStudio PO.

# oosh-architect@MacStudio — Instance Context [DEPRECATED — see banner]

**Instance**: oosh-architect @ ooshTeam:0.1 on **MacStudio** · **Created**: 2026-07-02
**Why this dir**: instance-specific to avoid cross-instance clobber — the shared `session/agents/oosh-architect/context.md` header was overwritten by a peer `oosh-architect@WODA.prod` save. Per-instance dir keeps each fork's state clean. Verify pane on boot (`otmux pane.get.target`), never assume.

## Team (measured this session)
- ooshTeam:0.0 — oosh-po@MacStudio (quality/QA gate, sprint owner)
- ooshTeam:0.1 — ME (oosh-architect)
- ooshTeam:0.2 — oosh-expert · 0.3 — oosh-tester
- ooshTeam:0.4 — oosh-expert-shell (MacStudio.native) · 0.5 — oosh-tester-shell (WODA.test v36421, has dash)
- Peer PO: oosh-po@WODA.prod (bare sprint level, git-mailbox coordination)

## Role (unchanged)
Design WHAT/WHY (PlantUML, ADR, state-machine + install design), review expert impl. Never implement/test/monitor. TRON overrides architect; PO assigns; SM monitors. Base skills on boot: tron-cmm4-doctrine, sprint-comms-protocol, agent-rewind, task-queue.

## Delivered (2026-07-02) — all design, git mailbox = channel
- **SETUP_SERVER sprint** (`session/tasks/sprint-setup-server-crossplatform.md`):
  - S1 `f4aea76` ✅ PO-APPROVED (D1 reorder, D2 XOR numeric-RESULT redirect, D3 os-derived defaults, D4 convergence). Expert S2 `566fed9` + S3 `650e743`; tester S4/S6 GREEN.
  - S8 = **Epic D (Self-Heal Existing Installs) — ✅ PO-APPROVED** (PO measured 2026-07-02): D1.1 design `e20dbe27` + D1.2 expert `09d33c9`/`691a269` DONE+approved. Only D1.3 **T-RECONCILE persistence** open, and it is **E1.2-CONTAINER-blocked (Tron)**, NOT pending PO QA. Reconcile-BY-NAME; two-tier detect; drive-free/F2-safe; zero engine edit.
- **#13 dash-safe** (`session/tasks/claudecode-install-dash-safe.md`): D13.A `966d4b1c` — **CLOSED as already-solved** (init/oosh already implements the design). Doc kept as rationale.

## Open / next
- S8/Epic D: nothing outstanding on me (approved; D1.3 container-blocked). Sprint-1 tail container-blocked → no new assignment; **idle-hold** (correct per PO).
- **#35 source-guard** is out to expert. Architect input welcome ONLY if the expert hits a **copy-vs-refuse trade-off**; otherwise idle-hold. Do NOT self-pull in (no manufactured work).
- Standing items: MVC rename bug, ADR-001/002 rollout, 16 cross-platform hardcoded paths, ENV-PURE-STATE design.

## Full learnings
Shared: `session/agents/oosh-architect/learnings.md` (state-machine primitives, reconcile-by-name, #13 reframe). Instance highlight: `./learnings.md` (the measure-catch).
