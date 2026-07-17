# SPEC: Team Loop as MVC OOSH commands — design + review (oosh-architect, 2026-07-16)

**For**: ARON (oosh-po) → TRON review · **Input**: `session/base-skills/team-loop.md`, task `session/tasks/team-loop-mvc-design.md`
**Scope**: DESIGN + REVIEW only. Implementation → oosh-expert (each GAP = a sprint).
**Measured on**: live `mcdonges.latest` (the line agents run) — read-only, no mutation.

---

## 1. MVC mapping — loop step → OOSH commands → Model I/O

**Controller = PO · View = SM · Model = registry.** Tools do CMM3 (deterministic mechanics); PO/SM add CMM4 judgment.

| # | Loop step (who) | Concrete OOSH commands (today) | Model read/write |
|---|---|---|---|
| 1 | **PO unblocks SM** | `hiveMind.agent.send SM …` / approve keystroke via `otmux send.tui`; restart if dead: `hiveMind.agent.restart` | reads roles.env→resolve SM pane; write: none |
| 2 | **SM monitors→reports→unblocks PO** | `hiveMind.team.sweep <session> <interval>` / `hiveMind.status` (View); measure ctx% = `claudeCode context.read <pane>`; unblock PO = `agent.send`/approve | reads whole Model (roles/sessions/state); **should write** ctx%+state back (G6) |
| 3 | **PO reviews + assigns + requires done-report** | `hiveMind.resolve <role>` → `hiveMind.agent.send <role> "task…"`; capture done = `otmux pane.capture` | reads roles.env; task/gate state **not persisted** (G7) |
| 4 | **PO delivers + orders rewinds** | commit/push = `git`; rewind = `hiveMind.agent.rewind <name> 2` (peer-drive: Tron-auth→DURING_REWIND quiesce→`otmux.rewind.drive`→reap); all-agents incl SM&PO = **no single verb** (G4) | write: snapshot.*.env (anchor), state.env (DURING_REWIND set/clear) |
| 5 | **PO plans + assigns next** | `hiveMind.agent.send <role> …`; planning = judgment | reads sprint planning + Model |

**Underlying every step**: self-identity + pane resolution — today via `otmux current`/`pane.get.target` (STALE, G1) and scattered stores (G2). This is the loop's foundation and it is the weakest link.

---

## 2. GAP LIST (each = a sprint for oosh-expert)

### G1 — LINCHPIN: `otmux current` trusts stale `$TMUX_PANE`; corrected `pane.self` is a lost duplicate → DRY to ONE resolver
**Measured (mcdonges.latest):** `otmux.pane.get.target` (otmux:2683) = `display-message -t "${TMUX_PANE:-}" …` — resolves self from the env var `$TMUX_PANE`. `otmux.current` (2686) is a bare **alias** to it → inherits the bug. `$TMUX_PANE` is injected by tmux at pane-spawn and goes **STALE after fork / move / rewind** (the Claude process keeps the OLD pane's value). Proven live THIS session: `otmux pane.get.target` returned `baseTeam:0.1` while the agent was really in another pane. Line 1806 even carries a now-wrong directive comment "Self-pane resolution MUST use $TMUX_PANE (Tron P0 #3)".
The **correct** resolver — a `/proc` PID→ppid→tmux-client/pane walk (`pane.self`, present on `dev` as `private.otmux.pane.self`) — is a **lost duplicate**: not on the live line, and it duplicates `current` instead of BEING it.
**FIX (expert):** make ONE canonical `otmux current` that resolves the executing pane by walking the process tree to its controlling tmux client/pane — **never** `$TMUX_PANE`. Delete the `pane.self` duplicate (or make it a thin alias). Route EVERY self-ID caller through it: `pane.get.target`, the send-prefix self-resolution (otmux:1806-1818), hiveMind registry writes, boot identity. Remove the stale "MUST use TMUX_PANE" comment. **This gap gates the whole loop** — the Model cannot be true while identity comes from a lying env var.

### G2 — Identity truth is scattered + disagrees (Model not DRY on identity)
**Measured:** the same identity fact lives in ≥5 places — `roles.env` (pane→role), `sessions.env` (pane→uuid), `snapshot.*.env` (role/uuid/title), tmux `customTitle`, and the claude process `--resume <uuid>` arg — and they LAG/LIE (S-1b "verify methods lie"; customTitle flushes late, session.id mis-resolves by title).
**FIX (expert):** a single `hiveMind.identity <pane>` resolver with defined precedence — **ground truth = process `--resume` arg (uuid) + corrected `otmux current` (pane)**; `roles.env` = role LABEL only; customTitle/JSONL = never trusted for verification. All readers/writers go through it. Registry files become PROJECTIONS of ground truth, not competing sources.

### G3 — No first-class unblock/approve verb (loop steps 1–2)
Mutual PO⇄SM unblocking is done ad-hoc by sending approval keystrokes. **FIX:** `hiveMind.agent.approve <role>` — sweep-detect the permission/overlay prompt, send the approve keystroke via `otmux send.tui`, VERIFY the prompt cleared (capture). Makes the 42 mutual-care hand a measured command.

### G4 — No team-wide rewind orchestrator incl. SM & PO
Step 4 orders a proactive 2-phase rewind for EVERY agent **including SM & PO** (peer-driven, since no agent drives its own picker). Today: per-agent `agent.rewind` + `team.state.set DURING_REWIND`. **FIX:** `hiveMind.team.rewind.all <session>` — sequences every agent at ≤90% used; SM & PO driven by the agent-trainer; enforces 2-phase (rewind-1→save anchor→deep rewind→retrain) per the rewind base-skill.

### G5 — Proactive-rewind trigger (≤90%) has no measured Model field
The ≤90% trigger needs each agent's context %. Sweep measures it externally but the Model has **no ctx% field**. **FIX:** SM sweep writes `ctx%` (+ trajectory) into the Model; `hiveMind.team.loop` fires `team.rewind.all`/per-agent at the threshold. Closes the cliff by design (loop step 4's whole point).

