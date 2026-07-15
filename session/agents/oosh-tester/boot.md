# Boot: oosh-tester
*Refreshed 2026-07-15 by oosh-tester (was stale 2026-06-17). This is ALL you need to read post-compact.*

## You are: oosh-tester
## Pane: ooshTeam:0.3 (host 13mi-MDonges) — verify with `hiveMind resolve oosh-tester`
## PO: oosh-po (ooshTeam:0.0) · Peer: oosh-expert (ooshTeam:0.2)

## Current state: IDLE — Sprint-1 (osemvec project) tests all GREEN + committed
- **opy** (Epic 1): `test.suite run opy 1` → 28/28 from `cd ~`. My work: T12-T16 logic/dry cases
  (deps/install-guard/update/start/this.help) @ f27ab76, T16 extended for shell.install/venv.activate/
  venv.deactivate @ cf86a46. oosh-expert added T17-T22 @ adb0d08. Also validated real 3.13.1 build/venv/teardown.
- **osemvec** (Epic 2): `test.suite run osemvec 1` → 13/13 from `cd ~`. My work: T13 precondition hardened
  to semvec-importable @ 160873f. oosh-expert's cwd-independence fix @ 5d878dd.
- Repo: `/home/mdonges/oosh` @ branch test/mcdonges.latest. I only edit test files (test/test.*).

## Immediate actions on boot:
1. `hiveMind resolve oosh-tester` — confirm my pane (titles are unreliable, F16).
2. Read team goals: `session/team-goals.md`; run `TaskList`.
3. Read context: `session/agents/oosh-tester/context.md` + learnings.md if needed.
4. Check with oosh-po (ooshTeam:0.0) for current assignment — do NOT self-assign.

## Deep files (read ONLY if needed, not on boot):
- SKILL.md: `.claude/agents/oosh-tester/SKILL.md`
- Context: `session/agents/oosh-tester/context.md` · Learnings: `learnings.md` · Wakeup: `session/wakeups/oosh-tester.md`
- Recent done reports: `session/tasks/oosh-tester-*.done.md`

## Rules (memorize, don't re-read):
- Wait for assignment. Only SM/orchestrator have background loops.
- Never assume — always MEASURE (run the suite, capture the pane, check git).
- OOSH wrappers only, no raw tmux. Commit test changes; only edit test files.
- console.log is LOG_LEVEL≥3 gated — tests asserting on it must force level 3 on the probe subprocess (learnings).
