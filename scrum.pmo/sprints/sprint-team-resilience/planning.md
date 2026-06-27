# Sprint: Team Resilience & Self-Healing — the team fixes every gap from the WODA.prod restore

**Epic**: A team is a self-healing object. Kill the tmux server → both teams come back (TRAINED, renamed role@host, /rc, audit clean) with ZERO human intervention. Every gap oosh-po hit hand-restoring becomes reliable tooling.
**Origin (measured)**: WODA.prod tmux server died (`otmux kill ooshTeam` on last session → server auto-exit). Hand-restore exposed ~13 gaps. JSONLs survived → recoverable, but the manual process was brittle and slow.
**Owner**: WODA.prod team (just restored) drives · oosh-po@MacStudio guardian/QA · SM coordinates
**Status**: PLANNED

## DOGFOOD ACCEPTANCE (the whole point)
On a test host: `tmux kill-server` → within the watchdog interval, BOTH teams auto-restore — trained sessions resumed, renamed role@host, every agent under /rc, `consistency.audit`=0 — **no human touches anything.** That proves self-healing.

## Stories (each = a gap I hit, measured)

### S-1 Discovery truth: resume-uuid from PROCESS ARGS, not customTitle (claudeCode-expert)
session.id/discovery resolve by customTitle → return CLONE uuid when clones share a role title. I chased a FALSE "restore failed" signal for many turns; process args (`--resume <uuid>`) were the truth.
- [ ] `claudeCode session.id`/discovery use the live process `--resume` arg as ground truth (customTitle only as label)
- [ ] T: pane running trained uuid → session.id returns TRAINED, never the clone

### S-2 Trained-vs-clone selection by MAX line count + clone hygiene (claudeCode-expert/tester)
"Newest" JSONL ≠ trained — newest grabbed CLONES (tens of lines). Trained = thousands of lines.
- [ ] role→canonical-uuid = MAX line count (trained); never newest-by-mtime
- [ ] `claudeCode list`/restore mark clone (tens) vs trained (thousands); option to archive clones so resolution is unambiguous
- [ ] T: role with clone+trained JSONLs → selector picks trained

### S-3 Reliable restore primitive (hiveMind-expert)
fork hit resume menus + landed on wrong sessions; C-c didn't kill the TUI.
- [ ] restore RESUMES exact trained uuid (`claudeCode join`/`--resume`), never fork-with-menu
- [ ] clean-slate via `tmux respawn-pane -k` (C-c does NOT kill the claude TUI)
- [ ] wait-for-load gate before /rename+/rc (large sessions load slowly; slash cmds mid-load are lost) + verify each landed
- [ ] per-pane PDCA, idempotent (re-run skips already-correct panes), verify by process args
- [ ] T: 4 clone-polluted panes → restore → all 4 trained, renamed, /rc

### S-4 Reliable `hiveMind teams.save`/`teams.restore <host>` (hiveMind-expert)
One command restores a whole team: snapshot(role→trained-uuid→pane) → respawn+join trained + rename role@host + /rc-each + register + consistency.audit. Composes S-1/S-2/S-3.
- [ ] teams.save writes trained-uuid (max-line) per role; teams.restore rebuilds deterministically
- [ ] T: kill a team session → teams.restore → team back, audit clean

### S-5 Crash-prevention: keepalive anchor + otmux kill guard (otmux-expert)
`otmux kill <last-session>` → tmux server auto-exits → ALL agents die. (root cause this incident.)
- [x] KEEPALIVE ANCHOR live on WODA.prod (done by PO) — make it STANDARD: hiveMind ensures a permanent `__keepalive` session on every host
- [ ] `otmux kill <session>` must NOT down the server on the last session — warn/refuse or auto-keepalive-first or detach-not-destroy; guard an agent killing its OWN session. NO --flags (oosh violation) — positional/method.
- [ ] T: kill last team session → server SURVIVES (keepalive holds), teams recoverable

### S-6 Self-healing watchdog (hiveMind-expert)
- [ ] external loop (keepalive pane / systemd, NOT a Claude agent) checks each registered team; missing/dead agent → auto teams.restore that agent from trained JSONL; idempotent
- [ ] on tmux-server death → auto-rebuild ALL teams from snapshot
- [ ] T (DOGFOOD): `tmux kill-server` on test host → both teams auto-restore, /rc, audit clean, zero human action

### S-7 Fresh-host provisioning + open migration gaps (expert + ossh/otmux-expert)
Roll in the migration-endeavor gaps (these blocked WODA.test/prod):
- [ ] #13 claudeCode install dash-bashism (force bash) · #14 node version (side-by-side) · #7 target-hash JSONL placement · workspaces dangling-symlink · rename-over-ssh verify+retry · `otmux new` no-attach from remote shell · fork accept/normalize short uuid
- [ ] team.push provisions a fresh host end-to-end (clone workspace, materialize workspaces/, dep-repos, claude install, node) — NOT manual

## Sequencing
S-1,S-2 (truth+selection) → S-3 (restore primitive) → S-4 (teams.restore) → S-6 (watchdog) ; S-5 (keepalive+kill-guard) parallel ; S-7 (fresh-host) parallel. Dogfood S-6 last.

## Guardrails
Per-pane PDCA, no for-loops hiding failures. Measure by PROCESS ARGS not session.id. Trained = max line count. NO --flags. After each story: agents save ctx+learnings → trainer rewind.

## Report-back
- per story owner:

## S-3b RESTORE inherits STALE @host in customTitle (CMM3-verified 2026-06-27)
When a trained session is RESTORED, its customTitle carries the OLD host (robbin agents resumed showing `robbin-X@MacStudio` / `@opus`, not `@WODA.prod`) → /rc lists them under the wrong host. The restore /rename to role@CURRENT-host did not land (slash cmd lost on loading sessions = S-3).
- [ ] restore/teams.restore MUST set customTitle to `role@<currentHost>` and VERIFY it changed (re-measure customTitle == role@host; retry until it sticks) before declaring the agent restored
- [ ] /rename reliability over ssh: send → verify customTitle changed → retry (do not fire-and-forget on a loading session)
- [ ] T: restore a @MacStudio-titled session onto WODA.prod → customTitle becomes role@WODA.prod, /rc lists it under WODA.prod
