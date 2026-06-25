# Sprint: hiveMind team.push — verified whole-team migration controller

**Epic**: One command (`hiveMind team.push <host>`) migrates a full agent team to a target dev box — zero manual steps, MVC-consistent throughout, every agent under /remote-control, final consistency.audit clean.
**Owner**: oosh-po@WODA.prod (sprint planning + driving)
**Status**: **REDO on clean macos.latest base** (0e5f7dd). Prior work preserved at `origin/dev-teampush-astray`. Expert cherry-picking 4 impl commits (8ca434e→9d48bd0→ee12cde→07e8a06→3c3d186) onto clean base. Tester cherry-picking 16 tests. Target: 16/16 green on clean base → merge BACK to macos.latest (the MVC master)
**Created**: 2026-06-24
**Source story**: `session/tasks/hivemind-team-push-controller.md` (12 manual steps + gaps)
**Migration learnings**: `session/tasks/migration-learnings-for-teampush.md` (13 hard-won lessons from 2 live manual migrations — ooshTeam + robbinTeam2)

## Collaboration Model

| Role | Agent | Location | Responsibility |
|------|-------|----------|----------------|
| **Sprint PO** | oosh-po@WODA.prod | ooshTeam:0.0 (v60211) | Plan sprint, drive tasks, verify deliverables, dogfood |
| **Source-side reference** | oosh-po@MacStudio | ooshTeam:0.0 (MacStudio) | Lived the manual journey, reviews automated-vs-manual at each milestone, QA sign-off |
| **Architect** | oosh-architect | ooshTeam:0.1 (needs fork to WODA.prod) | Controller design: team.push choreography, per-step verify-or-fail, MVC state machine |
| **Expert** | oosh-expert | ooshTeam:0.2 (needs fork to WODA.prod) | Implement in hiveMind/claudeCode/otmux on dev branch |
| **Tester** | oosh-tester | ooshTeam:0.3 (needs fork to WODA.prod) | T-TEAM-PUSH test suite, dogfood verification |

**Communication**: task files in `session/tasks/`, one-line nudges via `hiveMind agent.send`. Sprint planning.md is the living truth — tick checkboxes as commits land. oosh-po@MacStudio reviews at QA-REVIEW gates.

**Bootstrap chicken-and-egg**: architect/expert/tester are offline on WODA.prod (need forking). The FIRST deliverable of this sprint is to manually fork 1-2 agents using the known manual procedure, so they can build the automated version. This is acceptable — building the tool that eliminates manual work requires one manual round.

## Stories (decomposed from the 12 manual steps + /rc)

### S-0: Bootstrap — fork expert to WODA.prod (MANUAL, one-time)
Manual fork of oosh-expert (a43c1b23) to ooshTeam:0.2 on WODA.prod, using the proven manual procedure:
- scp JSONL to TARGET hash dir (`-var-dev-Workspaces-AI-Claude/`)
- `cd /var/dev/Workspaces/AI/Claude && claudeCode fork <full-uuid>` in the target pane
- `/rename oosh-expert@WODA.prod`, `/remote-control`
- Verify: pane.get.target + session.name + claudeCode list + /rc URL

Pre-req: the expert is now on dev box and can implement.

