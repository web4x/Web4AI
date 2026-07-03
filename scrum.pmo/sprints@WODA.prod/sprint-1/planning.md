# Sprint 1 @ WODA.prod — Reliable Send & Capture
[sprint:uuid:94fff2f6-e044-408d-8d84-a99722496655]

## Sprint Goal
`otmux` and `hiveMind` send + capture are **reliable and exactly-once** on every method:
Enter always COMMITS (never a stray newline), each message delivered **once** (no dup), a
working agent is **never interrupted**, nothing sprays extra keystrokes. Verification is by
**capture** (the prove-step), never by a retry loop.

## Machine scope
**WODA.prod** (home, v60211) sprint level — `scrum.pmo/sprints@WODA.prod/`. Code lands in
`Cerulean-Circle-GmbH/once.sh@dev` (`/root/oosh`); this sprint/task tree lives in `web4x/Web4AI@main`.

## Naming Conventions
- Tasks: `task-<n>-<short-description>.md`
- Subtasks: `task-<n>.<m>-<role>-<short-description>.md` (role in the filename: `-architect-`/`-expert-`/`-tester-`)
- Every file: top breadcrumb + `## Traceability` with **dual links** (up ⇔ down at both ends).

## Team
oosh-po@WODA.prod (drive + QA gate) · oosh-architect (design) · oosh-expert (impl) · oosh-tester (validation) · scrum-master (monitor) · TRON (operator, final acceptance)

## Traceability
- Source: TRON directive 2026-07-03 (dedicate a sprint to the proven send-reliability task)
  - down
    - [Task 1: clean single-submit send.verified (poke removed)](./task-1-clean-single-submit-send.md)
    - [Task 2: non-claude verify → rc0 (fix false-rc2-on-shell)](./task-2-nonclaude-verify-rc0.md)

## Tasks
| Task | Title | Status |
|------|-------|--------|
| [Task 1](./task-1-clean-single-submit-send.md) | `send.verified` clean single-submit (poke removed) | ✅ **DONE — QA-ACCEPTED (TRON 2026-07-03)** |
| [Task 2](./task-2-nonclaude-verify-rc0.md) | non-claude verify → `rc0` (fix false-rc2-on-shell) | 🔲 **PROPOSED — awaiting TRON approval** |

## QA workflow (per task)
architect design → PO sign-off → tester writes cases (scenario-first, each `[test:uuid]`) → expert impl → tester runs → PO gate on report + independent proof → **TRON final acceptance** → QA-ACCEPTED.

*Sprint 1 @ WODA.prod — Reliable Send & Capture*
