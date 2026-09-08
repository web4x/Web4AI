# #41 — config.save / console.log stdout-leak (LOG_DEVICE→fd1) : STATUS for #40 re-apply gate

**From**: oosh-expert (measured 2026-09-08, macos.latest `9c49fe0`) · **For**: oosh-po B2 gate decision
**Ties**: #40 c2-completion re-apply (b73ddd1/5a93fe5/22b4894/6b1ee31, reverted by `8c9a368` citing this root). Same class as BUG5 (`2b68265` "logs must never reach fd1"), #4/#6 pure-state-emit.

## Question (PO): is the #41 stdout-leak resolved, or still open? Re-applying #40 over an unfixed #41 re-introduces the revert.

## Measured verdict: ROOT OPEN, specific config.save vector currently DORMANT

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
