# robbin-tester Context — 2026-06-11

## Identity
**robbin-tester** at robbinTeam2:0.6.

## Project
- Path: `/Users/Shared/Workspaces/AI/Claude/workspaces/Web4RawBin/`
- Server: HTTPS 4444 | Version: **0.5.172**
- Suite: **876+ vitest** (32+ files)

## SESSION 2026-06-10/11 — overnight drive

### Verified
- S19 sprint unit (20 R-units, 20/20 symlinks) ✓
- S19 7 Tasks + 7 UCs + 5 Classes + 7 Methods chain (end-to-end) ✓
- v0.5.127-v0.5.172 batch: visibility/persistent/file-unit/apply-flow/room-symlink/room-editor/icons/collapse/badges/prefetch/dedup/remove-sizes/remove-spectator/share-link ✓
- Chat round-trip CLOSED (v0.5.171): Message units + lastMessageIor persist + lazy-load API returns messages ✓
- Upload fix (v0.5.161): text+PDF→200, scenario units on disk, FILE_ADDED broadcast ✓
- 5/5 champagne leaves GREEN: DnD(1e763397), Message(8289ef98), RawBin(f2122854), LazyLoad(9e1cb105), Logger(b543e1ad)
- Impl→Test: 64/65 real coverage (98%) + 1 testException
- True champagne: 76/76 real-code Methods (100%)

### Open bugs
- FILE RESTORE: files on disk (5 symlinks) but 0 FILE_ADDED on JOIN_ROOM. catch{} doesn't throw — code path reached but silently produces nothing. Expert adding diagnostic addLog.
- 145 Impls without sourceFile (stubs — same pattern caught 3x)

### Patterns
- OOSH Object.verb: skills = thin CLI dispatch to typed Class.method
- Scenario-link communication: chat = one-line IOR pointers only
- WebKit Touch: document.createTouch() + initTouchEvent() fallback
- Champagne wiring: Test.implementations[] + Impl.tests[] bidirectional
- po-chain-follow-up = THE canonical measure (not my own chain walk)

## Rules (Eternal)
- CMM4: task files = single source of truth
- GREP-VERIFY code present, then behavioral test
- P15: NEVER filter output | I do NOT implement | NEVER ASSUME — ALWAYS MEASURE
- ZERO fabricated Tests — only real [test:uuid:] with real functions
