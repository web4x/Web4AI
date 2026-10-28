# DESIGN: remove every python call from OOSH (oosh-architect, 2026-10-28)

**Law (Tron, standing):** not a single python dependency in OOSH, ever. Only exception: **opy**. **No jq** either (not a base dependency). Replacement = pure Bash + awk/sed/grep.
**Scope:** DESIGN ONLY. The expert implements; the tester gates. **Measured:** live `/root/oosh` (mcdonges.latest), read-only.
**Supersedes:** the 10-19 swipe doctrine "python3 as JSON-helper only" and "keep pulse as the parity oracle". Pulse's oracle role moves to **recorded golden files** (step 0).

## 0. What the python is actually doing
Almost every call parses a Claude Code **session JSONL** (one compact JSON object per line) to read the assistant **usage triple** (`input_tokens + cache_creation_input_tokens + cache_read_input_tokens`), sometimes with the `timestamp`. That is one primitive, written 10+ times in three scripts. The rest:
- three single-key reads: OAuth creds, the usage API, `custom-title`;
- ISO-timestamp date math;
- one `ps`/`tmux`/glob scan;
- **real Python programs** in otest and osemvec (§4, flagged).

## 1. Three shared primitives (DRY — one home each, pure bash+awk)
**P1 `claudeCode jsonl.usage <jsonl> <mode>`** (claudeCode already hosts this domain; swipe and hiveMind already depend on claudeCode).
- awk, one pass, per line. A line **counts** iff it contains an **unescaped** `"type":"assistant"` (regex `(^|[^\\])"type":"assistant"`) AND an unescaped `"usage":{`.
- Numbers come from the FIRST unescaped `"input_tokens":N`, `"cache_creation_input_tokens":N`, `"cache_read_input_tokens":N` after `"usage":{` (missing key → 0).
- **Anchoring with the leading quote excludes `"ephemeral_5m_input_tokens"`/`ephemeral_1h_…`.** Anchoring on "not preceded by a backslash" excludes the same strings appearing **escaped inside message content** (`\"input_tokens\":`), where a naive grep would read a number out of a quoted tool result.
- Tolerate the `"key": value` spacing variant.
- Modes:
  - `last` — last total > 0 (skips zero-total stub records, as the python does);
  - `max`;
  - `firstlast` — first and last `ts|total`;
  - `lag` — the >8 content-window sentinel. The python here does **substring** checks for `"type":"user"/"attachment"/"tool_result"/"tool_use"` (both spacings) anywhere on the line. awk mirrors that **exactly**, deliberately not "top-level only", because parity is the point.
- Output pipe-delimited; empty on no data.

**P2 `line json.get <key> [<parent>]`** — one key from a single-line JSON object; value = number, `true`/`false`/`null`, or a string.
- String unescape for `\" \\ \/ \n \t`. **A `\uXXXX` escape → fail-closed (empty)**: never a wrong value.
- `<parent>`: first isolate `"<parent>":\{[^{}]*\}`. **If the parent object contains a nested `{`, fail closed.** It only reads flat parents.

**P3 `line iso.epoch <iso8601>`** — strip fractional seconds; handle `Z` / `±HH:MM`. GNU `date -d`, else BSD `date -j -u -f '%Y-%m-%dT%H:%M:%S'` (OOSH runs on macOS too). Fail → empty.

