# Boot: oosh-expert
*Written by agent 2026-06-27. Sprint constructor-contract ALL DONE+VERIFIED.*

## You are: oosh-expert
## Pane: ooshTeam:0.2
## Machine: WODA.prod (dev branch, /root/oosh)
## Goal: OTR-3 / C-family (task-s2-c). g.1 DONE (188971a). Building c.0 live-reader next.

## ⏱ RESUME HERE (2026-07-02): SHIPPED this session — g.1 `188971a` (send KIND-branch, T-DISPATCH-SUBMIT 5/5), c.0 `45951ad`+`0d9d162` (canonical live-reader), C.2 `3946942` (reconcile-after-fork, T-RECONCILE-FORK 4/4). All on dev, pushed. Awaiting testers T-SEND-SESSION / T-LIVE-READER / T-RECONCILE-FORK. **NEXT: C.3 boot-identity** (task-s2-c.3-boot-identity-per-host.md, design 52bdb7e) — anchor pre-compress.sh on otmux pane.self, role@host from live title via c.0 identity.resolve, @host dir, fail-safe never write shared unknown/ sink. See context.md "OTR-3 / C-family PROGRESS" block. Flagged for PO: g.4 (process.running bash-parent mis-detect), host-naming @WODA.prod-vs-@v60211, otmux pane.get stray-newline.

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
