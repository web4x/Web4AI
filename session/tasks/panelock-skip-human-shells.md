> ⬆ **[Sprint 2 · Epic E](../../scrum.pmo/sprints/sprint-2/task-s2-e-tooling-hygiene.md)** — this spec is traced from that epic.

# Improvement: `pane.lock` must refuse human/non-Claude shells (no flicker war)

**From**: oosh-po (ARON cycle — 1 improvement as task)
**Owner**: oosh-architect (decide detection contract) → oosh-expert (impl, use `oo new.method` if adding helpers) → oosh-tester
**Priority**: MEDIUM
**Status**: PLAN
**Date**: 2026-06-28

## Issue (observed live, Tron "WTF alternating every second")
`otmux pane.lock` on a HUMAN interactive shell (ooshTeam:0.5, where Tron was typing) → the background enforcer re-applies the title every 5s, fighting the user's prompt/typing → title flickers every second. pane.lock is designed for CLAUDE panes that overwrite their OWN title — it must NOT lock a human shell.

## Improvement
1. **pane.lock refuses non-Claude panes** — before locking, check `private.otmux.pane.isClaudeCode <target>`; if it's a bare bash/zsh human shell, REFUSE with a clear message ("pane.lock is for Claude panes; <target> is an interactive shell — not locking"). 
2. (Already in dispatch-submission-verified/BUG6 scope, cross-link) lock kills existing enforcer before spawning; unlock `pkill -f "pane.lock.*<target>"` kills ALL.
3. Use `oo new.method` template if any new helper is added (ARON: use templates).

## Acceptance
- [ ] `pane.lock <human-shell>` → refused with clear message, NO enforcer spawned, NO flicker
- [ ] `pane.lock <claude-pane>` → works as before
- [ ] T-PANELOCK-SKIP-HUMAN: lock a bare-bash pane → assert refused + 0 enforcers via `pkill -0`/ps
- Cross-links BUG 6 (pane.unlock pkill) in clean-boot-bugs-woda-prod.md

## Report-back (edit here)
- Architect (detection contract):
- Expert (impl + commit):
- Tester (T-PANELOCK-SKIP-HUMAN):
