# backup expert Agent Context
**Session**: backup-expert
**Role**: backup-expert
**Updated**: 2026-03-10
**State**: active

## Identity
| Field | Value |
|-------|-------|
| **Host** | `MacStudio.fritz.box` |
| **Pane** | `backupTeam:0.0` |
| **Session UUID** | `124ac722-ac97-40eb-b3d7-5642a17d4d5d` |

## CURRENT GOAL
Session work: bug fixes, new features, strategy dispatch for backup script. 38/38 tests passing.

## Completed This Session
- Bug #1: config.create double-path for local targets (commit 743b6e5)
- Bug #2: .backup.env synced to target — added --exclude
- Bug #3: sed escaping with | delimiter
- Phase 2: config.create completion + config.repair method
- config.disable / config.enable with here support
- backup.run.mv (secureMove shortcut)
- Strategy dispatch: full (--delete), incremental (no --delete), secureMove, replaceByFolderLinks
- strategy.help method
- backup.list shows active config
