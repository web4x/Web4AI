[Back to Sprint 2 Planning](./planning.md)

# Task S2-H: team.sweep → fleet dashboard (all active teams + bg-shells + context-warning)
[task:uuid:a9b08ad5-963d-4b67-8f9d-d87abf4d6cfa]

## Status
- [x] Planned
- [x] In Progress
- [x] QA Review (expert-verified live; awaiting tester T-SWEEP-ALL)
- [ ] Done

## Traceability
- up
  - [Sprint 2 Planning](./planning.md)
- related: [task-s2-c.0 live-reader](./task-s2-c.0-live-reader.md) (DRY source), [task-s2-a parity](./task-s2-a-teamsave-status-parity.md)

## Description
**From Tron (2026-07-02):** `hiveMind team.sweep` with **NO param → sweep ALL active teams** (not just one). AND each pane line must ALSO show: **(1) accumulated background-shell count**, **(2) the context warning** (context %/remaining) **if available**.
**Role**: architect (design) → expert (impl) → tester (T-SWEEP-ALL).

## Requirements
- **No-arg = all active teams**: enumerate active teams (teams with live agents) and sweep each. DRY: PROJECT off the c.0 canonical live-reader (`host|session|address|tty|role|uuid|kind|title|cwd`) grouped by session/team — do NOT roll a separate enumeration (the PF3 lesson). With a `<session>` arg = current single-team behavior.
- **Background-shell count** per pane (the "N shells" SM tracks manually — e.g. expert=4). Source from the pane/process (the running-shells indicator).
- **Context warning** per pane if available: parse the TUI "Context left until auto-compact: NN%" (cf. claudeCode:1424/1432) → show remaining% / a cliff flag (e.g. ⚠ at low remaining). Blank if not a claude pane / not available.
- One-line-per-pane, grouped by team; object.verb/no-flag; non-invasive.

## Why
This is THE SM fleet-monitoring dashboard — idle/active + shell-accumulation + context-cliff in ONE command, so SM's proactive notify (idle/stopped/shell-growth/near-cliff) reads straight off it instead of hand-assembling.

## Definition of Done
- `hiveMind team.sweep` (no arg) sweeps ALL active teams; `<session>` scopes to one
- each line shows state + bg-shell-count + context-warning(if avail)
- projects off c.0 live-reader (no separate enumeration)
- T-SWEEP-ALL: multi-team sweep lists every active team; shell-count + context% present where applicable

## ARCHITECT DESIGN (oosh-architect, 2026-07-02) — the fleet dashboard as a PROJECTION of c.0
**Core: `team.sweep` no-arg = a PROJECTION of the c.0 live-reader grouped by `session`. It does NOT enumerate — it reads `private.hiveMind.live.tupleset` (all teams) and groups. This IS the PF3 lesson (status omitted remoteOOSH because it rolled its own enumeration; the dashboard must not repeat that).**

### 1. Arg-presence = the verb (object.verb, no flag)
- `hiveMind team.sweep` (NO arg) → **FLEET dashboard**: `live.tupleset` (no session filter) → group rows by `session` → render every active team. (Also fixes the old no-arg-dumps-usage bug — no-arg is now the useful default.)
- `hiveMind team.sweep <session>` → single-team (current per-pane behavior), also projected off `live.tupleset "$session"`.
- Completion: `team.sweep.completion.session` offers sessions; bare = fleet.

### 2. The two new per-pane signals — BOTH ride off fields ALREADY in the c.0 tuple (no new enumeration)
- **bg-shell-count** (agent panes) — the "shell-growth" leak signal (SM's "expert=4"). Derive from the tuple's **`tty` → pane_pid**: ONE batch `ps -eo ppid,pid,comm`, walk each agent pane's process subtree, count background `bash`/`sh` descendants (excludes the pane's own shell + the foreground claude). One ps for the whole fleet — NOT per-pane subprocess. Shown per agent line; team header shows the team total.
- **context% (the cliff)** (agent panes) — derive from the tuple's **`uuid` → JSONL token math** via `claudeCode.context.read <pane>` (JSONL-FIRST = fast, no capture-pane; TUI-parse `context.parse` "Context left until auto-compact: NN%" only as fallback, claudeCode:1424/1432). **The uuid is already in the tuple → fast context%, no per-pane TUI capture.** Cliff-colored: ≤20% red `⚠`, ≤40% yellow. Blank for shells (kind=shell) / unavailable.
- **state** — as today, from `sweep.detect` per pane (idle/active/blocked incl. the existing `context-warning` state).

### 3. Layout (the ONE SM view — idle/active + shells + cliff)
```
TEAM ooshTeam        4 agents · 2 shells
  0.0  oosh-po           IDLE      sh:0   ctx 61%
  0.1  oosh-architect    ACTIVE    sh:1   ctx 18% ⚠
  0.2  oosh-expert       ACTIVE    sh:4   ctx 44%
  0.4  oosh-expert-shell shell
```
Agent line: `addr role STATE sh:K ctx:NN%[⚠]`. Shell line: `addr role/title shell`. Team header: `N agents · M shells` (M = count of kind=shell rows for that session — free from the tuple).

### 4. Fail-safe + remote — INHERITED from c.0 (the PF3 guarantee flows through)
Because it projects off `live.tupleset`, remote teams (remoteOOSH) appear via c.0's `ossh exec … protected.live.tupleset`; an unreachable remote renders its marker row, **never silently omitted**. The dashboard can't drop a team — that property lives in c.0, and the dashboard is just a view.