## 2. Site-by-site (A = awk-safe · F = FLAGGED for oosh-po, no papering-over)
| site | parses | replacement | class | parity proof (frozen fixture; old python output recorded once as GOLDEN → new must be byte-identical) |
|---|---|---|---|---|
| scrumMaster:596 `pulse` | whole embedded program | **delete pulse** after swipe is parity-locked against pulse GOLDENS | A | goldens recorded from pulse on frozen panes + JSONLs (step 0) |
| scrumMaster:811 `swipe.ctx` | JSONL usage + lag | P1 `last` + `lag` | A | `test.swipe-jsonl-lag` fixtures + escaped-usage-in-content + ephemeral keys + zero-stub records |
| scrumMaster:1710/1711 creds | `claudeAiOauth.accessToken`, `.expiresAt` | P2 with parent `claudeAiOauth` | A (security) | compare **sha256 of the token**, never print it; a pretty-printed creds file or a nested parent → fail closed → existing "failed to extract" error |
| scrumMaster:1728 expiry | `time.time() > ms/1000` | `[ "$(date +%s)" -gt $((expires_at/1000)) ]` | A | table of past/future/boundary epochs |
| scrumMaster:1756 usage API | 9 fields under `five_hour` / `seven_day` / `seven_day_opus` / `seven_day_sonnet` / `extra_usage` | P2 with parent per field; `null` → empty | A (fail-closed) | recorded API responses incl. `null` parents, missing parents, added unknown keys. If the API ever nests inside a parent → empty → verdict `unknown`, never a wrong number |
| scrumMaster:2367 `resets.in` | ISO → "Xh MMm" | P3 + bash arithmetic | A | fixed `now` injected; ±, zero, rollover cases |
| scrumMaster:2569 `remain_min` | ISO → minutes | P3 + arithmetic | A | same |
| scrumMaster:1713/1777, claudeCode:302/1349/1361 | **jq fallbacks** | delete (jq banned) | A | covered by each site's test |
| claudeCode:1351 `custom-title` | `customTitle` from one line | P2; `\u` → fall through to Method 3 | A | titles with quotes, backslashes, `@`, unicode (must fall through, not garble) |
| claudeCode:1674 observed max | JSONL `max` over the last 200 lines | P1 `max` (fed by `tail -200`) | A | fixture crossing the 200k default |
| claudeCode:1743 remaining % | last usage → `round(100 − pct, 1)` | P1 `last` + `awk printf "%.1f"` | A | **rounding tie cases**: python `round()` vs C `printf` can differ on exact .x5 ties. Fixture must include ties; if they differ, define the rule explicitly and update both golden and spec |
| claudeCode:2017 / 2108 velocity | first/last usage + ts → rate | P1 `firstlast` + P3 + awk arithmetic | A | fixtures: <2 messages, same-second ts, `Z` vs `+00:00` |
| hiveMind:7484 `hasNonZero` | any non-zero usage | P1 `last` non-empty | A | zero-only stub file → empty |
| hiveMind:7496 newest non-zero by mtime | agentName grep + non-zero + mtime | `grep -lF` (exists) + P1 + `stat` (GNU/BSD) | A | mtime-ordered fixtures |
| hiveMind:7569 observed max | P1 `max` | A | as claudeCode:1674 |
| hiveMind:7647 `context.from.jsonl.reading` | last non-zero + honest denom | P1 `last` + existing denom | A | the 0-guard and value-sanity cases (`used==0` → fail loud) |
| hiveMind:3031 / 3193 `roles.list.uuids` | `ps` + **raw tmux** + uuid regex + JSONL glob | bash: `ps -eo tty,args` + `grep -oE` uuid + **`otmux` (also fixes the raw-tmux violation)** + glob + P2 for titles | A (largest) | fixture `ps`/pane tables + JSONL dirs → same uuid→pane picks |
| **claudeCode:275 `list.json`** | reads `sessions-index.json`, **re-serializes arbitrary entries as JSON** | — | **F** | Re-emitting arbitrary JSON (firstPrompt free text, escapes, unicode) without a parser can't be done safely. **Options:** (a) shrink output to `{sessionId, directory}` built from filenames (always safe); (b) deprecate `list.json`. My lean: (a). |
| **claudeCode:1374 Method 2** | `sessions-index.json` select-by-sessionId (pretty-printed, nested array, free text) | — | **F** | Its own comment says it "may have inherited title from fork parent", so it's already unreliable, and Methods 1 + 3 exist. **Proposal: delete Method 2.** Needs your OK, since it changes a fallback |

## 3. Tests
- **Step-0 gate `test.no-python`**: grep for `python3`, `python -`, `python -c`, `-m json.tool` across the OOSH scripts and tests (excluding opy, and whatever §4 rules exempt) == 0. RED today with the full site list; it is the burn-down instrument.
- `test.scrumMaster.measure` **T22 asserts python3 + jq are PRESENT**. Invert it to assert ABSENT.
- `test.swipe-jsonl-lag`, `test.static-defined-functions:152`: replace the python oracle/helper with **committed static fixture + golden files**.
- `test.pulse-jsonl-lag`: retire with pulse (its goldens move into the swipe test).
- `test.osemvec` (`python3 -m json.tool` validity checks ×3): see §4. JSON *validity* can't be proven without a parser. Replace with a structural check (balanced braces + required keys present), or keep it inside the opy exception if osemvec is ruled to be there.
- **GOLDENS:** record each old python path's output ONCE on the frozen fixtures, BEFORE removing it, and commit the static files. Static data is not a python dependency. This is how every site's parity is proven after the python is gone.

