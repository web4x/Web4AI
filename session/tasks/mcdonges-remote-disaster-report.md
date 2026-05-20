# McDonges Remote Disaster — Bug Inventory + Cleanup Plan

**Date**: 2026-05-15
**Reporter**: oosh-expert (read-only diagnostics via baseTeam:0.3 SSH shell)
**Sourced by**: TRON directive via oosh-po (ooshTeam:0.0)
**Status**: INVENTORY COMPLETE. CLEANUP AWAITING TRON AUTH. No remote mutations performed.

---

## TL;DR

Agent-trainer ran the **bulk** `hiveMind teams.restore` instead of the **single-session** `hiveMind team.migrate <session> <host>` (commit `dc0cc00`, shipped before this incident). The bulk path:

1. Created **18 tmux sessions** on McDonges from snapshot `hivemind.snapshot.20260430T121706.env` (snapshot file now deleted — only its imprint remains in `~/config/hivemind.teams.env`).
2. Successive bulk-restore runs **appended panes** to existing sessions without idempotency check → ooshTeam grew to **55 panes** (cumulative pane explosion).
3. For each pane with a UUID in the snapshot, fired `claudeCode fork`. **9 live Claude processes** still running on McDonges, each on opus-4-6[1m] (~600s of wall time per the ps etimes — actively burning tokens).
4. Left an **orphan `__restore_init`** session — initial bootstrap session never cleaned up.
5. **30 dead UUID entries** in `~/config/hivemind.sessions.env` (39 total — 9 live, 30 orphaned). Plus inconsistent pane→UUID mappings (UUIDs at panes that don't match where the actual Claude process is running).
6. **tronMonitor.env empty** despite 18 tracked-team-class sessions existing.

---

## Confirmed Bugs

### Bug 1 — 18 sessions cloned instead of 1 (BULK-RESTORE LEAK)

**Evidence:**
```
McDonges:~ > tmux list-sessions -F '#{session_name}|#{session_created}|#{session_windows}|#{session_attached}' | sort
McDonges_native_TRONinterface|1779099584|1|0
TRONinterface|1779099584|1|0
UpDown_ai_po|1779099585|1|0
UpDown_ai_upDownTeam|1779099586|1|0
__restore_init|1779099583|1|0                ← BUG 4
backupTeam|1779099586|1|0
baseTeam|1779099587|1|0
claudeCodeTeam|1779099588|1|0
fallback-agents|1779099589|2|0               ← 2-window session (largest)
hiveMindTeam02_03_26|1779099590|1|0
odockerTeam|1779099591|1|0
ooshTeam|1779099591|1|0                       ← 55 panes (BUG 2)
osshTeam|1779099592|1|0
otmuxTeam|1779099593|1|0
projectTeam|1779099594|1|0
upDownMgmt|1779099595|1|0
upDownTeam|1779099596|1|0
web4team|1779099596|1|0
```
**18 sessions, all created within a 13-second window** (epoch 1779099583..1779099596) — sequential bulk-create signature.

**Cross-reference**: `~/config/hivemind.teams.env` lists 16 of these as "Restored from hivemind.snapshot.20260430T121706.env". Only `ooshDebug` + `UpDown_ai_projectTeam` are from earlier snapshots; remaining 16 from the bulk run.

**Root cause**: Operator (agent-trainer) invoked `hiveMind teams.restore` (no session arg = all-sessions) when intent was a single-session migration. The new `team.migrate <session> <host>` (commit `dc0cc00`) was shipped specifically to prevent this; it had not yet been adopted at incident time.

---

### Bug 2 — ooshTeam: 55 panes (CUMULATIVE PANE EXPLOSION)

**Evidence:**
```
=== ooshTeam pane breakdown ===
  54 zsh
   1 bash

(panes 0.0 through 0.54; titles: 0.0=oosh-po, 0.54=oosh-tester, 0.1-0.53 all "McDonges" — never agent-touched)
```

**Latest snapshot on disk** (`hivemind.snapshot.20260501T140709.env`) has ONLY 6 ooshTeam panes:
```
ooshTeam|0.0|oosh-po||oosh-po|/Users/Shared/Workspaces/AI/Claude||claude
ooshTeam|0.1|oosh-architect|c8f4a7ee-...|oosh-architect|...|claude-opus-4-6[1m]|claude
ooshTeam|0.2|oosh-expert|ea2c7021-...|oosh-expert|...|claude-opus-4-6[1m]|claude
... (3 more)
```

So the 55-pane explosion is **not** from a single snapshot — it's the cumulative result of multiple bulk-restore runs over time. Each run sees missing panes (snapshot has 6, session has 0/N) and calls `tmux split-window` N times. No dedup, no cleanup, no idempotency check on existing pane count.

**Root cause**: `hiveMind.teams.restore` (line ~2940 in hiveMind) lacks "expected-pane-count vs actual" reconciliation. It assumes panes need creation if absent — never considers existing panes that shouldn't be there.

**Smoking gun**: 53 of 55 panes are bare `McDonges`-titled zsh shells — never had agent/role/UUID attached. They are pure pane-creation residue.

---

### Bug 3 — 9 live Claude processes burning tokens

**Evidence (`ps -eo pid,etime,args | grep claude`):**
```
PID    ETIME      UUID                                  Hash     Wall time
22004  08:34:24   c8f4a7ee-ea09-4037-a1ff-e6b5750757cf  Hash     ~8.6 min
11653  08:35:02   6b8bd425-2268-4da3-85ae-532c5a261bc7  Hash     ~8.6 min
97070  08:35:51   23e87d26-883d-4fea-ad2e-d8288662a33f  Hash     ~8.6 min
90475  08:36:19   591d36e7-9c8c-4406-9d94-8d9bc24d5388  Hash     ~8.6 min
72436  08:37:14   2b65b769-b79a-4d54-a174-8a87580b7fe9  Hash     ~8.6 min
96812  08:39:43   14fe53c1-5f08-47df-b9c3-b3ea785d21dd  Hash     ~8.6 min
38547  08:45:01   35916ccb-330e-46a0-8795-0f05f1ebce09  Hash     ~8.7 min
10929  08:42:41   0a3dbfb0-e3a4-432a-b3f8-aee71f9fc4a2  Hash     ~8.7 min
63082  08:47:29   aca3405a-7494-46a6-b152-e1a5fc87f84d  Hash     ~8.8 min
```

**All 9 invocations:**
- Use `--fork-session` (children of stored UUIDs — additional JSONL files being created on McDonges)
- Use `--model claude-opus-4-6[1m]` (1M context, premium cost tier)
- Have `Enter` literal in args (suggests the restore script sent `Enter` as a command-line argument — visible side effect of mis-quoting in the restore path)

**Token math**: 9 simultaneous opus-1M sessions, each running ~8.6 min, each likely processing context. Conservatively: $0.06/1k input, $0.30/1k output. Even at idle, periodic input pings + cache reads at 1M context = nontrivial cost per minute per agent. Multiply by 9.

**Pane mapping inconsistencies** (sessions.env says one thing, tty→pane mapping says another):
| Live PID | UUID start | sessions.env says | Actual tty→pane |
|----------|-----------|-------------------|-----------------|
| 22004 | c8f4a7ee | ooshTeam:0.1 | ooshTeam:0.54 ← MISMATCH |
| 72436 | 2b65b769 | fallback-agents:0.1 | fallback-agents:0.3 ← MISMATCH |
| 97070 | 23e87d26 | fallback-agents:1.1 | fallback-agents:1.3 ← MISMATCH |
| 90475 | 591d36e7 | NOT IN sessions.env | fallback-agents:1.0 ← ORPHAN |
| 63082 | aca3405a | ooshTeam:0.0 AND ooshTeam:0.4 (TWO ENTRIES) | (one process at one tty) ← DUPLICATE |

State files diverged from reality during the chaotic restore.

---

### Bug 4 — `__restore_init` session leftover

**Evidence:**
```
=== __restore_init detail ===
0.0|zsh|McDonges|     ← no start command, no title set, blank capture
```

The session exists with 1 empty zsh pane. Created at epoch 1779099583 — the EARLIEST of the 18 created sessions (1 second before the rest of the bulk-create cycle).

**Inference**: `teams.restore` (or a helper) created a temporary session to run the restore script from, intending to swap to other sessions and clean up. Restore aborted or never reached cleanup phase → orphan stayed.

**Naming pattern** (`__` prefix) matches OOSH convention for test/internal sessions that should be excluded from monitor (tronMonitor blocklist guard, learnings.md "Defense-in-depth for cross-script observers" entry). But this orphan was never blocked from creation in the first place — it's a real session at runtime.

---

### Bug 5 — Dead agents / pane mismatches

**Evidence:**
- **sessions.env: 39 entries, 9 live processes** → 30 entries are dead UUID references.
- **forks.env: 713 entries** — accumulated fork history with 600+ entries presumably referencing UUIDs whose JSONLs are gone.
- **591 JSONL files on disk** under `~/.claude/projects/*/`. Hard to map: how many are live? Each fork creates new JSONL. With 9 live forks + days of bulk-restore attempts, JSONLs are accumulating fast.
- **`tronMonitor.env` is EMPTY** — yet 18 tracked-team-class sessions exist on tmux. Either tronMonitor was never set up post-disaster OR was reset and lost track.

---

### Bug 6 (BONUS — surfaced during investigation) — UUID stored twice for same pane

`~/config/hivemind.sessions.env` has:
```
ooshTeam:0.4|aca3405a-7494-46a6-b152-e1a5fc87f84d
ooshTeam:0.0|aca3405a-7494-46a6-b152-e1a5fc87f84d
```
Same UUID, two panes. Indicates `session.store` was called twice for the same UUID with different pane targets — likely the second call happened when restore moved/re-attached an agent and didn't atomically replace the first entry.

**Architectural implication**: `session.store` should enforce UUID-uniqueness OR pane-uniqueness (sprint-1-design S2 invariant should specify). Currently neither is enforced.

---

## Reproduction Trail

1. `~/config/hivemind.teams.env` shows the snapshot used (16 teams all "Restored from hivemind.snapshot.20260430T121706.env").
2. The snapshot file `hivemind.snapshot.20260430T121706.env` is **not on disk anymore** (ENOENT on `ls`). Latest snapshot is `20260501T140709`, but the teams.env timestamp records what was at restore time.
3. forks.env shows accumulation pattern (713 entries, recent tail timestamps cluster around 2026-05-14 with multiple forks per minute for the same role).
4. The "Enter" in ps args of all 9 live claudes points to a quoting bug in the restore command path — the script sent text including an "Enter" key marker as a positional arg to claude, not as a tmux send-keys key.

---

## Proposed Cleanup Plan (PHASED — DO NOT EXECUTE WITHOUT TRON AUTH)

All cleanup runs via `baseTeam:0.3` SSH shell on McDonges. Each phase is a dry-run-able shell snippet. Tron should auth phase-by-phase.

### Phase 0 — Snapshot the disaster state (forensics-first)

Before ANY mutation. Capture state to a file that survives cleanup so we can post-mortem.

```bash
# On McDonges baseTeam:0.3:
mkdir -p ~/config/disaster.20260515
cp ~/config/hivemind.teams.env       ~/config/disaster.20260515/
cp ~/config/hivemind.sessions.env    ~/config/disaster.20260515/
cp ~/config/hivemind.roles.env       ~/config/disaster.20260515/
cp ~/config/hivemind.forks.env       ~/config/disaster.20260515/
cp ~/config/tronMonitor.env          ~/config/disaster.20260515/ 2>/dev/null || true
ps -eo pid,etime,tty,args > ~/config/disaster.20260515/ps-snapshot.txt
tmux list-sessions -F '#{session_name}|#{session_created}|#{session_windows}' > ~/config/disaster.20260515/sessions-snapshot.txt
tmux list-panes -aF '#{session_name}:#{window_index}.#{pane_index}|#{pane_current_command}|#{pane_title}|#{pane_tty}' > ~/config/disaster.20260515/panes-snapshot.txt
hiveMind teams.save  # writes a fresh hivemind.snapshot.<ts>.env capturing current state
```

### Phase 1 — Kill the 9 live Claude processes (TOKEN BURN STOP — HIGHEST PRIORITY)

```bash
# Show targets first (DRY RUN):
ps -eo pid,etime,args | grep '/Users/donges/\.local/bin/claude --resume' | grep -v grep
# Then:
ps -eo pid,etime,args | grep '/Users/donges/\.local/bin/claude --resume' | grep -v grep | awk '{print $1}' | xargs kill -TERM
sleep 5
# Verify none survived:
ps -eo pid,etime,args | grep '/Users/donges/\.local/bin/claude --resume' | grep -v grep
# If any survived: kill -KILL
```

**Risk**: zero — these claudes are orphans (Bug 5 mismatches show they aren't tied to a meaningful pane). Even if any were active, no human is observing them on McDonges (sessions all unattached: `session_attached=0` for all 18).

### Phase 2 — Kill the 17 surplus tmux sessions (keep baseTeam)

```bash
# Sessions to DELETE — all except baseTeam (our access pane):
for s in McDonges_native_TRONinterface TRONinterface UpDown_ai_po UpDown_ai_upDownTeam \
         __restore_init backupTeam claudeCodeTeam fallback-agents hiveMindTeam02_03_26 \
         odockerTeam ooshTeam osshTeam otmuxTeam projectTeam upDownMgmt upDownTeam web4team; do
  tmux kill-session -t "$s" 2>/dev/null && echo "killed: $s"
done
# Sessions kept: baseTeam (so we still have our shell)
tmux list-sessions
```

**Risk**: zero — all 18 sessions show `session_attached=0`, nobody is actively observing them. The PO's intent was 1 team (ooshTeam) migrated; all others are leak.

**Caveat**: if Tron wants to PRESERVE ooshTeam (the intended single-session migration target), modify the list to keep `ooshTeam` AND fix Bug 2 cleanup in Phase 3. Otherwise nuke all 17.

### Phase 3 — Fix ooshTeam pane explosion (if Tron keeps ooshTeam)

Conditional on Tron preserving ooshTeam. The 6-pane snapshot in `hivemind.snapshot.20260501T140709.env` is the canonical shape. Cleanest path:

```bash
# Nuke and re-restore ooshTeam from the latest valid snapshot:
tmux kill-session -t ooshTeam
hiveMind team.migrate ooshTeam McDonges  # WAIT — this would re-run the migration FROM local TO McDonges
# More direct: use the snapshot already on McDonges:
hiveMind teams.restore ~/config/hivemind.snapshot.20260501T140709.env
# But teams.restore would re-create ALL sessions in that snapshot (back to square one).
# Better: write a single-session subset on McDonges and restore that:
grep -E '^(# |ooshTeam\|)' ~/config/hivemind.snapshot.20260501T140709.env > /tmp/oosh-only.snap
hiveMind teams.restore /tmp/oosh-only.snap
```

**Risk**: medium — `teams.restore` is itself the bug source. Need to verify it deduplicates pane creation now (it might not). Safer to skip Phase 3 entirely if Tron doesn't need ooshTeam on McDonges.

### Phase 4 — Truncate env files to reality

```bash
# Backup first (Phase 0 already covered this).
# sessions.env: keep ONLY UUIDs of live claudes (post Phase 1 kill, this is empty):
> ~/config/hivemind.sessions.env

# roles.env: keep ONLY panes that exist post Phase 2 in surviving sessions (post-kill: only baseTeam):
> ~/config/hivemind.roles.env

# teams.env: keep ONLY surviving tmux sessions:
hiveMind team.list > /tmp/live-teams
> ~/config/hivemind.teams.env
hiveMind team.register baseTeam "Operator shell" 2>/dev/null

# tronMonitor.env: leave empty (already is)

# forks.env: archive (audit log) — copy to disaster.<date>/ then truncate:
mv ~/config/hivemind.forks.env ~/config/disaster.20260515/hivemind.forks.env.archive
echo '# hiveMind fork lineage — append-only audit log' > ~/config/hivemind.forks.env
echo '# timestamp|pane|role|uuid|state|parentUuid' >> ~/config/hivemind.forks.env

# JSONLs: leave on disk. claudeCode.list will mark as DEAD/orphan (color-coded
# per earlier learnings). Manual cleanup of 591 files is a separate decision.
```

### Phase 5 — Validate via consistency.reconcile

```bash
hiveMind consistency.reconcile baseTeam dry-run
# Should report zero violations after Phases 1-4.
```

### Phase 6 — Bug-fix backlog for hiveMind.teams.restore (LOCAL implementation, not McDonges)

These belong as a Sprint-1 follow-up epic. Listed here for traceability:

1. **`teams.restore` should refuse `<no-session-filter>` invocation** OR require explicit `--all` flag. Currently the absence of args means "restore everything" — too easy to invoke by accident.
2. **`teams.restore` per-session idempotency**: before `tmux split-window` to create pane N, check current pane count vs target. If current > target, log error and skip (don't blindly add more). If current = target, skip pane creation (just attach).
3. **`__restore_init` cleanup**: whichever code path creates it must register a trap to kill on exit, regardless of script success/failure.
4. **`sessions.store` uniqueness**: enforce ONE pane per UUID OR ONE UUID per pane (per sprint-1-design S2 invariant). Reject duplicates with `error.log`.
5. **Snapshot-file dependency tracking**: `teams.env` records "Restored from X" — `X` should be archived (copied to `~/config/snapshots/archive/`) at restore time so it survives post-restore deletion. Audit trail.
6. **Quoting bug surfaced by 9 live claudes**: literal `Enter` arg in `ps args` means the restore script does something like `claudeCode fork "$uuid" Enter` (passing Enter as a 2nd positional). Should be sent via `otmux send <pane> "claudeCode fork $uuid" Enter` — two separate steps. Audit the restore script for similar mistakes.

---

## Coordination Notes

- **Architect (oosh-architect ooshTeam:0.1)** pinged with parallel investigation request — areas: sprint-1 design pattern review (was single-session insufficient guard against bulk leak?), PUML coverage for bulk-restore explosion, cross-host state consistency rules. Architect findings to be appended to this doc as `## Architect Section` when delivered.
- **Tester (oosh-tester ooshTeam:0.3)** notified — once Tron auths cleanup, need: (a) regression test proving `team.migrate` is session-scoped, (b) idempotency test for `protected.team.import`, (c) cleanup-script dry-run validation.

---

## Read-only diagnostics — replay for verification

All commands run via `otmux send baseTeam:0.3 "<cmd>" Enter` followed by `otmux pane.capture baseTeam:0.3 <lines>`. Pure observation, no remote mutations performed.

```bash
# Session inventory
tmux list-sessions -F '#{session_name}|#{session_created}|#{session_windows}|#{session_attached}' | sort

# Pane explosion
tmux list-panes -t ooshTeam -s -F '#{window_index}.#{pane_index}|#{pane_current_command}|#{pane_title}' | wc -l
tmux list-panes -t ooshTeam -s -F '...' | awk -F'|' '{print $2}' | sort | uniq -c | sort -rn

# Live claudes + token-burn proof
ps -eo pid,etime,args | grep '/Users/donges/\.local/bin/claude --resume' | grep -v grep

# Pane→UUID inconsistencies
cat ~/config/hivemind.sessions.env
# vs:
ps -eo pid,tty,args | grep claude | grep -v grep | awk '{print $1, $2}' | while read pid tty; do
  pane=$(tmux list-panes -aF '#{pane_tty}|#{session_name}:#{window_index}.#{pane_index}' | grep "$tty\$\|/$tty|")
  echo "$pid $tty $pane"
done

# __restore_init leftover
tmux list-panes -t __restore_init -F '#{window_index}.#{pane_index}|#{pane_current_command}|#{pane_title}'

# Snapshot file presence
ls ~/config/hivemind.snapshot.20260430T121706.env  # ENOENT — gone
ls -t ~/config/hivemind.snapshot*.env | head -3    # latest still on disk

# Fork accumulation
wc -l ~/config/hivemind.forks.env  # 713

# JSONL accumulation
ls ~/.claude/projects/*/*.jsonl | wc -l  # 591
```

---

## Awaiting Tron auth

Phases ordered by urgency. Phase 1 (kill live claudes) should run first to stop token burn. Phases 2-5 are state cleanup. Phase 6 is a local code-fix backlog.

Will not execute any phase without explicit Tron authorization per directive.

---

## Architect Section — Design Analysis

**Author:** oosh-architect @ ooshTeam:0.1

### (a) Was single-session team.migrate sufficient guard against bulk-session leak?

**Yes — the guard existed, but wasn't used.** The expert confirms: operator ran `hiveMind teams.restore` (bulk) instead of `hiveMind team.migrate <session> <host>` (single). The single-session tool (commit `dc0cc00`) was shipped before the incident but hadn't been adopted.

**However, team.migrate itself has a secondary leak path.** Line 3252 calls bare `teams.restore` on the remote. If the session-filtered snapshot file doesn't transfer correctly, `teams.restore` falls back to `ls -t hivemind.snapshot.*.env | head -1` — the remote's latest FULL snapshot. This silent fallback is architecturally wrong. `teams.restore` should FAIL HARD when given an explicit path that doesn't exist, not fall back silently.

### (b) Cross-host state consistency — architect-state-analysis findings

The disaster violates **all 6 invariants** from the state-correctness design:

| Invariant | Violation |
|-----------|-----------|
| **I1: Registry-tmux consistency** | 30 dead UUID entries in sessions.env for panes that don't match reality. ooshTeam has 55 panes but only 6 in registry. |
| **I2: Sessions-registry alignment** | UUID aca3405a stored at TWO panes (Bug 6). 9 live processes at panes that don't match sessions.env. |
| **I3: Teams-tmux alignment** | 18 teams in teams.env, all created by bulk restore, none intentionally registered. |
| **I4: tronMonitor-teams sync** | tronMonitor.env is EMPTY despite 18 team sessions existing. |
| **I5: Snapshot completeness** | The source snapshot (20260430) is deleted from disk — no forensic trail. |
| **I6: Queue-pane consistency** | Not checked, but with 55 panes in ooshTeam, queue files likely reference non-existent targets. |

**Design gap identified:** The state-correctness architecture (Option C: events + Option B: reconcile) was designed for LOCAL mutations. Cross-host migration is a NEW failure class. `teams.restore` running on the remote has no concept of "I should only touch one session" — it processes the entire snapshot file. The `<?sessionFilter>` parameter that was in our team.migrate design spec was never added to `teams.restore`.

### (c) Prior PUML coverage for bulk-restore explosion

**No existing PUML covers this failure path.** The three Sprint 1 PUMLs I delivered:

1. `Sprint1_StateCorrectness_StateStores.puml` — Shows `teams.restore` as a mutation event but doesn't detail the snapshot-fallback path or the per-session filter gap.
2. `Sprint1_StateCorrectness_EventFlow.puml` — `team.restored` event catalogued but no cross-host variant.
3. `Sprint1_StateCorrectness_ReconcileCycle.puml` — Only covers local reconciliation, not remote state divergence.

**PUML needed:** `TeamMigrate_BulkRestoreExplosion_Sequence.puml` — sequence diagram showing:
1. Operator calls `teams.restore` (no session filter)
2. Function iterates ALL sessions in snapshot
3. Per session: `layout.restore` creates tmux session + panes
4. Per UUID: `claudeCode fork` spawns opus process
5. Repeated invocations: pane count ONLY GROWS (no idempotency check)
6. Result: 55 panes, 9 live claudes, 30 orphan UUIDs

Will create this PUML after Tron authorizes cleanup (captures the failure for posterity).

### (d) Architectural recommendations (extends expert's Phase 6 backlog)

7. **`teams.restore` MUST accept `<?sessionFilter>` param.** Back-compatible: no arg = current behavior. With arg = only process matching rows. This was in the team.migrate design spec but never implemented.
8. **`teams.restore` silent fallback removal.** If explicit snapshot path is provided and file doesn't exist → `error.log` + `return 1`. No `ls -t | head -1` fallback. Fail loud.
9. **`team.migrate` remote-side call must pass session filter.** Line 3252 should be: `hiveMind teams.restore ~/config/${snapname} --session $session` — so even if the snapshot somehow contains more sessions, restore only processes the one.
10. **Pane-count guard in teams.restore.** Before creating panes for session X: `current_count=$(tmux list-panes -t X | wc -l)`. If `current_count >= target_count`, skip pane creation. Prevents cumulative explosion.

---

**Architect sign-off:** Expert's cleanup plan is sound. Phase 1 (kill 9 claudes) is URGENT. Phase 6 bug-fixes align with Sprint 1 state-correctness design. Items 7-10 above should be added to the Sprint 1 backlog as SC-F follow-up tasks.
