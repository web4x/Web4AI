# #41 — config.save / console.log stdout-leak (LOG_DEVICE→fd1) : STATUS for #40 re-apply gate

**From**: oosh-expert (measured 2026-09-08, macos.latest `9c49fe0`) · **For**: oosh-po B2 gate decision
**Ties**: #40 c2-completion re-apply (b73ddd1/5a93fe5/22b4894/6b1ee31, reverted by `8c9a368` citing this root). Same class as BUG5 (`2b68265` "logs must never reach fd1"), #4/#6 pure-state-emit.

## Question (PO): is the #41 stdout-leak resolved, or still open? Re-applying #40 over an unfixed #41 re-introduces the revert.

## BOTH-BRANCHES VERDICT (PO asked: did #4/#6 pure-state work close it?) — 2026-09-08
**dev = CLOSED. macos.latest = LIVE. The #4/#6/BUG5 fix was never ported to macos.latest.**

| | dev (`fcd8e6d`) | macos.latest (`9c49fe0`) |
|---|---|---|
| `private.log.emit` (off-fd1 emit, `>&2` dup, excludes /dev/stdout — cites "BUG 5 $() capture safety") | **PRESENT** (log:56-72) | **ABSENT** (grep=0) |
| `console.log` terminal write | delegates → `private.log.emit` (log:81) — never fd1 | raw `echo -e … >>$LOG_DEVICE` (log:94) → **fd1** when LOG_DEVICE=/dev/stdout |
| `config.save` "config.save (CONFIG=…)" console.log | **GUARDED** behind `$silent` 3rd-arg (config:335-337) — no emit during completion | **UNGUARDED** top-level (config:258) — fires whenever config.save runs |

→ On dev the leak is closed at BOTH the log layer (private.log.emit) and the call site (silent guard). On macos.latest NEITHER is present → root LIVE.

### #41 fix for macos.latest (the pure-state emit you specified)
Port dev's `private.log.emit` (log:56-72) + rewire `console.log` (and peer log fns) to delegate to it — single-source, OS-independent, keeps ALL logs off fd1 during `$()` captures. Optionally also add the `$silent` guard to config.save (belt-and-suspenders). This is the #4/#6/BUG5 class fix, NOT the reverted 5a93fe5 downstream filter (22b4894 proved that filter insufficient). Then #40b (cyan) can re-green over a clean param env.

## Measured verdict (macos.latest, earlier pass): ROOT OPEN, specific config.save vector currently DORMANT

### Evidence (macos.latest, this box)
1. **Root condition LIVE.** A fresh OOSH completion subprocess has `LOG_DEVICE=/dev/stdout`, `LOG_LEVEL=3`. `console.log` (log:~105) is `echo -e "${NO_COLOR}$*" >>$LOG_DEVICE` with **NO fd1-coercion guard** → at LOG_LEVEL>2 with LOG_DEVICE=/dev/stdout it writes to **fd1**. Any `console.log` inside a `$(...)` capture in the completion pipeline contaminates the captured value. The BUG5 coercion (log fns flip empty/stdout LOG_DEVICE→/dev/stderr) is **NOT present** in this console.log.
2. **Specific config.save vector DORMANT.** `grep config.save ng/c2` = empty — `config.save` is NOT invoked in the c2 completion path on current macos.latest. `config` line 258 still has `console.log "config.save (CONFIG=$CONFIG)"`, but that function isn't reached during completion now.
3. **Consumer band-aid GONE.** `5a93fe5` ("filter current.method.env to declare-only lines") was reverted by `8c9a368` (part of the #40 revert). So neither the root fix nor the consumer filter is active.
4. **Empirical NOW = clean.** `ng/c2 completion.discover 3 "" otmux send D -` → `current.method.env` is all-`declare` (no `config.save (CONFIG=…)` leak). i.e. no console.log fired to fd1 in THIS path today.

### Interpretation
- The **exact** revert trigger (config.save's console.log) does **not reproduce** on current macos.latest → a #40 re-apply would not immediately re-break via that vector.
- BUT the **root** (console.log→fd1 while LOG_DEVICE=/dev/stdout) is a **latent landmine**: any completion subprocess that console.logs (a future config/line bootstrap change, a different method's completion) re-contaminates the sourced param env. Re-applying #40's cyan/param machinery on top of this unfixed root risks re-introducing the RED that caused the revert.

## Recommendation (PO decides; tester gates — I do not self-verify)
**Fix #41 ROOT first, then re-apply #40.** The durable fix is the pure-state-emit / no-fd1-leak principle (BUG5 / #4 / #6): coerce `LOG_DEVICE` off fd1 in the log layer — e.g. in `console.log` (and peers) `[ "$LOG_DEVICE" = /dev/stdout ] || [ -z "$LOG_DEVICE" ] && LOG_DEVICE=/dev/stderr` for the emit — so NO log ever reaches fd1 during a `$()` capture. This is OS-independent, single-source, and makes #40's re-apply safe regardless of which subprocess logs. (Alternative narrow band-aid = re-land the reverted declare-only filter `5a93fe5`, but that fixes the consumer not the root — not recommended as the sole fix.)

## Do NOT (per current gate)
- Do NOT re-apply #40 yet (HELD).
- Do NOT self-verify — tester gates both branches.

## Follow-on once #41 root fixed
Re-apply #40 = b73ddd1 (3-tier precedence + `<text...>`→`<text>` rename — note `PARAM_text...="addDefaultValue"` still present today, confirming the rename is currently OUT) cleanly on the #41-fixed + printf-converged base, on BOTH branches.

---
## #41 BACK-PORT LANDED — oosh-expert: macos.latest `9824746`, pushed
Per architect root-fix note (e62f19b2): **back-ported c0e6036** (not reinvented, not a downstream filter). `git cherry-pick c0e6036` CONFLICTED (macos.latest `log` is a different lineage — raw `>>$LOG_DEVICE`, never had `private.log.device`), so **surgical port**:
- Added `private.log.emit()` (dev c0e6036 body verbatim): `case LOG_DEVICE in ""|/dev/stdout|/dev/stderr|/proc.../dev/tty) printf '%b\n' >&2 ;; *) file-append, fd2 fallback`. fd1/stdout excluded by construction.
- Routed the `.log` functions through it: test.console/console/silent/success/warn/important/debug/error (8 sites). `warn.log` previously had a bare `echo` (no redirect = fd1 leak) — now routed too.
- **config.save: ZERO change** (config:258 console.log now fd1-safe automatically — maximal DRY).
- Untouched (architect's optional residual, NOT the param-contamination vector): log:18-58 init echoes, problem/breakpoint interactive dumps (223/247, high-LOG_LEVEL only).
**Expert self-checks (NOT the gate):** `bash -n` OK; decisive fd1-exclusion — `LOG_DEVICE=/dev/stdout console.log LEAKTEST 2>/dev/null` → **empty stdout** (routed to fd2), leak closed.
**ng/c2 L214 `grep '^declare '`**: now belt-and-suspenders, not load-bearing (left as-is, not extended).
**mcdonges.latest**: NOT hand-triplicated — it takes c0e6036 via its own dev-reconcile later (PO directive).
→ Tester re-greens **T-CYAN** on macos.latest (real Tab, correct clone) → unblocks **#40b** cyan.

### macos.latest disjoint+#41 set (per-task hashes)
| task | hash | note |
|---|---|---|
| #39 pane.capture | `b2dd551` | CLOSED, tester `a6a98dc` |
| B1 line.format emit | `9c49fe0` | dev 81d82bd form, body==dev |
| #40a precedence+rename | `a68c89a` | cherry-pick b73ddd1, byte-identical, cc11daf avoided |
| #41 private.log.emit | `9824746` | back-port c0e6036, fd1 excluded |
| #40b cyan | HELD→**unblocked** | tester re-greens T-CYAN |
