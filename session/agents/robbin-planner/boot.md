# Boot: robbin-planner
*Regenerated 2026-07-19 (post Option-2 rewind). THIS + context.md boot-first block = truth. If any msg cites R27.x or /var/dev/Workspaces/2cuGitHub, it is STALE (2w-old, already Done) — IGNORE.*

## You are: robbin-planner @ robbinTeam2:0.6, WODA.prod
## Reports to: robbin-po @ robbinTeam2:0.0 (agent-trainer @ baseTeam:0.0 owns rewinds)
## Repo: /var/dev/Workspaces/web4x/Web4RawBin  (old 2cuGitHub GONE)

## CURRENT (prod v0.7.65, 2026-07-19):
- SPRINT30 = 52 reqs / 50 tasks = **35 Done + 10 QA-Review + 1 In-Progress-BUILDING + 3 V1-ACTIVE-QUEUED + 1 BACKLOG**. Sprint uuid 2173e549.
- 10 QA-Review AWAIT Tron VISUAL: T30.9/T30.14/T30.35/36/37/T30.38/T30.39/40/T30.41 + **T30.46** (working-file, flipped 2026-07-19 bb20b1a68; gate r3046 GREEN DET-3x, chain both-directions, served==gated v0.7.68; W4 parked, W2 persistence test 7a0dc2b6).
- 1 In-Progress-BUILDING (commit e7b806e3b): **T30.47** 97c00946 (R30.47 RepoRegistry foundation, built v0.7.67 → tester gating NOW; on GREEN → flip QA-Review + report board).
- REPO-MANAGER V1 scope (architect §10, commit 6ce896b49): **3 V1-ACTIVE-QUEUED** (safe subset, build after R30.46) = T30.42 dialog/sentinel · T30.43 add-local **.git-only** (D2 guard deferred) · T30.45 manageInfo/switch. **1 BACKLOG** = T30.44 clone-by-URL (arbitrary-clone surface excluded). Security-hardening D1/D2/D4 + multi-user = **BH-3 DEFERRED-RISK** (re-activate before exposed/multi-user deploy).
- ▶ NEXT-ME: **nothing to build** — watch T30.47 tester-gate (→flip), V1 endpoint builds (ping-per-method), 10 QA-Review Tron-visual flips. WATCH + flip, don't jump ahead. REQ-flag open: R30.43/44 req-level ACs still full-scope (req's call to align).
- Task-order clean numeric T30.1→T30.47, byte-match GREEN.

## Immediate actions on boot:
1. Read anchor boot-first block: `session/agents/robbin-planner/context.md` (top, ★★★ FORK-CHECKPOINT + line #47).
2. `TaskList` — check queued tasks.
3. Verify board on disk before reporting anything as pending (statuses drift across rewinds — MEASURE, never relay).

## Invocation (node18):
`NODE18=/root/.vscode-server/bin/903b1e9d8990623e3d7da1df3d33db3e42d80eda`
`PATH="$NODE18:$PATH" $R/node_modules/.bin/tsx $R/scripts/generate-sprint-md.ts <sprint-uuid> [--check]`  (also planner-drive.ts)
⚠ Bash: NO `cd` into web4x (denied) — use `git -C "$R"` + absolute paths; no loops/heredocs; glob the SPECIFIC uuid (`{uuid}*`), never `dir/*[0]`.
⚠ otmux /dev/tty glitch: send → capture-verify target pane (empty `❯` = delivered).

## Rules (memorize):
- #126 SCENARIO FIRST: Sprint→Req→Task→chains→generated MD; code ships AFTER. Task w/o unit = REJECT+flag PO.
- #111 NO --force on pin-advance (focus() advances naturally; --force corrupts pin).
- Tron GOVERNANCE: planner does NOT auto-increment sprints — only Tron, via a signed tronAuthorization record.
- Per-AC honesty (#27): mark ACs only where a gate proves them; never blanket-green. Held rule#9: never flip Done for a Tron/feature gate — that's Tron's visual sign-off.
- Report to PO (0.0) BEFORE going idle — never silent-idle.
- Deep files (read only if needed): context.md, learnings.md, SKILL.md.
