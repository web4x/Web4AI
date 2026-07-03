# Sprint 1 @ WODA.prod — Reliable Send & Capture
[sprint:uuid:94fff2f6-e044-408d-8d84-a99722496655]

## Sprint Goal
`otmux` and `hiveMind` send + capture are **reliable and exactly-once** on every method and every case:
Enter always COMMITS, each message delivered **once**, a working agent is **never interrupted**, nothing
sprays extra keystrokes, capture is read-only. Verification is by capture, never a retry loop.

## Machine scope
**WODA.prod** (home, v60211) — `scrum.pmo/sprints@WODA.prod/`. Code: `Cerulean-Circle-GmbH/once.sh@dev` (`/root/oosh`); tree: `web4x/Web4AI@main`.

## Naming Conventions
- Tasks: `task-<n>-<short-description>.md` (these CASE tasks are flat — **no subtasks**, per TRON).
- Every file: top breadcrumb + `## Traceability` (up ⇔ down at both ends).
- Reporting uses **dual links** ([GitHub](pushed-url) | [relative/path]).

## Team
oosh-po@WODA.prod (drive + QA gate) · oosh-architect (design) · oosh-expert (impl) · oosh-tester (validation) · scrum-master (monitor) · TRON (operator, final acceptance)

## Traceability
- Source: TRON directive 2026-07-03 (dedicated send-reliability sprint; pre-plan all cases as flat tasks)
  - down
    - [Task 01: clean single-submit send.verified (poke removed)](./task-01-clean-single-submit-send.md)
    - [Task 02: non-claude verify -> rc0 (fix false-rc2-on-shell)](./task-02-nonclaude-verify-rc0.md)
    - [Task 03: Case: bash-SHELL target](./task-03-shell-target.md)
    - [Task 04: Case: claude-TUI target](./task-04-claude-target.md)
    - [Task 05: Case: bash-parent claude (kind false-negative g.4)](./task-05-bash-parent-claude.md)
    - [Task 06: Case: node shell, not claude (kind false-positive g.1)](./task-06-node-shell-not-claude.md)
    - [Task 07: Case: single key](./task-07-single-key.md)
    - [Task 08: Case: text + trailing key](./task-08-text-plus-trailing-key.md)
    - [Task 09: Case: all-keys chain](./task-09-all-keys-chain.md)
    - [Task 10: Case: /command opens a picker](./task-10-slash-command-picker.md)
    - [Task 11: Case: [@sender] prefix exactly once (BUG9)](./task-11-at-prefix-once.md)
    - [Task 12: Case: long / wrapping message (g.7)](./task-12-long-wrapping.md)
    - [Task 13: Case: BUSY recipient](./task-13-busy-recipient.md)
    - [Task 14: Case: IDLE recipient](./task-14-idle-recipient.md)
    - [Task 15: Case: queue path (enqueue/drain, no dup)](./task-15-queue-path.md)
    - [Task 16: Case: remote target (ossh-exec)](./task-16-remote.md)
    - [Task 17: Case: capture methods (read-only)](./task-17-capture-methods.md)

## Tasks
| Task | Title | Status |
|------|-------|--------|
| [Task 01](./task-01-clean-single-submit-send.md) | send.verified clean single-submit (poke removed) | ✅ **DONE — QA-ACCEPTED (TRON)** |
| [Task 02](./task-02-nonclaude-verify-rc0.md) | non-claude verify -> rc0 (fix false-rc2-on-shell) | 🔲 PROPOSED — awaiting approval |
| [Task 03](task-03-shell-target.md) | Case: bash-SHELL target — [S] shell-provable | 🔲 Planned (to go through) |
| [Task 04](task-04-claude-target.md) | Case: claude-TUI target — [C] needs claude target | 🔲 Planned (to go through) |
| [Task 05](task-05-bash-parent-claude.md) | Case: bash-parent claude (kind false-negative g.4) — [C] needs claude target | 🔲 Planned (to go through) |
| [Task 06](task-06-node-shell-not-claude.md) | Case: node shell, not claude (kind false-positive g.1) — [S] shell-provable | 🔲 Planned (to go through) |
| [Task 07](task-07-single-key.md) | Case: single key — [S] shell-provable | 🔲 Planned (to go through) |
| [Task 08](task-08-text-plus-trailing-key.md) | Case: text + trailing key — [S] shell-provable | 🔲 Planned (to go through) |
| [Task 09](task-09-all-keys-chain.md) | Case: all-keys chain — [S] shell-provable | 🔲 Planned (to go through) |
| [Task 10](task-10-slash-command-picker.md) | Case: /command opens a picker — [C] needs claude target | 🔲 Planned (to go through) |
| [Task 11](task-11-at-prefix-once.md) | Case: [@sender] prefix exactly once (BUG9) — [C] needs claude target | 🔲 Planned (to go through) |
| [Task 12](task-12-long-wrapping.md) | Case: long / wrapping message (g.7) — [C] needs claude target | 🔲 Planned (to go through) |
| [Task 13](task-13-busy-recipient.md) | Case: BUSY recipient — [S/C] shell + claude | 🔲 Planned (to go through) |
| [Task 14](task-14-idle-recipient.md) | Case: IDLE recipient — [S/C] shell + claude | 🔲 Planned (to go through) |
| [Task 15](task-15-queue-path.md) | Case: queue path (enqueue/drain, no dup) — [S] shell-provable | 🔲 Planned (to go through) |
| [Task 16](task-16-remote.md) | Case: remote target (ossh-exec) — [R] needs remote | 🔲 Planned (to go through) |
| [Task 17](task-17-capture-methods.md) | Case: capture methods (read-only) — [S] shell-provable | 🔲 Planned (to go through) |

## QA workflow (per task / case)
predict -> run (in testSend / claude pane / remote) -> capture (full output) -> verify expected==actual -> PO gate -> **TRON acceptance** -> Done.

*Sprint 1 @ WODA.prod — Reliable Send & Capture*

---
## ✅ PO GATE — [S] shell-provable cases (oosh-po@WODA.prod, 2026-07-03) → awaiting TRON acceptance
Reviewed the tester's CAPTURED proof (reviewed, not re-run — PO gates on the report). **7/7 PASS, predict==actual:**
- T03 shell send (once/0-prefix/info+rc0/0-WARNING) · T06 node→not-claude (rc1, no false-claude) · T07 send.raw (raw key/0 poke-queue) · T08 text+Enter (**exactly 1 Enter, no dup** — Tron#1 vector) · T09 all-keys chain (sequential/0-prefix) · T15 queue drain (**undeliverable KEPT, no silent drop, route-gated**) · T17 pane.capture (**0 send-keys, READ-ONLY**).
- **Scalable/repeatable**: `goethrough-proof.sh` committed (re-runnable capture, not eyeball) — the T2Q/scalability principle satisfied.
- **PO gate: PASS** → these 7 are Done-ready pending **TRON acceptance** (the final step in the QA workflow).
- **task-02 correction**: NOT dropped — DONE (`466655d` poll fix made shell-send log `info` not false-`WARNING`/rc2; T03 depends on it).
- **task-18 cyan**: root cause FIXED (`9d65d12` — declare-anchored varname extraction; METHOD_PARAMETER now populates). Remaining = tester's captured CYAN-render proof → PO gate → Tron.