### 5. Performance (batch discipline preserved)
`live.tupleset` = 1 batch (c.0). + ONE `ps` for all bg-shell subtree counts. + context% via JSONL token math per agent (fast, uuid already in hand — no capture). Only AGENT panes get state/shells/context; shells are trivial. Cap N for very large fleets (log the cap — no silent truncation). No per-pane subprocess explosion.

### 6. SM value
idle/active (state) + shell-growth (bg-shell-count) + context-cliff (ctx%) in ONE command → SM's proactive-notify (idle/stopped/shell-leak/near-cliff) reads straight off this, instead of hand-assembling from 3 sources.

### Handoff
- **Expert**: implement `team.sweep` no-arg = project `live.tupleset` grouped by session; add the bg-shell batch-ps count (via tty→pane_pid) + context% (via uuid→context.read JSONL-first); render per §3; inherit c.0 remote/fail-safe. **Depends on c.0** (build c.0 first). Commit.
- **Tester**: **T-SWEEP-ALL** — no-arg lists EVERY active team (incl. remote; none omitted — the PF3 guard); team header counts == c.0 tuple counts; agent lines show state+sh:K+ctx%; a low-ctx agent shows the ⚠ cliff; shells show `shell` (no ctx); **regression guard: grep the impl reads `live.tupleset`, does NOT roll its own `list-panes`/`agents.discover` enumeration** (the PF3 anti-pattern); bounded at fleet scale.

## Report-back
- Architect (design): **DONE 2026-07-02** — `team.sweep` no-arg = PROJECTION of c.0 `live.tupleset` grouped by session (NOT a re-enumeration — the PF3 lesson). Two new per-pane signals ride c.0 fields: bg-shell-count from `tty`→pane_pid (ONE batch ps, subtree bash count = shell-leak signal), context% from `uuid`→JSONL token math (fast, no capture; cliff-colored ≤20%⚠/≤40%). Team header = N agents · M shells (kind=shell count). Remote/fail-safe inherited from c.0 (never silent-omit). ONE SM view: idle/active + shells + cliff. Depends on c.0. T-SWEEP-ALL + PF3 no-re-enumerate regression guard.
- Expert (impl + commit): **DONE 2026-07-03 `ddfcf51`** (dev). `team.sweep` rewritten as a **PROJECTION of the c.0 `live.tupleset`** (grouped by session) — no-arg = ALL active teams, `<session>` scopes to one. **PF3-clean**: reads `live.tupleset` (grep `HIVEMIND_REGISTRY` in the fn = 0); the only `list-panes` call is the legit pane→pane_pid batch (bg-shell roots), not a re-enumeration. Two new per-pane signals ride c.0 fields: **bg-shells `sh:K`** (tty→pane_pid via ONE `tmux list-panes` batch + ONE `ps -eo ppid,pid,comm` snapshot → awk subtree walk counting bash/sh/zsh descendants; excludes the pane's own shell + the foreground claude) and **context% `ctx NN%`** (uuid→`claudeCode context.read`, JSONL-first; cliff-colored ≤20% red ⚠ / ≤40% yellow). Header `N agents · M shells` (kind counts from the tuple); shell rows = `shell`; remote-unreachable marker surfaced (never omitted — inherited from c.0). Extracted `private.hiveMind.sweep.paneState` (state via sweep.detect+content) + `private.hiveMind.sweep.bgshells` helpers. **Live-verified WODA.prod:** 8 teams swept; cliff ⚠ fires (ARON 13%, robbin-po 9%, robbin-tester 0%); SELF-skip on own pane; real ⚠/· UTF-8. Non-regr: teamsave-parity 3/3, send-matrix 12/12. **NOTE (calibration for tester):** `sh:K` counts ALL shell descendants — includes transient tool-bash (fluctuates with activity) + the wrapper chain; the LEAK signal is sustained growth, not the absolute baseline (idle≈1-3, active/leaky higher). **Unrelated flag:** `test.dispatch-submit` is 1/5 RED but that's the **OTR-1 revert** fallout (it asserts the reverted rc2/rc3/GATE-SRC contract — `keepsRc2` etc.), NOT this change (my diff touches 0 send.verified/drain lines) — tester should retire/update dispatch-submit for the reverted send.
- Tester (T-SWEEP-ALL): READY — no-arg lists EVERY active team (incl. remote via c.0 ossh-exec; unreachable → marker, never omitted); header counts == c.0 tuple counts; agent lines show STATE + sh:K + ctx NN% (low-ctx shows ⚠); shells show `shell`; **PF3 regression guard: grep the fn reads `live.tupleset`, NOT `HIVEMIND_REGISTRY`/`agents.discover` enumeration** (the `list-panes` for pane_pid is allowed); bounded at fleet scale. Commit `ddfcf51` on dev.

---
## ✅ task-s2-h DESIGN done (architect `ec32300`) — PO APPROVED
team.sweep no-arg = **PROJECTION of c.0 `live.tupleset` grouped by session** (NOT re-enumeration — PF3 lesson). Both new signals ride c.0 fields:
- **bg-shell-count**: tty→pane_pid, ONE batch `ps`, subtree bash count (= the shell-leak signal).
- **context%**: uuid→JSONL token-math (fast, NO pane capture; cliff ≤20% ⚠ / ≤40% warn).
- Header: `N agents · M shells` (kind=shell count). Remote + never-silent-omit INHERITED from c.0 (dashboard is just a view).
- **DRY win**: c.0 is now the ONE reader; parity + C.2 + C.3 + this dashboard are all PROJECTIONS. Depends on c.0 → expert builds c.0 first.
- Tests: **T-SWEEP-ALL** + a **PF3 no-re-enumerate regression guard**.
**Expert impl (after c.0).**
