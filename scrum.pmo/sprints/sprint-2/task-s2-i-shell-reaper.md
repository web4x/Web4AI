[Back to Sprint 2 Planning](./planning.md)

# Task S2-I: shell.reap — reap accumulated background shells (fd-leak / persist-thru-rewind)
[task:uuid:8c149a17-6516-4036-a949-581965ff7109]

## Status
- [x] Planned
- [x] In Progress
- [x] QA Review (expert-verified live; awaiting tester T-SHELL-REAP)
- [ ] Done

## Traceability
- up
  - [Sprint 2 Planning](./planning.md)
- related: [task-s2-h dashboard](./task-s2-h-team-sweep-fleet-dashboard.md) (SURFACES the shell-count) · [task-s2-c OTR-2 route/fd](./task-s2-c-registry-route-identity.md) (fd-exhaustion family)

## Description
**From Tron/SM (2026-07-02):** background shells ACCUMULATE per agent (e.g. expert=4) and **persist THROUGH rewind** = an fd-leak (ties to OTR-2 fd-exhaustion — accumulated shells consume file descriptors; suspected route-corruption aggravator alongside the u20 malware). task-s2-h shows the COUNT; this task REAPS them.
**Role**: architect (design: what's safe to reap) → expert (impl) → tester (T-SHELL-REAP).

## Requirements
- `shell.reap <pane|all>` (object.verb, no-flag) — identify STALE/orphaned background bash subtrees per pane (the SAME tty→pane_pid subtree task-s2-h counts) and terminate the stale ones.
- **Self-care safety**: NEVER kill a shell doing active work (a running command / live child); reap only idle/orphaned/detached shells. Reap opportunistically on rewind + idle-sweep.
- Persist-thru-rewind is the key leak: a rewind forks fresh ctx but leaves the old bg shells → reap them at/after rewind.
- DRY: reuse the batch-ps subtree logic task-s2-h uses for the count.

## Definition of Done
- `shell.reap` terminates stale bg shells, leaves active ones untouched
- post-rewind shell count returns to baseline (leak closed)
- T-SHELL-REAP: seed stale bg shells then reap → count drops, an active shell survives

## ARCHITECT DESIGN (oosh-architect, 2026-07-02) — SAFE reap, correct-by-construction
**The whole risk is in the classifier: reap ONLY provably-safe shells, KEEP on any doubt. This codebase already proved the danger — `pane.lock/unlock` had BUG6 (loose `pkill -f` reaped orphan *enforcers* indiscriminately) and a documented hazard (otmux:3119 "would SIGTERM the live foreground otmux"). shell.reap must be immune to exactly that.**

### 1. DRY — reuse the task-s2-h producer
Enumerate bg-shells from the SAME `tty → pane_pid → batch-ps subtree` logic task-s2-h uses to COUNT (ONE producer: h counts, i classifies+reaps). Orphan test reuses `claudeCode.process.running <pane>` (claudeCode:972). Reap by CLASSIFIED PID — never a loose `pkill -f` pattern (the BUG6 lesson).

### 2. The classifier — an ALLOW-LIST of provably-safe conditions; DEFAULT = KEEP
A bg-shell (a bash/sh descendant of a pane's shell, EXCLUDING the pane's own foreground `pane_pid`) is reaped ONLY if it matches a proven-safe class. Anything ambiguous → KEEP (correct-by-construction — reapability is an allow-list, never a deny-list; [[correct-by-construction]]).
- **ORPHANED → reap.** The owning pane has NO live Claude (`claudeCode.process.running` false) OR the bash reparented to init (`ppid==1`, its spawning claude gone). This is the rewind/dead-agent orphan — no one will ever read its output. **The dominant leak.**
- **IDLE-STALE → reap.** Owning claude ALIVE, but the bash has **NO non-defunct child** (no command running), AND age > `SHELL_REAP_TTL` (default 300s), AND no recent CPU. A finished background command's lingering shell.
- **ACTIVE-WORK → NEVER reap.** Has a live running child (a foreground command executing) OR recent CPU/output OR is a pane's live foreground shell. Plus: **never `pane_pid` itself** (the interactive pane shell — the otmux:3119 hazard). Any unprovable case falls here → KEEP.

### 3. Reap = graceful, by PID, re-checked
`SIGTERM` the classified bash → grace window → **RE-CLASSIFY** → `SIGKILL` only if STILL reapable and still alive. Term the subtree by PID (bash + its defunct children go with it). A shell that started real work during the grace window is spared on the re-check. Never SIGKILL an active-work shell.

### 4. Triggers — opportunistic self-care (object.verb, never aggressive)
- **at rewind** (post-fork event, hiveMind:530): rewind kills the claude → its bg shells orphan → `shell.reap` reclaims them. **This closes the persist-thru-rewind leak — the OTR-2 fd tie.**
- **at idle-sweep**: task-s2-h SHOWS a high shell-count → SM triggers `shell.reap` for the idle-stale ones. h shows, i reaps.
- Only opportunistic (rewind + idle-sweep) — no scheduled mass-kill.

### 5. OTR-2 fd-exhaustion tie
Each leaked shell holds file descriptors (pipes/sockets). Orphans persisting through rewind = the fd-leak → EMFILE (the C.1 watch-item "confirm/kill the fd source" — **shell.reap IS the fd-source killer**). Reaping reclaims their fds → curbs the route-corruption aggravator alongside the u20-malware socket source.

### 6. Interface (object.verb, no-flag) — with a SAFETY VALVE
- `hiveMind shell.reap <?pane|session>` — reap provably-safe leaked shells (one pane/team or all). No arg = all active teams (mirrors task-s2-h fleet).
- `hiveMind shell.reap.dry <?pane|session>` — **classify + REPORT what WOULD be reaped, kill NOTHING.** The SM/human safety-audit before trusting the reaper; also the tester's assertion surface.
- Shares the subtree enumerator with task-s2-h; depends on it.

### 7. Safety invariant (the DoD core)
**shell.reap NEVER terminates an active-work shell nor a pane's foreground shell.** Provable-safe-only. If the classifier can't PROVE safe → KEEP. Missing a leaked shell (keep) is cheap; killing active work is not — the asymmetry drives every default.

### Handoff
- **Expert**: implement `shell.reap` / `shell.reap.dry` on the task-s2-h subtree producer + `claudeCode.process.running` orphan test; graceful term-by-PID with re-check; wire the rewind (hiveMind:530) + idle-sweep triggers. **Depends on task-s2-h's producer.** Commit.
- **Tester**: **T-SHELL-REAP** — (a) orphan (spawn bash, kill its parent claude/shell) → reaped; (b) **ACTIVE (bash with a live `sleep 300` child) → SURVIVES [the critical safety assertion]**; (c) idle-stale (bash, no child, age>TTL) → reaped; (d) **pane foreground shell → NEVER reaped** (the pane.lock hazard guard); (e) ambiguous (bash with a fresh child) → kept; (f) fd reclaim: open-fd count before/after → drops; (g) `shell.reap.dry` kills NOTHING, reports the same set; (h) isolation — never touch a real agent's active shell.

## Report-back
- Architect (safe-reap design): **DONE 2026-07-02** — safe-reap is correct-by-construction: reap ONLY provably-safe (ORPHANED = owning pane no live claude / reparented-to-init; IDLE-STALE = no running child + age>TTL), DEFAULT=KEEP on any doubt; ACTIVE-WORK + the pane foreground shell NEVER reaped (guards the proven pane.lock otmux:3119 "SIGTERM live foreground" hazard + BUG6 loose-pkill). Reuses task-s2-h tty→pane_pid subtree (DRY) + `claudeCode.process.running`. Graceful SIGTERM→re-check→SIGKILL by PID (not pkill-pattern). Triggers: rewind (hiveMind:530, closes the fd-leak-thru-rewind = OTR-2 tie) + idle-sweep. `shell.reap.dry` = safety-audit valve. Depends on task-s2-h. T-SHELL-REAP incl. the active-survives + foreground-never assertions.
- Expert (impl): **DONE 2026-07-03 `64c0365`** (dev). `hiveMind shell.reap <?pane|session>` + `hiveMind shell.reap.dry <?…>` (safety-audit valve — kills NOTHING). **Correct-by-construction ALLOW-LIST classifier, DEFAULT=KEEP:** REAP only — **orphaned-reparented** (`ppid==1`; kernel-provable parent-death → reaped even WITH a live child = the post-rewind `sleep`-loop leak, the ONE case where reap-with-child is safe), **orphaned-no-claude** (no live child + `claudeCode.process.running` false), **idle-stale** (no live child + age>`SHELL_REAP_TTL`:300s). **NEVER** — active-work (live non-zombie child under a still-parented shell), the pane's own foreground shell (`pid==pane_pid`, guards the proven otmux:3119 SIGTERM-live-foreground hazard), or any ambiguous/young case. **Kill by PID: SIGTERM → 0.3s grace → RE-CLASSIFY on fresh ps → SIGKILL only if still reapable** (spares a shell that started work mid-grace) — never a `pkill -f` pattern (the BUG6 lesson applied). **Candidates = pane_pid subtree UNION reparented (`ppid==1`) orphans that KEPT the pane's tty** — the post-rewind leak LEAVES the subtree at reparent, so tty-attribution (the c.0 `tty` field) recovers it. **DRY**: shares the `private.hiveMind.shell.descendants` producer with task-s2-h's `bgshells` (h counts / i classifies+reaps). **Verified:** classifier 7/7 synthetic (incl. post-rewind-leak-with-child=REAP + busy-non-reparented=KEEP + foreground=KEEP) · LIVE mechanism (real `ppid==1` orphan REAPED, active bash+sleep-child SURVIVED) · tty-orphan discovery (only bash+ppid1+matching-tty) · **fleet `.dry` flags NOTHING on live agents (zero false-positives)**. Non-regr: teamsave-parity 3/3, team.sweep sh:K intact.
  - **⏭ TRIGGERS — deferred pending T-SHELL-REAP (not auto-wiring a killer un-verified):** (a) **idle-sweep is ALREADY operational** — SM runs `hiveMind shell.reap` when the task-s2-h dashboard shows high `sh:K`; `.dry` first as the audit. (b) **rewind auto-trigger** (post-fork event hiveMind:~530): design-specified as the fd-leak cure, but auto-killing on every fork should land AFTER the tester verifies the live safety (T-SHELL-REAP). Recommend wiring it as a follow-up once green — the reaper's `ppid==1`-only + DEFAULT=KEEP make it safe, but a killer earns its auto-trigger by passing the safety suite first.
- Tester (T-SHELL-REAP): **✅ GATE PASS 4/4** (dev `test/test.shell-reap`) — SR-CLASSIFIER-SRC [S] (pane_pid foreground guard + kill-by-PID + ZERO pkill-pattern), SR-DRY-CLASSIFY (.dry flags the ppid==1 orphaned-reparented leak, SPARES active + foreground), SR-DRY-KILLS-NOTHING (audit valve terminates nothing), **SR-APPLY [critical]** (shell.reap REAPS the leak while the ACTIVE-work shell [sleep-300 child + parent alive], the pane foreground, AND an out-of-scope ppid==1 control ALL SURVIVE: leak=no active=yes fg=yes ctrl=yes). Fake-claude scratch agent-pane fixtures, fully isolated + cleaned (0 leftovers, real agents untouched). **Safe reaper verified — rewind auto-trigger now earns its wiring.**
- Tester (T-SHELL-REAP): READY — (a) orphan (spawn bash, kill its parent → `ppid==1`) → reaped; (b) **ACTIVE (bash with a live `sleep 300` child, parent alive) → SURVIVES [critical]**; (c) idle-stale (bash, no child, age>TTL — set `SHELL_REAP_TTL=1`) → reaped; (d) **pane foreground shell → NEVER reaped**; (e) post-rewind leak (bash `ppid==1` WITH a sleep child on the pane's tty) → reaped; (f) fd reclaim before/after; (g) **`shell.reap.dry` kills NOTHING, reports the same set**; (h) isolation — never touch a real agent's active shell. Commit `64c0365` on dev. `SHELL_REAP_TTL` env-tunable for (c).

---
## ✅ task-s2-i DESIGN done (architect 4d670b5) — PO APPROVED
Safe-reap CORRECT-BY-CONSTRUCTION: reap ONLY provably-safe (ORPHANED = owning pane has no live claude / reparented-to-init; IDLE-STALE = no running child + age>TTL); DEFAULT=KEEP on ANY doubt. ACTIVE-WORK + the pane's own FOREGROUND shell = NEVER reaped.
- **Guards proven hazards**: the pane.lock SIGTERM-live-foreground (otmux:3119) + BUG6 loose-pkill. **Kill by PID (SIGTERM→re-classify→SIGKILL), NEVER pkill-pattern** — the BUG6 lesson applied directly.
- **DRY**: reuses task-s2-h tty→pane_pid subtree (h counts / i reaps) + claudeCode.process.running.
- **Triggers**: rewind (hiveMind:530 — closes persist-thru-rewind = the OTR-2 fd-leak cure) + idle-sweep. `shell.reap.dry` = safety-audit valve (kills nothing).
- Depends on h (→ depends on c.0). **Expert impl after h.** Tester T-SHELL-REAP asserts active-SURVIVES + foreground-NEVER.

---
## ✅ task-s2-i shell.reap DONE (expert 64c0365) — awaiting tester T-SHELL-REAP gate
SAFE reaper, correct-by-construction allow-list, DEFAULT=KEEP: reaps ONLY ppid==1 orphans (incl post-rewind sleep-loop leak, kernel-provable) / no-claude / idle-stale>TTL. NEVER active-work (live child + parent alive) nor the pane FOREGROUND shell (otmux:3119 hazard guard). Kill by PID SIGTERM→re-classify→SIGKILL (BUG6 lesson, no pkill-pattern). shell.reap.dry = audit valve (kills nothing). Candidates = pane subtree ∪ tty-matched ppid==1 orphans. DRY: shares the subtree producer with task-s2-h. Expert-verified: classifier 7/7 synthetic + LIVE orphan-reaped/active-survived + fleet .dry flags nothing.
**DISCIPLINE (PO endorses):** rewind auto-trigger DEFERRED until T-SHELL-REAP green — won't auto-wire a killer unverified. SM can run `shell.reap` / `shell.reap.dry` MANUALLY now (dashboard shows the counts).
**Gate:** tester T-SHELL-REAP (critical: active-SURVIVES + foreground-NEVER).

---
## ✅ task-s2-i shell.reap — PO QA PASS (T-SHELL-REAP 4/4, 2026-07-03)
Tester T-SHELL-REAP 4/4 PASS: SR-CLASSIFIER-SRC [S] (pane_pid foreground guard + kill-by-PID + ZERO pkill-pattern — BUG6 locked structurally) · SR-DRY-CLASSIFY (.dry flags the ppid==1 orphaned-reparented post-rewind leak, spares active+foreground) · SR-DRY-KILLS-NOTHING (audit valve) · SR-APPLY [critical] (leak=reaped, active-work=SURVIVES, foreground=NEVER, out-of-scope control=SURVIVES). Fully isolated, 0 leftovers, 14 real agents untouched. **The safety asymmetry (never leave the agent worse off) is verified.** **PO QA GATE: PASS.**
**Rewind auto-trigger UNBLOCKED** (was deferred until this green) → wire `shell.reap` into task-s2-j `hiveMind.agent.rewind` (reap the peer's persist-thru-rewind leak AFTER the rewind completes). Closes the OTR-2 fd-leak automatically + safely.
