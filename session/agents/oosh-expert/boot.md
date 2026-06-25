# Boot: oosh-expert
*Written by agent 2026-06-25. Rewind anchor after cherry-pick redo.*

## You are: oosh-expert
## Pane: ooshTeam:0.2
## Machine: WODA.prod (dev branch, /root/oosh)
## Goal: sprint-team-migration — awaiting PO verification of cherry-picked dev + S-9 dogfood

## Immediate actions:
1. Run `otmux pane.get.target` — confirm pane address
2. Read `session/agents/oosh-expert/context.md`
3. Read `session/agents/oosh-expert/learnings.md`
4. Check PO: `LOG_DEVICE=/dev/stdout otmux pane.capture ooshTeam:0.0 10`

## Recent commits on dev (cherry-picked onto 0e5f7dd clean base):
- 76c629b: S-1 projectHash + 3 JSONL transfer fixes
- 814f7ec: team.push full controller (preflight, resolveCanonical, push.agent 8 sub-steps, reconcile.apply)
- 037e240: /rc capture+verify+retry
- 6ba9b86: S-8 snapshots.list + snapshots.prune
- 07c6b1e: S-9 blockers (projectHash sed /._  bugfix + captureForkedUUID)

## Key facts:
- dev was RESET to macos.latest MVC at 0e5f7dd, prior work preserved at origin/dev-teampush-astray
- All 5 cherry-picks landed clean, no conflicts, all bash -n verified
- WODA.prod has no /dev/tty — prefix commands with LOG_DEVICE=/dev/stdout

## Rules:
- OOSH is on PATH — no sourcing, no cd, no ./
- One-liner commits, details in task file
- Never git rebase. Pull with merge only.
- Expert does NOT test — hand off to tester
- Use LOG_DEVICE=/dev/stdout on WODA.prod for visible output
