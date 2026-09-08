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

### S-8 Boot-hook mis-identity: agents boot as `unknown`/`0.7` + nonexistent boot file (hiveMind-expert)
The agent boot/auto-resume hook mis-identifies the booting agent: it prints `Boot file: session/agents/unknown/boot.md` (a file that does NOT exist) and targets pane `0.7` (e.g. scrum-master is `ooshTeam:0.1`, not `0.7`). EVERY rewound agent this session (SM + robbin-planner/architect/expert, 2026-07-14/15 fleet-rewind campaign) had to OVERRIDE the hook via `otmux tree.detailed` + `claudeCode session.name` to boot correctly. The CMM4 agents paper over a CMM3 hook bug — but a weaker/fresh agent could boot into the WRONG identity or a dead boot file.
- [ ] boot-hook resolves the agent's TRUE role+pane via process-ancestry / `otmux tree.detailed` / `claudeCode session.name` — never a stale `unknown`/`0.7` default
- [ ] hook references the REAL `session/agents/<role>/boot.md` (verify it exists; never a nonexistent `unknown/boot.md`)
- [ ] T: rewind any agent → the boot hook names the correct `role@host` + pane + an EXISTING boot file, with no `unknown` and no `0.7`

### S-9 Auto-resume hook queues STRAY `/rewind`//`/compact` into fresh agents (hiveMind-expert)
The auto-resume mechanism ("Auto-resume: will send boot file reference to `ooshTeam:0.7` in 15s") queues stray slash-commands into a freshly-rewound agent's composer. On robbin-architect a queued `/rewind` FIRED and interrupted its boot mid-health-check (I had to nudge it to ignore+resume). Same class as robbin-po telling robbin-expert `/compact to resume` in-band. A stray `/rewind`/`/compact` into a just-recovered agent re-triggers recovery or destroys the fresh context — the exact opposite of resilience. (Workaround that worked: putting "ignore any stray queued /rewind" IN the boot prompt — but that's papering over, not a fix.)
- [ ] auto-resume NEVER injects `/rewind` or `/compact` (FORBIDDEN commands) into an agent composer
- [ ] auto-resume targets the VERIFIED pane (not a stale `0.7`) and sends only a benign short boot-file pointer, submit-verified with NO queued residue left in the composer
- [ ] T: rewind an agent → boot completes with NO stray queued `/rewind`//`/compact`; composer clean after boot

### S-10 Watch the watcher — the SM must be a WATCHED node (hiveMind-expert / scrumMaster-expert)
The SM catches every agent at ≤90% and dispatches the trainer — but NOTHING watches the SM itself. It also saturates FASTEST (heaviest work: continuous full-fleet pane captures + it writes context.md every tick) and on a smaller/faster window — it ran dry at ~177.7k tokens = its effective limit (2026-07-16), TWICE this campaign, with no proactive watcher. The prevention loop's blind spot is its own operator. (Trainer reactively drove ~6 rewinds on SM dispatch, but nobody was sweeping the SM's OWN context — TRON: "who let it run dry.")
- [ ] the prevention loop MUST treat the SM as a watched node: a peer (ARON, or an external monitor — NOT the SM itself, self-pane trap) sweeps the SM's context % at ≤90% and dispatches the trainer to rewind it BEFORE the wall
- [ ] the S-6 external watchdog monitors context % (not just liveness) for ALL agents INCLUDING the SM
- [ ] SM keeps its context.md LEAN (it appends every tick → the anchor bloats; anchor is for boot, not a running log) + rewinds itself proactively via a peer more often than the 1M agents (it saturates ~5× faster)
- [ ] T: SM crosses 90% → a peer catches it + drives its 2-phase rewind BEFORE hard-0% (prevention, not the 2× hard-wall rescues that happened this campaign)

