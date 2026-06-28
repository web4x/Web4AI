# TEST GATE: fresh dev-oosh install on Ubuntu 24 + ooshTeam push (Tron directive)

**From**: oosh-po (Tron directive 2026-06-28)
**Owner**: oosh-expert (infra: odocker + ossh install + team.push) → oosh-tester (independent verify) → PO/Tron mark gate
**Priority**: HIGHEST — this is THE acceptance gate for the whole clean-boot bug sprint
**Status**: OPEN

## Why
macos.latest is currently more stable / boots more reliably. The clean-boot bug sprint (BUG 1-9, A, B, C-ext, FEAT8, ossh-install pure-state #6) all landed on **dev**. This gate proves dev's install is now equally reliable: a FRESH dev-oosh install on a clean Ubuntu 24 box must boot clean, and the ooshTeam must push onto it and work. Only then is dev validated.

## Steps (PDCA per step — verify each before next)

1. **odocker: start u24** — launch an SSH-based Ubuntu 24 (latest) container named `u24` via `odocker`. Must have sshd running + reachable.
2. **ossh config: u24** — create the ossh config entry for `u24` (canonical `ossh config.create` — machine-relative-safe, no hardcoded /root or /Users paths).
3. **Fresh dev-oosh install** — run the NEW dev `ossh install` onto u24. This is the live test of the install-path pure-state fix (#6) + HOME discovery (BUG 1).
4. **Verify clean boot on u24** (the bug-sprint acceptance checks, on a box that NEVER had old pollution):
   - `env -i sh` → `bash`: ZERO errors (no `/.local/bin/env`, HOME resolved by `this`)
   - `config list`: pure exports only, ~19 vars, **0 source lines**, `config validate` passes
   - `OOSH_MODE` set, `OOSH_DIR` on correct tree, `oo mode` shows header
   - `claudeCode list`: COLOR renders (ANSI present)
   - `otmux pane.self` / `pane.get.target`: correct (no $TMUX_PANE)
   - `otmux pane.title CURRENT "x"`: works
5. **Push ooshTeam to u24** — `hiveMind team.push u24` (or teams.migrate). Transfers snapshot + config + JSONLs + forks agents.
6. **Verify pushed team works on u24**:
   - `hiveMind team.status u24` shows the agents
   - `claudeCode list` on u24 SHOWS the pushed sessions (tests #7 placement — JSONLs in target's ~/.claude/projects)
   - agents are reachable via `hiveMind resolve` / `agent.send` from u24
7. **Mark the gate** — if ALL green: PO+Tron mark TEST GATE GOOD. Any red → file + fix, gate stays red.

## Acceptance
- [ ] u24 container running (odocker), ssh-reachable
- [ ] fresh dev `ossh install` succeeds, produces pure-state config (no manual cleanup)
- [ ] clean-boot checks all green on u24 (step 4)
- [ ] ooshTeam pushed, agents live on u24
- [ ] pushed agents discoverable via claudeCode list + hiveMind (step 6)
- [ ] TEST GATE marked GOOD

## Report-back (edit here; report to oosh-po)
- Expert (odocker u24 + ossh install + team.push + per-step results):
- Tester (independent verification of steps 4 & 6):
- PO gate decision:
