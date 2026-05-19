# Task C1 — hiveMind Cold-Start Restore Findings

**Date:** 2026-04-24
**Role:** oosh-expert
**Target:** `/Users/donges/oosh/hiveMind`
**Covers:** C1.1 (Restore Audit) + C1.2 (Config-Only Restore plan) + C1.3 (Save Completeness)
**Sprint deliverable status:** AUDIT + PLAN (no code changes this task — fixes queued for next implementation task with tester coverage)

---

## TL;DR

Current `teams.save` + `teams.restore` exist and work for the **hot-restart** case (tmux
server running, processes alive). They are **insufficient for cold-restart** (tmux server
killed). Gaps identified across three axes:

| Axis | Gap | Severity |
|------|-----|----------|
| **Save** | Does not capture layout geometry, working dirs, model flags, team metadata | HIGH |
| **Restore** | Builds panes ad-hoc (not from saved layout); hardcoded cwd; hardcoded `sleep 5`; not idempotent | HIGH |
| **Integration** | Does not use B2's new `otmux layout.save`/`layout.restore` | MEDIUM (new capability — fix trivial) |

**Recommended path:** Compose existing teams.save/restore with B2's layout methods. Minimal new
code; maximum reuse. No breaking changes to existing snapshot format.

---

## C1.1 Audit — Existing Restore Capabilities

### Methods that exist

| Method | Line | Purpose | Suitable for cold-restart? |
|--------|-----:|---------|---------------------------:|
| `hiveMind.teams.save` | 1796 | Snapshot live Claude processes → `hivemind.snapshot.<ts>.env` | **PARTIAL** — missing layout/cwd/model |
| `hiveMind.teams.restore` | 1859 | Recreate sessions + panes, re-attach UUIDs | **PARTIAL** — builds geometry ad-hoc |
| `hiveMind.teams.migrate` | 1952 | Push snapshot + JSONL to remote host | Related but host-to-host, not cold-restart |
| `hiveMind.team.pull` | 2062 | Pull team config from remote | For migration, not cold-restart |
| `hiveMind.agent.restart` | 2150 | Restart single agent from pulled config | Single-agent, not team-wide |
| `hiveMind.team.restart` | 2244 | Restart ALL agents from pulled config | Same gaps as `teams.restore` |
| `hiveMind.team.recover` | 5181 | Reconcile registry with live infrastructure | In-session reconciliation, not cold-start |
| `hiveMind.agent.respawn` | 3954 | Fork snapshot UUID into pane | Per-agent UUID restore |

### State file inventory

| File | Purpose | Populated By | Cold-restart critical? |
|------|---------|--------------|:---------------------:|
| `~/config/hivemind.roles.env` | `pane\|role` registry | agent.rename, spawn, bootstrap, respawn, restart, team.restart (auto-refresh) | **YES** — role mapping |
| `~/config/hivemind.sessions.env` | `pane\|UUID` registry | Same lifecycle hooks | **YES** — UUID mapping |
| `~/config/hivemind.teams.env` | `session\|description` — team registry | `team.register` | **YES** — which sessions are teams |
| `~/config/hivemind.forks.env` | Append-only audit: `ts\|pane\|role\|uuid\|state\|parentUuid` | registry.refresh on every lifecycle edge | Recovery audit trail |
| `~/config/hivemind.snapshot.<ts>.env` | `session\|address\|role\|uuid\|title` per agent | `teams.save` | **YES** — save artifact |
| `~/config/otmux/<session>.layout.env` | Window/pane geometry + titles + cwds | **NEW from B2** — `otmux layout.save` | **YES** — for cold-restart |

### Example snapshot file content (from my live save)

```
# hiveMind snapshot 2026-03-06T13:09:50
# session|address|role|uuid|title
ooshTeam|0.0|unknown||MacStudio
ooshTeam|0.1|oosh-expert|ea2c7021-...|oosh-expert
ooshTeam|0.2|oosh-tester|7b82ead9-...|✳ oosh-tester
ooshTeam|0.3|oosh-expert-shell||oosh-expert-shell (dead)
ooshTeam|0.4|oosh-tester-shell||oosh-tester-shell (dead)
```