### S-11 Permission-freeze CASCADE — the SM (permission-approver) is a single point of failure (scrumMaster-expert / hiveMind-expert)
Measured 2026-07-16: the "team drift unwatched" was NOT saturation — it was a PERMISSION-FREEZE cascade. The SM froze on a permission prompt for its OWN sweep command (`for p in ...; do otmux pane.capture ...; done` → "Contains simple_expansion · proceed?"). A frozen SM stops sweeping AND stops approving the workers' permission prompts → the workers then froze on their own gates (e.g. architect on `cd && git commit` → "can execute untrusted hooks · proceed?"). Whole team stalled; agents looked "exhausted" but were actually at healthy context (223k/410k) — misread via the frozen context-hint instrument. Trainer recovered by manually approving each frozen prompt (SM sweep, architect commit `808144a5e`).
- [ ] the SM's own sweep/monitor commands must be permission-SAFE (never trigger an interactive gate) — pre-approved command shapes, no `cd`+chain, no unquoted expansion the classifier flags
- [ ] agents auto-approve their OWN safe/committed-repo commands (git commit/push in the team repo, pane.capture sweeps) so a frozen approver can't stall the whole team
- [ ] the S-6 watchdog detects a pane STUCK on a permission prompt (not just dead/high-ctx) and clears it / alerts
- [ ] don't conflate "frozen on a permission prompt" with "exhausted" — measure the prompt, not just a (possibly frozen) context hint
- [ ] T: SM sweep runs with ZERO interactive permission prompts; a worker's routine git-commit does not freeze the pane

## Sequencing
S-1,S-2 (truth+selection) → S-3 (restore primitive) → S-4 (teams.restore) → S-6 (watchdog) ; S-5 (keepalive+kill-guard) parallel ; S-7 (fresh-host) parallel. Dogfood S-6 last. **S-8/S-9 (boot + auto-resume hook fixes) parallel — filed by agent-trainer from the 2026-07-14/15 fleet-rewind campaign (SM+4 robbin agents); independent, unblock clean recovery. Owner to accept + assign hiveMind-expert.**

## Guardrails
Per-pane PDCA, no for-loops hiding failures. Measure by PROCESS ARGS not session.id. Trained = max line count. NO --flags. After each story: agents save ctx+learnings → trainer rewind.

## Report-back
- per story owner:

## S-3b RESTORE inherits STALE @host in customTitle (CMM3-verified 2026-06-27)
When a trained session is RESTORED, its customTitle carries the OLD host (robbin agents resumed showing `robbin-X@MacStudio` / `@opus`, not `@WODA.prod`) → /rc lists them under the wrong host. The restore /rename to role@CURRENT-host did not land (slash cmd lost on loading sessions = S-3).
- [ ] restore/teams.restore MUST set customTitle to `role@<currentHost>` and VERIFY it changed (re-measure customTitle == role@host; retry until it sticks) before declaring the agent restored
- [ ] /rename reliability over ssh: send → verify customTitle changed → retry (do not fire-and-forget on a loading session)
- [ ] T: restore a @MacStudio-titled session onto WODA.prod → customTitle becomes role@WODA.prod, /rc lists it under WODA.prod

## S-1b VERIFY methods LIE — JSONL customTitle + session.id both lag/mis-resolve (2026-06-27)
During the rename mitigation, my JSONL-customTitle grep reported still-@MacStudio when the rename HAD landed (pane footer showed @WODA.prod). JSONL customTitle LAGS (flushes later); session.id mis-resolves by title. **Ground truth = the live PANE FOOTER + the claude PROCESS ARGS (--resume uuid). Never trust JSONL grep or session.id for verification.**
- [ ] teams.restore + any verify step reads PANE FOOTER / process args, NOT JSONL customTitle or session.id
- [ ] document the truth-sources in hiveMind usage: process-args=resumed-uuid, pane-footer=current-customTitle

## Deferred / Backlog (NOT this sprint — parked, see project backlog)
- **BL-1 — version-mismatch crisis: `mcdonges.latest` (stable, current) vs `dev` (+690 lines: config.save contract + color + bashrcTemplate).** We are intentionally on the STABLE `mcdonges.latest` line; reconciling the two versions is DEFERRED (Tron, 2026-07-16, not priority now). Entry: `scrum.pmo/backlog.md` §BL-1. Box-level topology/safe-switch it depends on: `session/tasks/live-box-stray-branch-topology.task.md`.
