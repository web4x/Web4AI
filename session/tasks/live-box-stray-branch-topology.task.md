# Live box git topology is on STRAY/WRONG branches — remediate (deliberate, no cowboy)

**From**: oosh-po@WODA.prod (oosh-expert measured it during config.save redo, 2026-07-14)
**Owners**: oosh-architect (safe-switch plan) → oosh-expert (execute) → oosh-tester (verify boot) → PO/Tron gate
**Priority**: HIGH — the live ooshTeam is running from stray/pre-contract code; fixes land on wrong base
**uuid**: e37dbe62-c8ea-482b-b8a2-cbb95d3795b9

## Problem (measured, expert)
- **LIVE PATH** `/root/oosh` → `mcdonges.latest` = OLD single-pipeline greedy config.save (pre-contract, no allow-list).
- **`OOSH_DIR` dev checkout** = on STRAY branch `dev-teampush-astray` — greedy extractor (line 304), no canonical extractor, `bashrc_template` MISSING.
- **Good commits `9d65d12` / `9937799`** (contract base + allow-list) exist as objects but are checked out in NEITHER live tree.
- Net: the contract's A+B base is checked out NOWHERE live → any config.save/bashrc edit lands on broken/stray ground = cowboy.

## Constraint
The running ooshTeam USES `OOSH_DIR` — switching its branch mid-run disrupts the live team. **NEVER cowboy-switch the live checkout.** No `oo mode` on this box.

## Fix directions (deliberate)
1. Land the config.save A+B + bashrc_template fixes on a CLEAN `origin/dev` checkout (contract lineage) — verify captured (tester, clean/throwaway box) FIRST.
2. Plan the live-checkout switch onto clean `dev` (with fixes) as a COORDINATED op — maintenance-window / Tron-aware, tester-gated boot verify, not mid-task.
3. Retire the stray `dev-teampush-astray` once its content is reconciled (nothing unique lost).

## Acceptance
- [ ] config.save A+B + bashrc_template proven on clean origin/dev (captured)
- [ ] live `OOSH_DIR` + `/root/oosh` on the intended clean branch, boot verified, team uninterrupted
- [ ] `dev-teampush-astray` reconciled + retired (no unique work lost)

## Report-back
- Architect (safe-switch plan): **DONE 2026-07-14, oosh-architect@WODA.prod** — read-only measure (no switch/no `oo mode`). See "SAFE-SWITCH PLAN" below.
- Expert (execute):
- Tester (boot verify):

---

## SAFE-SWITCH PLAN (oosh-architect, 2026-07-14) — measured topology + gated remediation

### Measured topology (read-only; CORRECTS the task premise)
`git worktree list` on the shared repo:
| Worktree path | Branch/HEAD | Role | State |
|---|---|---|---|
| `/root/oosh` → `.../Once.sh/mcdonges.latest` (symlink) | `mcdonges.latest` fa1792a | **login/interactive shell** | pre-contract greedy config.save ✗ |
| `.../Once.sh/dev` | `dev-teampush-astray` 3c3d186 | canonical "dev" worktree | **stray** ✗ |
| `/tmp/claude-0/.../scratchpad/oosh-dev` | detached `fcd8e6d` | **live team `OOSH_DIR`** | clean contract ✓ but **fragile** (ephemeral /tmp + detached) |
| `.../Once.sh/{macos,macos.latest,prod}` | resp. branches | other envs | n/a |

**Premise correction (measure > assume):** the task says "OOSH_DIR = on stray `dev-teampush-astray`." **FALSE.** The running team's `OOSH_DIR` is the **/tmp detached worktree @ `fcd8e6d`**, which IS `origin/dev` = local branch **`dev`** = the clean contract base (denied/allow/commit.checked/declare.varname present, 13/13 fn hits). So the team is **already on the contract** — the real defect is **FRAGILE + SPLIT topology**, not wrong code:
- team runs off ephemeral `/tmp` (dies on reboot / session GC), detached (no branch),
- `/root/oosh` (login) is pre-contract `mcdonges.latest`,
- the `.../dev` worktree is the stray branch.

**Retire-safety (measured):** `git log origin/dev..dev-teampush-astray` = **EMPTY** → stray has **zero unique commits**, nothing lost by retiring it.

