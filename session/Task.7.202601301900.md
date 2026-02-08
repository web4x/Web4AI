# Task 7 — Disk Space Recovery via PI400 Backup

**Created**: 2026-01-30T19:00Z
**Status**: DONE
**Requested by**: User (via Father agent)

## Original Prompt (verbatim)

> use the disk oosh script as task 7 and check tha available disk space. big folders are the pictures folder. this is the oosh prompt line for the backup location [oosh PI400] pi@pi400:/media/pi/myData/Devices/MacStudio.native. create a backup configuration in the large directories, that backup to the correct location on the PI. then give me a summary of folders that can free 64gb when movet to the PI. add also a method that checks if the folder is fully synced and give then an interactive question to remove the local folder after sync was successfuly confirmed.

## Disk Space Analysis

**Current Status**: 99% full, only **7.7GB free** on 460GB drive

### Large Directories Summary

| Directory | Size | Backup Priority | Notes |
|-----------|------|-----------------|-------|
| `/Users/Shared/home.donges.it` | **82G** | HIGH | Personal archive - `tmp` 13G, `Companies` 52G |
| `/Users/Shared/box.ceruleancircle.com` | **65G** | HIGH | Company archive - can sync to PI |
| `/Users/donges/Library` | 31G | SKIP | System managed (Caches 12G, App Support 11G) |
| `/Users/Shared/dev` | 14G | MEDIUM | Development files |
| `/Users/Shared/box.donges.it` | 9.5G | MEDIUM | Personal box |
| `/Users/Shared/EAMD.ucp` | 7G | LOW | Active project? |

### Candidates to Free 64GB

**Option A** — Single large folder:
- `/Users/Shared/home.donges.it` (82G) → frees 82G ✓

**Option B** — Company archive:
- `/Users/Shared/box.ceruleancircle.com` (65G) → frees 65G ✓

**Option C** — Combined smaller folders:
- `/Users/Shared/box.donges.it` (9.5G)
- `/Users/Shared/dev` (14G)
- `/Users/Shared/home.donges.it/tmp` (13G)
- → Total: ~36.5G (not enough alone)

## Backup Target

```
Host: pi@pi400
Path: /media/pi/myData/Devices/MacStudio.native
```

SSH-based rsync to Raspberry Pi 400 NAS.

## Implementation Plan

### 1. Create .backup.env files in target directories

```bash
# /Users/Shared/home.donges.it/.backup.env
export BACKUP_SOURCE="/Users/Shared/home.donges.it"
export BACKUP_TARGET="pi@pi400:/media/pi/myData/Devices/MacStudio.native/home.donges.it"
export BACKUP_STRATEGY="full"

# /Users/Shared/box.ceruleancircle.com/.backup.env  
export BACKUP_SOURCE="/Users/Shared/box.ceruleancircle.com"
export BACKUP_TARGET="pi@pi400:/media/pi/myData/Devices/MacStudio.native/box.ceruleancircle.com"
export BACKUP_STRATEGY="full"
```

### 2. Add `backup.sync.and.remove` method

New method that:
1. Runs rsync to backup target
2. Runs diff to verify sync is complete
3. Prompts user interactively to remove local folder
4. Removes local folder only after confirmation

### 3. Add `backup.verify.sync` method

Compares local folder to backup target and reports differences.

## Files to Modify

| File | Change |
|------|--------|
| `backup` | Add `backup.verify.sync`, `backup.sync.and.remove` methods |
| `/Users/Shared/home.donges.it/.backup.env` | Create with PI400 target |
| `/Users/Shared/box.ceruleancircle.com/.backup.env` | Create with PI400 target |
| `/Users/Shared/box.donges.it/.backup.env` | Create with PI400 target |

## Acceptance Criteria

- [x] .backup.env created in each large directory
- [x] `backup verify.sync` compares local to remote
- [x] `backup sync.and.remove` syncs, verifies, and prompts for removal
- [x] Interactive confirmation before any deletion
- [x] Works with SSH-based rsync targets

## Implementation Complete

### Created .backup.env files:
- `/Users/Shared/home.donges.it/.backup.env` → PI400
- `/Users/Shared/box.ceruleancircle.com/.backup.env` → PI400
- `/Users/Shared/box.donges.it/.backup.env` → PI400

### New backup methods:
- `backup.verify.sync` - uses rsync dry-run to check differences
- `backup.sync.and.remove` - full workflow with interactive confirmation
