> ⬆ **[Sprint 2 · task-s2-a](../../scrum.pmo/sprints/sprint-2/task-s2-a-teamsave-status-parity.md)** — this spec is traced from that sprint-2 task.

# Task: hiveMind team.save vs hiveMind status — tuple parity check

**From**: oosh-po@MacStudio
**To**: oosh-tester@MacStudio
**Priority**: HIGH (Tron-directed)
**Date**: 2026-07-01

## Question Tron wants answered

Does `hiveMind team.save` capture the **same combinations of `team | shell | agent | uuid`** as `hiveMind status` reports live?

In MVC terms: team.save writes a snapshot (the Model persistence). status reads live (the View). Do they agree? Where they disagree is a bug (known: team.status can read a stale snapshot — this is the exact area).

## What to measure (ground truth, no assumptions)

1. Run `hiveMind status` (or `hiveMind team.status <team>` for each live team) — capture the live tuple set:
   - **team** = session name
   - **agent** = each Claude Code pane (role + uuid)
   - **shell** = each non-agent pane (bash/ssh) — does status even show shells?
   - **uuid** = session UUID per agent

2. Run `hiveMind team.save` — read the snapshot file it writes (`~/config/hivemind.snapshot.*.env`, format `session|address|role|uuid|title`). Capture its tuple set.

3. **Diff the two tuple sets.** For every live team/agent/shell/uuid from status, is there a matching row in the saved snapshot, with the SAME uuid? And vice versa — does the snapshot contain rows that status does NOT show (stale/dead entries)?

## Report (in this file, then nudge me)

Fill a table:

| team | pane | class (agent/shell) | role | uuid (status) | uuid (team.save) | MATCH? |
|------|------|---------------------|------|---------------|------------------|--------|

Then state plainly:
- Do team.save and status carry the **same** team|shell|agent|uuid combinations? YES / NO.
- If NO: exactly which rows differ, and which side is wrong (is save missing shells? stale uuids? dead agents? missing a whole team?).

## Rules
- OOSH wrappers only. Use `otmux pane.capture` to read shell output — NEVER read internal Claude files (F49).
- No output filtering (no 2>/dev/null, grep/head/tail on shown output).
- Measure, don't assume. This is a comparison of two real outputs, run both fresh.
- This is a **read-only investigation** — do NOT fix anything yet. Report findings, I take them to Tron.

---

## FINDINGS (oosh-tester@MacStudio, MEASURED live 2026-07-01)

### 0. Method-name correction (measured)
`hiveMind team.save` → **`ERROR> Unknown method`**. The real method is **`hiveMind teams.save`** (plural). It is also SLOW (~2min to write a snapshot here). Live View captured via `hiveMind team.status <team>` (×4) + `otmux tree.detailed` (authoritative all-pane, proc-args uuid). Model = fresh `teams.save` snapshot `~/config/hivemind.snapshot.20260701T133058.env` (format `session|address|role|uuid|title|cwd|model|kind`).

