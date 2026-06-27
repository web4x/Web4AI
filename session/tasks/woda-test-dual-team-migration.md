# Task: ooshTeam + robbinTeam2 on WODA.test (fresh host) — via team.push (dogfood)

**From**: oosh-po@MacStudio (Tron 2026-06-27)  **Owner**: oosh-po@WODA.prod drives; oosh-po@MacStudio source-side+QA
**Priority**: HIGH  **Status**: host-prep in flight

## Target host
WODA.test = 178.254.18.182, v36421.1blu.de, root@:22, key ~/.ssh/id_rsa. SEPARATE machine from WODA.prod (195.90.209.56).
Readiness probed 2026-06-27: oosh ✓, tmux ✓, Web4RawBin ✓ (at /var/dev/Workspaces/2cuGitHub/Web4RawBin); claude ✗ (installing), workspace /var/dev/Workspaces/AI/Claude ✗ (cloning).

## Host prep (deterministic, non-agent) — IN FLIGHT (bg /tmp/woda-test-prep.log)
- [ ] clone web4x/Web4AI → /var/dev/Workspaces/AI/Claude
- [ ] symlink Web4RawBin into Claude/workspaces/
- [ ] `claudeCode install` (claude binary)
- [ ] verify: claude present, workspace present, oosh on PATH

## Teams to stand up (both, all @WODA.test, all /rc)
- **ooshTeam**: oosh-po, oosh-architect, oosh-expert, oosh-tester (+ shells)
- **robbinTeam2**: robbin-po, robbin-expert, robbin-skill-expert, robbin-architect, robbin-req, robbin-tester
JSONLs sourced from MacStudio (same UUIDs as the WODA.prod migration) → placed in WODA.test TARGET hash dir `-var-dev-Workspaces-AI-Claude/`.

## Approach — DOGFOOD team.push (do NOT hand-crank a 3rd manual migration)
This is the acceptance target for the Constructor-Contract-adjacent team.push sprint (S-9 dogfood). Once team.push is usable:
`hiveMind team.push WODA.test` for each team → state-repo sync + target-hash JSONL + fork-full + rename role@WODA.test + /rc-each + consistency.audit clean. ONE command per team, zero manual.
Until team.push ready: host-prep proceeds now; agent forking waits for the tool (or, if Tron wants teams up sooner, manual per-pane fallback with the robbinTeam2-finalize recipe — flag the cost).

## Acceptance
- [ ] WODA.test ooshTeam: 4 agents live, role@WODA.test, /rc each, consistency.audit clean
- [ ] WODA.test robbinTeam2: 6 agents live, role@WODA.test, /rc each, consistency.audit clean
- [ ] `claudeCode list` on WODA.test shows all (target-hash placement)
- [ ] done via `hiveMind team.push` (dogfood proof) OR documented manual with cost noted

## Report-back
- host-prep:
- ooshTeam push:
- robbinTeam2 push:
