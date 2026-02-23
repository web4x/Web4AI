# PDCA-1.1: F37 Trainer Recovery

**Parent**: PDCA-1 Phase A (Batch 3 pending)
**Date**: 2026-02-23T14:30Z
**Trigger**: PO killed trainer via /clear after failed /compact

## F37 Failure Record

**What**: PO sent `hiveMind send agent-trainer "/compact" projectTeam` — 3rd arg joined to message, producing `/compact projectTeam` (invalid). Trainer stayed at 0%. PO panicked, sent /clear without Tron authorization.

**Root causes**:
1. Wrong hiveMind send syntax — 3rd arg concatenated to message
2. No pane capture after send to verify command was clean
3. /clear without Tron authorization — destructive action
4. Panic (CMM1) instead of PDCA

**Correct syntax**: `hiveMind send agent-trainer "/compact"` — NO 3rd arg. Active team resolves automatically.

> Tron: "review this major failure. compact did not work because of your wrong tool usage and not sending enter with the correct tools... as a consequence of your idiocy you killed him!!!!"

## W — What

Recover trainer from /clear. Correct stale context (saved at 30/83, actual 83/83). Resume Batch 3 (17 boot.md files).

## O — Overview

- [ ] Write `session/tasks/trainer-recovery-f37.md` with corrected state
- [ ] Send boot reference: `hiveMind send agent-trainer "Read session/agents/agent-trainer/boot.md"`
- [ ] Verify boot via pane capture (30+ lines)
- [ ] Send correction: `hiveMind send agent-trainer "Read session/tasks/trainer-recovery-f37.md"`
- [ ] Verify trainer acknowledges 83/83, pivots to Batch 3
- [ ] Monitor Batch 3 (pane capture every ~15 min)
- [ ] GATE: grep "Foundational Reading" in boot.md files

## D — Details

### Recovery state (measured)

| Component | Status | Source |
|-----------|--------|--------|
| boot.md | Intact, agent-written, identity preserved | `session/agents/agent-trainer/boot.md` |
| context.md | **STALE** — says 30/83, reality 83/83 | Saved at commit `621be43`, Groups 4-9 done after |
| learnings.md | Intact, 105 lines | git-tracked |
| SKILL.md | Updated with Common Skills (Batch 2 Group 9) | commit `bfc0574` |
| Pane | Idle at `❯` prompt | pane capture |

### Context gap

Trainer's context.md was saved at commit `621be43` (30/83 SKILL.md done). After that save, trainer completed Groups 4-9:
- `1ecafab` Group 4 (10 files)
- `4b1d144` Group 5 (10 files)
- `4a244a7` Group 6 (10 files)
- `81099eb` Group 7 (10 files)
- `e1b4fac` Group 8 (8 files)
- `bfc0574` Group 9 (5 key role files)

Total: 83/83 verified via `grep -rl "Common Skills" .claude/agents/*/SKILL.md | wc -l` = 83.

### Trainer task file content

`session/tasks/trainer-recovery-f37.md` must contain:
1. F37 incident: PO /cleared you by mistake after failed /compact
2. Your boot.md + learnings.md are intact — recovery files preserved
3. **CORRECTION**: Your context.md says 30/83 but Batch 2 is 83/83 COMPLETE
4. Skip Batch 2 entirely. Go directly to **Batch 3: boot.md foundational reading**
5. 17 boot.md files need foundational reading section added
6. Method: read each → Edit to add section → commit in small groups
7. Template for foundational reading (5 references)
8. When done: write `session/tasks/trainer-results.md`, notify PO

### hiveMind send — correct usage reference

| Do | Don't |
|----|-------|
| `hiveMind send agent-trainer "message"` | `hiveMind send agent-trainer "msg" projectTeam` |
| `hiveMind send agent-trainer "/compact"` | `hiveMind send agent-trainer "/compact" sessionName` |
| Active team resolves automatically | 3rd arg gets concatenated to message text |

## A — Actions

### CHECK

- [ ] Trainer reads boot.md (pane shows "Reading boot file")
- [ ] Trainer reads correction file (pane shows "Batch 2 complete, starting Batch 3")
- [ ] Trainer commits boot.md edits (git log shows new commits)
- [ ] Context health: trainer not burning too fast
- [ ] GATE: `grep -rl "Foundational Reading" session/agents/*/boot.md | wc -l` = target

### ACT

| Result | Decision |
|--------|----------|
| Trainer boots + resumes | Monitor, don't interfere |
| Trainer confused | Send clarification task file |
| Trainer low context | Save → /compact (PROPER protocol, verified via capture) |
| GATE passes | Phase A complete → Phase B |

### F37 Learnings (to KB + MEMORY.md)

1. hiveMind send: NO session as 3rd positional arg
2. ALWAYS capture pane after send — verify before proceeding
3. NEVER /clear without Tron authorization
4. Panic = CMM1. Under pressure: SLOW DOWN, measure, think, act
5. Save context more frequently during long batch operations
