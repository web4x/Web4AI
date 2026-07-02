# Sprint: teams.save / status MVC parity FIX — CRITICAL INFRA (do first)

**Delegated by**: oosh-po@MacStudio → **oosh-po@WODA.prod (owns + drives with WODA.prod ooshTeam on dev)**
**Created**: 2026-07-02 (Tron: "team.save/status are critical infrastructure for everything else — first")
**Input evidence**: `session/tasks/teamsave-vs-status-parity.md` (tester findings, commit ccf11f2) — READ IT FIRST.

## Why critical

teams.save (Model persistence) and status/team.list (live View) are the controller's eyes. Every migration, restore, rewind, and monitor depends on them being TRUE and COMPLETE. Today they disagree — that silently corrupts everything built on top. Fix before other infra work.

## Verdict from the investigation (measured live, MacStudio)

Agent|uuid parity is GREEN when saved fresh (Model≡View on agents). The failures are all on shells / team-enumeration / freshness / naming:

## Stories (dev branch on WODA.prod; hiveMind + tests)

### PF1 — method-name DRY  ·  Owner: WODA.prod expert  ·  Status: PLANNED
`hiveMind team.save` → "Unknown method"; real name is `teams.save` (plural). Reconcile the name (canonical + alias, or rename) so `team.*` vs `teams.*` is consistent and discoverable via completion. Also it's slow (~2min) — note/measure why (is it the invasive per-pane probe?).

### PF2 — teams.save drops live shell panes  ·  Owner: WODA.prod expert  ·  Status: PLANNED
Fresh snapshot silently OMITS live shell panes (measured absent: TRONinterface:0.3, baseTeam:0.2, iphone:0.1, iphone:0.3 — while keeping other shells in the same windows → non-deterministic). teams.save must capture ALL live panes (agents AND shells), completely. Root-cause the partial capture.

### PF3 — status/team.list enumeration gap  ·  Owner: WODA.prod expert  ·  Status: PLANNED
status/team.list MISS a whole live team (`remoteOOSH`, 2 panes) that BOTH teams.save and `otmux tree.detailed` see. The View must enumerate every live team the authoritative source (tree.detailed) sees. This is the long-standing team.status stale-snapshot bug — fix the enumeration to read live, not a stale snapshot.

### PF4 — freshness / stale-uuid  ·  Owner: WODA.prod expert  ·  Status: PLANNED
On-disk snapshot carried a STALE agent uuid (scrum-master 35916ccb vs live dfcea556) until re-saved. Consumers reading the file get stale identity. Decide + implement: either consumers derive from live (proc-args) truth, or the snapshot self-refreshes / is timestamp-gated so stale reads are impossible. (Ties to MVC: live is the Model of record; the file is a cache.)

### PF5 — tests  ·  Owner: WODA.prod tester  ·  Status: PLANNED
T-TEAMSAVE-PARITY: fresh teams.save tuple-set == live tree.detailed tuple-set (agents+shells+teams); T-STATUS-ENUM: status/team.list shows every live team; T-FRESHNESS: stale snapshot cannot yield a wrong-uuid answer. Measure live, no output filtering.

## Sequence & rules
- Architect (WODA.prod) frames MVC design if needed (live=Model of record; View reads live; file=cache), then PF1→PF4 (parallel where safe) → PF5 → WODA.prod PO QA gate → report up to me (oosh-po@MacStudio) → Tron promote.
- Fix on dev. DO NOT modify unrelated scripts. OOSH wrappers only; no output filtering; measure live.
- Report-back inline in THIS file + one-line nudge. This is the single source of truth for the parity fix.
