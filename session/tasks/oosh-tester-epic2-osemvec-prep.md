# oosh-tester — Epic 2 (test.osemvec) hardening PREP — STANDBY (pending expert fix)

**Agent**: oosh-tester (ooshTeam:0.3) · **For**: opy1 · **Coordinate**: oosh-expert (ooshTeam:0.2)
**Directive (opy1)**: after oosh-expert fixes the `osemvec.new` resolution bug, harden `test/test.osemvec`
to be **cwd-INDEPENDENT**; verify green from a CLEAN HOME cwd (`cd ~ ; test.suite run osemvec 1`), not
just the working dir. Skip-guard the agents-dir/semvec-index-dependent cases on precondition (or set the
precondition deterministically). **STANDBY until the fix lands.** Do NOT rewrite the test now (osemvec.new
changes under the fix → rework). Do NOT run test.osemvec (T13 can run a REAL semvec index).

## Current state (measured, read-only)
- osemvec 342L + test/test.osemvec 176L, committed a03a31f (oosh-expert authored).
- Expert reports 12/12 from a specific cwd; from clean home = **10/13**: fails **T5, T6, T13**.

## Root-cause map (why cwd matters)
- **T5/T6** — `osemvec.new "$VALID_ROLE" "$PROJ"`. `osemvec.new` validates role via `hiveMind role.list`
  (osemvec:201-203) which resolves the `.claude/agents` dir; that resolution is **cwd-coupled**. From home
  the role set differs → the VALID_ROLE (test line 30, itself from `role.list`) fails osemvec.new's existence
  check → new returns non-zero → T5 fails AND T6 fails (settings.json never provisioned because new bailed).
  → **EXPERT FIX**: resolve agents-dir deterministically (OOSH_DIR/workspace root), not from cwd.
- **T13** — guarded by `private.osemvec.venvReady` (checks `${OPY_VENVS:-~/.opy/venvs}/osemvec/bin/python`,
  absolute → not cwd-coupled per se). opy1: "skip-guard did not hold → real semvec index ran". If an
  `osemvec` venv happens to exist in ambient state, venvReady=true → T13 runs a REAL `osemvec.index` →
  heavy/ambient-dependent → fails from home. Non-hermetic on ambient venv presence.

## My hardening plan (execute AFTER expert fix lands; verify from `cd ~`)
1. **T5/T6**: add a deterministic precondition — resolve VALID_ROLE the SAME way osemvec.new will (post-fix),
   and skip-guard (expect.pass "skipped: no resolvable role") if the registry yields none, so a role-less host
   SKIPS instead of FAILing. Confirm T5/T6 pass from `cd ~` once resolution is cwd-independent.
2. **T13**: make the precondition hermetic + deterministic. Force `OPY_VENVS="$TEST_ROOT/venvs"` (isolated,
   empty) at the top so `venvReady` is deterministically FALSE in the test env → T13 skips cleanly and can
   NEVER run a real semvec index. (Real index-with-venv coverage, if wanted, is a separate opt-in heavy test,
   not the default suite.) This mirrors test.opy's OPY_VENVS isolation.
3. **cwd-independence**: after edits, the acceptance run is `cd ~ && test.suite run osemvec 1` → 13/13 (or
   documented skips). Also spot-check from a 2nd unrelated cwd. Never accept "green in my working dir" alone.
4. Keep the SAFETY invariants intact: never `osemvec install`, never live claudeCode spawn; `osemvec.new`
   default dry-run (pane count unchanged) stays the critical assertion.

## Coordination
- Told oosh-expert: I'll harden test.osemvec cwd-independence AFTER their osemvec.new resolution fix; ping me
  when it lands. "Fixed" = role/agents-dir resolves the same from any cwd (esp. `cd ~`).
- STATUS: STANDBY. Wakeup registered. Epic-1 fully done (opy 22/22 @ f27ab76).
