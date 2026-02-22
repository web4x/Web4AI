# Compact/Boot Lifecycle — Operational Guide

*Execution checklist for the agent-trainer (or any peer) managing compacts.*

For theory and background, see: [Compaction and Recovery](compaction-recovery.md) (covers "42" principle, self-care timing, boot file rules, context measurement).

## When to Compact (Self-Care Thresholds)

See [compaction-recovery.md — Self-Care Timing](compaction-recovery.md#self-care-timing-save-before-the-warning-f31) for the full table. Summary:

| Context % | Action |
|-----------|--------|
| 50% | Note burn rate |
| 35% | Agent saves context.md + boot.md |
| 25% | Final save, prepare for compact |
| 15% | Compact NOW |
| 6% | CRITICAL — compact immediately |
| 0% | /clear only (context loss accepted). NEVER /clear above 0%. |

## Pre-Compact Verification (GATE: measure before acting)

Before sending /compact, verify these files exist and are current:

| File | Check |
|------|-------|
| `context.md` | Reflects agent's CURRENT state (not stale from hours ago) |
| `learnings.md` | Present with accumulated patterns |
| `boot.md` | "Written by [role]" on line 2 = safe. "Auto-generated" = generic fallback — may need writing. |
| `git status` | No uncommitted work in agent's working directory. Uncommitted = lost. |

If boot.md is missing or generic: write one for the agent. See `session/agents/product-owner/boot.md` or `session/agents/oosh-expert/boot.md` as examples. Include: role, pane, goal, immediate actions, reading list, rules.

## Execution Sequence

```
1. Capture pane (30+ lines) — verify agent is idle or at prompt
2. If working: send "Save your context and run /compact NOW"
   If idle: proceed to step 3
3. Send /compact:
     otmux send <pane> C-u        # clear any garbled text
     otmux send <pane> "/compact" Enter
4. Wait 15-20 seconds
5. Capture pane (30+ lines) — verify compact completed
6. Pre-compact hook runs: auto-commit, boot file check, resume prompt
7. Auto-resume sends boot file reference after ~15s
8. If boot prompt stuck at prompt (not submitted): send Enter
     otmux send <pane> "" Enter
9. Capture pane again — verify agent is reading boot files
```

## Post-Compact Recovery Verification

After compact, capture the pane and verify:
- Agent reads boot.md, context.md, learnings.md
- Agent knows: who it is (role), where it is (pane), what it completed, what's next
- Agent has correct goal from boot.md
- If confused or missing identity: send them to read their context.md

## The Enter Key Problem

`hiveMind send <role> "<text>" Enter` sometimes sends "Enter" as literal text instead of a keypress. This is a known recurring incident (see [recurring-incidents.md](recurring-incidents.md) INC-001).

**Reliable method**: Use `otmux send` with Enter as a SEPARATE unquoted argument:
```bash
otmux send <pane> "/compact" Enter    # Enter is SEPARATE argument
```

**If prompt has garbled text**: Clear first with `C-u`:
```bash
otmux send <pane> C-u                 # clear garbled text
otmux send <pane> "/compact" Enter    # then send clean command
```

**Always verify submission**: Capture 10+ lines after sending. Empty `>` + "esc to interrupt" = processing. Message text at `>` = NOT submitted.

## Boot File Rules

See [compaction-recovery.md — Boot File Rules](compaction-recovery.md#boot-file-rules-f30--feb-21) for full rules. Key points:
- One file: `boot.md`. Never create variant names.
- "Written by [role]" on line 2 tells the hook NOT to overwrite.
- Boot must include foundational reading (context, learnings, KB).
- Pre-compress hook respects recent boot.md (<120s).

## Who Does This

The **agent-trainer** is primary responsible for compact lifecycle management ("self-care = team care"). The **scrum-master** monitors context % and triggers the trainer when agents need compacts. Any peer can execute a compact in an emergency.

## Source

First practiced 2026-02-22 by agent-trainer on oosh-expert at 6% context. PO corrections applied (accurate attribution, otmux > hiveMind for Enter keys).
