# oosh-tester@MacStudio — context

## Identity
- **Role**: oosh-tester (verify; never implement — expert owns HOW, architect WHAT/WHY)
- **Pane**: ooshTeam:0.3 (MacStudio). Tester shell = **ooshTeam:0.5**. Expert = 0.2, PO = 0.0.
- **Repos**: work/report in Web4AI (`main`, this repo) via git mailbox; OOSH code in `once.sh` `dev` branch.
- **Dev worktree** (author tests here, push to origin/dev): `/private/tmp/oosh-dev-s2s3` (on `dev`).
- **Live test box**: WODA.test = `root@178.254.18.182` (`ssh WODA.test`), then `su - donges`. Checkout `/home/donges/oosh` on `dev`.

## Delivery loop to WODA.test (donges CANNOT git-pull — no GitHub key)
As **root**: `git -C /home/donges/oosh fetch origin && git -C /home/donges/oosh reset --hard origin/dev && chown -R donges:donges /home/donges/oosh` → then `su - donges` to run. (reset-as-root leaves files root-owned → the chown is mandatory or donges tests misbehave.)

## Shipped this session (setup-server cross-platform sprint + Death-to-Flags)
- **S4** P1 self-bootstrap: DEV XOR crossing live-verified (20→21 redirect→22→23 user.installation.done, no stall); D1 order + D3 linux `/home/shared` paths; idempotent. PO-approved.
- **S6** regression tests (dev): `test.setup.server.order` (T-STATE-ORDER + T-MODE-XOR, 12/12), `test.platform.defaults` (8/8). PO-approved.
- **F3** released arm: closed via function-level RESULT probe (branch pins OOSH_MODE — see learnings).
- **F2 / T-NO-SUDO-HANG**: naked constructor no longer blocks on sudo password (`sudo -n`, defers to user band RESULT=20). `test.no.sudo.hang` 7/7 GREEN.
- **E-FLAGS.2 / T-NO-FLAGS**: Death-to-Flags fence — `test.no.flags`, budget tightened 1→0 after otmux `--force` cleanup (#33). 0 signature-flag + 0 soft-value. GREEN both envs. Independent co-confirm commit 75250dc = what let PO sign off.

## Open / handed off
- **S5 Step 2 (P2 container + S8 T-RECONCILE)**: STOPPED per PO "no-rabbit-hole" guardrail. Infra proven (`odocker run.sshd` provisions a naked_ubuntu sshd container), but 2 frictions: donges not in docker group (odocker only works as root); naked container needs authorized_keys injection before ossh install. Awaiting PO go / friction resolution.
- **S8 reconcile** (expert 09d33c9) needs T-RECONCILE on the SAME fresh container (co-resident WODA.test reverts CONFIG_PATH).

## Status
Contexts healthy, no rewind. Idle-hold after this save. [[oosh-tester-learnings]]
