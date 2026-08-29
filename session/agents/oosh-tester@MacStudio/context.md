> # ⛔ DEPRECATED 2026-07-03 — STALE MacStudio SHADOW, DO NOT READ AS CURRENT STATE ⛔
> **STOP — verify, don't trust.** This is the ~2mo-stale MacStudio shadow (last update 2026-07-03). MacStudio confirmed
> inactive (no live session/bridge/registry entry, 30+ days git-silent, WODA.prod-measured 2026-08-29).
> **LIVE ANCHOR → `session/agents/oosh-tester/context.md`** (oosh-po's live WODA.prod worker). If you booted into THIS
> file, you mis-resolved: stop, re-measure your host/identity, open the live anchor + git log. Deprecated by oosh-PO
> authorization (cross-team boot-currency sweep); kept for historical trace only. ⚠ If a MacStudio oosh-tester IS live,
> this banner is wrong — flag oosh-PO to coordinate with the MacStudio PO.

# oosh-tester@MacStudio — context [DEPRECATED — see banner]

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
- **#13 / T-DASH-GUARD** (`test.dash.guard`, dev a8f7728): CLOSED. init/oosh already bash-self-heals (POSIX-sh + re-exec @287). 5/5 both envs. PO-accepted.
- **#34 / T-INSTALL-NONDESTRUCTIVE** (`test.install.nondestructive`, dev b550156): CLOSED (signed off 68254e1e on my independent test). existing $HOME/oosh→timestamped .pre-oosh backup, rm -f symlink-gated, no rm -rf, + isolated sandbox marker-survives. 4/4 both envs.
- **/root/oosh residue RESET** (my #13 incident had relocated the donges checkout there): re-cloned root-owned dev at b550156. Box clean.
- **#35 filed** (from my root-cause): SOURCE-guard — refuse/copy-not-move a live OOSH_DIR (a3b1eff fixed TARGET side only).

## Open / handed off (all on the S5 throwaway container — the common unblock)
- **S5 Step 2 (P2 container)**: STOPPED per "no-rabbit-hole". Infra proven (`odocker run.sshd` provisions naked_ubuntu sshd), 2 frictions: donges not in docker group (odocker as root only); naked container needs authorized_keys before ossh install. Awaiting PO go / friction fix.
- **S8 reconcile** (expert 09d33c9): T-RECONCILE + T-RECONCILE-IDEMPOTENT on the SAME fresh container (co-resident WODA.test reverts CONFIG_PATH).
- **#13 full e2e** ("reaches [oosh]" under sh): deferred to the same container (non-destructive on live boxes).
- **#34 (I found this)**: constructor must not destroy an existing install — full init wiped `/home/donges/oosh` mid-`mv`; verify isolated on the E1.2 container, NEVER a live oosh dir. Restore recipe in [[oosh-tester-learnings]].
→ ONE fresh linux container unblocks S5(P2) + S8(reconcile) + #13(e2e) + #34(safety), all gated on the same docker-group + key-injection setup.

## Status
Contexts healthy. Shipped this arc (all independent tests, GREEN both envs): S4/S6 (XOR+platform), F2/T-NO-SUDO-HANG, E-FLAGS.2/T-NO-FLAGS (budget 0), #13/T-DASH-GUARD (reframe-closed), #34/T-INSTALL-NONDESTRUCTIVE, **#35/T-SOURCE-GUARD (dev 1e4d735, 3/3)**. **#34 class fully closed** — target (#34/a3b1eff) + source (#35/34c44cb+10ccc7e).
- Open convergence: S5(P2) + S8(reconcile) + #13/#34/#35 full-e2e → ONE E1.2 throwaway container (docker-group + key-injection).
- **Pre-rewind save @ ~89% used** (SM-directed, post-major-task cadence). Idle, nothing interrupted. New lessons in [[oosh-tester-learnings]]: RED→GREEN TDD flip, code-pattern-fence-never-execute-the-destructive-bug, independent-test-is-the-gate. [[oosh-tester-learnings]]
