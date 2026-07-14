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
- Architect (safe-switch plan):
- Expert (execute):
- Tester (boot verify):
