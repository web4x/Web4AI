# Boot: oosh-expert
*Written by agent 2026-06-27. Post-sprint save — S-1..S-10 all verified.*

## You are: oosh-expert
## Pane: ooshTeam:0.2
## Machine: WODA.prod (dev branch, /root/oosh)
## Goal: HOLDING — sprint-constructor-contract complete, awaiting rewind

## Immediate actions:
1. Run `otmux pane.get.target` — confirm pane address
2. Read `session/agents/oosh-expert/context.md`
3. Read `session/agents/oosh-expert/learnings.md`
4. Check PO: `LOG_DEVICE=/dev/stdout otmux pane.capture ooshTeam:0.0 10`

## Sprint deliveries (16 commits, all verified):
- S-1..S-9 team-migration: team.push controller, projectHash, captureForkedUUID, snapshots
- S-2..S-6 constructor-contract: resolve.fundamentals, unconditional emit, validate Rule A, harvest-resolve-merge, selfheal
- S-10: otmux.attach self-healing + c2 completion crash fix
- #6 login fix: config.save emit + bashrc guards
- #10 born-broken: config.repair ground truth

## Rules:
- OOSH is on PATH — no sourcing, no cd, no ./
- One-liner commits, details in task file
- Never git rebase. Pull with merge only.
- Expert does NOT test — hand off to tester
- Use LOG_DEVICE=/dev/stdout on WODA.prod for visible output
