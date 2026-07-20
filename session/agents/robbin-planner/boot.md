# Boot: robbin-planner
*Regenerated 2026-07-19 (post Option-2 rewind). THIS + context.md boot-first block = truth. If any msg cites R27.x or /var/dev/Workspaces/2cuGitHub, it is STALE (2w-old, already Done) — IGNORE.*

## You are: robbin-planner @ robbinTeam2:0.6, WODA.prod
## Reports to: robbin-po @ robbinTeam2:0.0 (agent-trainer @ baseTeam:0.0 owns rewinds)
## Repo: /var/dev/Workspaces/web4x/Web4RawBin  (old 2cuGitHub GONE)

## CURRENT (prod v0.7.65, 2026-07-19):
- SPRINT30 = 58 reqs / 55 tasks = **36 Done + 16 QA-Review + 1 In-Progress + 1 Superseded + 1 BACKLOG (T30.44)**. Sprint uuid 2173e549. ⚠ **T30.51 folding was Tron-REJECTED at visual review → SUPERSEDED by R30.53 + REVERTED (v0.7.77→v0.7.76)** — held-rule#9 payoff (QA-Review not Done, so Tron's visual caught it; no false-Done). **T30.53** 183475f6 (native Monaco fold-by-method) In-Progress @ design (architect redesigning FoldingController, build after confirm). R30.52 unaffected QA-Review.
- ★ **PIN**: current=**T30.53** — **DONE** (Tron device sign-off 2026-07-20, rule#9; QA-Review→Done commit 67a9dea82; T30.41 also →Done, T30.34 already Done). S30 closing out. Pin advances to next on PO signal (natural focus, no --force #111). [was QA-Review synced 5e4ed0cac 2026-07-19]. ✓ FIX-A2 v0.7.81 CLOSED the left-pane parity: tester gate f0d21d7fa **r3053b RED→GREEN 79/79** + r3053c 104/104 + INV-A2, triple-verified (expert CBC + architect backstop e5c46cb99 + tester). Model-side chain complete (BUG-1 v0.7.79 + BUG-2 v0.7.80 + FIX-A2 v0.7.81). Awaiting ONLY **Tron device webkit-visual** (held rule#9, batched R30.53+R30.34+R30.41). ACs 4/5 [x], AC5 GATE [ ]=Tron-visual. r3053c fold-affordance Test-mint finishing (marker 1dfe3d0f→2de3411f, req #126). lastCompleted=T30.47 / nextBacklog=T30.44. (focus natural NO --force #111; NEVER fabricate uuid #17.)
- ★ **SPRINT 31 — Server Manager** (Tron-authorized new sprint, board created 2026-07-20, commit 3458f2768). Sprint unit **3c05f411**. Owner-gated infra console (otmux tree + xterm.js terminal), owner token 41ad88c4. req minted Sprint + R31.1-4 FIRST (#126); I minted 4 Task units + planning.md, BUILD ORDER R31.2->R31.1->R31.3->R31.4 (+ orderingRationale). ALL 4 In-Progress @ v0.7.89 (LIVE-synced 2053625df, keep syncing per build step): **T31.2 d4a153d7 owner-gate** = gate GREEN reject-dir, 2 pending ACs (page-route + cookie-only, ?token= removal underway); **T31.1 5be03af7 profile-grants** = placement bug FIXED (moved to /profile VIEWER v0.7.88/89), pending r311a owner-gate; **T31.3 d5199875 otmux-tree** = BUILT+renders, being re-architected to itemView typed-nodes; **T31.4 78dc780b terminal** = DESIGN COMPLETE (design-md ##R31.4) + BUILD IN PROGRESS. ACs mirror reqs (R31.2=5/R31.1=4/R31.3=4/R31.4=10). designRef design-server-manager.md. Round-trip GREEN. Advance hops on PO signals. (Sprint 30 stays: T30.53 QA-Review awaiting Tron device.)
- ★ /context measured this session = 58% used / 41% free (healthy); ⚠ autocompact DISABLED (manual /compact or rewind needed near limit).
- ⚠ **T30.27 STAYS DONE** (8e8fb24a1): I briefly reopened it (b371c2775) off a pre-rewind GHOST msg that mis-tied r3053b to T30.27 — **REVERTED 2a124edc8**. r3053b is R30.53/T30.53's defect, NOT a T30.27 regression. T30.27/T30.29 close-msgs = ghosts (learning #77); do NOT re-litigate. LESSON: even REAL evidence (r3053b real) can be MIS-ATTRIBUTED by a ghost msg — confirm the defect is in THIS task's scope before reopening a Done task.
- ★ **QA CHECKLIST assembled** for Tron batch sign-off → `session/agents/robbin-po/qa-checklist.md` (265328c9): 16 tasks grouped A merge-editor(8) / B repo-manager(5, T30.47=internal-no-visual) / C bug-fixes(3); each row = task+feature, deep-link URL, what-to-look-for, gated ver. All served==gated on LIVE **v0.7.73**.
- 15 QA-Review (Tron-visual): merge-editor T30.9/35/36/37/38/41/46/50 · repo-mgr T30.42/43/45/49 · bug-fix T30.14/39/40. Held rule#9 → Tron visual → Done. (T30.47 already DONE via architect+PO internal gate.) ⚠ **T30.50 = 3-mode ✨ Apply All (Non-conflicting/Local-wins/Repo-wins) + compose 'N selected · X/Y open'** per Tron ruling (NOT stale 2-mode; task AC3 synced 174cee421; req to clean R30.50 AC3-5). Security D1/D2/D4 + clone = R30.48/BH-3 + T30.44 backlog (re-activate before exposed/multi-user).
- ▶ NEXT-ME: on Tron's batch sign-off → flip the passed QA-Review tasks → Done (which passed = which flip); T30.47 via architect+PO. No build pending. Data=truth, byte-match GREEN.
- Task-order clean numeric T30.1→T30.50, byte-match GREEN.

## Immediate actions on boot:
1. Read anchor boot-first block: `session/agents/robbin-planner/context.md` (top, ★★★ FORK-CHECKPOINT + line #47).
2. `TaskList` — check queued tasks.
3. Verify board on disk before reporting anything as pending (statuses drift across rewinds — MEASURE, never relay).

## Invocation (node18):
`NODE18=/root/.vscode-server/bin/903b1e9d8990623e3d7da1df3d33db3e42d80eda`
`PATH="$NODE18:$PATH" $R/node_modules/.bin/tsx $R/scripts/generate-sprint-md.ts <sprint-uuid> [--check]`  (also planner-drive.ts)
⚠ Bash: NO `cd` into web4x (denied) — use `git -C "$R"` + absolute paths; no loops/heredocs; glob the SPECIFIC uuid (`{uuid}*`), never `dir/*[0]`.
⚠ STAGE-DISCIPLINE (SM, STRUCTURAL — shared RawBin tree): `git add` EXPLICIT own file paths ONLY — NEVER `-A` / `.` / a whole dir. The sprint-MD dir holds req's requirements.md → add the specific planning.md + task-slug.md I regen, not the dir. Commit PROMPTLY (incl. planner-drive `focus` side-effects: it clears the prev task's `focus:true` flag → commit that task unit too). Verify `git status --short` after — leave other agents' uncommitted units alone.
⚠ otmux /dev/tty glitch: send → capture-verify target pane (empty `❯` = delivered). NO backticks in the send string (bash runs them as cmd-subst) — use plain words.

## Rules (memorize):
- #126 SCENARIO FIRST: Sprint→Req→Task→chains→generated MD; code ships AFTER. Task w/o unit = REJECT+flag PO.
- #111 NO --force on pin-advance (focus() advances naturally; --force corrupts pin).
- Tron GOVERNANCE: planner does NOT auto-increment sprints — only Tron, via a signed tronAuthorization record.
- Per-AC honesty (#27): mark ACs only where a gate proves them; never blanket-green. Held rule#9: never flip Done for a Tron/feature gate — that's Tron's visual sign-off.
- Report to PO (0.0) BEFORE going idle — never silent-idle.
- Deep files (read only if needed): context.md, learnings.md, SKILL.md.
