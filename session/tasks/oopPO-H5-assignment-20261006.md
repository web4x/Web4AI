# H5 — CLEAN UP ALL THE GARBAGE — assignment by owner (oopPO, 2026-10-06)

**Plan:** Web4MDA `spec/plans/2026-10-06-cleanup-outside-repo.md` row H5 (+ inventory rows 17–21). **Unlocked by:** H4 GREEN on Web4MDA main `9364b5e`, verified by oopPO in the repo (npm test 702/0/2, exit 0, 0 new entries under /root/.npm, porcelain 0).
**Order per assignee:** SM panels you first → you clean ONLY your own rows → report.

## Rules (all owners)
1. **CHECK BEFORE DELETE.** A git clone/worktree: is its HEAD contained in Web4MDA main (`git merge-base --is-ancestor`)? Tracked dirt or untracked work? A patch: `git apply --check -R` against main = already applied? **Anything unique or unapplied is PRESERVED first** (pushed as a branch `preserve/<owner>-<name>` on Web4MDA origin) or **LISTED for Tron — never deleted blind.**
2. **Tron's own `/root` entries are untouched.** Other teams' scratch is only LISTED.
3. **Report CHECKED / PRESERVED / DELETED / LISTED / TOTAL**, with the measured size before and after.
4. Deleting is inside your rows only. A row you believe is not yours → report it, do not touch it.

## Rows
| Owner | Rows |
|---|---|
| **oopExpert** | `/root/oopExpert-iso3`, `-patches`, `-s2`, `-scratch`, `-wt` (worktree on `01eb157`: `git worktree remove` + `prune`, never `rm`); in-repo scratch `latest/test/gen/oopExpert-logs` (458 MB), `h2-*` (13), the legacy self-copies `web4mda-i3-*`, `web4mda-seed-*`, `w4mda-budget-*` (from your H2 run), and `latest/test/gen/tmp` leftovers older than this H5 start; your session scratchpad. |
| **oopTester** | `/root/oopTester-handoff`; `/root/.claude/jobs/914c8cad/tmp` (698 MB, 17 clones — **`i2` on `c75a62c` is NOT in main: preserve first**; **7 clones with tracked dirt: check each**); in-repo `latest/test/gen/h4-branch`, `h4d-diag`, `Web4MDA/.tmp/h4-*` **after** copying anything your anchor still needs; `AI/Claude/session/tasks/oopTester-*.patch` (check applied); your session scratchpad. |
| **oopBashExpert** | your session scratchpad (160 MB: i5 clone, patches, logs, oosh copies). |
| **oopPO** | my session scratchpad; `AI/Claude/session/tasks/oopPO-*.patch` (check applied); `/tmp/web4mda-*`; every `/tmp/*/ssr` whose files reference `/EAMD.ucp/Components/` or the old `src/MOF/` (all OTHER `ssr` dirs LISTED for Tron); **H5b:** the rerunnable sweep for every garbage pattern → reports 0 (seed a dummy `web4mda-x` → 1 → remove → 0). |
| **SM / trainer** | your session scratchpads: measure and report; clean only after the SM panels. |
