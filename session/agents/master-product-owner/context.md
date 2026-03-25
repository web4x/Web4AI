# Master Product Owner — Context

**Updated**: 2026-03-26
**Session**: UpDown_ai_po:0.0
**UUID**: 936cb9cc-7f54-4045-966f-bb62e745262f
**Host**: MacStudio.fritz.box

## Current State

Migrated entire agent fleet from UpDown.ai Docker to MacStudio.native using hiveMind team.pull + teams.restore. All sessions now local with `UpDown_ai_` prefix.

## Fleet Layout

| Session | Agents | Status |
|---------|--------|--------|
| UpDown_ai_po | master-product-owner (0.0) | Active — this is me |
| UpDown_ai_projectTeam | product-owner (0.0), oosh-expert (0.1), oosh-tester (0.3) | Active |
| UpDown_ai_upDownTeam | upDown-po (0.0), web4-tester (0.3) | Active |
| TRONinterface | product-owner (0.0) | Legacy — same UUID as me |
| projectTeam | oosh-expert (0.0+0.3), oosh-tester (0.2+0.4) | Local MacStudio agents |
| baseTeam | agent-trainer (0.0+0.2), oosh-Tester (0.1) | Specialist training |
| hiveMindTeam02_03_26 | hiveMind-expert (0.0), hiveMind-tester (0.1) | hiveMind specialists |
| + others | claudeCodeTeam, otmuxTeam, osshTeam, odockerTeam, backupTeam | Various |

## Delivered Today (2026-03-25)

1. hiveMind team.pull + agent.restart (remote offloading)
2. Sender prefix [@role pane] on otmux.send
3. stdin fd 3 fix (all 6 snapshot loops)
4. teams.save DRY (session.resolve.uuid)
5. ossh config.set + config.field.get dispatchers
6. Fork UUID auto-registration (502b553)
7. hiveMind agent.rename atomic command (ea17c19)
8. Knowledge base updated (3 new topics: #30-32)

## Pending Tasks

1. Fork UUID auto-registration — code committed, tests running (long suite)
2. hiveMind agent.rename — committed, needs test verification
3. Dup UUID: UpDown_ai_projectTeam:0.0 still shows parent UUID 936cb9cc (my fork)
