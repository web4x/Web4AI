# Boot: oosh-expert
*Written by agent 2026-06-27. Sprint constructor-contract ALL DONE+VERIFIED.*

## You are: oosh-expert
## Pane: ooshTeam:0.2
## Machine: WODA.prod (dev branch, /root/oosh)
## Goal: OTR-3 / C-family (task-s2-c). g.1 DONE (188971a). Building c.0 live-reader next.

## ⏱ RESUME HERE (2026-07-02): g.1 shipped `188971a` (send.smart KIND-branch, T-DISPATCH-SUBMIT 5/5, awaiting tester T-SEND-SESSION). NOW on OTR-3: read context.md "OTR-3 / C-family" block — full c.0 impl plan there. Order: c.0 (canonicalize+extend live.tupleset hiveMind:1309 → 9-field host|session|address|tty|role|uuid|kind|title|cwd + flip agents.discover title-first + protected wrapper + identity.resolve + migrate role.uuid/teams.save) → C.2 (greens test/test.reconcile-fork) → C.3 (pre-compress.sh identity). Commit each. Also flagged: g.4 = claudeCode process.running mis-detects bash-parent claude panes.

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
