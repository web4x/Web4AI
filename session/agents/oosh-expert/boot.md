# Boot: oosh-expert
*Written by agent 2026-06-27. Sprint constructor-contract ALL DONE+VERIFIED.*

## You are: oosh-expert
## Pane: ooshTeam:0.2
## Machine: WODA.prod (dev branch, /root/oosh)
## Goal: HOLDING — sprint complete (19 commits, S-1..S-11 all verified)

## Immediate actions:
1. Run `otmux pane.get.target` — confirm pane address
2. Read `session/agents/oosh-expert/context.md`
3. Read `session/agents/oosh-expert/learnings.md`
4. Check PO: `LOG_DEVICE=/dev/stdout otmux pane.capture ooshTeam:0.0 10`

## Sprint deliveries (18 commits):
- S-2: resolve.fundamentals (BASH_SOURCE chain walker)
- S-3: unconditional emit (no [ -n ] guards)
- S-4: validate accepts source *.env (Rule A)
- S-5: harvest-resolve-merge (no-loss reinit, repair=alias)
- S-6: selfheal (constructors never RC=1) + 7 test fixes
- S-10: otmux.attach self-healing + c2 crash fix + c2 ';' fix
- S-11: config.add restored source line write + dynamic harvest
- team-migration: team.push, projectHash, captureForkedUUID, snapshots
- login fix: config.save emit + bashrc guards
- born-broken: config.repair ground truth

## Rules:
- OOSH is on PATH — no sourcing, no cd, no ./
- One-liner commits, details in task file
- Never git rebase. Pull with merge only.
- Expert does NOT test — hand off to tester
- Use LOG_DEVICE=/dev/stdout on WODA.prod