### 1. Parity table (Model = fresh teams.save · View = status/tree.detailed)
| team | pane | class | role | uuid (snapshot) | uuid (live) | MATCH? |
|------|------|-------|------|-----------------|-------------|--------|
| TRONinterface | 0.0 | agent | TRONinterface-agent | 75a70914 | 75a70914 | ✅ |
| TRONinterface | 0.1 | agent | scrum-master | dfcea556 (fresh) | dfcea556 | ✅ *(STALE on-disk snapshot had 35916ccb — see #3)* |
| TRONinterface | 0.2 | shell | PO-shell | — | — | ✅ |
| TRONinterface | 0.3 | shell(screen) | TRON-Monitor:ooshTeam | **absent** | offline/[screen] | ❌ snapshot MISSING |
| baseTeam | 0.0 | agent | agent-trainer | 52ef0a47 | 52ef0a47 | ✅ |
| baseTeam | 0.1 | shell | once-shell | — | — | ✅ |
| baseTeam | 0.2 | shell | MacStudio | **absent** | offline/[bash] | ❌ snapshot MISSING |
| baseTeam | 0.3 | shell | remoteScreens | — | — | ✅ |
| iphone | 0.0 | agent | research | d6b0c5f2 | d6b0c5f2 | ✅ |
| iphone | 0.1 | shell | MacStudio | **absent** | offline/[bash] | ❌ snapshot MISSING |
| iphone | 0.2 | shell | MacStudio | — | — | ✅ |
| iphone | 0.3 | shell | MacStudio | **absent** | offline/[bash] | ❌ snapshot MISSING |
| ooshTeam | 0.0 | agent | oosh-po | 29a1e1d1 | 29a1e1d1 | ✅ |
| ooshTeam | 0.1 | agent | oosh-architect | 6df08923 | 6df08923 | ✅ |
| ooshTeam | 0.2 | agent | oosh-expert | a43c1b23 | a43c1b23 | ✅ |
| ooshTeam | 0.3 | agent | oosh-tester | 74f27969 | 74f27969 | ✅ |
| ooshTeam | 0.4 | shell | oosh-expert-shell | — | — | ✅ |
| ooshTeam | 0.5 | shell | oosh-tester-shell | — (kind=**unknown**) | — ([ssh]) | ⚠️ pane matches, class label differs (unknown vs ssh) |
| remoteOOSH | 0.0 | shell | snapshot:WODA.prod / live:donges@v36421:/root | — | — | ⚠️ TITLE mismatch + **status/team.list omit this team** |
| remoteOOSH | 0.1 | shell | snapshot:u20 / live:WODA.test | — | — | ⚠️ TITLE mismatch + **status/team.list omit this team** |

### 2. Plain answer to Tron's question
**Do teams.save and status carry the SAME team|shell|agent|uuid combos? → NO — but the disagreement is entirely on SHELLS / team-enumeration, NOT on agent uuids.**
- **All 8 live AGENT uuids match** across fresh-snapshot, `team.status`, and `tree.detailed` (they share proc-args discovery). On agents, Model = View. ✅

### 3. Exactly which rows differ, and which side is wrong
1. **STALE on-disk snapshot uuid (the exact risk Tron flagged).** The pre-existing snapshot (`…20260625…`, 3 days old) had **scrum-master uuid `35916ccb`**; live is **`dfcea556`** (agent reforked since). Running `teams.save` FRESH corrected it → so *any consumer that reads the snapshot file instead of live truth gets a stale uuid.* **Snapshot side is wrong (stale) until re-saved.**
2. **teams.save DROPS live shell panes (non-deterministically).** Absent from the FRESH snapshot but live: `TRONinterface:0.3`, `baseTeam:0.2`, `iphone:0.1`, `iphone:0.3` (all bash/screen). It kept other shells in the same windows (baseTeam:0.1/0.3, iphone:0.2). **teams.save side is wrong — incomplete pane capture.**
3. **status/team.list MISS a whole live team: `remoteOOSH`** (2 panes, live in `tree.detailed` AND captured by teams.save) — `team.list` reported only 4 teams. **status/team.list side is wrong — team-enumeration gap.**
4. **remoteOOSH shell TITLES are stale in the snapshot** (`WODA.prod`,`u20`) vs live (`donges@v36421:/root`,`WODA.test`). Shell-pane titles aren't refreshed. **Snapshot side stale.**
5. **Class-label drift on shells:** `ooshTeam:0.5` = `unknown` (snapshot) vs `[ssh]` (live); stale snapshot even mislabeled agent↔shell (`TRONinterface:0.0` was `shell(dead)`, now correctly `claude`). Cosmetic vs uuid, but confirms snapshot kind-field is unreliable when stale.

### 4. Net
- **Agent|uuid parity: GREEN** (Model≡View when saved fresh).
- **Shell parity: RED** — teams.save silently drops some live bash/screen panes.
- **Team parity: RED** — status/team.list omit `remoteOOSH` that teams.save + tree.detailed see.
- **Freshness: RED** — the snapshot on disk is only as good as the last `teams.save`; stale files carry wrong uuids/titles (scrum-master proven). No auto-refresh.
Read-only investigation — nothing changed. oosh-tester → nudging oosh-po.