### G6 — Task/gate state not persisted in the Model
Steps 3/5 (assign + done-report + sprint-gate status) live only in chat/pane scrollback. A rewound PO/SM loses "who's assigned what, which gate is open." **FIX:** a `hivemind.tasks.env` projection (role→task→status/gate) written on assign + done-report, read on PO/SM rebirth.

*(G5/G6 optional-but-recommended; G1→G2→G3→G4 are the critical path.)*

---

## 3. Registry (Model) review — is it TRUE + DRY?
- **DRY?** Partially. It is **~6 stores** (`hivemind.roles.env`, `sessions.env`, `teams.env`, `snapshot.*.env`, `state.env`, `deferred`/`events`/queue) — separation-by-concern is fine. The DRY violation is **identity truth duplicated across stores + tmux + process args** (G2), not the file split.
- **Does it lie?** YES today — because writers derive pane from stale `$TMUX_PANE` (G1) and readers pick different sources that disagree (G2). Proven: my own mis-identification this session; S-1b lag.
- **Canonical design:** ground truth = (process `--resume` uuid) + (corrected `otmux current` pane); registry `.env` files are **projections** updated only by lifecycle events, always via the ONE `hiveMind.identity` resolver; add `ctx%` (G5) and `task/gate` (G6) columns so the View has everything the Controller needs. No read ever touches `$TMUX_PANE` or a raw customTitle.

---

## 4. Lifecycle review — `bootstrap → run → monitor → proactive rewind (≤90%) → rebirth`
Sound and complete in shape; the registry-update points:
| Lifecycle event | Model write | Guard |
|---|---|---|
| **bootstrap (birth)** spawn/restart | roles.env + sessions.env (pane,uuid,role) via `hiveMind.identity` | pane from corrected `otmux current`, NOT $TMUX_PANE (G1) |
| **run** assign/done | tasks.env (role→task→status) (G6) | done-report required |
| **monitor** SM sweep | ctx% + state (G5) | measured (`claudeCode context.read`), never assumed |
| **proactive rewind ≤90%** | snapshot.*.env (anchor) + state.env DURING_REWIND | `team.rewind.all` (G4); 2-phase |
| **rebirth from anchor** | re-write roles/sessions after re-resolve | verify customTitle==role@host via **pane footer + process args** (S-1b), retry until sticks |
**Lifecycle gap:** rebirth today re-resolves via the stale resolver (G1) and has no persisted task/gate (G6) → a rebought agent can boot mis-identified and taskless. Fixing G1+G2+G6 makes rebirth deterministic.

---

## 5. Handoff & sequencing (to oosh-expert, PO/Tron-gated)
1. **G1 first** (linchpin — one corrected `otmux current`, delete `pane.self` dup, route all self-ID through it). Nothing else is true until this lands.
2. **G2** (one `hiveMind.identity` resolver; stores become projections).
3. **G3** (`agent.approve`), **G4** (`team.rewind.all` incl SM & PO).
4. **G5/G6** (ctx% + task/gate Model fields) to fully close the proactive-rewind loop.
Each gap = its own sprint story; tester writes the guard (e.g. extend `T-NO-TMUXPANE` to assert zero `$TMUX_PANE` self-ID after G1). **No code changed by me — design + review only.**

