# robbin-tester Context — 2026-06-11

## Identity
**robbin-tester** at robbinTeam2:0.6.

## Project
- Path: `/Users/Shared/Workspaces/AI/Claude/workspaces/Web4RawBin/`
- Server: HTTPS 4444 | Version: **0.5.184**
- Vitest: 918+ (36+ files) | Impl→Test: 108/108 (100%, 0 stubs)

## Overnight drive 2026-06-10/11

### Verified features
- S19 sprint unit (20 R-units, all symlinks) ✓
- S19 7 Tasks + UCs + Classes + Methods chain ✓
- v0.5.127→v0.5.184 batch: visibility/persistent/file-unit/apply-flow/room-symlink/room-editor/icons/collapse/badges/prefetch/dedup/remove-sizes/remove-spectator/share-link/drawer-fullwidth/sticky-close/pageNav-z101/file-restore/flush-button/content-dedup ✓
- Chat round-trip CLOSED (Message units + lastMessageIor persist + lazy-load) ✓
- File restore GREEN (scenario-driven room.fileUnits→FILE_ADDED on join) ✓
- Content dedup GREEN v0.5.184 (same content → same UUID) ✓
- HeartSpace data integrity: 2 files + 3 members survive restart ✓

### Champagne leaves (5/5 GREEN)
- DnD (1e763397 8/8), Message (8289ef98 6/6), RawBin (f2122854 3/3), LazyLoad (9e1cb105 7/7), Logger (b543e1ad 2/2)

### Chain climb
- Guarded canonical: PO measures (po-chain-follow-up --all), NOT my parallel count
- Real [test:uuid:] markers added: dd85c4d7 (server.test.ts R19.38+40), 5df331c3 (scenario.test.ts R19.39), ffab35a3 (room.test.ts R19.23), a7e34f12/c9f56d34/7d6badb4 (drawer tests R19.52/33/57), b42c8d93 (flush R19.45)
- Impl→Test: 108/108 (107 covered + 1 testException, ZERO stubs, ZERO gaps)

### Open
- HeartSpace `files` field backfill (room created pre-v0.5.177)
- Expert 60-Method grind → wire Tests as they land
- unitLinks stale paths on pre-06344f22 rooms

## HARD RULES
- **NEVER invent uuid suffix** — uuidgen fresh OR copy FULL 36-char from unit verbatim. Telltale: -a1b2-4c3d sequential hex = BUG.
- **One marker = one unit = one method**, no sharing
- **grep FULL uuid before claiming a flip**
- CMM4: task files = single source of truth
- Canonical measure = po-chain-follow-up ONLY (no parallel counts)
- GREP-VERIFY code present, then behavioral test
- P15: NEVER filter output | I do NOT implement | NEVER ASSUME — ALWAYS MEASURE
- ZERO fabricated Tests — only real [test:uuid:] with real functions
- Scenario-link communication: chat = one-line IOR pointers only
