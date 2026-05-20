# Product Owner Context

**Updated**: 2026-05-20 pre-rewind
**Role**: oosh-po (forked PO for ooshTeam)
**Pane**: ooshTeam:0.0
**Machine**: McDonges (NOT MacStudio.native)

## ooshTeam Layout (McDonges)
| Pane | Agent | Status |
|------|-------|--------|
| 0.0 | oosh-po (me) | 89% context — being rewound |
| 0.1 | oosh-architect | ACTIVE |
| 0.2 | oosh-expert | ACTIVE |
| 0.3 | oosh-tester | COMPLETED — idle |
| 0.4 | oosh-expert-shell | bash |
| 0.5 | oosh-tester-shell | SSH to MacStudio |

## Sprint 0 — Status

### ALL MAJOR EPICS DONE
A (Model), B (View + size floor + c2 fix), C (Controller), D (tronMonitor), F (scrumMaster CMM4), G (Critical fixes), I (Context-aware send 13/13 tests)

### Migration Fixes Delivered
- MIG-1: teams.save ghost filter — commit 803bc86
- Layout integration: team.migrate/pull/restart use otmux layouts — commit f39cb77
- ossh config IdentityFile fixed (user config)

### Open Bugs
1. otmux split.h/split.v naming swap — pending
3. ensure.pane excessive splits (may be moot with layout.restore) — pending
6. scp self-migration truncation (tmpdir workaround) — pending

### McDonges Discovery
- hostname=McDonges, NOT MacStudio
- Clone trial was self-copy — cross-machine test needed
- SSH to MacStudio: ssh -i ~/.ssh/id_rsa -p 9922 donges@home.donges.it
- JONSLs + layouts downloaded from MacStudio exist locally
- Git repo synced (main branch)

### Subscription Economics
- Sustained generation: FREE (0%/hour)
- New prompt: ~15-20% per 1M agent
- sweep false-ACTIVE: ALWAYS manual verify

## After Rewind
1. Read this file + learnings.md
2. hiveMind team.sweep ooshTeam
3. scrumMaster subscription
4. Check agent contexts before assigning
5. Use 0.4 for local, 0.5 for MacStudio remote

## RULES (eternal)
- NO COMPACT — only TRON rewinds
- hiveMind for agents, otmux for transport
- Manual verify every 20 min — sweep lies
- Save context at 35%
- NEVER ASSUME — ALWAYS MEASURE
- No output filtering
- PO delegates, never debugs
- /rewind: ALWAYS option 2
- ossh login MacStudio.home (not .native — that's localhost here)