### Target end-state
ONE stable, non-`/tmp` worktree on local branch **`dev`** (@ origin/dev, contract) that BOTH `/root/oosh` and the team `OOSH_DIR` point at; stray branch retired.

### Phased plan (deliberate, gated, NO cowboy, NO mid-run yank)
**P0 — Capture-green (tester, throwaway) [GATE].** Prove config.save A+B + `env -i sh;bash` color boot on a FRESH clean `dev` checkout (origin/dev @ fcd8e6d) on a throwaway/clone. Nothing on the live box moves until this is green. (Acceptance #1.)

**P1 — Stabilize the target (no live disruption).** Repoint the `.../Once.sh/dev` worktree from `dev-teampush-astray` → stable local `dev`: `git -C .../Once.sh/dev switch dev` (astray has 0 unique commits → clean, no loss). PRE-CHECK: grep live agents' `OOSH_DIR`/`PATH` to confirm NOBODY references `.../Once.sh/dev` (measured: team uses /tmp, login uses mcdonges.latest → `.../dev` is unreferenced) before touching it. Result: a stable non-/tmp `dev` worktree carrying the contract.

**P2 — Repoint fundamentals (coordinated, Tron window — the ONLY switch).**
  a. `/root/oosh` symlink → `.../Once.sh/dev` via atomic `ln -sfn` — instantly fixes login/interactive root. Reversible.
  b. `OOSH_DIR` in `sharedConfig/oosh.env` → `.../Once.sh/dev` (regenerated pure-state by `config save` on clean dev) — moves the team off the fragile /tmp worktree.
  **Non-disruptive property:** already-running agents keep their in-memory `OOSH_DIR` (the /tmp path still exists until reboot) and finish current work; each adopts clean-dev on its NEXT re-init/boot. No mid-task disruption = "team uninterrupted."

**P3 — Re-init → restore colors (tester-gated) [GATE].** `config save` on clean dev regenerates pure-state user.env + self-contained EXPORTED `setup.color.env` (dev strategy, `c82fa31`). Tester verifies `env -i sh; bash`: colors present, `config validate` clean, no source lines, HOME resolved (ties off clean-boot BUG 1/2/3 + color). **This is where "live box → clean dev + re-init restores colors" is proven.**

**P4 — Retire stray (safe).** Re-confirm `git log origin/dev..dev-teampush-astray` empty → remove leftover astray worktree + `git branch -D dev-teampush-astray` (coordinate remote delete separately). Retire the `/tmp` scratchpad `oosh-dev` worktree AFTER the team has cycled onto clean dev.

### Rollback (fully reversible)
`ln -sfn` `/root/oosh` back to `mcdonges.latest`; revert the one-line `OOSH_DIR` in `oosh.env`; keep `mcdonges.latest` + `/tmp` worktrees intact until P3 is verified-green.

### Gate order
P0 tester-green → Tron maintenance window → P1 → P2 → P3 tester boot-verify → PO/Tron sign → P4.

### Handoff
Expert executes P1–P4 in the window; tester owns P0 + P3 boot verification. All commands above are shapes for expert review, not for me to run (no switch on this live box).

---
## ✅ PO SIGN-OFF on SAFE-SWITCH PLAN (oosh-po@WODA.prod, 2026-07-14) — APPROVED
Excellent measured plan (e77c3a2) — corrected the premise (team's OOSH_DIR = /tmp detached @ fcd8e6d = clean contract, NOT the stray; real defect = fragile+split topology; stray = 0 unique commits, safe retire). Gated, reversible, non-disruptive (running agents adopt clean-dev on next re-init — no mid-task yank). APPROVED.
**Execution:**
- **P0 (tester, THROWAWAY) STARTS NOW** — non-disruptive, gates everything: prove config.save A+B + `env -i sh;bash` color boot on a fresh clean dev checkout. Nothing on the live box moves until this is green.
- **P1–P4 = the Tron maintenance window** (P2 is the ONLY live switch). I bring the window decision to Tron once P0 is green.
- Owners: P0/P3 = tester (capture) · P1/P2/P4 = expert (execute in window) · PO/Tron sign at P3.
