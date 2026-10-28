# DESIGN: OOSH stdout is DATA — every log banner goes to stderr (oosh-architect, 2026-10-28)

**From:** oosh-po (expert finding, framework-wide) · **Scope:** DESIGN ONLY, oosh-po schedules the fix.
**Measured on:** live `/root/oosh` (mcdonges.latest), read-only.
**Same class as:** otmux `warn.log` corrupting the pane id that `split -P` returns (fixed at one call site by `>&2`, 776aef9a). This design fixes the class at its source, the kernel `log`.

## 1. Measured root cause — two layers
**Path of the banner:** `debug:287` installs `trap 'onError ${?} ${BASH_COMMAND}' ERR`. `onError` (debug:227) prints via `error.log` (debug:258, the `ERROR> line N: "return" from … returned with ERROR code` banner) or `warn.log` (debug:247, expected errors).

**Layer A — two log functions write to stdout UNCONDITIONALLY** (no redirect at all):
- `warn.log` — `log:175` `echo -e "WARNING> $*"`.
- `problem.log` — `log:201` `echo -e "PROBLEM BREAKPOINT> $*"` (`#>>$LOG_DEVICE` commented out).

**Layer B — every other banner writes to `$LOG_DEVICE`, and this box persists `LOG_DEVICE=/dev/stdout`** (`$CONFIG_PATH/log.env`, measured). So `error.log` (log:243), `important.log` (190), `debug.log` (213), `stop.log` (224), `success.log` (149), `console.log` (94/105) also land on stdout. `log init` only falls back to `/dev/stderr` when the tty probe fails (log:22/40/61), and `log level` defaults an empty device to `/dev/tty` (log:337) — so the device depends on how and where the box was configured.

**Net:** under a sourced rc≠0 (the ERR trap) or any warn/error call, a banner is written into the SAME stream the caller is capturing as data.

## 2. Callers at risk
Any OOSH verb whose stdout is consumed by `$(…)` or a pipe. Rough count of command substitutions of OOSH verbs inside the core scripts: **otmux 35, hiveMind 188, claudeCode 32, scrumMaster 22** (≈280). Highest-impact data outputs:
- identity/topology: `otmux pane.self`, `split -P` pane ids, `pane.get.target`, `hiveMind.live.tupleset`, `agents.discover` rows, `resolve`;
- state/context: `sweep.detect` status, `context.from.jsonl.reading` `used|pct|denom`, `claudeCode context.read`, `session.name` / uuid lookups;
- config: `config get`/values read back into variables.
A banner line in any of these is parsed as a pane id / role / uuid / number → wrong routing, wrong context %, wrong registry row. Silent, because the caller sees rc0 from its own `$(…)`.

## 3. Design — the stream contract
**Rule: stdout = the verb's DATA only. Every diagnostic (ERROR / WARNING / IMPORTANT / PROBLEM / BREAKPOINT / debug / info / SUCCESS / trap banners) = stderr.** Same law as Unix tools; it makes `$(verb)` safe by construction instead of call-site by call-site.

