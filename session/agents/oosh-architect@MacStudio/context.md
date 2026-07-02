# oosh-architect@MacStudio — Instance Context

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
  - S8 `e20dbe27` — QA (self-heal reconcile-BY-NAME for existing installs; two-tier detect; drive-free/F2-safe; zero engine edit).
- **#13 dash-safe** (`session/tasks/claudecode-install-dash-safe.md`): D13.A `966d4b1c` — **CLOSED as already-solved** (init/oosh already implements the design). Doc kept as rationale.

## Open / next
- S8 pending PO QA (non-blocking). Sprint-1 tail Tron-blocked → no new assignment; idle.
- Standing items: MVC rename bug, ADR-001/002 rollout, 16 cross-platform hardcoded paths, ENV-PURE-STATE design.

## Full learnings
Shared: `session/agents/oosh-architect/learnings.md` (state-machine primitives, reconcile-by-name, #13 reframe). Instance highlight: `./learnings.md` (the measure-catch).