Note: shell panes are captured as "dead" (no Claude process). That's correct — restore would spawn bash there, not attach a Claude session.

### Dependency map — what teams.restore needs from neighbors

| From | Need | Covered? |
|------|------|:--------:|
| **claudeCode (Model)** | UUID → JSONL path resolution, process running check, fork/join launchers | ✅ Yes (`session.id`, `session.probe`, `fork`, `join.byID`) |
| **otmux (View)** | Create session + pane, split, set title, send keystrokes | ✅ Yes (`new`, `split`, `pane.title`, `send.enter`) |
| **otmux (View)** | **Layout save/restore** for geometry | ✅ **NEW — just shipped B2** (`layout.save`, `layout.restore`) |
| **Self (hiveMind)** | Registry read/write, session UUID resolution, process discovery | ✅ Yes (`registry.*`, `session.resolve.uuid`, `claude.processes`) |

**Conclusion of C1.1:** All pieces exist. The gap is composition — teams.save/restore doesn't
use the new layout persistence, and the snapshot format doesn't capture all needed data.

---

## C1.3 Save Completeness Gap Analysis

### What `teams.save` currently captures (per agent)

```
session | address (window.pane) | role | uuid | title
```

### What's MISSING for full cold-restart

| # | Missing Data | Why Needed | Where to Get |
|---|--------------|-----------|--------------|
| 1 | **Layout geometry** (window_layout, pane sizes) | Restore exact pane arrangement | `otmux layout.save` (B2 — just shipped) |
| 2 | **Working directory** per pane | Restore context; claude launched from wrong cwd = wrong project dir | `otmux` pane capture → `#{pane_current_path}` |
| 3 | **Model flag** (opus/opus[1m]/sonnet/haiku) | Restore uses `claudeCode join` defaulting to opus[1m]; wrong for haiku-based shell tools etc | `ps -eo args` for the session's PID |
| 4 | **Team metadata** (team name, description, layout type) | Restore multi-team host needs to know which sessions are teams | `~/config/hivemind.teams.env` |
| 5 | **Bootstrap state flag** | Has agent been taught its role via SKILL.md? If yes, skip on restore | Add `bootstrapped=true\|false` field to snapshot |
| 6 | **Shell-only panes** (non-Claude, like expert-shell) | Cold-restart must recreate shell panes too | Already partially handled via "dead" marker — need better classification |
| 7 | **Window names** | teams.save captures windows implicitly via session+address, never window name | `tmux display-message '#{window_name}'` |

### Auto-save triggers — current state

Per my earlier read of hiveMind (lifecycle hooks added in `ff1d6dd`):
`agent.rename`, `agent.spawn`, `agent.bootstrap`, `agent.respawn`, `agent.restart`, `team.restart`
all auto-call `registry.refresh`. **But `registry.refresh` only updates `roles.env` + `sessions.env` + `forks.env` — NOT the snapshot file.**

**Gap:** `teams.save` is manual-trigger only. A crash before a manual save loses everything between the last save and the crash.

### Proposed save triggers (for C1.3 implementation)

1. **Explicit saves** (existing): user runs `hiveMind teams.save`
2. **Lifecycle triggers** (NEW): `team.setup.full`, `team.register`, `agent.bootstrap` completion → auto-save
3. **Periodic snapshot** (NEW): optional `hiveMind teams.save.periodic <interval>` background loop
4. **Pre-exit hook** (NEW, optional): `trap` on oosh-expert exit to save before teardown

Starting point: **lifecycle triggers only** — simplest, most aligned with existing ff1d6dd pattern. Layout captured at same time.

---

## C1.2 Config-Only Restore Design

### Current restore flow (teams.restore)

```
read snapshot → for each line:
    otmux new <sess>             (if missing)
    private.hiveMind.ensure.pane  (splits as needed — geometry ad-hoc)
    otmux pane.title
    otmux send "cd $HARDCODED_PATH" Enter
    otmux send "claudeCode join/fork $uuid" Enter
    sleep 5
    otmux send "Read boot.md" Enter
    registry.set
```

### Proposed cold-restart flow (target for C1.2 implementation)

