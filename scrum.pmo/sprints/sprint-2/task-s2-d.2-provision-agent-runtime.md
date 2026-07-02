> ⬆ **[Sprint 2 · task-s2-d](./task-s2-d-node-provisioning-hardening.md)** — sub-task; back to parent task.

# NP-4: provision agent runtime (tmux + claude-cli) on a fresh node
[task:uuid:f7a5e4a7-8dbd-48f7-b192-3ef9b330e3d2]

**From**: oosh-po (u24 gate Step 5 finding; ARON cycle improvement)
**Owners**: oosh-architect (where: install-step vs team.push-prereq) → oosh-expert (impl) → oosh-tester (verify Step 5)
**Priority**: HIGH — blocks u24 gate Step 5 (team.push) = S3 gate 2 full-GOOD
**Status**: PLAN
**Sprint**: scrum.pmo/sprints/sprint-node-provisioning (NP-4)
**Related**: u24-freshinstall-testgate.md (Step 5 blocked), NP-1 odocker autoconfig

## Problem / Why
u24 Step 4 (clean boot) GREEN, but `hiveMind team.push u24` placed 0 agents: u24 has NO tmux and NO claude-cli. `ossh install` provisions the OOSH framework but not the agent runtime needed to create panes (tmux) + fork live Claude agents (claude-cli). team.push doesn't provision them either → no live agents, nothing discoverable on the target.

## Design / Approach
A node that will HOST agents needs: OOSH (have) + tmux + claude-cli. Decide the owner: (a) `ossh install` provisions tmux + claude-cli as part of bringing a node up (server-class install), OR (b) `hiveMind team.push` ensures them on the target before forking (push-time prereq check + install). DRY: reuse `oo cmd <pkg>` for tmux (as ossh.prereqs.install does for rsync/tree) and `claudeCode install` for claude-cli (it self-installs from web). Self-care: team.push pre-flights the target (tmux? claude?) and provisions-or-fails-loud, never silently pushes 0 agents.

## Acceptance Criteria
- [ ] Fresh node (post ossh install) has tmux + claude-cli available (via install-step or team.push prereq)
- [ ] `hiveMind team.push <node>` places live agents (not 0); they're discoverable via `claudeCode list` on the node
- [ ] team.push pre-flight: if tmux/claude missing and not auto-provisioned → loud error naming the gap (no silent 0-agent push)
- [ ] T-PROVISION-RUNTIME: fresh container → provision → team.push → agents live + discoverable
- [ ] DRY: tmux via `oo cmd`, claude via `claudeCode install` (no bespoke installers)

## PDCA
- Plan: this spec · Do: architect decides owner, expert impls · Check: T-PROVISION-RUNTIME on u24 → Step 5 green · Act: tune prereq detection

## Report-back (owners edit here; one line each, with commit hash)
- Architect (owner decision install-vs-push):
- Expert (provision impl):
- Tester (T-PROVISION-RUNTIME + u24 Step 5 green):