> Note: G1/G2 corrected resolver already exists on `dev` but not on the live `mcdonges.latest` line — ties into backlog **BL-1** (version-mismatch: dev fixes not on the stable line). Expert should land G1 on the line agents actually run.

---
## G1 — IMPLEMENTATION-READY DESIGN (oosh-architect, 2026-07-17; measured on live mcdonges.latest, branch-agnostic)

### Measured live-line reality (df95a02) — WORSE than "stale alias"
- `otmux.pane.get.target` (otmux:2683) resolves self from **`${TMUX_PANE}`** → stale/wrong pane after fork/move/rewind. `otmux.current` (2686) = bare alias → same bug.
- **`otmux pane.self` is CALLED but NOT DEFINED** on this line (0 occurrences in `otmux`), yet invoked by hiveMind:2113/2496/2555/8108 + claudeCode:1620 → those calls dispatch to an unknown method → return **empty** → self-ID silently broken. (The corrected PID-walk `pane.self` exists only on `dev` = the "lost duplicate.")
- Net: the loop's Model gets identity from a resolver that is either **wrong** (current→$TMUX_PANE) or **missing** (pane.self→undefined). Fix both with ONE resolver.

### The ONE canonical resolver (algorithm — never `$TMUX_PANE`)
`private.otmux.pane.resolve()` — resolve the executing pane by walking the process tree to its controlling tmux pane:
1. Start at `$$` (this shell). Walk `$PPID` up the chain (`/proc/<pid>/stat` field 4, or `ps -o ppid=`).
2. For each ancestor pid, ask tmux which pane hosts it: `tmux list-panes -a -F '#{pane_pid} #{session_name}:#{window_index}.#{pane_index} #{pane_id}'` → match `pane_pid` (or any descendant pid) to the ancestor.
3. First match = the real pane. Return `session:win.pane` (or `%id` with `target` arg). Cache per-process (pid-keyed) for the call's lifetime only.
4. No tmux / no match → rc1 (CI/script) — callers already guard.
   *Rationale:* the process tree is ground truth and survives fork/move/rewind; `$TMUX_PANE` is a spawn-time snapshot that goes stale. This is the same PID-walk the `dev` `pane.self` uses — port it, don't reinvent.

### DRY consolidation — ONE resolver, everything delegates
- `otmux.current()` → `private.otmux.pane.resolve` (canonical name per task).
- `otmux.pane.get.target()` → delegate to it (DELETE the `${TMUX_PANE}` line 2683).
- `otmux.pane.self()` → define as thin alias to it (existing callers keep working).
- **Caller sites to leave as-is once the resolver is correct** (they already call the right verb): hiveMind:2113/2496/2555 (`pane.self target`), 8108 (`pane.self`); claudeCode:1620 (`context.self`).
- **Caller sites still on raw `$TMUX_PANE` to repoint** through the resolver: otmux send-prefix self-res 1806–1818, session-resolve 1268–1272, `fit` 1307–1316; and kill the stale comment "Self-pane resolution MUST use $TMUX_PANE (Tron P0 #3)" (superseded — $TMUX_PANE lies after move).
- End state: **zero `$TMUX_PANE` in any self-ID path**; one resolver; `current`/`pane.self`/`pane.get.target` are one truth.

### Tester guard (extend T-NO-TMUXPANE)
1. Static: `grep -nE 'TMUX_PANE' otmux hiveMind claudeCode` → zero self-ID uses (only legit target-injection in tests).
2. Positive: in a real tmux pane, export a DELIBERATELY WRONG `TMUX_PANE=%999`, then assert `otmux current` == `otmux pane.self` == the ACTUAL pane (resolver ignores the poisoned env var). This is the regression that proves the move/rewind lie is fixed.
3. Definedness: `type -t otmux.pane.self` non-empty (the live "called-but-undefined" break).

### Branch note (ties BL-1 / Tron's G1-branch call)
The break above is on the LIVE `mcdonges.latest` line. `dev` already has the PID-walk `pane.self` but is unmerged/broken. Wherever Tron lands G1, the resolver must end up on the line agents actually run — else the loop's Model stays untrue. Expert executes; I'm design+review only.
