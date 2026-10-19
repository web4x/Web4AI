# DESIGN: scrumMaster.swipe — pure-bash OOSH, hiveMind-free, output-identical to pulse (oosh-architect, 2026-10-19)

**Plan**: /root/.claude/plans/validated-dazzling-kitten.md (Tron-approved). **Scope**: DESIGN → oosh-expert codes in `scrumMaster` → oosh-tester gates parity-first → oosh-po gates deployed-green + field. **NO hiveMind edits.** **Spec/oracle**: pulse @ scrumMaster:592-770 (read verbatim).

## Method decomposition (all pure bash; python3 ONLY inside swipe.ctx)
- **`scrumMaster.swipe() # <?session>`** — public entry; mirrors pulse `main()`. Build the uuid map ONCE (`claudeCode session.discover.all`), enumerate sessions (arg, else `tmux list-sessions`), per-session per-pane loop, emit TEAM header + rows. No framework-load per pane.
- **`private.scrumMaster.swipe.subtree() # <pane_pid>`** — `ps -eo pid,ppid,args` → ppid→children DFS from pane_pid → emit `kind` (agent iff a claude proc in the subtree) + `shell_count` (children whose argv[0] endswith `bash`). Reproduce pulse's `children`/`claude_proc` predicate EXACTLY (§subtree).
- **`private.scrumMaster.swipe.jsonl() # <pane> <uuid-from-map>`** — FAST: uuid from the discover.all map → `${uuid}.jsonl`; FALLBACK: `claudeCode session.current`/`session.id` (identical result, robustness). Emits the jsonl path or empty.
- **`private.scrumMaster.swipe.ctx() # <jsonl> <denomK>`** — the python3-JSON helper (§ctx): emits `used|pct|denomK`, or `lag`, or empty. Bash re-validates + renders the ctx token.
- **`private.scrumMaster.swipe.classify() # <capture>`** — bash grep/case on last-6-line chrome → the 6-state (§classify).
- **`private.scrumMaster.swipe.role() # <sess> <idx> <title>`** — role from `hivemind.roles.env` FILE (registry-first), else `title`'s last word (§role; the file-read nuance below).
- **REUSE** `private.scrumMaster.rewind.markdir/markname` (:780-788) for the DURING-REWIND marker read — `markname` already `tr -c 'a-zA-Z0-9' '_'` == pulse's `_mark_name`. No new rewind code.