```
teams.save (extended):
    1. for each active team session:
         otmux layout.save <session>   (B2 — geometry + titles + cwds)
    2. capture per-agent:
         role, uuid, title, cwd, model, bootstrapped flag
    3. write hivemind.snapshot.<ts>.env with extended schema
    4. write hivemind.teams.env (if not up to date)

teams.restore (proposed):
    1. read snapshot
    2. for each unique session in snapshot:
         otmux layout.restore <session>     (B2 — recreates exact geometry)
    3. for each agent entry:
         a. if title maps to a shell-only pane: leave as-is (bash prompt)
         b. if Claude pane:
              otmux pane.title <target> <saved title>
              cd to saved cwd (per-agent, not hardcoded)
              claudeCode <join|fork>.byID <uuid> (with saved model flag)
              wait for claude prompt (not fixed sleep — poll via send.verified or context.read)
              if !bootstrapped: read boot.md
              registry.set
    4. hiveMind teams.register <session> <desc>    (link into teams.env)

Idempotency: if target session already exists AND has the expected pane layout, skip
layout.restore (don't disturb). Otherwise --force restore.
```

### Split of responsibility

| Layer | What it does in cold-restart |
|-------|------------------------------|
| **View (otmux)** | Recreates exact window/pane geometry + titles (B2 layout.restore) |
| **Model (claudeCode)** | Provides UUID resolution + fork/join by UUID (already pure) |
| **Controller (hiveMind)** | Composes Save: layout + snapshot. Composes Restore: layout.restore + per-pane claudeCode invocation + role re-registration |

No layer crosses boundaries. Controller is the only thing that knows about the composition.

---

## Proposed extended snapshot schema (for C1.3)

**Backward compatible** — new fields appended; old parser still works.

```
# Old format (still supported)
session|address|role|uuid|title

# New format (proposed)
session|address|role|uuid|title|cwd|model|bootstrapped|kind
```

Where `kind` ∈ `{claude, shell, monitor}`:
- `claude` — running Claude Code agent
- `shell` — plain bash/zsh pane (e.g. oosh-expert-shell)
- `monitor` — tronMonitor screen pane

Parsers that only look at first 5 fields continue to work; new parsers use additional fields.

---

## Recommended implementation order

(Defer actual implementation to next task with tester coverage; this is the order when we proceed.)

### Step 1 — Extend `teams.save` to include layout + cwd
- After enumerating agents, call `otmux layout.save <session>` for each unique session
- Add `cwd`, `model`, `kind` columns to snapshot entries
- Keep old format readable (new fields are appended)

### Step 2 — Add lifecycle triggers for auto-save
- `team.setup.full` final line → call `teams.save`
- `agent.bootstrap` final line → call `teams.save`
- `team.register` completion → call `teams.save`

### Step 3 — Rewrite `teams.restore` to compose B2
- Group snapshot entries by session
- For each session: `otmux layout.restore <session>` first
- Then iterate panes, send claude commands **per-pane** (cwd from snapshot, not hardcoded)
- Replace `sleep 5` with polling: `claudeCode process.running <pane>` loop with timeout

### Step 4 — Idempotency guard
- Before restore, check if session exists AND geometry matches
- If match: only re-apply titles + registry entries; skip panes that already have Claude running
- If mismatch: --force prompt via the existing B2 guard

### Step 5 — Shell-pane handling
- Skip `claude join` for `kind=shell` entries — leave bash prompt
- Skip for `kind=monitor` — tronMonitor setup is a separate concern

---

## Test criteria (for C1.4 tester)

Test 1 — **teams.save captures layout:**
```bash
hiveMind teams.save
ls ~/config/otmux/ooshTeam.layout.env   # must exist after save
```

Test 2 — **teams.restore recreates exact geometry:**
```bash
# Setup: capture original layout
before=$(tmux display-message -p -t ooshTeam '#{window_layout}')
hiveMind teams.save
tmux kill-session -t ooshTeam
hiveMind teams.restore
after=$(tmux display-message -p -t ooshTeam '#{window_layout}')
[ "$before" = "$after" ]   # must match
```

