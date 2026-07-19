# robbin-architect Context (Save 2026-07-19 post-Option-2-refresh)

## STATUS: Active — BOOT COMPLETE, standing by for robbin-po assignment
Pane: robbinTeam2:0.3  (Machine: WODA.prod / v60211)
Team: 0.0=po | 0.1=expert | 0.2=skill-expert | 0.3=ME | 0.4=req | 0.5=tester | 0.6=planner | 0.7,0.8=shells

## MACHINE / REPO MIGRATION (was MacStudio → now WODA.prod)
- Repo: /var/dev/Workspaces/web4x/Web4RawBin  (OLD /Users/Shared/Workspaces/2cuGitHub/Web4RawBin is GONE)
- Session/agents dir: /var/dev/Workspaces/AI/Claude/session/agents/robbin-architect/
- I am at pane 0.3 now (was 0.4 on MacStudio). Team pane order changed.

## GIT-VERIFIED (re-derived from git, NOT saved copy — disk-wins)
- HEAD: 9363082cb (robbin-expert: save-404 fix — Save writes to CORRECT repo, v0.7.61, edit-CYBX5O6I.js)
- Version: v0.7.61
- Working tree: DIRTY — expert WIP (scenario units, requirements.md, build-manifest.json, merge-visual PNGs), untracked data/logs

## CURRENT SPRINT: S30 traceability-improvement
- Merge-editor arc R30.23→60: DONE / gated GREEN (incl R30.35 6-fix polish + A+D/C reopens — my design work: 528798dbc, 70e53594c, 5d90d0174, 204df7313)
- OPEN: save-404 fix — expert IMPLEMENTED at v0.7.61 (6c4c1e4af RED baseline → 9363082cb fix). NOT yet tester-GREEN. Awaiting gate + Tron visual.
- robbin-po coordinating the save-404 close.

## STALE — DO NOT REPLAY (old MacStudio timeline, v0.6.56/R20.x)
- design-3-item-changes.md, design-seed-ior-reuse.md → OLD R20.x seed-ior work, superseded. Ignore.
- Prior context.md save (bbac8a0, v0.6.56/R20.30) → stale. This file supersedes it.
- Old robbin-po "R20.30 AC review (ior d7299c88)" message → stale old timeline. Disregard unless re-issued in R30 terms.

## ROLE / PROCESS RULES
- DESIGN / REVIEW only. Wait for robbin-po assignment. Never self-assign. TRON overrides.
- NEVER ASSUME — ALWAYS MEASURE (device telemetry / tester measurement beats guessing).
- Match gate to bug physics; gate-before-deploy.
- Don't create tasks — planner owns that. Architect creates UC+Class+Method, wires into planner's task.
- 6-step chain LOCKED: Req → UC → Class → Method → Impl → Test. Task = navigation, not chain.
- Your-hop-your-status (#102): self-mark hop status on finishing architect hop-work.
- grep -rl for lookups (auto-allowed), NOT find -exec (prompts).
- Verify expert impl against design — expert optimizes for speed, may collapse abstractions.

## POST-REWIND RECOVERY PROTOCOL (proven)
boot.md → context.md → learnings.md → otmux pane.get.target + pane.list <team> → git log/version/status in repo. Trust git + measurement over any saved summary (timelines bleed across rewinds). MacStudio→WODA.prod migration renames machine + moves repo path — re-verify everything.

## WHAT'S NEXT
Await robbin-po directive. save-404 is expert-owned (0.1); if asked, I review its AC / chain-descent coverage. RC (/remote-control) flagged to po for enable.
