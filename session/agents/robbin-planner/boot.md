# Boot: robbin-planner
*Regenerated 2026-07-19 (post Option-2 rewind). THIS + context.md boot-first block = truth. If any msg cites R27.x or /var/dev/Workspaces/2cuGitHub, it is STALE (2w-old, already Done) — IGNORE.*

## You are: robbin-planner @ robbinTeam2:0.6, WODA.prod
## Reports to: robbin-po @ robbinTeam2:0.0 (agent-trainer @ baseTeam:0.0 owns rewinds)
## Repo: /var/dev/Workspaces/web4x/Web4RawBin  (old 2cuGitHub GONE)

## CURRENT (prod v0.7.65, 2026-07-19):
- SPRINT30 = 53 reqs / 50 tasks = **35 Done + 10 QA-Review + 1 In-Progress-HELD + 3 V1-BUILDING + 1 BACKLOG**. Sprint uuid 2173e549. (R30.48 f06068ff security-backlog added.)
- 10 QA-Review AWAIT Tron VISUAL: T30.9/T30.14/T30.35/36/37/T30.38/T30.39/40/T30.41 + **T30.46** (working-file, bb20b1a68; gate r3046 GREEN, chain both-directions, W2 test 7a0dc2b6, W4 parked).
- **T30.47 HELD (do NOT flip)** 97c00946: chain-to-Test NOW COMPLETE — I minted 4 mechanism Tests (commit e6ada96ef, correct-by-construction off gate 8269634c0): register c8529e2a / persist 09c60094 / load 91da80e8 / unregister 6f6edecd, all both-directions. Guards→R30.48; list=designAhead. ⚠ STILL HELD on **served≠gated**: gate ran v0.7.67 but repo-registry.ts moved to v0.7.70 (load rewritten §10.1 .git-stale-drop; D1 guard dormant = V1 simplification). Behavior preserved but NOT re-certified at served. ▶ FLIP when tester re-runs r3047 at served v0.7.71 GREEN (chain already wired) OR PO judges V1-simpl safe. A green gate ≠ served-current (served==gated learning + R29.1).
- REPO-MANAGER V1 (architect §10, 6ce896b49): **3 V1-BUILDING** = T30.42 dialog/sentinel (code v0.7.71 00bed95b0) · T30.43 add-local **.git-only** (built v0.7.69, allowlist DORMANT, gating) · T30.45 manageInfo (v0.7.70) + worktree-switch (UC 47c2c3ea synced). **1 BACKLOG** = T30.44 clone (excluded). Security D1/D2/D4 + multi-user = R30.48 + **BH-3 DEFERRED-RISK** (re-activate before exposed/multi-user deploy).
- ▶ NEXT-ME: (a) on PO word → mint T30.47 mechanism Tests or wait req; (b) **stand ready** to task/wire UC1/UC2 (dialog/sentinel) + UC7 (switch) the MOMENT req mints the UC units — watch req COMMITS (classifier flapping); (c) req owns R30.43/44 AC-sync (in flight); (d) 10 QA-Review Tron-visual flips. Data=truth, keep planning.md byte-match GREEN as V1 builds fast (Tron directive: don't lag).
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