Test 3 — **per-agent cwd restored:**
```bash
# Saved cwd for 0.3 = /path/x; after restore cwd must be /path/x
cd_before=$(otmux pane.get ooshTeam:0.3 '#{pane_current_path}')
hiveMind teams.save
tmux kill-session -t ooshTeam
hiveMind teams.restore
cd_after=$(otmux pane.get ooshTeam:0.3 '#{pane_current_path}')
[ "$cd_before" = "$cd_after" ]
```

Test 4 — **shell panes remain shells:**
```bash
# oosh-expert-shell is bash, not Claude. Post-restore must still be bash.
otmux send ooshTeam:0.3 "echo \$0" Enter
sleep 1
[ "$(otmux pane.capture ooshTeam:0.3 1)" = "bash" ] || similar
```

Test 5 — **Claude sessions resume (not start fresh):**
```bash
# UUID before = UUID after
uuid_before=$(claudeCode session.id ooshTeam:0.1)
hiveMind teams.save
tmux kill-session -t ooshTeam
hiveMind teams.restore
sleep 10   # allow Claude to resume
uuid_after=$(claudeCode session.id ooshTeam:0.1)
[ "$uuid_before" = "$uuid_after" ]   # same session, not a new one
```

Test 6 — **Idempotency:**
```bash
hiveMind teams.restore    # first run — creates panes, launches Claude
before_pids=$(hiveMind process.list ooshTeam | awk '{print $1}' | sort)
hiveMind teams.restore    # second run — should NOT duplicate panes or relaunch
after_pids=$(hiveMind process.list ooshTeam | awk '{print $1}' | sort)
[ "$before_pids" = "$after_pids" ]
```

Test 7 — **Model flag preserved:**
```bash
# Agent launched with claude-opus-4-6[1m]; after restore must match
# (ps args check)
model_before=$(ps -p $pid -o args | grep -oE 'claude-[a-z0-9-]+\[?1?m?\]?')
hiveMind teams.save; tmux kill-session -t ooshTeam; hiveMind teams.restore; sleep 10
model_after=$(ps -p $new_pid -o args | grep -oE 'claude-[a-z0-9-]+\[?1?m?\]?')
[ "$model_before" = "$model_after" ]
```

Test 8 — **hivemind.teams.env populated after restore:**
```bash
tmux kill-session -t ooshTeam
hiveMind teams.restore
grep -q "^ooshTeam|" ~/config/hivemind.teams.env
```

---

## Summary table — current vs target

| Capability | Current | Target (after C1 impl task) |
|------------|:-------:|:---------------------------:|
| Save: role + UUID + title per agent | ✅ | ✅ |
| Save: pane geometry | ❌ | ✅ (via `otmux layout.save`) |
| Save: per-pane cwd | ❌ | ✅ (via `otmux layout.save`) |
| Save: model flag (opus[1m] vs others) | ❌ | ✅ (ps args parse) |
| Save: team metadata | ❌ | ✅ (`hivemind.teams.env` integration) |
| Save: bootstrap flag | ❌ | ✅ (new field) |
| Save: shell pane kind classification | ⚠ (implicit "dead" marker) | ✅ (explicit `kind=shell`) |
| Save: auto-trigger on lifecycle edges | ❌ (manual only) | ✅ (wire into existing hooks) |
| Restore: recreate exact geometry | ⚠ (ad-hoc via ensure.pane) | ✅ (`otmux layout.restore`) |
| Restore: per-agent cwd | ❌ (hardcoded path) | ✅ (from snapshot) |
| Restore: correct model flag | ❌ (always opus[1m]) | ✅ (from snapshot) |
| Restore: idempotent | ❌ | ✅ (guard + force) |
| Restore: handles shell panes | ⚠ (tries to claude-join shell pane if present) | ✅ (skip based on kind) |
| Restore: polls instead of sleeps | ❌ (hardcoded sleep 5) | ✅ (process.running loop) |

---

## What's DELIBERATELY NOT done in this audit task

Per sprint rule "document leaks, fixes come after tester coverage":
- No code changes to teams.save or teams.restore
- No new snapshot schema applied
- No integration with B2 layout methods
- Next implementation task will apply the plan + tester will validate via test criteria above

---

*Sprint 0 - Lifecycle Consolidation — Epic C: hiveMind Controller Layer — PRIMARY DELIVERABLE*
