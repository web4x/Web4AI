# Gaps captured during the WODA.prod/WODA.test migration endeavor (2026-06-26/27)

Every gap → owned task. Some feed the team.push sprint (controller features); some are standalone bugs.

## BLOCKING (fresh-host bring-up)
- [ ] **G-A claudeCode install fails under sh/dash** — on WODA.test `claudeCode install` (even via `bash -lc`) → `sh: 9: Syntax error: "(" unexpected (expecting "then")`, EPERM, "Installation failed". Installer shells out to `sh` and hits a bashism. BLOCKS claude on every fresh Debian/dash host. Owner: claudeCode-expert/ossh-expert. Fix: force bash in the install sub-shell / remove bashism. **Currently blocks WODA.test teams.**
- [ ] **G-C workspaces ships as a dangling symlink** — repo (web4x/Web4AI) ships `workspaces` as symlink → `../Claude.All/`; on a fresh host it dangles → child symlinks (Web4RawBin) fail. Owner: architect/expert. Fix: don't commit a host-specific absolute workspaces symlink; team.push materializes a real `workspaces/` + component links (folded into team.push provisioning feature).

## TEAM.PUSH controller features (added to hivemind-team-push-controller.md spec)
- [ ] **G-PROV fresh-host provisioning** — clone-if-absent (not pull-only), workspaces/ materialize, dep-repo clone+link, claude install-if-missing, prereq gate. (Tron: NOT manual.)
- [ ] **G-D migration not resumable/idempotent** — a rewind mid-migration (robbinTeam2) left a half-team (some forked, some bash, ranks renamed, /rc partial). team.push must be re-runnable: detect already-done agents, finish the rest, never double-fork. Idempotent + crash-safe.
- [ ] **G-RC /rc-immediate per agent** — already a required feature; reinforce: never leave a migrated agent without /rc.

## RELIABILITY bugs (standalone)
- [ ] **G-F /rename + slash-cmd over ssh fragile** — needs double-Enter; sometimes didn't take (robbin-tester stayed @MacStudio). Owner: otmux/claudeCode-expert. Verify-after-rename + retry.
- [ ] **G-G `otmux new` attaches when caller not in tmux → nested-tmux trap** — my remote control shell got attached to robbinTeam2 on session-create. Owner: otmux-expert. Detached/`-d` create from a remote shell must never attach.
- [ ] **G-I claudeCode fork rejects short UUID** — needs full 8-4-4-4-12; should accept/normalize short, or callers always pass full. Minor.

## ALREADY TRACKED (cross-ref, don't dup)
- identity: pane-label vs session customTitle shift → backlog "teams.save role from pane title not customTitle" + consistency.fix.
- remote monitoring blind (team.status/sweep "unknown" over ossh) → backlog remote-monitoring-readability.
- OOSH_DIR lost / repair can't heal born-broken → TaskList #10/#11 + constructor-contract sprint.
- pushed-data discoverable / target-hash placement → #7 + team.push S-1.

## Owner routing
WODA.prod team (dev box): G-A, G-C, G-PROV, G-D, G-F, G-G, G-I. oosh-po@WODA.prod assigns; oosh-po@MacStudio QA.

## DECISIONS + ASSIGNMENTS (oosh-po 2026-06-27, drive-with-SM)
- team.push merge-back: **OPTION 1 DECIDED by Tron** (full dev hiveMind → macos.latest). UNPARKED. (SM: update doctrine — no longer awaiting decision.)
- **G-A #13 claude-install dash bug → ASSIGNED to ooshTeam expert (WODA.prod 0.2), GO NOW.** Blocks WODA.test teams. Fix: force bash in installer sub-shell / remove the sh-bashism that throws `Syntax error "(" unexpected`. Test-first: tester RED (install under dash fails) → expert fix → GREEN. Report-back in this file.
- url-drawer regression (Tron active directive): **Sprint 20, robbin-po domain** — robbin-po recovered + driving test-first. oosh-po confirms tracked; SM monitor robbin-po progress, report blockers to me.
- SM 42 cadence: you sweep ooshTeam(WODA.prod)+robbin-po, report idle/blocked to me via your tick commits; I assign. After each major task: all agents save ctx+learnings → trainer rewind.