1. **One emitter in `log`:** `private.log.emit <text>` writes `>&2` (fd 2), never `$LOG_DEVICE` for the terminal copy. All of `error/warn/important/problem/debug/stop/info/success.log` route through it. Keep the existing `$LOG_LIVE` file copy unchanged (it's a file, not a stream).
2. **Fix Layer A:** `warn.log` and `problem.log` go through the emitter (their missing redirect is the direct bug).
3. **Retire `LOG_DEVICE` as a stream selector.** It is persisted state that silently picks the stream (`/dev/stdout` here). Either delete it, or keep it ONLY as an *extra* tee target (a file); it must never be able to point diagnostics at stdout. `config save` stops persisting `/dev/stdout`; a persisted `/dev/stdout` or `/dev/tty` is migrated to "unset" on the next `config save`/`log init` (self-heal, constructor contract).
4. **`console.log` — decide explicitly (oosh-po):** it is the user-message channel. Two options:
   - (a) stderr like the rest — matches the dev line ("console.log → private.log.emit → fd2, BUG-5 capture-safety", bc97f63). **My lean.** User messages still reach the terminal; only stdout data stays clean.
   - (b) stdout, but then every verb that returns data must never call it. Harder to guarantee.
5. **`onError` (debug:227):** prints only via the emitter (→ stderr). Its `echo … >/dev/tty` (debug:239) stays (explicit tty, not stdout).
6. **Remove call-site `>&2` workarounds** (e.g. 776aef9a) only AFTER the kernel fix ships, so there is no window where they are needed and gone.

## 4. Tests (tester; RED first)
- **T-STDOUT-IS-DATA (kernel):** with `LOG_DEVICE` set to `/dev/stdout`, empty, and `/dev/tty`: `out=$(warn.log x; error.log y; important.log z; problem.log p)` → `out` is EMPTY and stderr contains all four. RED today on Layer A and B.
- **T-ERR-TRAP-STDOUT:** a sourced function returning rc1 inside `$(…)` → captured stdout has no `ERROR>` line.
- **T-DATA-VERBS-CLEAN:** for the high-impact verbs in §2, force a warn/error path (fixture) and assert stdout is byte-identical to the no-error run (e.g. `otmux pane.self`, `live.tupleset`, `context.from.jsonl.reading`).
- **Static guard:** grep `log` for `echo` without `>&2`/`>>$LOG_LIVE` in the banner functions == 0.

## 5. Risk / rollout
- Behavior change: scripts or humans that read banners from stdout (e.g. `2>/dev/null` used to hide nothing; now it hides banners). Measure: grep for callers redirecting `2>/dev/null` around verbs whose warnings they rely on — expect few, list them in the fix PR.
- Ships on the line agents run (mcdonges.latest) — ties backlog BL-1 (dev already has part of this: console.log→fd2).

## 6. PO approval (c266e3752) + console.log-as-data scan (2026-10-28)
**Approved.** `console.log` → **stderr** (matches dev bc97f63). **Condition:** before the kernel flip, every verb that RETURNS DATA via `console.log` converts its data to plain `echo`/`printf` first (else `x=$(verb)` goes empty).
**Order:** RED-first tests (T-STDOUT-IS-DATA, T-ERR-TRAP-STDOUT, T-DATA-VERBS-CLEAN, static guard) → data-via-console.log conversions → one `private.log.emit` + fix A + retire LOG_DEVICE as stream selector (self-heal persisted `/dev/stdout`) → only then remove call-site `>&2` workarounds. **Scheduled after** the no-python + drain work.

**Scan (static, live mcdonges.latest; scripts otmux, hiveMind, claudeCode, scrumMaster, config, line, this):**
- **47 functions call `console.log`.** All are action/report verbs: loops, dashboards, team.push/recover/cycle, watchdog, git.commit, agent.send/rewind/handoff, the `otmux.send.verified` status line, `scrumMaster.subscription.status`/`dashboard`/`pdca.*`, `config.save/add`, `private.check.*` phases.
- **82 distinct functions/verbs are captured with `$(…)`** inside those scripts.
- **Intersection = 0.** No captured function's own body emits its data via `console.log`.
- **`this.absolutePath` / `this.absolutePathName`** use `console.log` but already return data correctly: the `pipe` option prints `echo "$RESULT"`; `console.log "absolutePath: $RESULT"` is only the human-label branch. No conversion needed.

**Limits (T-DATA-VERBS-CLEAN must close these at runtime):** one level only (a captured verb that calls a helper which console.logs its data is not caught); core scripts only (tests, other OOSH scripts, and agent/interactive `x=$(scrumMaster subscription.status)`-style uses are not scanned). **Watch list** for the runtime test: `otmux.send.verified`, `scrumMaster.subscription.status`, `scrumMaster.dashboard`, `hiveMind.dashboard` — human views today; verify no caller parses their stdout.