## EXACT format strings (byte-identical — the acceptance criterion; reproduce verbatim)
Colors: `CYAN=\033[96m` `DIM=\033[90m` `RST=\033[0m`. STATE_COLOR: ACTIVE `\033[92m` · IDLE `\033[90m` · ON-PROMPT `\033[96m` · OPEN-DRAWER `\033[93m` · ON-WALL `\033[91m` · DURING-REWIND `\033[95m`.
- **TEAM header** (pulse:766): `{CYAN}TEAM {sess}{RST}  {DIM}{nagents} agents · {nshells} shells{RST}` — TWO spaces before `{DIM}`, middle-dot `·` (U+00B7) spaced.
- **Agent row** (765): `  {idx:<5} {role:<22} {sc}{state:<12}{RST} {DIM}sh:{n}{RST} {ctx}` — 2 leading spaces; idx pad-5, role pad-22, state pad-12.
- **Shell row** (740): `  {idx:<5} {DIM}{'shell':<22} shell{RST}` — literal word `shell` pad-22, then ` shell`.
- **ctx token** (756-764): lag→`{DIM}?ctx-lag(reboot){RST}` · tuple→`{cc}{mark}{pct}% ({usedK}k/{dk}k){RST}` where `cc`=`\033[91m`(pct≥90)/`\033[93m`(pct≥80)/**`\033[32m`**(else — note 32, NOT 92), `mark`=`⚠`(pct≥80) else a single space, NO space between mark and pct, `usedK`=`used/1000` (integer floor) · none→`{DIM}?ctx-no-jsonl{RST}`.
- Header printed FIRST, then rows; per-session; multi-session when no arg.

### ★ #1 PARITY HAZARD — bash printf must reproduce python f-string EXACTLY
- `{x:<5}`/`{:<22}`/`{:<12}` → `printf '%-5s' '%-22s' '%-12s'` (pad-not-truncate; python & printf agree for over-width). 
- Literal ESC → `$'\033[..m'` (or `printf` with `\033`); emit raw bytes, no `echo -e` ambiguity.
- UTF-8 `·` and `⚠` must emit as literal UTF-8 bytes (don't let a locale mangle them).
- `used//1000` (py floor) == `$((used/1000))` (bash floor) — match.
- The sentinel strings `?ctx-lag(reboot)` / `?ctx-no-jsonl` and `sh:` prefix — exact.
- Tester's parity gate masks ONLY the ctx numeric; every byte else must match → build the printf against these strings, diff-test early.

## §classify — precedence on the last-6-line chrome (pulse:697-713; EXACT order)
`tail` = last 6 lines; `low` = lowercased. `idle_bar` = `auto mode on` in low OR `⏵⏵` in tail. Then, in order:
1. **ACTIVE** — `esc to interrupt`/`esc to int` in low.
2. **ON-WALL** — `context left until auto-compact` / `context limit reached` / `compact or /clear to continue` in low. (Caller double-gates pct≥98.)
3. **OPEN-DRAWER** — `NOT idle_bar` AND (`❯ 1.` in tail / `1. yes` / `2. no` / `do you want to proceed` in low / (`select` in low AND `❯` in tail)).
4. **IDLE** — `idle_bar`.
5. **ON-PROMPT** — `tail` rstrip endswith `❯`.
6. else **IDLE**.
**Chrome-only is load-bearing** (last 6 lines, NOT the message body — else an agent discussing "do you want"/"/compact" false-trips; the ARON/agent-trainer bug). Reproduce the match tokens verbatim.
Then in `swipe` (post-classify, matching pulse:751-754):
- **ON-WALL double-gate:** `if state==ON-WALL AND not lagging AND (ctx empty OR pct<98) → IDLE`. A LAGGING ctx must NEVER downgrade a visible wall (false-low). Short-circuit `not lagging` BEFORE reading pct.
- **DURING-REWIND override (last):** if the marker file `$(swipe.rewind.markdir)/$(markname sess:idx)` exists → `state=DURING-REWIND` (declared by the driver, overrides capture).

## §ctx — the python3 JSON helper (the ONLY python; sanctioned env/argv-in → pipe-out)
Mirror pulse `ctx_from_jsonl` (666-695) EXACTLY: scan jsonl lines; `used` = the LAST assistant-usage `input_tokens + cache_creation_input_tokens + cache_read_input_tokens` where total>0 (resets `pending` to 0 on each such turn); `pending` = count of `type` ∈ {user, attachment, tool_result, tool_use} (both `"type":"x"` and `"type": "x"` spacings) since the last assistant-usage.
- `used==0` → emit nothing (bash → `?ctx-no-jsonl`).
- **`pending>8` → emit `lag`** (the content-lag sentinel: a big un-recorded window mid-reboot means `used` is a stale LOWER-BOUND → signal lag, never a false-low that misreads the wall direction). `lag` is distinct from the tuple AND from empty.
- else → `used|pct|denomK` (`pct = round(used*100/(denomK*1000))`).
- **Bash re-validates** (sanity: non-empty, `used>0`, `pct` numeric 0-100) before rendering — defense per the sanctioned pattern.
- F49 note: python3 (the tool helper) reading the jsonl is the SANCTIONED pattern (env/argv in, pipe-delimited out) — NOT a human/agent reading internal files. One inline `python3 -c`, JSON+token-sum ONLY, no logic beyond that.

## §subtree — kind + shell-count (pulse:616-638; reproduce the predicate)
`ps -eo pid,ppid,args` → ppid→children map → DFS from the pane_pid. `claude_proc` = a descendant whose args contain `claude`, argv[0] does NOT start with `claudeCode`, AND (`/claude` in args OR args starts `claude` OR ` claude ` in args OR `--resume` in args). `kind=agent` iff such a proc exists anywhere in the subtree (g.4 robust-kind — claude under a bash parent still = agent). `shell_count` = descendants whose argv[0] endswith `bash`. A pure-bash DFS (or one `awk` pass) — reproduce the predicate so kind/shell-count match pulse byte-for-byte.

## §role + the hiveMind-free constraint (precise — flag to PO)
Role = `hivemind.roles.env` FILE line `sess:idx|role` (registry-first), else `title` last word, else `?` (pulse:715/742). **This is NOT a hiveMind-SCRIPT dependency:** it reads the DATA FILE, which PERSISTS even if the hiveMind script is broken/mid-refactor → satisfies "survives a broken hiveMind." Output-parity REQUIRES the same registry-first-then-title (else the role column diverges).
- **The grep-gate `grep 'hiveMind' <swipe-methods> == 0` HOLDS**: the file is `hivemind.roles.env` (lowercase `hivemind`), the camelCase `hiveMind` script/method name appears ZERO times. Intentional, not accidental — the gate catches script-calls, the lowercase data-file read is sanctioned. **PO: confirm the gate greps the camelCase `hiveMind` invocation (script dependency), not the lowercase data-file path.**
- swipe makes NO calls to the `hiveMind` script (no `hiveMind …` invocations) — only `tmux`, `claudeCode`, `bash`, `python3`-JSON-helper. That is the decoupling (survives a broken hiveMind script).

## Dependency note (ties the live #3 work)
swipe's uuid comes from `claudeCode session.discover.all` → `session.resolve`, which has the **fork-drift fix pending (#3, 34f4001f)**. Parity with pulse holds regardless (pulse uses the SAME discover.all). But the FIELD gate (`swipe == panel` on a forked agent) requires the #3 fork-drift fix LANDED — note the dependency; the field-correctness of swipe rides on #3.

## Deprecate-and-keep pulse
`DEPRECATED` banner in pulse's doc-comment (:592) + a one-line stderr notice `→ use scrumMaster swipe`. Pulse runs UNCHANGED = the parity oracle. Do NOT delete (Tron: zero-break transition).

## Tests (scenario-first, bash)
- **`test/test.swipe-parity` (THE gate):** run `scrumMaster pulse $T` and `scrumMaster swipe $T` on the SAME session → assert outputs IDENTICAL after masking ONLY the ctx numeric field (format/colors/state-tokens/layout byte-identical; ctx value Δ<1). This is the acceptance criterion.
- **`test/test.swipe-jsonl-lag`:** swipe.ctx bash helper — `lag` on >8 content window; numeric-tuple on a fresh jsonl; three states (tuple/lag/empty) DISTINCT; ON-WALL-not-hidden-by-lag (a lagging ctx must not downgrade a visible wall).
- Keep `test.pulse-jsonl-lag`; re-point `test.session-discover-all` Part B at swipe (or run both during transition).

## Handoff
Expert: add `scrumMaster.swipe()` + the `private.scrumMaster.swipe.{subtree,jsonl,ctx,classify,role}` helpers (pure bash; the one python3-JSON block in swipe.ctx); reuse `rewind.*`; deprecate (keep) pulse; build the printf against the EXACT strings above and diff against pulse EARLY. Tester: parity-first RED. PO: gates byte-identical-parity + grep-hiveMind==0 + field swipe==panel (needs #3). Deploy ff at a quiet window.