- [x] JSONL transferred to target hash dir (oosh-po@MacStudio scp'd all 3: architect 6df08923, expert a43c1b23, tester 74f27969)
- [x] Fork + resume-full in ooshTeam:0.1 (architect — resume menu → option 2), 0.2 (expert — auto-full), 0.3 (tester — resume menu → option 2)
- [x] Rename `@WODA.prod` + /rc active on ALL THREE (URLs captured in pane captures)
- [x] Verified: team.status shows all 4 agents, correct roles, registry.set done
- Status: **DONE**
- Owner: oosh-po@WODA.prod (manual procedure proven) + oosh-po@MacStudio (source-side scp)

### S-1: Target-hash placement fix (prereq — the #7 core fix)
Fix `agent.restart.remote` / `teams.migrate` to place JSONLs in the TARGET project-hash dir, not the source's. Compute target hash from the target workspace path.

Reuse: `private.claudeCode.decode.projectHash` (reverse) or implement `private.claudeCode.encode.projectPath` (forward: `/var/dev/Workspaces/AI/Claude` → `-var-dev-Workspaces-AI-Claude`).

- [x] `private.claudeCode.projectHash <path>` — compute project hash from workspace path (8ca434e)
- [x] `teams.migrate` / `agent.restart.remote` use TARGET hash for JSONL placement (8ca434e — 3 sites fixed)
- [ ] `claudeCode list` on target surfaces the placed sessions (needs live verification)
- [ ] Test: T-PUSH-HASH — push to target with different $HOME, assert `claudeCode list` sees it
- Status: **S-1 DONE** (8ca434e) — test pending
- Owner: oosh-expert (implement) + oosh-tester (test)
- Ref: `session/tasks/pushed-team-data-discovery.md` (#7)

### S-2: Session-state repo sync + workspace replication (L12)
Add workspace repo sync to the push choreography: `git push` on source → `ssh <host> "cd <targetWorkspace> && git pull"`. The fork boots blind without context.md/learnings.md/task files.

**L12 addition**: also replicate workspace symlinks. Agents reach their work repos via symlinks from CWD (e.g. `Claude/workspaces/Web4RawBin` → the actual repo). The controller must: clone the work-repo on the target if missing, then recreate the symlink structure.

- [ ] `team.push` syncs workspace repo (push+pull) before any JSONL transfer
- [ ] Handles: target workspace dir doesn't exist (error clearly), target repo diverged (pull --ff-only, fail clearly on conflict)
- [ ] Replicate workspace symlinks: discover `workspaces/*` symlinks on source, clone targets on host if missing, recreate links
- [ ] Test: T-PUSH-REPO — verify agent files present on target after push
- [ ] Test: T-PUSH-WORKSPACE-LINKS — verify workspace symlinks replicated + resolve correctly on target
- Status: PLANNED
- Owner: oosh-expert

### S-2b: Identity resolution — session.name is the ONLY truth (L1, L2, L3)
**THE fundamental migration lesson**: `claudeCode list` role labels are stale/shifted, `hiveMind team.status` live-discovery mislabels agents, pane titles and registry can be wrong. The ONLY reliable identity is `claudeCode session.name <uuid>`.

The controller's pre-fork discovery must:
1. **Resolve every agent's role via `session.name`**, never from list/team.status/pane-title. (L1)
2. **Dedup duplicate titles by recency + training size.** Two sessions can have the same customTitle (e.g. two `robbin-tester@MacStudio`). Pick the newest-trained (mtime + JSONL line-count) as canonical; surface duplicates for confirmation. (L2)
3. **Fork even if the canonical agent is DEAD.** The real trained agent may show as DEAD in `claudeCode list` while a stale older incarnation is "live". JSONL is resumable — dead ≠ skip. (L3)

- [ ] `private.hiveMind.push.resolveCanonical <role> <session>` — returns the canonical UUID via session.name, deduped by recency+training
- [ ] Handles dead agents: fork their JSONL regardless of live/dead status
- [ ] Surfaces duplicate titles with a clear report (which UUID, which mtime, which line-count)
- [ ] Test: T-IDENTITY-TRUTH — mapping comes from session.name only, never list/status/title
- [ ] Test: T-DEDUP — two sessions with same customTitle → picks newest-trained
- [ ] Test: T-DEAD-CANONICAL — dead canonical agent's JSONL is transferred and forked successfully
- Status: PLANNED
- Owner: oosh-expert (implement) + oosh-architect (design the resolution chain)
- Depends: S-1

### S-3: Per-agent JSONL transfer + verify (with target hash)
For each agent in the snapshot: locate source JSONL, compute target hash, mkdir + scp, verify with `claudeCode list` on target. Per-pane PDCA (no batch-then-hope).

- [x] Loop over snapshot, per-agent: locate → hash → mkdir → scp → verify (MANUALLY PROVEN: 3 agents scp'd by MacStudio PO to target hash dir)
- [x] Full UUID (8-4-4-4-12) — normalize short UUIDs if encountered (GAP 8a) (PROVEN: all 3 used full UUID)
- [x] `claudeCode list` on target shows the agent (verify step) (PROVEN: MacStudio PO confirmed discoverable)
- [ ] Test: T-PUSH-JSONL — multi-agent transfer, all discoverable
- Status: **MANUALLY PROVEN** — needs automation in team.push
- Owner: oosh-expert
- Depends: S-1 (target-hash fix)

### S-4: Fork + resume-full handling
Fork each agent in its target pane: `cd <targetWorkspace> && claudeCode fork <full-uuid>`. Handle the resume menu deterministically (zoom → fork → wait → send `2` for full, never summary → verify prompt or /rc).

- [x] `cd` to TARGET workspace (not source-derived path — GAP 8b) (PROVEN: all forks from /var/dev/Workspaces/AI/Claude)
- [x] `claudeCode fork <full-uuid>` (normalize short UUIDs) (PROVEN: 3 agents forked)
- [x] Resume menu: detect + select option 2 (full), verify agent at prompt (PROVEN: architect+tester hit menu→option 2; expert auto-resumed — controller must handle BOTH cases)
- [ ] Zoom management: zoom before fork (menu needs width), unzoom after
- [ ] **L8 BUG**: `otmux new` attaches the caller when not in tmux — controller creating a new team session from a plain ssh shell gets nested. Fix: use detached create path (`otmux new <name> -d`), or fix otmux.new to never attach the driver. Mind signature: `<?name> <?command>` — `-x/-y` args get swallowed as command.
- [ ] Test: T-PUSH-FORK — fork completes, agent at idle prompt
- Status: **MANUALLY PROVEN** — needs automation; controller must detect menu vs auto-resume + fix L8 attach bug
- Owner: oosh-expert
- Depends: S-3

### S-5: Rename + title + lock + registry + /remote-control
Per agent post-fork: `/rename role@<targetHost>` (double-Enter for slash cmd), `otmux pane.lock <pane> role@<host>`, `hiveMind registry.set`, and **immediately** `/remote-control` (Tron: every migrated agent under /rc the moment it's up). Capture /rc URL as proof.

- [x] `/rename role@<host>` (slash cmd: double-Enter) (PROVEN: all 3 renamed @WODA.prod)
- [x] `registry.set` (MVC Controller consistent) (PROVEN: all 3 registered manually)
- [x] `/remote-control` immediately → capture URL (PROVEN: all 3 /rc active)
- [x] Verify: pane title == session name == registry role == `role@<host>` (PROVEN: team.status shows all correct)
- [ ] `pane.lock` (not done — cosmetic, add to automation)
- [ ] **L7**: Per-pane verify each rename: capture pane → assert "Session renamed to role@host" BEFORE moving to next agent. Batched renames over double-hop (MacStudio→ssh→otmux→pane) FAIL silently. Same for /rc: capture → assert "/rc active" + URL present.
- [ ] Test: T-PUSH-IDENTITY — all 4 MVC identity stores agree + /rc URL captured
- [ ] Test: T-RENAME-VERIFY — after /rename, pane capture contains "Session renamed to <expected>"
- [ ] Test: T-RC-VERIFY — after /remote-control, pane capture contains "/rc active" + URL
- Status: **MANUALLY PROVEN** — needs automation; must also write forked UUID to sessions.env (GAP #12) + per-pane verify (L7)
- Owner: oosh-expert
- Depends: S-4

### S-6: Per-step verify-or-fail + MVC consistency throughout
Every step above MUST verify (capture + assert) before proceeding. Fail loudly on any mismatch — never leave MVC in a half-consistent state. Build on `check … fix` idiom and `consistency.audit`.

- [ ] Each step has explicit verify (capture pane → assert condition → continue or error). **L11**: per-pane PDCA, NOT batch-then-hope — verify each agent before proceeding to the next.
- [ ] On failure: stop, report which step + which agent + what went wrong
- [x] MVC state audited at end of each agent's migration (not just at the end) (PROVEN: consistency.audit ran, caught 5 violations → fixed → 0 = CLEAN)
- [ ] **L10**: reconcile ALL MVC stores to `session.name` truth at EACH step (not just final audit). After every fork/rename: registry, pane title, sessions.env must agree with session.name.
- [ ] **GAP #12 PROVEN LIVE**: manual forks leave sessions.env empty (forked UUID ≠ parent UUID, non-invasive discovery can't resolve). Controller MUST: (a) capture the forked JSONL UUID by matching customTitle `@WODA.prod` in the target hash dir, (b) write it to sessions.env immediately after fork. JSONL-correlation pattern: `grep customTitle ~/.claude/projects/<targetHash>/*.jsonl` → match `role@host` → extract UUID from filename.
- [ ] **L9**: `consistency.fix` is interactive (y/N, aborts with no input) and `consistency.reconcile --apply` uses a **flag** (OOSH violation). Controller needs a **flagless non-interactive reconcile** method — e.g. `hiveMind consistency.reconcile.apply` (object.verb, no flag). This is a prereq for automated team.push.
- [ ] Test: T-PUSH-FAIL — inject a failure (e.g. wrong UUID), assert controller stops + reports cleanly
- [ ] Test: T-RECONCILE-NONINTERACTIVE — flagless reconcile applies all fixes without prompting
- Status: **GAP DOCUMENTED** — needs automation with UUID-capture-on-fork + flagless reconcile + per-step MVC reconciliation
- Owner: oosh-expert (wiring) + oosh-architect (verify-chain design)

### S-7: Final parity gate — consistency.audit on target
After all agents migrated: run `hiveMind consistency.audit <targetSession>` on the target. Must return 0 mismatches. Compare agent count, roles, UUIDs, pane titles, registry, session names — source team == target team.

- [x] `consistency.audit ooshTeam` on target → **CLEAN (0 violations, all 10 invariants pass)** after manual fix cycle
- [x] Zero mismatches = success (PROVEN: 5 violations found → 3 HIGH fixed via sessions.env UUID write, 2 MEDIUM fixed via title reconcile → 0 = clean)
- [ ] `team.push` must run this automatically (via `ossh exec`) as final gate
- [ ] Test: T-PUSH-PARITY — full migration, audit returns clean
- Status: **S-7 GATE PASSED MANUALLY** — needs automation in team.push
- Owner: oosh-tester (runs the audit, reports)
- Depends: S-5, S-6

### S-8: Snapshot hygiene — list + prune
Kill the unbounded snapshot accumulation (42 on WODA.prod). `hiveMind snapshots list`, `hiveMind snapshots prune <?keep:5>`.

- [ ] `hiveMind snapshots list` — list `~/config/hivemind.snapshot.*` with dates + agent count
- [ ] `hiveMind snapshots prune <?keep:5>` — keep N newest, delete rest
- [ ] WODA.prod's 42 snapshots cleaned
- [ ] Test: T-SNAP-PRUNE — create 10, prune to 3, verify 3 remain
- Status: PLANNED
- Owner: oosh-expert
- Independent (no dependency, can run in parallel)

### S-9: Dogfood — re-migrate this team (idempotent)
The acceptance test: use the finished `hiveMind team.push WODA.prod` (from MacStudio) to re-migrate the ooshTeam. Compare result to the manual migration. Must be identical: all agents live, /rc active, consistency.audit clean, claudeCode list complete.

**QA-gate review note (oosh-po@MacStudio):** WODA.prod already has skeleton ooshTeam panes (0.0–0.3). `team.push` must handle EXISTING panes — detect a running Claude and skip/update (not create a duplicate session), or respawn the pane cleanly. Re-running `team.push` on an already-migrated team must be safe (idempotent: same result, no duplicates, no corruption). Add collision detection to S-4 (fork step) and S-5 (rename step) — if the pane already has the right agent, verify-and-skip, don't re-fork.

- [ ] `hiveMind team.push WODA.prod` from MacStudio
- [ ] All agents forked, renamed, /rc active
- [ ] **Idempotent**: re-running on an already-migrated team produces the same result (no dup sessions, no stale panes)
- [ ] **Collision handling**: existing panes with running Claude → detect, verify identity, skip-or-update (not re-fork)
- [ ] `consistency.audit` clean on WODA.prod
- [ ] `claudeCode list` on WODA.prod shows all agents
- [ ] oosh-po@MacStudio QA sign-off
- Status: PLANNED
- Owner: oosh-po@WODA.prod (dogfood) + oosh-po@MacStudio (QA)
- Depends: ALL above

## Sequencing

```
S-0 (bootstrap — DONE)
 ↓
S-1 (target-hash fix) ←── S-8 (snapshot prune, parallel)
 ↓
S-2 (repo sync + workspace symlinks — L12)
 ↓
S-2b (identity resolution: session.name truth + dedup + dead-canonical — L1/L2/L3)
 ↓
S-3 (JSONL transfer+verify — MANUALLY PROVEN)
 ↓
S-4 (fork+resume + fix otmux.new attach bug L8 — MANUALLY PROVEN)
 ↓
S-5 (rename+lock+registry+/rc + per-pane verify L7 — MANUALLY PROVEN)
 ↓
S-6 (verify-or-fail + flagless reconcile L9 + per-step MVC reconcile L10 + per-pane PDCA L11)
 ↓
S-7 (final parity gate — MANUALLY PROVEN)
 ↓
S-9 (dogfood — idempotent)
```

### Controller spine (from migration learnings — the full chain)
```
session.name = truth → dedup+canonical (recency/training) → place in target hash →
fork full-uuid (cd target) → per-pane verify → rename role@host (verified) →
/rc (verified) → reconcile non-interactively → consistency.audit == 0
```
With workspace repo+symlinks synced before any JSONL transfer.

## Velocity guardrails
- Check `scrumMaster subscription` before each delegation wave (minimize new prompts — context replay = the burn).
- No more than 2 agents working in parallel (subscription constraint).
- Per-pane PDCA — no for-loops on multi-pane ops.
- Expert context check before assignment (never pump an exhausted agent).

## Report-back
- oosh-po@WODA.prod (sprint planned): **DONE** — 9 stories (S-0→S-9), sequenced, collaboration model defined, dogfood acceptance. Reported to oosh-po@MacStudio.
