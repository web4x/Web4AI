# Task: Fix lineFormat.env unterminated-quote EOF on main (breaks oosh boot in container)

**From**: oosh-po@MacStudio (ooshTeam:0.0) · **To**: oosh-expert (ooshTeam:0.2) · **Priority**: HIGH (Tron-directed)
**Branch/clone**: `components/OOSH/main` (branch `main`, HEAD `364b011`) — NOT macos/mcdonges/dev.

## The error (Tron tested, container ooshTeam:0.6)
```
/root/config/lineFormat.env: line 6: unexpected EOF while looking for matching `"'
```
`ooshTeam:0.6` = a Docker container running oosh on **main**, LOG_LEVEL 4 (`oosh_main@docker`, root@0df63d16fff8). `ooshTeam:0.5` = a local shell on main (in `components/OOSH/main`).

## WHAT / WHY (root-cause direction — you own the HOW)
`lineFormat.env` is GENERATED (config.save persisting line.format's `FORMAT_*` defaults). Line 6 has an **unbalanced `"`** → the sourced env file dies with EOF-while-looking-for-quote → breaks Tab-completion framework-wide at boot. Almost certainly a `FORMAT_*` value that config.save writes as `export declare FORMAT_X="…"` where the value contains a `"`, newline, or unescaped char it doesn't balance. Note lineage: `674f38b` (macos/mcdonges) documents "FORMAT_PARSE_METHOD which config.save cannot persist" + self-heals empty/wiped FORMAT_ vars — **that robustness is NOT on main**. Likely fix = port/adapt the correct FORMAT_ persistence+self-heal to main, OR fix the specific quoting at the persist site. Root fix, not a band-aid.

## Steps
1. **Grab the culprit**: get the broken `lineFormat.env` line 6 from the container (via 0.5/docker or `otmux pane.send ooshTeam:0.6 "sed -n '1,8p' /root/config/lineFormat.env"`) → identify WHICH `FORMAT_*` var is malformed and what char breaks the quote.
2. **Trace to source** in `components/OOSH/main`: where `line`/`config` generates + persists FORMAT_ defaults (`private.line.format.defaults`, config.save quoting). Find why line 6 emits an unbalanced `"`.
3. **Fix at root** on `components/OOSH/main` (proper quoting/escaping on persist, or port the FORMAT_ self-heal/persist logic that main lacks). NEVER rebase (F10).
4. **Ship**: `git -C components/OOSH/main add … && commit && push origin main`.
5. **Deploy to container**: pull in ooshTeam:0.6 — `otmux pane.send ooshTeam:0.6 "cd /root/oosh && git pull"` (its own /root/oosh clone tracks origin/main).
6. **Regenerate + verify**: re-trigger lineFormat.env generation (force.update / re-source) in the container and confirm the EOF error is GONE on a clean LOG_LEVEL 4 boot.

## Acceptance (PO QA gate — I inspect the DIFF; tester independent-gates)
- [ ] Root cause named (which FORMAT_ var + why the quote broke), not just symptom
- [ ] Fix committed + pushed on `origin/main` (hash reported)
- [ ] Container 0.6: `git pull` + regenerate → `lineFormat.env` sources cleanly, NO "unexpected EOF", clean LOG_LEVEL 4 boot
- [ ] Tester gates: a regeneration test that a malformed-value FORMAT_ persists+sources without EOF (failable gate), on main
- [ ] Diff scope = line/config persistence only, no unrelated churn

## Notes
- Memory: MacStudio is memory-pressured (~59MB free) — keep the work focused, no extra agents/forks.
- Report the culprit line + fix hash back in this file.

---
## REPORT-BACK — oosh-expert: fix `d3d0d9f` on origin/main, container-verified
**CULPRIT (named, not symptom):** `FORMAT_PARSE_METHOD` (line.format constant). Its value embeds `declare -- METHOD='%s'|declare -- METHOD_PARAMETER='%s'|declare -- METHOD_DESCRIPTION='%s'\n` — i.e. literal `declare -- NAME='…'` substrings + single-quotes. Container line 5 was the correct full var; **line 6 was a corrupt truncated duplicate of its tail** (`clare -- METHOD_DESCRIPTION='%s'\n"` — "de" stripped) with a **dangling closing `"` and no opener → `unexpected EOF while looking for matching '"'`**.
**ROOT MECHANISM:** main `config.save` (config:306) persisted via a fragile `declare -p | grep | sed` with a **greedy `\(.*\)=`** that splits/duplicates values containing embedded ` NAME=` — exactly `FORMAT_PARSE_METHOD`. main LACKED both the robust persist AND 674f38b's FORMAT_ robustness.
**FIX (root, 2 hunks, scope = line/config persistence only):**
1. **config.save robust persist** — replaced the greedy sed with per-line `declare -px | while read` + `sed -n` varname extraction + `case "$varname" in ${name}*)` prefix match. Can never split mid-value → no duplicate fragment. (FORMAT_PARSE_METHOD is now cleanly SKIPPED from the file rather than corrupted — it is unpersistable by design.)
2. **line: port 674f38b** — split `private.line.format.init` → save-free `private.line.format.defaults` (exports all FORMAT_ incl. FORMAT_PARSE_METHOD in-process) + `init` calls it then saves; `line.format` `FORMAT_*)` case self-heals empty vars via `[ -z "${!format}" ] && private.line.format.defaults`. So the file-skipped FORMAT_PARSE_METHOD is always available at runtime.
**VERIFIED (container ooshTeam:0.6, oosh_main@docker):** `git pull` → `d3d0d9f`; `rm lineFormat.env; line format.force.update` → regenerated **4 balanced lines, NO line-6 fragment**; `bash -n lineFormat.env` → **LINEFORMAT_SOURCES_CLEAN**; fresh `LOG_LEVEL=4 bash --login` → **BOOT_CLEAN_NO_EOF** (grep for "unexpected EOF"/"matching"/"lineFormat.env: line" = none). Expert self-checks (bash -n both files + isolated generation test) green — NOT the gate.
**HASH:** `d3d0d9f` (origin/main). → PO QA the diff; **tester** independent gate = a failable regeneration test (a FORMAT_ var whose value embeds `declare -- NAME='…'` persists+sources without EOF, on main).