## 4. FLAGGED for oosh-po / Tron — real Python programs, not JSON parsing
- **otest (4 sites):** a **Playwright browser-test harness** (`browser.py`, `run_tests.py`, `utils/test_discovery.py`) plus its own venv bootstrap via `apt`/`dnf`/`yum` `python3-venv`. No awk replacement exists. Options:
  - (a) move its interpreter/venv onto **opy**, so it falls under the exception;
  - (b) port the harness to **Node Playwright** (node is already a workspace toolchain for Web4RawBin);
  - (c) retire otest.
  Your/Tron's call.
- **osemvec (3 sites):** **semvec is a Python package**. osemvec builds its venv via opy (`OPY_VENVS`) and runs `python -m semvec … serve`. My read: inside the opy exception, *provided every interpreter path is opy-managed*. Today it builds `$venv/bin/python` paths itself. **Tron to confirm** the exception covers "an OOSH script that launches an opy-provisioned Python product".

## 5. `restore/` — propose DELETE
`/root/oosh/restore/` = `claudeCode hiveMind ossh otmux scrumMaster user`, added once in `ab813de3` "add restored files". These are old copies.
- `restore/claudeCode` and `restore/scrumMaster` contain python.
- `restore/otmux` carries the dead aliases from my triage.
- They inflate every static gate.
**Delete** (recoverable any time via `git show ab813de3:restore/<f>`). Until it's deleted, exclude `restore/` from `test.no-python` and the static-defined-functions gate.

## Rulings (oosh-po, 2026-10-28) + condition evidence
1. **`list.json` → shrink to `{sessionId, directory}`: APPROVED, condition MET.** Inventory of every reference (oosh, `.claude`, base-skills; `restore/` excluded):
   - `claudeFlow:342/437` — `claudeFlow.list.json`, an **independent implementation in claudeFlow**; it never calls claudeCode.
   - `test.claudeCode:733-740` — asserts only **shape** (output contains `[`, more than 5 bytes).
   - `test.claudeCode:1229` — asserts only that the function **exists**.
   **No caller reads `firstPrompt` / `messageCount` / `modified` / `gitBranch` or any field beyond the shape.** The shrink breaks nobody. Keep the test's shape assertion. Add one assertion that each element has `sessionId` + `directory`.
2. **Delete sessions-index Method 2: APPROVED.**
3. **otest** and 4. **osemvec** (+ `test.osemvec` json.tool checks): **Tron's call, OUT of the first burn-down.** `test.no-python` excludes `opy`, `otest`, `osemvec`, `test.osemvec` and `restore/` until he rules.
- Side note, out of scope: `test.claudeCode` does `source claudeCode`, which the never-source-scripts rule forbids. Track it separately.

**Sequencing:** the tester's `test.no-python` goes **RED first** (step 0, with the goldens). Hand the implementation to the expert **after the expert's hiveMind step 4**, so the in-flight validator pass isn't interleaved with this.

## 6. Order — smallest risk first (each step = its own commit + its own parity proof)
0. **Instruments:** `test.no-python` (RED), invert T22, record GOLDENS from every old python path on frozen fixtures. **Must happen before anything is removed**, or parity can't be proven.
1. Pure arithmetic: scrumMaster:1728 expiry.
2. Delete all jq fallbacks.
3. **P1** + its own fixture suite (escaped-in-content, ephemeral keys, zero stubs, both spacings, multi-usage lines). Then swap consumers: swipe.ctx → hiveMind 7484/7569/7647/7496 → claudeCode 1674/1743. The hiveMind ones now **call** `claudeCode jsonl.usage`, which removes four duplicate copies.
4. **P3** → scrumMaster 2367/2569 → claudeCode 2017/2108 velocity (P1 + P3).
5. **P2** → claudeCode:1351 custom-title → scrumMaster creds (security, sha256-compared) → usage API (fail-closed parents).
6. hiveMind:3031/3193 `roles.list.uuids` (largest; also removes raw tmux).
7. Delete `pulse` + `test.pulse-jsonl-lag` once swipe is green against the pulse goldens.
8. Delete `restore/`.
**Blocked on your rulings:** claudeCode `list.json` (§2 F), Method 2 delete (§2 F), otest (§4), osemvec + `test.osemvec` (§4).
