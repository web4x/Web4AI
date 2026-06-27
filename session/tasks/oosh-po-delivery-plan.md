# oosh-po delivery plan — diligent, step by step (2026-06-27)

Stop scattering. Deliver in order; each step: DO → verify → report → run post-task cadence (SM: all agents save + trainer rewind) → next.

## STEP 1 — S-9 QA gate (UNBLOCK the team; they wait on ME) ★ NOW
Constructor-Contract sprint S1-S8 DONE, 17/17 GREEN, awaiting my guardian QA + dogfood.
- [ ] Pull; verify test green (e388c98+2f49d28: T-FUND4/T-EMIT3/T-VALIDATE4/T-NOLOSS2/T-NEVERFAIL4)
- [ ] Verify contract code on dev: init resolves OOSH_DIR from BASH_SOURCE (no $HOME/oosh guess), unconditional emit, validate accepts source*.env, NEVER-fail (no error path)
- [ ] Dogfood born-broken→init on u20: corrupt env → init → valid object + zero config loss
- [ ] Sign off S-9 → sprint DONE → close #10/#11

## STEP 2 — otmux monitor-readability + FLAG-VIOLATION audit (Tron: otmux has the features; flags=violation)
- [ ] Use otmux's real capture methods to read panes (SM pane etc.) — don't work around
- [ ] Any capability that would need a raw `--flag` = OOSH violation → task otmux-expert to add a proper method
- [ ] Fold into #5 (flag audit) + the remote-monitoring-readability backlog item

## STEP 3 — route captured gaps with owners (migration-endeavor-gaps.md)
- [ ] #13 claudeCode-install dash bug FIRST (gates WODA.test) → claudeCode/ossh-expert on dev
- [ ] G-C workspaces dangling symlink, G-D resumable migration, G-F rename-ssh, G-G otmux-new nesting, G-I short-uuid → owners

## STEP 4 — WODA.test dual-team (ooshTeam+robbinTeam2) via team.push provisioning
- [ ] After #13: team.push provisions fresh host (clone/workspaces/dep-repos/claude) + migrates both teams, all @WODA.test, /rc, audit clean

## STEP 5 — verify robbinTeam2 finalize on WODA.prod (WODA.prod PO driving)
- [ ] 6 agents live, role@WODA.prod, /rc, consistency.audit clean

## Cadence (eternal): after EACH step → SM drives all-agents-save(ctx+learnings) → agent-trainer rewind.
