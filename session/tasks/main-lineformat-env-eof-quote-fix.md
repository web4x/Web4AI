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
